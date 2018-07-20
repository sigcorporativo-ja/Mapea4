import Handlebars from 'handlebars';
import Utils from './Utils';
import './handlebarshelpers';

/**
 * @namespace M.template
 */
export default class Template {
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
  static compile(string, options) {
    let template;
    let templateVars = {};
    let parseToHtml;
    if (!Utils.isUndefined(options)) {
      templateVars = Utils.extends(templateVars, options.vars);
      parseToHtml = options.parseToHtml;
    }
    const templateFn = Handlebars.compile(string);
    const htmlText = templateFn.call(null, templateVars);
    if (parseToHtml !== false) {
      template = Utils.stringToHtml(htmlText);
    }
    else {
      template = htmlText;
    }
    return template;
  }
}
