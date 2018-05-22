goog.provide('M.template');

goog.require('M.Handlebars');
goog.require('M.Handlebars.helpers');
goog.require('M.utils');
goog.require('M.exception');

/**
 * @namespace M.template
 */
(function(window) {
   /**
    * This object stores the requested templates
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
    * @param {Mx.parameters.TemplateOptions} options of the template compilation
    * @returns {Promise} the promise with the html resultant
    * @api stable
    */
   M.template.compile = function(templatePath, options) {
      let templateVars = {};
      var parseToHtml;
      var jsonp;
      var scope;
      if (!M.utils.isUndefined(options)) {
         templateVars = M.utils.extends(templateVars, options.vars);
         parseToHtml = options.parseToHtml;
         jsonp = options.jsonp;
         scope = options.scope;
      }
      return (new Promise(function(success, fail) {
         M.template.get(templatePath, options).then(function(templateFn) {
            var htmlText = templateFn.call(null, templateVars);
            if (parseToHtml !== false) {
               success.call(scope, M.utils.stringToHtml(htmlText));
            }
            else {
               success.call(scope, htmlText);
            }
         });
      }));
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
   M.template.get = function(templatePath, options) {
      var scope;
      if (!M.utils.isUndefined(options)) {
         scope = options.scope;
      }
      return (new Promise(function(success, fail) {
         var templateFn = M.template.templates_[templatePath];
         if (!M.utils.isUndefined(templateFn)) {
            success.call(scope, templateFn);
         }
         else {
            var templateUrl = templatePath;
            if (!M.utils.isUndefined(options) && options.jsonp === true) {
               templateUrl = M.template.getTemplateUrl_(templatePath);
            }
            var useJsonp = (!M.utils.isNullOrEmpty(options) && (options.jsonp === true));
            M.remote.get(templateUrl, null, {
               "jsonp": useJsonp
            }).then(function(response) {
               templateFn = Handlebars.compile(response.text);
               M.template.templates_[templatePath] = templateFn;
               success.call(scope, templateFn);
            });
         }
      }));
   };

   /**
    * This function adds a precompiled template into the
    * cached templates
    *
    * @function
    * @param {string} templatePath name of the template
    * @param {function} templateFn function of the precompiled template
    * @api stable
    */
   M.template.add = function(templatePath, templateFn) {
      if (M.utils.isUndefined(M.template.templates_[templatePath])) {
         M.template.templates_[templatePath] = templateFn;
      }
   };

   /**
    * This function gets the full URL of a template
    * by its name
    *
    * @function
    * @param {string} templatePath name of the template
    * @returns {string} full URL of the tempalte
    */
   M.template.getTemplateUrl_ = function(templatePath) {
      var templateUrl = null;
      if (!M.utils.isNullOrEmpty(templatePath)) {
         templateUrl = M.config.MAPEA_URL.concat(M.config.TEMPLATES_PATH);
         templateUrl = templateUrl.concat(templatePath);
      }
      return templateUrl;
   };
})(window || {});
