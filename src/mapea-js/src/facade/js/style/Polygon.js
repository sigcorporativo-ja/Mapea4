/**
 * @module M/style/Polygon
 */
import PolygonImpl from 'impl/style/Polygon';
import Simple from './Simple';
import { isNullOrEmpty, extendsObj } from '../util/Utils';

/**
 * @classdesc
 * Creates a style polygon
 * @api
 */
class Polygon extends Simple {
  /**
   * @constructor
   * @extends {M.style.Simple}
   * @param {Object} options - options style
   * @api
   */
  constructor(optionsParam = {}) {
    let options = optionsParam;

    const impl = new PolygonImpl(options);

    super(options, impl);

    if (isNullOrEmpty(options)) {
      options = Polygon.DEFAULT_NULL;
    }
    options = extendsObj({}, options);
  }
}

/**
 * Default options for this style
 * @const
 * @type {object}
 * @public
 * @api
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

export default Polygon;
