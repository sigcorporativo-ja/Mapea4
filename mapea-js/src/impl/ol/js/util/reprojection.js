import { transform, get } from 'ol/proj';

/**
 * @private
 * @function
 * @param {ProjectionLike} sourceProj
 * @param {ProjectionLike} destProj
 * @param {coordinates} coordinates - 1-dimensional array of two coordinates
 *
 */
const reproject = (coordinates, sourceProj, destProj) => {
  const source = get(sourceProj);
  const dest = get(destProj);
  return transform(coordinates, source, dest);
};


export default reproject;
