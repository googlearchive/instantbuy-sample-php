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
 * Basic utility functions.
 */
require_once 'util.php';

/**
 * A simple class that creates a MaskedWallet request based on the parameters
 * namely estimatedTotalPrice and currencyCode
 */

class MaskedWallet {

  /**
   * Create masked wallet JWT.
   * @param Array Contains estimated total price and google transaction Id.
   */
  public static function post($input) {
    WalletUtil::assert_input($input, array('total'));
    $now = (int)date('U');
    $estimated_total_price = WalletUtil::to_dollars($input['total']);
    $mwr = array(
      'iat' => $now,
      'exp' => $now + 3600,
      'typ' => 'google/wallet/online/masked/v2/request',
      'aud' => 'Google',
      'iss' => MERCHANT_ID,
      'request' => array(
        'clientId' =>  CLIENT_ID,
        'merchantName' => MERCHANT_NAME,
        'origin' => ORIGIN,
         'pay' => array (
           'estimatedTotalPrice' => $estimated_total_price,
           'currencyCode' => CURRENCY_CODE,
          ),
          'ship' => new stdClass(),
      ),
    );
    if (isset($input['gid'])) {
      $mwr['request']['googleTransactionId'] = $input['gid'];
    }
    echo WalletUtil::encode_send_jwt($mwr);
  }

  /**
   * Create masked wallet JWT.
   * @param Array input value.
   */
  public static function put($input) {
    WalletUtil::assert_input($input, array('jwt', 'googleTransactionId'));
    $mwr = JWT::decode($input['jwt'], null, FALSE);
    $now = (int)date('U');
    $mwr['iat'] = $now;
    $mwr['exp'] = $now + 3600;
    $mwr['request']['googleTransactionId'] = $input['googleTransactionId'];
    $mwr['request']['ship'] = new stdClass();
    echo WalletUtil::encode_send_jwt($mwr);
  }
}
