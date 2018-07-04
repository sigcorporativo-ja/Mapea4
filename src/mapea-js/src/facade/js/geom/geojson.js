export default class Geojson {
  Geojson.type_ = {
    "POINT": "Point",
    "MULTI_POINT": "MultiPoint",
    "LINE_STRING": "MultiLineString",
    "POLYGON": "Polygon",
    "MULTI_POLYGON": "MultiPolygon",
    "GEOMETRY_COLLECTION": "GeometryCollection"
  };

  static getType() {
    return WFS.type_ = {
      "POINT": "Point",
      "MULTI_POINT": "MultiPoint",
      "LINE_STRING": "MultiLineString",
      "POLYGON": "Polygon",
      "MULTI_POLYGON": "MultiPolygon",
      "GEOMETRY_COLLECTION": "GeometryCollection"
    };
  }
}
