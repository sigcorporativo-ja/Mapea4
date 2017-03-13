goog.provide('P.impl.control.MeasureClear');

/**
 * @classdesc
 * Main constructor of the class. Creates a MeasureClear
 * control
 *
 * @constructor
 * @extends {M.impl.Control}
 * @api stable
 */
M.impl.control.MeasureClear = function(measureLengthControl, measureAreaControl) {
   /**
    * Implementation measureLength
    * @private
    * @type {M.impl.control.Measure}
    */
   this.measureLengthControl_ = measureLengthControl;
   
   /**
    * Facade of the map
    * @private
    * @type {M.Map}
    */
   this.facadeMap_ = null;

   /**
    * Implementation measureArea
    * @private
    * @type {M.impl.control.Measure}
    */
   this.measureAreaControl_ = measureAreaControl;
};
goog.inherits(M.impl.control.MeasureClear, M.impl.Control);

/**
 * This function adds the control to the specified map
 *
 * @public
 * @function
 * @param {M.Map} map - Map to add the plugin
 * @param {HTMLElement} element - Container MeasureClear
 * @api stable
 */
M.impl.control.MeasureClear.prototype.addTo = function(map, element) {
   this.facadeMap_ = map;
   var button = element.getElementsByTagName('button')['m-measure-button'];
   goog.events.listen(button, goog.events.EventType.CLICK, this.onClick, false, this);

   ol.control.Control.call(this, {
      'element': element,
      'target': null
   });
   map.getMapImpl().addControl(this);
};

/**
 * This function remove items drawn on the map
 *
 * @public
 * @function
 * @api stable
 */
M.impl.control.MeasureClear.prototype.onClick = function() {
   if (!M.utils.isNullOrEmpty(this.measureLengthControl_)) {
      this.measureLengthControl_.clear();
   }
   if (!M.utils.isNullOrEmpty(this.measureAreaControl_)) {
      this.measureAreaControl_.clear();
   }
};

/**
 * This function destroys this control and cleaning the HTML
 *
 * @public
 * @function
 * @api stable
 */
M.impl.control.MeasureClear.prototype.destroy = function() {
   this.facadeMap_.removeControls(this);
   this.facadeMap_ = null;
};