export default class AttributeTableControl extends M.impl.Control {
  /**
   * @classdesc
   * Main constructor of the AttributeTableControl.
   *
   * @constructor
   * @extends {M.impl.Control}
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
   * @param {HTMLElement} html of the plugin
   * @api stable
   */
  addTo(map, html) {
    super('addTo', map, html);
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

AttributeTableControl.PANEL_ID = 'm-attibutetable-panel';
