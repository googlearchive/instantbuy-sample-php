/**
 * The bikeStore.Wallet namespace handles all aspects of the application related
 * to Google Wallet functionality. It requires cookies.js as many of the
 * parameters are stored in cookies to try to be as server agnostic as possible.
 */

/**
 * Create bikeStore namespace if it's hasn't already been created
 */
var bikeStore = bikeStore || {};

(function(wallet) {

  /**
   * Static path to the JWT validation URL.
   * @const {String}
   */
  wallet.VALIDATE_URL = 'validate';

  /**
   * Static path to Masked Wallet JWT generation URL.
   * @const {String}
   */
  wallet.MWR_URL = 'mwr';

  /**
   * Google Transaction Id.
   * @type {String}
   */
  wallet.transactionId = bikeStore.Cookie.getTransactionId();

  /**
   * Edit cart JWT.
   * @type {String}
   */
  wallet.changeJwt = bikeStore.Cookie.getChangeJwt();

  /**
   * Get previously stored accessToken from cookies.
   * The accessToken is stored in a cookie so we can allow users to persist
   * their Wallet authorization.
   */
  $(function() {
    accessToken = bikeStore.Cookie.getAccessToken();
    google.wallet.online.setAccessToken(accessToken);
  });

  /**
   * Helper function to generate the post body that's posted to the server to
   * generate the JWT.
   * @param {String} Google transaction id.
   * @return {String} post body key value pair.
   */
  wallet.itemToPostBody = function(param) {
    var totalCartPrice = 0;
    var i;
    var cartObj = bikeStore.App.cart;
    for (i = 0; i < cartObj.length; i++) {
      totalCartPrice += cartObj.at(i).get('unitPrice');
    }
    if (cartObj.length) {
      totalCartPrice += bikeStore.App.SHIPPING + bikeStore.App.TAX;
    }
    var postBody = 'total=' + totalCartPrice;
    if (param) {
      postBody += '&gid=' + param;
    }
    return postBody;
  };

  /**
   * Creates the Full Wallet post parameters.
   * @return {String} post key value pairs to define the item being purchased.
   */
  wallet.fwrPostBody = function() {
    //Generate post body from cart items.
    var totalCartPrice = 0;
    var i;
    var cartObj = bikeStore.App.cart;
    for (i = 0; i < cartObj.length; i++) {
      totalCartPrice += cartObj.at(i).get('unitPrice');
    }
    if (cartObj.length) {
      totalCartPrice += bikeStore.App.SHIPPING + bikeStore.App.TAX;
    }
    var cart = 'arrCart=' + JSON.stringify(bikeStore.App.cart) + '&' +
    'tax=' + bikeStore.App.TAX.toFixed(2) + '&' +
    'shipping=' + bikeStore.App.SHIPPING.toFixed(2) + '&' +
    'gid=' + wallet.transactionId + '&' + 'totalPrice=' +
    totalCartPrice.toFixed(2);
    return cart;
  };

  /**
   * Button creation callback. When Wallet finishes creating the button it calls
   * the specified callback. This function then removes previously appended
   * buttons and appends the latest button.
   * @param {DOM Node} params The created Wallet button.
   */
  wallet.buttonReady = function(params) {
    // Remove any previously appended buttons.
    $('#gWalletDiv').remove();
    // Append Wallet button to page.
    var buttonDiv = document.createElement('div');
    buttonDiv.id = 'gWalletDiv';
    buttonDiv.appendChild(params.walletButtonElement);
    document.getElementById('buybutton').appendChild(buttonDiv);
  };

  /**
   * Creates new Google Wallet button with the JWT provided.
   * @param {String} jwt Masked Wallet Request JWT.
   */
  wallet.createButton = function() {
    if (bikeStore.App.currentItem.get('defined')) {
      $.post(wallet.MWR_URL, wallet.itemToPostBody(), function(jwt) {
        google.wallet.online.createWalletButton({
          'jwt' : jwt,
          'success' : wallet.maskedWalletSuccess,
          'failure' : wallet.maskedWalletFailure,
          'ready' : wallet.buttonReady
        });
      });
    }
  };

  /**
   * Masked Wallet request success handler. This function handles success from
   * the various ways to initiate the purchase flow.
   * @param {Object} param The MaskedWalletResponse.
   */
  wallet.maskedWalletSuccess = function(param) {
    // Pull MaskedWalletResponse JS object from the response.
    bikeStore.App.user.set('maskedWallet', param.response.response);
    // The Wallet transaction id ties various the various api requests for a
    // single order together. It is returned in the Masked Wallet Response.
    // Here we're setting the global Transaction Id.
    wallet.transactionId = param.response.response.googleTransactionId;
    if ($.cookie('email') == null) {
      bikeStore.Sso.handleEmail(param.response.response);
    }
    // Persist Masked Wallet Response and Transaction Id for page refreshes.
    bikeStore.Cookie.setMaskedWallet(param.response.response);
    bikeStore.Cookie.setTransactionId(wallet.transactionId);
    // Validate the JWT before proceeding
    $.post(wallet.VALIDATE_URL, 'jwt=' + param.jwt, function(response) {
      if (response === 'true') {
        $.mobile.changePage('#confirmation-page', {
          transition: transitionType
        });
      }
    });
    // Ajax call to server to create the change item JWT.
    // This is called in the handler to reduce latency in the future.
    $.post(wallet.MWR_URL, wallet.itemToPostBody(wallet.transactionId),
      function(param) {
      wallet.changeJwt = param;
      bikeStore.Cookie.setChangeJwt(param);
    });
  };

  /**
   * Masked Wallet Request failure handler. This function handles failures from
   * the various ways to implement the purchase flow. You should implement your
   * error handling code here.
   * @param {Object} error ErrorResponse.
   */
  wallet.maskedWalletFailure = function(error) {
  };

  /**
   * Continue Checkout button logic. Request Masked Wallet should be tied to
   * your continue checkout button. This allows you to get the
   * maskedWalletRequest for pre-authorized users with out any user interaction.
   */
  wallet.requestMaskedWallet = function() {
    if (bikeStore.Cookie.getAccessToken()) {
      $.post(wallet.MWR_URL, wallet.itemToPostBody(), function(jwt) {
        google.wallet.online.requestMaskedWallet({
          'jwt' : jwt,
          'success' : wallet.maskedWalletSuccess,
          'failure' : wallet.maskedWalletFailure
        });
      });
    } else {
      bikeStore.App.login();
    }
  };

  /**
   * Calls ChangeMaskedWallet using the JWT which allows pops up the choose to
   * allow the user to edit their payment or shipping selection.
   * @param {String} jwt maskedWalletRequest JWT with Google Transaction Id.
   */
  wallet.changeMaskedWallet = function(jwt) {
    google.wallet.online.changeMaskedWallet({
      'jwt' : wallet.changeJwt,
      'success' : wallet.maskedWalletSuccess,
      'failure' : wallet.maskedWalletFailure
    });
  };

  /**
   * Handles the Full Wallet Request success case. The parameter passed to this
   * callback contains the credit card number and Full Wallet Response object.
   * If you processed a card You would pull out the PAN from the response and
   * send it to your payment processor before transitioning to your receipt
   * page.
   * @param {Object} param PAN and Full Wallet Request object.
   */
  wallet.fullWalletSuccess = function(param) {
    //Update the user object with the Full Wallet Response so it can be
    //accessed by views.
    bikeStore.App.user.set('fullWallet', param);
    // Persist Full Wallet Response for page refreshes.
    bikeStore.Cookie.setFullWallet(param);
    //Validate JWT and process order
    //Here since we're not processing a real world transaction we only validate
    //the JWT.
    $.post(wallet.VALIDATE_URL, 'jwt=' + param.jwt, function(response) {
      if (response === 'true') {
        $.mobile.changePage('#receipt', {
          transition: transitionType
        });
        //Notify Google Wallet of the transaction status.
        wallet.notifyTransactionStatus();
      }
    });
  };

  /**
   * Full Wallet Request failure handler. You should implement your error
   * handling code here.
   * @param {Object} error Defines the code and details of why the request
   * failed.
   */
  wallet.fullWalletFailure = function(error) {
    // Hide spinner.
    $.mobile.hidePageLoadingMsg();
    if (error.error == "SPENDING_LIMIT_EXCEEDED") {
      $.mobile.changePage('#order-detail', {
        transition: transitionType
      });
    }
  };

  /**
   * Full Wallet Request requests the one time card number from Wallet. This is
   * called when the customer confirms the purchase. Below we're using ajax to
   * pull the full wallet request JWT but it could also be rendered in the page.
   */
  wallet.requestFullWallet = function() {
    //Ajax request for JWT.
    $.post('fwr', wallet.fwrPostBody(), function(jwt) {
      //Show the loading spinner.
      $.mobile.showPageLoadingMsg('a', 'loading', false);
      //Request full wallet.
      google.wallet.online.requestFullWallet({
        'jwt' : jwt,
        'success' : wallet.fullWalletSuccess,
        'failure' : wallet.fullWalletFailure
      });
    });
  };

  /**
   * NotifyTransactionStatus is used to notify Wallet of the final transaction
   * status. You need to call this function after you've processed the one time
   * card.
   */
  wallet.notifyTransactionStatus = function() {
    //Ajax request for JWT.
    $.post('tsn', 'gid=' + wallet.transactionId, function(jwt) {
      //Notify Google Wallet of the transaction status.
      google.wallet.online.notifyTransactionStatus({
        'jwt' : jwt
      });
    });
  };
})(window.bikeStore.Wallet = window.bikeStore.Wallet || {});
