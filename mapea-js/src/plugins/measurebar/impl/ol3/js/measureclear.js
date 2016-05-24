goog.provide('P.impl.control.MeasureClear');

/**
 * @classdesc
 * Main constructor of the class. Creates a MeasureClear
 * control
 *
 * @constructor
 * @extends {ol.control.Control}
 * @api stable
 */
M.impl.control.MeasureClear = function (measureLengthControl, measureAreaControl) {
   /**
    * Template of the control
    * @private
    * @type {M.impl.Control}
    */
   this.measureLengthControl_ = measureLengthControl;

   /**
    * Template of the control
    * @private
    * @type {M.impl.Control}
    */
   this.measureAreaControl_ = measureAreaControl;
};
goog.inherits(M.impl.control.MeasureClear, M.impl.Control);

/**
 * This function adds the control to the specified map
 *
 * @public
 * @function
 * @param {M.Map} map to add the plugin
 * @param {function} template template of this control
 * @api stable
 */
M.impl.control.MeasureClear.prototype.addTo = function (map, element) {
   var button = element.getElementsByTagName('button')['m-measure-button'];
   goog.events.listen(button, goog.events.EventType.CLICK, this.onClick, false, this);

   ol.control.Control.call(this, {
      'element': element,
      'target': null
   });
   map.getMapImpl().addControl(this);
};

/**
 * This function adds the control to the specified map
 *
 * @public
 * @function
 * @param {M.Map} map to add the plugin
 * @param {function} template template of this control
 * @api stable
 */
M.impl.control.MeasureClear.prototype.onClick = function (map, element) {
   if (!M.utils.isNullOrEmpty(this.measureLengthControl_)) {
      this.measureLengthControl_.clear();
   }
   if (!M.utils.isNullOrEmpty(this.measureAreaControl_)) {
      this.measureAreaControl_.clear();
   }
};

/**
 * This function destroys this control, cleaning the HTML
 * and unregistering all events
 *
 * @public
 * @function
 * @api stable
 */
M.impl.control.MeasureClear.prototype.destroy = function () {
   this.facadeMap_.removeControl(this);
   this.facadeMap_ = null;
};