/**
 * @module M/template
 */
import Handlebars from 'handlebars';
import { get as remoteGet } from 'M/util/Remote';
import { isNullOrEmpty } from 'M/util/Utils';
import { extendsObj, isUndefined, stringToHtml } from './Utils';
import './handlebarshelpers';

/**
 * @const
 * @type {object}
 */
const templates = {};

/**
 * Sync compile with the specified variables
 *
 * @function
 * @param {string} templatePath name of the template
 * This function gets a template by its name and
 * @param {Mx.parameters.TemplateOptions} options of the template compilation
 * @returns {HTMLElement} the template resultant
 * @api
 */
export const compileSync = (string, options) => {
  let template;
  let templateVars = {};
  let parseToHtml;
  if (!isUndefined(options)) {
    templateVars = extendsObj(templateVars, options.vars);
    parseToHtml = options.parseToHtml;
  }
  const templateFn = Handlebars.compile(string);
  const htmlText = templateFn(templateVars);
  if (parseToHtml !== false) {
    template = stringToHtml(htmlText);
  } else {
    template = htmlText;
  }
  return template;
};

/**
 * This function gets the full URL of a template
 * by its name
 *
 * @function
 * @param {string} templatePath name of the template
 * @returns {string} full URL of the tempalte
 */
const getTemplateUrl = (templatePath) => {
  let templateUrl = null;
  if (!isNullOrEmpty(templatePath)) {
    templateUrl = M.config.MAPEA_URL.concat(M.config.TEMPLATES_PATH);
    templateUrl = templateUrl.concat(templatePath);
  }
  return templateUrl;
};

/**
 * This function gets a template function of Handlebars
 * by its name
 *
 * @function
 * @param {string} templatePath name of the template
 * @returns {Promise} the promise with the handlebars function
 * @api
 */
export const get = (templatePath, options) => {
  let scope;
  if (!isUndefined(options)) {
    scope = options.scope;
  }
  return (new Promise((success, fail) => {
    let templateFn = templates[templatePath];
    if (!isUndefined(templateFn)) {
      success.call(scope, templateFn);
    } else {
      let templateUrl = templatePath;
      if (!isUndefined(options) && options.jsonp === true) {
        templateUrl = getTemplateUrl(templatePath);
      }
      const useJsonp = (isNullOrEmpty(options) && (options.jsonp === true));
      remoteGet(templateUrl, null, {
        jsonp: useJsonp,
      }).then((response) => {
        templateFn = Handlebars.compile(response.text);
        templates[templatePath] = templateFn;
        success.call(scope, templateFn);
      });
    }
  }));
};

/**
 * Async compile with the specified variables
 *
 * @function
 * @param {string} templatePath name of the template
 * This function gets a template by its name and
 * @param {Mx.parameters.TemplateOptions} options of the template compilation
 * @returns {Promise} The promise whith compile template html
 * @api
 */
export const compile = (templatePath, options) => {
  let templateVars = {};
  let parseToHtml;
  let scope;
  if (!isUndefined(options)) {
    templateVars = extendsObj(templateVars, options.vars);
    parseToHtml = options.parseToHtml;
    scope = options.scope;
  }
  return (new Promise((success, fail) => {
    get(templatePath, options).then((templateFn) => {
      const htmlText = templateFn.call(null, templateVars);
      if (parseToHtml !== false) {
        success.call(scope, stringToHtml(htmlText));
      } else {
        success.call(scope, htmlText);
      }
    });
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
export const add = (templatePath, templateFn) => {
  if (isUndefined(templates[templatePath])) {
    templates[templatePath] = templateFn;
  }
};
