import OLControl from 'ol/control/Control';

/**
 * @namespace M.impl.control
 */
export default class Control extends OLControl {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WMC selector
   * control
   *
   * @constructor
   * @extends {OLControl}
   * @api stable
   */
  constructor() {
    super({});
    /**
     * @private
     * @type {string}
     * @expose
     */
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
   * @export
   */
  addTo(map, element) {
    this.facadeMap_ = map;
    OLControl.call(this, {
      element,
      target: null,
    });
    map.getMapImpl().addControl(this);
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
}
