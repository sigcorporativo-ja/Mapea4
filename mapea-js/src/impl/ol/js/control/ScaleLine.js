/**
 * @module M/impl/control/ScaleLine
 */
import OLControlScaleLine from 'ol/control/ScaleLine';

/**
 * @classdesc
 * Main constructor of the class. Creates a WMC selector
 * control
 * @api
 */
class ScaleLine extends OLControlScaleLine {
  /**
   * @constructor
   * @extends {ol.control.Control}
   * @api stable
   */
  constructor(vendorOptions) {
    super(vendorOptions);

    this.facadeMap_ = null;
  }

  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {function} template template of this control
   * @api stable
   */
  addTo(map, element) {
    this.facadeMap_ = map;
    map.getMapImpl().addControl(this);
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  getElement() {
    return this.element;
  }

  /**
   * This function destroys this control, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  destroy() {
    this.facadeMap_.getMapImpl().removeControl(this);
    this.facadeMap_ = null;
  }
}

export default ScaleLine;
