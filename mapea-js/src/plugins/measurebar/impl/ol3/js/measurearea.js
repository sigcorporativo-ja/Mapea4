goog.provide('P.impl.control.MeasureArea');

goog.require('P.impl.control.Measure');

/**
 * @classdesc
 * Main constructor of the class. Creates a MeasureArea
 * control
 *
 * @constructor
 * @extends {M.impl.control.Measure}
 * @api stable
 */
M.impl.control.MeasureArea = function() {
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
   this.helpMsgContinue_ = M.control.MeasureArea.HELP_KEEP_MESSAGE;

   goog.base(this, 'Polygon');
};
goog.inherits(M.impl.control.MeasureArea, M.impl.control.Measure);


/**
 * This function add tooltip with extent of the area
 * @public
 * @param {ol.geom.SimpleGeometry} geometry - Object geometry
 * @return {string} output - Indicate the extent of the area
 * @api stable
 */
M.impl.control.MeasureArea.prototype.formatGeometry = function(geometry) {
   var area = geometry.getArea();
   var output;
   if (area > 10000) {
      output = (Math.round(area / 1000000 * 100) / 100) +
         ' ' + 'km<sup>2</sup>';
   }
   else {
      output = (Math.round(area * 100) / 100) +
         ' ' + 'm<sup>2</sup>';
   }
   return output;
};

/**
 * This function returns coordinates to tooltip
 * @public
 * @param {ol.geom.Geometry} geometry - Object geometry
 * @return {array} coordinates to tooltip
 * @api stable
 */
M.impl.control.MeasureArea.prototype.getTooltipCoordinate = function(geometry) {
   return geometry.getInteriorPoint().getCoordinates();
};