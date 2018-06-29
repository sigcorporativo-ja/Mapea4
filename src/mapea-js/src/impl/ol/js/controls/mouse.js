import OLMousePosition from "ol/control/MousePosition";
import OLCoordinate from "ol/coordinate";
import OLProj from "ol/proj";

/**
 * @namespace M.impl.control
 */
export default class Mouse extends OLMousePosition {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WMC selector
   * control
   *
   * @constructor
   * @extends {ol.control.Control}
   * @api stable
   */
  constructor() {
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
    OLMousePosition.call(this, {
      'coordinateFormat': Coordinate.createStringXY(4),
      'projection': map.getProjection().code,
      'undefinedHTML': '',
      'className': 'm-mouse-position g-cartografia-flecha'
    });
    map.getMapImpl().addControl(this);

    // update projection mouse
    map.getImpl().on(Evt.CHANGE, () => {
      this.setProjection(OLProj.get(map.getProjection().code));
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
