// Bridge to the native shell (Capacitor) for the Android and iOS apps.
// In a normal browser window.Capacitor is missing, isNative is false and every call does nothing.
// No bundler: plugins are reached through the Capacitor bridge the app injects into the page.
// Every method is safe to call at any time and never throws.
(function () {
  'use strict';
  var C = window.Capacitor;
  var isNative = false;
  try { isNative = !!(C && typeof C.isNativePlatform === 'function' && C.isNativePlatform()); } catch (e) { isNative = false; }
  var platform = 'web';
  try { if (isNative) platform = C.getPlatform(); } catch (e) { /* keep 'web' */ }

  function noop() {}
  function plugin(name) {
    if (!isNative) return null;
    try {
      if (typeof C.isPluginAvailable === 'function' && !C.isPluginAvailable(name)) return null;
      return (C.Plugins && C.Plugins[name]) || (typeof C.registerPlugin === 'function' ? C.registerPlugin(name) : null);
    } catch (e) { return null; }
  }
  // Calls plugin.method(arg); swallows both thrown errors and rejected promises.
  function call(name, method, arg) {
    try {
      var p = plugin(name);
      if (!p || typeof p[method] !== 'function') return Promise.resolve();
      var out = p[method](arg);
      return out && typeof out.then === 'function' ? out.then(noop, noop) : Promise.resolve();
    } catch (e) { return Promise.resolve(); }
  }
  function later(ms, fn) { setTimeout(fn, ms); }

  var impact = function (style) { return call('Haptics', 'impact', { style: style }); };
  var notify = function (type) { return call('Haptics', 'notification', { type: type }); };
  var HAPTICS = {
    correct: function () { notify('SUCCESS'); },
    taboo: function () { notify('ERROR'); },
    pass: function () { impact('MEDIUM'); },
    tick: function () { impact('LIGHT'); },
    tap: function () { impact('LIGHT'); },
    end: function () { notify('WARNING'); later(220, function () { impact('HEAVY'); }); },
    win: function () { notify('SUCCESS'); later(180, function () { impact('HEAVY'); }); later(360, function () { impact('HEAVY'); }); },
  };

  var awake = false;
  function keepAwake(on) {
    on = !!on;
    if (!isNative || on === awake) return Promise.resolve();
    awake = on;
    return call('KeepAwake', on ? 'keepAwake' : 'allowSleep');
  }

  var lastBar = '';
  function statusBar(hex, lightText) {
    if (!isNative) return Promise.resolve();
    var key = hex + '|' + !!lightText;
    if (key === lastBar) return Promise.resolve();
    lastBar = key;
    // Style 'DARK' = light text for a dark background, 'LIGHT' = dark text for a light background.
    var style = lightText ? 'DARK' : 'LIGHT';
    var job = call('StatusBar', 'setStyle', { style: style });
    // Android: older WebViews are padded away from the bars and the padding shows the window colour
    // (the app's own TabuBars plugin sets it). Edge-to-edge WebViews show the page itself there.
    if (platform === 'android' && /^#[0-9a-f]{6}$/i.test(String(hex || ''))) {
      job = job.then(function () { return call('TabuBars', 'setColor', { color: hex }); });
    }
    return job.then(noop, noop);
  }

  // Android hardware back: step back inside the game instead of closing the app.
  // A running round is only ever paused; leaving it needs the game's own Quit button and confirmation.
  function click(sel) {
    var el = document.querySelector(sel);
    if (!el || el.disabled) return false;
    el.click();
    return true;
  }
  function onBack(ev) {
    try {
      var api = window.TabuNative;
      if (api && typeof api.onBack === 'function' && api.onBack() === true) return;
      if (click('.overlay [data-act="modalNo"]')) return;     // close a dialog or the menu
      if (click('[data-act="resume"]')) return;               // paused round: back closes the pause sheet
      if (click('[data-act="pause"]')) return;                // running round: pause, never end it
      if (click('[data-act="menu"]')) return;                 // between rounds: open the game menu
      if (click('.back, [data-act="go"][data-v="home"]')) return; // setup, rules, stats: back to home
      if (ev && ev.canGoBack && !document.querySelector('#app[data-screen="home"]')) { history.back(); return; }
      call('App', 'minimizeApp');                             // home screen: leave the app, keep its state
    } catch (e) { /* never break the back button */ }
  }
  if (isNative && platform === 'android') {
    try {
      var app = plugin('App');
      if (app && typeof app.addListener === 'function') {
        var h = app.addListener('backButton', onBack);
        if (h && typeof h.catch === 'function') h.catch(noop);
      }
    } catch (e) { /* no App plugin: Android keeps its default back behaviour */ }
  }

  window.TabuNative = {
    isNative: isNative,
    platform: platform,
    haptic: function (kind) {
      try { if (isNative && HAPTICS[kind]) HAPTICS[kind](); } catch (e) { /* ignore */ }
      return Promise.resolve();
    },
    keepAwake: function (on) { try { return keepAwake(on); } catch (e) { return Promise.resolve(); } },
    statusBar: function (hex, lightText) { try { return statusBar(hex, lightText); } catch (e) { return Promise.resolve(); } },
    onBack: null, // the game may set this; return true when it handled the back press itself
  };
})();
