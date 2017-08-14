goog.provide('M.impl.format.WKT');

goog.require('M.impl.format.GeoJSON');
goog.require('ol.format.WKT');

/**
 * @classdesc
 * Feature format for reading and writing data in the GeoJSON format.
 *
 * @constructor
 * @extends {ol.format.JSONFeature}
 * @param {olx.format.GeoJSONOptions=} opt_options Options.
 * @api stable
 */
M.impl.format.WKT = function(options = {}) {

  this.gjFormat_ = new M.impl.format.GeoJSON();

  goog.base(this, options);
};
goog.inherits(M.impl.format.WKT, ol.format.WKT);

/**
 * @inheritDoc
 */
M.impl.format.WKT.prototype.write = function(geometry) {
  let wktGeom;
  let olGeometry = this.gjFormat_.readGeometryFromObject(geometry);
  if (olGeometry.getType().toLowerCase() === "point") {
    let pointCoord = olGeometry.getCoordinates();
    olGeometry.setCoordinates([pointCoord[0], pointCoord[1]]);
  }
  wktGeom = this.writeGeometryText(olGeometry);
  return wktGeom;
};
