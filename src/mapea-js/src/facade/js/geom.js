goog.provide('M.geom');
goog.provide('M.geom.wfs.type');
goog.provide('M.geom.wkt.type');
goog.provide('M.geom.geojson.type');

(function() {
  /**
   * WFS geometry type
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.geom.wfs.type.POINT = 'POINT';

  /**
   * WFS geometry type
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.geom.wfs.type.LINE = 'LINE';

  /**
   * WFS geometry type
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.geom.wfs.type.POLYGON = 'POLYGON';

  /**
   * WFS geometry type
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.geom.wfs.type.MPOINT = 'MPOINT';

  /**
   * WFS geometry type
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.geom.wfs.type.MLINE = 'MLINE';

  /**
   * WFS geometry type
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.geom.wfs.type.MPOLYGON = 'MPOLYGON';

  /**
   * WKT geometry type
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.geom.wkt.type.GEOMETRY = 'Geometry';

  /**
   * WKT geometry type
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.geom.wkt.type.POINT = 'Point';

  /**
   * WKT geometry type
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.geom.wkt.type.LINE_STRING = 'LineString';

  /**
   * WKT geometry type
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.geom.wkt.type.LINEAR_RING = 'LinearRing';

  /**
   * WKT geometry type
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.geom.wkt.type.POLYGON = 'Polygon';

  /**
   * WKT geometry type
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.geom.wkt.type.MULTI_POINT = 'MultiPoint';

  /**
   * WKT geometry type
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.geom.wkt.type.MULTI_LINE_STRING = 'MultiLineString';

  /**
   * WKT geometry type
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.geom.wkt.type.MULTI_POLYGON = 'MultiPolygon';

  /**
   * WKT geometry type
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.geom.wkt.type.GEOMETRY_COLLECTION = 'GeometryCollection';

  /**
   * WKT geometry type
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.geom.wkt.type.CIRCLE = 'Circle';

  /**
   *
   */
  M.geom.geojson.type.POINT = "Point";
  M.geom.geojson.type.MULTI_POINT = "MultiPoint";
  M.geom.geojson.type.LINE_STRING = "LineString";
  M.geom.geojson.type.MULTI_LINE_STRING = "MultiLineString";
  M.geom.geojson.type.POLYGON = "Polygon";
  M.geom.geojson.type.MULTI_POLYGON = "MultiPolygon";
  M.geom.geojson.type.GEOMETRY_COLLECTION = "GeometryCollection";

  /**
   * Parses the geometry
   * @public
   * @function
   * @param {string} rawType the type to be parsed
   * @api stable
   */
  M.geom.parse = function(rawGeom) {
    var parsedGeom = M.utils.normalize(rawGeom, true);
    return M.geom.wfs.type[parsedGeom];
  };

  /**
   * Parses the geometry
   * @public
   * @function
   * @param {string} rawType the type to be parsed
   * @api stable
   */
  M.geom.parseWFS = function(wfsType) {
    var parsedWFS;
    if (wfsType === M.geom.wfs.type.POINT) {
      parsedWFS = M.geom.wkt.type.POINT;
    }
    else if (wfsType === M.geom.wfs.type.LINE) {
      parsedWFS = M.geom.wkt.type.LINE_STRING;
    }
    else if (wfsType === M.geom.wfs.type.POLYGON) {
      parsedWFS = M.geom.wkt.type.POLYGON;
    }
    else if (wfsType === M.geom.wfs.type.MPOINT) {
      parsedWFS = M.geom.wkt.type.MULTI_POINT;
    }
    else if (wfsType === M.geom.wfs.type.MLINE) {
      parsedWFS = M.geom.wkt.type.MULTI_LINE_STRING;
    }
    else if (wfsType === M.geom.wfs.type.MPOLYGON) {
      parsedWFS = M.geom.wkt.type.MULTI_POLYGON;
    }
    return parsedWFS;
  };
})();
