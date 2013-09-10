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
 * A Class that creates a full wallet request based on the parameters.
 */

class FullWallet {

  /**
   * Create full wallet JWT.
   * @param String Google transaction id.
   */
  public static function post($input) {
    $cartItems = json_decode($input['arrCart']);
    $subtotal = 0;
    if(isset($cartItems) && !empty($cartItems)) {
      $count = 0;
      foreach($cartItems as $item) {
        $data[$count++] = array(
          'description' => $item->name,
          'unitPrice' => WalletUtil::to_dollars($item->unitPrice),
          'quantity' => $item->quantity,
          'totalPrice' => WalletUtil::to_dollars($item->totalPrice));
        $subtotal += WalletUtil::to_dollars($item->totalPrice);
      }
    }
    $now = (int)date('U');
    $data[$count++] = array('description' => 'shipping detail',
        'totalPrice' => WalletUtil::to_dollars($input['shipping']),
        'role' => 'SHIPPING'
    );
    $data[$count] = array('description' => 'TAX',
        'totalPrice' => WalletUtil::to_dollars($input['tax']),
        'role' => 'TAX'
    );
    $fwr = array(
      'iat' => $now,
      'exp' => $now + 3600,
      'typ' => 'google/wallet/online/full/v2/request',
      'aud' => 'Google',
      'iss' => MERCHANT_ID,
      'request' => array(
        'merchantName' => MERCHANT_NAME,
        'googleTransactionId' => $input['gid'],
        'origin' => ORIGIN,
        'cart' => array(
          'totalPrice' => $subtotal +
            WalletUtil::to_dollars($input['shipping']) +
            WalletUtil::to_dollars($input['tax']),
          'currencyCode' => CURRENCY_CODE,
          'lineItems' => $data
        ),
      ),
    );
    $json = str_replace('\/', '/', json_encode($fwr));
    echo WalletUtil::encode_send_jwt($fwr);
  }
}
