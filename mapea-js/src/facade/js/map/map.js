goog.provide('M.Map');

goog.require('goog.dom.classlist');

goog.require('M.facade.Base');
goog.require('M.exception');
goog.require('M.utils');
goog.require('M.Layer');
goog.require('M.remote');
goog.require('M.Parameters');
goog.require('M.style.state');
goog.require('M.ui.Panel');
goog.require('M.layer.WMC');
goog.require('M.layer.WMS');
goog.require('M.layer.WMTS');
goog.require('M.layer.KML');
goog.require('M.layer.WFS');
goog.require('M.layer.OSM');
goog.require('M.layer.Mapbox');
goog.require('M.layer.GeoJSON');
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
goog.require('M.Popup');
goog.require('M.dialog');
goog.require('M.Plugin');
goog.require('M.window');

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

    /**
     * @private
     * @type {array<M.ui.Panel>}
     * @expose
     */
    this._panels = [];

    /**
     * @private
     * @type {array<M.Plugin>}
     * @expose
     */
    this._plugins = [];

    /**
     * @private
     * @type {HTMLElement}
     * @expose
     */
    this._areasContainer = null;

    /**
     * The added popup
     * @private
     * @type {M.Popup}
     */
    this.popup_ = null;

    /**
     * Flag that indicates if the used projection
     * is by default
     * @public
     * @type {Boolean}
     * @api stable
     * @expose
     */
    this._defaultProj = true;

    /**
     * @public
     * @type {object}
     * @api stable
     */
    this.panel = {
      'LEFT': null,
      'RIGHT': 'null'
    };

    /**
     * @private
     * @type {Number}
     */
    this._userZoom = null;

    /**
     * TODO
     * @private
     * @type {Boolean}
     */
    this._finishedInitCenter = true;

    /**
     * TODO
     * @private
     * @type {Boolean}
     */
    this._finishedMaxExtent = true;

    /**
     * TODO
     * @private
     * @type {Boolean}
     */
    this._finishedMapImpl = false;

    /**
     * TODO
     * @private
     * @type {Boolean}
     */
    this._finishedMap = false;

    /**
     * Feature Center
     * @private
     * @type {ol.Feature}
     */
    this._featureCenter = null;


    var this_ = this;

    // parses parameters to build the new map
    var params = new M.Parameters(userParameters);

    // adds class to the container
    goog.dom.classlist.add(params.container, 'm-mapea-container');

    // calls the super constructor
    var impl = new M.impl.Map(params.container, (options || {}));
    impl.setFacadeMap(this);
    // sets flag if the map impl has been completed
    impl.on(M.evt.COMPLETED, function () {
      this_._finishedMapImpl = true;
      this_._checkCompleted();
    });

    goog.base(this, impl);

    // creates main panels
    this.createMainPanels_();

    // projection
    if (!M.utils.isNullOrEmpty(params.projection)) {
      this.setProjection(params.projection);
    }
    else { // default projection
      this.setProjection(M.config.DEFAULT_PROJ, true);
    }

    // bbox
    if (!M.utils.isNullOrEmpty(params.bbox)) {
      this.setBbox(params.bbox);
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
      if (params.getfeatureinfo !== "plain" && params.getfeatureinfo !== "html" && params.getfeatureinfo !== "gml") {
        M.dialog.error("El formato solicitado para la información no está disponible. Inténtelo utilizando gml, plain o html.");
      }
      else {
        var getFeatureInfo = new M.control.GetFeatureInfo(params.getfeatureinfo);
        this.addControls(getFeatureInfo);
      }
    }

    // default WMC
    if (M.utils.isNullOrEmpty(params.wmc) && M.utils.isNullOrEmpty(params.layers)) {
      this.addWMC(M.config.predefinedWMC.predefinedNames[0]);
    }

    // maxExtent
    if (!M.utils.isNullOrEmpty(params.maxExtent)) {
      let zoomToMaxExtent = M.utils.isNullOrEmpty(params.zoom) && M.utils.isNullOrEmpty(params.bbox);
      this.setMaxExtent(params.maxExtent, zoomToMaxExtent);
    }

    // center
    if (!M.utils.isNullOrEmpty(params.center)) {
      this.setCenter(params.center);
    }
    else {
      this._finishedInitCenter = false;
      this.getInitCenter_().then(function (initCenter) {
        // checks if the user stablished a center while it was
        // calculated
        let newCenter = this_.getCenter();
        if (M.utils.isNullOrEmpty(newCenter)) {
          newCenter = initCenter;
          this_.setCenter(newCenter);
        }

        this_._finishedInitCenter = true;
        this_._checkCompleted();
      });
    }

    // zoom
    if (!M.utils.isNullOrEmpty(params.zoom)) {
      this.setZoom(params.zoom);
    }

    // label
    if (!M.utils.isNullOrEmpty(params.label)) {
      this.addLabel(params.label);
    }

    // initial zoom
    if (M.utils.isNullOrEmpty(params.bbox) && M.utils.isNullOrEmpty(params.zoom) && M.utils.isNullOrEmpty(params.center)) {
      this.zoomToMaxExtent(true);
    }

    //ticket
    if (!M.utils.isNullOrEmpty(params.ticket)) {
      this.setTicket(params.ticket);
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
    layers = this.getImpl().getLayers(filters).sort(M.Map.LAYER_SORT);

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

    return this.getImpl().getBaseLayers().sort(M.Map.LAYER_SORT);
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
        try {
          var parameter = M.parameter.layer(layerParam);
          if (!M.utils.isNullOrEmpty(parameter.type)) {
            layer = new M.layer[parameter.type](layerParam);
          }
          else {
            M.dialog.error('No se ha especificado un tipo válido para la capa');
          }
        }
        catch (err) {
          M.dialog.error('El formato de la capa (' + layerParam + ') no se reconoce');
        }
      }
      return layer;
    });

    // adds the layers
    this.getImpl().addLayers(layers);
    this.fire(M.evt.ADDED_LAYER, [layers]);
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
    layers = this.getImpl().getWMC(filters).sort(M.Map.LAYER_SORT);

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
        try {
          wmcLayers.push(new M.layer.WMC(layerParam, layerParam.options));
        }
        catch (err) {
          M.dialog.error(err);
        }
      }
    });

    // adds the layers
    this.getImpl().addWMC(wmcLayers);
    this.fire(M.evt.ADDED_LAYER, [wmcLayers]);
    this.fire(M.evt.ADDED_WMC, [wmcLayers]);

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
    layers = this.getImpl().getKML(filters).sort(M.Map.LAYER_SORT);

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
    this.fire(M.evt.ADDED_LAYER, [kmlLayers]);
    this.fire(M.evt.ADDED_KML, [kmlLayers]);

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
    layers = this.getImpl().getWMS(filters).sort(M.Map.LAYER_SORT);

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
    this.fire(M.evt.ADDED_LAYER, [wmsLayers]);
    this.fire(M.evt.ADDED_WMS, [wmsLayers]);
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
    layers = this.getImpl().getWFS(filters).sort(M.Map.LAYER_SORT);

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
        try {
          wfsLayers.push(new M.layer.WFS(layerParam, layerParam.options));
        }
        catch (err) {
          M.dialog.error(err);
        }
      }
    });

    // adds the layers
    this.getImpl().addWFS(wfsLayers);
    this.fire(M.evt.ADDED_LAYER, [wfsLayers]);
    this.fire(M.evt.ADDED_WFS, [wfsLayers]);

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
    layers = this.getImpl().getWMTS(filters).sort(M.Map.LAYER_SORT);

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
    this.fire(M.evt.ADDED_LAYER, [wmtsLayers]);
    this.fire(M.evt.ADDED_WMTS, [wmtsLayers]);

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
    layers = this.getImpl().getMBtiles(filters).sort(M.Map.LAYER_SORT);

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

  /*/**
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
    var controls = [];
    for (var i = 0, ilen = controlsParam.length; i < ilen; i++) {
      var controlParam = controlsParam[i];
      var control;
      var panel;
      if (M.utils.isString(controlParam)) {
        controlParam = M.utils.normalize(controlParam);
        switch (controlParam) {
          case M.control.Scale.NAME:
            control = new M.control.Scale();
            panel = this.getPanels('map-info')[0];
            if (M.utils.isNullOrEmpty(panel)) {
              panel = new M.ui.Panel('map-info', {
                "collapsible": false,
                "className": "m-map-info",
                "position": M.ui.position.BR
              });
              panel.on(M.evt.ADDED_TO_MAP, function (html) {
                if (this.getControls(["wmcselector", "scale", "scaleline"]).length === 3) {
                  goog.dom.classlist.add(this.getControls(["scaleline"])[0].getImpl().getElement(),
                    "ol-scale-line-up");
                }
              }, this);
            }
            panel.addClassName('m-with-scale');
            break;
          case M.control.ScaleLine.NAME:
            control = new M.control.ScaleLine();
            panel = new M.ui.Panel(M.control.ScaleLine.NAME, {
              "collapsible": false,
              "className": "m-scaleline",
              "position": M.ui.position.BL,
              "tooltip": "Línea de escala"
            });
            panel.on(M.evt.ADDED_TO_MAP, function (html) {
              if (this.getControls(["wmcselector", "scale", "scaleline"]).length === 3) {
                goog.dom.classlist.add(this.getControls(["scaleline"])[0].getImpl().getElement(),
                  "ol-scale-line-up");
              }
            }, this);
            break;
          case M.control.Panzoombar.NAME:
            control = new M.control.Panzoombar();
            panel = new M.ui.Panel(M.control.Panzoombar.NAME, {
              "collapsible": false,
              "className": "m-panzoombar",
              "position": M.ui.position.TL,
              "tooltip": "Nivel de zoom"
            });
            break;
          case M.control.Panzoom.NAME:
            control = new M.control.Panzoom();
            panel = new M.ui.Panel(M.control.Panzoom.NAME, {
              "collapsible": false,
              "className": "m-panzoom",
              "position": M.ui.position.TL
            });
            break;
          case M.control.LayerSwitcher.NAME:
            control = new M.control.LayerSwitcher();
            /* closure a function in order to keep
             * the control value in the scope*/
            (function (layerswitcherCtrl) {
              panel = new M.ui.Panel(M.control.LayerSwitcher.NAME, {
                "collapsible": true,
                "className": "m-layerswitcher",
                "collapsedButtonClass": "g-cartografia-capas2",
                "position": M.ui.position.TR,
                "tooltip": "Selector de capas"
              });
              // enables touch scroll
              panel.on(M.evt.ADDED_TO_MAP, function (html) {
                M.utils.enableTouchScroll(html.querySelector('.m-panel-controls'));
              }, this);
              // renders and registers events
              panel.on(M.evt.SHOW, function (evt) {
                layerswitcherCtrl.registerEvents();
                layerswitcherCtrl.render();
              }, this);
              // unregisters events
              panel.on(M.evt.HIDE, function (evt) {
                layerswitcherCtrl.unregisterEvents();
              }, this);
            })(control);
            break;
          case M.control.Mouse.NAME:
            control = new M.control.Mouse();
            panel = this.getPanels('map-info')[0];
            if (M.utils.isNullOrEmpty(panel)) {
              panel = new M.ui.Panel('map-info', {
                "collapsible": false,
                "className": "m-map-info",
                "position": M.ui.position.BR,
                "tooltip": "Coordenadas del puntero"
              });
            }
            panel.addClassName('m-with-mouse');
            break;
          case M.control.Navtoolbar.NAME:
            control = new M.control.Navtoolbar();
            break;
          case M.control.OverviewMap.NAME:
            control = new M.control.OverviewMap({
              'toggleDelay': 400
            });
            panel = this.getPanels('map-info')[0];
            if (M.utils.isNullOrEmpty(panel)) {
              panel = new M.ui.Panel('map-info', {
                "collapsible": false,
                "className": "m-map-info",
                "position": M.ui.position.BR
              });
            }
            panel.addClassName('m-with-overviewmap');
            break;
          case M.control.Location.NAME:
            control = new M.control.Location();
            panel = new M.ui.Panel(M.control.Location.NAME, {
              "collapsible": false,
              "className": 'm-location',
              "position": M.ui.position.BR
            });
            break;
          case M.control.GetFeatureInfo.NAME:
            control = new M.control.GetFeatureInfo();
            break;
          default:
            let getControlsAvailable = M.utils.concatUrlPaths([M.config.MAPEA_URL, '/api/actions/controls']);
            M.dialog.error('El control "'.concat(controlParam).concat('" no está definido. Consulte los controles disponibles <a href="' + getControlsAvailable + '" target="_blank">aquí</a>'));
            break;
        }
      }
      else if (controlParam instanceof M.Control) {
        control = controlParam;
        if (control instanceof M.control.WMCSelector) {
          panel = this.getPanels('map-info')[0];
          if (M.utils.isNullOrEmpty(panel)) {
            panel = new M.ui.Panel('map-info', {
              "collapsible": false,
              "className": "m-map-info",
              "position": M.ui.position.BR
            });
            panel.on(M.evt.ADDED_TO_MAP, function (html) {
              if (this.getControls(["wmcselector", "scale", "scaleline"]).length === 3) {
                goog.dom.classlist.add(this.getControls(["scaleline"])[0].getImpl().getElement(),
                  "ol-scale-line-up");
              }
            }, this);
          }
          panel.addClassName('m-with-wmcselector');
        }
      }
      else {
        M.exception('El control "'.concat(controlParam).concat('" no es un control válido.'));
      }

      // checks if it has to be added into a main panel
      if (M.config.panels.TOOLS.indexOf(control.name) !== -1) {
        if (M.utils.isNullOrEmpty(this.panel.TOOLS)) {
          this.panel.TOOLS = new M.ui.Panel('tools', {
            "collapsible": true,
            "className": 'm-tools',
            "collapsedButtonClass": 'g-cartografia-herramienta',
            "position": M.ui.position.TL,
            "tooltip": "Panel de herramientas"
          });
          //               this.addPanels([this.panel.TOOLS]);
        }
        //            if (!this.panel.TOOLS.hasControl(control)) {
        //               this.panel.TOOLS.addControls(control);
        //            }
        panel = this.panel.TOOLS;
      }
      else if (M.config.panels.EDITION.indexOf(control.name) !== -1) {
        if (M.utils.isNullOrEmpty(this.panel.EDITION)) {
          this.panel.EDITION = new M.ui.Panel('edit', {
            "collapsible": true,
            "className": 'm-edition',
            "collapsedButtonClass": 'g-cartografia-editar',
            "position": M.ui.position.TL,
            "tooltip": "Herramientas de edición"
          });
          //               this.addPanels([this.panel.EDITION]);
        }
        //            if (!this.panel.EDITION.hasControl(control)) {
        //               this.panel.EDITION.addControls(control);
        //            }
        panel = this.panel.EDITION;
      }

      if (!M.utils.isNullOrEmpty(panel) && !panel.hasControl(control)) {
        panel.addControls(control);
        this.addPanels(panel);
      }
      else {
        control.addTo(this);
        controls.push(control);
      }
    }

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
      // removes controls from their panels
      controls.forEach(function (control) {
        if (!M.utils.isNullOrEmpty(control.getPanel())) {
          control.getPanel().removeControls(control);
        }
      }, this);
      // removes the controls
      this.getImpl().removeControls(controls);
    }

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
   * @param {Boolean} zoomToExtent - Set bbox
   * @returns {M.Map}
   * @api stable
   */
  M.Map.prototype.setMaxExtent = function (maxExtentParam, zoomToExtent) {
    // checks if the param is null or empty
    if (M.utils.isNullOrEmpty(maxExtentParam)) {
      M.exception('No ha especificado ningún maxExtent');
    }

    // checks if the implementation can set the maxExtent
    if (M.utils.isUndefined(M.impl.Map.prototype.setMaxExtent)) {
      M.exception('La implementación usada no posee el método setMaxExtent');
    }

    // parses the parameter
    try {
      var maxExtent = M.parameter.maxExtent(maxExtentParam);
      this.getImpl().setMaxExtent(maxExtent, zoomToExtent);
    }
    catch (err) {
      M.dialog.error(err);
    }
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

    try {
      // parses the parameter
      var bbox = M.parameter.maxExtent(bboxParam);
      this.getImpl().setBbox(bbox);
    }
    catch (err) {
      M.dialog.error('El formato del parámetro bbox no es el correcto');
    }
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

    try {
      // parses the parameter
      var zoom = M.parameter.zoom(zoomParam);
      this._userZoom = zoom;
      this.getImpl().setZoom(zoom);
    }
    catch (err) {
      M.dialog.error(err);
    }

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
    try {
      let center = M.parameter.center(centerParam);
      this.getImpl().setCenter(center);
      if (center.draw === true) {
        let features = this.getImpl().getDrawLayer().getOL3Layer().getSource().getFeatures();
        if (!M.utils.isNullOrEmpty(features)) {
          this._removeFeatureCenter();
        }
        this._featureCenter = features[features.length - 1];
      }
      else if (!M.utils.isNullOrEmpty(this._featureCenter)) {
        this._removeFeatureCenter();
      }
    }
    catch (err) {
      M.dialog.error(err);
    }

    return this;
  };

  /**
   * This function remove feature center for this
   * map instance
   *
   * @private
   * @function
   */
  M.Map.prototype.getFeatureCenter = function () {
    return this._featureCenter;
  };

  /**
   * This function remove feature center for this
   * map instance
   *
   * @private
   * @function
   */
  M.Map.prototype._removeFeatureCenter = function () {
    this.getImpl().removeFeatures(this._featureCenter);
  };

  /**
   * This function remove center for this
   * map instance
   *
   * @public
   * @function
   * @api stable
   */
  M.Map.prototype.removeCenter = function () {
    this._removeFeatureCenter();
    this.zoomToMaxExtent();
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
   * This function provides the current scale of this
   * map instance
   *
   * @public
   * @function
   * @returns {Mx.Projection}
   * @api stable
   */
  M.Map.prototype.getScale = function () {
    // checks if the implementation has the method
    if (M.utils.isUndefined(M.impl.Map.prototype.getScale)) {
      M.exception('La implementación usada no posee el método getScale');
    }

    var scale = this.getImpl().getScale();

    return scale;
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
  M.Map.prototype.setProjection = function (projection, asDefault) {
    // checks if the param is null or empty
    if (M.utils.isNullOrEmpty(projection)) {
      M.exception('No ha especificado ninguna proyección');
    }

    // checks if the implementation can set the projection
    if (M.utils.isUndefined(M.impl.Map.prototype.setProjection)) {
      M.exception('La implementación usada no posee el método setProjection');
    }

    // parses the parameter
    try {
      projection = M.parameter.projection(projection);
      this.getImpl().setProjection(projection);
      this._defaultProj = (this._defaultProj && (asDefault === true));
    }
    catch (err) {
      M.dialog.error(err);
      if (String(err).indexOf("El formato del parámetro projection no es correcto") >= 0) {
        this.setProjection(M.config.DEFAULT_PROJ, true);
      }
    }

    return this;
  };

  /**
   * TODO
   *
   * @public
   * @function
   * @param {Mx.Plugin} plugin the plugin to add to the map
   * @returns {M.Map}
   * @api stable
   */
  M.Map.prototype.getPlugins = function (names) {
    // parses parameters to Array
    if (M.utils.isNull(names)) {
      names = [];
    }
    else if (!M.utils.isArray(names)) {
      names = [names];
    }

    var plugins = [];

    // parse to Array
    if (names.length === 0) {
      plugins = this._plugins;
    }
    else {
      names.forEach(function (name) {
        plugins = plugins.concat(this._plugins.filter(function (plugin) {
          return (name === plugin.name);
        }));
      }, this);
    }
    return plugins;
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

    this._plugins.push(plugin);
    plugin.addTo(this);

    return this;
  };

  /**
   * This function removes the specified plugins from the map
   *
   * @function
   * @param {Array<M.Plugin>} plugins specified by the user
   * @returns {M.Map}
   * @api stable
   */
  M.Map.prototype.removePlugins = function (plugins) {
    // checks if the parameter is null or empty
    if (M.utils.isNullOrEmpty(plugins)) {
      M.exception('No ha especificado ningún plugin a eliminar');
    }
    if (!M.utils.isArray(plugins)) {
      plugins = [plugins];
    }

    if (plugins.length > 0) {
      // removes controls from their panels
      plugins.forEach(function (plugin) {
        plugin.destroy();
        this._plugins.remove(plugin);
      }, this);
    }

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

    return this.getImpl().getEnvolvedExtent();
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
  M.Map.prototype.zoomToMaxExtent = function (keepUserZoom) {
    // zoom to maxExtent if no zoom was specified
    var maxExtent = this.getMaxExtent();
    if (!M.utils.isNullOrEmpty(maxExtent)) {
      this.setBbox(maxExtent);
    }
    else {
      /* if no maxExtent was provided then
       calculates the envolved extent */
      var this_ = this;
      this._finishedMaxExtent = false;
      this.getEnvolvedExtent().then(function (extent) {
        if ((keepUserZoom !== true) || (M.utils.isNullOrEmpty(this_._userZoom))) {
          this_.setBbox(extent);
        }
        this_._finishedMaxExtent = true;
        this_._checkCompleted();
      });
    }

    return this;
  };

  /**
   * This function adds a ticket to control secure layers
   *
   * @public
   * @function
   * @param {String} ticket ticket user
   * @api stable
   */
  M.Map.prototype.setTicket = function (ticket) {
    if (!M.utils.isNullOrEmpty(ticket)) {
      if (M.config.PROXY_POST_URL.indexOf("ticket=") == -1) {
        M.config('PROXY_POST_URL', M.utils.addParameters(M.config.PROXY_POST_URL, {
          'ticket': ticket
        }));
      }
      if (M.config.PROXY_URL.indexOf("ticket=") == -1) {
        M.config('PROXY_URL', M.utils.addParameters(M.config.PROXY_URL, {
          'ticket': ticket
        }));
      }
    }
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
    return new Promise(function (success, fail) {
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
              'x': ((extent[0] + extent[2]) / 2),
              'y': ((extent[1] + extent[3]) / 2)
            };
            success(center);
          });
        }
      }

    });
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
  M.Map.prototype.addLabel = function (labelParam, coordParam) {
    // checks if the param is null or empty
    if (M.utils.isNullOrEmpty(labelParam)) {
      M.exception('No ha especificado ninguna proyección');
    }

    // checks if the implementation can add labels
    if (M.utils.isUndefined(M.impl.Map.prototype.addLabel)) {
      M.exception('La implementación usada no posee el método addLabel');
    }

    var text = null;
    var coord = null;

    // object
    if (M.utils.isObject(labelParam)) {
      text = M.utils.escapeJSCode(labelParam.text);
      coord = labelParam.coord;
    }
    // string
    else {
      text = M.utils.escapeJSCode(labelParam);
      coord = coordParam;
    }

    if (M.utils.isNullOrEmpty(coord)) {
      coord = this.getCenter();
    }
    else {
      coord = M.parameter.center(coord);
    }

    if (M.utils.isNullOrEmpty(coord)) {
      let this_ = this;
      this.getInitCenter_().then(function (initCenter) {
        // checks if the user stablished a center while it was
        // calculated
        let newCenter = this_.getCenter();
        if (M.utils.isNullOrEmpty(newCenter)) {
          newCenter = initCenter;
        }
        var label = new M.Label(text, newCenter);
        this_.getImpl().addLabel(label);
      });
    }
    else {
      var label = new M.Label(text, coord);
      this.getImpl().addLabel(label);
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
   * TODO
   *
   * @function
   * @api stable
   * @returns {M.Map}
   */
  M.Map.prototype.addPanels = function (panels) {
    if (!M.utils.isNullOrEmpty(panels)) {
      if (!M.utils.isArray(panels)) {
        panels = [panels];
      }
      panels.forEach(function (panel) {
        var isIncluded = false;
        for (var i = 0, ilen = this._panels.length; i < ilen; i++) {
          if (this._panels[i].equals(panel)) {
            isIncluded = true;
            break;
          }
        }
        if ((panel instanceof M.ui.Panel) && !isIncluded) {
          this._panels.push(panel);
          var queryArea = 'div.m-area'.concat(panel.position);
          var areaContainer = this._areasContainer.querySelector(queryArea);
          panel.addTo(this, areaContainer);
        }
      }, this);
    }
    return this;
  };

  /**
   * TODO
   *
   * @function
   * @api stable
   */
  M.Map.prototype.removePanel = function (panel) {
    if (panel.getControls().length > 0) {
      M.exception('Debe eliminar los controles del panel previamente');
    }
    if (panel instanceof M.ui.Panel) {
      panel.destroy();
      this._panels.remove(panel);
    }
  };

  /**
   * TODO
   *
   * @function
   * @api stable
   * @returns {array<M.ui.Panel>}
   */
  M.Map.prototype.getPanels = function (names) {
    var panels = [];

    // parses parameters to Array
    if (M.utils.isNullOrEmpty(names)) {
      panels = this._panels;
    }
    else {
      if (!M.utils.isArray(names)) {
        names = [names];
      }
      for (var i = 0, ilen = names.length; i < ilen; i++) {
        var name = names[i];
        for (var e = 0, elen = this._panels.length; e < elen; e++) {
          if (this._panels[e].name === name) {
            panels.push(this._panels[e]);
            break;
          }
        }
      }
    }

    return panels;
  };

  /**
   * TODO
   *
   * @private
   * @function
   */
  M.Map.prototype.createMainPanels_ = function () {
    // areas container
    this._areasContainer = goog.dom.createElement('div');
    goog.dom.classlist.add(this._areasContainer, 'm-areas');

    // top-left area
    var tlArea = goog.dom.createElement('div');
    goog.dom.classlist.add(tlArea, 'm-area');
    goog.dom.classlist.add(tlArea, 'm-top');
    goog.dom.classlist.add(tlArea, 'm-left');
    // top-right area
    var trArea = goog.dom.createElement('div');
    goog.dom.classlist.add(trArea, 'm-area');
    goog.dom.classlist.add(trArea, 'm-top');
    goog.dom.classlist.add(trArea, 'm-right');

    // bottom-left area
    var blArea = goog.dom.createElement('div');
    goog.dom.classlist.add(blArea, 'm-area');
    goog.dom.classlist.add(blArea, 'm-bottom');
    goog.dom.classlist.add(blArea, 'm-left');
    // bottom-right area
    var brArea = goog.dom.createElement('div');
    goog.dom.classlist.add(brArea, 'm-area');
    goog.dom.classlist.add(brArea, 'm-bottom');
    goog.dom.classlist.add(brArea, 'm-right');

    goog.dom.appendChild(this._areasContainer, tlArea);
    goog.dom.appendChild(this._areasContainer, trArea);
    goog.dom.appendChild(this._areasContainer, blArea);
    goog.dom.appendChild(this._areasContainer, brArea);

    goog.dom.appendChild(this.getContainer(), this._areasContainer);
  };

  /**
   * This function provides the core map used by the
   * implementation
   *
   * @function
   * @api stable
   * @returns {Object} core map used by the implementation
   */
  M.Map.prototype.getContainer = function () {
    // checks if the implementation can provides the container
    if (M.utils.isUndefined(M.impl.Map.prototype.getContainer)) {
      M.exception('La implementación usada no posee el método getContainer');
    }
    return this.getImpl().getContainer();
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

  /**
   * TODO
   *
   * @function
   * @api stable
   * @returns {M.Popup} core map used by the implementation
   */
  M.Map.prototype.getPopup = function () {
    return this.popup_;
  };

  /**
   * TODO
   *
   * @function
   * @api stable
   * @returns {M.Map} core map used by the implementation
   */
  M.Map.prototype.removePopup = function () {
    // checks if the implementation can add popups
    if (M.utils.isUndefined(M.impl.Map.prototype.removePopup)) {
      M.exception('La implementación usada no posee el método removePopup');
    }

    if (!M.utils.isNullOrEmpty(this.popup_)) {
      this.getImpl().removePopup(this.popup_);
      this.popup_.destroy();
      this.popup_ = null;
    }

    return this;
  };

  /**
   * TODO
   *
   * @function
   * @api stable
   * @returns {M.Map} core map used by the implementation
   */
  M.Map.prototype.addPopup = function (popup, coordinate) {
    // checks if the param is null or empty
    if (M.utils.isNullOrEmpty(popup)) {
      M.exception('No ha especificado ningún popup');
    }

    if (!(popup instanceof M.Popup)) {
      M.exception('El popup especificado no es válido');
    }

    if (!M.utils.isNullOrEmpty(this.popup_)) {
      this.removePopup(this.popup_);
    }
    this.popup_ = popup;
    this.popup_.addTo(this, coordinate);

    return this;
  };

  /**
   * TODO
   *
   * @public
   * @function
   */
  M.Map.prototype._checkCompleted = function () {
    if (this._finishedInitCenter && this._finishedMaxExtent && this._finishedMapImpl) {
      this.fire(M.evt.COMPLETED);
      this._finishedMap = true;
    }
  };

  /**
   * Sets the callback when the instace is loaded
   *
   * @public
   * @function
   * @api stable
   */
  M.Map.prototype.on = function (eventType, listener, optThis) {
    goog.base(this, 'on', eventType, listener, optThis);
    if ((eventType === M.evt.COMPLETED) && (this._finishedMap === true)) {
      this.fire(M.evt.COMPLETED);
    }
  };

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  M.Map.LAYER_SORT = function (layer1, layer2) {
    if (!M.utils.isNullOrEmpty(layer1) && !M.utils.isNullOrEmpty(layer2)) {
      let z1 = layer1.getZIndex();
      let z2 = layer2.getZIndex();

      return (z1 - z2);
    }

    // equals
    return 0;
  };
})();
