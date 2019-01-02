/**
 * @module M/layer/Mapbox
 */
import MapboxImpl from 'impl/layer/Mapbox';
import LayerBase from './Layer';
import { isUndefined, isNullOrEmpty } from '../util/Utils';
import Exception from '../exception/exception';
import * as LayerType from './Type';
import * as parameter from '../parameter/parameter';
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
   * @param {string|Mx.parameters.WMS} userParameters parameters
   * @param {Mx.parameters.LayerOptions} options provided by the user
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
      Exception('La implementación usada no puede crear capas Mapbox');
    }

    // checks if the param is null or empty
    if (isNullOrEmpty(userParameters)) {
      Exception('No ha especificado ningún parámetro');
    }

    // checks if the param is null or empty
    if (isNullOrEmpty(parameters.name)) {
      Exception('No ha especificado ningún nombre');
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
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api
   */
  equals(obj) {
    let equals = false;

    if (obj instanceof Mapbox) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
      equals = equals && (this.options === obj.options);
    }
    return equals;
  }
}

export default Mapbox;
