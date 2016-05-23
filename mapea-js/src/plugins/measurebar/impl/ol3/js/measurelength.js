goog.provide('P.impl.control.MeasureLength');

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
M.impl.control.MeasureLength = function () {
   this.helpMsg_ = 'Click to start drawing';
   this.helpMsgContinue_ = 'Click to continue drawing the line';

   goog.base(this, 'LineString');
};
goog.inherits(M.impl.control.MeasureLength, M.impl.control.Measure);


/**
 * Handle pointer move.
 * @param {ol.MapBrowserEvent} evt
 */
M.impl.control.MeasureLength.prototype.formatGeometry = function (geometry) {
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
 * Handle pointer move.
 * @param {ol.MapBrowserEvent} evt
 */
M.impl.control.MeasureLength.prototype.getTooltipCoordinate = function (geometry) {
   return geometry.getLastCoordinate();
};