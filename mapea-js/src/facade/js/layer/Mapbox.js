/**
 * @module M/layer/Mapbox
 */
import MapboxImpl from 'impl/layer/Mapbox.js';
import LayerBase from './Layer.js';
import { isUndefined, isNullOrEmpty } from '../util/Utils.js';
import Exception from '../exception/exception.js';
import * as LayerType from './Type.js';
import * as parameter from '../parameter/parameter.js';
import { getValue } from '../i18n/language.js';

/**
 * @classdesc
 * Main constructor of the class. Creates a Mapbox layer
 * with parameters specified by the user
 * @api
 */
class Mapbox extends LayerBase {
  /**
   *
   * @constructor
   * @extends {M.Layer}
   * @param {string|Mx.parameters.Mapbox} userParameters parameters
   * @param {Mx.parameters.LayerOptions} options options provided by the user
   * @param {Object} vendorOptions vendor options for the base library
   * @api
   */
  constructor(userParameters, options = {}, vendorOptions = {}) {
    /**
     * Implementation of this layer
     * @public
     * @type {M.impl.layer.Mapbox}
     */
    const impl = new MapboxImpl(userParameters, options, vendorOptions);

    // This layer is of parameters.
    const parameters = parameter.layer(userParameters, LayerType.Mapbox);

    // calls the super constructor
    super(parameters, impl);

    // checks if the implementation can create Mapbox
    if (isUndefined(MapboxImpl)) {
      Exception(getValue('exception').mapbox_method);
    }

    // checks if the param is null or empty
    if (isNullOrEmpty(userParameters)) {
      Exception(getValue('exception').no_param);
    }

    // checks if the param is null or empty
    if (isNullOrEmpty(parameters.name)) {
      Exception(getValue('exception').no_name);
    }

    this.name = parameters.name;

    this.legend = parameters.legend;
    if (isNullOrEmpty(parameters.legend)) {
      this.legend = parameters.name;
    }

    // transparent
    this.transparent = parameters.transparent;

    // API Key token parameter
    this.accessToken = parameters.accessToken;

    // options
    this.options = options;
  }

  /**
   * 'url' The service URL of the
   * layer
   */
  get url() {
    return this.getImpl().url;
  }

  set url(newUrl) {
    if (!isNullOrEmpty(newUrl)) {
      this.getImpl().url = newUrl;
    } else {
      this.getImpl().url = M.config.MAPBOX_URL;
    }
  }

  /**
   * 'transparent'
   */
  get transparent() {
    return this.getImpl().transparent;
  }

  set transparent(newTransparent) {
    if (!isNullOrEmpty(newTransparent)) {
      this.getImpl().transparent = newTransparent;
    } else {
      this.getImpl().transparent = false;
    }
  }

  /**
   * 'accessToken'
   */
  get accessToken() {
    return this.getImpl().accessToken;
  }

  set accessToken(newAccessToken) {
    if (!isNullOrEmpty(newAccessToken)) {
      this.getImpl().accessToken = newAccessToken;
    } else {
      this.getImpl().accessToken = M.config.MAPBOX_TOKEN_VALUE;
    }
  }

  /**
   * 'type' This property indicates if
   * the layer was selected
   */
  get type() {
    return LayerType.Mapbox;
  }

  set type(newType) {
    if (!isUndefined(newType) &&
      !isNullOrEmpty(newType) && (newType !== LayerType.Mapbox)) {
      Exception('El tipo de capa debe ser \''.concat(LayerType.Mapbox).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
    }
  }

  /**
   * This function sets 
   * the tileLoadFunction
   * On the implementation
   *
   * @function
   * @public
   * @param {Function} func Function to override
   * @api
   */
  setTileLoadFunction(func){
    this.getImpl().setTileLoadFunction(func);
  }

  /**
   * Checks if an object is equal to this layer, which means that it is a Mapbox Layer instance and
   * has the same url, name and options.
   *
   * @function
   * @param {object} obj Object to compare
   * @return {boolean} True if equal, false otherwise
   * @api
   */
  equals(obj) {
    let equals = false;

    if (obj instanceof Mapbox) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
      equals = equals && (this.options === obj.options);
      equals = equals && (this.id === obj.id);
    }
    return equals;
  }
}

export default Mapbox;
