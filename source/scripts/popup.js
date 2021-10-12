import browser from 'webextension-polyfill';
// import '../styles/popup.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globalSyncedStorage';
const C  = require('./const');
import Swal from 'sweetalert2';
window.jQuery = require('jquery');
window.$ = window.jQuery;
// import 'jquery.tagsinput-revisited';
import 'ion-rangeslider';
import 'select2';
import 'parsleyjs';


// Routes logic
let APIKeyScreen = document.getElementById('APIKeyScreen');
let ImportScreen = document.getElementById( 'ImportScreen');
let SuccessScreen = document.getElementById('SuccessScreen');
let LoadingScreen = document.getElementById('LoadingScreen');
const showAPIKeyScreen = function () {
  APIKeyScreen.hidden = false;
  ImportScreen.hidden = true;
  SuccessScreen.hidden = true;
  LoadingScreen.hidden = true;
};
const showImportScreen = function () {
  APIKeyScreen.hidden = true;
  ImportScreen.hidden = false;
  SuccessScreen.hidden = true;
  LoadingScreen.hidden = true;
};
const showSuccessScreen = function  (feed) {
  APIKeyScreen.hidden = true;
  ImportScreen.hidden = true;
  SuccessScreen.hidden = false;
  LoadingScreen.hidden = true;
  console.log(feed);
  if (feed?.feed_uuid) {
    let linkToFeed = document.getElementById("link_to_feed");
    // https://staging-01.obstracts.com/report/list/?feed_uuid=ea129284-93ea-418c-b41a-6c7e9a9aba34
    let link = "https://" + C.SUB_DOMAIN + ".obstracts.com/report/list/?feed_uuid=" + feed.feed_uuid;
    console.log(link);
    linkToFeed.innerText =  link;
    linkToFeed.setAttribute('href', link);

  }
};
const showLoadingScreen = function () {
  APIKeyScreen.hidden = true;
  ImportScreen.hidden = true;
  SuccessScreen.hidden = true;
  LoadingScreen.hidden = false;
};

// delay for filling window.globalSyncedStorage
setTimeout(function () {
  // switching screens
  console.log(window.globalSyncedStorage, window.globalSyncedStorage);
  console.log('before API KEY');
  if (window.globalSyncedStorage?.APIKey && window.globalSyncedStorage?.validateAPIKey) {
    showImportScreen();
    var fourCharsLabelElem = $('#last_four_chars');
    var fourCharsElem = $('#api_key_last_four_chars');
    fourCharsLabelElem.show();
    let last_four = window.globalSyncedStorage.APIKey.substr(-4)
    fourCharsElem.text(last_four);
  } else {
    showAPIKeyScreen();
  }
  console.log('before API KEY');

  // if (window.globalSyncedStorage?.collections) {
  //   addCollectionsToSelect(window.globalSyncedStorage.collections);
  // }

  // start API command to update collections
  //
  // if (window.globalSyncedStorage?.APIKey &&  window.globalSyncedStorage?.validateAPIKey) {
  //   browser.runtime.sendMessage({getCollections: true})
  //     .then((response) => {
  //       console.log('update collections response', response);
  //       if (response.response?.collections) {
  //         console.log('updateCollectionsToSelect ');
  //         addCollectionsToSelect(response.response.collections);
  //         window.globalSyncedStorage.collections = response.response.collections;
  //         browser.storage.local.set({globalSyncedStorage: window.globalSyncedStorage});
  //       }
  //     });
  // }


});

$("#id_confidence").ionRangeSlider({

  min: 1,
  max: 100,
});

jQuery(document).ready(function($){
  $('#id_tag_tags_input').tagsInput({
    autocomplete: {
      source: ["apt1", "apt28", "apt30"],
      // source: browser.extension.getURL( 'assets/tags-source.json'),
      autoFocus: true,
      delay: 20
    },
    'validationPattern': new RegExp('^[0-9a-zA-Z\-]+$'),

    minInputWidth: 145,
    height: '40px',
    width: '460px',

    // autocomplete_url: browser.extension.getURL( 'assets/tags-source.json')

  });
  setTimeout(function () {
    $('#id_tag_tags_input_tag').attr('data-parsley-pattern', '^[0-9a-zA-Z\-\,]+$');

  }, 500);


  // $('#collection_select').select2({
  //   placeholder: "Select a collection",
  //   // allowClear: true
  // });
    $('#category_feed').select2({
      minimumResultsForSearch: -1,

    });

  // $('input[name=formRadios]').change(function () {
  //   if ($(this).attr('id') == 'id_use_text') {
  //     $('#id_file').attr('required', false)
  //     $('#id_file').attr('disabled', true)
  //     $('#id_content').attr('required', true)
  //     $('#id_content').attr('disabled', false)
  //     $('#id_text_box').removeClass('d-none');
  //     $('#id_file_box').addClass('d-none');
  //   }
  //   else {
  //     $('#id_content').attr('required', false)
  //     $('#id_file').attr('required', true)
  //     $('#id_file_box').removeClass('d-none');
  //     $('#id_text_box').addClass('d-none');
  //     $('#id_file').attr('disabled', false)
  //     $('#id_content').attr('disabled', true)
  //   }
  // });

  $('#change_api_key').on('click', (event) => {
    event.preventDefault();
    showAPIKeyScreen();

  });


  var fourCharsLabelElem = $('#last_four_chars');
  var fourCharsElem = $('#api_key_last_four_chars');


  $('#api_key').on('propertychange input', (event) => {
    console.log(event, event.target)
    fourCharsLabelElem.show();
    let last_four = event.target.value.substr(-4)
    fourCharsElem.text(last_four);
    console.log(last_four)

  });


  browser.tabs.query({active: true, currentWindow: true}).then(function(tabs) {
    console.log('tabs', tabs);
    // by default type is html
    var originalURL = tabs[0].url;
    var tabURL = tabs[0].url.toLowerCase();

    if (tabURL.indexOf('http') > -1) {
      browser.tabs.sendMessage(tabs[0].id, {'is_blog': true}).then(function(contentResponse) {
        console.log('contentResponse', contentResponse);

        if (contentResponse.isContainRSS && C.APP_SWITCH === 'stixify') {
          Swal.fire({
            title: "This looks like a blog. Use our other product, Obstracts, for automatic intelligence extraction of new posts. https://www.obstracts.com",
          })
        }

        if (!contentResponse.isContainRSS && C.APP_SWITCH === 'obstracts') {
          Swal.fire({title: "This does not look like a blog. Use our other product, Stixify, to ingest static web pages. https://www.stixify.com",
            showDenyButton: false,
            showConfirmButton: false,
            showCancelButton: false,
            stopKeydownPropagation: false,

          })
          $('#not_rss_notification').show();
          $('#url_feed').val('');
          $('#name_feed').val('');
          $( "#startImportButton" ).prop( "disabled", true );
          $("#create_collection_form :input").prop("disabled", true);
        }
        if (contentResponse.isContainRSS && C.APP_SWITCH === 'obstracts') {
          $('#not_rss_notification').hide();
          $('#url_feed').val(contentResponse.rssLink);
          $('#name_feed').val(contentResponse.title);

          // browser.browserAction.setBadgeText({tabId: tabs[0].id, text: 'RSS'});
          // browser.browserAction.setBadgeBackgroundColor({
          //   tabId: tabs[0].id,
          //   color: 'green'
          // });
        }
      })
    }
  })

});


var APIKeyInput = document.getElementById('api_key');
var saveAPIKeyButton = document.getElementById('saveAPIKeyButton');
// saveAPIKeyButton.onclick = () => {console.log(1111)};



console.log('saveAPIKey')

const saveAPIKey = (event) => {
  event.preventDefault();
  console.log('saveAPIKey3')

  var APIKey = APIKeyInput.value;

  if (APIKey.length > 60 && APIKey.length < 91) {
    // browser.storage.local.clear();
    // show preload
    showLoadingScreen();

    console.log('async');
    console.log('saveAPIKey4')

    browser.runtime.sendMessage({validateAPIKey: true, APIKey: APIKey})
      .then( function (response) {
      // todo: hide preload
      console.log('response in sendMessage', response);

      if ( response.error ) {
        throw response.error;
      }
      if (response) { // window.globalSyncedStorage?.api_key && window.globalSyncedStorage?.api_key_valid

        // if (response.response?.collections) {
        //   console.log('addCollectionsToSelect ');
        //   addCollectionsToSelect(response.response.collections);
        // }
        showImportScreen();
        Swal.fire("Success. You can now start importing feeds.");
        // browser.browserAction.setBadgeText({text: ''});
        // browser.browserAction.setBadgeBackgroundColor({
        //   color: 'green'
        // });
        //"Success. You can now start importing reports." else show, "Error. Please check key is valid."
      } else {
        // todo: show error
        Swal.fire( 'Error.', "Error. Please check key is valid.", 'error');
        // showImportScreen();
        showAPIKeyScreen();
        // browser.browserAction.setBadgeText({text: ''});
        // browser.browserAction.setBadgeBackgroundColor({
        //   color: 'red'
        // });
      }
    }).catch((error) => {

      console.log('error', error);
      showAPIKeyScreen();
      // browser.browserAction.setBadgeText({text: ''});
      // browser.browserAction.setBadgeBackgroundColor({
      //   color: 'red'
      // });


      console.log('error object - ', {error});
      if (error?.errorMessage) {
        Swal.fire("Error. Please check key is valid.", error.errorMessage, 'error')
      } else if (typeof error === 'string') {
        Swal.fire("Error. Please check key is valid.", error, 'error')
      } else {
        Swal.fire("Error. Please check key is valid.", 'Error code and message will be here', 'error')
      }

    });

  }



};
const parsleyAPIKeyValidate = (event) => {
  let feedTags = $('#id_tag_tags_input').val();
  console.log(feedTags);
  var $api_key_form = $('#api_key_form').parsley();


  if ($api_key_form.validate()) {
    // if (is_bad_collection) {
    //
    //   Swal.fire({
    //     title: "Sorry, we are unable to retrieve this collection. Please contact us if you think this is an error.",
    //     confirmButtonColor: "#5b73e8",
    //   });
    // }
    // else {
    // $('.full-loading').removeClass('d-none');
    // $('#create_collection_form').submit()
    console.log('valid1');
    saveAPIKey(event);

    // }
  }
}
saveAPIKeyButton.onclick = parsleyAPIKeyValidate;

// const addCollectionsToSelect = (collectionsAPI) => {
//   var collectionSelectElement = document.getElementById('collection_select');
//
//   console.log(collectionsAPI);
//
//   collectionSelectElement.innerHTML = '';
//
//   collectionsAPI.forEach ( function(collection) {
//     let newOption = document.createElement('option');
//     newOption.setAttribute("value", collection.collection_uuid);
//     newOption.innerText = collection.collection_name;
//
//
//     console.log(newOption)
//     collectionSelectElement.appendChild(newOption);
//
//     // collection_datetime_added: "2021-08-26T05:10:07.189772Z"
//     // collection_datetime_latest_report: null
//     // collection_description: ""
//     // collection_name: "Test collection 2"
//     // collection_tags: []
//     // collection_uuid: "84532f51-39db-4aad-a91d-0608e0a95d03"
//   })
// }


const startImport = (event) => {
  event.preventDefault();
  console.log('startImport1')

  // feedUrl, feedTitle, feedDescription, feedCategory, feedTags, feedConfidence

  let feedUrl = document.getElementById('url_feed')?.value;
  let feedTitle = document.getElementById('name_feed')?.value;
  let feedDescription = document.getElementById('description_feed')?.value;

  let feedCategory = document.getElementById('category_feed')?.value;
  let feedConfidence = document.getElementById('id_confidence')?.value;
  let feedTags = $('#id_tag_tags_input').val();




  // if (nameReport && collectionSelectReport) {
    // show preload
    showLoadingScreen();

    console.log('async');
    console.log('startImport2');
    let message = {
      feedUrl,
      feedTitle,
      feedDescription,
      feedCategory,
      feedTags,
      feedConfidence
    };
    message.createFeed = true;

    browser.runtime.sendMessage(message)
      .then( function (response) {
        if ( response.error ) {
          throw response.error;
        }
        var feeds = response.response.reports;
        // todo: hide preload
        console.log('response in sendMessage', response, feeds);
        // todo: if response contain error message - show on page. To choose library for this.

        if (feeds?.length) {
          // TODO: Add and show success URL
          let feed = feeds[0];

          showSuccessScreen(feed);
        } else {
          // todo: show error
          showSuccessScreen();
          // Promise.reject({errorMessage: "don't get report "});
        }
      }).catch((error) => {
        console.log('error object - ', {error});
        if (error?.errorMessage) {
          Swal.fire('Oops...', error.errorMessage, 'error')
        } else if (typeof error === 'string') {
          Swal.fire('Oops...', error, 'error')
        } else {
          Swal.fire('Oops...', 'Error code and message will be here', 'error')
        }

      });

  // } else {
  //   // todo: show suggetions for fields
  // }



};
const parsleyValidate = (event) => {
  var $create_collection_form = $('#create_collection_form').parsley();

  if ($create_collection_form.validate()) {
    // if (is_bad_collection) {
    //
    //   Swal.fire({
    //     title: "Sorry, we are unable to retrieve this collection. Please contact us if you think this is an error.",
    //     confirmButtonColor: "#5b73e8",
    //   });
    // }
    // else {
    $('.full-loading').removeClass('d-none');
      // $('#create_collection_form').submit()

    startImport(event);

    // }
  }
}
let startImportButton = document.getElementById('startImportButton');
startImportButton.onclick = parsleyValidate;



window.addEventListener('click',function(e){
  if(e.target.href!==undefined){
    chrome.tabs.create({url:e.target.href})
  }
})



