/**
 * polyfill script for ios hippy live-reload on development environment
 */

(function () {
  function initLiveReload() {
    if (!global.WebSocket) return console.warn('websocket is unavailable for current hippy version');
    const wsUrl = 'ws://127.0.0.1:38999/debugger-live-reload';
    const ws = new global.WebSocket(wsUrl);
    ws.onmessage = (evt) => {
      console.info('[websocket onMessage]', evt);
      try {
        const data = JSON.parse(evt.data);
        if (data.action === 'compileStart') {
          console.info('[prepare reload bundle]');
        } else if (data.action === 'compileSuccess') {
          console.info('[start reload bundle]');
          ws.close();
          global.Hippy.bridge.callNative('DevMenu', 'reload');
        }
      } catch (err) {
        console.error('live debug ws onmessage error', err);
      }
    };
    global.Hippy.on('destroyInstance', () => {
      ws.close();
    });
  }
  if (!global.IS_LIVE_RELOAD_INIT && Hippy.device.platform.OS === 'ios') {
    // initial only once
    global.IS_LIVE_RELOAD_INIT = true;
    try {
      initLiveReload();
      console.info('[Live Reload Start...]');
    } catch (e) {
      console.error('Hippy initLiveReload error', e);
    }
  }
}());