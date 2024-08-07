/**
 * @module M/style/Line
 */
import StyleLineImpl from 'impl/style/Line.js';
import Simple from './Simple.js';
import { isNullOrEmpty, extendsObj } from '../util/Utils.js';

/**
 * @classdesc
 * TODO Main constructor of the class. Creates a categoryStyle
 * with parameters specified by the user
 * @api
 */
class Line extends Simple {
  /**
   * @constructor
   * @extends {M.style.Simple}
   * @param {options} userParameters parameters
   * @api
   */
  constructor(optionsVar) {
    let options = optionsVar;
    if (isNullOrEmpty(options)) {
      options = Line.DEFAULT_NULL;
    }
    options = extendsObj({}, options);

    const impl = new StyleLineImpl(options);
    super(options, impl);
  }

  /**
   * This function apply style
   *
   * @function
   * @protected
   * @param {M.layer.Vector} layer - Layer to apply the styles
   * @api
   */
  unapply(layer) {
    this.getImpl().unapply(layer);
  }

  /**
   * TODO
   *
   * @function
   * @private
   */
  getDeserializedMethod_() {
    return "((serializedParameters) => M.style ? M.style.Simple.deserialize(serializedParameters, 'M.style.Line') : console.error('M.style is not defined'))";
  }
}

/**
 * Default options for this style
 * @const
 * @type {object}
 * @public
 * @api
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

export default Line;
