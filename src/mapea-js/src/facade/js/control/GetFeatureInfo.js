/**
 * @module M/control/GetFeatureInfo
 */
import 'assets/css/controls/getfeatureinfo';
import GetFeatureInfoImpl from 'impl/control/GetFeatureInfo';
import getfeatureinfoTemplate from 'templates/getfeatureinfo';
import ControlBase from './Control';
import { isUndefined } from '../util/Utils';
import Exception from '../exception/exception';
import { compile as compileTemplate } from '../util/Template';

/**
 * @classdesc
 * @api
 */
class GetFeatureInfo extends ControlBase {
  /**
   * @constructor
   * @param {string} format - Format response
   * @param {object} options - Control options
   * @extends {M.Control}
   * @api
   */
  constructor(format, options = {}) {
    // implementation of this control
    const impl = new GetFeatureInfoImpl(format, options);
    // calls the super constructor
    super(impl, GetFeatureInfo.NAME);

    if (isUndefined(GetFeatureInfoImpl)) {
      Exception('La implementación usada no puede crear controles GetFeatureInfo');
    }
  }

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map - Facade map
   * @returns {Promise} HTML template
   * @api
   */
  createView(map) {
    return compileTemplate(getfeatureinfoTemplate);
  }

  /**
   * This function returns the HTML button control.
   *
   * @public
   * @function
   * @param {HTMLElement} element - Template control
   * @returns {HTMLElement} HTML control button
   * @api
   * @export
   */
  getActivationButton(element) {
    return element.querySelector('button#m-getfeatureinfo-button');
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @public
   * @function
   * @param {*} obj - Object to compare
   * @returns {boolean} equals - Returns if they are equal or not
   * @api
   */
  equals(obj) {
    let equals = false;
    if (obj instanceof GetFeatureInfo) {
      equals = (this.name === obj.name);
    }
    return equals;
  }
}

/**
 * Name to identify this control
 * @const
 * @type {string}
 * @public
 * @api
 */
GetFeatureInfo.NAME = 'getfeatureinfo';

/**
 * Title for the popup
 * @const
 * @type {string}
 * @public
 * @api
 */
GetFeatureInfo.POPUP_TITLE = 'Información';

export default GetFeatureInfo;
