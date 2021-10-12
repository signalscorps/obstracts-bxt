import browser from 'webextension-polyfill';
import './globalSyncedStorage';
import API from './API';
import Q from 'q';




// browser.runtime.onMessage.addListener((_request, _sender, _sendResponse) => {
//   // Do something with the message!
//   // alert(request.url);
//
//   // And respond back to the sender.
//   return Promise.resolve('got your message, thanks!');
// });



// Listen for messages from content and popup scripts
browser.runtime.onMessage.addListener( function(message, sender) {
  console.log('three parameters', message, sender);
  // sendResponse({errorMessage: 'Wrong response from the API'});
  var deferred = Q.defer();
  if (message.getFeeds) {

    //
    // API.getCollections().then(function (result) {
    //   var JSONResult = JSON.parse(result);
    //   console.log('in background result', JSONResult);
    //
    //   if (!JSONResult) {
    //     deferred.resolve({errorMessage: 'Wrong response from the API'});
    //   }
    //
    //   if (JSONResult?.type === 'error') {
    //     deferred.resolve({errorMessage: 'Error message - ' . JSONResult?.value});
    //   }
    //
    //   if (JSONResult?.collections) {
    //     // save collections to globalSyncedStorage
    //     window.globalSyncedStorage.collections = JSONResult.collections;
    //     browser.storage.local.set({globalSyncedStorage: window.globalSyncedStorage});
    //
    //     deferred.resolve({response: {message: 'Success', collections: JSONResult.collections}});
    //   } else {
    //     deferred.resolve({response: {message: 'Success but no collections'}});
    //   }
    //
    //   console.log('in background result', result)
    // })
    // // return true; // indicate that we will send response callback asynchronously
  } else if (message.validateAPIKey) {
    console.log('validateAPIKey')
    API.validateAPIKey(message.APIKey)
      .then(function (result)  {

      var JSONResult = JSON.parse(result);
      console.log('in background result 333', JSONResult);

      if (!JSONResult) {
        deferred.resolve({errorMessage: 'Wrong response from the API'});
      }

      if (JSONResult?.type === 'error') {
        deferred.resolve({errorMessage: 'Error message - ' . JSONResult?.value});
      }
        console.log('success response callback');
      // var outerResult = result;
      browser.storage.local.set({globalSyncedStorage: {APIKey: message.APIKey, validateAPIKey: true}}) // save "auth"
        .then((response) => {
          window.globalSyncedStorage = {APIKey: message.APIKey, validateAPIKey: true}; // save "auth 2"
          console.log({JSONResult});
          // if (JSONResult?.collections) {
          //   // save collections to globalSyncedStorage
          //   window.globalSyncedStorage.collections = JSONResult.collections;
          //   browser.storage.local.set({globalSyncedStorage: window.globalSyncedStorage})
          //
          //   deferred.resolve({response: {message: 'Success', collections: JSONResult.collections}});
          // } else {
            deferred.resolve({message: 'Success'});
          // }

        });
    }).catch((error => {
      console.log(222, error);
      deferred.resolve({error: error});

    }))


  } else if (message.createFeed) {
    startImport(message).then((result) => {
      deferred.resolve(result);

    }).catch((error) => {
      console.log(222, error);
      deferred.resolve({error: error});
    })




  } else if (message.showRSS) {
    console.log('message sender',message, sender);
    browser.browserAction.setBadgeText({tabId: sender.tab.id, text: 'RSS'});
    browser.browserAction.setBadgeBackgroundColor({
      tabId: sender.tab.id,
      color: 'green'
    });
  }
  return deferred.promise;
});

var startImport = function (message) {
  var deferred = Q.defer();
  var feedUrl = message.feedUrl,
    feedTitle = message.feedTitle,
    feedDescription = message.feedDescription,
    feedCategory = message.feedCategory,
    feedTags = message.feedTags,
    feedConfidence = message.feedConfidence;


  // if (reportPlaintext) {
    createFeed(feedUrl, feedTitle, feedDescription, feedCategory, feedTags, feedConfidence).then((response) => {
      deferred.resolve(response);

    }).catch((error) => {
      console.log(111, error)

      deferred.reject(error);
    })
  // }
  // else {
  //
  //   browser.tabs.query({active: true, currentWindow: true}).then(function(tabs) {
  //     console.log('tabs', tabs);
  //     // by default type is html
  //     var originalURL = tabs[0].url;
  //     var tabURL = tabs[0].url.toLowerCase();
  //     var type = {type: 'text/html'};
  //     fileType = '.html';
  //
  //     if (tabURL.indexOf('.pdf') > -1) {
  //       fileType = '.pdf';
  //       type = {type: 'application/pdf'};
  //
  //     } else if (tabURL.indexOf('.xml') > -1) {
  //       fileType = '.xml';
  //       type = {type: 'text/xml'};
  //
  //     } else if (tabURL.indexOf('.json') > -1) {
  //       fileType = '.json';
  //       type = {type: 'application/pdf'};
  //
  //     } else if (tabURL.indexOf('.txt') > -1) {
  //       fileType = '.txt';
  //       type = {type: 'text/plain'};
  //     }
  //
  //     if (fileType === '.pdf') {
  //       // fetching pdf and create report
  //       fetch(originalURL)
  //         .then( res => res.blob() )
  //         .then( blob => {
  //           console.log(blob.type);
  //           // let blobParts = [contentResponse.textDOM];
  //           // fileData = new Blob(blobParts, type);
  //           fileData = blob;
  //           fileName = 'testFileNameIsItNameImportant' + fileType;
  //
  //           createReport(fileType, fileData, fileName,reportTitle,reportDescription, collectionUuid, reportTlpLevel, reportConfidence, reportTags, null).then((response) => {
  //             deferred.resolve(response);
  //
  //           }).catch((error) => {
  //             deferred.reject(error);
  //           })
  //
  //
  //         }).catch((error) => {
  //         deferred.reject(error);
  //       });
  //
  //
  //     } else {
  //       browser.tabs.sendMessage(tabs[0].id, {'get_dom': true}).then(function(contentResponse) {
  //         console.log('get_dom', contentResponse);
  //         let blobParts = [contentResponse.textDOM];
  //         fileData = new Blob(blobParts, type);
  //
  //         fileName = 'testFileNameIsItNameImportant' + fileType;
  //
  //
  //         createReport(fileType, fileData, fileName,reportTitle,reportDescription, collectionUuid, reportTlpLevel, reportConfidence, reportTags, null).then((response) => {
  //           deferred.resolve(response);
  //
  //         }).catch((error) => {
  //           console.log(error)
  //           deferred.reject(error);
  //         })
  //
  //
  //       }).catch((error) => {
  //         console.log(error)
  //
  //         deferred.reject(error);
  //       })
  //     }
  //
  //
  //
  //   });
  //
  // }


  return deferred.promise;

};

var createFeed = (feedUrl, feedTitle, feedDescription, feedCategory, feedTags, feedConfidence) => {
  var deferred = Q.defer();
  API.createFeed(feedUrl, feedTitle, feedDescription, feedCategory, feedTags, feedConfidence)
    .then(result => {
      console.log('in background result', result);

      if (!result) {
        deferred.reject({errorMessage: 'Wrong response from the API'});
      }

      var JSONResult = JSON.parse(result);
      console.log('in background result', JSONResult);

      if (JSONResult?.type === 'error') {
        deferred.reject({errorMessage: 'Error message - ' . JSONResult?.value});
      }

      console.log('success response callback');

      if (JSONResult?.reports) {
        deferred.resolve({response: {message: 'Success', reports: JSONResult.reports}});
      } else {
        deferred.resolve({message: 'Success'});
      }
    }).catch((error) => {
      deferred.reject(error);
      console.log('createFeed', error);
    });
  return deferred.promise;
}
