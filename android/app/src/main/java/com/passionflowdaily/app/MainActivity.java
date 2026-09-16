package com.passionflowdaily.app;

import android.os.Bundle;
import android.webkit.WebView;

import androidx.activity.OnBackPressedCallback;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(GoogleAuthPlugin.class);
        registerPlugin(ImageSharePlugin.class);
        super.onCreate(savedInstanceState);

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
