/**
 * @module M/control/Navtoolbar
 */
import NavtoolbarImpl from 'impl/control/Navtoolbar.js';
import navtoolbarTemplate from 'templates/navtoolbar.html';
import ControlBase from './Control.js';
import { isUndefined } from '../util/Utils.js';
import Exception from '../exception/exception.js';
import { compileSync as compileTemplate } from '../util/Template.js';
import { getValue } from '../i18n/language.js';

/**
 * @classdesc
 * Main constructor of the class. Creates a GetFeatureInfo
 * control to provides a popup with information about the place
 * where the user has clicked inside the map.
 * @api
 */
class Navtoolbar extends ControlBase {
  /**
   * @constructor
   * @param {String} format format response
   * @extends {M.Control}
   * @api
   */
  constructor() {
    // implementation of this control
    const impl = new NavtoolbarImpl();

    // calls the super constructor
    super(impl, Navtoolbar.NAME);

    if (isUndefined(NavtoolbarImpl)) {
      Exception(getValue('exception').navtoolbar_method);
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
    return compileTemplate(navtoolbarTemplate);
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @function
   * @api
   */
  equals(obj) {
    const equals = (obj instanceof Navtoolbar);
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
Navtoolbar.NAME = 'navtoolbar';

export default Navtoolbar;
