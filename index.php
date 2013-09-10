<?php
/**
 * Copyright 2013 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in
 * compliance with the License.You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Includes Configuration file.
 */
require_once 'inc/config.php';

/**
 * Encode array into JWT format also for decoding jwt into array.
 */
require_once 'inc/jwt.php';

/**
 * Get masked wallet.
 */
require_once 'inc/masked_wallet.php';

/**
 * Get full wallet.
 */
require_once 'inc/full_wallet.php';

/**
 * Create notify status JWT.
 */
require_once 'inc/notify_status.php';

/**
 * Parse requested url and serve the page according to request.
 */
function init() {
  $ruri = $_SERVER['REQUEST_URI'];
  $method = $_SERVER['REQUEST_METHOD'];
  $input = $_REQUEST;
  // remove the leading slash from RURI to get the request type.
  $request_type = substr($ruri, URI_LENGTH);
  switch($request_type) {
    case 'mwr' :  // For masked wallet request.
      if (strcasecmp($method, 'POST') == 0) {
        MaskedWallet::post($input);
      } else if (strcasecmp($method, 'PUT') == 0) {
        MaskedWallet::put($input);
      } else {
        header('HTTP/1.0 400 Unsupported Method', true, 400);
        echo 'Expected only POST and PUT with Masked Wallet Request, received '.
            $method ;
        exit();
      }
      break;
    case 'fwr' :  // For full wallet request.
      if (strcasecmp($method, 'POST') == 0) {
        FullWallet::post($input);
      } else {
        header('HTTP/1.0 400 Unsupported Method', true, 400);
        echo 'Expected only POST with Full Wallet Request, received '. $method ;
        exit();
      }
      break;
    case 'validate' :  // For validating masked wallet response.
       $masked_wallet_response =
        JWT::decode($input['jwt'], MERCHANT_SECRET);
        if (is_array($masked_wallet_response)) {
          echo 'true';
        }
        break;
    case 'tsn' :  // For notify google wallet of the transaction status.
      if (strcasecmp($method, 'POST') == 0) {
        NotifyStatus::post($input);
      } else {
        header('HTTP/1.0 400 Unsupported Method', true, 400);
        echo 'Expected only POST with Notify Status Request, received '.
          $method ;
        exit();
      }
      break;
    case 'logout' :  // for logging out user
      $time=time()-3600;
      foreach ($_COOKIE as $name=>$value) {
        setcookie($name, '', $time);
      }
      break;
    default:  // Default.
      EchoIndex();  // Rendering page.
  }
}

/**
 * This function renders all pages .
 */
function EchoIndex() {
  $clientId = CLIENT_ID;
  $scriptUrl = SCRIPT_URL;
  if (isset($_COOKIE['email'])) {
    $loginHeader = '<ul><li><a class="sign-out block" href = "#">'.
    $_COOKIE['email'].'</a></li>'.
    '<li><a class="sign-out block" href="javascript://"
    onclick="bikeStore.Sso.logout()"> Logout </a></li></ul>';
    $loginClasses = 'nav-username';
    $headingClasses = 'nav-filter';
  }
  else {
    $loginHeader = '<a class="sign-out hide" href = "#"></a>'.
      '<div style="margin-top:10%">
         <div class="g-signin" data-callback="render"
          data-clientid="'.$clientId.'"
          data-scope="'.SCOPES.'"
          data-height="standard"
          data-width="standard"
          data-cookiepolicy="single_host_origin">
        </div>
      </div>';
    $loginClasses = "nav-username nav-username-no-width";
    $headingClasses = "nav-filter nav-margin";
  }
  // Page Header.
  echo <<< PAGEHEADER
  <!DOCTYPE html>
  <!--[if lt IE 7 ]><html class="ie ie6" lang="en"> <![endif]-->
  <!--[if IE 7 ]><html class="ie ie7" lang="en"> <![endif]-->
  <!--[if IE 8 ]><html class="ie ie8" lang="en"> <![endif]-->
  <!--[if (gte IE 9)|!(IE)]><!--><html id="main" lang="en"> <!--<![endif]-->
  <head>
  <meta charset="utf-8">
  <title>Imaginary Awesome Bike Store</title>
  <meta name="description" content="">
  <meta name="author" content="">
  <meta name="viewport" content="width=device-width, initial-scale=1,
  maximum-scale=1">
  <link rel="stylesheet" href="css/jquery.mobile.css">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/skeleton.css">
  <link rel="stylesheet" href="css/layout.css">
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet"
  href="//fonts.googleapis.com/css?family=Roboto:100,400,300,500,700">
  <link
  href="//fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
  <!--[if lt IE 9]>
  <script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>
  <![endif]-->
  <script>
    // Client Id for web application.
    var clientId = "$clientId";
  </script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/json2/20121008/json2.js">
  </script>
  <script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.1/jquery.js"></script>
  <script
  src="//ajax.aspnetcdn.com/ajax/jquery.mobile/1.3.1/jquery.mobile-1.3.1.js">
  </script>
  <script type="text/javascript" src="$scriptUrl"></script>
  <script
  src="//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min.js">
  </script>
  <script
  src="//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min.js">
  </script>
  <script src="//cdn.jsdelivr.net/jquery.cookie/1.3/jquery.cookie.js"></script>
  <script src="js/globals.js"></script>
  <script src="js/cookies.js"></script>
  <script src="js/sso.js"></script>
  <script>
  function render(authResult) {
    bikeStore.Sso.handleLoginResult(authResult);
  }
  </script>
  <script src="https://apis.google.com/js/plusone.js?onload=render">
  </script>
  </head>
  <body>
PAGEHEADER;
  //Home page content.
  echo <<< HOMEPAGE
  <div id="item-selection" data-role="page">
    <div class="container">
      <div>
        <header>
          <h1>
            <a href="" class="home">Imaginary Awesome Bike Store</a>
          </h1>
        </header>
        <nav>
          <div class="$headingClasses">Viewing all products</div>
          <div class="$loginClasses">$loginHeader</div>
        </nav>
      </div>
      <div data-role="content">
        <div id="home-menu">
          <ul id="category-list" data-role="listview" data-theme="d"
            class="products">
            <!-- The list of items will be generated and inserted here  -->
          </ul>
        </div>
      </div>
      <footer>Not &copy; 2013 Imaginary Awesome Bike Store</footer>
    </div>
  </div>
HOMEPAGE;
  // Item page content.
  echo <<< ITEMPAGE
  <div data-role="content">
    <ul id="item-content">
      <!-- Item information will be generated and inserted here -->
    </ul>
  </div>
ITEMPAGE;
  // Order detail page content.
  echo <<< ORDERDETAIL
  <div data-role="page" id="order-detail">
    <div class="container">
      <div>
        <header>
          <h1>
            <a href="" class="home">Imaginary Awesome Bike Store</a>
          </h1>
        </header>
        <nav>
          <div class="$headingClasses">Your Cart</div>
          <div class="$loginClasses">$loginHeader</div>
        </nav>
      </div>
      <div data-role="content" id="order-content" class="manifest">
        <!-- Order details will be generated and inserted here -->
        <table>
          <thead>
            <tr>
              <td class="product-col">Product</td>
              <td class="product-name-head text-left">Name</td>
              <td class="quantity-col text-left">Quantity</td>
              <td class="text-right total-col">Total</td>
           </tr>
          </thead>
          <tbody id="product-list"></tbody>
        </table><br /><br />
        <div class="s2wbutton" id="buybutton" style="float:right"></div>
        <div class="button" id="continue_shopping" style="float:left"><i></i>
          <b>Continue Shopping</b>
        </div>
      </div>
      <footer>Not &copy; 2013 Imaginary Awesome Bike Store</footer>
    </div>
  </div>
ORDERDETAIL;
  // Order confirmation page content.
  echo <<< ORDERCONFIRM
  <div data-role="page" id="confirmation-page">
    <div class="container">
      <div>
        <header>
          <h1>
            <a href="" class="home">Imaginary Awesome Bike Store</a>
          </h1>
        </header>
        <nav>
          <div class="$headingClasses">Review Order</div>
          <div class="$loginClasses">$loginHeader</div>
        </nav>
      </div>
      <div class="manifest">
        <div data-role="content" id="confirmation-content"
        class="no-padding-bottom">
          <div><strong>Order Summary</strong></div>
          <table>
            <thead>
              <tr>
                <td class="product-col">Product</td>
                <td class="product-name-head text-left">Name</td>
                <td class="quantity-col text-left">Quantity</td>
                <td class="text-right total-col">Total</td>
              </tr>
            </thead>
            <tbody id="review-product-list"></tbody>
          </table>
        </div>
        <div data-role="content" class="no-padding-top">
        <div><strong>Payment Information</strong></div>
          <div class="subtitle">
            Buy with: <span class="gwallet-icon">
            <img src="img/GreyLogo124_26.png" alt="Google Wallet" /></span>
          </div>
          <table class="payment-table">
            <tr>
              <td class="payment-table-left content-indent" id="conbilling">
                <!-- User billing information will be populated here -->
              </td>
              <td class="payment-table-right"><a id="change_payment"
                  class="button">Change</a></td>
            </tr>
          </table>
          <hr>
          <div><strong>Ship To:</strong></div>
          <table class="shipping-table">
            <tr>
              <td class="payment-table-left content-indent" id="conshipping">
                <!-- User payment information will be populated here -->
              </td>
              <td class="payment-table-right">
                <a id="change_shipping" class="button">Change</a></td>
            </tr>
          </table>
        </div>
        <div id="place-order-div">
          <a id="place_order" class="button order-button">Place order</a>
        </div>
      </div>
        <footer>Not &copy; 2013 Imaginary Awesome Bike Store</footer>
    </div>
  </div>
ORDERCONFIRM;
  // Order receipt page content.
  echo <<< ORDERRECEIPT
  <div data-role="page" id="receipt">
    <div class="container">
      <div>
        <header>
          <h1>
            <a id="receipt-home" href="" class="home">Imaginary Awesome Bike
            Store</a>
          </h1>
        </header>
        <nav>
          <div class="$headingClasses">Review Order</div>
          <div class="$loginClasses">$loginHeader</div>
        </nav>
      </div>
      <div data-role="content" id="receipt-content"
        class="no-padding-bottom manifest">
        <!-- Receipt information generated and inserted here -->
        <div><strong>Order Receipt</strong></div>
          <table>
            <thead>
              <tr>
                <td class="product-col">Product</td>
                <td class="product-name-head text-left">Name</td>
                <td class="quantity-col text-left">Quantity</td>
                <td class="text-right total-col">Total</td>
              </tr>
            </thead>
            <tbody id="confirm-product-list"></tbody>
          </table>
      </div>
        <footer>Not &copy; 2013 Imaginary Awesome Bike Store</footer>
    </div>
  </div>
  <div id='logout'></div>
ORDERRECEIPT;
  // Page Footer.
  echo <<< PAGEFOOTER
  <script src="js/models.js"></script>
  <script src="js/view.js"></script>
  <script src="js/wallet.js"></script>
  <script src="js/app.js"></script>
  </body>
  </html>
PAGEFOOTER;
}
// Calling init() function to initialize the application.
init();
