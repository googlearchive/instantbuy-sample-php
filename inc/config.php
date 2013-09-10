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
 * Contains all configuration information.
 */
define('MERCHANT_ID', 'MERCHANT_ID');
define('MERCHANT_SECRET', 'MERCHANT_SECRET');
define('MERCHANT_NAME', 'MERCHANT_NAME');
define('CURRENCY_CODE','USD');
define('DEPLOYMENT_MODE','Sandbox');  //it can be 'Sandbox' or 'Production'.
if (DEPLOYMENT_MODE == 'Sandbox') {
  define('SCOPES','https://www.googleapis.com/auth/plus.login
    https://www.googleapis.com/auth/userinfo.email
    https://www.googleapis.com/auth/paymentssandbox.make_payments');
  define('SCRIPT_URL',
      'https://wallet-web.sandbox.google.com/online/v2/merchant/merchant.js');
} else {
  define('SCOPES','https://www.googleapis.com/auth/plus.login
    https://www.googleapis.com/auth/userinfo.email
    https://www.googleapis.com/auth/payments.make_payments');
  define('SCRIPT_URL',
      'https://wallet.google.com/online/v2/merchant/merchant.js');
}
define('CLIENT_ID', 'OAUTH_CLIENT_ID');
define('ORIGIN', 'ORIGIN_URL');
define('URI_LENGTH',1);
