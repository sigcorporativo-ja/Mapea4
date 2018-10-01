/**
 * @module M/control/Scale
 */
import 'assets/css/controls/scale';
import scaleTemplate from 'templates/scale';
import ScaleImpl from 'impl/control/Scale';
import ControlBase from './Control';
import { isUndefined } from '../util/Utils';
import Exception from '../exception/exception';
import { compileSync as compileTemplate } from '../util/Template';

/**
 * @classdesc
 * @api
 */
class Scale extends ControlBase {
  /**
   * @constructor
   * @param {String} format format response
   * @extends {M.Control}
   * @api
   */
  constructor() {
    // implementation of this control
    const impl = new ScaleImpl();

    // calls the super constructor
    super(impl, Scale.NAME);

    if (isUndefined(ScaleImpl)) {
      Exception('La implementación usada no puede crear controles Scale');
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
    return compileTemplate(scaleTemplate);
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @function
   * @api
   */
  equals(obj) {
    const equals = (obj instanceof Scale);
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
Scale.NAME = 'scale';

export default Scale;
