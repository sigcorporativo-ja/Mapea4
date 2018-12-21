/**
 * @module M/impl/control/Mouse
 */
import { extend } from 'M/util/Utils';
import OLControlMousePosition from 'ol/control/MousePosition';
import { createStringXY as createStringXYCoordinate } from 'ol/coordinate';
import { get as getProj } from 'ol/proj';
import * as EventType from 'M/event/eventtype';

/**
 * @classdesc
 * @api
 */
class Mouse extends OLControlMousePosition {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WMC selector
   * control
   *
   * @constructor
   * @extends {ol.control.Control}
   * @param {Object} vendorOptions vendor options for the base library
   * @api stable
   */
  constructor(vendorOptions) {
    super(vendorOptions);

    /**
     * Vendor options for the base library
     * @private
     * @type {Object}
     */
    this.vendorOptions_ = vendorOptions;

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
    OLControlMousePosition.call(this, extend({
      coordinateFormat: createStringXYCoordinate(4),
      projection: map.getProjection().code,
      undefinedHTML: '',
      className: 'm-mouse-position g-cartografia-flecha',
    }, this.vendorOptions_, true));
    map.getMapImpl().addControl(this);

    // update projection mouse
    map.getImpl().on(EventType.CHANGE, () => {
      this.setProjection(getProj(map.getProjection().code));
    });
  }

  /**
   * function remove the event 'click'
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

export default Mouse;
