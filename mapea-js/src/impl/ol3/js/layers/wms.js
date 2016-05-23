goog.provide('M.impl.layer.WMS');

goog.require('M.utils');
goog.require('M.exception');
goog.require('M.impl.Layer');
goog.require('M.impl.format.WMSCapabilities');
goog.require('M.impl.GetCapabilities');

goog.require('ol.layer.Tile');
goog.require('ol.layer.Image');
goog.require('ol.source.TileWMS');
goog.require('ol.tilegrid.TileGrid');
goog.require('ol.source.ImageWMS');
goog.require('ol.extent');

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
   M.impl.layer.WMS = (function (options) {
      /**
       * The WMS layers instances from capabilities
       * @private
       * @type {Array<M.layer.WMS>}
       */
      this.layers = [];

      /**
       * get WMS getCapabilities promise
       * @private
       * @type {Promise}
       */
      this.getCapabilitiesPromise = null;

      /**
       * get WMS extent promise
       * @private
       * @type {Promise}
       */
      this.extentPromise = null;

      /**
       * Layer extent which was got from service getCapabilities
       * @private
       * @type {Mx.Extent}
       */
      this.extent = null;

      /**
       * Layer resolutions
       * @private
       * @type {Array<Number>}
       */
      this.resolutions_ = null;

      // sets visibility
      if (options.visibility === false) {
         this.visibility = false;
      }

      // calls the super constructor
      goog.base(this, options);
   });
   goog.inherits(M.impl.layer.WMS, M.impl.Layer);

   /**
    * This function sets the visibility of this layer
    *
    * @function
    * @api stable
    */
   M.impl.layer.WMS.prototype.setVisible = function (visibility) {
      if (this.inRange() === true) {
         this.visibility = visibility;

         // if this layer is base then it hides all base layers
         if ((visibility === true) && (this.transparent !== true)) {
            this.map.getBaseLayers().forEach(function (layer) {
               layer.setVisible(false);
            });
         }

         if (!M.utils.isNullOrEmpty(this.ol3Layer)) {
            this.ol3Layer.setVisible(visibility);
         }
      }
   };

   /**
    * This function sets the map object of the layer
    *
    * @public
    * @function
    * @param {M.impl.Map} map
    * @api stable
    */
   M.impl.layer.WMS.prototype.addTo = function (map) {
      this.map = map;

      // calculates the resolutions from scales
      if (!M.utils.isNull(this.options) && !M.utils.isNull(this.options.minScale) && !M.utils.isNull(this.options.maxScale)) {
         var units = this.map.getMapImpl().getView().getProjection().getUnits();
         this.options.minResolution = M.utils.getResolutionFromScale(this.options.minScale, units);
         this.options.maxResolution = M.utils.getResolutionFromScale(this.options.maxScale, units);
      }

      // checks if it is a WMS_FULL
      if (M.utils.isNullOrEmpty(this.name)) { // WMS_FULL (add all wms layers)
         this.addAllLayers_();
      }
      else { // just one WMS layer
         this.addSingleLayer_();
      }
   };

   /**
    * This function sets the resolutions for this layer
    *
    * @public
    * @function
    * @param {Array<Number>} resolutions
    * @api stable
    */
   M.impl.layer.WMS.prototype.setResolutions = function (resolutions) {
      this.resolutions_ = resolutions;

      if ((this.tiled === true) && !M.utils.isNullOrEmpty(this.ol3Layer)) {
         // gets the projection
         var projection = ol.proj.get(this.map.getProjection().code);

         // gets the extent
         var this_ = this;
         (new Promise(function (success, fail) {
            // gets the extent         
            var extent = this_.map.getMaxExtent();
            if (!M.utils.isNullOrEmpty(extent)) {
               success.call(this_, extent);
            }
            else {
               M.impl.envolvedExtent.calculate(this_.map, this_).then(success);
            }
         })).then(function (extent) {
            var olExtent = [extent.x.min, extent.y.min, extent.x.max, extent.y.max];

            var newSource = new ol.source.TileWMS({
               url: this_.url,
               params: {
                  'LAYERS': this_.name,
                  'TILED': true,
                  'VERSION': this_.version,
                  'TRANSPARENT': this_.transparent
               },
               tileGrid: new ol.tilegrid.TileGrid({
                  resolutions: resolutions,
                  extent: olExtent,
                  origin: ol.extent.getBottomLeft(olExtent)
               }),
               extent: olExtent
            });
            this_.ol3Layer.setSource(newSource);
         });
      }
   };

   /**
    * This function add this layer as unique layer
    *
    * @private
    * @function
    */
   M.impl.layer.WMS.prototype.addSingleLayer_ = function () {
      // gets resolutions from defined min/max resolutions
      var minResolution = this.options.minResolution;
      var maxResolution = this.options.maxResolution;

      // gets resolutions of the map
      var resolutions = this.map.getResolutions();

      // gets the extent
      var this_ = this;
      (new Promise(function (success, fail) {
         // gets the extent         
         var extent = this_.map.getMaxExtent();
         if (!M.utils.isNullOrEmpty(extent)) {
            success.call(this_, extent);
         }
         else {
            M.impl.envolvedExtent.calculate(this_.map, this_).then(success);
         }
      })).then(function (extent) {
         var olExtent = [extent.x.min, extent.y.min, extent.x.max, extent.y.max];
         var tileGrid;

         if (M.utils.isNullOrEmpty(resolutions) && !M.utils.isNullOrEmpty(this_.resolutions_)) {
            resolutions = this_.resolutions_;
         }

         // gets the tileGrid
         if (!M.utils.isNullOrEmpty(resolutions)) {
            tileGrid = new ol.tilegrid.TileGrid({
               resolutions: resolutions,
               extent: olExtent,
               origin: ol.extent.getBottomLeft(olExtent)
            });
         }

         if (this_.tiled === true) {
            this_.ol3Layer = new ol.layer.Tile({
               visible: this_.visibility,
               source: new ol.source.TileWMS({
                  url: this_.url,
                  params: {
                     'LAYERS': this_.name,
                     'TILED': true,
                     'VERSION': this_.version,
                     'TRANSPARENT': this_.transparent
                  },
                  tileGrid: tileGrid,
                  extent: olExtent
               }),
               minResolution: minResolution,
               maxResolution: maxResolution
            });
         }
         else {
            this_.ol3Layer = new ol.layer.Image({
               visible: this_.options.visibility,
               source: new ol.source.ImageWMS({
                  url: this_.url,
                  params: {
                     'LAYERS': this_.name,
                     'VERSION': this_.version
                  }
               }),
               minResolution: minResolution,
               maxResolution: maxResolution
            });
         }
         this_.map.getMapImpl().addLayer(this_.ol3Layer);
         // sets its visibility if it is in range
         if (this_.options.visibility !== false) {
            this_.setVisible(this_.inRange());
         }
         // sets its z-index
         if (this_.zIndex_ !== null) {
            this_.setZIndex(this_.zIndex_);
         }
         // sets the resolutions
         if (this_.resolutions_ !== null) {
            this_.setResolutions(this_.resolutions_);
         }
      });
   };

   /**
    * This function adds all layers defined int the server
    *
    * @private
    * @function
    */
   M.impl.layer.WMS.prototype.addAllLayers_ = function () {
      var this_ = this;
      this.getCapabilities().then(function (getCapabilities) {
         getCapabilities.getLayers().forEach(function (layer) {
            var wmsLayer = new M.layer.WMS({
               'url': this.url,
               'name': layer.name,
               'version': layer.version
            }, this.options);
            this.layers.push(wmsLayer);
            this.map.addWMS([wmsLayer]);
         }, this_);
      });

   };

   /**
    * This function gets the envolved extent for
    * this WMS
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.layer.WMS.prototype.getExtent = function () {
      // creates the promise
      if (M.utils.isNullOrEmpty(this.extentPromise)) {
         var this_ = this;
         this.extentPromise = new Promise(function (success, fail) {
            this_.getCapabilities().then(function (getCapabilities) {
               var extent = getCapabilities.getLayerExtent(this_.name);
               success(extent);
            });
         });
      }
      return this.extentPromise;
   };

   /**
    * This function gets the min resolution for
    * this WMS
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.layer.WMS.prototype.getMinResolution = function () {
      return this.options.minResolution;
   };

   /**
    * This function gets the max resolution for
    * this WMS
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.layer.WMS.prototype.getMaxResolution = function () {
      return this.options.maxResolution;
   };

   /**
    * This function gets the layers loaded from this
    * WMS FULL
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.layer.WMS.prototype.getLayers = function () {
      return this.layers;
   };

   /**
    * This function destroys this layer, cleaning the HTML
    * and unregistering all events
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.layer.WMS.prototype.getCapabilities = function () {
      // creates the promise
      if (M.utils.isNullOrEmpty(this.getCapabilitiesPromise)) {
         var layerUrl = this.url;
         var layerVersion = this.version;
         var projection = this.map.getProjection();
         this.getCapabilitiesPromise = new Promise(function (success, fail) {
            // gest the capabilities URL
            var wmsGetCapabilitiesUrl = M.utils.getWMSGetCapabilitiesUrl(layerUrl, layerVersion);
            // gets the getCapabilities response
            M.remote.get(wmsGetCapabilitiesUrl).then(function (response) {
               var getCapabilitiesDocument = response.responseXml;
               var getCapabilitiesParser = new M.impl.format.WMSCapabilities();
               var getCapabilities = getCapabilitiesParser.read(getCapabilitiesDocument);

               var getCapabilitiesUtils = new M.impl.GetCapabilities(getCapabilities, layerUrl, projection);
               success(getCapabilitiesUtils);
            });
         });
      }
      return this.getCapabilitiesPromise;
   };

   /**
    * This function destroys this layer, cleaning the HTML
    * and unregistering all events
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.layer.WMS.prototype.destroy = function () {
      var olMap = this.map.getMapImpl();
      if (!M.utils.isNullOrEmpty(this.ol3Layer)) {
         olMap.removeLayer(this.ol3Layer);
         this.ol3Layer = null;
      }
      if (!M.utils.isNullOrEmpty(this.layers)) {
         this.layers.map(this.map.removeLayers, this.map);
         this.layers.length = 0;
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
   M.impl.layer.WMS.prototype.equals = function (obj) {
      var equals = false;

      if (obj instanceof M.impl.layer.WMS) {
         equals = (this.url === obj.url);
         equals = equals && (this.name === obj.name);
         equals = equals && (this.cql === obj.cql);
         equals = equals && (this.version === obj.version);
      }

      return equals;
   };
})();