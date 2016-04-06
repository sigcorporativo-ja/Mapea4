goog.provide('M.exception');

goog.require('M.dialog');

(function(window) {
   'use strict';

   /**
    * This function shows the message of the error
    *
    * @public
    * @function
    * @param {string} msg the message of the error
    * @api stable
    */
   M.exception = function(msg) {
      throw msg;
   };

})(window || {});