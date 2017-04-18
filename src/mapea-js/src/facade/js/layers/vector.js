goog.provide('M.layer.Vector');

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
   * @api stable
   */
  M.layer.Vector = (function (userParameters, options) {
    // checks if the implementation can create OSM
    if (M.utils.isUndefined(M.impl.layer.Vector)) {
      M.exception('La implementación usada no puede crear capas Vector');
    }

    /**
     * Filter
     * @public
     * @type {M.Filter}
     */
    this.filter_ = null;

    /**
     * Implementation of this layer
     * @public
     * @type {M.layer.WMS}
     */
    var impl = new M.impl.layer.Vector(options);
    var parameters = M.parameter.layer(userParameters, M.layer.type.Vector);

    // calls the super constructor
    goog.base(this, parameters, options, impl);
  });
  goog.inherits(M.layer.Vector, M.Layer);

  /**
   * 'type' This property indicates if
   * the layer was selected
   */
  Object.defineProperty(M.layer.Vector.prototype, "type", {
    get: function () {
      return M.layer.type.Vector;
    },
    // defining new type is not allowed
    set: function (newType) {
      if (!M.utils.isUndefined(newType) &&
        !M.utils.isNullOrEmpty(newType) && (newType !== M.layer.type.Vector)) {
        M.exception('El tipo de capa debe ser \''.concat(M.layer.type.Vector).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
      }
    }
  });

  /**
   * This function add features to layer
   *
   * @function
   * @param {Array<M.feature>} features - Features to add
   * @api stable
   */
  M.layer.Vector.prototype.addFeatures = function (features) {
    this.getImpl().addFeatures(features);
  };

  /**
   * This function returns all features or discriminating by the filter
   *
   * @function
   * @param {boolean} applyFilter - Indicates whether to filter the features or not
   * @return {Array<M.Feature>} returns all features or discriminating by the filter
   * @api stable
   */
  M.layer.Vector.prototype.getFeatures = function (applyFilter) {
    if (M.utils.isNullOrEmpty(this.getFilter())) applyFilter = false;
    return this.getImpl().getFeatures(applyFilter, this.filter_);
  };

  /**
   * This function returns the feature with this id
   *
   * @function
   * @param {string | number} id - Id feature
   * @return {null | M.feature} features - Returns the feature with that id if it is found, in case it is not found or does not indicate the id returns null
   * @api stable
   */
  M.layer.Vector.prototype.getFeatureById = function (id) {
    let features = null;
    if (!M.utils.isNullOrEmpty(id)) {
      features = this.getImpl().getFeatureById(id);
    }
    else {
      M.dialog.error("No se ha indicado un ID para obtener el feature");
    }
    return features;
  };

  /**
   * This function remove the features indicated
   *
   * @function
   * @param {Array<M.feature>} features - Features to remove
   * @api stable
   */
  M.layer.Vector.prototype.removeFeatures = function (features) {
    if (M.utils.isArray(features)) {
      this.getImpl().removeFeatures(features);
    }
    else {
      M.dialog.error("El método debe recibir un array de features");
    }
  };

  /**
   * This function returns all features of the layer
   *
   * @function
   * @return {Array<M.feature>} returns all features of the layer
   * @api stable
   */
  M.layer.Vector.prototype.getFeatures = function (applyFilter) {
    if (M.utils.isNullOrEmpty(this.getFilter())) {
      applyFilter = false;
    }
    return this.getImpl().getFeatures(applyFilter, this.filter_);
  };

  /**
   * This function remove all features
   *
   * @function
   * @api stable
   */
  M.layer.Vector.prototype.clear = function () {
    this.removeFeatures(this.getFeatures());
  };

  /**
   * This function refresh layer
   *
   * @function
   * @api stable
   */
  M.layer.Vector.prototype.refresh = function () {
    this.getImpl().refreshLayer();
  };

  /**
   * This function set a filter
   *
   * @function
   * @param {M.Filter}
   * @api stable
   */
  M.layer.Vector.prototype.setFilter = function (filter) {
    if (filter instanceof M.Filter) {
      this.filter_ = filter;
    }
    else {
      M.dialog.error("El filtro indicado no es correcto");
    }
  };

  /**
   * This function return filter
   *
   * @function
   * @return returns filter applied
   * @api stable
   */
  M.layer.Vector.prototype.getFilter = function () {
    return this.filter_;
  };


  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @param {object} obj - Object to compare
   * @api stable
   */
  M.layer.Vector.prototype.equals = function (obj) {
    var equals = false;
    if (obj instanceof M.layer.Vector) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
      equals = equals && (this.options === obj.options);
    }
    return equals;
  };

})();
