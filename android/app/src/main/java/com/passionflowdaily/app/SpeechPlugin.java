package com.passionflowdaily.app;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.speech.RecognizerIntent;

import androidx.activity.result.ActivityResult;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.ArrayList;

/**
 * Voice memo: Android's own "Speak now" voice typing. Returns only the text.
 * No audio is recorded or kept, and the app needs no microphone permission: the system
 * speech service (usually Google's app) handles the mic itself.
 */
@CapacitorPlugin(name = "PfdSpeech")
public class SpeechPlugin extends Plugin {

    @PluginMethod
    public void listen(PluginCall call) {
        try {
            Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
            intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1);
            String prompt = call.getString("prompt");
            if (prompt != null) intent.putExtra(RecognizerIntent.EXTRA_PROMPT, prompt);
            startActivityForResult(call, intent, "onSpeechResult");
        } catch (ActivityNotFoundException e) {
            call.reject("NO_SPEECH", e);
        } catch (Exception e) {
            call.reject("SPEECH_FAILED", e);
        }
    }

    @ActivityCallback
    private void onSpeechResult(PluginCall call, ActivityResult result) {
        if (call == null) return;
        Intent data = result.getData();
        if (result.getResultCode() != Activity.RESULT_OK || data == null) {
            call.reject("CANCELLED");
            return;
        }
        ArrayList<String> matches = data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS);
        if (matches == null || matches.isEmpty() || matches.get(0) == null || matches.get(0).trim().isEmpty()) {
            call.reject("NO_MATCH");
            return;
        }
        JSObject ret = new JSObject();
        ret.put("text", matches.get(0).trim());
        call.resolve(ret);
    }
}
