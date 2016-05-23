goog.provide('M.impl.layer.WMTS');

goog.require('M.impl.format.WMTSCapabilities');
goog.require('M.utils');
goog.require('M.exception');
goog.require('M.impl.Layer');

goog.require('ol.layer.Tile');
goog.require('ol.source.WMTS');
goog.require('ol.extent');

(function () {
   /**
    * @classdesc
    * Main constructor of the class. Creates a WMTS layer
    * with parameters specified by the user
    *
    * @constructor
    * @implements {M.impl.Layer}
    * @param {Mx.parameters.LayerOptions} options custom options for this layer
    * @api stable
    */
   M.impl.layer.WMTS = (function (options) {
      /**
       * Options from the GetCapabilities
       * @private
       * @type {M.impl.format.WMTSCapabilities}
       */
      this.capabilitiesOptions = null;

      // calls the super constructor
      goog.base(this, options);
   });
   goog.inherits(M.impl.layer.WMTS, M.impl.Layer);

   /**
    * This function sets the map object of the layer
    *
    * @public
    * @function
    * @param {M.impl.Map} map
    * @api stable
    */
   M.impl.layer.WMTS.prototype.addTo = function (map) {
      this.map = map;

      // calculates the resolutions from scales
      if (!M.utils.isNull(this.options) && !M.utils.isNull(this.options.minScale) && !M.utils.isNull(this.options.maxScale)) {
         var units = this.map.getMapImpl().getView().getProjection().getUnits();
         this.options.minResolution = M.utils.getResolutionFromScale(this.options.minScale, units);
         this.options.maxResolution = M.utils.getResolutionFromScale(this.options.maxScale, units);
      }

      // adds layer from capabilities
      var this_ = this;
      this.getCapabilitiesOptions_().then(function (capabilitiesOptions) {
         this_.addLayer_(capabilitiesOptions);
      });
   };

   /**
    * This function sets the resolutions for this layer
    *
    * @public
    * @function
    * @param {Array<Number>} resolutions
    * @api stable
    */
   M.impl.layer.WMTS.prototype.setResolutions = function (resolutions) {
      // gets the projection
      var projection = ol.proj.get(this.map.getProjection().code);

      // gets the extent         
      var extent = this.map.getMaxExtent();
      var olExtent, tileGrid;
      if (!M.utils.isNullOrEmpty(extent)) {
         olExtent = [extent.x.min, extent.y.min, extent.x.max, extent.y.max];
      }
      else {
         olExtent = projection.getExtent();
      }

      if (!M.utils.isNull(this.capabilitiesParser)) {
         // gets matrix
         var matrixSet = this.capabilitiesParser.getMatrixSet(this.name);
         var matrixIds = this.capabilitiesParser.getMatrixIds(this.name);

         // gets format
         var format = this.capabilitiesParser.getFormat(this.name);

         var newSource = new ol.source.WMTS({
            url: this.url,
            layer: this.name,
            matrixSet: matrixSet,
            format: format,
            projection: projection,
            tileGrid: new ol.tilegrid.WMTS({
               origin: ol.extent.getBottomLeft(olExtent),
               resolutions: resolutions,
               matrixIds: matrixIds
            }),
            extent: olExtent
         });
         this.ol3Layer.setSource(newSource);
      }
      else {
         // adds layer from capabilities
         var this_ = this;
         this.getCapabilities_().then(function (capabilitiesParser) {
            this_.capabilitiesParser = capabilitiesParser;

            // gets matrix
            var matrixSet = this_.capabilitiesParser.getMatrixSet(this_.name);
            var matrixIds = this_.capabilitiesParser.getMatrixIds(this_.name);

            // gets format
            var format = this_.capabilitiesParser.getFormat(this_.name);

            var newSource = new ol.source.WMTS({
               url: this_.url,
               layer: this_.name,
               matrixSet: matrixSet,
               format: format,
               projection: projection,
               tileGrid: new ol.tilegrid.WMTS({
                  origin: ol.extent.getBottomLeft(olExtent),
                  resolutions: resolutions,
                  matrixIds: matrixIds
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
   M.impl.layer.WMTS.prototype.addLayer_ = function (capabilitiesOptions) {
      // gets resolutions from defined min/max resolutions
      var minResolution = this.options.minResolution;
      var maxResolution = this.options.maxResolution;

      this.ol3Layer = new ol.layer.Tile({
         visible: this.options.visibility,
         source: new ol.source.WMTS(capabilitiesOptions),
         minResolution: minResolution,
         maxResolution: maxResolution
      });
      this.map.getMapImpl().addLayer(this.ol3Layer);
   };

   /**
    * This function gets the capabilities
    * of the WMTS service
    *
    * @private
    * @function
    */
   M.impl.layer.WMTS.prototype.getCapabilitiesOptions_ = function () {
      // name
      var layerName = this.name;
      // matrix set
      var matrixSet = this.matrixSet;
      if (M.utils.isNullOrEmpty(matrixSet)) {
         /* if no matrix set was specified then
            it supposes the matrix set has the name
            of the projection*/
         matrixSet = this.map.getProjection().code;
      }
      // capabilities url
      var getCapabilitiesUrl = M.utils.getWMTSGetCapabilitiesUrl(this.url);
      // parser
      var parser = new ol.format.WMTSCapabilities();
      var this_ = this;
      var promise = new Promise(function (success, fail) {
         M.remote.get(getCapabilitiesUrl).then(function (response) {
            var getCapabilitiesDocument = response.responseXml;
            var parsedCapabilities = parser.read(getCapabilitiesDocument);
            var options = ol.source.WMTS.optionsFromCapabilities(parsedCapabilities, {
               'layer': layerName,
               'matrixSet': matrixSet
            });
            success.call(this_, options);
         });
      });
      return promise;
   };

   /**
    * This function destroys this layer, cleaning the HTML
    * and unregistering all events
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.layer.WMTS.prototype.destroy = function () {
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
   M.impl.layer.WMTS.prototype.equals = function (obj) {
      var equals = false;

      if (obj instanceof M.impl.layer.WMTS) {
         equals = (this.url === obj.url);
         equals = equals && (this.name === obj.name);
         equals = equals && (this.matrixSet === obj.matrixSet);
      }

      return equals;
   };
})();