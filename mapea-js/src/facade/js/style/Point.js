/**
 * @module M/style/Point
 */
import StylePointImpl from 'impl/style/Point';
import Simple from './Simple';
import { isNullOrEmpty, extendsObj } from '../util/Utils';

/**
 * @classdesc
 * Creates a style point
 * @api
 */
class Point extends Simple {
  /**
   * @constructor
   * @extends {M.style.Simple}
   * @param {Object} options - options style
   * @api
   */
  constructor(optionsVar) {
    let options = optionsVar;
    if (isNullOrEmpty(options)) {
      options = Point.DEFAULT_NULL;
    } else {
      options = extendsObj(options, Point.DEFAULT);
    }
    options = extendsObj({}, options);

    const impl = new StylePointImpl(options);
    super(options, impl);
  }

  /**
   * @inheritDoc
   * @api
   */
  toImage() {
    return this.getImpl().toImage(this.canvas_);
  }
}

/**
 * Default options for this style
 * @const
 * @type {object}
 * @public
 * @api
 */
Point.DEFAULT = {
  radius: 5,
};

/**
 * Default options for this style
 * @const
 * @type {object}
 * @public
 * @api
 */
Point.DEFAULT_NULL = {
  fill: {
    color: 'rgba(255, 255, 255, 0.4)',
    opacity: 0.4,
  },
  stroke: {
    color: '#3399CC',
    width: 1.5,
  },
  radius: 5,
};

export default Point;
