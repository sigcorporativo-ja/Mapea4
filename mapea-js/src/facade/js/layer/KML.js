/**
 * @module M/layer/KML
 */
import KMLImpl from 'impl/layer/KML.js';
import LayerVector from './Vector.js';
import { isNullOrEmpty, isUndefined, normalize, isString } from '../util/Utils.js';
import Exception from '../exception/exception.js';
import * as LayerType from './Type.js';
import * as parameter from '../parameter/parameter.js';
import { getValue } from '../i18n/language.js';

/**
 * @classdesc
 * Main constructor of the class. Creates a KML layer
 * with parameters specified by the user
 * @api
 */
class KML extends LayerVector {
  /**
   *
   * @constructor
   * @extends {M.layer.Vector}
   * @param {string|Mx.parameters.KML} userParameters parameters
   * @param {Mx.parameters.LayerOptions} options provided by the user
   * @param {Object} vendorOptions vendor options for the base library
   * @api
   */
  constructor(userParameters, options = {}, vendorOptions = {}) {
    // This layer is of parameters.
    const parameters = parameter.layer(userParameters, LayerType.KML);

    const newOpts = {
      ...options,
      label: parameters.label,
    };

    /**
     * Implementation of this layer
     * @public
     * @type {M.layer.KML}
     */
    const impl = new KMLImpl(newOpts, vendorOptions);

    // calls the super constructor
    super(parameters, options, undefined, impl);

    // checks if the implementation can create KML layers
    if (isUndefined(KMLImpl)) {
      Exception(getValue('exception').kmllayer_method);
    }

    // checks if the param is null or empty
    if (isNullOrEmpty(userParameters)) {
      Exception(getValue('exception').no_param);
    }

    // extract
    this.extract = parameters.extract;

    // options
    this.options = options;

    this.label = parameters.label;
  }

  /**
   * 'type' This property indicates if
   * the layer was selected
   */
  get type() {
    return LayerType.KML;
  }

  set type(newType) {
    if (!isUndefined(newType) &&
      !isNullOrEmpty(newType) && (newType !== LayerType.KML)) {
      Exception('El tipo de capa debe ser \''.concat(LayerType.KML).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
    }
  }

  /**
   * 'extract'
   */

  get extract() {
    return this.getImpl().extract;
  }

  set extract(newExtract) {
    if (!isNullOrEmpty(newExtract)) {
      if (isString(newExtract)) {
        this.getImpl().extract = (normalize(newExtract) === 'true');
      } else {
        this.getImpl().extract = newExtract;
      }
    } else {
      this.getImpl().extract = true;
    }
  }

  /**
   * 'options' the layer options
   */
  get options() {
    return this.getImpl().options;
  }

  set options(newOptions) {
    this.getImpl().options = newOptions;
  }

  /**
   * Checks if an object is equal to this layer. Two KML layers are equal if both of them
   * are instances of KML, and have the same 'name' and 'extract' attributes
   *
   * @function
   * @return {boolean} True if equal, false otherwise
   * @api
   */
  equals(obj) {
    let equals = false;

    if (obj instanceof KML) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
      equals = equals && (this.extract === obj.extract);
      equals = equals && (this.id === obj.id);
    }

    return equals;
  }
}

export default KML;
