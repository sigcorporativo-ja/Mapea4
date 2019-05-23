/**
 * @module M/control/Rotate
 */
import 'assets/css/controls/rotate';
import RotateImpl from 'impl/control/Rotate';
import template from 'templates/rotate';
import ControlBase from './Control';
import { compileSync as compileTemplate } from '../util/Template';
import { isUndefined } from '../util/Utils';
import Exception from '../exception/exception';

/**
 * @classdesc
 * @api
 */
class Rotate extends ControlBase {
  /**
   * @constructor
   * @param {String} format format response
   * @extends {M.Control}
   * @api
   */
  constructor() {
    if (isUndefined(RotateImpl)) {
      Exception('La implementación usada no puede crear controles Scale');
    }

    // implementation of this control
    const impl = new RotateImpl();

    // calls the super constructor
    super(impl, Rotate.NAME);
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
    return compileTemplate(template);
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @function
   * @api
   */
  equals(obj) {
    const equals = (obj instanceof Rotate);
    return equals;
  }
}

/**
 * Name of the class
 * @const
 * @type {string}
 * @public
 * @api
 */
Rotate.NAME = 'rotate';

export default Rotate;
