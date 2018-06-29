import Simple from('./stylesimple.js');
import Utils from('../utils/utils.js');
import LineImpl from('../../../impl/js/style/styleline.js');

/**
 * @namespace Line
 */
export class Line extends Simple {

  /**
   * @classdesc
   * TODO Main constructor of the class. Creates a categoryStyle
   * with parameters specified by the user
   * for the implementation
   * provided by the user
   *
   * @constructor
   * @extends {M.style.Simple}
   * @param {options} userParameters parameters
   * @api stable
   */
  constructor(options) {
    super(this, options, impl);
    if (Utils.isNullOrEmpty(options)) {
      options = Line.DEFAULT_NULL;
    }
    options = Utils.extends({}, options);
    let impl = new LineImpl(options);
  }

  /**
   * This function apply style
   *
   * @function
   * @protected
   * @param {M.layer.Vector} layer - Layer to apply the styles
   * @api stable
   */
  unapply(layer) {
    this.impl().unapply(layer);
  }

  /**
   * Default options for this style
   * @const
   * @type {object}
   * @public
   * @api stable
   */
  Line.DEFAULT_NULL = {
    fill: {
      color: 'rgba(255, 255, 255, 0.4)',
      opacity: 0.4
    },
    stroke: {
      color: "#3399CC",
      width: 1.5
    }
  };
}
