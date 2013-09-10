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

class WalletUtil {

  /**
   * Get error message.
   * @param String Message.
   * @return String Error log message.
   */
  public static function log($msg) {
    error_log($msg);
  }

  /**
   * We use the dollar amounts as micro dollars to keep floating arithmetic sane.
   * @param Float Dollar value.
   * @return Float Formatted dollar value.
   */
  public static function to_dollars($dollars) {
    return number_format($dollars, 2, '.', '');
  }

  /**
   * Check mandatory input value.
   * @param Array input value.
   * @return Array required input value.
   */
  public static function assert_input($input, $required) {
    for($i=0; $i < sizeof($required); $i++) {
      if (!isset($input[$required[$i]])) {
        header('HTTP/1.0 400 Bad request', true, 400);
        echo "Did not receive $required[$i] in the request" ;
        exit();
      }
    }
  }

  /**
   * Encode wallet request into JWT format.
   * @param Array Wallet request.
   * @return String Encoded JWT.
   */
  public static function encode_send_jwt($json) {
    $jwt = JWT::encode($json, MERCHANT_SECRET);
    return $jwt;
  }
}
