goog.provide('M.impl.format.GML');

goog.require('ol.format.GML');

/**
 * @classdesc
 * Feature format for reading and writing data in the GeoJSON format.
 *
 * @constructor
 * @extends {ol.format.JSONFeature}
 * @param {olx.format.GeoJSONOptions=} opt_options Options.
 * @api stable
 */
M.impl.format.GML = function (opt_options) {
  var options = opt_options ? opt_options : {};
  goog.base(this, options);
};
goog.inherits(M.impl.format.GML, ol.format.GML);
