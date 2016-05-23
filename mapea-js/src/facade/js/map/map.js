goog.provide('M.Map');

goog.require('goog.dom.classlist');

goog.require('M.facade.Base');
goog.require('M.exception');
goog.require('M.utils');
goog.require('M.Layer');
goog.require('M.remote');
goog.require('M.Parameters');
goog.require('M.layer.WMC');
goog.require('M.layer.WMS');
goog.require('M.layer.WMTS');
goog.require('M.layer.KML');
goog.require('M.layer.WFS');
goog.require('M.layer.OSM');
goog.require('M.Control');
goog.require('M.control.WMCSelector');
goog.require('M.control.Scale');
goog.require('M.control.ScaleLine');
goog.require('M.control.Panzoombar');
goog.require('M.control.Panzoom');
goog.require('M.control.LayerSwitcher');
goog.require('M.control.Mouse');
goog.require('M.control.Navtoolbar');
goog.require('M.control.OverviewMap');
goog.require('M.control.Location');
goog.require('M.control.GetFeatureInfo');
goog.require('M.Label');
goog.require('M.Plugin');

(function () {
   /**
    * @classdesc
    * Main constructor of the class. Creates a Map
    * with parameters specified by the user
    *
    * @constructor
    * @extends {M.facade.Base}
    * @param {string|Mx.parameters.Map} userParameters parameters
    * @param {Mx.parameters.MapOptions} options custom options 
    * for the implementation
    * provided by the user
    * @api stable
    */
   M.Map = (function (userParameters, options) {
      // checks if the param is null or empty
      if (M.utils.isNullOrEmpty(userParameters)) {
         M.exception('No ha especificado ningún parámetro');
      }

      // checks if the implementation can create maps
      if (M.utils.isUndefined(M.impl.Map)) {
         M.exception('La implementación usada no posee un constructor');
      }

      // parses parameters to build the new map
      var params = new M.Parameters(userParameters);

      // adds class to the container
      goog.dom.classlist.add(params.container, 'm-container');

      // calls the super constructor
      var impl = new M.impl.Map(params.container, (options || {}));
      impl.setFacadeMap(this);

      goog.base(this, impl);

      // projection
      if (!M.utils.isNullOrEmpty(params.projection)) {
         this.setProjection(params.projection);
      }
      else { // default projection
         this.setProjection(M.config.DEFAULT_PROJ);
      }

      // maxExtent
      if (!M.utils.isNullOrEmpty(params.maxExtent)) {
         this.setMaxExtent(params.maxExtent);
      }

      // resolutions
      if (!M.utils.isNullOrEmpty(params.resolutions)) {
         this.setResolutions(params.resolutions);
      }

      // layers
      if (!M.utils.isNullOrEmpty(params.layers)) {
         this.addLayers(params.layers);
      }

      // wmc
      if (!M.utils.isNullOrEmpty(params.wmc)) {
         this.addWMC(params.wmc);
      }

      // wms
      if (!M.utils.isNullOrEmpty(params.wms)) {
         this.addWMS(params.wms);
      }

      // wmts
      if (!M.utils.isNullOrEmpty(params.wmts)) {
         this.addWMTS(params.wmts);
      }

      // kml
      if (!M.utils.isNullOrEmpty(params.kml)) {
         this.addKML(params.kml);
      }

      // controls
      if (!M.utils.isNullOrEmpty(params.controls)) {
         this.addControls(params.controls);
      }
      else { // default controls
         this.addControls('panzoom');
      }

      // getfeatureinfo
      if (!M.utils.isNullOrEmpty(params.getfeatureinfo)) {
         var getFeatureInfo = new M.control.GetFeatureInfo(params.getfeatureinfo);
         this.addControls(getFeatureInfo);
      }

      // default WMC
      if (this.getLayers().length === 0) {
         this.addWMC(M.config.predefinedWMC.predefinedNames[0]);
      }

      var this_ = this;

      // bbox
      if (!M.utils.isNullOrEmpty(params.bbox)) {
         this.setBbox(params.bbox);
      }
      else {
         // center
         if (!M.utils.isNullOrEmpty(params.center)) {
            this.setCenter(params.center);
         }
         else {
            this.getInitCenter_().then(function (initCenter) {
               this_.setCenter(initCenter);
            });
         }
         // zoom
         if (!M.utils.isNullOrEmpty(params.zoom)) {
            this.setZoom(params.zoom);
         }
      }

      // label
      if (!M.utils.isNullOrEmpty(params.label)) {
         this.getInitCenter_().then(function (initCenter) {
            this_.addLabel(params.label, initCenter);
         });
      }

      // initial zoom
      if (M.utils.isNullOrEmpty(params.bbox) && M.utils.isNullOrEmpty(params.zoom) && M.utils.isNullOrEmpty(params.center)) {
         this.zoomToMaxExtent();
      }
   });
   goog.inherits(M.Map, M.facade.Base);

   /**
    * This function gets the layers added to the map
    *
    * @function
    * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam
    * @returns {Array<M.Layer>}
    * @api stable
    */
   M.Map.prototype.getLayers = function (layersParam) {
      // checks if the implementation can manage layers
      if (M.utils.isUndefined(M.impl.Map.prototype.getLayers)) {
         M.exception('La implementación usada no posee el método getLayers');
      }

      var layers;

      // parses parameters to Array
      if (M.utils.isNull(layersParam)) {
         layersParam = [];
      }
      else if (!M.utils.isArray(layersParam)) {
         layersParam = [layersParam];
      }

      // gets the parameters as M.Layer objects to filter
      var filters = [];
      if (layersParam.length > 0) {
         filters = layersParam.map(M.parameter.layer);
      }

      // gets the layers
      layers = this.getImpl().getLayers(filters);

      return layers;
   };

   /**
    * This function gets the base layers added to the map
    *
    * @function
    * @returns {Array<M.Layer>}
    * @api stable
    */
   M.Map.prototype.getBaseLayers = function () {
      // checks if the implementation can manage layers
      if (M.utils.isUndefined(M.impl.Map.prototype.getBaseLayers)) {
         M.exception('La implementación usada no posee el método getBaseLayers');
      }

      return this.getImpl().getBaseLayers();
   };

   /**
    * This function adds layers specified by the user
    *
    * @function
    * @param {string|Object|Array<String>|Array<Object>} layersParam
    * @returns {M.Map}
    * @api stable
    */
   M.Map.prototype.addLayers = function (layersParam) {
      // checks if the parameter is null or empty
      if (M.utils.isNullOrEmpty(layersParam)) {
         M.exception('No ha especificado ninguna capa');
      }

      // checks if the implementation can manage layers
      if (M.utils.isUndefined(M.impl.Map.prototype.addLayers)) {
         M.exception('La implementación usada no posee el método addLayers');
      }

      // parses parameters to Array
      if (!M.utils.isArray(layersParam)) {
         layersParam = [layersParam];
      }

      // gets the parameters as M.Layer objects to add
      var layers = layersParam.map(function (layerParam) {
         var layer;

         if (layerParam instanceof M.Layer) {
            layer = layerParam;
         }
         else {
            var parameter = M.parameter.layer(layerParam);
            if (!M.utils.isNullOrEmpty(parameter.type)) {
               layer = new M.layer[parameter.type](layerParam);
            }
            else {
               M.exception('No se ha especificado un tipo válido para la capa');
            }
         }
         return layer;
      });

      // adds the layers
      this.getImpl().addLayers(layers);

      return this;
   };

   /**
    * This function removes the specified layers to the map
    *
    * @function
    * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam
    * specified by the user
    * @returns {M.Map}
    * @api stable
    */
   M.Map.prototype.removeLayers = function (layersParam) {
      // checks if the parameter is null or empty
      if (M.utils.isNullOrEmpty(layersParam)) {
         M.exception('No ha especificado ninguna capa a eliminar');
      }

      // checks if the implementation can manage layers
      if (M.utils.isUndefined(M.impl.Map.prototype.removeLayers)) {
         M.exception('La implementación usada no posee el método removeLayers');
      }

      // gets the layers to remove
      var layers = this.getLayers(layersParam);

      // removes the layers
      this.getImpl().removeLayers(layers);

      return this;
   };

   /**
    * This function gets the WMC layers added to the map
    *
    * @function
    * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam
    * @returns {Array<M.layer.WMC>}
    * @api stable
    */
   M.Map.prototype.getWMC = function (layersParam) {
      // checks if the implementation can manage layers
      if (M.utils.isUndefined(M.impl.Map.prototype.getWMC)) {
         M.exception('La implementación usada no posee el método getWMC');
      }

      var layers;

      // parses parameters to Array
      if (M.utils.isNull(layersParam)) {
         layersParam = [];
      }
      else if (!M.utils.isArray(layersParam)) {
         layersParam = [layersParam];
      }

      // gets the parameters as M.Layer objects to filter
      var filters = [];
      if (layersParam.length > 0) {
         filters = layersParam.map(function (layerParam) {
            return M.parameter.layer(layerParam, M.layer.type.WMC);
         });
      }

      // gets the layers
      layers = this.getImpl().getWMC(filters);

      return layers;
   };

   /**
    * This function adds the WMC layers to the map
    *
    * @function
    * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam
    * @returns {M.Map}
    * @api stable
    */
   M.Map.prototype.addWMC = function (layersParam) {
      // checks if the parameter is null or empty
      if (M.utils.isNullOrEmpty(layersParam)) {
         M.exception('No ha especificado ninguna capa WMC');
      }

      // checks if the implementation can manage layers
      if (M.utils.isUndefined(M.impl.Map.prototype.addWMC)) {
         M.exception('La implementación usada no posee el método addWMC');
      }

      var layers;

      // parses parameters to Array
      if (!M.utils.isArray(layersParam)) {
         layersParam = [layersParam];
      }

      // gets the parameters as M.layer.WMC objects to add
      var wmcLayers = [];
      layersParam.forEach(function (layerParam) {
         if (M.utils.isObject(layerParam) && (layerParam instanceof M.layer.WMC)) {
            wmcLayers.push(layerParam);
         }
         else if (!(layerParam instanceof M.Layer)) {
            wmcLayers.push(new M.layer.WMC(layerParam, layerParam.options));
         }
      });

      // adds the layers
      this.getImpl().addWMC(wmcLayers);

      /* checks if it should create the WMC control
         to select WMC */
      var addedWmcLayers = this.getWMC();
      if (addedWmcLayers.length > 1) {
         this.addControls(new M.control.WMCSelector());
      }

      // select the first WMC
      if (addedWmcLayers.length > 0) {
         addedWmcLayers[0].select();
      }

      return this;
   };

   /**
    * This function removes the WMC layers to the map
    *
    * @function
    * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam
    * @returns {M.Map}
    * @api stable
    */
   M.Map.prototype.removeWMC = function (layersParam) {
      // checks if the parameter is null or empty
      if (M.utils.isNullOrEmpty(layersParam)) {
         M.exception('No ha especificado ninguna capa WMC');
      }

      // checks if the implementation can manage layers
      if (M.utils.isUndefined(M.impl.Map.prototype.removeWMC)) {
         M.exception('La implementación usada no posee el método removeWMC');
      }

      // gets the layers
      var wmcLayers = this.getWMC(layersParam);
      if (wmcLayers.length > 0) {
         // removes the layers
         this.getImpl().removeWMC(wmcLayers);
      }
      return this;
   };

   /**
    * This function gets the KML layers added to the map
    *
    * @function
    * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam
    * @returns {Array<M.layer.KML>}
    * @api stable
    */
   M.Map.prototype.getKML = function (layersParam) {
      // checks if the implementation can manage layers
      if (M.utils.isUndefined(M.impl.Map.prototype.getKML)) {
         M.exception('La implementación usada no posee el método getKML');
      }

      var layers;

      // parses parameters to Array
      if (M.utils.isNull(layersParam)) {
         layersParam = [];
      }
      else if (!M.utils.isArray(layersParam)) {
         layersParam = [layersParam];
      }

      // gets the parameters as M.Layer objects to filter
      var filters = [];
      if (layersParam.length > 0) {
         filters = layersParam.map(function (layerParam) {
            return M.parameter.layer(layerParam, M.layer.type.KML);
         });
      }

      // gets the layers
      layers = this.getImpl().getKML(filters);

      return layers;
   };

   /**
    * This function adds the KML layers to the map
    *
    * @function
    * @param {Array<string>|Array<Mx.parameters.KML>} layersParam
    * @returns {M.Map}
    * @api stable
    */
   M.Map.prototype.addKML = function (layersParam) {
      // checks if the parameter is null or empty
      if (M.utils.isNullOrEmpty(layersParam)) {
         M.exception('No ha especificado ninguna capa KML');
      }

      // checks if the implementation can manage layers
      if (M.utils.isUndefined(M.impl.Map.prototype.addKML)) {
         M.exception('La implementación usada no posee el método addKML');
      }

      var layers;

      // parses parameters to Array
      if (!M.utils.isArray(layersParam)) {
         layersParam = [layersParam];
      }

      // gets the parameters as M.layer.KML objects to add
      var kmlLayers = [];
      layersParam.forEach(function (layerParam) {
         if (M.utils.isObject(layerParam) && (layerParam instanceof M.layer.KML)) {
            kmlLayers.push(layerParam);
         }
         else if (!(layerParam instanceof M.Layer)) {
            kmlLayers.push(new M.layer.KML(layerParam, layerParam.options));
         }
      });

      // adds the layers
      this.getImpl().addKML(kmlLayers);

      return this;
   };

   /**
    * This function removes the KML layers to the map
    *
    * @function
    * @param {Array<string>|Array<Mx.parameters.KML>} layersParam
    * @returns {M.Map}
    * @api stable
    */
   M.Map.prototype.removeKML = function (layersParam) {
      // checks if the parameter is null or empty
      if (M.utils.isNullOrEmpty(layersParam)) {
         M.exception('No ha especificado ninguna capa WMS');
      }

      // checks if the implementation can manage layers
      if (M.utils.isUndefined(M.impl.Map.prototype.removeKML)) {
         M.exception('La implementación usada no posee el método removeKML');
      }

      // gets the layers
      var kmlLayers = this.getKML(layersParam);
      if (kmlLayers.length > 0) {
         // removes the layers
         this.getImpl().removeKML(kmlLayers);
      }
      return this;
   };

   /**
    * This function gets the WMS layers added to the map
    *
    * @function
    * @param {Array<string>|Array<Mx.parameters.WMC>} layersParam
    * @returns {Array<M.layer.WMS>} layers from the map
    * @api stable
    */
   M.Map.prototype.getWMS = function (layersParam) {
      // checks if the implementation can manage layers
      if (M.utils.isUndefined(M.impl.Map.prototype.getWMS)) {
         M.exception('La implementación usada no posee el método getWMS');
      }

      var layers;

      // parses parameters to Array
      if (M.utils.isNull(layersParam)) {
         layersParam = [];
      }
      else if (!M.utils.isArray(layersParam)) {
         layersParam = [layersParam];
      }

      // gets the parameters as M.Layer objects to filter
      var filters = [];
      if (layersParam.length > 0) {
         filters = layersParam.map(function (layerParam) {
            return M.parameter.layer(layerParam, M.layer.type.WMS);
         });
      }

      // gets the layers
      layers = this.getImpl().getWMS(filters);

      return layers;
   };

   /**
    * This function adds the WMS layers to the map
    *
    * @function
    * @param {Array<string>|Array<Mx.parameters.WMS>} layersParam
    * @returns {M.Map}
    * @api stable
    */
   M.Map.prototype.addWMS = function (layersParam) {
      // checks if the parameter is null or empty
      if (M.utils.isNullOrEmpty(layersParam)) {
         M.exception('No ha especificado ninguna capa WMS');
      }

      // checks if the implementation can manage layers
      if (M.utils.isUndefined(M.impl.Map.prototype.addWMS)) {
         M.exception('La implementación usada no posee el método addWMS');
      }

      var layers;

      // parses parameters to Array
      if (!M.utils.isArray(layersParam)) {
         layersParam = [layersParam];
      }

      // gets the parameters as M.layer.WMS objects to add
      var wmsLayers = [];
      layersParam.forEach(function (layerParam) {
         if (M.utils.isObject(layerParam) && (layerParam instanceof M.layer.WMS)) {
            wmsLayers.push(layerParam);
         }
         else if (!(layerParam instanceof M.Layer)) {
            wmsLayers.push(new M.layer.WMS(layerParam, layerParam.options));
         }
      });

      // adds the layers
      this.getImpl().addWMS(wmsLayers);

      return this;
   };

   /**
    * This function removes the WMS layers to the map
    *
    * @function
    * @param {Array<string>|Array<Mx.parameters.WMS>} layersParam
    * @returns {M.Map}
    * @api stable
    */
   M.Map.prototype.removeWMS = function (layersParam) {
      // checks if the parameter is null or empty
      if (M.utils.isNullOrEmpty(layersParam)) {
         M.exception('No ha especificado ninguna capa WMS');
      }

      // checks if the implementation can manage layers
      if (M.utils.isUndefined(M.impl.Map.prototype.removeWMS)) {
         M.exception('La implementación usada no posee el método removeWMS');
      }

      // gets the layers
      var wmsLayers = this.getWMS(layersParam);
      if (wmsLayers.length > 0) {
         // removes the layers
         this.getImpl().removeWMS(wmsLayers);
      }
      return this;
   };

   /**
    * This function gets the WFS layers added to the map
    *
    * @function
    * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam
    * @returns {Array<M.layer.WFS>} layers from the map
    * @api stable
    */
   M.Map.prototype.getWFS = function (layersParam) {
      // checks if the implementation can manage layers
      if (M.utils.isUndefined(M.impl.Map.prototype.getWFS)) {
         M.exception('La implementación usada no posee el método getWFS');
      }

      var layers;

      // parses parameters to Array
      if (M.utils.isNull(layersParam)) {
         layersParam = [];
      }
      else if (!M.utils.isArray(layersParam)) {
         layersParam = [layersParam];
      }

      // gets the parameters as M.Layer objects to filter
      var filters = [];
      if (layersParam.length > 0) {
         filters = layersParam.map(function (layerParam) {
            return M.parameter.layer(layerParam, M.layer.type.WFS);
         });
      }

      // gets the layers
      layers = this.getImpl().getWFS(filters);

      return layers;
   };

   /**
    * This function adds the WFS layers to the map
    *
    * @function
    * @param {Array<string>|Array<Mx.parameters.WFS>} layersParam
    * @returns {M.Map}
    * @api stable
    */
   M.Map.prototype.addWFS = function (layersParam) {
      // checks if the parameter is null or empty
      if (M.utils.isNullOrEmpty(layersParam)) {
         M.exception('No ha especificado ninguna capa WFS');
      }

      // checks if the implementation can manage layers
      if (M.utils.isUndefined(M.impl.Map.prototype.addWFS)) {
         M.exception('La implementación usada no posee el método addWFS');
      }

      var layers;

      // parses parameters to Array
      if (!M.utils.isArray(layersParam)) {
         layersParam = [layersParam];
      }

      // gets the parameters as M.layer.WFS objects to add
      var wfsLayers = [];
      layersParam.forEach(function (layerParam) {
         if (M.utils.isObject(layerParam) && (layerParam instanceof M.layer.WFS)) {
            wfsLayers.push(layerParam);
         }
         else if (!(layerParam instanceof M.Layer)) {
            wfsLayers.push(new M.layer.WFS(layerParam, layerParam.options));
         }
      });

      // adds the layers
      this.getImpl().addWFS(wfsLayers);

      return this;
   };

   /**
    * This function removes the WFS layers to the map
    *
    * @function
    * @param {Array<string>|Array<Mx.parameters.WFS>} layersParam
    * @returns {M.Map}
    * @api stable
    */
   M.Map.prototype.removeWFS = function (layersParam) {
      // checks if the parameter is null or empty
      if (M.utils.isNullOrEmpty(layersParam)) {
         M.exception('No ha especificado ninguna capa WFS');
      }

      // checks if the implementation can manage layers
      if (M.utils.isUndefined(M.impl.Map.prototype.removeWFS)) {
         M.exception('La implementación usada no posee el método removeWFS');
      }

      // gets the layers
      var wfsLayers = this.getWFS(layersParam);
      if (wfsLayers.length > 0) {
         // removes the layers
         this.getImpl().removeWFS(wfsLayers);
      }
      return this;
   };

   /**
    * This function gets the WMTS layers added to the map
    *
    * @function
    * @param {Array<string>|Array<Mx.parameters.WMTS>} layersParam
    * @returns {Array<M.layer.WMTS>} layers from the map
    * @api stable
    */
   M.Map.prototype.getWMTS = function (layersParam) {
      // checks if the implementation can manage layers
      if (M.utils.isUndefined(M.impl.Map.prototype.getWMTS)) {
         M.exception('La implementación usada no posee el método getWMTS');
      }

      var layers;

      // parses parameters to Array
      if (M.utils.isNull(layersParam)) {
         layersParam = [];
      }
      else if (!M.utils.isArray(layersParam)) {
         layersParam = [layersParam];
      }

      // gets the parameters as M.Layer objects to filter
      var filters = [];
      if (layersParam.length > 0) {
         filters = layersParam.map(function (layerParam) {
            return M.parameter.layer(layerParam, M.layer.type.WMTS);
         });
      }

      // gets the layers
      layers = this.getImpl().getWMTS(filters);

      return layers;
   };

   /**
    * This function adds the WMTS layers to the map
    *
    * @function
    * @param {Array<string>|Array<Mx.parameters.WMTS>} layersParam
    * @returns {M.Map}
    * @api stable
    */
   M.Map.prototype.addWMTS = function (layersParam) {
      // checks if the parameter is null or empty
      if (M.utils.isNullOrEmpty(layersParam)) {
         M.exception('No ha especificado ninguna capa WMTS');
      }

      // checks if the implementation can manage layers
      if (M.utils.isUndefined(M.impl.Map.prototype.addWMTS)) {
         M.exception('La implementación usada no posee el método addWMTS');
      }

      var layers;

      // parses parameters to Array
      if (!M.utils.isArray(layersParam)) {
         layersParam = [layersParam];
      }

      // gets the parameters as M.layer.WMS objects to add
      var wmtsLayers = [];
      layersParam.forEach(function (layerParam) {
         if (M.utils.isObject(layerParam) && (layerParam instanceof M.layer.WMTS)) {
            wmtsLayers.push(layerParam);
         }
         else if (!(layerParam instanceof M.Layer)) {
            wmtsLayers.push(new M.layer.WMTS(layerParam, layerParam.options));
         }
      });

      // adds the layers
      this.getImpl().addWMTS(wmtsLayers);

      return this;
   };

   /**
    * This function removes the WMTS layers to the map
    *
    * @function
    * @param {Array<string>|Array<Mx.parameters.WMTS>} layersParam
    * @returns {M.Map}
    * @api stable
    */
   M.Map.prototype.removeWMTS = function (layersParam) {
      // checks if the parameter is null or empty
      if (M.utils.isNullOrEmpty(layersParam)) {
         M.exception('No ha especificado ninguna capa WMTS');
      }

      // checks if the implementation can manage layers
      if (M.utils.isUndefined(M.impl.Map.prototype.removeWMTS)) {
         M.exception('La implementación usada no posee el método removeWMTS');
      }

      // gets the layers
      var wmtsLayers = this.getWMTS(layersParam);
      if (wmtsLayers.length > 0) {
         // removes the layers
         this.getImpl().removeWMTS(wmtsLayers);
      }
      return this;
   };

   /**
    * This function gets the MBtiles layers added to the map
    *
    * @function
    * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam
    * @returns {Array<M.layer.MBtiles>} layers from the map
    * @api stable
    */
   M.Map.prototype.getMBtiles = function (layersParam) {
      // checks if the implementation can manage layers
      if (M.utils.isUndefined(M.impl.Map.prototype.getMBtiles)) {
         M.exception('La implementación usada no posee el método getMBtiles');
      }

      var layers;

      // parses parameters to Array
      if (M.utils.isNull(layersParam)) {
         layersParam = [];
      }
      else if (!M.utils.isArray(layersParam)) {
         layersParam = [layersParam];
      }

      // gets the parameters as M.Layer objects to filter
      var filters = [];
      if (layersParam.length > 0) {
         filters = layersParam.map(M.parameter.layer);
      }

      // gets the layers
      layers = this.getImpl().getMBtiles(filters);

      return layers;
   };

   /**
    * This function adds the MBtiles layers to the map
    *
    * @function
    * @param {Array<string>|Array<Mx.parameters.MBtiles>} layersParam
    * @returns {M.Map}
    * @api stable
    */
   M.Map.prototype.addMBtiles = function (layersParam) {
      // TODO
   };

   /**
    * This function removes the MBtiles layers to the map
    *
    * @function
    * @param {Array<string>|Array<Mx.parameters.MBtiles>} layersParam
    * @returns {M.Map}
    * @api stable
    */
   M.Map.prototype.removeMBtiles = function (layersParam) {
      // TODO
   };

   /**
    * This function gets controls specified by the user
    *
    * @public
    * @function
    * @param {string|Array<String>} controlsParam
    * @returns {Array<M.Control>}
    * @api stable
    */
   M.Map.prototype.getControls = function (controlsParam) {
      // checks if the implementation can manage layers
      if (M.utils.isUndefined(M.impl.Map.prototype.getControls)) {
         M.exception('La implementación usada no posee el método getControls');
      }

      // parses parameters to Array
      if (M.utils.isNull(controlsParam)) {
         controlsParam = [];
      }
      else if (!M.utils.isArray(controlsParam)) {
         controlsParam = [controlsParam];
      }

      // gets the controls
      var controls = this.getImpl().getControls(controlsParam);

      return controls;
   };

   /**
    * This function adds controls specified by the user
    *
    * @public
    * @function
    * @param {string|Object|Array<String>|Array<Object>} controlsParam
    * @returns {M.Map}
    * @api stable
    */
   M.Map.prototype.addControls = function (controlsParam) {
      // checks if the parameter is null or empty
      if (M.utils.isNullOrEmpty(controlsParam)) {
         M.exception('No ha especificado ningún control');
      }

      // checks if the implementation can manage layers
      if (M.utils.isUndefined(M.impl.Map.prototype.addControls)) {
         M.exception('La implementación usada no posee el método addControls');
      }

      // parses parameters to Array
      if (!M.utils.isArray(controlsParam)) {
         controlsParam = [controlsParam];
      }

      // gets the parameters as M.Control to add them
      var controls = controlsParam.map(function (controlParam) {
         var control;
         if (M.utils.isString(controlParam)) {
            controlParam = M.utils.normalize(controlParam);
            switch (controlParam) {
            case M.control.Scale.NAME:
               control = new M.control.Scale();
               break;
            case M.control.ScaleLine.NAME:
               control = new M.control.ScaleLine();
               break;
            case M.control.Panzoombar.NAME:
               control = new M.control.Panzoombar();
               break;
            case M.control.Panzoom.NAME:
               control = new M.control.Panzoom();
               break;
            case M.control.LayerSwitcher.NAME:
               control = new M.control.LayerSwitcher();
               break;
            case M.control.Mouse.NAME:
               control = new M.control.Mouse();
               break;
            case M.control.Navtoolbar.NAME:
               control = new M.control.Navtoolbar();
               break;
            case M.control.OverviewMap.NAME:
               control = new M.control.OverviewMap();
               break;
            case M.control.Location.NAME:
               control = new M.control.Location();
               break;
            default:
               M.exception('El control "'.concat(controlParam).concat('" no es un control válido.'));
               break;
            }
         }
         else if (controlParam instanceof M.Control) {
            control = controlParam;
         }
         else {
            M.exception('El control "'.concat(controlParam).concat('" no es un control válido.'));
         }
         control.addTo(this);
         return control;
      }, this);

      this.getImpl().addControls(controls);

      return this;
   };

   /**
    * This function removes the specified controls from the map
    *
    * @function
    * @param {string|Array<string>} controlsParam
    * specified by the user
    * @returns {M.Map}
    * @api stable
    */
   M.Map.prototype.removeControls = function (controlsParam) {
      // checks if the parameter is null or empty
      if (M.utils.isNullOrEmpty(controlsParam)) {
         M.exception('No ha especificado ningún control a eliminar');
      }

      // checks if the implementation can manage controls
      if (M.utils.isUndefined(M.impl.Map.prototype.removeControls)) {
         M.exception('La implementación usada no posee el método removeControls');
      }

      // gets the contros to remove
      var controls = this.getControls(controlsParam);
      if (controls.length > 0) {
         // removes the controls
         this.getImpl().removeControls(controls);
      }

      return this;
   };

   /**
    * This function removes the specified controls from the map
    *
    * @function
    * @param {string|Array<string>} controlsParam
    * specified by the user
    * @returns {M.Map}
    * @api stable
    */
   M.Map.prototype.removePlugins = function (controlsParam) {
      // checks if the parameter is null or empty
      if (M.utils.isNullOrEmpty(controlsParam)) {
         M.exception('No ha especificado ningún control a eliminar');
      }
      // removes the controls
      controlsParam.destroy();
      return this;
   };

   /**
    * This function provides the maximum extent for this
    * map instance
    *
    * @public
    * @function
    * @returns {Mx.Extent}
    * @api stable
    */
   M.Map.prototype.getMaxExtent = function () {
      // checks if the implementation can set the maxExtent
      if (M.utils.isUndefined(M.impl.Map.prototype.getMaxExtent)) {
         M.exception('La implementación usada no posee el método getMaxExtent');
      }

      // parses the parameter
      var maxExtent = this.getImpl().getMaxExtent();

      return maxExtent;
   };

   /**
    * This function sets the maximum extent for this
    * map instance
    *
    * @public
    * @function
    * @param {String|Array<String>|Array<Number>|Mx.Extent} maxExtentParam the extent max
    * @returns {M.Map}
    * @api stable
    */
   M.Map.prototype.setMaxExtent = function (maxExtentParam) {
      // checks if the param is null or empty
      if (M.utils.isNullOrEmpty(maxExtentParam)) {
         M.exception('No ha especificado ningún maxExtent');
      }

      // checks if the implementation can set the maxExtent
      if (M.utils.isUndefined(M.impl.Map.prototype.setMaxExtent)) {
         M.exception('La implementación usada no posee el método setMaxExtent');
      }

      // parses the parameter
      var maxExtent = M.parameter.maxExtent(maxExtentParam);
      this.getImpl().setMaxExtent(maxExtent);

      return this;
   };

   /**
    * This function provides the current extent (bbox) of this
    * map instance
    *
    * @public
    * @function
    * @returns {Mx.Extent}
    * @api stable
    */
   M.Map.prototype.getBbox = function () {
      // checks if the implementation can set the maxExtent
      if (M.utils.isUndefined(M.impl.Map.prototype.getBbox)) {
         M.exception('La implementación usada no posee el método getBbox');
      }

      var bbox = this.getImpl().getBbox();

      return bbox;
   };

   /**
    * This function sets the bbox for this
    * map instance
    *
    * @public
    * @function
    * @param {String|Array<String>|Array<Number>|Mx.Extent} bboxParam the bbox
    * @returns {M.Map}
    * @api stable
    */
   M.Map.prototype.setBbox = function (bboxParam) {
      // checks if the param is null or empty
      if (M.utils.isNullOrEmpty(bboxParam)) {
         M.exception('No ha especificado ningún bbox');
      }

      // checks if the implementation can set the maxExtent
      if (M.utils.isUndefined(M.impl.Map.prototype.setBbox)) {
         M.exception('La implementación usada no posee el método setBbox');
      }

      // parses the parameter
      var bbox = M.parameter.maxExtent(bboxParam);
      this.getImpl().setBbox(bbox);

      return this;
   };

   /**
    * This function provides the current zoom of this
    * map instance
    *
    * @public
    * @function
    * @returns {Number}
    * @api stable
    */
   M.Map.prototype.getZoom = function () {
      // checks if the implementation can get the zoom
      if (M.utils.isUndefined(M.impl.Map.prototype.getZoom)) {
         M.exception('La implementación usada no posee el método getZoom');
      }

      var zoom = this.getImpl().getZoom();

      return zoom;
   };

   /**
    * This function sets the zoom for this
    * map instance
    *
    * @public
    * @function
    * @param {String|Number} zoomParam the zoom
    * @returns {M.Map}
    * @api stable
    */
   M.Map.prototype.setZoom = function (zoomParam) {
      // checks if the param is null or empty
      if (M.utils.isNullOrEmpty(zoomParam)) {
         M.exception('No ha especificado ningún zoom');
      }

      // checks if the implementation can set the zoom
      if (M.utils.isUndefined(M.impl.Map.prototype.setZoom)) {
         M.exception('La implementación usada no posee el método setZoom');
      }

      // parses the parameter
      var zoom = M.parameter.zoom(zoomParam);
      this.getImpl().setZoom(zoom);

      return this;
   };

   // 
   /**
    * This function provides the current center of this
    * map instance
    *
    * @public
    * @function
    * @returns {Array<Number>}
    * @api stable
    */
   M.Map.prototype.getCenter = function () {
      // checks if the implementation can get the center
      if (M.utils.isUndefined(M.impl.Map.prototype.getCenter)) {
         M.exception('La implementación usada no posee el método getCenter');
      }

      var center = this.getImpl().getCenter();

      return center;
   };

   /**
    * This function sets the center for this
    * map instance
    *
    * @public
    * @function
    * @param {String|Array<String>|Array<Number>|Mx.Center} centerParam the new center
    * @returns {M.Map}
    * @api stable
    */
   M.Map.prototype.setCenter = function (centerParam) {
      // checks if the param is null or empty
      if (M.utils.isNullOrEmpty(centerParam)) {
         M.exception('No ha especificado ningún center');
      }

      // checks if the implementation can set the center
      if (M.utils.isUndefined(M.impl.Map.prototype.setCenter)) {
         M.exception('La implementación usada no posee el método setCenter');
      }

      // parses the parameter
      var center = M.parameter.center(centerParam);
      this.getImpl().setCenter(center);

      return this;
   };

   /**
    * This function provides the resolutions of this
    * map instance
    *
    * @public
    * @function
    * @returns {Array<Number>}
    * @api stable
    */
   M.Map.prototype.getResolutions = function () {
      // checks if the implementation can set the maxExtent
      if (M.utils.isUndefined(M.impl.Map.prototype.getResolutions)) {
         M.exception('La implementación usada no posee el método getResolutions');
      }

      var resolutions = this.getImpl().getResolutions();

      return resolutions;
   };

   /**
    * This function sets the resolutions for this
    * map instance
    *
    * @public
    * @function
    * @param {String|Array<String>|Array<Number>} resolutionsParam the resolutions
    * @returns {M.Map}
    * @api stable
    */
   M.Map.prototype.setResolutions = function (resolutionsParam) {
      // checks if the param is null or empty
      if (M.utils.isNullOrEmpty(resolutionsParam)) {
         M.exception('No ha especificado ninguna resolución');
      }

      // checks if the implementation can set the setResolutions
      if (M.utils.isUndefined(M.impl.Map.prototype.setResolutions)) {
         M.exception('La implementación usada no posee el método setResolutions');
      }

      // parses the parameter
      var resolutions = M.parameter.resolutions(resolutionsParam);

      this.getImpl().setResolutions(resolutions);

      return this;
   };

   /**
    * This function provides the current projection of this
    * map instance
    *
    * @public
    * @function
    * @returns {Mx.Projection}
    * @api stable
    */
   M.Map.prototype.getProjection = function () {
      // checks if the implementation has the method
      if (M.utils.isUndefined(M.impl.Map.prototype.getProjection)) {
         M.exception('La implementación usada no posee el método getProjection');
      }

      var projection = this.getImpl().getProjection();

      return projection;
   };

   /**
    * This function sets the projection for this
    * map instance
    *
    * @public
    * @function
    * @param {String|Mx.Projection} projection the bbox
    * @returns {M.Map}
    * @api stable
    */
   M.Map.prototype.setProjection = function (projection) {
      // checks if the param is null or empty
      if (M.utils.isNullOrEmpty(projection)) {
         M.exception('No ha especificado ninguna proyección');
      }

      // checks if the implementation can set the projection
      if (M.utils.isUndefined(M.impl.Map.prototype.setProjection)) {
         M.exception('La implementación usada no posee el método setProjection');
      }

      // parses the parameter
      projection = M.parameter.projection(projection);
      this.getImpl().setProjection(projection);

      return this;
   };

   /**
    * This function adds an instance of a specified
    * developed plugin
    *
    * @public
    * @function
    * @param {Mx.Plugin} plugin the plugin to add to the map
    * @returns {M.Map}
    * @api stable
    */
   M.Map.prototype.addPlugin = function (plugin) {
      // checks if the param is null or empty
      if (M.utils.isNullOrEmpty(plugin)) {
         M.exception('No ha especificado ningún plugin');
      }

      // checks if the plugin can be added to the map
      if (M.utils.isUndefined(plugin.addTo)) {
         M.exception('El plugin no puede añadirse al mapa');
      }

      plugin.addTo(this);

      return this;
   };

   /**
    * This function provides the promise of envolved extent of this
    * map instance
    *
    * @public
    * @function
    * @returns {Promise}
    * @api stable
    */
   M.Map.prototype.getEnvolvedExtent = function () {
      // checks if the implementation can set the maxExtent
      if (M.utils.isUndefined(M.impl.Map.prototype.getEnvolvedExtent)) {
         M.exception('La implementación usada no posee el método getEnvolvedExtent');
      }

      var envolvedExtent = this.getImpl().getEnvolvedExtent();

      return envolvedExtent;
   };

   /**
    * This function gets and zooms the map into the
    * calculated extent
    *
    * @public
    * @function
    * @returns {M.Map}
    * @api stable
    */
   M.Map.prototype.zoomToMaxExtent = function () {
      // zoom to maxExtent if no zoom was specified
      var maxExtent = this.getMaxExtent();
      if (!M.utils.isNullOrEmpty(maxExtent)) {
         this.setBbox(maxExtent);
      }
      else {
         /* if no maxExtent was provided then
          calculates the envolved extent */
         var this_ = this;
         this.getEnvolvedExtent().then(function (extent) {
            this_.setBbox(extent);
         });
      }

      return this;
   };

   /**
    * This function gets and zooms the map into the
    * calculated extent
    *
    * @private
    * @function
    * @returns {M.Map}
    */
   M.Map.prototype.getInitCenter_ = function () {
      var this_ = this;
      var promise = new Promise(function (success, fail) {
         var center = this_.getCenter();
         if (!M.utils.isNullOrEmpty(center)) {
            success(center);
         }
         else {
            var maxExtent = this_.getMaxExtent();
            if (!M.utils.isNullOrEmpty(maxExtent)) {
               // obtener centro del maxExtent
               center = {
                  'x': ((maxExtent.x.max + maxExtent.x.min) / 2),
                  'y': ((maxExtent.y.max + maxExtent.y.min) / 2)
               };
               success(center);
            }
            else {
               this_.getEnvolvedExtent().then(function (extent) {
                  // obtener centrol del extent
                  center = {
                     'x': ((extent.x.max + extent.x.min) / 2),
                     'y': ((extent.y.max + extent.y.min) / 2)
                  };
                  success(center);
               });
            }
         }

      });
      return promise;
   };

   /**
    * This function destroys this map, cleaning the HTML
    * and unregistering all events
    *
    * @public
    * @function
    * @returns {M.Map}
    * @api stable
    */
   M.Map.prototype.destroy = function () {
      // checks if the implementation can provide the implementation map
      if (M.utils.isUndefined(M.impl.Map.prototype.destroy)) {
         M.exception('La implementación usada no posee el método destroy');
      }

      this.getImpl().destroy();

      return this;
   };

   /**
    * This function removes the WMC layers to the map
    *
    * @function
    * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam
    * @api stable
    */
   M.Map.prototype.addLabel = function (layersParam, coordParam) {
      // checks if the param is null or empty
      if (M.utils.isNullOrEmpty(layersParam)) {
         M.exception('No ha especificado ninguna proyección');
      }

      // checks if the implementation can add labels
      if (M.utils.isUndefined(M.impl.Map.prototype.addLabel)) {
         M.exception('La implementación usada no posee el método addLabel');
      }

      var text = null;
      var coord = null;

      // object
      if (M.utils.isObject(layersParam)) {
         text = layersParam.text;
         coord = layersParam.coord;
      }
      // string
      else {
         text = layersParam;
         coord = coordParam;
      }

      if (M.utils.isNullOrEmpty(coord)) {
         coord = this.getCenter();
      }
      else {
         coord = M.parameter.center(coord);
      }

      var label = new M.Label(text, coord);
      this.getImpl().addLabel(label);
   };


   /**
    * This function removes the WMC layers to the map
    *
    * @function
    * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam
    * @returns {M.Map}
    * @api stable
    */
   M.Map.prototype.getLabel = function () {
      return this.getImpl().getLabel();
   };


   /**
    * This function removes the WMC layers to the map
    *
    * @function
    * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam
    * @returns {M.Map}
    * @api stable
    */
   M.Map.prototype.removeLabel = function () {
      return this.getImpl().removeLabel();
   };

   /**
    * This function removes the WMC layers to the map
    *
    * @function
    * @param {Array<Mx.Point>|Mx.Point} points
    * @api stable
    */
   M.Map.prototype.drawPoints = function (points) {
      // checks if the param is null or empty
      if (M.utils.isNullOrEmpty(points)) {
         M.exception('No ha especificado ningún punto');
      }

      // checks if the implementation can add points
      if (M.utils.isUndefined(M.impl.Map.prototype.drawPoints)) {
         M.exception('La implementación usada no posee el método drawPoints');
      }

      if (!M.utils.isArray(points)) {
         points = [points];
      }

      this.getImpl().drawPoints(points);
   };

   /**
    * This function removes the WMC layers to the map
    *
    * @function
    * @returns {Array<Mx.Point>}
    * @api stable
    */
   M.Map.prototype.getPoints = function (coordinate) {
      // checks if the implementation can add points
      if (M.utils.isUndefined(M.impl.Map.prototype.getPoints)) {
         M.exception('La implementación usada no posee el método getPoints');
      }

      return this.getImpl().getPoints(coordinate);
   };

   /**
    * This function provides the core map used by the
    * implementation
    *
    * @function
    * @api stable
    * @returns {Object} core map used by the implementation
    */
   M.Map.prototype.getMapImpl = function () {
      // checks if the implementation can add points
      if (M.utils.isUndefined(M.impl.Map.prototype.getMapImpl)) {
         M.exception('La implementación usada no posee el método getMapImpl');
      }
      return this.getImpl().getMapImpl();
   };
})();