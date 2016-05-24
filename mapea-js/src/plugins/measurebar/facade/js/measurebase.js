goog.provide('P.control.Measure');

/**
 * @classdesc
 * Main constructor of the class. Creates a WMCSelector
 * control to provides a way to select an specific WMC
 *
 * @constructor
 * @extends {M.Control}
 * @api stable
 */
M.control.Measure = (function(impl, template) {
   /**
    * Template of the control
    * @private
    * @type {String}
    */
   this.template_ = template;

   goog.base(this, impl, M.control.Measure.NAME);
});
goog.inherits(M.control.Measure, M.Control);

/**
 * This function creates the view to the specified map
 *
 * @public
 * @function
 * @param {M.Map} map to add the control
 * @api stable
 */
M.control.Measure.prototype.createView = function(map) {
   return M.template.compile(this.template_, {
      'jsonp': true
   });
};

/**
 * TODO
 *
 * @public
 * @function
 * @param {HTMLElement} html to add the plugin
 * @api stable
 * @export
 */
M.control.Measure.prototype.getActivationButton = function(element) {
   return element.querySelector('button#m-measure-button');
};

/**
 * This function checks if an object is equals
 * to this control
 *
 * @function
 * @api stable
 */
M.control.Measure.prototype.equals = function(obj) {
   var equals = false;
   if (obj instanceof M.control.Measure) {
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
M.control.Measure.prototype.destroy = function() {
   this.getImpl().destroy();
   this.template_ = null;
   this.impl = null;
};

/**
 * Name to identify this control
 * @const
 * @type {string}
 * @public
 * @api stable
 */
M.control.Measure.NAME = 'measurebar';

/**
 * Template for this controls
 * @const
 * @type {string}
 * @public
 * @api stable
 */
M.control.Measure.POINTER_TOOLTIP_TEMPLATE = 'measure_pointer_tooltip.html';

/**
 * Template for this controls
 * @const
 * @type {string}
 * @public
 * @api stable
 */
M.control.Measure.MEASURE_TOOLTIP_TEMPLATE = 'measure_tooltip.html';

/**
 * Help message
 * @const
 * @type {string}
 * @public
 * @api stable
 */
M.control.Measure.HELP_MESSAGE = 'Click para empezar a dibujar';