import Handlebars from "handlebars";
import Utils from "../util/Utils";

/**
 * @namespace M.template
 */
export class Template {
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
    let jsonp;
    let scope;
    if (!Utils.isUndefined(options)) {
      templateVars = Utils.extends(templateVars, options.vars);
      parseToHtml = options.parseToHtml;
      jsonp = options.jsonp;
      scope = options.scope;
    }
    let templateFn = Handlebars.compile(string);
    let htmlText = templateFn.call(null, templateVars);
    if (parseToHtml !== false) {
      template = Utils.stringToHtml(htmlText);
    }
    else {
      template = htmlText;
    }
    return template;
  }
}
