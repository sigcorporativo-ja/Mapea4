export default class WKT {
  WKT.type_ = {
    "GEOMETRY": "Geometry",
    "POINT": "Point",
    "LINE_STRING": "LineString",
    "LINEAR_RING": "LinearRing",
    "POLYGON": "Polygon",
    "MULTI_POINT": "MultiPoint",
    "MULTI_LINE_STRING": "MultiLineString",
    "MUTLY_POLYGON": "MultiPolygon",
    "GEOMETRY_COLLECTION": "GeometryCollection",
    "CIRCLE": "Circle"
  };

  static getType() {
    return WKT.type_ = {
      "GEOMETRY": "Geometry",
      "POINT": "Point",
      "LINE_STRING": "LineString",
      "LINEAR_RING": "LinearRing",
      "POLYGON": "Polygon",
      "MULTI_POINT": "MultiPoint",
      "MULTI_LINE_STRING": "MultiLineString",
      "MUTLY_POLYGON": "MultiPolygon",
      "GEOMETRY_COLLECTION": "GeometryCollection",
      "CIRCLE": "Circle"
    };
  }
}
