/**
 * @module M/style/Generic
 */
import GenericStyleImpl from 'impl/style/Generic.js';
import Simple from './Simple.js';
import { isNullOrEmpty, extendsObj } from '../util/Utils.js';

/**
 * @classdesc
 * Creates a generic style
 * @api
 */
class Generic extends Simple {
  /**
   * @constructor
   * @extends {M.style.Simple}
   * @param {Object} options - options style
   * @api
   */
  constructor(optionsVar) {
    let options = optionsVar;
    if (isNullOrEmpty(options)) {
      options = Generic.DEFAULT_NULL;
    } else {
      options = extendsObj(options, Generic.DEFAULT);
    }
    options = extendsObj({}, options);

    const impl = new GenericStyleImpl(options);
    super(options, impl);
  }

  /**
   * @inheritDoc
   * @api
   */
  toImage() {
    return this.getImpl().toImage(this.canvas_);
  }

  /**
   * TODO
   *
   * @function
   * @private
   */
  getDeserializedMethod_() {
    return "((serializedParameters) => M.style.Simple.deserialize(serializedParameters, 'M.style.Generic'))";
  }
}

/**
 * Default options for this style
 * @const
 * @type {object}
 * @public
 * @api
 */
Generic.DEFAULT = {
  point: {
    radius: 5,
  },
};

/**
 * Default parameters options for this style
 * @const
 * @type {object}
 */
Generic.PARAMS_DEFAULT_NULL = {
  fill: {
    color: 'rgba(255, 255, 255, 0.4)',
    opacity: 0.4,
  },
  stroke: {
    color: '#3399CC',
    width: 1.5,
  },
};

/**
 * Default options for this style
 * @const
 * @type {object}
 * @public
 * @api
 */
Generic.DEFAULT_NULL = {
  point: {
    ...Generic.PARAMS_DEFAULT_NULL,
    radius: 5,
  },
  line: {
    ...Generic.PARAMS_DEFAULT_NULL,
  },
  polygon: {
    ...Generic.PARAMS_DEFAULT_NULL,
  },
};

export default Generic;
