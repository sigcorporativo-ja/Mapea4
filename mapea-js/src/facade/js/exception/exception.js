goog.provide('M.exception');

(function (window) {
   'use strict';

   /**
    * This function shows the message of the error
    *
    * @public
    * @function
    * @param {string} msg the message of the error
    * @api stable
    */
   M.exception = function (msg) {
      /*var console = window.console;

      if (console && console.error) {
         console.error(msg);
      }
      else if (console && console.log) {
         console.log("Error: " + msg);
      }*/
      throw msg;
   };

})(window || {});