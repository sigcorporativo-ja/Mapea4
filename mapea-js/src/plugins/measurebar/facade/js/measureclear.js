goog.provide('P.control.MeasureClear');

/**
 * @classdesc
 * Main constructor of the class. Creates a WMCSelector
 * control to provides a way to select an specific WMC
 *
 * @constructor
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
 * @param {M.Map} map to add the control
 * @api stable
 */
M.control.MeasureClear.prototype.createView = function (map) {
   return M.template.compile(M.control.MeasureClear.TEMPLATE);
};

/**
 * This function checks if an object is equals
 * to this control
 *
 * @function
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
 * function adds the event 'click'
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