/**
 * @module M.template
 */
import Handlebars from 'handlebars';
import { extendsObj, isUndefined, stringToHtml } from './Utils';
import './handlebarshelpers';

/**
 * compiles with the specified variables
 *
 * @function
 * @param {string} templatePath name of the template
 * This function gets a template by its name and
 * @param {Mx.parameters.TemplateOptions} options of the template compilation
 * @returns {Promise} the promise with the html resultant
 * @api stable
 */
const compile = (string, options) => {
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

export default compile;
