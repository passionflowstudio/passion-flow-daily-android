package com.passionflowdaily.app;

import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebView;

import androidx.activity.OnBackPressedCallback;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(GoogleAuthPlugin.class);
        registerPlugin(ImageSharePlugin.class);
        registerPlugin(MomentPhotoPlugin.class);
        registerPlugin(SpeechPlugin.class);
        super.onCreate(savedInstanceState);

        // Android 15+ draws apps edge to edge, and Android WebView reports
        // env(safe-area-inset-*) as 0, so the page would slide under the status
        // bar and the navigation bar. Pad the content view by the real insets so
        // the app's own header and tab bar always stay clear of the system bars.
        final View contentView = findViewById(android.R.id.content);
        if (contentView != null) {
            contentView.setBackgroundColor(Color.parseColor("#FAF6F2"));
            ViewCompat.setOnApplyWindowInsetsListener(contentView, (view, windowInsets) -> {
                Insets bars = windowInsets.getInsets(
                    WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout()
                );
                // Android 15+ stops resizing the window for the keyboard, and the insets
                // are consumed below, so Capacitor's own keyboard handling never sees it.
                // Shrink the content by the keyboard height here instead: that is what
                // makes the page and its forms scrollable while typing. Older versions
                // still resize the window themselves, so they are left alone.
                int bottom = bars.bottom;
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.VANILLA_ICE_CREAM) {
                    Insets ime = windowInsets.getInsets(WindowInsetsCompat.Type.ime());
                    bottom = Math.max(bottom, ime.bottom);
                }
                view.setPadding(bars.left, bars.top, bars.right, bottom);
                // Consume the insets so the WebView reports env(safe-area-inset-*) as 0.
                // Otherwise Android 15+ WebViews add the bar height a second time on top
                // of the padding above, leaving a large empty strip under the tab bar.
                return WindowInsetsCompat.CONSUMED;
            });
            ViewCompat.requestApplyInsets(contentView);
        }

        // Let the app handle the Android back button first (close pop-ups, leave the
        // login screen). Only fall back to the normal behaviour (leave the app) when
        // the app has nothing to go back to.
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                WebView webView = (getBridge() != null) ? getBridge().getWebView() : null;
                if (webView == null) {
                    fallBack();
                    return;
                }
                webView.evaluateJavascript(
                    "(function(){try{return !!(window.pfdHandleBack&&window.pfdHandleBack());}catch(e){return false;}})()",
                    value -> {
                        if (!"true".equals(value)) {
                            fallBack();
                        }
                    }
                );
            }

            private void fallBack() {
                setEnabled(false);
                getOnBackPressedDispatcher().onBackPressed();
                setEnabled(true);
            }
        });
    }
}
