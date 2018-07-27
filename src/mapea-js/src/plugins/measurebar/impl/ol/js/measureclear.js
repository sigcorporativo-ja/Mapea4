/**
 * @classdesc
 * Main constructor of the class. Creates a MeasureClear
 * control
 *
 * @constructor
 * @extends {M.impl.Control}
 * @api stable
 */
export default class MeasureClear extends M.impl.Control {
  constructor(measureLengthControl, measureAreaControl) {
    super();

    /**
     * Implementation measureLength
     * @private
     * @type {M.impl.control.Measure}
     */
    this.measureLengthControl_ = measureLengthControl;

    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.facadeMap_ = null;

    /**
     * Implementation measureArea
     * @private
     * @type {M.impl.control.Measure}
     */
    this.measureAreaControl_ = measureAreaControl;
  }

  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map - Map to add the plugin
   * @param {HTMLElement} element - Container MeasureClear
   * @api stable
   */
  addTo(map, element) {
    this.facadeMap_ = map;
    const button = element.getElementsByTagName('button')['m-measure-button'];
    button.addEventListener('click', this.onClick);
    ol.control.Control.call(this, {
      element,
      target: null,
    });
    map.getMapImpl().addControl(this);
  }

  /**
   * This function remove items drawn on the map
   *
   * @public
   * @function
   * @api stable
   */
  onClick() {
    if (!M.utils.isNullOrEmpty(this.measureLengthControl_)) {
      this.measureLengthControl_.clear();
    }
    if (!M.utils.isNullOrEmpty(this.measureAreaControl_)) {
      this.measureAreaControl_.clear();
    }
  }

  /**
   * This function destroys this control and cleaning the HTML
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.element.remove();
    this.facadeMap_.removeControls(this);
    this.facadeMap_ = null;
  }
}
