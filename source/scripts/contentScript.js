import browser from 'webextension-polyfill';
// import './globalSyncedStorage'
// import Q from 'q';

console.log('helloworld from content script');

// Listen for messages
browser.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  // If the received message has the expected format...
  if (msg.get_dom) {
    console.log('get_dom', document.URL)
    let response = {
      textDOM: document.documentElement.outerHTML,
      URL: document.URL
    };

    // Call the specified callback, passing
    // the web-page's DOM content as argument
    sendResponse(response);
  } else if (msg.is_blog) {
    let response = isRSS();
    sendResponse(response);
  }
});

function isRSS () {
  let linkRSS = document.querySelector('link[rel=alternate][type=application\\/rss\\+xml]');
  let linkAtom = document.querySelector('link[rel=alternate][type=application\\/atom\\+xml]');;
  let response = {
    isContainRSS: linkRSS || linkAtom ? true : false,
    URL: document.URL,
    title: linkRSS?.title || linkAtom?.title,
    rssLink: linkRSS?.href || linkAtom?.href
  };
  return response;
}
var is_RSS = isRSS();
if (is_RSS.isContainRSS) {
  browser.runtime.sendMessage({showRSS: true});
}


