goog.provide('P.impl.control.MeasureLength');

goog.require('P.impl.control.Measure');

/**
 * @classdesc
 * Main constructor of the class. Creates a MeasureLength
 * control
 *
 * @constructor
 * @extends {M.impl.control.Measure}
 * @api stable
 */
M.impl.control.MeasureLength = function() {
   /**
    * Help message
    * @private
    * @type {string}
    */
   this.helpMsg_ = M.control.Measure.HELP_MESSAGE;

   /**
    * Help message
    * @private
    * @type {string}
    */
   this.helpMsgContinue_ = M.control.MeasureLength.HELP_KEEP_MESSAGE;

   goog.base(this, 'LineString');
};
goog.inherits(M.impl.control.MeasureLength, M.impl.control.Measure);


/**
 * This function add tooltip with measure distance
 * @public
 * @param {ol.geom.SimpleGeometry} geometry - Object geometry
 * @return {string} output - Indicates the measure distance
 * @api stable
 */
M.impl.control.MeasureLength.prototype.formatGeometry = function(geometry) {
   var length = Math.round(geometry.getLength() * 100) / 100;
   var output;
   if (length > 100) {
      output = (Math.round(length / 1000 * 100) / 100) +
         ' ' + 'km';
   }
   else {
      output = (Math.round(length * 100) / 100) +
         ' ' + 'm';
   }
   return output;
};

/**
 * This function returns coordinates to tooltip
 * @public
 * @param {ol.geom.SimpleGeometry} geometry - Object geometry
 * @return {array} coordinates to tooltip
 * @api stable
 */
M.impl.control.MeasureLength.prototype.getTooltipCoordinate = function(geometry) {
   return geometry.getLastCoordinate();
};