goog.provide('M.impl.layer.Vector');
goog.require('M.utils');
goog.require('M.exception');
goog.require('M.impl.Layer');

goog.require('ol.layer.Tile');
goog.require('ol.source.OSM');

(function () {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WMS layer
   * with parameters specified by the user
   *
   * @constructor
   * @implements {M.impl.Layer}
   * @param {Mx.parameters.LayerOptions} options custom options for this layer
   * @api stable
   */
  M.impl.layer.Vector = (function (options) {
    goog.base(this, options);
  });
  goog.inherits(M.impl.layer.Vector, M.impl.Layer);

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api stable
   */
  M.impl.layer.Vector.prototype.equals = function (obj) {
    var equals = false;

    if (obj instanceof M.impl.layer.Vector) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
    }

    return equals;
  };

  /**
   * This function returns all features of the layer
   *
   * @function
   * @return {Array<M.feature>} returns all features of the layer
   * @api stable
   */
  M.impl.layer.Vector.prototype.getFeatures = function () {
    return this.getOL3Layer().getSource().getFeatures();
  };

  /**
   * This function returns the feature with this id
   *
   * @function
   * @param {string | number} id - Id feature
   * @return {null | M.feature} features - Returns the feature with that id if it is found, in case it is not found returns null
   * @api stable
   */
  M.impl.layer.Vector.prototype.getFeatureById = function (id) {
    return this.getOL3Layer().getSource().getFeatureById(id);
  };

  /**
   * This function remove the features indicated
   *
   * @function
   * @param {Array<M.feature>} features - Features to remove
   * @api stable
   */
  M.impl.layer.Vector.prototype.removeFeatures = function (features) {
    let source = this.getOL3Layer().getSource();
    features.map(function (feature) {
      source.removeFeature(feature)
    }.bind(this));
  };

  /**
   * This function return features in bbox
   *
   * @function
   * @param {Array<number>|object} bbox - bbox to filter
   * return {null | Array<M.feature>} features - Features in bbox
   * @api stable
   */
  M.impl.layer.Vector.prototype.getFeaturesExtent = function (bbox) {
    return this.getOL3Layer().getSource().getFeaturesInExtent(bbox);
  };

  /**
   * This function refresh layer
   *
   * @function
   * @api stable
   */
  M.impl.layer.Vector.prototype.refresh = function (extent) {
    this.getOL3Layer().getSource().clear();
    if (this instanceof M.layer.GeoJSON) {
      ol.featureloader.xhr(this.url, new ol.format.GeoJSON()).call(this.getImpl().getOL3Layer().getSource(), [], 'EPSG:23030');
    }
  };


})();
