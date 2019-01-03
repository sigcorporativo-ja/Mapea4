/**
 * @module M/control/Panzoombar
 */
import panzoombarTemplate from 'templates/panzoombar';
import PanzoombarImpl from 'impl/control/Panzoombar';
import ControlBase from './Control';
import { isUndefined } from '../util/Utils';
import Exception from '../exception/exception';
import { compileSync as compileTemplate } from '../util/Template';

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
      Exception('La implementación usada no puede crear controles Panzoombar');
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
