/**
 * @module M/geom
 */
import { normalize } from '../util/Utils';
import * as WKT from './WKT';
import * as WFS from './WFS';

/**
 * Parses the geometry
 * @public
 * @function
 * @param {string} rawType the type to be parsed
 * @api
 */
export const parse = (rawGeom) => {
  const parsedGeom = normalize(rawGeom, true);
  return WFS[parsedGeom];
};

/**
 * Parses the geometry
 * @public
 * @function
 * @param {string} rawType the type to be parsed
 * @api
 */
export const parseWFS = (wfsType) => {
  let parsedWFS;
  if (wfsType === WFS.POINT) {
    parsedWFS = WKT.POINT;
  } else if (wfsType === WFS.LINE) {
    parsedWFS = WKT.LINE_STRING;
  } else if (wfsType === WFS.POLYGON) {
    parsedWFS = WKT.POLYGON;
  } else if (wfsType === WFS.MPOINT) {
    parsedWFS = WFS.MULTI_POINT;
  } else if (wfsType === WFS.MLINE) {
    parsedWFS = WKT.MULTI_LINE_STRING;
  } else if (wfsType === WFS.MPOLYGON) {
    parsedWFS = WKT.MULTI_POLYGON;
  }
  return parsedWFS;
};
