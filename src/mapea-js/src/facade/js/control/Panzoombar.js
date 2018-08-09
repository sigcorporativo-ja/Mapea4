/**
 * @module M/control/Panzoom
 */
import panzoombarTemplate from 'templates/panzoombar';
import PanzoombarImpl from 'impl/control/Panzoombar';
import ControlBase from './Control';
import { isUndefined } from '../util/Utils';
import Exception from '../exception/exception';
import Template from '../util/Template';

/**
 * @classdesc
 * @api
 */
class Panzoombar extends ControlBase {
  /**
   * @constructor
   * @param {String} format format response
   * @extends {M.Control}
   * @api stable
   */
  constructor() {
    // implementation of this control
    const impl = new PanzoombarImpl();

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
   * @api stable
   */
  createView(map) {
    return Template.compile(panzoombarTemplate);
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @function
   * @api stable
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
 * @api stable
 */
Panzoombar.NAME = 'panzoombar';

export default Panzoombar;
