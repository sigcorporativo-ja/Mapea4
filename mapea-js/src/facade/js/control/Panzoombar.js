/**
 * @module M/control/Panzoombar
 */
import panzoombarTemplate from 'templates/panzoombar.html';
import PanzoombarImpl from 'impl/control/Panzoombar.js';
import ControlBase from './Control.js';
import { isUndefined } from '../util/Utils.js';
import Exception from '../exception/exception.js';
import { compileSync as compileTemplate } from '../util/Template.js';
import { getValue } from '../i18n/language.js';

/**
 * @classdesc
 * @api
 */
class Panzoombar extends ControlBase {
  /**
   * @constructor
   * @param {Object} vendorOptions vendor options for the base library
   * @extends {M.Control}
   * @api
   */
  constructor(vendorOptions = {}) {
    // implementation of this control
    const impl = new PanzoombarImpl(vendorOptions);

    // calls the super constructor
    super(impl, Panzoombar.NAME);

    if (isUndefined(PanzoombarImpl)) {
      Exception(getValue('exception').panzoombar_method);
    }
  }

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map map to add the control
   * @returns {Promise} html response
   * @api
   */
  createView(map) {
    return compileTemplate(panzoombarTemplate);
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @function
   * @api
   */
  equals(obj) {
    const equals = (obj instanceof Panzoombar);
    return equals;
  }
}

/**
 * Template for this controls - button
 * @const
 * @type {string}
 * @public
 * @api
 */
Panzoombar.NAME = 'panzoombar';

export default Panzoombar;
