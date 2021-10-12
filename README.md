# Obstracts Browser extension

## Project Overview

The Obstracts browser extension is designed to simplify the import process of new feeds (blogs) viewed in the browser to the Obstracts web app.

### Download

You can download the latest version of this extension for:

* [Google Chrome](https://chrome.google.com/webstore/search/obstracts)
* [Mozilla Firefox](https://addons.mozilla.org/en-GB/firefox/search/?q=obstracts)
* [Microsoft Edge](https://microsoftedge.microsoft.com/addons/search/obstracts)

### Usage

The extension requires authentication using an API key. On install, user will be required to enter API key from web app. [You can generate an API key here](https://app.obstracts.com/integrations). The user must have write permissions for the group. [Group admins can check user has write permissions and modify current permissions here](https://app.obstracts.com/user/manage_group).

Once API key entered, please open a new tab (or refresh those currently open to start importing).

Once authenticated, when a user visits a blog and `<link rel="alternate" type="application/rss+xml"` or `<link rel="alternate" type="application/atom+xml"` present in HTML the extension shows green RSS badge indicating page is a blog that can be imported.

User can then import blog to Obstracts by specifying:

* Feed title: Required. Limited to 120 chars.
* Feed description: Optional. Limited to 240 chars.
* Feed confidence: Required. Number including and between 1-100.
* Feed category. Required. Either news, blog, analyst, vendor
* Feed tags. Optional. Tag must contain only 0-9 a-z or -

On successful import, will show a link to the feed in the web app to view imported content. When a blog is imported, it is enabled. Thus, if blog previously disabled in group, importing it via the extension will re-enable it.

#### Tag library

You can modify the autocomplete tags shown in the extension by modifying the `id_tag_tags_input` in `source/scripts/popup.js`

#### A note on validation

The extension should be run on the route of the blog (e.g. https://www.site.com/blog/threat-research). Some single posts will show as RSS (e.g. https://www.site.com/blog/threat-research/2020/some_blog_post.html). If run on the single page, only the single page will be imported (not the blog), thus any future blog posts will not be imported.

A user cannot import unless `<link rel="alternate" type="application/rss+xml"` or `<link rel="alternate" type="application/atom+xml"` is detected in HTML. This is not perfect because not all blogs include this. For such blogs, user should import blog directly from web app.

#### A note on private blogs

If your RSS feed is private (e.g. corporate blogs behind VPN, password protected blogs, etc) it will not be imported. The RSS feed needs to be publicly accessible on the internet.

### Supported browsers

The extension is built to work on the latest desktop versions of:

* Google Chrome
* Mozilla Firefox
* Microsoft Edge

---

## Developers

### Quick Start

Ensure you have

* [Node.js](https://nodejs.org) 10 or later installed
* [Yarn](https://yarnpkg.com) v1 or v2 installed

Then run the following:

* `yarn install` to install dependencies.
* `yarn run dev:chrome` to start the development server for chrome extension
* `yarn run dev:firefox` to start the development server for firefox addon
* `yarn run dev:opera` to start the development server for opera extension
* `yarn run build:chrome` to build chrome extension
* `yarn run build:firefox` to build firefox addon
* `yarn run build:opera` to build opera extension
* `yarn run build` builds and packs extensions all at once to extension/ directory

### Development

* `yarn install` to install dependencies.
* To watch file changes in development
  * Chrome
    * `yarn run dev:chrome`
  * Firefox
    * `yarn run dev:firefox`
  * Opera
    * `yarn run dev:opera`

**A note on MS Edge**

For the Edge browser, the API is the same as for Chrome. The only thing is that during the publication process, the description and text in the extension should not contain the names of other browsers

#### Generating browser specific manifest.json

Update `source/manifest.json` file with browser vendor prefixed manifest keys

```
{
  "__chrome__name": "ObstractsChrome",
  "__firefox__name": "ObstractsFox",
  "__edge__name": "ObstractsEdge",
  "__opera__name": "ObstractsOpera"
}
```

if the vendor is `chrome` this compiles to:

```
{
  "name": "ObstractsChrome",
}
```

#### Load extension in browser

##### Chrome

* Go to the browser address bar and type `chrome://extensions`
* Check the `Developer Mode` button to enable it.
* Click on the `Load Unpacked Extension…` button.
* Select your extension’s extracted directory.

##### Firefox

* Load the Add-on via `about:debugging` as temporary Add-on.
* Choose the `manifest.json` file in the extracted directory

##### Opera

* Load the extension via `opera:extensions`
* Check the `Developer Mode` and load as unpacked from extension’s extracted directory.

### Production

- `yarn run build` builds the extension for all the browsers to `extension/BROWSER` directory respectively.

Note: By default the `manifest.json` is set with version `0.0.0`. The webpack loader will update the version in the build with that of the `package.json` version. In order to release a new version, update version in `package.json` and run script.

### Obstracts API docs

The browser extension uses the Obstracts API.

[The API is described here](https://docs.obstracts.com/developers/api-intro).

---

## License

The code of this extension is licensed under a [Apache 2.0](/LICENSE).

## Support

[Please contact the Signals Corps](https://www.signalscorps.com/contact).
