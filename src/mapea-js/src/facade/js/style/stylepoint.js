import Simple from "./stylesimple";
import Utils from '../utils/utils';
import PointImpl from '../../../impl/js/style/point';

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

    let impl = new PointImpl(options);

    super(options, impl);

    if (Utils.isNullOrEmpty(options)) {
      options = Point.DEFAULT_NULL;
    } else {
      options = Utils.extends(options, Point.DEFAULT);
    }
    options = Utils.extends({}, options);
  }

  /**
   * @inheritDoc
   * @api stable
   */
  toImage() {
    return this.getImpl().toImage(this.canvas_);
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
}
