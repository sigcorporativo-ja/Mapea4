goog.provide('M.template');

goog.require('M.Handlebars');
goog.require('M.Handlebars.helpers');
goog.require('M.utils');
goog.require('M.exception');

/**
 * @namespace M.template
 */
(function (window) {
   /**
    * This function stores the requested templates
    * caching and reducing the code
    *
    * @private
    * @type {Object}
    */
   M.template.templates_ = {};

   /**
    * This function gets a template by its name and
    * compiles with the specified variables
    *
    * @function
    * @param {string} templatePath name of the template
    * @param {Object} templateVars JSON with the variables for the template
    * @param {Object} opt_this scope
    * @returns {Promise} the promise with the html resultant
    * @api stable
    */
   M.template.compile = function (templatePath, templateVars, opt_this) {
      var compilePromise = new Promise(function (success, fail) {
         M.template.get(templatePath, opt_this).then(function (fn) {
            var htmlText = fn.call(null, templateVars);
            var html = M.utils.stringToHtml(htmlText);
            success.call(opt_this, html);
         });
      });
      return compilePromise;
   };

   /**
    * This function gets a template function of Handlebars
    * by its name
    *
    * @function
    * @param {string} templatePath name of the template
    * @returns {Promise} the promise with the handlebars function
    * @api stable
    */
   M.template.get = function (templatePath, opt_this) {
      var templatePromise = new Promise(function (success, fail) {
         var templateFn = M.template.templates_[templatePath];
         // checks if the template was already loaded
         if (!M.utils.isUndefined(templateFn)) {
            success.call(opt_this, templateFn);
         }
         else {
            // loads the template
            var templateUrl = M.template.getTemplateUrl_(templatePath);
            M.remote.get(templateUrl).then(function (response) {
               templateFn = Handlebars.compile(response.responseTxt);
               M.template.templates_[templatePath] = templateFn;
               success.call(opt_this, templateFn);
            });
         }
      });
      return templatePromise;
   };

   /**
    * This function gets the full URL of a template
    * by its name
    *
    * @function
    * @param {string} templatePath name of the template
    * @returns {string} full URL of the tempalte
    */
   M.template.getTemplateUrl_ = function (templatePath) {
      var templateUrl = null;
      if (!M.utils.isNullOrEmpty(templatePath)) {
         templateUrl = M.config.MAPEA_URL.concat(M.config.TEMPLATES_PATH);
         templateUrl = templateUrl.concat(templatePath);
      }
      return templateUrl;
   };
})(window || {});