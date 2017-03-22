goog.provide('P.control.MeasureLength');

goog.require('P.control.Measure');

/**
 * @classdesc
 * Main constructor of the class. Creates a MeasureLength
 * control to provides measure distances
 *
 * @constructor
 * @extends {M.control.Measure}
 * @api stable
 */
M.control.MeasureLength = (function() {
   // checks if the implementation can create WMC layers
   if (M.utils.isUndefined(M.impl.control.MeasureLength)) {
      M.exception('La implementación usada no puede crear controles MeasureLength');
   }

   // implementation of this control
   var impl = new M.impl.control.MeasureLength();

   // calls the super constructor
   goog.base(this, impl, M.control.MeasureLength.TEMPLATE);
});
goog.inherits(M.control.MeasureLength, M.control.Measure);

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
M.control.MeasureLength.prototype.equals = function(obj) {
   var equals = false;
   if (obj instanceof M.control.MeasureLength) {
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
M.control.MeasureLength.TEMPLATE = 'measurelength.html';

/**
 * Help message
 * @const
 * @type {string}
 * @public
 * @api stable
 */
M.control.MeasureLength.HELP_KEEP_MESSAGE = 'Click para continuar dibujando la línea';