goog.provide('M.layer.KML');

goog.require('M.layer.Vector');
goog.require('M.utils');
goog.require('M.exception');

(function() {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WMS layer
   * with parameters specified by the user
   *
   * @constructor
   * @extends {M.layer.Vector}
   * @param {string|Mx.parameters.KML} userParameters parameters
   * @param {Mx.parameters.LayerOptions} options provided by the user
   * @api stable
   */
  M.layer.KML = (function(userParameters, options = {}) {
    // checks if the implementation can create KML layers
    if (M.utils.isUndefined(M.impl.layer.KML)) {
      M.exception('La implementación usada no puede crear capas KML');
    }

    // checks if the param is null or empty
    if (M.utils.isNullOrEmpty(userParameters)) {
      M.exception('No ha especificado ningún parámetro');
    }

    /**
     * Implementation of this layer
     * @public
     * @type {M.layer.KML}
     */
    var impl = new M.impl.layer.KML(options);

    var parameters = M.parameter.layer(userParameters, M.layer.type.KML);

    // calls the super constructor
    goog.base(this, parameters, options, impl);

    // extract
    this.extract = parameters.extract;

    // options
    this.options = options;
  });
  goog.inherits(M.layer.KML, M.layer.Vector);

  /**
   * 'type' This property indicates if
   * the layer was selected
   */
  Object.defineProperty(M.layer.KML.prototype, "type", {
    get: function() {
      return M.layer.type.KML;
    },
    // defining new type is not allowed
    set: function(newType) {
      if (!M.utils.isUndefined(newType) &&
        !M.utils.isNullOrEmpty(newType) && (newType !== M.layer.type.KML)) {
        M.exception('El tipo de capa debe ser \''.concat(M.layer.type.KML).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
      }
    }
  });

  /**
   * 'transparent' the layer name
   */
  Object.defineProperty(M.layer.KML.prototype, "extract", {
    get: function() {
      return this.getImpl().extract;
    },
    // defining new type is not allowed
    set: function(newExtract) {
      if (!M.utils.isNullOrEmpty(newExtract)) {
        if (M.utils.isString(newExtract)) {
          this.getImpl().extract = (M.utils.normalize(newExtract) === 'true');
        }
        else {
          this.getImpl().extract = newExtract;
        }
      }
      else {
        this.getImpl().extract = true;
      }
    }
  });

  /**
   * 'options' the layer options
   */
  Object.defineProperty(M.layer.KML.prototype, "options", {
    get: function() {
      return this.getImpl().options;
    },
    // defining new type is not allowed
    set: function(newOptions) {
      this.getImpl().options = newOptions;
    }
  });

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api stable
   */
  M.layer.KML.prototype.equals = function(obj) {
    var equals = false;

    if (obj instanceof M.layer.KML) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
      equals = equals && (this.extract === obj.extract);
    }

    return equals;
  };

  /**
   * Template for this controls
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.layer.KML.POPUP_TEMPLATE = 'kml_popup.html';
})();
