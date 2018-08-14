/**
 * @module M/control/ScaleLine
 */
import 'assets/css/controls/scale';
import ScaleLineImpl from 'impl/control/ScaleLine';
import scalelineTemplate from 'templates/scaleline';
import ControlBase from './Control';
import { isUndefined } from '../util/Utils';
import Exception from '../exception/exception';
import { compile as compileTemplate } from '../util/Template';

/**
 * @classdesc
 * @api
 */
class ScaleLine extends ControlBase {
  /**
   * @constructor
   * @param {String} format format response
   * @extends {M.Control}
   * @api
   */
  constructor() {
    // implementation of this control
    const impl = new ScaleLineImpl();

    // calls the super constructor
    super(impl, ScaleLine.NAME);

    if (isUndefined(ScaleLineImpl)) {
      Exception('La implementación usada no puede crear controles ScaleLine');
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
