goog.provide('P.impl.control.AttributeTableControl');

/**
 * @classdesc
 * Main constructor of the AttributeTableControl.
 *
 * @constructor
 * @extends {M.impl.Control}
 * @api stable
 */
M.impl.control.AttributeTableControl = function () {
  goog.base(this);
};
goog.inherits(M.impl.control.AttributeTableControl, M.impl.Control);

/**
 * This function adds the control to the specified map
 *
 * @public
 * @function
 * @param {M.Map} map to add the plugin
 * @param {HTMLElement} html of the plugin
 * @api stable
 */
M.impl.control.AttributeTableControl.prototype.addTo = function (map, html) {
  goog.base(this, 'addTo', map, html);
};

/**
 * This function destroys this control
 *
 * @public
 * @function
 * @api stable
 */
M.impl.control.AttributeTableControl.destroy = function () {
  this.facadeMap_.getMapImpl().removeControl(this);
};

/**
 * LayerSwitcher panel id
 * @const
 * @type {string}
 * @public
 * @api stable
 */
M.impl.control.AttributeTableControl.PANEL_ID = 'm-attibutetable-panel';
