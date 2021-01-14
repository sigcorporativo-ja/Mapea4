/**
 * @module M/control/ScaleLine
 */
import 'assets/css/controls/scale.css';
import ScaleLineImpl from 'impl/control/ScaleLine.js';
import scalelineTemplate from 'templates/scaleline.html';
import ControlBase from './Control.js';
import { isUndefined } from '../util/Utils.js';
import Exception from '../exception/exception.js';
import { compileSync as compileTemplate } from '../util/Template.js';
import { getValue } from '../i18n/language.js';

/**
 * @classdesc
 * @api
 */
class ScaleLine extends ControlBase {
  /**
   * @constructor
   * @param {Object} vendorOptions vendor options for the base library
   * @extends {M.Control}
   * @api
   */
  constructor(vendorOptions = {}) {
    // implementation of this control
    const impl = new ScaleLineImpl(vendorOptions);

    // calls the super constructor
    super(impl, ScaleLine.NAME);

    if (isUndefined(ScaleLineImpl)) {
      Exception(getValue('exception').scaleline_method);
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
    return compileTemplate(scalelineTemplate);
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @function
   * @api
   */
  equals(obj) {
    const equals = (obj instanceof ScaleLine);
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
ScaleLine.NAME = 'scaleline';

export default ScaleLine;
