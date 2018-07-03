import Handlebars from "handlebars";
import Utils from("../utils/utils.js");

/**
 * @namespace M.Handlebars.helpers
 */
export class Helpers {
  /**
   * Helpers for Handlebars wich compares if the
   * first arguments is greater than the second one
   */
  Handlebars.registerHelper('gt', (arg1, arg2, options) => {
    if (arg1 > arg2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  /**
   * Helpers for Handlebars wich compares if the
   * first arguments is greater than the second one
   */
  Handlebars.registerHelper('lt', (arg1, arg2, options) => {
    if (arg1 < arg2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  /**
   * Helpers for Handlebars wich compares if the
   * first arguments is greater than the second one
   */
  Handlebars.registerHelper('eq', (arg1, arg2, options) => {
    if (Object.equals(arg1, arg2)) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  /**
   * Helpers for Handlebars wich compares if the
   * first arguments is greater than the second one
   */
  Handlebars.registerHelper('oneword', (arg1, options) => {
    if (!/\s/g.test(Utils.getTextFromHtml(arg1))) {
      return options.fn(this);
    }
    return options.inverse(this);
  });
}
