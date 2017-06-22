goog.provide('M.impl.layer.Vector');
goog.require('M.utils');
goog.require('M.exception');
goog.require('M.impl.Layer');

(function () {
  /**
   * @classdesc
   * Main constructor of the class. Creates a Vector layer
   * with parameters specified by the user
   *
   * @constructor
   * @implements {M.impl.Layer}
   * @param {Mx.parameters.LayerOptions} options - custom options for this layer
   * @api stable
   */
  M.impl.layer.Vector = (function (options) {
    this.facadeVector_ = null;
    this.features_ = [];
    goog.base(this, options);
  });
  goog.inherits(M.impl.layer.Vector, M.impl.Layer);


  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.impl.Map} map
   * @api stable
   */
  M.impl.layer.Vector.prototype.addTo = function (map) {
    this.map = map;
    map.on(M.evt.CHANGE_PROJ, this.setProjection_, this);
  };

  /**
   * This function add features to layer
   *
   * @function
   * @public
   * @param {Array<M.feature>} features - Features to add
   * @api stable
   */
  M.impl.layer.Vector.prototype.addFeatures = function (features) {
    this.features_ = this.features_.concat(features);
    this.redraw();
  };

  /**
   * This function returns all features or discriminating by the filter
   *
   * @function
   * @public
   * @param {boolean} skipFilter - Indicates whether skyp filter
   * @param {M.Filter} filter - Filter to execute
   * @return {Array<M.Feature>} returns all features or discriminating by the filter
   * @api stable
   */
  M.impl.layer.Vector.prototype.getFeatures = function (skipFilter, filter) {
    let features = this.features_;
    if (!skipFilter) features = filter.execute(features);
    return features;
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
  M.impl.layer.Vector.prototype.getFeatureById = function (id) {
    let feature = this.getOL3Layer().getSource().getFeatureById(id);
    return M.impl.Feature.olFeature2Facade(feature);
  };

  /**
   * This function remove the features indicated
   *
   * @function
   * @public
   * @param {Array<M.feature>} features - Features to remove
   * @api stable
   */
  M.impl.layer.Vector.prototype.removeFeatures = function (features) {
    let copyFeatures = [...features];
    features.forEach(function (feature) {
      copyFeatures.splice(copyFeatures.indexOf(feature), 1);
    }.bind(this));
    this.features_ = copyFeatures;
    this.redraw();
  };

  /**
   * This function redraw layer
   *
   * @function
   * @public
   * @api stable
   */
  M.impl.layer.Vector.prototype.redraw = function () {
    let olSource = this.getOL3Layer().getSource();
    olSource.forEachFeature(function (feature) {
      olSource.removeFeature(feature);
    });
    let features = this.facadeVector_.getFeatures();
    this.getOL3Layer().getSource().addFeatures(features.map(feature => feature.getImpl().getOLFeature()));
  };

  /**
   * This function return extent of all features or discriminating by the filter
   *
   * @function
   * @param {boolean} skipFilter - Indicates whether skip filter
   * @param {M.Filter} filter - Filter to execute
   * @return {Array<number>} Extent of features
   * @api stable
   */
  M.impl.layer.Vector.prototype.getFeaturesExtent = function (skipFilter, filter) {
    let features = this.getFeatures(skipFilter, filter);
    let extents = features.map((feature) => feature.getImpl().getOLFeature().getGeometry().getExtent().slice(0));
    return (extents.length === 0) ? null : extents.reduce((ext1, ext2) => ol.extent.extend(ext1, ext2));
  };


  /**
   * This function set facade class vector
   *
   * @function
   * @param {object} obj - Facade vector
   * @api stable
   */
  M.impl.layer.Vector.prototype.setFacadeObj = function (obj) {
    this.facadeVector_ = obj;
  };

  /**
   * This function sets the map object of the layer
   *
   * @private
   * @function
   */
  M.impl.layer.Vector.prototype.setProjection_ = function (oldProj, newProj) {
    let srcProj = ol.proj.get(oldProj.code);
    let dstProj = ol.proj.get(newProj.code);
    this.facadeVector_.getFeatures().forEach(f => f.getImpl().getOLFeature().getGeometry().transform(srcProj, dstProj));
  };

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @param {object} obj - Object to compare
   * @api stable
   */
  M.impl.layer.Vector.prototype.equals = function (obj) {
    var equals = false;
    if (obj instanceof M.impl.layer.Vector) {}
    return equals;
  };

})();
