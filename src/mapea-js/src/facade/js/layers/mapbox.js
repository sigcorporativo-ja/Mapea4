import LayerBase from('./layerbase.js');
import Utils from('../utils/utils.js');
import Exception from('../exception/exception.js');
import MapboxImpl from('../../../impl/js/layers/mapbox.js');
import LayerType from('./layertype.js');
import Layer from('../parameters/layers.js');
import Config from('../../../configuration.js');

export class Mapbox extends LayerBase {
  /**
   * @classdesc
   * Main constructor of the class. Creates a Mapbox layer
   * with parameters specified by the user
   *
   * @constructor
   * @extends {M.Layer}
   * @param {string|Mx.parameters.WMS} userParameters parameters
   * @param {Mx.parameters.LayerOptions} options provided by the user
   * @api stable
   */
  constructor(userParameters, options) {
    // calls the super constructor
    super(this, parameters, impl);

    // checks if the implementation can create Mapbox
    if (Utils.isUndefined(MapboxImpl)) {
      Exception('La implementación usada no puede crear capas Mapbox');
    }

    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(userParameters)) {
      Exception('No ha especificado ningún parámetro');
    }

    options = (options || {});

    /**
     * Implementation of this layer
     * @public
     * @type {M.layer.WMS}
     */
    let impl = new MapboxImpl(userParameters, options);
    //This layer is of parameters.
    let parameters = Layer(userParameters, LayerType.Mapbox);

    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(parameters.name)) {
      Exception('No ha especificado ningún nombre');
    }


    this.name = parameters.name;

    this.legend = parameters.legend;
    if (Utils.isNullOrEmpty(parameters.legend)) {
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
    return this.impl().url;
  }

  set url(newUrl) {
    if (!Utils.isNullOrEmpty(newUrl)) {
      this.impl().url = newUrl;
    } else {
      this.impl().url = Config.MAPBOX_URL;
    }
  }

  /**
   * 'tiled' the layer name
   */
  get transparent() {
    return this.impl().transparent;
  }

  set transparent(newTransparent) {
    if (!Utils.isNullOrEmpty(newTransparent)) {
      this.impl().transparent = newTransparent;
    } else {
      this.impl().transparent = false;
    }
  }

  /**
   * 'tiled' the layer name
   */
  get accessToken() {
    return this.impl().accessToken;
  }

  set accessToken(newAccessToken) {
    if (!Utils.isNullOrEmpty(newAccessToken)) {
      this.impl().accessToken = newAccessToken;
    } else {
      this.impl().accessToken = Config.MAPBOX_TOKEN_VALUE;
    }
  }

  /**
   * 'type' This property indicates if
   * the layer was selected
   */

  get type() {
    return LayerType.Mapbox;
  }

  set type() {
    if (!Utils.isUndefined(newType) &&
      !Utils.isNullOrEmpty(newType) && (newType !== LayerType.Mapbox)) {
      Exception('El tipo de capa debe ser \''.concat(LayerType.Mapbox).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
    }
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api stable
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
