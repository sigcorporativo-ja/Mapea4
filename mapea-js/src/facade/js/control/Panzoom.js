/**
 * @module M/control/Panzoom
 */
import panzoomTemplate from 'templates/panzoom';
import PanzoomImpl from 'impl/control/Panzoom';
import ControlBase from './Control';
import { isUndefined } from '../util/Utils';
import Exception from '../exception/exception';
import { compileSync as compileTemplate } from '../util/Template';
import { getValue } from '../i18n/language';

/**
 * @classdesc
 * @api
 */
class Panzoom extends ControlBase {
  /**
   *
   * @constructor
   * @param {Object} vendorOptions vendor options for the base library
   * @extends {M.Control}
   * @api
   */
  constructor(vendorOptions = {}) {
    // implementation of this control
    const impl = new PanzoomImpl(vendorOptions);

    // calls the super constructor
    super(impl, Panzoom.NAME);

    if (isUndefined(PanzoomImpl)) {
      Exception(getValue('exception').panzoom_method);
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
    return compileTemplate(panzoomTemplate);
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @function
   * @api
   */
  equals(obj) {
    const equals = (obj instanceof Panzoom);
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
Panzoom.NAME = 'panzoom';

export default Panzoom;
