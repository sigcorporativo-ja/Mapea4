import EvtManager from 'facade/js/event/Manager';

/**
 * @namespace M.impl.control
 */
export default class Mouse extends ol.control.MousePosition {
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
    super({});
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
    ol.control.MousePosition.call(this, {
      coordinateFormat: ol.coordinate.createStringXY(4),
      projection: map.getProjection().code,
      undefinedHTML: '',
      className: 'm-mouse-position g-cartografia-flecha',
    });
    map.getMapImpl().addControl(this);

    // update projection mouse
    map.getImpl().on(EvtManager.CHANGE, () => {
      this.setProjection(ol.proj.get(map.getProjection().code));
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
