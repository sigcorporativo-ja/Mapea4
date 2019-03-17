import chroma from 'chroma-js';
import StylePoint from '../style/Point';
import StyleLine from '../style/Line';
import StylePolygon from '../style/Polygon';

/**
 * This functions returns random simple style
 * @function
 * @private
 * @param {M.Feature} feature
 * @return {M.style.Simple}
 */
export const generateRandomStyle = (opts) => {
  const radius = opts.radius;
  const fillColor = chroma.random().hex();
  const strokeColor = opts.strokeColor;
  const strokeWidth = opts.strokeWidth;
  const geometry = opts.feature
    .getGeometry()
    .type;
  let style;
  let options;
  switch (geometry) {
    case 'Point':
    case 'MultiPoint':
      options = {
        radius,
        fill: {
          color: fillColor,
        },
        stroke: {
          color: strokeColor,
          width: strokeWidth,
        },
      };
      style = new StylePoint(options);
      break;
    case 'LineString':
    case 'MultiLineString':
      options = {
        fill: {
          color: fillColor,
        },
        stroke: {
          color: strokeColor,
          width: strokeWidth,
        },
      };
      style = new StyleLine(options);
      break;
    case 'Polygon':
    case 'MultiPolygon':
      options = {
        fill: {
          color: fillColor,
        },
        stroke: {
          color: strokeColor,
          width: strokeWidth,
        },
      };
      style = new StylePolygon(options);
      break;
    default:
      style = null;
  }
  return style;
};


/**
 * This function returns the appropiate style to geomtry layer
 * with parameter options.
 * @function
 * @private
 * @param {object} options - style options
 * @param {M.layer.Vector} layer -
 * @return {M.style.Simple}
 */
export const generateStyleLayer = (options, layer) => {
  let style;
  switch (layer.getGeometryType()) {
    case 'Point':
    case 'MultiPoint':
      style = new StylePoint(options);
      break;
    case 'LineString':
    case 'MultiLineString':
      style = new StyleLine(options);
      break;
    case 'Polygon':
    case 'MultiPolygon':
      style = new StylePolygon(options);
      break;
    default:
      return null;
  }
  return style;
};
