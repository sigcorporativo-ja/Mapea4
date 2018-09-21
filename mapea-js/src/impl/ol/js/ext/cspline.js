import OLGeomGeometry from 'ol/geom/Geometry';
import OLGeomGeometryCollection from 'ol/geom/GeometryCollection';
import OLGeomMultiLineString from 'ol/geom/MultiLineString';
import OLGeomPolygon from 'ol/geom/Polygon';
import OLGeomMultiPolygon from 'ol/geom/MultiPolygon';
import OLGeomLineString from 'ol/geom/LineString';

/** Create a cardinal spline version of this geometry.
 * Original https://github.com/epistemex/cardinal-spline-js
 * @see https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Cardinal_spline
 *
 * @param {} options
 * tension {Number} a [0,1] number / can be interpreted as the 'length' of the tangent, default 0.5
 * resolution {Number} size of segment to split
 * pointsPerSeg {Interger} number of points per segment to add if
 * no resolution is provided, default add 10 points per segment
 */
OLGeomGeometry.prototype.cspline = function cspline(options) {
  let geometry;
  if (this.calcCSpline) {
    if (this.csplineGeometryRevision !== this.getRevision() ||
      this.csplineOption !== JSON.stringify(options)) {
      this.csplineGeometry_ = this.calcCSpline(options);
      this.csplineGeometryRevision = this.getRevision();
      this.csplineOption = JSON.stringify(options);
      geometry = this.csplineGeometry_;
    }
  } else {
    // Default do nothing
    geometry = this;
  }
  return geometry;
};

/**
 * TODO
 */
OLGeomGeometryCollection.prototype.calcCSpline = function calcCSpline(options) {
  const splineGeom = [];
  const geometries = this.getGeometries();
  geometries.forEach(geometry => splineGeom.push(geometry.cspline()));
  const geom = new OLGeomGeometryCollection(splineGeom);
  return geom;
};

/**
 * TODO
 */
OLGeomMultiLineString.prototype.calcCSpline = function calcCSpline(options) {
  const splineGeom = [];
  const geometries = this.getLineStrings();
  geometries.forEach(geometry => splineGeom.push(geometry.cspline().getCoordinates()));
  const geom = new OLGeomMultiLineString(splineGeom);
  return geom;
};

/**
 * TODO
 */
OLGeomPolygon.prototype.calcCSpline = function calcCSpline(options) {
  const splineGeom = [];
  const geometries = this.getLineStrings();
  geometries.forEach(geometry => splineGeom.push(geometry.cspline().getCoordinates()));
  const geom = new OLGeomPolygon(splineGeom);
  return geom;
};

/**
 * TODO
 */
OLGeomMultiPolygon.prototype.calcCSpline = function calcCSpline(options) {
  const splineGeom = [];
  const geometries = this.getLineStrings();
  geometries.forEach(geometry => splineGeom.push(geometry.cspline().getCoordinates()));
  const geom = new OLGeomMultiPolygon(splineGeom);
  return geom;
};

/**
 * TODO
 */
const dist2d = (x1, y1, x2, y2) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt((dx * dx) + (dy * dy));
};

/**
 * TODO
 */
OLGeomLineString.prototype.calcCSpline = function calcCSpline(options = {}) {
  const line = this.getCoordinates();
  const tension = typeof options.tension === 'number' ? options.tension : 0.5;
  const resolution = options.resolution ||
    (this.getLength() / line.length / (options.pointsPerSeg || 10));

  const res = []; // clone array
  let x;
  let y; // our x,y coords
  let t1x;
  let t2x;
  let t1y;
  let t2y; // tension vectors
  let c1;
  let c2;
  let c3;
  let c4; // cardinal points
  let st;
  let t;
  let i; // steps based on num. of segments

  // clone array so we don't change the original
  //
  const pts = line.slice(0);

  // The algorithm require a previous and next point to the actual point array.
  // Check if we will draw closed or open curve.
  // If closed, copy end points to beginning and first points to end
  // If open, duplicate first points to befinning, end points to end
  if (line.length > 2 &&
    line[0][0] === line[line.length - 1][0] && line[0][1] === line[line.length - 1][1]) {
    pts.unshift(line[line.length - 2]);
    pts.push(line[1]);
  } else {
    pts.unshift(line[0]);
    pts.push(line[line.length - 1]);
  }


  // 1. loop goes through point array
  // 2. loop goes through each segment between the 2 pts + 1e point before and after
  for (i = 1; i < (pts.length - 2); i += 1) {
    const e1 = dist2d(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]);
    const numOfSegments = Math.round(e1 / resolution);

    let d = 1;
    if (options.normalize) {
      const d1 = dist2d(pts[i + 1][0], pts[i + 1][1], pts[i - 1][0], pts[i - 1][1]);
      const d2 = dist2d(pts[i + 2][0], pts[i + 2][1], pts[i][0], pts[i][1]);
      if (d1 < d2) d = d1 / d2;
      else d = d2 / d1;
    }

    // calc tension vectors
    t1x = (pts[i + 1][0] - pts[i - 1][0]) * tension * d;
    t2x = (pts[i + 2][0] - pts[i][0]) * tension * d;

    t1y = (pts[i + 1][1] - pts[i - 1][1]) * tension * d;
    t2y = (pts[i + 2][1] - pts[i][1]) * tension * d;

    for (t = 0; t <= numOfSegments; t += 1) { // calc step
      st = t / numOfSegments;

      // calc cardinals
      c1 = (2 * (st ** 3)) - ((3 * (st ** 2)) + 1);
      c2 = -(2 * (st ** 3)) + (3 * (st ** 2));
      c3 = (st ** 3) - ((2 * (st ** 2)) + st);
      c4 = (st ** 3) - (st ** 2);

      // calc x and y cords with common control vectors
      x = (c1 * pts[i][0]) + (c2 * pts[i + 1][0]) + (c3 * t1x) + (c4 * t2x);
      y = (c1 * pts[i][1]) + (c2 * pts[i + 1][1]) + (c3 * t1y) + (c4 * t2y);

      // store points in array
      res.push([x, y]);
    }
  }

  return new OLGeomLineString(res);
};
