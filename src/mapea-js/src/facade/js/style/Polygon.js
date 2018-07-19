import PolygonImpl from 'impl/ol/js/style/Polygon';
import Simple from './Simple';
import Utils from '../util/Utils';

/**
 * @namespace M.style.Polygon
 */
export default class Polygon extends Simple {
  /**
   * @classdesc
   * Creates a style polygon
   * @constructor
   * @extends {M.style.Simple}
   * @param {Object} options - options style
   * @api stable
   */
  constructor(optionsPara) {
    let options = optionsPara;

    const impl = new PolygonImpl(options);

    super(options, impl);

    if (Utils.isNullOrEmpty(options)) {
      options = Polygon.DEFAULT_NULL;
    }
    options = Utils.extends({}, options);
  }
}

/**
 * Default options for this style
 * @const
 * @type {object}
 * @public
 * @api stable
 */
Polygon.DEFAULT_NULL = {
  fill: {
    color: 'rgba(255, 255, 255, 0.4)',
    opacity: 0.4,
  },
  stroke: {
    color: '#3399CC',
    width: 1.5,
  },
};
