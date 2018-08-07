export default class WFS {
  static get type() {
    return WFS.WFStype;
  }
}

/**
 * WFS geometry type
 * @const
 * @type {object}
 * @public
 * @api stable
 */
WFS.WFStype = {
  POINT: 'POINT',
  LINE: 'LINE',
  POLYGON: 'POLYGON',
  MPOINT: 'MPOINT',
  MLINE: 'MLINE',
  MPOLYGON: 'MPOLYGON',
};
