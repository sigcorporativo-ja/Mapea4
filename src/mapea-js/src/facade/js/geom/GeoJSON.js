export default class GeoJSON {
  get type() {
    return GeoJSON.geojsonType;
  }
}

/**
 * GeoJSON geometry type
 * @const
 * @type {object}
 * @public
 * @api stable
 */
GeoJSON.geojsonType = {
  POINT: 'Point',
  MULTI_POINT: 'MultiPoint',
  LINE_STRING: 'LineString',
  MULTI_LINE_STRING: 'MultiLineString',
  POLYGON: 'Polygon',
  MULTI_POLYGON: 'MultiPolygon',
  GEOMETRY_COLLECTION: 'GeometryCollection',
};

export const POINT = 'Point';

export const MultiPoint = 'MultiPoint';
