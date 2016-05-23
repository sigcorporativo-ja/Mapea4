goog.provide('M.Handlebars.helpers');

goog.require('M.Handlebars');

/**
 * @namespace M.Handlebars.helpers
 */
(function (window) {
   /**
    * Helpers for Handlebars wich compares if the
    * first arguments is greater than the second one
    */
   Handlebars.registerHelper('gt', function (arg1, arg2, options) {
      if (arg1 > arg2) {
         return options.fn(this);
      }
      return options.inverse(this);
   });
})(window || {});