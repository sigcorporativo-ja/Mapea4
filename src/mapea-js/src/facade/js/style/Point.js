import Simple from "./Simple";
import Utils from '../util/Utils';
import StylePointImpl from '../../../impl/ol/js/style/Point';

export default class Point extends Simple {
  /**
   * @classdesc
   * Creates a style point
   * @constructor
   * @extends {M.style.Simple}
   * @param {Object} options - options style
   * @api stable
   */
  constructor(options) {
    if (Utils.isNullOrEmpty(options)) {
      options = Point.DEFAULT_NULL;
    }
    else {
      options = Utils.extends(options, Point.DEFAULT);
    }
    options = Utils.extends({}, options);

    let impl = new StylePointImpl(options);

    super(options, impl);
  }

  /**
   * @inheritDoc
   * @api stable
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
 * @api stable
 */
Point.DEFAULT = {
  radius: 5,
};

/**
 * Default options for this style
 * @const
 * @type {object}
 * @public
 * @api stable
 */
Point.DEFAULT_NULL = {
  fill: {
    color: 'rgba(255, 255, 255, 0.4)',
    opacity: 0.4
  },
  stroke: {
    color: "#3399CC",
    width: 1.5
  },
  radius: 5,
};
