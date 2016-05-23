goog.provide('M.impl.FeatureLoaderJsonp');

goog.require('ol.featureloader');

/**
 * @param {string|ol.FeatureUrlFunction} url Feature URL service.
 * @param {ol.format.Feature} format Feature format.
 * @param {function(this:ol.source.Vector, Array.<ol.Feature>)} success
 *     Function called with the loaded features. Called with the vector
 *     source as `this`.
 * @return {ol.FeatureLoader} The feature loader.
 */
ol.featureloader.loadFeaturesJsonp = function (url, format, success) {
   return (
      /**
       * @param {ol.Extent} extent Extent.
       * @param {number} resolution Resolution.
       * @param {ol.proj.Projection} projection Projection.
       * @this {ol.source.Vector}
       */
      function (extent, resolution, projection) {
         var requestUrl;
         if (goog.isFunction(url)) {
            requestUrl = url(extent, resolution, projection);
         }
         else {
            requestUrl = url;
         }
         var this_ = this;
         M.remote.get(requestUrl).then(function (response) {
            var type = format.getType();
            /** @type {Document|Node|Object|string|undefined} */
            var source;
            if (type == ol.format.FormatType.JSON) {
               source = response.responseTxt;
            }
            else if (type == ol.format.FormatType.TEXT) {
               source = response.responseTxt;
            }
            else if (type == ol.format.FormatType.XML) {
               source = response.responseXml;
            }
            else {
               goog.asserts.fail('unexpected format type');
            }
            if (goog.isDefAndNotNull(source)) {
               var features = format.readFeatures(source, {
                  featureProjection: projection
               });
               var screenOverlay;
               if (M.utils.isFunction(format.getScreenOverlay)) {
                  screenOverlay = format.getScreenOverlay();
               }
               success.call(this_, features, screenOverlay);
            }
            else {
               goog.asserts.fail('undefined or null source');
            }
         });
      });
};


/**
 * Create an JSONP feature loader for a `url` and `format`. The feature loader
 * loads features (with JSONP), parses the features, and adds them to the
 * vector source.
 * @param {string|ol.FeatureUrlFunction} url Feature URL service.
 * @param {ol.format.Feature} format Feature format.
 * @return {ol.FeatureLoader} The feature loader.
 * @api
 */
ol.featureloader.jsonp = function (url, format, map, layer) {
   return ol.featureloader.loadFeaturesJsonp(url, format,
      /**
       * @param {Array.<ol.Feature>} features The loaded features.
       * @param {ol.style.Icon} screenOverlay the screenOverlay image
       * @this {ol.source.Vector}
       */
      function (features, screenOverlay) {
         this.addFeatures(features);
         if (!M.utils.isNullOrEmpty(screenOverlay)) {
            var screenOverLayImg = M.impl.utils.addOverlayImage(screenOverlay, map);
            layer.setScreenOverlayImg(screenOverLayImg);
         }
      });
};