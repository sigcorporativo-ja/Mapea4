import chroma from 'chroma-js';
import StylePoint from '../style/Point.js';
import StyleLine from '../style/Line.js';
import StylePolygon from '../style/Polygon.js';

/**
 * This functions returns random simple style
 * @function
 * @private
 * @param {M.Feature} feature
 * @return {M.style.Simple}
 */
const generateRandomStyle = (opts) => {
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

export default {
  generateRandomStyle,
};
