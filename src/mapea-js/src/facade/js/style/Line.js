import StyleLineImpl from 'impl/ol/js/style/Line';
import Simple from './Simple';
import Utils from '../util/Utils';

/**
 * @namespace Line
 */
export default class Line extends Simple {
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
  constructor(optionsVar) {
    let options = optionsVar;
    if (Utils.isNullOrEmpty(options)) {
      options = Line.DEFAULT_NULL;
    }
    options = Utils.extends({}, options);

    const impl = new StyleLineImpl(options);
    super(options, impl);
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
    this.getImpl().unapply(layer);
  }
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
    opacity: 0.4,
  },
  stroke: {
    color: '#3399CC',
    width: 1.5,
  },
};
