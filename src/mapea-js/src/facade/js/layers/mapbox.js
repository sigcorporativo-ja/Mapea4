goog.provide('M.layer.Mapbox');

goog.require('M.Layer');
goog.require('M.utils');
goog.require('M.exception');

(function () {
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
  M.layer.Mapbox = (function (userParameters, options) {
    // checks if the implementation can create Mapbox
    if (M.utils.isUndefined(M.impl.layer.Mapbox)) {
      M.exception('La implementación usada no puede crear capas Mapbox');
    }

    // checks if the param is null or empty
    if (M.utils.isNullOrEmpty(userParameters)) {
      M.exception('No ha especificado ningún parámetro');
    }

    options = (options || {});

    /**
     * Implementation of this layer
     * @public
     * @type {M.layer.WMS}
     */
    var impl = new M.impl.layer.Mapbox(userParameters, options);

    var parameters = M.parameter.layer(userParameters, M.layer.type.Mapbox);

    // checks if the param is null or empty
    if (M.utils.isNullOrEmpty(parameters.name)) {
      M.exception('No ha especificado ningún nombre');
    }

    // calls the super constructor
    goog.base(this, parameters, impl);

    this.name = parameters.name;

    this.legend = parameters.legend;
    if (M.utils.isNullOrEmpty(parameters.legend)) {
      this.legend = parameters.name;
    }

    // transparent
    this.transparent = parameters.transparent;

    // API Key token parameter
    this.accessToken = parameters.accessToken;

    // options
    this.options = options;
  });
  goog.inherits(M.layer.Mapbox, M.Layer);

  /**
   * 'url' The service URL of the
   * layer
   */
  Object.defineProperty(M.layer.Mapbox.prototype, "url", {
    get: function () {
      return this.getImpl().url;
    },
    // defining new type is not allowed
    set: function (newUrl) {
      if (!M.utils.isNullOrEmpty(newUrl)) {
        this.getImpl().url = newUrl;
      }
      else {
        this.getImpl().url = M.config.MAPBOX_URL;
      }
    }
  });

  /**
   * 'tiled' the layer name
   */
  Object.defineProperty(M.layer.Mapbox.prototype, "transparent", {
    get: function () {
      return this.getImpl().transparent;
    },
    set: function (newTransparent) {
      if (!M.utils.isNullOrEmpty(newTransparent)) {
        this.getImpl().transparent = newTransparent;
      }
      else {
        this.getImpl().transparent = false;
      }
    }
  });

  /**
   * 'tiled' the layer name
   */
  Object.defineProperty(M.layer.Mapbox.prototype, "accessToken", {
    get: function () {
      return this.getImpl().accessToken;
    },
    set: function (newAccessToken) {
      if (!M.utils.isNullOrEmpty(newAccessToken)) {
        this.getImpl().accessToken = newAccessToken;
      }
      else {
        this.getImpl().accessToken = M.config.MAPBOX_TOKEN_VALUE;
      }
    }
  });

  /**
   * 'type' This property indicates if
   * the layer was selected
   */
  Object.defineProperty(M.layer.Mapbox.prototype, "type", {
    get: function () {
      return M.layer.type.Mapbox;
    },
    // defining new type is not allowed
    set: function (newType) {
      if (!M.utils.isUndefined(newType) &&
        !M.utils.isNullOrEmpty(newType) && (newType !== M.layer.type.Mapbox)) {
        M.exception('El tipo de capa debe ser \''.concat(M.layer.type.Mapbox).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
      }
    }
  });

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api stable
   */
  M.layer.Mapbox.prototype.equals = function (obj) {
    var equals = false;

    if (obj instanceof M.layer.Mapbox) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
      equals = equals && (this.options === obj.options);
    }
    return equals;
  };
})();
