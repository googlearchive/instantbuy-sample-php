PHP Quick Start Sample for Instant Buy API Copyright (C) 2013 Google Inc.

instantbuy-quickstart-sample-php
================================

Basic PHP implementation of the Google Wallet for Instant Buy API.

### Setup

To setup the sample, edit inc/config.php.

*  If you don't already have a Google contact, submit the [Instant buy interest form](http://getinstantbuy.withgoogle.com). Google will respond to qualified merchants with instructions on how to set up merchant credentials.
* Replace MERCHANT_ID, MERCHANT_SECRET, MERCHANT_NAME in config.php with your Merchant Id, Merchant Secret Key, Merchant Name.
* Create an API project in the [Google API Console](https://code.google.com/apis/console/) then select the API Access tab in your API project, and click Create an OAuth 2.0 client ID and also enable Google+ API in services tab.
* Replace OAUTH_CLIENT_ID, ORIGIN_URL with your OAUTH Client Id and Application Origin Url.

### Google appengine.

To run application on google appengine requires [Google App Engine SDK](https://developers.google.com/appengine/downloads#Google_App_Engine_SDK_for_PHP) and PHP5.4+

1. Create new application at your [appengine account](https://appengine.google.com).
2. You need to register your application to be whitelisted before uploading it on appengine. Register your PHP applications to be deployed to App Engine visit [https://gaeforphp.appspot.com]( https://gaeforphp.appspot.com).
3. Change application name in app.yaml file.
4. Follow instruction to install google appengine sdk for php and to upload the application on [Google Appengine for PHP Docs](https://developers.google.com/appengine/docs/php/gettingstarted/introduction)

### Local dev.

To run application on local server requires [apache HTTP server](http://apache.org/) 2.0 or greater and PHP5+.

1. Make sure "allow_url_include" option is enabled in php.ini file.
2. Copy the files to default DocumentRoot of the server.
3. You can now visit http://localhost in your browser to see the application in action.
