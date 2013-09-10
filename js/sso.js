/**
 * This class provides necessary functions for Single sign on feature, which
 * enables your customers to authenticate themselves to your website using their
 * Google credentials.
 */
var bikeStore = bikeStore || {};

(function(sso) {
  /**
   * Checks if buyers pre-authorized the app to use their Wallet information to
   * checkout.
   * @param {Object} authResult Data object represents the OAuth 2.0 token.
   */
  sso.handleLoginResult = function(authResult) {
    if (authResult) {
      if (authResult['error'] == undefined) {
        gapi.auth.setToken(authResult); // Store the returned token.
        gapi.client.load('oauth2', 'v2', function() {
          bikeStore.Cookie.setAccessToken(authResult['access_token'],
            authResult['expires_at']);
          console.log(authResult);
          var request = gapi.client.oauth2.userinfo.get();
          request.execute(sso.handleEmail);
        }); // Trigger request to get the email address.
      } else {
        console.log(authResult['error']);
      }
    }
  };

  /**
   * Set email in cookie and replace header with email id.
   * @param {Object} obj Data which contain user' email id.
   */
  sso.handleEmail = function(obj) {
    bikeStore.Cookie.setEmail(obj['email']);
    $('.nav-filter').attr('class','nav-filter');
    $('.nav-username').html('<ul><li><a class="sign-out block" href = "#">' +
      obj['email'] + '</a></li><li><a class="sign-out block" href="#"' +
      'onclick="bikeStore.Sso.logout()"> Logout </a></li></ul>');
  }

  /**
   * Log out the customer from the site and reload the page.
   */
  sso.logout = function() {
    var access_token = bikeStore.Cookie.getAccessToken();
    var revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token=' +
      access_token;
    // Clear session objects associated with user profile information and reload
    // the page .
    bikeStore.Cookie.setAccessToken('', 1);
    google.wallet.online.setAccessToken('');
    // Perform an asynchronous GET request.
    $.ajax({
      type: 'GET',
      url: revokeUrl,
      async: false,
      contentType: "application/json",
      dataType: 'jsonp',
      success: function(nullResponse) {
        $.post('logout','', function() {
          document.location.href = "/";
        });
      },
      error: function(e) {
        console.log('Error');
      }
    });
  };
})(window.bikeStore.Sso = window.bikeStore.Sso || {});
