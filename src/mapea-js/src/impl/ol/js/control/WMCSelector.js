import Control from "./Control";

/**
 * @namespace M.impl.control
 */
export default class WMCSelector extends Control {
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
    super();
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
    let select = element.getElementsByTagName('select')[0];
    select.addEventListener('change', e => {
      let selectedWMCLayer = map.getWMC(e.target.options[e.target.selectedIndex].text)[0];
      selectedWMCLayer.select();
    });
    super.addTo(map, element);
  }
}