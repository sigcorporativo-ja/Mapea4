goog.provide('M.control.LayerSwitcher');

goog.require('M.Control');
goog.require('M.utils');
goog.require('M.exception');

(function () {
   /**
    * @classdesc
    * Main constructor of the class. Creates a GetFeatureInfo
    * control to provides a popup with information about the place 
    * where the user has clicked inside the map.
    *
    * @constructor
    * @param {String} format format response
    * @extends {M.Control}
    * @api stable
    */
   M.control.LayerSwitcher = (function () {
      if (M.utils.isUndefined(M.impl.control.LayerSwitcher)) {
         M.exception('La implementación usada no puede crear controles LayerSwitcher');
      }
      // implementation of this control
      var impl = new M.impl.control.LayerSwitcher();

      // calls the super constructor
      goog.base(this, impl);
   });
   goog.inherits(M.control.LayerSwitcher, M.Control);

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map map to add the control
    * @returns {Promise} html response
    * @api stable
    */
   M.control.LayerSwitcher.prototype.createView = function (map) {
      return M.template.compile(M.control.LayerSwitcher.TEMPLATE, M.control.LayerSwitcher.getTemplateVariables_(map));
   };

   /**
    * This function checks if an object is equals
    * to this control
    *
    * @function
    * @api stable
    */
   M.control.LayerSwitcher.prototype.equals = function (obj) {
      var equals = (obj instanceof M.control.LayerSwitcher);
      return equals;
   };

   /**
    * Gets the variables of the template to compile
    * @private
    */
   M.control.LayerSwitcher.getTemplateVariables_ = function (map) {
      // gets base layers (from WMS)
      var baseLayers = map.getBaseLayers().map(M.control.LayerSwitcher.parseLayerForTemplate_);

      // gets overlay layers
      var overlayLayers = map.getLayers().filter(function (layer) {
         var isTransparent = (layer.transparent === true);
         var isNotWMC = (layer.type !== M.layer.type.WMC);
         var isNotWMSFull = !M.utils.isNullOrEmpty(layer.name);
         return (isTransparent && isNotWMC && isNotWMSFull);
      }).map(M.control.LayerSwitcher.parseLayerForTemplate_);

      return {
         'baseLayers': baseLayers,
         'overlayLayers': overlayLayers
      };
   };

   /**
    * This function checks if an object is equals
    * to this control
    *
    * @private
    * @function
    */
   M.control.LayerSwitcher.parseLayerForTemplate_ = function (layer) {
      var layerTitle = layer.legend;
      if (M.utils.isNullOrEmpty(layerTitle)) {
         layerTitle = layer.name;
      }
      if (M.utils.isNullOrEmpty(layerTitle)) {
         layerTitle = 'Servicio WMS';
      }
      var legendImage = M.utils.addParameters(layer.url, {
         'SERVICE': "WMS",
         'VERSION': layer.version,
         'REQUEST': "GetLegendGraphic",
         'LAYER': layer.name,
         'FORMAT': "image/png",
         'EXCEPTIONS': "image/png"
      });
      var layerVar = {
         'base': (layer.transparent === false),
         'visible': (layer.isVisible() === true),
         'id': layer.name,
         'title': layerTitle,
         'legend': legendImage,
         'outOfRange': !layer.inRange()
      };
      return layerVar;
   };

   /**
    * Template for this controls - button
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.LayerSwitcher.NAME = 'layerswitcher';

   /**
    * Template for this controls - button
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.LayerSwitcher.TEMPLATE = 'layerswitcher.html';
})();