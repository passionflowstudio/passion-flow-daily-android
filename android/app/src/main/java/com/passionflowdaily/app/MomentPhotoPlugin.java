package com.passionflowdaily.app;

import android.content.ActivityNotFoundException;
import android.content.ClipData;
import android.content.ContentResolver;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.media.ExifInterface;
import android.net.Uri;
import android.provider.MediaStore;
import android.provider.OpenableColumns;
import android.util.Base64;
import android.util.Log;

import androidx.activity.result.ActivityResult;
import androidx.activity.result.PickVisualMediaRequest;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.core.content.FileProvider;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * "Remember this moment": pick a photo (system Photo Picker) or take one (camera app),
 * then shrink it on the device before anything is uploaded.
 *
 * No storage, media or camera permission is needed: the Photo Picker grants access to the
 * one photo the person picks, and the camera app writes into a file we hand it through
 * FileProvider. The app does not declare CAMERA, so ACTION_IMAGE_CAPTURE needs no prompt.
 *
 * Returns JPEG bytes as base64: a photo (long edge at most 1600 px, quality 80) and a
 * preview (long edge at most 480 px, quality 75). EXIF orientation is applied to the
 * pixels, and re-encoding drops all other metadata (including location).
 */
@CapacitorPlugin(name = "PfdMoments")
public class MomentPhotoPlugin extends Plugin {

    private static final String TAG = "PfdMoments";
    private static final int PHOTO_EDGE = 1600;
    private static final int PHOTO_QUALITY = 80;
    private static final int THUMB_EDGE = 480;
    private static final int THUMB_QUALITY = 75;
    private static final String TEMP_DIR = "moments";
    // Firebase uploads anything over 256 KB in several round trips; under it, in one request.
    // Photos aim to stay just under, so saving is fast.
    private static final int ONE_REQUEST_BYTES = 245 * 1024;

    private final ExecutorService worker = Executors.newSingleThreadExecutor();
    private final ExecutorService network = Executors.newFixedThreadPool(3);
    private static final int FETCH_MAX_BYTES = 6 * 1024 * 1024;
    private File pendingCapture;

    @Override
    public void load() {
        // Temporary camera files never outlive the session that made them.
        clearTempDir();
    }

    // ── Choose from Library ────────────────────────────────────────────────────

    @PluginMethod
    public void pickPhoto(PluginCall call) {
        try {
            PickVisualMediaRequest request = new PickVisualMediaRequest.Builder()
                .setMediaType(ActivityResultContracts.PickVisualMedia.ImageOnly.INSTANCE)
                .build();
            Intent intent = new ActivityResultContracts.PickVisualMedia().createIntent(getContext(), request);
            startActivityForResult(call, intent, "onPickResult");
        } catch (ActivityNotFoundException e) {
            call.reject("NO_PICKER", e);
        } catch (Exception e) {
            call.reject("PICK_FAILED", e);
        }
    }

    @ActivityCallback
    private void onPickResult(PluginCall call, ActivityResult result) {
        if (call == null) return;
        Uri uri = new ActivityResultContracts.PickVisualMedia().parseResult(result.getResultCode(), result.getData());
        if (uri == null) { call.reject("CANCELLED"); return; }
        processAsync(call, uri, null);
    }

    // ── Take Photo ─────────────────────────────────────────────────────────────

    @PluginMethod
    public void takePhoto(PluginCall call) {
        try {
            File dir = tempDir();
            pendingCapture = new File(dir, "capture_" + System.currentTimeMillis() + ".jpg");
            Uri out = FileProvider.getUriForFile(getContext(), getContext().getPackageName() + ".fileprovider", pendingCapture);
            Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
            intent.putExtra(MediaStore.EXTRA_OUTPUT, out);
            intent.setClipData(ClipData.newRawUri("", out));
            intent.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION | Intent.FLAG_GRANT_READ_URI_PERMISSION);
            startActivityForResult(call, intent, "onCaptureResult");
        } catch (ActivityNotFoundException e) {
            deletePendingCapture();
            call.reject("NO_CAMERA", e);
        } catch (Exception e) {
            deletePendingCapture();
            call.reject("CAMERA_FAILED", e);
        }
    }

    @ActivityCallback
    private void onCaptureResult(PluginCall call, ActivityResult result) {
        if (call == null) return;
        File captured = pendingCapture;
        pendingCapture = null;
        if (result.getResultCode() != android.app.Activity.RESULT_OK || captured == null || !captured.exists() || captured.length() == 0) {
            if (captured != null) captured.delete();
            call.reject("CANCELLED");
            return;
        }
        processAsync(call, Uri.fromFile(captured), captured);
    }

    /** Debug builds only: shrink a file already in the app's cache (for testing huge or rotated photos). */
    @PluginMethod
    public void debugProcessCacheFile(PluginCall call) {
        boolean debuggable = (getContext().getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0;
        if (!debuggable) { call.reject("UNAVAILABLE"); return; }
        String name = call.getString("name");
        if (name == null || name.contains("/")) { call.reject("BAD_NAME"); return; }
        File f = new File(getContext().getCacheDir(), name);
        if (!f.exists()) { call.reject("NOT_FOUND"); return; }
        processAsync(call, Uri.fromFile(f), null);
    }

    // ── Share card ─────────────────────────────────────────────────────────────

    /**
     * Downloads one of the person's own moment photos so the share card can draw it.
     * The WebView can't read pixels from another origin without bucket CORS setup, so the
     * bytes come through here instead. Only Firebase Storage links are accepted.
     */
    @PluginMethod
    public void fetchImage(PluginCall call) {
        String url = call.getString("url");
        if (url == null || !url.startsWith("https://firebasestorage.googleapis.com/")) {
            call.reject("BAD_URL");
            return;
        }
        network.execute(() -> {
            HttpURLConnection conn = null;
            try {
                conn = (HttpURLConnection) new URL(url).openConnection();
                conn.setConnectTimeout(15000);
                conn.setReadTimeout(20000);
                // Only the allowed host: don't follow redirects elsewhere.
                conn.setInstanceFollowRedirects(false);
                int code = conn.getResponseCode();
                if (code != 200) { call.reject("HTTP_" + code); return; }
                String type = conn.getContentType();
                if (type == null || !type.startsWith("image/")) { call.reject("NOT_AN_IMAGE"); return; }
                ByteArrayOutputStream out = new ByteArrayOutputStream();
                byte[] buf = new byte[16384];
                int n, total = 0;
                try (InputStream in = conn.getInputStream()) {
                    while ((n = in.read(buf)) > 0) {
                        total += n;
                        if (total > FETCH_MAX_BYTES) { call.reject("TOO_LARGE"); return; }
                        out.write(buf, 0, n);
                    }
                }
                JSObject ret = new JSObject();
                ret.put("base64", Base64.encodeToString(out.toByteArray(), Base64.NO_WRAP));
                ret.put("contentType", type.split(";")[0].trim());
                call.resolve(ret);
            } catch (Exception e) {
                call.reject("FETCH_FAILED", e);
            } finally {
                if (conn != null) conn.disconnect();
            }
        });
    }

    // ── Shrink on the device ───────────────────────────────────────────────────

    private void processAsync(PluginCall call, Uri uri, File deleteAfter) {
        worker.execute(() -> {
            try {
                call.resolve(process(uri));
            } catch (OutOfMemoryError e) {
                call.reject("TOO_LARGE");
            } catch (Exception e) {
                Log.w(TAG, "process failed", e);
                call.reject("PROCESS_FAILED", e);
            } finally {
                if (deleteAfter != null) deleteAfter.delete();
            }
        });
    }

    private JSObject process(Uri uri) throws Exception {
        ContentResolver cr = getContext().getContentResolver();

        BitmapFactory.Options bounds = new BitmapFactory.Options();
        bounds.inJustDecodeBounds = true;
        try (InputStream in = cr.openInputStream(uri)) {
            BitmapFactory.decodeStream(in, null, bounds);
        }
        if (bounds.outWidth <= 0 || bounds.outHeight <= 0) throw new Exception("NOT_AN_IMAGE");

        // Decode at the smallest power-of-two size that is still at least PHOTO_EDGE,
        // so a 50 MP photo never sits in memory at full size.
        int longEdge = Math.max(bounds.outWidth, bounds.outHeight);
        int sample = 1;
        while (longEdge / (sample * 2) >= PHOTO_EDGE) sample *= 2;
        BitmapFactory.Options opts = new BitmapFactory.Options();
        opts.inSampleSize = sample;
        Bitmap decoded;
        try (InputStream in = cr.openInputStream(uri)) {
            decoded = BitmapFactory.decodeStream(in, null, opts);
        }
        if (decoded == null) throw new Exception("DECODE_FAILED");

        int orientation = readOrientation(cr, uri);
        Bitmap photo = fit(decoded, PHOTO_EDGE, orientation);
        if (photo != decoded) decoded.recycle();
        byte[] photoJpeg = jpeg(photo, PHOTO_QUALITY);
        // Very detailed photos: a slightly lower quality, then a slightly smaller size, until it
        // fits in a single upload request. Still sharp on a phone screen.
        if (photoJpeg.length > ONE_REQUEST_BYTES) photoJpeg = jpeg(photo, 72);
        if (photoJpeg.length > ONE_REQUEST_BYTES) {
            Bitmap smaller = fit(photo, 1280, ExifInterface.ORIENTATION_NORMAL);
            byte[] small = jpeg(smaller, 74);
            if (small.length < photoJpeg.length) {
                photoJpeg = small;
                if (smaller != photo) { photo.recycle(); photo = smaller; }
            } else if (smaller != photo) {
                smaller.recycle();
            }
        }

        Bitmap thumb = fit(photo, THUMB_EDGE, ExifInterface.ORIENTATION_NORMAL);
        byte[] thumbJpeg = jpeg(thumb, THUMB_QUALITY);

        JSObject ret = new JSObject();
        ret.put("photoBase64", Base64.encodeToString(photoJpeg, Base64.NO_WRAP));
        ret.put("thumbBase64", Base64.encodeToString(thumbJpeg, Base64.NO_WRAP));
        ret.put("width", photo.getWidth());
        ret.put("height", photo.getHeight());
        ret.put("photoBytes", photoJpeg.length);
        ret.put("thumbBytes", thumbJpeg.length);
        ret.put("originalWidth", bounds.outWidth);
        ret.put("originalHeight", bounds.outHeight);
        ret.put("originalBytes", originalSize(cr, uri));
        if (thumb != photo) thumb.recycle();
        photo.recycle();
        return ret;
    }

    /** Scales down (never up) so the long edge is at most maxEdge, and applies EXIF orientation. */
    private static Bitmap fit(Bitmap src, int maxEdge, int orientation) {
        int w = src.getWidth(), h = src.getHeight();
        float scale = Math.min(1f, (float) maxEdge / Math.max(w, h));
        Matrix m = new Matrix();
        m.postScale(scale, scale);
        switch (orientation) {
            case ExifInterface.ORIENTATION_ROTATE_90: m.postRotate(90); break;
            case ExifInterface.ORIENTATION_ROTATE_180: m.postRotate(180); break;
            case ExifInterface.ORIENTATION_ROTATE_270: m.postRotate(270); break;
            case ExifInterface.ORIENTATION_FLIP_HORIZONTAL: m.postScale(-1, 1); break;
            case ExifInterface.ORIENTATION_FLIP_VERTICAL: m.postScale(1, -1); break;
            case ExifInterface.ORIENTATION_TRANSPOSE: m.postRotate(90); m.postScale(-1, 1); break;
            case ExifInterface.ORIENTATION_TRANSVERSE: m.postRotate(270); m.postScale(-1, 1); break;
            default: break;
        }
        if (scale >= 1f && m.isIdentity()) return src;
        return Bitmap.createBitmap(src, 0, 0, w, h, m, true);
    }

    private static byte[] jpeg(Bitmap bmp, int quality) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        bmp.compress(Bitmap.CompressFormat.JPEG, quality, out);
        return out.toByteArray();
    }

    private static int readOrientation(ContentResolver cr, Uri uri) {
        try (InputStream in = cr.openInputStream(uri)) {
            if (in == null) return ExifInterface.ORIENTATION_NORMAL;
            return new ExifInterface(in).getAttributeInt(ExifInterface.TAG_ORIENTATION, ExifInterface.ORIENTATION_NORMAL);
        } catch (Exception e) {
            return ExifInterface.ORIENTATION_NORMAL;
        }
    }

    private long originalSize(ContentResolver cr, Uri uri) {
        if ("file".equals(uri.getScheme()) && uri.getPath() != null) return new File(uri.getPath()).length();
        try (Cursor c = cr.query(uri, new String[]{OpenableColumns.SIZE}, null, null, null)) {
            if (c != null && c.moveToFirst() && !c.isNull(0)) return c.getLong(0);
        } catch (Exception ignored) { }
        return -1;
    }

    // ── Temporary files ────────────────────────────────────────────────────────

    private File tempDir() {
        File dir = new File(getContext().getCacheDir(), TEMP_DIR);
        if (!dir.exists()) dir.mkdirs();
        return dir;
    }

    private void clearTempDir() {
        File dir = new File(getContext().getCacheDir(), TEMP_DIR);
        File[] files = dir.listFiles();
        if (files == null) return;
        for (File f : files) f.delete();
    }

    private void deletePendingCapture() {
        if (pendingCapture != null) pendingCapture.delete();
        pendingCapture = null;
    }
}
