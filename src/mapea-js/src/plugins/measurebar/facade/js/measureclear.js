goog.provide('P.control.MeasureClear');

/**
 * @classdesc
 * Main constructor of the class. Creates a MeasureClear
 * control to provides clean items drawn on the map
 *
 * @constructor
 * @param {M.control.Measure} measureLengthControl - Control measure distances
 * @param {M.control.Measure} measureAreaControl - Control measure areas
 * @extends {M.Control}
 * @api stable
 */
M.control.MeasureClear = (function (measureLengthControl, measureAreaControl) {
  // checks if the implementation can create MeasureClear
  if (M.utils.isUndefined(M.impl.control.MeasureClear)) {
    M.exception('La implementación usada no puede crear controles MeasureClear');
  }

  // implementation of this control
  var impl = new M.impl.control.MeasureClear(measureLengthControl.getImpl(), measureAreaControl.getImpl());

  // calls the super constructor
  goog.base(this, impl, M.control.MeasureClear.NAME);
});
goog.inherits(M.control.MeasureClear, M.Control);

/**
 * This function creates the view to the specified map
 *
 * @public
 * @function
 * @param {M.Map} map - Map to add the control
 * @returns {Promise} HTML template
 * @api stable
 */
M.control.MeasureClear.prototype.createView = function (map) {
  return M.template.compile(M.control.MeasureClear.TEMPLATE, {
    'jsonp': true
  });
};

/**
 * This function checks if an object is equals
 * to this control
 *
 * @public
 * @function
 * @param {*} obj - Object to compare
 * @returns {boolean} equals - Returns if they are equal or not
 * @api stable
 */
M.control.MeasureClear.prototype.equals = function (obj) {
  var equals = false;
  if (obj instanceof M.control.MeasureClear) {
    equals = (this.name === obj.name);
  }
  return equals;
};

/**
 * This function destroys this plugin
 *
 * @public
 * @function
 * @api stable
 */
M.control.MeasureClear.prototype.destroy = function () {
  this.getImpl().destroy();
  this.impl = null;
};

/**
 * Name to identify this control
 * @const
 * @type {string}
 * @public
 * @api stable
 */
M.control.MeasureClear.NAME = 'measurebar';

/**
 * Template for this controls
 * @const
 * @type {string}
 * @public
 * @api stable
 */
M.control.MeasureClear.TEMPLATE = 'measureclear.html';
