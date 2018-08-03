import { normalize } from '../util/Utils';
import WKT from './WKT';
import WFS from './WFS';

export default class Geom {
  /**
   * Parses the geometry
   * @public
   * @function
   * @param {string} rawType the type to be parsed
   * @api stable
   */
  static parse(rawGeom) {
    const parsedGeom = normalize(rawGeom, true);
    return WFS.type[parsedGeom];
  }

  /**
   * Parses the geometry
   * @public
   * @function
   * @param {string} rawType the type to be parsed
   * @api stable
   */
  static parseWFS(wfsType) {
    let parsedWFS;
    if (wfsType === WFS.type.POINT) {
      parsedWFS = WKT.type.POINT;
    } else if (wfsType === WFS.type.LINE) {
      parsedWFS = WKT.type.LINE_STRING;
    } else if (wfsType === WFS.type.POLYGON) {
      parsedWFS = WKT.type.POLYGON;
    } else if (wfsType === WFS.type.MPOINT) {
      parsedWFS = WFS.type.MULTI_POINT;
    } else if (wfsType === WFS.type.MLINE) {
      parsedWFS = WKT.type.MULTI_LINE_STRING;
    } else if (wfsType === WFS.type.MPOLYGON) {
      parsedWFS = WKT.type.MULTI_POLYGON;
    }
    return parsedWFS;
  }
}
