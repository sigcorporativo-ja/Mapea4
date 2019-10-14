/**
 * @module M/impl/control/Mouse
 */
import { createStringXY } from 'ol/coordinate';
import { extend, isNullOrEmpty } from 'M/util/Utils';
import { get as getProj } from 'ol/proj';
import * as EventType from 'M/event/eventtype';
import OLControlMousePosition from '../ext/OLMouse';
/**
 * @classdesc
 * @api
 */
class Mouse extends OLControlMousePosition {
  constructor(options, vendorOptions) {
    super();
    /**
     * Coordinates spatial reference system
     *
     * @type { ProjectionLike } https://openlayers.org/en/latest/apidoc/module-ol_proj.html#~ProjectionLike
     * @private
     */
    this.srs_ = options.srs;
    /**
     * Label to show
     *
     * @type {string}
     * @private
     */
    this.label_ = options.label;
    /**
     * Precision of coordinates
     *
     * @private
     * @type {number}
     */
    this.precision_ = options.precision;

    /**
     * Vendor options for the base library
     * @private
     * @type {Object}
     */
    this.vendorOptions_ = vendorOptions;
  }
  /**
   * This function adds the control to the specified map
   *
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {HTMLElement} html of the plugin
   * @api
   */
  addTo(map, html) {
    this.facadeMap_ = map;
    OLControlMousePosition.call(this, extend({
      coordinateFormat: createStringXY(this.precision_ || 4),
      projection: this.srs_ || map.getProjection().code,
      label: this.label_,
      undefinedHTML: '',
      className: 'm-mouse-position g-cartografia-flecha',
      target: html,
    }, this.vendorOptions_, true));
    map.getMapImpl().addControl(this);

    // update projection mouse only if the projection was no specified
    if (isNullOrEmpty(this.vendorOptions_.projection) && isNullOrEmpty(this.srs_)) {
      map.getImpl().on(EventType.CHANGE, () => {
        this.mousePositionControl.setProjection(getProj(map.getProjection().code));
      });
    }
  }

  /**
   * This function destroys this control, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api
   * @export
   */
  destroy() {
    this.facadeMap_.getMapImpl().removeControl(this);
    this.facadeMap_ = null;
  }
}

export default Mouse;
