goog.provide('M.impl.loader.KML');

/**
 * @namespace M.impl.control
 */
(function () {
   /**
    * @classdesc TODO
    * control
    * @param {function} element template of this control
    * @param {M.Map} map map to add the plugin
    * @constructor
    * @extends {M.Object}
    * @api stable
    */
   M.impl.loader.KML = function (map, url, format) {
      /**
       * TODO
       * @private
       * @type {M.Map}
       */
      this.map_ = map;

      /**
       * TODO
       * @private
       * @type {M.impl.service.WFS}
       */
      this.url_ = url;

      /**
       * TODO
       * @private
       * @type {M.impl.format.GeoJSON}
       */
      this.format_ = format;

      goog.base(this);
   };
   goog.inherits(M.impl.loader.KML, M.Object);

   /**
    * This function destroys this control, cleaning the HTML
    * and unregistering all events
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.loader.KML.prototype.getLoaderFn = function (callback) {
      var loaderScope = this;
      return (function (extent, resolution, projection) {
         var sourceScope = this;
         loaderScope.loadInternal_(projection).then(function (response) {
            callback.apply(sourceScope, response);
         });
      });
   };

   /**
    * TODO
    *
    * @private
    * @function
    */
   M.impl.loader.KML.prototype.loadInternal_ = function (projection) {
      var this_ = this;
      return (new Promise(function (success, fail) {
         M.remote.get(this_.url_).then(function (response) {
            if (!M.utils.isNullOrEmpty(response.text)) {
               var features = this_.format_.readFeatures(response.text, {
                  featureProjection: projection
               });
               var screenOverlay = this_.format_.getScreenOverlay();
               success.call(this, [features, screenOverlay]);
            }
            else {
               M.exception('No hubo respuesta del KML');
            }
         });
      }));
   };
})();