import Utils from('./utils/utils.js');

export class Geom {
  /**
   * WFS geometry type
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  Geom.wfs.type.POINT = 'POINT';

  /**
   * WFS geometry type
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  Geom.wfs.type.LINE = 'LINE';

  /**
   * WFS geometry type
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  Geom.wfs.type.POLYGON = 'POLYGON';

  /**
   * WFS geometry type
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  Geom.wfs.type.MPOINT = 'MPOINT';

  /**
   * WFS geometry type
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  Geom.wfs.type.MLINE = 'MLINE';

  /**
   * WFS geometry type
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  Geom.wfs.type.MPOLYGON = 'MPOLYGON';

  /**
   * WKT geometry type
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  Geom.wkt.type.GEOMETRY = 'Geometry';

  /**
   * WKT geometry type
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  Geom.wkt.type.POINT = 'Point';

  /**
   * WKT geometry type
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  Geom.wkt.type.LINE_STRING = 'LineString';

  /**
   * WKT geometry type
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  Geom.wkt.type.LINEAR_RING = 'LinearRing';

  /**
   * WKT geometry type
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  Geom.wkt.type.POLYGON = 'Polygon';

  /**
   * WKT geometry type
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  Geom.wkt.type.MULTI_POINT = 'MultiPoint';

  /**
   * WKT geometry type
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  Geom.wkt.type.MULTI_LINE_STRING = 'MultiLineString';

  /**
   * WKT geometry type
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  Geom.wkt.type.MULTI_POLYGON = 'MultiPolygon';

  /**
   * WKT geometry type
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  Geom.wkt.type.GEOMETRY_COLLECTION = 'GeometryCollection';

  /**
   * WKT geometry type
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  Geom.wkt.type.CIRCLE = 'Circle';

  /**
   *
   */
  Geom.geojson.type.POINT = "Point";
  Geom.geojson.type.MULTI_POINT = "MultiPoint";
  Geom.geojson.type.LINE_STRING = "LineString";
  Geom.geojson.type.MULTI_LINE_STRING = "MultiLineString";
  Geom.geojson.type.POLYGON = "Polygon";
  Geom.geojson.type.MULTI_POLYGON = "MultiPolygon";
  Geom.geojson.type.GEOMETRY_COLLECTION = "GeometryCollection";

  /**
   * Parses the geometry
   * @public
   * @function
   * @param {string} rawType the type to be parsed
   * @api stable
   */
  parse(rawGeom) {
    let parsedGeom = Utils.normalize(rawGeom, true);
    return Geom.wfs.type[parsedGeom];
  }

  /**
   * Parses the geometry
   * @public
   * @function
   * @param {string} rawType the type to be parsed
   * @api stable
   */
  parseWFS(wfsType) {
    let parsedWFS;
    if (wfsType === Geom.wfs.type.POINT) {
      parsedWFS = Geom.wkt.type.POINT;
    } else if (wfsType === Geom.wfs.type.LINE) {
      parsedWFS = Geom.wkt.type.LINE_STRING;
    } else if (wfsType === Geom.wfs.type.POLYGON) {
      parsedWFS = Geom.wkt.type.POLYGON;
    } else if (wfsType === Geom.wfs.type.MPOINT) {
      parsedWFS = Geom.wkt.type.MULTI_POINT;
    } else if (wfsType === Geom.wfs.type.MLINE) {
      parsedWFS = Geom.wkt.type.MULTI_LINE_STRING;
    } else if (wfsType === Geom.wfs.type.MPOLYGON) {
      parsedWFS = Geom.wkt.type.MULTI_POLYGON;
    }
    return parsedWFS;
  }
}
