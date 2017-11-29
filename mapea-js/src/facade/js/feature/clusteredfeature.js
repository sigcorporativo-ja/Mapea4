goog.provide('M.ClusteredFeature');

goog.require('M.Feature');

(function() {

  /**
   * @classdesc
   * Main constructor of the class. Create a clustered Feature
   *
   * @constructor
   * @extends {M.Feature}
   * @param {Array<M.Feature>} features - array of features
   * @param {Object} attributes - attributes
   * @api stable
   */
  M.ClusteredFeature = (function(features, attributes) {
    goog.base(this, M.utils.generateRandom('_mapea_cluster_'));

    this.setAttributes(attributes);
    this.setAttribute("features", features);
  });
  goog.inherits(M.ClusteredFeature, M.Feature);

  /**
   * This function return if two features are equals
   * @public
   * @function
   * @param {M.Feature} feature
   * @return {bool} returns the result of comparing two features
   */
  M.ClusteredFeature.prototype.equals = function(feature) {
    return this.getId() === feature.getId();
  };
})();
