export default class WFS {
  static getType() {
    return WFS.type_;
  }
}

/**
 * WFS geometry type
 * @const
 * @type {object}
 * @public
 * @api stable
 */
WFS.type_ = {
  POINT: 'POINT',
  LINE: 'LINE',
  POLYGON: 'POLYGON',
  MPOINT: 'MPOINT',
  MLINE: 'MLINE',
  MPOLYGON: 'MPOLYGON',
};
