goog.provide('M.layer.OSM');

goog.require('M.Layer');
goog.require('M.utils');
goog.require('M.exception');

(function () {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WMS layer
   * with parameters specified by the user
   *
   * @constructor
   * @extends {M.Layer}
   * @param {string|Mx.parameters.WMS} userParameters parameters
   * @param {Mx.parameters.LayerOptions} options provided by the user
   * @api stable
   */
  M.layer.OSM = (function (userParameters, options) {
    // checks if the implementation can create OSM
    if (M.utils.isUndefined(M.impl.layer.OSM)) {
      M.exception('La implementación usada no puede crear capas OSM');
    }

    // checks if the param is null or empty
    if (M.utils.isNullOrEmpty(userParameters)) {
      userParameters = "OSM";
    }

    options = (options || {});

    /**
     * Implementation of this layer
     * @public
     * @type {M.layer.WMS}
     */
    var impl = new M.impl.layer.OSM(userParameters, options);

    var parameters = M.parameter.layer(userParameters, M.layer.type.OSM);

    if (M.utils.isNullOrEmpty(parameters.name)) {
      parameters.name = 'osm';
    }

    // calls the super constructor
    goog.base(this, parameters, impl);

    this.name = parameters.name;

    this.legend = parameters.legend;
    if (M.utils.isNullOrEmpty(parameters.legend)) {
      this.legend = 'OpenStreetMap';
    }

    // transparent
    this.transparent = parameters.transparent;

    // options
    this.options = options;
  });
  goog.inherits(M.layer.OSM, M.Layer);

  /**
   * 'transparent' the layer name
   */
  Object.defineProperty(M.layer.OSM.prototype, "transparent", {
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
   * 'type' This property indicates if
   * the layer was selected
   */
  Object.defineProperty(M.layer.OSM.prototype, "type", {
    get: function () {
      return M.layer.type.OSM;
    },
    // defining new type is not allowed
    set: function (newType) {
      if (!M.utils.isUndefined(newType) &&
        !M.utils.isNullOrEmpty(newType) && (newType !== M.layer.type.OSM)) {
        M.exception('El tipo de capa debe ser \''.concat(M.layer.type.OSM).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
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
  M.layer.OSM.prototype.equals = function (obj) {
    var equals = false;

    if (obj instanceof M.layer.OSM) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
      equals = equals && (this.options === obj.options);
    }
    return equals;
  };
})();
