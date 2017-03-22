goog.provide('M.Handlebars.helpers');

goog.require('M.Handlebars');

/**
 * @namespace M.Handlebars.helpers
 */
(function(window) {
   /**
    * Helpers for Handlebars wich compares if the
    * first arguments is greater than the second one
    */
   Handlebars.registerHelper('gt', function(arg1, arg2, options) {
      if (arg1 > arg2) {
         return options.fn(this);
      }
      return options.inverse(this);
   });

   /**
    * Helpers for Handlebars wich compares if the
    * first arguments is greater than the second one
    */
   Handlebars.registerHelper('lt', function(arg1, arg2, options) {
      if (arg1 < arg2) {
         return options.fn(this);
      }
      return options.inverse(this);
   });

   /**
    * Helpers for Handlebars wich compares if the
    * first arguments is greater than the second one
    */
   Handlebars.registerHelper('eq', function(arg1, arg2, options) {
      if (Object.equals(arg1, arg2)) {
         return options.fn(this);
      }
      return options.inverse(this);
   });

   /**
    * Helpers for Handlebars wich compares if the
    * first arguments is greater than the second one
    */
   Handlebars.registerHelper('oneword', function(arg1, options) {
      if (!/\s/g.test(M.utils.getTextFromHtml(arg1))) {
         return options.fn(this);
      }
      return options.inverse(this);
   });
})(window || {});