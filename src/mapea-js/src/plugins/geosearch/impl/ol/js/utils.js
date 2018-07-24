export default class UtilsGeosearch {
  static getCentroidCoordinate(geometry) {
    let centroid;
    let coordinates;
    let medianIdx;
    let points;
    let lineStrings;
    let geometries;

    // POINT
    if (geometry.getType() === M.geom.wkt.type.POINT) {
      centroid = geometry.getCoordinates();
    }
    // LINE
    else if (geometry.getType() === M.geom.wkt.type.LINE_STRING) {
      coordinates = geometry.getCoordinates();
      medianIdx = Math.floor(coordinates.length / 2);
      centroid = coordinates[medianIdx];
    }
    else if (geometry.getType() === M.geom.wkt.type.LINEAR_RING) {
      coordinates = geometry.getCoordinates();
      medianIdx = Math.floor(coordinates.length / 2);
      centroid = coordinates[medianIdx];
    }
    // POLYGON
    else if (geometry.getType() === M.geom.wkt.type.POLYGON) {
      centroid = UtilsGeosearch.getCentroidCoordinate(geometry.getInteriorPoint());
    }
    // MULTI
    else if (geometry.getType() === M.geom.wkt.type.MULTI_POINT) {
      points = geometry.getPoints();
      medianIdx = Math.floor(points.length / 2);
      centroid = UtilsGeosearch.getCentroidCoordinate(points[medianIdx]);
    }
    else if (geometry.getType() === M.geom.wkt.type.MULTI_LINE_STRING) {
      lineStrings = geometry.getLineStrings();
      medianIdx = Math.floor(lineStrings.length / 2);
      centroid = UtilsGeosearch.getCentroidCoordinate(lineStrings[medianIdx]);
    }
    else if (geometry.getType() === M.geom.wkt.type.MULTI_POLYGON) {
      points = geometry.getInteriorPoints();
      centroid = UtilsGeosearch.getCentroidCoordinate(points);
    }
    else if (geometry.getType() === M.geom.wkt.type.CIRCLE) {
      centroid = geometry.getCenter();
    }
    else if (geometry.getType() === M.geom.wkt.type.GEOMETRY_COLLECTION) {
      geometries = geometry.getGeometries();
      medianIdx = Math.floor(geometries.length / 2);
      centroid = UtilsGeosearch.getCentroidCoordinate(geometries[medianIdx]);
    }
    return centroid;
  }
}
