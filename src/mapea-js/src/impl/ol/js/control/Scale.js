/**
 * @module M/impl/control/Scale
 */
import { isNullOrEmpty } from 'facade/js/util/Utils';
import Control from './Control';

/**
 * @classdesc
 * Main constructor of the class. Creates a WMC selector
 * control
 * @api
 */
class Scale extends Control {
  /**
   * @constructor
   * @extends {ol.control.Control}
   * @api stable
   */
  constructor() {
    super();
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

    const scaleId = 'm-scale-span';
    this.scaleContainer_ = element.querySelector('#'.concat(scaleId));
    this.element = element;
    this.render = this.renderCB;
    this.target_ = null;
    map.getMapImpl().addControl(this);
  }

  /**
   * Update the scale line element.
   * @param {ol.MapEvent} mapEvent Map event.
   * @this {ol.control.ScaleLine}
   * @api
   */
  renderCB(mapEvent) {
    const frameState = mapEvent.frameState;
    if (!isNullOrEmpty(frameState)) {
      Scale.updateElement(frameState.viewState, this.scaleContainer_, this.facadeMap_);
    }
  }

  /**
   * @private
   */
  static updateElement(viewState, container, map) {
    const containerVariable = container;
    containerVariable.innerHTML = map.getScale();
  }

  /**
   * This function destroys this control, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    super.destroy();
    this.scaleContainer_ = null;
  }
}

export default Scale;
