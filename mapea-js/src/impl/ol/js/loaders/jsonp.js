goog.provide('M.impl.loader.JSONP');

/**
 * @namespace M.impl.control
 */
(function() {
   /**
    * @classdesc TODO
    * control
    * @param {function} element template of this control
    * @param {M.Map} map map to add the plugin
    * @constructor
    * @extends {M.Object}
    * @api stable
    */
   M.impl.loader.JSONP = function(map, url, format) {
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
   goog.inherits(M.impl.loader.JSONP, M.Object);

   /**
    * This function destroys this control, cleaning the HTML
    * and unregistering all events
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.loader.JSONP.prototype.getLoaderFn = function(callback) {
      var loaderScope = this;
      return (function(extent, resolution, projection) {
         var sourceScope = this;
         loaderScope.loadInternal_(projection).then(function(response) {
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
   M.impl.loader.JSONP.prototype.loadInternal_ = function(projection) {
      return (new Promise(function(success, fail) {
         M.remote.get(this.url_).then(function(response) {
            if (!M.utils.isNullOrEmpty(response.text)) {
               var features = this.format_.readFeatures(response.text, {
                  featureProjection: projection
               });
               success.call(this, [features]);
            }
            else {
               M.exception('No hubo respuesta del servicio');
            }
         }.bind(this));
      }.bind(this)));
   };
})();