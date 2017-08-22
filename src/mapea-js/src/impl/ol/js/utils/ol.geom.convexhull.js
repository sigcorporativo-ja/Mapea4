goog.provide('ol.geom.convexhull');

/**
 * @classdesc
 * Main constructor of the class. Creates interaction convexhull
 * control
 *
 * @constructor
 * @param {Object} options - ranges defined by user
 * @api stable
 */
(function(){

  /**
   * TODO
   *
   * @private
   * @function
   */
ol.coordinate.clockwise_ = function (a, b, o)
{	return ( (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]) <= 0 );
};

/**
 * TODO
 *
 * @public
 * @function
 * @api stable
 */
ol.coordinate.convexHull = function (points)
{	// Sort by increasing x and then y coordinate
	points.sort(function(a, b)
	{	return a[0] == b[0] ? a[1] - b[1] : a[0] - b[0];
	});

    // Compute the lower hull
	let lower = [];
	for (let i = 0; i < points.length; i++)
	{	while (lower.length >= 2 && ol.coordinate.clockwise_ (lower[lower.length - 2], lower[lower.length - 1], points[i]) )
		{	lower.pop();
		}
		lower.push(points[i]);
	}

    // Compute the upper hull
	let upper = [];
	for (let i = points.length - 1; i >= 0; i--)
	{	while (upper.length >= 2 && ol.coordinate.clockwise_ (upper[upper.length - 2], upper[upper.length - 1], points[i]) )
		{	upper.pop();
		}
		upper.push(points[i]);
	}

	upper.pop();
	lower.pop();
	return lower.concat(upper);
};

/**
 * TODO
 *
 * @private
 * @function
 */
ol.coordinate.getCoordinates_ = function(geom)
{	let h = [];
	switch (geom.getType())
	{	case "Point":
			h.push(geom.getCoordinates());
			break;
		case "LineString":
		case "LinearRing":
		case "MultiPoint":
			 h = geom.getCoordinates();
			break;
		case "MultiLineString":
			let p = geom.getLineStrings();
			for (let i=0; i<p.length; i++) h.concat(ol.coordinate.getCoordinates_(p[i]));
			break;
		case "Polygon":
			h = ol.coordinate.getCoordinates_(geom.getLinearRing(0));
			break;
		case "MultiPolygon":
			let p1 = geom.getPolygons();
			for (let i=0; i<p1.length; i++) h.concat(ol.coordinate.getCoordinates_(p1[i]));
			break;
		case "GeometryCollection":
			let p2 = geom.getGeometries();
			for (let i=0; i<p2.length; i++) h.concat(ol.coordinate.getCoordinates_(p2[i]));
			break;
		default:break;
	}
	return h;
};

/**
 * TODO
 *
 * @public
 * @function
 * @api stable
 */
ol.geom.Geometry.prototype.convexHull = function()
{	return ol.coordinate.convexHull( ol.coordinate.getCoordinates_(this) );
};


})();
