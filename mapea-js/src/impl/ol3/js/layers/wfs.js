goog.provide('M.impl.layer.WFS');

goog.require('M.utils');
goog.require('M.exception');
goog.require('M.impl.Layer');

goog.require('ol.format.GeoJSON');
goog.require('ol.layer.Vector');
goog.require('ol.source.Vector');

(function () {
   /**
    * @classdesc
    * Main constructor of the class. Creates a WFS layer
    * with parameters specified by the user
    *
    * @constructor
    * @implements {M.impl.Layer}
    * @param {Mx.parameters.LayerOptions} options custom options for this layer
    * @api stable
    */
   M.impl.layer.WFS = (function (options) {
      // calls the super constructor
      goog.base(this, options);
   });
   goog.inherits(M.impl.layer.WFS, M.impl.Layer);

   /**
    * This function sets the map object of the layer
    *
    * @public
    * @function
    * @param {M.Map} map
    * @api stable
    */
   M.impl.layer.WFS.prototype.addTo = function (map) {
      this.map = map;

      var formater = new ol.format.GeoJSON();
      var this_ = this;
      this.ol3Layer = new ol.layer.Vector({
         source: new ol.source.Vector({
            format: formater,
            loader: function (extent, resolution, projection) {
               var requestUrl = this_.getFeatureURL_(extent, projection);
               var loaderFn = ol.featureloader.jsonp(requestUrl, formater);
               loaderFn.call(this, extent, resolution, projection);
            }
         })
      });
      // sets its z-index
      if (this.zIndex_ !== null) {
         this.setZIndex(this.zIndex_);
      }
      var olMap = this.map.getMapImpl();
      olMap.addLayer(this.ol3Layer);
   };

   /**
    * This function gets the full URL of a GetFeature
    * request
    * 
    * @public
    * @function
    * @param {ol.Extent} extent
    * @param {ol.proj.Projection} projection
    * @returns {String} GetFeature URL
    * 
    * @api stable
    */
   M.impl.layer.WFS.prototype.getFeatureURL_ = function (extent, projection) {
      var typename = this.namespace.concat(':').concat(this.name);
      var getFeatureParams = {
         'service': 'WFS',
         'version': this.version,
         'request': 'GetFeature',
         'typename': typename,
         'outputFormat': 'application/json',
         'srsname': projection.getCode()
      };
      if (!M.utils.isNullOrEmpty(this.ids)) {
         var featuresId = this.ids.map(function (id) {
            return this.name.concat('.').concat(id);
         }, this);
         var featureIdParam = 'featureId';
         getFeatureParams[featureIdParam] = featuresId;
      }
      else {
         var mapBbox = this.map.getBbox();
         var extentArray = [
            Math.min(Math.abs(extent[0]), mapBbox.x.min),
            Math.min(Math.abs(extent[1]), mapBbox.y.min),
            Math.min(Math.abs(extent[2]), mapBbox.x.max),
            Math.min(Math.abs(extent[3]), mapBbox.y.max)
         ];
         var bbox = extentArray.join(',') + ',' + projection.getCode();
         var bboxParam = 'bbox';
         getFeatureParams[bboxParam] = bbox;
      }

      var getFeatureURL = M.utils.addParameters(this.url, getFeatureParams);
      return getFeatureURL;
   };

   /**
    * This function destroys this layer, cleaning the HTML
    * and unregistering all events
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.layer.WFS.prototype.destroy = function () {
      var olMap = this.map.getMapImpl();
      if (!M.utils.isNullOrEmpty(this.ol3Layer)) {
         olMap.removeLayer(this.ol3Layer);
         this.ol3Layer = null;
      }
      this.map = null;
   };

   /**
    * This function checks if an object is equals
    * to this layer
    *
    * @function
    * @api stable
    */
   M.impl.layer.WFS.prototype.equals = function (obj) {
      var equals = false;

      if (obj instanceof M.layer.WFS) {
         equals = (this.url === obj.url);
         equals = equals && (this.namespace === obj.namespace);
         equals = equals && (this.name === obj.name);
         equals = equals && (this.ids === obj.ids);
         equals = equals && (this.cql === obj.cql);
         equals = equals && (this.version === obj.version);
      }

      return equals;
   };
})();