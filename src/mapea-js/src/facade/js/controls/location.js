import ControlBase from('./controlbase.js');
import Utils from('../utils/utils.js');
import Exception from('../exception/exception.js');
import Template from('../utils/template.js');
import LocationImpl from('../../../impl/js/controls/location.js');

export class Location extends ControlBase {
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
  constructor(tracking, highAccuracy) {
    // calls the super constructor
    super(this, impl, Location.NAME);

    tracking = tracking !== undefined ? tracking : true;
    highAccuracy = highAccuracy !== undefined ? highAccuracy : false;
    if (Utils.isUndefined(LocationImpl)) {
      Exception('La implementación usada no puede crear controles Location');
    }
    // implementation of this control
    let impl = new LocationImpl(tracking, highAccuracy, 60000);
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
    return Template.compile(Location.TEMPLATE, {
      'jsonp': true
    });
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
  get activationButton(element) {
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

  set tracking(tracking) {
    this.impl().tracking = tracking;
  }

  /**
   * Name to identify this control
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  Location.NAME = 'location';

  /**
   * Template for this controls - button
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  Location.TEMPLATE = 'location.html';
}
