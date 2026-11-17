package com.pseudotypist.tabu;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(TabuBarsPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
