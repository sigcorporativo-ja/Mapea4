/**
 * @module M/template
 */
import Handlebars from 'handlebars';
import { extendsObj, isUndefined, stringToHtml } from './Utils';
import './handlebarshelpers';

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
 * Async compile with the specified variables
 *
 * @function
 * @param {string} templatePath name of the template
 * This function gets a template by its name and
 * @param {Mx.parameters.TemplateOptions} options of the template compilation
 * @returns {Promise} The promise whith compile template html
 * @api
 */
export const compile = (string, options) => {
  return new Promise((resolve) => {
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
    resolve(template);
  });
};
