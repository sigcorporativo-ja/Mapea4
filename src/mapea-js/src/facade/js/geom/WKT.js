export default class WKT {
  static getType() {
    return WKT.type_;
  }
}

/**
 * WKT geometry type
 * @const
 * @type {object}
 * @public
 * @api stable
 */
WKT.type_ = {
  GEOMETRY: 'Geometry',
  POINT: 'Point',
  LINE_STRING: 'LineString',
  LINEAR_RING: 'LinearRing',
  POLYGON: 'Polygon',
  MULTI_POINT: 'MultiPoint',
  MULTI_LINE_STRING: 'MultiLineString',
  MUTLY_POLYGON: 'MultiPolygon',
  GEOMETRY_COLLECTION: 'GeometryCollection',
  CIRCLE: 'Circle',
};
