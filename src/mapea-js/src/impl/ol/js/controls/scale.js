import Control from "./controlbase";
import OLControl from "ol/control/Control";
import Utils from "facade/js/utils/utils";
/**
 * @namespace M.impl.control
 */
export default class Scale extends Control {
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

    let scaleId = 'm-scale-span';
    this.scaleContainer_ = element.querySelector('#'.concat(scaleId));

    OLControl.call(this, {
      'element': element,
      'render': this.render,
      'target': null
    });
    map.getMapImpl().addControl(this);
  }

  /**
   * Update the scale line element.
   * @param {ol.MapEvent} mapEvent Map event.
   * @this {ol.control.ScaleLine}
   * @api
   */
  render(mapEvent) {
    let frameState = mapEvent.frameState;
    if (!Utils.isNullOrEmpty(frameState)) {
      Scale.updateElement_(frameState.viewState, this.scaleContainer_, this.facadeMap_);
    }
  }

  /**
   * @private
   */
  static updateElement_(viewState, container, map) {
    container.innerHTML = map.getScale();
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
