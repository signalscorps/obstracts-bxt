import browser from 'webextension-polyfill';

// Synced part in all extension scopes [content, background, popup]
var globalSyncedStorage = {};
// set globalExtSettings on loading
browser.storage.local.get(['globalSyncedStorage']).then((storage) => {
  window.globalSyncedStorage = storage.globalSyncedStorage;
  globalSyncedStorage = storage.globalSyncedStorage;

});
// listen updates
browser.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );

    if (key === 'globalSyncedStorage') {
      window.globalSyncedStorage = newValue;
    }
  }
});