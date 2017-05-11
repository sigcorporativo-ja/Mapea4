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
    goog.base(this, options);
  });
  goog.inherits(M.impl.layer.Vector, M.impl.Layer);

  /**
   * This function add features to layer
   *
   * @function
   * @public
   * @param {Array<M.feature>} features - Features to add
   * @api stable
   */
  M.impl.layer.Vector.prototype.addFeatures = function (features) {
    this.getOL3Layer().getSource().addFeatures(features.map(feature => feature.getImpl().getOLFeature()));
  };

  /**
   * This function returns all features or discriminating by the filter
   *
   * @function
   * @public
   * @param {boolean} applyFilter - Indicates whether execute filter
   * @param {
     M.Filter
   }
   filter - Filter to execute   * @return {Array<M.Feature>} returns all features or discriminating by the filter
   * @api stable
   */
  M.impl.layer.Vector.prototype.getFeatures = function (applyFilter, filter) {
    let features = this.getOL3Layer().getSource().getFeatures();
    features = features.map(M.impl.Feature.olFeature2Facade);
    if (applyFilter) features = filter.execute(features);
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
    let source = this.getOL3Layer().getSource();
    features.forEach(feature => source.removeFeature(feature.getImpl().getOLFeature()));
  };

  /**
   * This function refresh layer
   *
   * @function
   * @public
   * @api stable
   */
  M.impl.layer.Vector.prototype.refresh = function () {
    this.getOL3Layer().getSource().clear();
  };

  /**
   * This function return extent of all features or discriminating by the filter
   *
   * @function
   * @param {boolean} applyFilter - Indicates whether execute filter
   * @param {M.Filter} filter - Filter to execute
   * @return {Array<number>} Extent of features
   * @api stable
   */
  M.impl.layer.Vector.prototype.getFeaturesExtent = function (applyFilter, filter) {
    let features = this.getFeatures(applyFilter, filter);
    let extents = features.map((feature) => feature.getImpl().getOLFeature().getGeometry().getExtent());
    return (extents.length === 0) ? null : extents.reduce((ext1, ext2) => ol.extent.extend(ext1, ext2));
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
