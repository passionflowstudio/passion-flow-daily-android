package com.passionflowdaily.app;

import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.MediaStore;
import android.util.Base64;

import androidx.core.content.FileProvider;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;

/** Android only: save the day card to Photos and open the system share sheet. */
@CapacitorPlugin(name = "PfdImage")
public class ImageSharePlugin extends Plugin {

    private static byte[] decode(String base64) {
        if (base64 == null) return null;
        int comma = base64.indexOf(',');
        if (base64.startsWith("data:") && comma > 0) base64 = base64.substring(comma + 1);
        return Base64.decode(base64, Base64.DEFAULT);
    }

    @PluginMethod
    public void saveImage(PluginCall call) {
        byte[] bytes = decode(call.getString("base64"));
        if (bytes == null) { call.reject("NO_IMAGE"); return; }
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) { call.reject("UNSUPPORTED"); return; }
        String name = call.getString("fileName", "passion-flow-day.png");
        try {
            ContentResolver resolver = getContext().getContentResolver();
            ContentValues values = new ContentValues();
            values.put(MediaStore.Images.Media.DISPLAY_NAME, System.currentTimeMillis() + "-" + name);
            values.put(MediaStore.Images.Media.MIME_TYPE, "image/png");
            values.put(MediaStore.Images.Media.RELATIVE_PATH, "Pictures/Passion Flow Daily");
            values.put(MediaStore.Images.Media.IS_PENDING, 1);
            Uri uri = resolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);
            if (uri == null) { call.reject("SAVE_FAILED"); return; }
            try (OutputStream out = resolver.openOutputStream(uri)) {
                if (out == null) { call.reject("SAVE_FAILED"); return; }
                out.write(bytes);
            }
            values.clear();
            values.put(MediaStore.Images.Media.IS_PENDING, 0);
            resolver.update(uri, values, null, null);
            call.resolve();
        } catch (Exception e) {
            call.reject("SAVE_FAILED", e);
        }
    }

    @PluginMethod
    public void share(PluginCall call) {
        String text = call.getString("text", "");
        String title = call.getString("title", "Share");
        byte[] bytes = decode(call.getString("base64"));
        try {
            Intent send = new Intent(Intent.ACTION_SEND);
            if (bytes != null) {
                File dir = new File(getContext().getCacheDir(), "share");
                if (!dir.exists()) dir.mkdirs();
                File file = new File(dir, call.getString("fileName", "passion-flow-day.png"));
                try (FileOutputStream out = new FileOutputStream(file)) { out.write(bytes); }
                Uri uri = FileProvider.getUriForFile(getContext(), getContext().getPackageName() + ".fileprovider", file);
                send.setType("image/png");
                send.putExtra(Intent.EXTRA_STREAM, uri);
                send.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            } else {
                send.setType("text/plain");
            }
            if (text != null && !text.isEmpty()) send.putExtra(Intent.EXTRA_TEXT, text);
            Intent chooser = Intent.createChooser(send, title);
            chooser.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            getActivity().startActivity(chooser);
            JSObject ret = new JSObject();
            ret.put("opened", true);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("SHARE_FAILED", e);
        }
    }
}
