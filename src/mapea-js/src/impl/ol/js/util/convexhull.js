/**
 * TODO
 *
 * @private
 * @function
 */
const clockwise = (a, b, o) => {
  return (((a[0] - o[0]) * (b[1] - o[1])) - ((a[1] - o[1]) * (b[0] - o[0])) <= 0);
};

/**
 * TODO
 *
 * @public
 * @function
 * @api stable
 */
const coordinatesConvexHull = (points) => {
  // Sort by increasing x and then y coordinate
  points.sort((a, b) => {
    return a[0] === b[0] ? a[1] - b[1] : a[0] - b[0];
  });

  // Compute the lower hull
  const lower = [];
  for (let i = 0; i < points.length; i += 1) {
    while (
      lower.length >= 2 && clockwise(lower[lower.length - 2], lower[lower.length - 1], points[i])
    ) {
      lower.pop();
    }
    lower.push(points[i]);
  }

  // Compute the upper hull
  const upper = [];
  for (let i = points.length - 1; i >= 0; i -= 1) {
    while (
      upper.length >= 2 && clockwise(upper[upper.length - 2], upper[upper.length - 1], points[i])
    ) {
      upper.pop();
    }
    upper.push(points[i]);
  }

  upper.pop();
  lower.pop();
  return lower.concat(upper);
};

export default coordinatesConvexHull;
