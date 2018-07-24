import 'assets/css/controls/location';
import ControlBase from './Control';
import Utils from '../util/Utils';
import Exception from '../exception/exception';
import Template from '../util/Template';
import LocationImpl from 'impl/control/Location';
import locationTemplate from "templates/location.html";

export default class Location extends ControlBase {
  /**
   * @classdesc
   * Main constructor of the class. Creates a Location
   * control that allows the user to locate and draw your
   * position on the map.
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor(tracking = true, highAccuracy = false) {
    if (Utils.isUndefined(LocationImpl)) {
      Exception('La implementación usada no puede crear controles Location');
    }

    // implementation of this control
    let impl = new LocationImpl(tracking, highAccuracy, 60000);

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
   * @api stable
   */
  createView(map) {
    return Template.compile(locationTemplate);
  }

  /**
   * This function returns the HTML button control.
   *
   * @public
   * @function
   * @param {HTMLElement} element - Control template
   * @returns {HTMLElement} HTML control button
   * @api stable
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
   * @api stable
   */
  equals(obj) {
    let equals = (obj instanceof Location);
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
 * @api stable
 */
Location.NAME = 'location';
