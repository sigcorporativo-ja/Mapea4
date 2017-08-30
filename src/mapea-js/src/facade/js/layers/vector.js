goog.provide('M.layer.Vector');
goog.require('M.Layer');
goog.require('M.utils');
goog.require('M.exception');
(function() {
  /**
   * @classdesc
   * Main constructor of the class. Creates a Vector layer
   * with parameters specified by the user
   *
   * @constructor
   * @extends {M.Layer}
   * @param {Mx.parameters.Layer} userParameters - parameters
   * @param {Mx.parameters.LayerOptions} options - custom options for this layer
   * @api stable
   */
  M.layer.Vector = (function(parameters = {}, options = {}, impl = new M.impl.layer.Vector(options)) {
    // checks if the implementation can create Vector
    if (M.utils.isUndefined(M.impl.layer.Vector)) {
      M.exception('La implementación usada no puede crear capas Vector');
    }
    /**
     * TODO
     */
    this.style_ = null;
    /**
     * Filter
     * @private
     * @type {M.Filter}
     */
    this.filter_ = null;

    // calls the super constructor
    goog.base(this, parameters, impl);
    let style = options.style;
    if (!M.utils.isNullOrEmpty(style) && style instanceof M.Style) {
      this.setStyle(style);
    }
  });
  goog.inherits(M.layer.Vector, M.Layer);

  /**
   * This function add features to layer
   *
   * @function
   * @public
   * @param {Array<M.feature>} features - Features to add
   * @api stable
   */
  M.layer.Vector.prototype.addFeatures = function(features) {
    if (!M.utils.isNullOrEmpty(features)) {
      if (!M.utils.isArray(features)) {
        features = [features];
      }
      this.getImpl().addFeatures(features);
    }
  };

  /**
   * This function returns all features or discriminating by the filter
   *
   * @function
   * @public
   * @param {boolean} applyFilter - Indicates whether execute filter
   * @return {Array<M.Feature>} returns all features or discriminating by the filter
   * @api stable
   */
  M.layer.Vector.prototype.getFeatures = function(skipFilter) {
    if (M.utils.isNullOrEmpty(this.getFilter())) skipFilter = true;
    return this.getImpl().getFeatures(skipFilter, this.filter_);
  };

  /**
   * This function returns the feature with this id
   *
   * @function
   * @public
   * @param {string|number} id - Id feature
   * @return {null|M.feature} feature - Returns the feature with that id if it is found, in case it is not found or does not indicate the id returns null
   * @api stable
   */
  M.layer.Vector.prototype.getFeatureById = function(id) {
    let feature = null;
    if (!M.utils.isNullOrEmpty(id)) {
      feature = this.getImpl().getFeatureById(id);
    }
    else {
      M.dialog.error("No se ha indicado un ID para obtener el feature");
    }
    return feature;
  };

  /**
   * This function remove the features indicated
   *
   * @function
   * @public
   * @param {Array<M.feature>} features - Features to remove
   * @api stable
   */
  M.layer.Vector.prototype.removeFeatures = function(features) {
    if (!M.utils.isArray(features)) {
      features = [features];
    }
    this.getImpl().removeFeatures(features);
  };

  /**
   * This function remove all features
   *
   * @function
   * @public
   * @api stable
   */
  M.layer.Vector.prototype.clear = function() {
    this.removeFilter();
    this.removeFeatures(this.getFeatures(true));
  };

  /**
   * This function refresh layer
   *
   * @function
   * @public
   * @api stable
   */
  M.layer.Vector.prototype.refresh = function() {
    this.getImpl().refresh(true);
  };

  /**
   * This function redraw layer
   *
   * @function
   * @public
   * @api stable
   */
  M.layer.Vector.prototype.redraw = function() {
    this.getImpl().redraw();
  };

  /**
   * This function set a filter
   *
   * @function
   * @public
   * @param {M.Filter} filter - filter to set
   * @api stable
   */
  M.layer.Vector.prototype.setFilter = function(filter) {
    if (M.utils.isNullOrEmpty(filter) || (filter instanceof M.Filter)) {
      this.filter_ = filter;
      this.redraw();
    }
    else {
      M.dialog.error("El filtro indicado no es correcto");
    }
  };

  /**
   * This function return filter
   *
   * @function
   * @public
   * @return {M.Filter} returns filter assigned
   * @api stable
   */
  M.layer.Vector.prototype.getFilter = function() {
    return this.filter_;
  };

  /**
   * This function return extent of all features or discriminating by the filter
   *
   * @function
   * @param {boolean} applyFilter - Indicates whether execute filter
   * @return {Array<number>} Extent of features
   * @api stable
   */
  M.layer.Vector.prototype.getFeaturesExtent = function(skipFilter) {
    if (M.utils.isNullOrEmpty(this.getFilter())) skipFilter = true;
    return this.getImpl().getFeaturesExtent(skipFilter, this.filter_);
  };

  /**
   * This function remove filter
   *
   * @function
   * @public
   * @api stable
   */
  M.layer.Vector.prototype.removeFilter = function() {
    this.setFilter(null);
  };

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @public
   * @param {object} obj - Object to compare
   * @api stable
   */
  M.layer.Vector.prototype.equals = function(obj) {
    var equals = false;
    if (obj instanceof M.layer.Vector) {}
    return equals;
  };
  /**
   * TODO
   */
  // REVISION #86837 guardar el style como atributo de la clase
  M.layer.Vector.prototype.setStyle = function(style) {

    //caso style cluster
    if (style instanceof M.style.Cluster) {
      /*if (!M.utils.isNullOrEmpty(this.style_) && !this.style_.equals(style)) {
         if (this.getImpl().getOL3Layer().getSource().getState() === 'ready' && this.getImpl().getOL3Layer().getSource().getFeatures().length > 0) {          this.style_.unapply(this);        }        this.getImpl().on(M.evt.LOAD, function(e) {          this.style_.unapply(this);        }.bind(this));      }*/
      if (!M.utils.isNullOrEmpty(style) && style instanceof M.Style) {
        this.style_ = style;
        if (this.getImpl().getOL3Layer().getSource().getState() === 'ready' && this.getImpl().getOL3Layer().getSource().getFeatures().length > 0) {
          style.apply(this);
        }
        else {
          this.getImpl().on(M.evt.LOAD, function(e) {
            style.apply(this);
          }.bind(this));
        }
      }
    }
    else {


      if (!M.utils.isNullOrEmpty(this.style_) && !this.style_.equals(style)) {

        if (this.style_ instanceof M.style.Cluster) {
          if (this.getImpl().getOL3Layer().getSource().getState() === 'ready' && this.getImpl().getOL3Layer().getSource().getFeatures().length > 0) {
            this.style_.unapply(this);
          }
          else {
            var style_old = this.style_;
            this.getImpl().on(M.evt.LOAD, function(e) {
              style_old.unapply(this);
            }.bind(this));
          }
        }
        else {
          this.style_.unapply(this);
        }
      }
      if (!M.utils.isNullOrEmpty(style) && style instanceof M.Style) {
        this.style_ = style;
        style.apply(this);
        this.getImpl().on(M.evt.LOAD, function(e) {
          style.apply(this);
        }.bind(this));
      }
    }
  };
  /**
   * This function return style vector
   *
   * TODO
   * @api stable
   */
  M.layer.Vector.prototype.getStyle = function() {
    return this.style_;
  };
})();
