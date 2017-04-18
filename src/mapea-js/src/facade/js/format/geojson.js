goog.provide('M.format.GeoJSON');

goog.require('M.Feature');

(function () {
  'use strict';

  /**
   * TODO
   *
   * @public
   * @function
   * @param {Array<M.Feature>} features features array to parsed
   * as a GeoJSON FeatureCollection
   * @return {Object}
   * @api estable
   */
  M.format.GeoJSON.write = function (features) {
    // TODO
  };

  /**
   * TODO
   *
   * @public
   * @function
   * @param {object} geojson GeoJSON to parsed as a
   * M.Feature array
   * @return {Array<M.Feature>}
   * @api estable
   */
  M.format.GeoJSON.read = function (geojson) {
    var features = [];
    if (!M.utils.isNullOrEmpty(geojson)) {
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
          properties: geojsonFeature.properties
       });
        //return new M.Feature(id, geojsonFeature);
      });
    }
    return features;
  };
})();
