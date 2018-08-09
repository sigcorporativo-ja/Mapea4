/**
 * @module M/control/Panzoom
 */
import panzoomTemplate from 'templates/panzoom';
import PanzoomImpl from 'impl/control/Panzoom';
import ControlBase from './Control';
import { isUndefined } from '../util/Utils';
import Exception from '../exception/exception';
import Template from '../util/Template';

/**
 * @classdesc
 * @api
 */
class Panzoom extends ControlBase {
  /**
   *
   * @constructor
   * @param {String} format format response
   * @extends {M.Control}
   * @api stable
   */
  constructor() {
    // implementation of this control
    const impl = new PanzoomImpl();

    // calls the super constructor
    super(impl, Panzoom.NAME);

    if (isUndefined(PanzoomImpl)) {
      Exception('La implementación usada no puede crear controles Panzoom');
    }
  }

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map map to add the control
   * @returns {Promise} html response
   * @api stable
   */
  createView(map) {
    return Template.compile(panzoomTemplate);
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @function
   * @api stable
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
 * @api stable
 */
Panzoom.NAME = 'panzoom';

export default Panzoom;
