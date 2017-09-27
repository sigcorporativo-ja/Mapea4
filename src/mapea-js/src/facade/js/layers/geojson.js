goog.provide('M.layer.GeoJSON');

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
   * @param {string|Mx.parameters.GeoJSON} userParameters parameters
   * @param {Mx.parameters.LayerOptions} options provided by the user
   * @api stable
   */
  M.layer.GeoJSON = (function(parameters, options = {}) {
    // checks if the implementation can create KML layers
    if (M.utils.isUndefined(M.impl.layer.GeoJSON)) {
      M.exception('La implementación usada no puede crear capas GeoJSON');
    }

    // checks if the param is null or empty
    if (M.utils.isNullOrEmpty(parameters)) {
      M.exception('No ha especificado ningún parámetro');
    }

    /**
     * Implementation of this layer
     * @public
     * @type {M.impl.layer.GeoJSON}
     */
    var impl = new M.impl.layer.GeoJSON(parameters, options);

    // calls the super constructor
    goog.base(this, this, options, impl);

    if (M.utils.isString(parameters)) {
      this.url = parameters;
    }
    else if (M.utils.isArray(parameters)) {
      this.source = parameters;
    }
    else {
      // url
      this.url = parameters.url;

      // name
      this.name = parameters.name;

      // source
      this.source = parameters.source;

      // extract
      this.extract = parameters.extract;
    }

    if (M.utils.isNullOrEmpty(this.extract)) {
      this.extract = true; // by default
    }

    // options
    this.options = options;
  });
  goog.inherits(M.layer.GeoJSON, M.layer.Vector);

  /**
   * 'type' This property indicates if
   * the layer was selected
   */
  Object.defineProperty(M.layer.GeoJSON.prototype, "type", {
    get: function() {
      return M.layer.type.GeoJSON;
    },
    // defining new type is not allowed
    set: function(newType) {
      if (!M.utils.isUndefined(newType) &&
        !M.utils.isNullOrEmpty(newType) && (newType !== M.layer.type.GeoJSON)) {
        M.exception('El tipo de capa debe ser \''.concat(M.layer.type.GeoJSON).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
      }
    }
  });

  /**
   * 'extract' the features properties
   */
  Object.defineProperty(M.layer.GeoJSON.prototype, "source", {
    get: function() {
      return this.getImpl().source;
    },
    // defining new type is not allowed
    set: function(newSource) {
      this.getImpl().source = newSource;
    }
  });

  /**
   * 'extract' the features properties
   */
  Object.defineProperty(M.layer.GeoJSON.prototype, "extract", {
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
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api stable
   */
  M.layer.GeoJSON.prototype.equals = function(obj) {
    var equals = false;

    if (obj instanceof M.layer.GeoJSON) {
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
  M.layer.GeoJSON.POPUP_TEMPLATE = 'geojson_popup.html';

  /**
   * Options style by default
   * @const
   * @type {object}
   * @public
   * @api stable
   */
  M.layer.GeoJSON.DEFAULT_OPTIONS_STYLE = {
    fill: {
      color: 'rgba(255, 255, 255, 0.4)',
      opacity: 0.4
    },
    stroke: {
      color: "#3399CC",
      width: 1.5
    },
    radius: 5,
  };
})();
