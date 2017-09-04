goog.provide('M.format.GeoJSON');

goog.require('M.Feature');

(function() {

  /**
   * @classdesc
   * Main constructor of the class. Creates a layer
   * with parameters specified by the user
   *
   * @constructor
   * @extends {M.facade.Base}
   * @param {string|Object} userParameters parameters
   * provided by the user
   * @api stable
   */
  M.format.GeoJSON = (function(options) {
    // checks if the implementation can create format GeoJSON
    if (M.utils.isUndefined(M.impl.format.GeoJSON)) {
      M.exception('La implementación usada no puede M.impl.format.GeoJSON');
    }

    options = (options || {});

    /**
     * Implementation of this formatter
     * @public
     * @type {M.impl.format.GeoJSON}
     */
    var impl = new M.impl.format.GeoJSON(options);

    // calls the super constructor
    goog.base(this, impl);
  });
  goog.inherits(M.format.GeoJSON, M.facade.Base);

  /**
   * TODO
   *
   * @public
   * @function
   * @param {Array<M.Feature>} features features array to parsed
   * as a GeoJSON FeatureCollection
   * @return {Array<Object>}
   * @api estable
   */
  M.format.GeoJSON.prototype.write = function(features) {
    if (!M.utils.isArray(features)) {
      features = [features];
    }
    return this.getImpl().write(features);
  };

  /**
   * This function read Features
   *
   * @public
   * @function
   * @param {object} geojson GeoJSON to parsed as a
   * M.Feature array
   * @return {Array<M.Feature>}
   * @api estable
   */
  M.format.GeoJSON.prototype.read = function(geojson, projection) {
    var features = [];
    if (!M.utils.isNullOrEmpty(geojson)) {
      if (M.utils.isString(geojson)) {
        geojson = JSON.parse(geojson);
      }
      let geojsonFeatures = [];
      if (geojson.type === "FeatureCollection") {
        geojsonFeatures = geojson.features;
      }
      else if (geojson.type === "Feature") {
        geojsonFeatures = [geojson];
      }
      let dstProj = projection.code;
      if (M.utils.isNullOrEmpty(dstProj)) {
        if (!M.utils.isNullOrEmpty(projection.featureProjection)) {
          dstProj = ol.proj.get(projection.featureProjection.getCode());
        }
        else {
          dstProj = ol.proj.get(projection.getCode());
        }
      }
      let srcProj = this.getImpl().readProjectionFromObject(geojson);
      features = geojsonFeatures.map(function(geojsonFeature) {
        let id = geojsonFeature.id;
        let feature = new M.Feature(id, geojsonFeature);
        feature.getImpl().getOLFeature().getGeometry().transform(srcProj, dstProj);
        return feature;
      });
    }
    return features;
  };
})();
