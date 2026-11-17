package com.pseudotypist.tabu;

import android.graphics.Color;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Paints the strips around the web view. On Android WebView versions before 140, Capacitor
 * keeps the page out from under the status and navigation bars by padding the window, and
 * since Android 15 the bars themselves are transparent, so those strips show this colour.
 * Newer WebViews draw the page edge-to-edge and the strips are not visible.
 * Called from tabu/native.js as TabuNative.statusBar(hex, lightText).
 */
@CapacitorPlugin(name = "TabuBars")
public class TabuBarsPlugin extends Plugin {

    @PluginMethod
    public void setColor(PluginCall call) {
        String hex = call.getString("color");
        final int color;
        try {
            color = Color.parseColor(hex);
        } catch (Exception e) {
            call.reject("Invalid colour: " + hex);
            return;
        }
        getActivity().runOnUiThread(() -> {
            getActivity().getWindow().getDecorView().setBackgroundColor(color);
            call.resolve(new JSObject().put("color", hex));
        });
    }
}
