package com.passionflowdaily.app;

import android.os.CancellationSignal;
import android.util.Base64;
import android.util.Log;

import androidx.core.content.ContextCompat;
import androidx.credentials.ClearCredentialStateRequest;
import androidx.credentials.Credential;
import androidx.credentials.CredentialManager;
import androidx.credentials.CredentialManagerCallback;
import androidx.credentials.CustomCredential;
import androidx.credentials.GetCredentialRequest;
import androidx.credentials.GetCredentialResponse;
import androidx.credentials.exceptions.ClearCredentialException;
import androidx.credentials.exceptions.GetCredentialCancellationException;
import androidx.credentials.exceptions.GetCredentialException;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.libraries.identity.googleid.GetSignInWithGoogleOption;
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential;

import java.security.SecureRandom;

@CapacitorPlugin(name = "GoogleAuth")
public class GoogleAuthPlugin extends Plugin {
    private static final String TAG = "PFDGoogleAuth";
    private CredentialManager credentialManager;

    @Override
    public void load() {
        credentialManager = CredentialManager.create(getContext());
    }

    @PluginMethod
    public void signIn(final PluginCall call) {
        String webClientId = getDefaultWebClientId();
        if (webClientId == null || webClientId.length() == 0) {
            call.reject("Google Sign-In is missing default_web_client_id");
            return;
        }

        GetSignInWithGoogleOption googleOption = new GetSignInWithGoogleOption.Builder(webClientId)
            .setNonce(createNonce())
            .build();
        GetCredentialRequest request = new GetCredentialRequest.Builder()
            .addCredentialOption(googleOption)
            .build();

        credentialManager.getCredentialAsync(
            getActivity(),
            request,
            new CancellationSignal(),
            ContextCompat.getMainExecutor(getContext()),
            new CredentialManagerCallback<GetCredentialResponse, GetCredentialException>() {
                @Override
                public void onResult(GetCredentialResponse result) {
                    handleCredentialResult(call, result);
                }

                @Override
                public void onError(GetCredentialException e) {
                    if (e instanceof GetCredentialCancellationException) {
                        call.reject("CANCELED", "CANCELED");
                    } else {
                        Log.w(TAG, "Google credential request failed", e);
                        call.reject(e.getMessage() != null ? e.getMessage() : "Google Sign-In failed", e.getClass().getSimpleName());
                    }
                }
            }
        );
    }

    @PluginMethod
    public void signOut(final PluginCall call) {
        credentialManager.clearCredentialStateAsync(
            new ClearCredentialStateRequest(),
            null,
            ContextCompat.getMainExecutor(getContext()),
            new CredentialManagerCallback<Void, ClearCredentialException>() {
                @Override
                public void onResult(Void result) {
                    call.resolve();
                }

                @Override
                public void onError(ClearCredentialException e) {
                    Log.w(TAG, "Google credential state clear failed", e);
                    call.reject(e.getMessage() != null ? e.getMessage() : "Google credential sign-out failed", e.getClass().getSimpleName());
                }
            }
        );
    }

    private void handleCredentialResult(PluginCall call, GetCredentialResponse result) {
        Credential credential = result.getCredential();
        if (!(credential instanceof CustomCredential)
            || !GoogleIdTokenCredential.TYPE_GOOGLE_ID_TOKEN_CREDENTIAL.equals(credential.getType())) {
            call.reject("Google Sign-In did not return a Google ID token");
            return;
        }

        try {
            GoogleIdTokenCredential googleCredential =
                GoogleIdTokenCredential.createFrom(((CustomCredential) credential).getData());
            String idToken = googleCredential.getIdToken();
            if (idToken == null || idToken.length() == 0) {
                call.reject("Google Sign-In returned an empty ID token");
                return;
            }

            JSObject ret = new JSObject();
            ret.put("idToken", idToken);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Could not parse Google ID token", e);
        }
    }

    private String getDefaultWebClientId() {
        int resId = getContext().getResources().getIdentifier(
            "default_web_client_id",
            "string",
            getContext().getPackageName()
        );
        return resId == 0 ? null : getContext().getString(resId);
    }

    private String createNonce() {
        byte[] bytes = new byte[32];
        new SecureRandom().nextBytes(bytes);
        return Base64.encodeToString(bytes, Base64.URL_SAFE | Base64.NO_WRAP | Base64.NO_PADDING);
    }
}
