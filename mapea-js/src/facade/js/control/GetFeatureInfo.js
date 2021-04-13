/**
 * @module M/control/GetFeatureInfo
 */
import 'assets/css/controls/getfeatureinfo.css';
import GetFeatureInfoImpl from 'impl/control/GetFeatureInfo.js';
import getfeatureinfoTemplate from 'templates/getfeatureinfo.html';
import ControlBase from './Control.js';
import { isUndefined } from '../util/Utils.js';
import Exception from '../exception/exception.js';
import { compileSync as compileTemplate } from '../util/Template.js';
import { getValue } from '../i18n/language.js';

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
      Exception(getValue('exception').getfeatureinfo_method);
    }

    /**
     * User format
     *
     * @public
     * @api
     * @type {string}
     */
    this.format = format;
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
    return compileTemplate(getfeatureinfoTemplate, {
      vars: {
        title: getValue('getfeatureinfo').title,
      },
    });
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
GetFeatureInfo.POPUP_TITLE = getValue('getfeatureinfo').info;

export default GetFeatureInfo;
