/**
 * @module M/control/Mouse
 */
import 'assets/css/controls/mouse';
import mouseTemplate from 'templates/mouse';
import MouseImpl from 'impl/control/Mouse';
import ControlBase from './Control';
import { isUndefined, isNullOrEmpty } from '../util/Utils';
import Exception from '../exception/exception';
import { compileSync as compileTemplate } from '../util/Template';
import { getValue } from '../i18n/language';

/**
 * @classdesc
 * Main constructor of the class. Creates a GetFeatureInfo
 * control to provides a popup with information about the place
 * where the user has clicked inside the map.
 * @api
 */
class Mouse extends ControlBase {
  /**
   *
   * @constructor
   * @param {String} format format response
   * @param {Object} vendorOptions vendor options for the base library
   * @extends {M.Control}
   * @api
   */
  constructor(options = {}, vendorOptions = {}) {
    // implementation of this control
    const impl = new MouseImpl(options, vendorOptions);

    // calls the super constructor
    super(impl, Mouse.NAME);

    if (isUndefined(MouseImpl)) {
      Exception(getValue('exception').mouse_method);
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
    const template = compileTemplate(mouseTemplate);
    return template;
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @function
   * @api
   */
  equals(obj) {
    return obj instanceof Mouse;
  }

  /**
   * Destroys the control
   *
   * @public
   * @function
   * @api
   */
  destroy() {
    super.destroy();
    const panel = this.getPanel();
    if (!isNullOrEmpty(panel)) {
      panel.removeClassName('m-with-mouse');
    }
  }
}

/**
 * Template for this controls - button
 * @const
 * @type {string}
 * @public
 * @api
 */
Mouse.NAME = 'mouse';

export default Mouse;
