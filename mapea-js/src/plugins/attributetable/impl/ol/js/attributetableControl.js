export default class AttributeTableControlImpl extends M.impl.Control {
  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {HTMLElement} html of the plugin
   * @api stable
   */
  addTo(map, html) {
    super.addTo(map, html);
  }

  /**
   * This function destroys this control
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.facadeMap_.getMapImpl().removeControl(this);
  }

  /**
   * LayerSwitcher panel id
   * @const
   * @type {string}
   * @public
   * @api stable
   */
}

AttributeTableControlImpl.PANEL_ID = 'm-attibutetable-panel';
