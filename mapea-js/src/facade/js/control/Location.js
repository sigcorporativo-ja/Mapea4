/**
 * @module M/control/Location
 */
import LocationImpl from 'impl/control/Location.js';
import locationTemplate from 'templates/location.html';
import 'assets/css/controls/location.css';
import { getValue } from '../i18n/language.js';
import ControlBase from './Control.js';
import { isUndefined } from '../util/Utils.js';
import Exception from '../exception/exception.js';
import { compileSync as compileTemplate } from '../util/Template.js';

/**
 * @classdesc
 * Main constructor of the class. Creates a Location
 * control that allows the user to locate and draw your
 * position on the map.
 * @api
 */
class Location extends ControlBase {
  /**
   * @constructor
   * @extends {M.Control}
   * @api
   */
  constructor(tracking = true, highAccuracy = false, vendorOptions = {}) {
    if (isUndefined(LocationImpl)) {
      Exception(getValue('exception').location_method);
    }

    // implementation of this control
    const impl = new LocationImpl(tracking, highAccuracy, 60000, vendorOptions);

    // calls the super constructor
    super(impl, Location.NAME);
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
    return compileTemplate(locationTemplate, {
      vars: {
        title: getValue('location').title,
      },
    });
  }

  /**
   * This function returns the HTML button control.
   *
   * @public
   * @function
   * @param {HTMLElement} element - Control template
   * @returns {HTMLElement} HTML control button
   * @api
   * @export
   */
  getActivationButton(element) {
    return element.querySelector('button#m-location-button');
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
    const equals = (obj instanceof Location);
    return equals;
  }

  /**
   * TODO
   */
  setTracking(tracking) {
    this.getImpl().tracking = tracking;
  }
}

/**
 * Name to identify this control
 * @const
 * @type {string}
 * @public
 * @api
 */
Location.NAME = 'location';

export default Location;
