goog.provide('M.impl.format.WMTSCapabilities');

goog.require('ol.format.WMTSCapabilities');

(function () {

   /**
    * @classdesc
    * Main constructor of the class. Creates a WMC formater
    *
    * @constructor
    * @param {Mx.parameters.LayerOptions} options custom options for this formater
    * @extends {ol.format.XML}
    * @api stable
    */
   M.impl.format.WMTSCapabilities = function (options) {
      /**
       * Parser of an specified WMC version
       * @private
       * @type {ol.format.XML}
       */
      this.parser = new ol.format.WMTSCapabilities();

      /**
       * Parsed capabilities
       * @private
       * @type {Mx.WMTSGetCapabilities}
       */
      this.capabilities = null;

      /**
       * Custom options for this formater
       * @private
       * @type {Mx.parameters.LayerOptions}
       */
      this.options = (options || {});
   };

   /**
    * @public
    * @function
    * @param {Document} data Document.
    * @return {Object} this
    * @api stable
    */
   M.impl.format.WMTSCapabilities.prototype.read = function (capabilities) {
      this.capabilities = this.parser.read(capabilities);
      return this;
   };

   /**
    * @public
    * @function
    * @param {String} layer the name of the layer to get its matrixSet.
    * @return {String} matrixSet name
    * @api stable
    */
   M.impl.format.WMTSCapabilities.prototype.getMatrixSet = function (layerName, srid) {
      var matrixSet;
      for (var i = 0, ilen = this.capabilities.Contents.Layer.length;
         (i < ilen) && (matrixSet === undefined); i++) {
         var layer = this.capabilities.Contents.Layer[i];
         if (layer.Identifier === layerName) {
            if (!M.utils.isNullOrEmpty(srid)) {
               // gets the matrixSet by the SRID
               for (var e = 0, elen = layer.TileMatrixSetLink.length;
                  (e < elen) && (matrixSet === undefined); e++) {
                  var matrixSetLink = layer.TileMatrixSetLink[e];
                  if (matrixSetLink.TileMatrixSet.contains(srid)) {
                     matrixSet = matrixSetLink.TileMatrixSet;
                  }
               }
            }
            if (matrixSet === undefined) {
               matrixSet = layer.TileMatrixSetLink[0].TileMatrixSet;
            }
         }
      }
      return matrixSet;
   };

   /**
    * @public
    * @function
    * @param {String} layer the name of the layer to get its matrixIds.
    * @return {Array<String>} ids of its matrix
    * @api stable
    */
   M.impl.format.WMTSCapabilities.prototype.getMatrixIds = function (layerName, srid) {
      var matrixIds = [];
      var matrixSet = this.getMatrixSet(layerName, srid);
      for (var i = 0, ilen = this.capabilities.Contents.TileMatrixSet.length; i < ilen; i++) {
         var tileMatrixSet = this.capabilities.Contents.TileMatrixSet[i];
         if (tileMatrixSet.Identifier === matrixSet) {
            matrixIds = tileMatrixSet.TileMatrix.map(function (tileMatrix) {
               return tileMatrix.Identifier;
            });
            break;
         }
      }
      return matrixIds;
   };

   /**
    * @public
    * @function
    * @param {String} layer the name of the layer to get its format.
    * @return {String} format of the layer.
    * @api stable
    */
   M.impl.format.WMTSCapabilities.prototype.getFormat = function (layerName) {
      var format;
      for (var i = 0, ilen = this.capabilities.Contents.Layer.length;
         (i < ilen) && (format === undefined); i++) {
         var layer = this.capabilities.Contents.Layer[i];
         if (layer.Identifier === layerName) {
            format = layer.Format[0];
         }
      }
      return format;
   };


   /**
    * @public
    * @function
    * @param {String} layer the name of the layer to get its format.
    * @return {String} format of the layer.
    * @api stable
    */
   M.impl.format.WMTSCapabilities.prototype.getOptionsFromCapabilities = function (layerName, matrixSet) {
      var options = ol.source.WMTS.optionsFromCapabilities(this.capabilities, {
         'layer': layerName,
         'matrixSet': matrixSet
      });

      return options;
   };
})();