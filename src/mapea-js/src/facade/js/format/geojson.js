goog.provide('M.format.GeoJSON');

goog.require('M.Feature');

(function () {

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
  M.format.GeoJSON = (function (options) {
    // checks if the implementation can create format GeoJSON
    if (M.utils.isUndefined(M.impl.format.GeoJSON)) {
      M.exception('La implementación usada no puede sdgjklsdajglk');
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
  M.format.GeoJSON.prototype.write = function (features) {
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
  M.format.GeoJSON.prototype.read = function (geojson) {
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
      features = geojsonFeatures.map(function (geojsonFeature) {
        let id = geojsonFeature.id;
        return new M.Feature(id, {
          geometry: {
            coordinates: geojsonFeature.geometry.coordinates,
            type: geojsonFeature.geometry.type
          },
          properties: geojsonFeature.properties,
          type: geojsonFeature.type,
          id: geojsonFeature.id,
        });
      });
    }
    return features;
  };
})();
