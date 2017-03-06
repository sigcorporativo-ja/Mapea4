goog.provide('M.impl.GetCapabilities');

/**
 * @namespace M.impl.GetCapabilities
 */
(function() {

   /**
    * @classdesc
    * Main constructor of the class. Creates a WMS layer
    * with parameters specified by the user
    *
    * @constructor
    * @param {Mx.parameters.LayerOptions} options custom options for this layer
    * @api stable
    */
   M.impl.GetCapabilities = function(capabilities, serviceUrl, projection) {
      /**
       * The WMS layers capabilities
       * @private
       * @type {Object}
       */
      this.capabilities_ = capabilities;

      /**
       * The projection
       * @private
       * @type {Mx.Projection}
       */
      this.projection_ = projection;

      /**
       * The projection
       * @private
       * @type {Mx.Projection}
       */
       this.serviceUrl_ = serviceUrl;
   };

   /**
    * This function calculates the extent for a specific layer
    * from its getCapabilities
    *
    * @public
    * @function
    * @param {Mx.GetCapabilities} capabilities
    * @param {String} layerName
    * @returns {Array<Number>} the extension
    * @api stable
    */
   M.impl.GetCapabilities.prototype.getLayerExtent = function(layerName) {
      var layer = this.capabilities_.Capability.Layer;
      var extent = this.getExtentRecursive_(layer, layerName);
      return extent;
   };

   /**
    * This function calculates the extent for a specific layer
    * from its getCapabilities
    *
    * @private
    * @function
    * @param {Mx.GetCapabilities} capabilities
    * @param {String} layerName
    * @returns {Array<Number>} the extension
    */
   M.impl.GetCapabilities.prototype.getExtentRecursive_ = function(layer, layerName) {
      var extent = null;
      var i, ilen;
      if (!M.utils.isNullOrEmpty(layer)) {
         // array
         if (M.utils.isArray(layer)) {
            for (i = 0, ilen = layer.length;
               (i < ilen) && (extent === null); i++) {
               extent = this.getExtentRecursive_(layer[i], layerName);
            }
         }
         else if (M.utils.isObject(layer)) {
            // base case
            if (M.utils.isNullOrEmpty(layerName) || (layer.Name === layerName)) {
               // if the layer supports the SRS
               var srsArray = [];
               if (!M.utils.isNullOrEmpty(layer.SRS)) {
                  srsArray = layer.SRS;
               }
               else if (!M.utils.isNullOrEmpty(layer.CRS)) {
                  srsArray = layer.CRS;
               }
               if (srsArray.indexOf(this.projection_.code) !== -1) {
                  var matchedBbox = null;
                  var bboxes = layer.BoundingBox;
                  for (i = 0, ilen = bboxes.length;
                     (i < ilen) && (matchedBbox === null); i++) {
                     var bbox = bboxes[i];
                     if (bbox.crs === this.projection_.code) {
                        matchedBbox = bbox;
                     }
                  }
                  if (matchedBbox === null) {
                     matchedBbox = bboxes[0];
                  }
                  extent = matchedBbox.extent;
                  if (matchedBbox.crs !== this.projection_.code) {
                     var projSrc = ol.proj.get(matchedBbox.crs);
                     var projDest = ol.proj.get(this.projection_.code);
                     extent = ol.proj.transformExtent(extent, projSrc, projDest);
                  }
               }
               // if the layer has not the SRS then transformExtent
               // the latLonBoundingBox which is always present
               else {
                  extent = layer.LatLonBoundingBox[0].extent;
                  extent = ol.proj.transformExtent(extent, ol.proj.get("EPSG:4326"), ol.proj.get(this.projection_.code));
               }
            }
            // recursive case
            else if (!M.utils.isUndefined(layer.Layer)) {
               extent = this.getExtentRecursive_(layer.Layer, layerName);
            }
         }
      }
      return extent;
   };

   /**
    * This function calculates the extent for a specific layer
    * from its getCapabilities
    *
    * @private
    * @function
    * @param {Mx.GetCapabilities} capabilities
    * @param {String} layerName
    * @returns {Array<Number>} the extension
    */
   M.impl.GetCapabilities.prototype.getLayers = function() {
      var layer = this.capabilities_.Capability.Layer;
      var layers = this.getLayersRecursive_(layer);
      return layers;
   };

   /**
    * This function calculates the extent for a specific layer
    * from its getCapabilities
    *
    * @private
    * @function
    * @param {Mx.GetCapabilities} capabilities
    * @param {String} layerName
    * @returns {Array<Number>} the extension
    */
   M.impl.GetCapabilities.prototype.getLayersRecursive_ = function(layer) {
      var layers = [];
      if (!M.utils.isNullOrEmpty(layer.Layer)) {
         layers = this.getLayersRecursive_(layer.Layer);
      }
      else if (M.utils.isArray(layer)) {
         layer.forEach(function(layerElem) {
            layers = layers.concat(this.getLayersRecursive_(layerElem));
         }, this);
      }
      else { // base case
         layers.push(new M.layer.WMS({
            url: this.serviceUrl_,
            name: layer.Name
         }));
      }
      return layers;
   };
})();
