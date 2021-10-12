import browser from 'webextension-polyfill';
import './globalSyncedStorage';
import Q from 'q';
const C  = require('./const');


let API = {

  get: function (urlPart, APIKey, headers) {
    var deferred = Q.defer();
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    let api_key = APIKey ? APIKey : window.globalSyncedStorage.APIKey;
    myHeaders.append("x-api-key", api_key);

    if (headers?.length) {
      let keys = Object.keys(headers);
      keys.forEach(function (value, index, array) {
        myHeaders.append(value, headers[value]);
      });
    }

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    console.log('before fetch');

    fetch(C.API_URL + urlPart, requestOptions)
      .then(response => {
        console.log(response);



        return response.text()
      })
      .then(result => {
        console.log(result);
        // todo: show the message in popup window with this error value
        var JSONResult = JSON.parse(result);
        console.log('in API response', JSONResult);

        // todo: add object in error message
        if (JSONResult?.type === 'error') {
          deferred.reject({errorMessage: 'Error message - ' + JSONResult?.value});
        }

        if (result.type === 'error') {
          deferred.reject({errorMessage: 'Error message - ' + result?.value});
        } else {
          deferred.resolve(result);
        }


      })
      .catch(error => {
        console.log('error', error)

        deferred.reject(error);

      });
    return deferred.promise;
  },
  validateAPIKey: function (APIKey) {
    console.log('inside  validate')
    var deferred = Q.defer();
    this.get('feeds/', APIKey)
      .then(result => {
        console.log(result);

        deferred.resolve(result);

      })
      .catch(errorReason => {
        console.log('catch ', errorReason);
        deferred.reject(errorReason);

      });
    return deferred.promise;
  },
  getFeeds: function () {
    console.log('get collections api');
    var deferred = Q.defer();
    let APIKey = window.globalSyncedStorage.APIKey;
    this.get('feeds/', APIKey)
      .then(result => {

        console.log(result);
        deferred.resolve(result);

      }).catch(errorReason => {
        deferred.reject(result);

    });
    return deferred.promise;
  },

  createFeed: function (feedUrl, feedTitle, feedDescription, feedCategory, feedTags, feedConfidence) {
    console.log(feedUrl, feedTitle, feedDescription, feedCategory, feedTags, feedConfidence);
    var deferred = Q.defer();
    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    let api_key = window.globalSyncedStorage.APIKey;
    myHeaders.append("x-api-key", api_key);

    var formdata = new FormData();
    formdata.append("feed_url", feedUrl);
    formdata.append("feed_title", feedTitle);
    formdata.append("feed_description", feedDescription);
    formdata.append("feed_category_name", feedCategory);
    formdata.append("feed_tags", feedTags);
    formdata.append("feed_confidence", feedConfidence);



    // if (reportPlaintext) {
    //   formdata.append("file_type", 'plaintext');
    //   formdata.append("file_content", reportPlaintext);
    // } else {
    //   formdata.append("file_type", fileType); // ".pdf"
    //   formdata.append("file_data", fileData, fileName); // fileInput.files[0], "rpt-apt28.pdf"
    // }
    //
    // formdata.append("report_title", reportTitle); // "My threat intel report on APT28"
    // formdata.append("report_description", reportDescription); // "Full of interesting insights"
    // formdata.append("report_confidence", reportConfidence);
    // formdata.append("report_tags", reportTags); // tag-1,tag2
    // formdata.append("report_tlp_level", reportTlpLevel); // Green

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };

    fetch(C.API_URL +  "/feeds/", requestOptions)
      .then(response => {

        // todo: show the message in popup window with this error value
        if (response.type === 'error') {
          deferred.reject(response.value);
        }

        return response.text()
      })
      .then(result => {
        console.log(result);


        var JSONResult = JSON.parse(result);
        console.log('in API response', JSONResult);

        // todo: add object in error message
        if (JSONResult?.type === 'error') {
          deferred.reject({errorMessage: 'Error message - ' + JSONResult?.value});
        }


        // todo: show the message in popup window with this error value


        deferred.resolve(result);
      })
      .catch(error => {
        deferred.reject(error);
        console.log('error', error)

      });
    return deferred.promise;
  },

};

export default API;