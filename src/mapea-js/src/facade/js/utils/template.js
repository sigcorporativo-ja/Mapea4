import Remote from('./remote.js');
import Handlebars from "handlebars";
import Helpers from('./handlebarshelpers.js');
import Utils from("../utils/utils.js");
import Exception from("../exception/exception.js");
import Config from("../../../configuration.js");


/**
 * @namespace M.template
 */
export class Template {
  /**
   * This object stores the requested templates
   * caching and reducing the code
   *
   * @private
   * @type {Object}
   */
  Template.templates_ = {};

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
  static compile(templatePath, options) {
    let templateVars = {};
    let parseToHtml;
    let jsonp;
    let scope;
    if (!Utils.isUndefined(options)) {
      templateVars = Utils.extends(templateVars, options.vars);
      parseToHtml = options.parseToHtml;
      jsonp = options.jsonp;
      scope = options.scope;
    }
    return (new Promise((success, fail) => {
      Template.get(templatePath, options).then((templateFn) => {
        let htmlText = templateFn.call(null, templateVars);
        if (parseToHtml !== false) {
          success.call(scope, Utils.stringToHtml(htmlText));
        } else {
          success.call(scope, htmlText);
        }
      });
    }));
  }

  /**
   * This function gets a template function of Handlebars
   * by its name
   *
   * @function
   * @param {string} templatePath name of the template
   * @returns {Promise} the promise with the handlebars function
   * @api stable
   */
  static get(templatePath, options) {
    let scope;
    if (!Utils.isUndefined(options)) {
      scope = options.scope;
    }
    return (new Promise((success, fail) => {
      var templateFn = Template.templates_[templatePath];
      if (!Utils.isUndefined(templateFn)) {
        success.call(scope, templateFn);
      } else {
        let templateUrl = templatePath;
        if (!Utils.isUndefined(options) && options.jsonp === true) {
          templateUrl = Template.getTemplateUrl_(templatePath);
        }
        let useJsonp = (!Utils.isNullOrEmpty(options) && (options.jsonp === true));
        Remote.get(templateUrl, null, {
          "jsonp": useJsonp
        }).then((response) => {
          templateFn = Handlebars.compile(response.text);
          Template.templates_[templatePath] = templateFn;
          success.call(scope, templateFn);
        });
      }
    }));
  }

  /**
   * This function adds a precompiled template into the
   * cached templates
   *
   * @function
   * @param {string} templatePath name of the template
   * @param {function} templateFn function of the precompiled template
   * @api stable
   */
  static add(templatePath, templateFn) {
    if (Utils.isUndefined(Template.templates_[templatePath])) {
      Template.templates_[templatePath] = templateFn;
    }
  }

  /**
   * This function gets the full URL of a template
   * by its name
   *
   * @function
   * @param {string} templatePath name of the template
   * @returns {string} full URL of the tempalte
   */
  static get templateUrl_(templatePath) {
    let templateUrl = null;
    if (!Utils.isNullOrEmpty(templatePath)) {
      templateUrl = Config.MAPEA_URL.concat(Config.TEMPLATES_PATH);
      templateUrl = templateUrl.concat(templatePath);
    }
    return templateUrl;
  };
}
