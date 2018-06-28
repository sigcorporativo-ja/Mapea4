import Base from "../facade";
import Utils from "../utils/utils";
import MapImpl from "../../impl/ol/js/map/map";
import Exception from "../exception/exception";
import Parameters from "../parameters/parameters";
import LayerParameter from "../parameters/layers";
import MaxExtentParameter from "../parameters/maxExtent";
import ZoomParameter from "../parameters/zoom";
import ResolutionsParameter from "../parameters/resolutions";
import ProjectionParameter from "../parameters/projection";
import Evt from "../events/events";
import FeaturesHandler from "../handlers/featureshandler";
import Vector from "../layers/vector";
import Point from "..styles/point";
import Config from "configuration";
import Dialog from "../dialog";
import GetFeatureInfo from "../controls/getfeatureinfo";
import WMCSelector from "../controls/wmcselector";
import LayerSwitcher from "../controls/layerswitcher";
import Location from "../controls/location";
import Navtoolbar from "../controls/navtoolbar";
import Scale from "../controls/scale";
import ScaleLine from "../controls/scaleline";
import Mouse from "../controls/mouse";
import OverviewMap from "../controls/overviewmap";
import Panzoom from "../controls/panzoom";
import Panzoombar from "../controls/panzoombar";
import Layer from "../layers/layerbase";
import LayerType from "../layers/layertype";
import KML from "../layers/kml";
import WFS from "../layers/wfs";
import WMC from "../layers/wmc";
import WMS from "../layers/wms";
import WMTS from "../layers/wmts";

export default class Map extends Base {

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
  constructor(userParameters, options) {

    // calls the super constructor
    let impl = new MapImpl(params.container, (options || {}));
    super(this, impl);
    impl.setFacadeMap(this);
    // sets flag if the map impl has been completed
    impl.on(Evt.COMPLETED, () => {
      this.finishedMapImpl_ = true;
      this.checkCompleted_();
    });

    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(userParameters)) {
      Exception('No ha especificado ningún parámetro');
    }

    // checks if the implementation can create maps
    if (Utils.isUndefined(MapImpl)) {
      Exception('La implementación usada no posee un constructor');
    }

    /**
     * @private
     * @type {array<Panel>}
     * @expose
     */
    this.panels_ = [];

    /**
     * @private
     * @type {array<Plugin>}
     * @expose
     */
    this.plugins_ = [];

    /**
     * @private
     * @type {HTMLElement}
     * @expose
     */
    this.areasContainer_ = null;

    /**
     * The added popup
     * @private
     * @type {Popup}
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
    this.defaultProj_ = true;

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
    this.userZoom_ = null;

    /**
     * TODO
     * @private
     * @type {Boolean}
     */
    this.finishedInitCenter_ = true;

    /**
     * TODO
     * @private
     * @type {Boolean}
     */
    this.finishedMaxExtent_ = true;

    /**
     * TODO
     * @private
     * @type {Boolean}
     */
    this.finishedMapImpl_ = false;

    /**
     * TODO
     * @private
     * @type {Boolean}
     */
    this.finishedMap_ = false;

    /**
     * Feature Center
     * @private
     * @type {Feature}
     */
    this.centerFeature_ = null;

    /**
     * Draw layer
     * @private
     * @type {Vector}
     */
    this.drawLayer_ = null;

    // parses parameters to build the new map
    let params = new Parameters(userParameters);

    // adds class to the container
    params.container.classList.add('m-mapea-container');

    // creates main panels
    this.createMainPanels_();

    /**
     * Features manager
     * @private
     * @type {M.handler.Features}
     */
    this.featuresHandler_ = new FeaturesHandler();
    this.featuresHandler_.addTo(this);
    this.featuresHandler_.activate();

    this.drawLayer_ = new Vector({
      'name': '__draw__'
    }, {
      'displayInLayerSwitcher': false
    });

    this.drawLayer_.setStyle(new Point(Map.DRAWLAYER_STYLE));

    this.drawLayer_.setZIndex(MapImpl.Z_INDEX[LayerType.WFS] + 999);
    this.addLayers(this.drawLayer_);

    // projection
    if (!Utils.isNullOrEmpty(params.projection)) {
      this.setProjection(params.projection);
    }
    else { // default projection
      this.setProjection(Config.DEFAULT_PROJ, true);
    }

    // bbox
    if (!Utils.isNullOrEmpty(params.bbox)) {
      this.setBbox(params.bbox);
    }

    // resolutions
    if (!Utils.isNullOrEmpty(params.resolutions)) {
      this.setResolutions(params.resolutions);
    }

    // layers
    if (!Utils.isNullOrEmpty(params.layers)) {
      this.addLayers(params.layers);
    }

    // wmc
    if (!Utils.isNullOrEmpty(params.wmc)) {
      this.addWMC(params.wmc);
    }

    // wms
    if (!Utils.isNullOrEmpty(params.wms)) {
      this.addWMS(params.wms);
    }

    // wmts
    if (!Utils.isNullOrEmpty(params.wmts)) {
      this.addWMTS(params.wmts);
    }

    // kml
    if (!Utils.isNullOrEmpty(params.kml)) {
      this.addKML(params.kml);
    }

    // controls
    if (!Utils.isNullOrEmpty(params.controls)) {
      this.addControls(params.controls);
    }
    else { // default controls
      this.addControls('panzoom');
    }

    // getfeatureinfo
    if (!Utils.isNullOrEmpty(params.getfeatureinfo)) {
      if (params.getfeatureinfo !== "plain" && params.getfeatureinfo !== "html" && params.getfeatureinfo !== "gml") {
        Dialog.error("El formato solicitado para la información no está disponible. Inténtelo utilizando gml, plain o html.");
      }
      else {
        let getFeatureInfo = new GetFeatureInfo(params.getfeatureinfo);
        this.addControls(getFeatureInfo);
      }
    }

    // default WMC
    if (Utils.isNullOrEmpty(params.wmc) && Utils.isNullOrEmpty(params.layers)) {
      this.addWMC(Config.predefinedWMC.predefinedNames[0]);
    }

    // maxExtent
    if (!Utils.isNullOrEmpty(params.maxExtent)) {
      let zoomToMaxExtent = Utils.isNullOrEmpty(params.zoom) && Utils.isNullOrEmpty(params.bbox);
      this.setMaxExtent(params.maxExtent, zoomToMaxExtent);
    }

    // center
    if (!Utils.isNullOrEmpty(params.center)) {
      this.setCenter(params.center);
    }
    else {
      this.finishedInitCenter_ = false;
      this.getInitCenter_().then((initCenter) => {
        // checks if the user stablished a center while it was
        // calculated
        let newCenter = this.getCenter();
        if (Utils.isNullOrEmpty(newCenter)) {
          newCenter = initCenter;
          this.setCenter(newCenter);
        }

        this.finishedInitCenter_ = true;
        this.checkCompleted_();
      });
    }

    // zoom
    if (!Utils.isNullOrEmpty(params.zoom)) {
      this.setZoom(params.zoom);
    }

    // label
    if (!Utils.isNullOrEmpty(params.label)) {
      this.addLabel(params.label);
    }

    // initial zoom
    if (Utils.isNullOrEmpty(params.bbox) && Utils.isNullOrEmpty(params.zoom) && Utils.isNullOrEmpty(params.center)) {
      this.zoomToMaxExtent(true);
    }

    //ticket
    if (!Utils.isNullOrEmpty(params.ticket)) {
      this.setTicket(params.ticket);
    }
  }

  /**
   * This function gets the layers added to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam
   * @returns {Array<Layer>}
   * @api stable
   */
  getLayers(layersParam) {
    // checks if the implementation can manage layers
    if (Utils.isUndefined(MapImpl.prototype.getLayers)) {
      Exception('La implementación usada no posee el método getLayers');
    }

    let layers;

    // parses parameters to Array
    if (Utils.isNull(layersParam)) {
      layersParam = [];
    }
    else if (!Utils.isArray(layersParam)) {
      layersParam = [layersParam];
    }

    // gets the parameters as Layer objects to filter
    let filters = [];
    if (layersParam.length > 0) {
      filters = layersParam.map(LayerParameter);
    }

    // gets the layers
    layers = this.getImpl().getLayers(filters).sort(Map.LAYER_SORT);

    return layers;
  };

  /**
   * This function gets the base layers added to the map
   *
   * @function
   * @returns {Array<Layer>}
   * @api stable
   */
  getBaseLayers() {
    // checks if the implementation can manage layers
    if (Utils.isUndefined(MapImpl.prototype.getBaseLayers)) {
      Exception('La implementación usada no posee el método getBaseLayers');
    }

    return this.getImpl().getBaseLayers().sort(Map.LAYER_SORT);
  };

  /**
   * This function adds layers specified by the user
   *
   * @function
   * @returns {M.handler.Feature}
   * @public
   * @api stable
   */
  getFeatureHandler() {
    return this.featuresHandler_;
  };

  /**
   * This function adds layers specified by the user
   *
   * @function
   * @param {string|Object|Array<String>|Array<Object>} layersParam
   * @returns {Map}
   * @api stable
   */
  addLayers(layersParam) {
    if (!Utils.isNullOrEmpty(layersParam)) {
      // checks if the implementation can manage layers
      if (Utils.isUndefined(MapImpl.prototype.addLayers)) {
        Exception('La implementación usada no posee el método addLayers');
      }

      // parses parameters to Array
      if (!Utils.isArray(layersParam)) {
        layersParam = [layersParam];
      }

      // gets the parameters as Layer objects to add
      let layers = layersParam.map(layerParam => {
        let layer;

        if (layerParam instanceof Layer) {
          layer = layerParam;
        }
        else {
          try {
            let parameter = LayerParameter(layerParam);
            if (!Utils.isNullOrEmpty(parameter.type)) {
              layer = new M.layer[parameter.type](layerParam);
            }
            else {
              Dialog.error('No se ha especificado un tipo válido para la capa');
            }
          }
          catch (err) {
            Dialog.error('El formato de la capa (' + layerParam + ') no se reconoce');
          }
        }

        // KML and WFS layers handler its features
        if ((layer instanceof Vector) && !(layer instanceof KML) && !(layer instanceof WFS)) {
          this.featuresHandler_.addLayer(layer);
        }

        return layer;
      });

      // adds the layers

      this.getImpl().addLayers(layers);
      this.fire(Evt.ADDED_LAYER, [layers]);


    }
    return this;
  };

  /**

   * This function removes the specified layers to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam
   * specified by the user
   * @returns {Map}
   * @api stable
   */
  removeLayers(layersParam) {
    if (!Utils.isNullOrEmpty(layersParam)) {
      // checks if the implementation can manage layers
      if (Utils.isUndefined(MapImpl.prototype.removeLayers)) {
        Exception('La implementación usada no posee el método removeLayers');
      }

      // gets the layers to remove
      let layers = this.getLayers(layersParam);
      layers.forEach(layer => {
        // KML and WFS layers handler its features
        if (layer instanceof Vector) {
          this.featuresHandler_.removeLayer(layer);
        }
      });

      // removes the layers
      this.getImpl().removeLayers(layers);
    }

    return this;
  };

  /**
   * This function gets the WMC layers added to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam
   * @returns {Array<WMC>}
   * @api stable
   */
  getWMC(layersParam) {
    // checks if the implementation can manage layers
    if (Utils.isUndefined(MapImpl.prototype.getWMC)) {
      Exception('La implementación usada no posee el método getWMC');
    }

    let layers;

    // parses parameters to Array
    if (Utils.isNull(layersParam)) {
      layersParam = [];
    }
    else if (!Utils.isArray(layersParam)) {
      layersParam = [layersParam];
    }

    // gets the parameters as Layer objects to filter
    let filters = [];
    if (layersParam.length > 0) {
      filters = layersParam.map((layerParam) => {
        return LayerParameter(layerParam, LayerType.WMC);
      });
    }

    // gets the layers
    layers = this.getImpl().getWMC(filters).sort(Map.LAYER_SORT);

    return layers;
  };

  /**
   * This function adds the WMC layers to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam
   * @returns {Map}
   * @api stable
   */
  addWMC(layersParam) {
    if (!Utils.isNullOrEmpty(layersParam)) {
      // checks if the implementation can manage layers
      if (Utils.isUndefined(MapImpl.prototype.addWMC)) {
        Exception('La implementación usada no posee el método addWMC');
      }

      // parses parameters to Array
      if (!Utils.isArray(layersParam)) {
        layersParam = [layersParam];
      }

      // gets the parameters as WMC objects to add
      let wmcLayers = [];
      layersParam.forEach(function(layerParam) {
        if (Utils.isObject(layerParam) && (layerParam instanceof WMC)) {
          wmcLayers.push(layerParam);
        }
        else if (!(layerParam instanceof Layer)) {
          try {
            wmcLayers.push(new WMC(layerParam, layerParam.options));
          }
          catch (err) {
            Dialog.error(err);
          }
        }
      });

      // adds the layers
      this.getImpl().addWMC(wmcLayers);
      this.fire(Evt.ADDED_LAYER, [wmcLayers]);
      this.fire(Evt.ADDED_WMC, [wmcLayers]);

      /* checks if it should create the WMC control
         to select WMC */
      let addedWmcLayers = this.getWMC();
      let wmcSelected = addedWmcLayers.filter(wmc => wmc.selected === true)[0];
      if (wmcSelected == null) {
        addedWmcLayers[0].select();
      }
      if (addedWmcLayers.length > 1) {
        this.removeControls("wmcselector");
        this.addControls(new WMCSelector());
      }
    }
    return this;
  };

  /**
   * TODO
   * @function
   * @public
   */
  refreshWMCSelectorControl() {
    this.removeControls("wmcselector");
    if (this.getWMC().length === 1) {
      this.getWMC()[0].select();
    }
    else if (this.getWMC().length > 1) {
      this.addControls(new WMCSelector());
      let wmcSelected = this.getWMC().filter(wmc => wmc.selected === true)[0];
      if (wmcSelected == null) {
        this.getWMC()[0].select();
      }
    }
  };

  /**
   * This function removes the WMC layers to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam
   * @returns {Map}
   * @api stable
   */
  removeWMC(layersParam) {
    if (!Utils.isNullOrEmpty(layersParam)) {
      // checks if the implementation can manage layers
      if (Utils.isUndefined(MapImpl.prototype.removeWMC)) {
        Exception('La implementación usada no posee el método removeWMC');
      }

      // gets the layers
      let wmcLayers = this.getWMC(layersParam);
      if (wmcLayers.length > 0) {
        // removes the layers
        this.getImpl().removeWMC(wmcLayers);
      }
    }
    return this;
  };

  /**
   * This function gets the KML layers added to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam
   * @returns {Array<KML>}
   * @api stable
   */
  getKML(layersParam) {
    // checks if the implementation can manage layers
    if (Utils.isUndefined(MapImpl.prototype.getKML)) {
      Exception('La implementación usada no posee el método getKML');
    }

    let layers;

    // parses parameters to Array
    if (Utils.isNull(layersParam)) {
      layersParam = [];
    }
    else if (!Utils.isArray(layersParam)) {
      layersParam = [layersParam];
    }

    // gets the parameters as Layer objects to filter
    let filters = [];
    if (layersParam.length > 0) {
      filters = layersParam.map(layerParam => {
        return LayerParameter(layerParam, LayerType.KML);
      });
    }

    // gets the layers
    layers = this.getImpl().getKML(filters).sort(Map.LAYER_SORT);

    return layers;
  };

  /**
   * This function adds the KML layers to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.KML>} layersParam
   * @returns {Map}
   * @api stable
   */
  addKML(layersParam) {
    if (!Utils.isNullOrEmpty(layersParam)) {
      // checks if the implementation can manage layers
      if (Utils.isUndefined(MapImpl.prototype.addKML)) {
        Exception('La implementación usada no posee el método addKML');
      }

      // parses parameters to Array
      if (!Utils.isArray(layersParam)) {
        layersParam = [layersParam];
      }

      // gets the parameters as KML objects to add
      let kmlLayers = [];
      layersParam.forEach(layerParam => {
        let kmlLayer;
        if (Utils.isObject(layerParam) && (layerParam instanceof KML)) {
          kmlLayer = layerParam;
        }
        else if (!(layerParam instanceof Layer)) {
          kmlLayer = new KML(layerParam, layerParam.options);
        }
        if (kmlLayer.extract === true) {
          this.featuresHandler_.addLayer(kmlLayer);
        }
        kmlLayers.push(kmlLayer);
      });

      // adds the layers
      this.getImpl().addKML(kmlLayers);
      this.fire(Evt.ADDED_LAYER, [kmlLayers]);
      this.fire(Evt.ADDED_KML, [kmlLayers]);
    }
    return this;
  };

  /**
   * This function removes the KML layers to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.KML>} layersParam
   * @returns {Map}
   * @api stable
   */
  removeKML(layersParam) {
    if (!Utils.isNullOrEmpty(layersParam)) {
      // checks if the implementation can manage layers
      if (Utils.isUndefined(MapImpl.prototype.removeKML)) {
        Exception('La implementación usada no posee el método removeKML');
      }

      // gets the layers
      let kmlLayers = this.getKML(layersParam);
      if (kmlLayers.length > 0) {
        kmlLayers.forEach(layer => {
          this.featuresHandler_.removeLayer(layer);
        });
        // removes the layers
        this.getImpl().removeKML(kmlLayers);
      }
    }
    return this;
  };

  /**
   * This function gets the WMS layers added to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.WMC>} layersParam
   * @returns {Array<WMS>} layers from the map
   * @api stable
   */
  getWMS(layersParam) {
    // checks if the implementation can manage layers
    if (Utils.isUndefined(MapImpl.prototype.getWMS)) {
      Exception('La implementación usada no posee el método getWMS');
    }

    let layers;

    // parses parameters to Array
    if (Utils.isNull(layersParam)) {
      layersParam = [];
    }
    else if (!Utils.isArray(layersParam)) {
      layersParam = [layersParam];
    }

    // gets the parameters as Layer objects to filter
    let filters = [];
    if (layersParam.length > 0) {
      filters = layersParam.map(layerParam => {
        return LayerParameter(layerParam, LayerType.WMS);
      });
    }

    // gets the layers
    layers = this.getImpl().getWMS(filters).sort(Map.LAYER_SORT);

    return layers;
  };

  /**
   * This function adds the WMS layers to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.WMS>} layersParam
   * @returns {Map}
   * @api stable
   */
  addWMS(layersParam) {
    if (!Utils.isNullOrEmpty(layersParam)) {
      // checks if the implementation can manage layers
      if (Utils.isUndefined(MapImpl.prototype.addWMS)) {
        Exception('La implementación usada no posee el método addWMS');
      }

      // parses parameters to Array
      if (!Utils.isArray(layersParam)) {
        layersParam = [layersParam];
      }

      // gets the parameters as WMS objects to add
      let wmsLayers = [];
      layersParam.forEach(layerParam => {
        if (Utils.isObject(layerParam) && (layerParam instanceof WMS)) {
          wmsLayers.push(layerParam);
        }
        else if (!(layerParam instanceof Layer)) {
          wmsLayers.push(new WMS(layerParam, layerParam.options));
        }
      });

      // adds the layers
      this.getImpl().addWMS(wmsLayers);
      this.fire(Evt.ADDED_LAYER, [wmsLayers]);
      this.fire(Evt.ADDED_WMS, [wmsLayers]);
    }
    return this;
  };

  /**
   * This function removes the WMS layers to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.WMS>} layersParam
   * @returns {Map}
   * @api stable
   */
  removeWMS(layersParam) {
    if (!Utils.isNullOrEmpty(layersParam)) {
      // checks if the implementation can manage layers
      if (Utils.isUndefined(MapImpl.prototype.removeWMS)) {
        Exception('La implementación usada no posee el método removeWMS');
      }

      // gets the layers
      let wmsLayers = this.getWMS(layersParam);
      if (wmsLayers.length > 0) {
        // removes the layers
        this.getImpl().removeWMS(wmsLayers);
      }
    }
    return this;
  };

  /**
   * This function gets the WFS layers added to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam
   * @returns {Array<WFS>} layers from the map
   * @api stable
   */
  getWFS(layersParam) {
    // checks if the implementation can manage layers
    if (Utils.isUndefined(MapImpl.prototype.getWFS)) {
      Exception('La implementación usada no posee el método getWFS');
    }

    let layers;

    // parses parameters to Array
    if (Utils.isNull(layersParam)) {
      layersParam = [];
    }
    else if (!Utils.isArray(layersParam)) {
      layersParam = [layersParam];
    }

    // gets the parameters as Layer objects to filter
    let filters = [];
    if (layersParam.length > 0) {
      filters = layersParam.map(layerParam => {
        return LayerParameter(layerParam, LayerType.WFS);
      });
    }

    // gets the layers
    layers = this.getImpl().getWFS(filters).sort(Map.LAYER_SORT);

    return layers;
  };

  /**
   * This function adds the WFS layers to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.WFS>} layersParam
   * @returns {Map}
   * @api stable
   */
  addWFS(layersParam) {
    if (!Utils.isNullOrEmpty(layersParam)) {
      // checks if the implementation can manage layers
      if (Utils.isUndefined(MapImpl.prototype.addWFS)) {
        Exception('La implementación usada no posee el método addWFS');
      }

      // parses parameters to Array
      if (!Utils.isArray(layersParam)) {
        layersParam = [layersParam];
      }

      // gets the parameters as WFS objects to add
      let wfsLayers = [];
      layersParam.forEach(layerParam => {
        let wfsLayer;
        if (Utils.isObject(layerParam) && (layerParam instanceof WFS)) {
          wfsLayer = layerParam;
        }
        else if (!(layerParam instanceof Layer)) {
          try {
            wfsLayer = new WFS(layerParam, layerParam.options);
          }
          catch (err) {
            Dialog.error(err);
          }
        }
        this.featuresHandler_.addLayer(wfsLayer);
        wfsLayers.push(wfsLayer);
      });

      // adds the layers
      this.getImpl().addWFS(wfsLayers);
      this.fire(Evt.ADDED_LAYER, [wfsLayers]);
      this.fire(Evt.ADDED_WFS, [wfsLayers]);
    }
    return this;
  };

  /**
   * This function removes the WFS layers to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.WFS>} layersParam
   * @returns {Map}
   * @api stable
   */
  removeWFS(layersParam) {
    if (!Utils.isNullOrEmpty(layersParam)) {
      // checks if the implementation can manage layers
      if (Utils.isUndefined(MapImpl.prototype.removeWFS)) {
        Exception('La implementación usada no posee el método removeWFS');
      }

      // gets the layers
      let wfsLayers = this.getWFS(layersParam);
      if (wfsLayers.length > 0) {
        wfsLayers.forEach(layer => {
          this.featuresHandler_.removeLayer(layer);
        });
        // removes the layers
        this.getImpl().removeWFS(wfsLayers);
      }
    }
    return this;
  };

  /**
   * This function gets the WMTS layers added to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.WMTS>} layersParam
   * @returns {Array<WMTS>} layers from the map
   * @api stable
   */
  getWMTS(layersParam) {
    // checks if the implementation can manage layers
    if (Utils.isUndefined(MapImpl.prototype.getWMTS)) {
      Exception('La implementación usada no posee el método getWMTS');
    }

    let layers;

    // parses parameters to Array
    if (Utils.isNull(layersParam)) {
      layersParam = [];
    }
    else if (!Utils.isArray(layersParam)) {
      layersParam = [layersParam];
    }

    // gets the parameters as Layer objects to filter
    let filters = [];
    if (layersParam.length > 0) {
      filters = layersParam.map(layerParam => {
        return LayerParameter(layerParam, LayerType.WMTS);
      });
    }

    // gets the layers
    layers = this.getImpl().getWMTS(filters).sort(Map.LAYER_SORT);

    return layers;
  };

  /**
   * This function adds the WMTS layers to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.WMTS>} layersParam
   * @returns {Map}
   * @api stable
   */
  addWMTS(layersParam) {
    if (!Utils.isNullOrEmpty(layersParam)) {
      // checks if the implementation can manage layers
      if (Utils.isUndefined(MapImpl.prototype.addWMTS)) {
        Exception('La implementación usada no posee el método addWMTS');
      }

      // parses parameters to Array
      if (!Utils.isArray(layersParam)) {
        layersParam = [layersParam];
      }

      // gets the parameters as WMS objects to add
      let wmtsLayers = [];
      layersParam.forEach(layerParam => {
        if (Utils.isObject(layerParam) && (layerParam instanceof WMTS)) {
          wmtsLayers.push(layerParam);
        }
        else if (!(layerParam instanceof Layer)) {
          wmtsLayers.push(new WMTS(layerParam, layerParam.options));
        }
      });

      // adds the layers
      this.getImpl().addWMTS(wmtsLayers);
      this.fire(Evt.ADDED_LAYER, [wmtsLayers]);
      this.fire(Evt.ADDED_WMTS, [wmtsLayers]);
    }
    return this;
  };

  /**
   * This function removes the WMTS layers to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.WMTS>} layersParam
   * @returns {Map}
   * @api stable
   */
  removeWMTS(layersParam) {
    if (!Utils.isNullOrEmpty(layersParam)) {
      // checks if the implementation can manage layers
      if (Utils.isUndefined(MapImpl.prototype.removeWMTS)) {
        Exception('La implementación usada no posee el método removeWMTS');
      }

      // gets the layers
      let wmtsLayers = this.getWMTS(layersParam);
      if (wmtsLayers.length > 0) {
        // removes the layers
        this.getImpl().removeWMTS(wmtsLayers);
      }
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
  getMBtiles(layersParam) {
    // checks if the implementation can manage layers
    if (Utils.isUndefined(MapImpl.prototype.getMBtiles)) {
      Exception('La implementación usada no posee el método getMBtiles');
    }

    let layers;

    // parses parameters to Array
    if (Utils.isNull(layersParam)) {
      layersParam = [];
    }
    else if (!Utils.isArray(layersParam)) {
      layersParam = [layersParam];
    }

    // gets the parameters as Layer objects to filter
    let filters = [];
    if (layersParam.length > 0) {
      filters = layersParam.map(LayerParameter);
    }

    // gets the layers
    layers = this.getImpl().getMBtiles(filters).sort(Map.LAYER_SORT);

    return layers;
  };

  /**
   * This function adds the MBtiles layers to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.MBtiles>} layersParam
   * @returns {Map}
   * @api stable
   */
  addMBtiles(layersParam) {
    // TODO
  };

  /**
   * This function removes the MBtiles layers to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.MBtiles>} layersParam
   * @returns {Map}
   * @api stable
   */
  removeMBtiles(layersParam) {
    // TODO
  };

  /**
   * This function gets controls specified by the user
   *
   * @public
   * @function
   * @param {string|Array<String>} controlsParam
   * @returns {Array<Control>}
   * @api stable
   */
  getControls(controlsParam) {
    // checks if the implementation can manage layers
    if (Utils.isUndefined(MapImpl.prototype.getControls)) {
      Exception('La implementación usada no posee el método getControls');
    }

    // parses parameters to Array
    if (Utils.isNull(controlsParam)) {
      controlsParam = [];
    }
    else if (!Utils.isArray(controlsParam)) {
      controlsParam = [controlsParam];
    }

    // gets the controls
    let controls = this.getImpl().getControls(controlsParam);

    return controls;
  };

  /*/**
   * This function adds controls specified by the user
   *
   * @public
   * @function
   * @param {string|Object|Array<String>|Array<Object>} controlsParam
   * @returns {Map}
   * @api stable
   */
  //TODO mig
  addControls(controlsParam) {
    if (!Utils.isNullOrEmpty(controlsParam)) {
      // checks if the implementation can manage layers
      if (Utils.isUndefined(MapImpl.prototype.addControls)) {
        Exception('La implementación usada no posee el método addControls');
      }

      // parses parameters to Array
      if (!Utils.isArray(controlsParam)) {
        controlsParam = [controlsParam];
      }

      // gets the parameters as Control to add them
      let controls = [];
      //for (let i = 0, ilen = controlsParam.length; i < ilen; i++) {
      controlsParam.forEach(controlParam => {
        let control;
        let panel;
        if (Utils.isString(controlParam)) {
          controlParam = Utils.normalize(controlParam);
          switch (controlParam) {
            case Scale.NAME:
              control = new Scale();
              panel = this.getPanels('map-info')[0];
              if (Utils.isNullOrEmpty(panel)) {
                panel = new Panel('map-info', {
                  "collapsible": false,
                  "className": "m-map-info",
                  "position": UI.position.BR
                });
                panel.on(Evt.ADDED_TO_MAP, html => {
                  if (this.getControls(["wmcselector", "scale", "scaleline"]).length === 3) {
                    this.getControls(["scaleline"])[0].getImpl().getElement().classlist.add("ol-scale-line-up");
                  }
                });
              }
              panel.addClassName('m-with-scale');
              break;
            case ScaleLine.NAME:
              control = new ScaleLine();
              panel = new Panel(ScaleLine.NAME, {
                "collapsible": false,
                "className": "m-scaleline",
                "position": UI.position.BL,
                "tooltip": "Línea de escala"
              });
              panel.on(Evt.ADDED_TO_MAP, html => {
                if (this.getControls(["wmcselector", "scale", "scaleline"]).length === 3) {
                  this.getControls(["scaleline"])[0].getImpl().getElement().classlist.add("ol-scale-line-up");
                }
              });
              break;
            case Panzoombar.NAME:
              control = new Panzoombar();
              panel = new Panel(Panzoombar.NAME, {
                "collapsible": false,
                "className": "m-panzoombar",
                "position": UI.position.TL,
                "tooltip": "Nivel de zoom"
              });
              break;
            case Panzoom.NAME:
              control = new Panzoom();
              panel = new Panel(Panzoom.NAME, {
                "collapsible": false,
                "className": "m-panzoom",
                "position": UI.position.TL
              });
              break;
            case LayerSwitcher.NAME:
              control = new LayerSwitcher();
              /* closure a function in order to keep
               * the control value in the scope*/
              (function(layerswitcherCtrl) {
                panel = new Panel(LayerSwitcher.NAME, {
                  "collapsible": true,
                  "className": "m-layerswitcher",
                  "collapsedButtonClass": "g-cartografia-capas2",
                  "position": UI.position.TR,
                  "tooltip": "Selector de capas"
                });
                // enables touch scroll
                panel.on(Evt.ADDED_TO_MAP, html => {
                  Utils.enableTouchScroll(html.querySelector('.m-panel-controls'));
                });
                // renders and registers events
                panel.on(Evt.SHOW, evt => {
                  layerswitcherCtrl.registerEvents();
                  layerswitcherCtrl.render();
                });
                // unregisters events
                panel.on(Evt.HIDE, evt => {
                  layerswitcherCtrl.unregisterEvents();
                });
              })(control);
              break;
            case Mouse.NAME:
              control = new Mouse();
              panel = this.getPanels('map-info')[0];
              if (Utils.isNullOrEmpty(panel)) {
                panel = new Panel('map-info', {
                  "collapsible": false,
                  "className": "m-map-info",
                  "position": UI.position.BR,
                  "tooltip": "Coordenadas del puntero"
                });
              }
              panel.addClassName('m-with-mouse');
              break;
            case Navtoolbar.NAME:
              control = new Navtoolbar();
              break;
            case OverviewMap.NAME:
              control = new OverviewMap({
                'toggleDelay': 400
              });
              panel = this.getPanels('map-info')[0];
              if (Utils.isNullOrEmpty(panel)) {
                panel = new Panel('map-info', {
                  "collapsible": false,
                  "className": "m-map-info",
                  "position": UI.position.BR
                });
              }
              panel.addClassName('m-with-overviewmap');
              break;
            case Location.NAME:
              control = new Location();
              panel = new Panel(Location.NAME, {
                "collapsible": false,
                "className": 'm-location',
                "position": UI.position.BR
              });
              break;
            case GetFeatureInfo.NAME:
              control = new GetFeatureInfo();
              break;
            default:
              let getControlsAvailable = Utils.concatUrlPaths([Config.MAPEA_URL, '/api/actions/controls']);
              Dialog.error('El control "'.concat(controlParam).concat('" no está definido. Consulte los controles disponibles <a href="' + getControlsAvailable + '" target="_blank">aquí</a>'));
              break;
          }
        }
        else if (controlParam instanceof Control) {
          control = controlParam;
          if (control instanceof WMCSelector) {
            panel = this.getPanels('map-info')[0];
            if (Utils.isNullOrEmpty(panel)) {
              panel = new Panel('map-info', {
                "collapsible": false,
                "className": "m-map-info",
                "position": UI.position.BR
              });
              panel.on(Evt.ADDED_TO_MAP, html => {
                if (this.getControls(["wmcselector", "scale", "scaleline"]).length === 3) {
                  goog.dom.classlist.add(this.getControls(["scaleline"])[0].getImpl().getElement(),
                    "ol-scale-line-up");
                }
              });
            }
            panel.addClassName('m-with-wmcselector');
          }
        }
        else {
          Exception('El control "'.concat(controlParam).concat('" no es un control válido.'));
        }

        // checks if it has to be added into a main panel
        if (Config.panels.TOOLS.indexOf(control.name) !== -1) {
          if (Utils.isNullOrEmpty(this.panel.TOOLS)) {
            this.panel.TOOLS = new Panel('tools', {
              "collapsible": true,
              "className": 'm-tools',
              "collapsedButtonClass": 'g-cartografia-herramienta',
              "position": UI.position.TL,
              "tooltip": "Panel de herramientas"
            });
            //               this.addPanels([this.panel.TOOLS]);
          }
          //            if (!this.panel.TOOLS.hasControl(control)) {
          //               this.panel.TOOLS.addControls(control);
          //            }
          panel = this.panel.TOOLS;
        }
        else if (Config.panels.EDITION.indexOf(control.name) !== -1) {
          if (Utils.isNullOrEmpty(this.panel.EDITION)) {
            this.panel.EDITION = new Panel('edit', {
              "collapsible": true,
              "className": 'm-edition',
              "collapsedButtonClass": 'g-cartografia-editar',
              "position": UI.position.TL,
              "tooltip": "Herramientas de edición"
            });
            //               this.addPanels([this.panel.EDITION]);
          }
          //            if (!this.panel.EDITION.hasControl(control)) {
          //               this.panel.EDITION.addControls(control);
          //            }
          panel = this.panel.EDITION;
        }

        if (!Utils.isNullOrEmpty(panel) && !panel.hasControl(control)) {
          panel.addControls(control);
          this.addPanels(panel);
        }
        else {
          control.addTo(this);
          controls.push(control);
        }
      });
      this.getImpl().addControls(controls);
    }
    return this;
  };

  /**
   * This function removes the specified controls from the map
   *
   * @function
   * @param {string|Array<string>} controlsParam
   * specified by the user
   * @returns {Map}
   * @api stable
   */
  removeControls(controlsParam) {
    // checks if the parameter is null or empty
    if (Utils.isNullOrEmpty(controlsParam)) {
      Exception('No ha especificado ningún control a eliminar');
    }

    // checks if the implementation can manage controls
    if (Utils.isUndefined(MapImpl.prototype.removeControls)) {
      Exception('La implementación usada no posee el método removeControls');
    }

    // gets the contros to remove
    let controls = this.getControls(controlsParam);
    controls = [].concat(controls);
    if (controls.length > 0) {
      // removes controls from their panels
      controls.forEach(control => {
        if (!Utils.isNullOrEmpty(control.getPanel())) {
          control.getPanel().removeControls(control);
        }
      });
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
  getMaxExtent() {
    // checks if the implementation can set the maxExtent
    if (Utils.isUndefined(MapImpl.prototype.getMaxExtent)) {
      Exception('La implementación usada no posee el método getMaxExtent');
    }

    // parses the parameter
    let maxExtent = this.getImpl().getMaxExtent();

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
   * @returns {Map}
   * @api stable
   */
  setMaxExtent(maxExtentParam, zoomToExtent) {
    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(maxExtentParam)) {
      Exception('No ha especificado ningún maxExtent');
    }

    // checks if the implementation can set the maxExtent
    if (Utils.isUndefined(MapImpl.prototype.setMaxExtent)) {
      Exception('La implementación usada no posee el método setMaxExtent');
    }

    // parses the parameter
    try {
      let maxExtent = MaxExtentParameter(maxExtentParam);
      this.getImpl().setMaxExtent(maxExtent, zoomToExtent);
    }
    catch (err) {
      Dialog.error(err);
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
  getBbox() {
    // checks if the implementation can set the maxExtent
    if (Utils.isUndefined(MapImpl.prototype.getBbox)) {
      Exception('La implementación usada no posee el método getBbox');
    }

    let bbox = this.getImpl().getBbox();

    return bbox;
  };

  /**
   * This function sets the bbox for this
   * map instance
   *
   * @public
   * @function
   * @param {String|Array<String>|Array<Number>|Mx.Extent} bboxParam the bbox
   * @param {Object} vendorOpts vendor options
   * @returns {Map}
   * @api stable
   */
  setBbox(bboxParam, vendorOpts) {
    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(bboxParam)) {
      Exception('No ha especificado ningún bbox');
    }

    // checks if the implementation can set the maxExtent
    if (Utils.isUndefined(MapImpl.prototype.setBbox)) {
      Exception('La implementación usada no posee el método setBbox');
    }

    try {
      // parses the parameter
      let bbox = MaxExtentParameter(bboxParam);
      this.getImpl().setBbox(bbox, vendorOpts);
    }
    catch (err) {
      Dialog.error('El formato del parámetro bbox no es el correcto');
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
  getZoom() {
    // checks if the implementation can get the zoom
    if (Utils.isUndefined(MapImpl.prototype.getZoom)) {
      Exception('La implementación usada no posee el método getZoom');
    }

    let zoom = this.getImpl().getZoom();

    return zoom;
  };

  /**
   * This function sets the zoom for this
   * map instance
   *
   * @public
   * @function
   * @param {String|Number} zoomParam the zoom
   * @returns {Map}
   * @api stable
   */
  setZoom(zoomParam) {
    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(zoomParam)) {
      Exception('No ha especificado ningún zoom');
    }

    // checks if the implementation can set the zoom
    if (Utils.isUndefined(MapImpl.prototype.setZoom)) {
      Exception('La implementación usada no posee el método setZoom');
    }

    try {
      // parses the parameter
      let zoom = ZoomParameter(zoomParam);
      this.userZoom_ = zoom;
      this.getImpl().setZoom(zoom);
    }
    catch (err) {
      Dialog.error(err);
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
  getCenter() {
    // checks if the implementation can get the center
    if (Utils.isUndefined(MapImpl.prototype.getCenter)) {
      Exception('La implementación usada no posee el método getCenter');
    }

    let center = this.getImpl().getCenter();

    return center;
  };

  /**
   * This function sets the center for this
   * map instance
   *
   * @public
   * @function
   * @param {String|Array<String>|Array<Number>|Mx.Center} centerParam the new center
   * @returns {Map}
   * @api stable
   */
  setCenter(centerParam) {
    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(centerParam)) {
      Exception('No ha especificado ningún center');
    }

    // checks if the implementation can set the center
    if (Utils.isUndefined(MapImpl.prototype.setCenter)) {
      Exception('La implementación usada no posee el método setCenter');
    }

    // parses the parameter
    try {
      let center = Parameter.center(centerParam);
      this.getImpl().setCenter(center);
      if (center.draw === true) {
        this.drawLayer_.clear();

        this.centerFeature_ = new Feature("__mapeacenter__", {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [center.x, center.y]
          },
          "properties": {
            "vendor": {
              "mapea": { // TODO mig
                "click": goog.bind(function(evt) {
                  let label = this.getLabel();
                  if (!Utils.isNullOrEmpty(label)) {
                    label.show(this);
                  }
                }, this)
              }
            }
          }
        });
        this.drawFeatures([this.centerFeature_]);
      }
    }
    catch (err) {
      Dialog.error(err);
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
  getFeatureCenter() {
    return this.centerFeature_;
  };

  /**
   * This function remove center for this
   * map instance
   *
   * @public
   * @function
   * @api stable
   */
  removeCenter() {
    this.removeFeatures(this.centerFeature_);
    this.centerFeature_ = null;
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
  getResolutions() {
    // checks if the implementation can set the maxExtent
    if (Utils.isUndefined(MapImpl.prototype.getResolutions)) {
      Exception('La implementación usada no posee el método getResolutions');
    }

    let resolutions = this.getImpl().getResolutions();

    return resolutions;
  };

  /**
   * This function sets the resolutions for this
   * map instance
   *
   * @public
   * @function
   * @param {String|Array<String>|Array<Number>} resolutionsParam the resolutions
   * @returns {Map}
   * @api stable
   */
  setResolutions(resolutionsParam) {
    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(resolutionsParam)) {
      Exception('No ha especificado ninguna resolución');
    }

    // checks if the implementation can set the setResolutions
    if (Utils.isUndefined(MapImpl.prototype.setResolutions)) {
      Exception('La implementación usada no posee el método setResolutions');
    }

    // parses the parameter
    let resolutions = ResolutionsParameter(resolutionsParam);

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
  getScale() {
    // checks if the implementation has the method
    if (Utils.isUndefined(MapImpl.prototype.getScale)) {
      Exception('La implementación usada no posee el método getScale');
    }

    let scale = this.getImpl().getScale();

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
  getProjection() {
    // checks if the implementation has the method
    if (Utils.isUndefined(MapImpl.prototype.getProjection)) {
      Exception('La implementación usada no posee el método getProjection');
    }

    let projection = this.getImpl().getProjection();

    return projection;
  };

  /**
   * This function sets the projection for this
   * map instance
   *
   * @public
   * @function
   * @param {String|Mx.Projection} projection the bbox
   * @returns {Map}
   * @api stable
   */
  setProjection(projection, asDefault) {
    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(projection)) {
      Exception('No ha especificado ninguna proyección');
    }

    // checks if the implementation can set the projection
    if (Utils.isUndefined(MapImpl.prototype.setProjection)) {
      Exception('La implementación usada no posee el método setProjection');
    }

    // parses the parameter
    try {
      let oldProj = this.getProjection();
      projection = ProjectionParameter(projection);
      this.getImpl().setProjection(projection);
      this.defaultProj_ = (this.defaultProj_ && (asDefault === true));
      this.fire(Evt.CHANGE_PROJ, [oldProj, projection]);
    }
    catch (err) {
      Dialog.error(err);
      if (String(err).indexOf("El formato del parámetro projection no es correcto") >= 0) {
        this.setProjection(Config.DEFAULT_PROJ, true);
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
   * @returns {Map}
   * @api stable
   */
  getPlugins(names) {
    // parses parameters to Array
    if (Utils.isNull(names)) {
      names = [];
    }
    else if (!Utils.isArray(names)) {
      names = [names];
    }

    let plugins = [];

    // parse to Array
    if (names.length === 0) {
      plugins = this.plugins_;
    }
    else {
      names.forEach(name => {
        plugins = plugins.concat(this.plugins_.filter(plugin => {
          return (name === plugin.name);
        }));
      });
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
   * @returns {Map}
   * @api stable
   */
  addPlugin(plugin) {
    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(plugin)) {
      Exception('No ha especificado ningún plugin');
    }

    // checks if the plugin can be added to the map
    if (Utils.isUndefined(plugin.addTo)) {
      Exception('El plugin no puede añadirse al mapa');
    }

    this.plugins_.push(plugin);
    plugin.addTo(this);

    return this;
  };

  /**
   * This function removes the specified plugins from the map
   *
   * @function
   * @param {Array<Plugin>} plugins specified by the user
   * @returns {Map}
   * @api stable
   */
  removePlugins(plugins) {
    // checks if the parameter is null or empty
    if (Utils.isNullOrEmpty(plugins)) {
      Exception('No ha especificado ningún plugin a eliminar');
    }
    if (!Utils.isArray(plugins)) {
      plugins = [plugins];
    }

    plugins = [].concat(plugins);
    if (plugins.length > 0) {
      // removes controls from their panels
      plugins.forEach(plugin => {
        plugin.destroy();
        this.plugins_.remove(plugin);
      });
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
  getEnvolvedExtent() {
    // checks if the implementation can set the maxExtent
    if (Utils.isUndefined(MapImpl.prototype.getEnvolvedExtent)) {
      Exception('La implementación usada no posee el método getEnvolvedExtent');
    }

    return this.getImpl().getEnvolvedExtent();
  };

  /**
   * This function gets and zooms the map into the
   * calculated extent
   *
   * @public
   * @function
   * @returns {Map}
   * @api stable
   */
  zoomToMaxExtent(keepUserZoom) {
    // zoom to maxExtent if no zoom was specified
    let maxExtent = this.getMaxExtent();
    if (!Utils.isNullOrEmpty(maxExtent)) {
      this.setBbox(maxExtent);
    }
    else {
      /* if no maxExtent was provided then
       calculates the envolved extent */
      this.finishedMaxExtent_ = false;
      this.getEnvolvedExtent().then(extent => {
        if ((keepUserZoom !== true) || (Utils.isNullOrEmpty(this.userZoom_))) {
          this.setBbox(extent);
        }
        this.finishedMaxExtent_ = true;
        this.checkCompleted_();
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
  setTicket(ticket) {
    if (!Utils.isNullOrEmpty(ticket)) {
      if (Config.PROXY_POST_URL.indexOf("ticket=") == -1) {
        Config('PROXY_POST_URL', Utils.addParameters(Config.PROXY_POST_URL, {
          'ticket': ticket
        }));
      }
      if (Config.PROXY_URL.indexOf("ticket=") == -1) {
        Config('PROXY_URL', Utils.addParameters(Config.PROXY_URL, {
          'ticket': ticket
        }));
      }
    }

    return this;
  };

  /**
   * This function gets and zooms the map into the
   * calculated extent
   *
   * @private
   * @function
   * @returns {Map}
   */
  getInitCenter_() {
    return new Promise((success, fail) => {
      let center = this.getCenter();
      if (!Utils.isNullOrEmpty(center)) {
        success(center);
      }
      else {
        let maxExtent = this.getMaxExtent();
        if (!Utils.isNullOrEmpty(maxExtent)) {
          // obtener centro del maxExtent
          center = {
            'x': ((maxExtent.x.max + maxExtent.x.min) / 2),
            'y': ((maxExtent.y.max + maxExtent.y.min) / 2)
          };
          success(center);
        }
        else {
          this.getEnvolvedExtent().then(extent => {
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
   * @returns {Map}
   * @api stable
   */
  destroy() {
    // checks if the implementation can provide the implementation map
    if (Utils.isUndefined(MapImpl.prototype.destroy)) {
      Exception('La implementación usada no posee el método destroy');
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
  addLabel(labelParam, coordParam) {
    let panMapIfOutOfView = labelParam.panMapIfOutOfView === undefined ? true : labelParam.panMapIfOutOfView;
    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(labelParam)) {
      Exception('No ha especificado ninguna proyección');
    }

    // checks if the implementation can add labels
    if (Utils.isUndefined(MapImpl.prototype.addLabel)) {
      Exception('La implementación usada no posee el método addLabel');
    }

    let text = null;
    let coord = null;

    // object
    if (Utils.isObject(labelParam)) {
      text = Utils.escapeJSCode(labelParam.text);
      coord = labelParam.coord;
    }
    // string
    else {
      text = Utils.escapeJSCode(labelParam);
      coord = coordParam;
    }

    if (Utils.isNullOrEmpty(coord)) {
      coord = this.getCenter();
    }
    else {
      coord = Parameter.center(coord);
    }

    if (Utils.isNullOrEmpty(coord)) {
      this.getInitCenter_().then(initCenter => {
        // checks if the user stablished a center while it was
        // calculated
        let newCenter = this.getCenter();
        if (Utils.isNullOrEmpty(newCenter)) {
          newCenter = initCenter;
        }
        let label = new Label(text, newCenter, panMapIfOutOfView);
        this.getImpl().addLabel(label);
      });
    }
    else {
      let label = new Label(text, coord, panMapIfOutOfView);
      this.getImpl().addLabel(label);
    }

    return this;
  };


  /**
   * This function removes the WMC layers to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam
   * @returns {Map}
   * @api stable
   */
  getLabel() {
    return this.getImpl().getLabel();
  };


  /**
   * This function removes the WMC layers to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam
   * @returns {Map}
   * @api stable
   */
  removeLabel() {
    return this.getImpl().removeLabel();
  };

  /**
   * This function removes the WMC layers to the map
   *
   * @function
   * @param {Array<Mx.Point>|Mx.Point} points
   * @api stable
   */
  drawPoints(points) {
    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(points)) {
      Exception('No ha especificado ningún punto');
    }

    if (!Utils.isArray(points)) {
      points = [points];
    }

    let features = points.map(point => {
      let gj = {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [point.x, point.y]
        },
        "properties": {}
      };
      if (Utils.isFunction(point.click)) {
        gj.properties.vendor = {
          "mapea": {
            "click": point.click
          }
        };
      }
      return new Feature(null, gj);
    });
    this.drawLayer_.addFeatures(features);
  };

  /**
   * TODO
   *
   * @function
   * @param {Array<Feature>|Feature} features
   * @api stable
   */
  drawFeatures(features) {
    this.drawLayer_.addFeatures(features);
    return this;
  };

  /**
   * TODO
   *
   * @function
   * @param {Array<Feature>|Feature} features
   * @api stable
   */
  removeFeatures(features) {
    this.drawLayer_.removeFeatures(features);
    return this;
  };

  /**
   * TODO
   *
   * @function
   * @api stable
   * @returns {Map}
   */
  addPanels(panels) {
    if (!Utils.isNullOrEmpty(panels)) {
      if (!Utils.isArray(panels)) {
        panels = [panels];
      }
      panels.forEach(panel => {
        let isIncluded = false;
        for (let i = 0, ilen = this.panels_.length; i < ilen; i++) {
          if (this.panels_[i].equals(panel)) {
            isIncluded = true;
            break;
          }
        }
        if ((panel instanceof Panel) && !isIncluded) {
          this.panels_.push(panel);
          let queryArea = 'div.m-area'.concat(panel.position);
          let areaContainer = this.areasContainer_.querySelector(queryArea);
          panel.addTo(this, areaContainer);
        }
      });
    }
    return this;
  };

  /**
   * TODO
   *
   * @function
   * @api stable
   */
  removePanel(panel) {
    if (panel.getControls().length > 0) {
      Exception('Debe eliminar los controles del panel previamente');
    }
    if (panel instanceof Panel) {
      panel.destroy();
      this.panels_.remove(panel);
    }

    return this;
  };

  /**
   * TODO
   *
   * @function
   * @api stable
   * @returns {array<Panel>}
   */
  getPanels(names) {
    let panels = [];

    // parses parameters to Array
    if (Utils.isNullOrEmpty(names)) {
      panels = this.panels_;
    }
    else {
      if (!Utils.isArray(names)) {
        names = [names];
      }
      names.forEach(name => {
        let panel = this.panels_.filter(panel => panel["name"] === name);
        if (!Utils.isNullOrEmpty(panel)) {
          panels.push(panel);
        }
      });
    }

    return panels;
  };

  /**
   * TODO
   *
   * @private
   * @function
   */
  createMainPanels_() {
    // areas container
    this.areasContainer_ = document.createElement('div');
    this.areasContainer_.classlist.add('m-areas');

    // top-left area
    let tlArea = document.createElement('div');
    tlArea.classlist.add('m-area');
    tlArea.classlist.add('m-top');
    tlArea.classlist.add('m-left');
    // top-right area
    let trArea = document.createElement('div');
    trArea.classlist.add('m-area');
    trArea.classlist.add('m-top');
    trArea.classlist.add('m-right');

    // bottom-left area
    let blArea = document.createElement('div');
    blArea.classlist.add('m-area');
    blArea.classlist.add('m-bottom');
    blArea.classlist.add('m-left');
    // bottom-right area
    let brArea = goog.dom.createElement('div');
    brArea.classlist.add('m-area');
    brArea.classlist.add('m-bottom');
    brArea.classlist.add('m-right');

    this.areasContainer_.appendChild(tlArea);
    this.areasContainer_.appendChild(trArea);
    this.areasContainer_.appendChild(blArea);
    this.areasContainer_.appendChild(brArea);

    this.getContainer().appendChild(this.areasContainer_);
  };

  /**
   * This function provides the core map used by the
   * implementation
   *
   * @function
   * @api stable
   * @returns {Object} core map used by the implementation
   */
  getContainer() {    // checks if the implementation can provides the container
    if (Utils.isUndefined(MapImpl.prototype.getContainer)) {
      Exception('La implementación usada no posee el método getContainer');
    }
    return this.getImpl().getContainer();
  };

  /**
   * This function provides the core map used by the
   * implementation
   *
   * @function
   * @api stable
   * @returns {Object} core map used by the implementation
   */
  getMapImpl() {
    // checks if the implementation can add points
    if (Utils.isUndefined(MapImpl.prototype.getMapImpl)) {
      Exception('La implementación usada no posee el método getMapImpl');
    }
    return this.getImpl().getMapImpl();
  };

  /**
   * TODO
   *
   * @function
   * @api stable
   * @returns {Popup} core map used by the implementation
   */
  getPopup() {
    return this.popup_;
  };

  /**
   * TODO
   *
   * @function
   * @api stable
   * @returns {Map} core map used by the implementation
   */
  removePopup() {
    // checks if the implementation can add popups
    if (Utils.isUndefined(MapImpl.prototype.removePopup)) {
      Exception('La implementación usada no posee el método removePopup');
    }

    if (!Utils.isNullOrEmpty(this.popup_)) {
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
   * @returns {Map} core map used by the implementation
   */
  addPopup(popup, coordinate) {
    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(popup)) {
      Exception('No ha especificado ningún popup');
    }

    if (!(popup instanceof Popup)) {
      Exception('El popup especificado no es válido');
    }

    if (!Utils.isNullOrEmpty(this.popup_)) {
      this.removePopup();
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
  checkCompleted_() {
    if (this.finishedInitCenter_ && this.finishedMaxExtent_ && this.finishedMapImpl_) {
      this.fire(Evt.COMPLETED);
      this.finishedMap_ = true;
    }
  };

  /**
   * Sets the callback when the instace is loaded
   *
   * @public
   * @function
   * @api stable
   */
  on(eventType, listener, optThis) {
    super.on(eventType, listener, optThis);
    if ((eventType === Evt.COMPLETED) && (this.finishedMap_ === true)) {
      this.fire(Evt.COMPLETED);
    }
  };

  /**
   * This function refresh the state of this map instance,
   * this is, all its layers.
   *
   * @function
   * @api stable
   * @returns {Map} the instance
   */
  refresh() {
    // checks if the implementation has refresh method
    if (!Utils.isUndefined(this.getImpl().refresh) && Utils.isFunction(this.getImpl().refresh)) {
      this.getImpl().refresh();
    }
    this.getLayers().forEach(layer => {
      layer.refresh();
    });
    return this;
  };

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  static LAYER_SORT(layer1, layer2) {
    if (!Utils.isNullOrEmpty(layer1) && !Utils.isNullOrEmpty(layer2)) {
      let z1 = layer1.getZIndex();
      let z2 = layer2.getZIndex();

      return (z1 - z2);
    }

    // equals
    return 0;
  };

  /**
   * Draw layer style options.
   *
   * @const
   * @type {object}
   * @public
   * @api stable
   */
  static get DRAWLAYER_STYLE() {
    return Map.DRAWLAYER_STYLE_;
  }

  /**
   * Draw layer style options.
   *
   * @const
   * @type {object}
   * @public
   * @api stable
   */
  static set DRAWLAYER_STYLE(value) {
    Map.DRAWLAYER_STYLE_ = value
  }
}

Map.DRAWLAYER_STYLE_ = {
  fill: {
    color: '#009e00'
  },
  stroke: {
    color: '#fcfcfc',
    width: 2
  },
  radius: 7
};
