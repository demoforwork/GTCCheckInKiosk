chrome.app.runtime.onLaunched.addListener(function() {
  chrome.power.requestKeepAwake('display');
  chrome.app.window.create(
      'index.html',
      {"state": "fullscreen"});
});

