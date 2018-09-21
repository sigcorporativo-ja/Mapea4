/**
 * @module M/impl/control/WMCSelector
 */
import Control from './Control';

/**
 * @classdesc
 * Main constructor of the class. Creates a WMC selector control
 * @api
 */
class WMCSelector extends Control {
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
    const select = element.getElementsByTagName('select')[0];
    select.addEventListener('change', (e) => {
      const selectedWMCLayer = map.getWMC(e.target.options[e.target.selectedIndex].text)[0];
      selectedWMCLayer.select();
    });
    super.addTo(map, element);
  }
}

export default WMCSelector;
