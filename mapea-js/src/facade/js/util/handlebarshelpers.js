import Handlebars from 'handlebars';
import { getTextFromHtml } from './Utils.js';

const helpers = () => {
  /**
   * Helpers for Handlebars wich compares if the
   * first arguments is greater than the second one
   */
  Handlebars.registerHelper('gt', function gt(arg1, arg2, options) {
    if (arg1 > arg2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  /**
   * Helpers for Handlebars wich compares if the
   * first arguments is greater than the second one
   */
  Handlebars.registerHelper('lt', function lt(arg1, arg2, options) {
    if (arg1 < arg2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  /**
   * Helpers for Handlebars wich compares if the
   * first arguments is greater than the second one
   */
  Handlebars.registerHelper('eq', function eq(arg1, arg2, options) {
    if (Object.equals(arg1, arg2)) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  /**
   * Helpers for Handlebars wich compares if the
   * first arguments is greater than the second one
   */
  Handlebars.registerHelper('oneword', function oneword(arg1, options) {
    if (!/\s/g.test(getTextFromHtml(arg1))) {
      return options.fn(this);
    }
    return options.inverse(this);
  });
};
// Exec the register helpers
helpers();
