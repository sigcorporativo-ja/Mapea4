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
   * This function returns all features of the layer
   *
   * @function
   * @return {Array<M.feature>} returns all features of the layer
   * @api stable
   */
  M.impl.layer.Vector.prototype.addFeatures = function (features) {
    this.getOL3Layer().getSource().addFeatures(features.map(feature => feature.getImpl().getOLFeature()));
  };

  /**
   * This function returns all features of the layer
   *
   * @function
   * @return {Array<M.feature>} returns all features of the layer
   * @api stable
   */
  M.impl.layer.Vector.prototype.getFeatures = function (applyFilter, filter) {
    let features = this.getOL3Layer().getSource().getFeatures();
    if (applyFilter) features = filter.execute(features);
    features = features.map(feature => new M.Feature(feature.getId(), JSON.parse(JSON.stringify({
      "geometry": {
        "type": feature.getGeometry().getType(),
        "coordinates": feature.getGeometry().getCoordinates()
      }
    }))));
    return features;
  };

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
   * This function returns the feature with this id
   *
   * @function
   * @param {string | number} id - Id feature
   * @return {null | M.feature} features - Returns the feature with that id if it is found, in case it is not found returns null
   * @api stable
   */
  M.impl.layer.Vector.prototype.getFeatureById = function (id) {
    let feature = this.getOL3Layer().getSource().getFeatureById(id);
    feature = new M.Feature(feature.getId(), {
      "geometry": {
        "type": feature.getGeometry().getType(),
        "coordinates": feature.getGeometry().getCoordinates()
      }
    });
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
   * This function refresh layer
   *
   * @function
   * @api stable
   */
  M.impl.layer.Vector.prototype.refreshLayer = function (extent) {
    this.getOL3Layer().getSource().clear();
    if (this instanceof M.layer.GeoJSON) {
      ol.featureloader.xhr(this.url, new ol.format.GeoJSON()).call(this.getImpl().getOL3Layer().getSource(), [], 'EPSG:23030');
    }
  };

  /**
   * This function return features in bbox
   *
   * @function
   * @param {Array<number>|object} bbox - bbox to filter
   * return {null | Array<M.feature>} features - Features in bbox
   * @api stable
   */
  M.impl.layer.Vector.prototype.getFeaturesExtent = function (applyFilter, filter) {
    let features = this.getOL3Layer().getSource().getFeatures();
    if (applyFilter) features = filter.execute(features);
    let extent = {
      minX: null,
      minY: null,
      maxX: null,
      maxY: null
    }
    for (var i = 0, ilen = features.length; i < ilen; i++) {
      let extentFeature = features[i].getGeometry().getExtent();
      if (M.utils.isNullOrEmpty(extent.minX) || extentFeature[0] < extent.minX) extent.minX = extentFeature[0];
      if (M.utils.isNullOrEmpty(extent.minY) || extentFeature[1] < extent.minY) extent.minY = extentFeature[1];
      if (M.utils.isNullOrEmpty(extent.maxX) || extentFeature[2] > extent.maxX) extent.maxX = extentFeature[2];
      if (M.utils.isNullOrEmpty(extent.maxY) || extentFeature[3] > extent.maxY) extent.maxY = extentFeature[3];
    }
    mapajs.setBbox([extent.minX, extent.minY, extent.maxX, extent.maxY]);
    return [extent.minX, extent.minY, extent.maxX, extent.maxY];
  };

})();
