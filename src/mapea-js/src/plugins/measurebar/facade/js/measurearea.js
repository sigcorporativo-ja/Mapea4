goog.provide('P.control.MeasureArea');

goog.require('P.control.Measure');

/**
 * @classdesc
 * Main constructor of the class. Creates a MeasureLength
 * control to provides measure areas
 *
 * @constructor
 * @extends {M.control.Measure}
 * @api stable
 */
M.control.MeasureArea = (function() {
   // checks if the implementation can create WMC layers
   if (M.utils.isUndefined(M.impl.control.MeasureArea)) {
      M.exception('La implementación usada no puede crear controles MeasureArea');
   }

   // implementation of this control
   var impl = new M.impl.control.MeasureArea();

   // calls the super constructor
   goog.base(this, impl, M.control.MeasureArea.TEMPLATE);
});
goog.inherits(M.control.MeasureArea, M.control.Measure);

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
M.control.MeasureArea.prototype.equals = function(obj) {
   var equals = false;
   if (obj instanceof M.control.MeasureArea) {
      equals = (this.name === obj.name);
   }
   return equals;
};

/**
 * Template for this controls
 * @const
 * @type {string}
 * @public
 * @api stable
 */
M.control.MeasureArea.TEMPLATE = 'measurearea.html';

/**
 * Help message
 * @const
 * @type {string}
 * @public
 * @api stable
 */
M.control.MeasureArea.HELP_KEEP_MESSAGE = 'Click para continuar dibujando el área';