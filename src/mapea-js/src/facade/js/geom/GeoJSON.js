export default class GeoJSON {
  get type() {
    return GeoJSON.type_;
  }
}

/**
 * GeoJSON geometry type
 * @const
 * @type {object}
 * @public
 * @api stable
 */
GeoJSON.type_ = {
  POINT: "Point",
  MULTI_POINT: "MultiPoint",
  LINE_STRING: "LineString",
  MULTI_LINE_STRING: "MultiLineString",
  POLYGON: "Polygon",
  MULTI_POLYGON: "MultiPolygon",
  GEOMETRY_COLLECTION: "GeometryCollection"
};