goog.provide('P.impl.control.MeasureArea');

goog.require('P.impl.control.Measure');

/**
 * @classdesc
 * Main constructor of the class. Creates a WMC selector
 * control
 *
 * @constructor
 * @extends {M.impl.control.Measure}
 * @api stable
 */
M.impl.control.MeasureArea = function () {
   this.helpMsg_ = 'Click to start drawing';
   this.helpMsgContinue_ = 'Click to continue drawing the polygon';

   goog.base(this, 'Polygon');
};
goog.inherits(M.impl.control.MeasureArea, M.impl.control.Measure);


/**
 * Handle pointer move.
 * @param {ol.MapBrowserEvent} evt
 */
M.impl.control.MeasureArea.prototype.formatGeometry = function (geometry) {
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
 * Handle pointer move.
 * @param {ol.MapBrowserEvent} evt
 */
M.impl.control.MeasureArea.prototype.getTooltipCoordinate = function (geometry) {
   return geometry.getInteriorPoint().getCoordinates();
};