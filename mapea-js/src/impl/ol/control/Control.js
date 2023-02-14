/**
 * @module M/impl/Control
 */
import OLControl from 'ol/control/Control';
/**
 * @classdesc
 * @api
 */
class Control extends OLControl {
  /**
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
    this.element = element;
    const control = new OLControl({
      element,
      target: null,
    });

    map.getMapImpl().addControl(control);
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

export default Control;
