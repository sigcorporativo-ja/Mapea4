/**
 * @module M/Map
 */
import MapImpl from 'impl/Map';
import Base from './Base';
import {
  isNullOrEmpty,
  isUndefined,
  isNull,
  isArray,
  isFunction,
  normalize,
  addParameters,
  concatUrlPaths,
  enableTouchScroll,
  escapeJSCode,
  isString,
  isObject,
  getEnvolvedExtent,
} from './util/Utils';
import { getValue } from './i18n/language';
import Exception from './exception/exception';
import Label from './Label';
import Popup from './Popup';
import Parameters from './parameter/Parameters';
import * as parameter from './parameter/parameter';
import * as EventType from './event/eventtype';
import FeaturesHandler from './handler/Feature';
import Feature from './feature/Feature';
import * as Dialog from './dialog';
import GetFeatureInfo from './control/GetFeatureInfo';
import WMCSelector from './control/WMCSelector';
import LayerSwitcher from './control/Layerswitcher';
import Location from './control/Location';
import Navtoolbar from './control/Navtoolbar';
import Scale from './control/Scale';
import Rotate from './control/Rotate';
import ScaleLine from './control/ScaleLine';
import Mouse from './control/Mouse';
import OverviewMap from './control/OverviewMap';
import Panzoom from './control/Panzoom';
import Panzoombar from './control/Panzoombar';
import Layer from './layer/Layer';
import * as LayerType from './layer/Type';
import Vector from './layer/Vector';
import KML from './layer/KML';
import WFS from './layer/WFS';
import WMC from './layer/WMC';
import WMS from './layer/WMS';
import WMTS from './layer/WMTS';
import OSM from './layer/OSM';
import MVT from './layer/MVT';
import Mapbox from './layer/Mapbox';
import Panel from './ui/Panel';
import * as Position from './ui/position';
import Control from './control/Control';
import GeoJSON from './layer/GeoJSON';
import StylePoint from './style/Point';

/**
 * @classdesc
 * Main constructor of the class. Creates a Map
 * with parameters specified by the user
 * @api
 */
class Map extends Base {
  /**
   * @constructor
   * @extends { M.facade.Base }
   * @param { string | Mx.parameters.Map } userParameters parameters
   * @param { Mx.parameters.MapOptions } options custom options  for the implementation
   * provided by the user
   * @api
   */
  constructor(userParameters, options = {}) {
    // parses parameters to build the new map
    const params = new Parameters(userParameters);

    // calls the super constructor
    super();
    const impl = new MapImpl(params.container, this, options);
    // impl.setFacadeMap(this);
    this.setImpl(impl);

    // checks if the param is null or empty
    if (isNullOrEmpty(userParameters)) {
      Exception(getValue('exception').no_param);
    }

    // checks if the implementation can create maps
    if (isUndefined(MapImpl)) {
      Exception(getValue('exception').constructor_impl);
    }

    /**
     * @private
     * @type {array<Panel>}
     * @expose
     */
    this._panels = [];

    /**
     * @private
     * @type {array<Plugin>}
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
     * @type {Popup}
     */
    this.popup_ = null;

    /**
     * Flag that indicates if the used projection
     * is by default
     * @public
     * @type {Boolean}
     * @api
     * @expose
     */
    this._defaultProj = true;

    /**
     * @public
     * @type {object}
     * @api
     */
    this.panel = {
      LEFT: null,
      RIGHT: 'null',
    };

    /**
     * @private
     * @type {Number}
     */
    this._userZoom = null;

    /**
     * @private
     * @type {Object}
     */
    this.userCenter_ = null;

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
     * @type {Feature}
     */
    this.centerFeature_ = null;

    /**
     * Draw layer
     * @private
     * @type {Vector}
     */
    this.drawLayer_ = null;

    /**
     * MaxExtent provided by the user
     * @public
     * @type {Array<Number>}
     * @api
     */
    this.userMaxExtent = null;

    // adds class to the container
    params.container.classList.add('m-mapea-container');

    impl.on(EventType.COMPLETED, () => {
      this._finishedMapImpl = true;
      this._checkCompleted();
    });

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
      name: '__draw__',
    }, { displayInLayerSwitcher: false });

    this.drawLayer_.setStyle(new StylePoint(Map.DRAWLAYER_STYLE));

    this.drawLayer_.setZIndex(MapImpl.Z_INDEX[LayerType.WFS] + 999);
    this.addLayers(this.drawLayer_);

    // projection
    if (!isNullOrEmpty(params.projection)) {
      this.setProjection(params.projection);
    } else { // default projection
      this.setProjection(M.config.DEFAULT_PROJ, true);
    }

    // bbox
    if (!isNullOrEmpty(params.bbox)) {
      this.setBbox(params.bbox);
    }

    // resolutions
    if (!isNullOrEmpty(params.resolutions)) {
      this.setResolutions(params.resolutions);
    }

    // maxExtent
    if (!isNullOrEmpty(params.maxExtent)) {
      const zoomToMaxExtent = isNullOrEmpty(params.zoom) && isNullOrEmpty(params.bbox);
      this.setMaxExtent(params.maxExtent, zoomToMaxExtent);
    }

    // wmc
    if (!isNullOrEmpty(params.wmc)) {
      this.addWMC(params.wmc);
    }

    // layers
    if (!isNullOrEmpty(params.layers)) {
      this.addLayers(params.layers);
    }

    // wms
    if (!isNullOrEmpty(params.wms)) {
      this.addWMS(params.wms);
    }

    // wmts
    if (!isNullOrEmpty(params.wmts)) {
      this.addWMTS(params.wmts);
    }

    // kml
    if (!isNullOrEmpty(params.kml)) {
      this.addKML(params.kml);
    }

    // controls
    if (!isNullOrEmpty(params.controls)) {
      this.addControls(params.controls);
    } else { // default controls
      this.addControls('panzoom');
    }

    // getfeatureinfo
    if (!isNullOrEmpty(params.getfeatureinfo)) {
      if (params.getfeatureinfo !== 'plain' && params.getfeatureinfo !== 'html' && params.getfeatureinfo !== 'gml') {
        Dialog.error(getValue('dialog').getfeatureinfo_type);
      } else {
        const getFeatureInfo = new GetFeatureInfo(params.getfeatureinfo);
        this.addControls(getFeatureInfo);
      }
    }

    // default WMC
    if (isNullOrEmpty(params.wmc) && isNullOrEmpty(params.layers)) {
      this.addWMC(M.config.predefinedWMC.predefinedNames[0]);
    }

    // center
    if (!isNullOrEmpty(params.center)) {
      this.setCenter(params.center);
    }

    // zoom
    if (!isNullOrEmpty(params.zoom)) {
      this.setZoom(params.zoom);
    } else if (isNullOrEmpty(params.bbox)) {
      this.setZoom(0);
    }

    // rotation
    if (!isNullOrEmpty(params.rotation)) {
      this.once(EventType.COMPLETED, () => {
        this.setRotation(params.rotation);
      });
    }

    // label
    if (!isNullOrEmpty(params.label)) {
      this.addLabel(params.label);
    }

    // ticket
    if (!isNullOrEmpty(params.ticket)) {
      this.setTicket(params.ticket);
    }

    // initial zoom
    if (isNullOrEmpty(params.bbox) && isNullOrEmpty(params.zoom) && isNullOrEmpty(params.center)) {
      this.zoomToMaxExtent(true);
    }

    // initial center
    if (isNullOrEmpty(params.center) && isNullOrEmpty(params.bbox)) {
      this._finishedInitCenter = false;
      this.getInitCenter_().then((initCenter) => {
        if (isNullOrEmpty(this.userCenter_)) {
          this.setCenter(initCenter);
        }
        this._finishedInitCenter = true;
        this._checkCompleted();
      });
    }
  }

  /**
   * This function gets the layers added to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam
   * @returns {Array<Layer>}
   * @api
   */
  getLayers(layersParamVar) {
    let layersParam = layersParamVar;
    // checks if the implementation can manage layers
    if (isUndefined(MapImpl.prototype.getLayers)) {
      Exception(getValue('exception').getlayers_method);
    }
    // parses parameters to Array
    if (isNull(layersParam)) {
      layersParam = [];
    } else if (!isArray(layersParam)) {
      layersParam = [layersParam];
    }

    // gets the parameters as Layer objects to filter
    let filters = [];
    if (layersParam.length > 0) {
      filters = layersParam.map(parameter.layer);
    }

    // gets the layers
    const layers = this.getImpl().getLayers(filters).sort(Map.LAYER_SORT);

    return layers;
  }

  /**
   * This function gets the layers which are not in any layerGroup
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam
   * @returns {Array<Layer>}
   * @api
   */
  getRootLayers(layersParamVar) {
    const layers = this.getLayers(layersParamVar).filter(l => isNullOrEmpty(l.group));

    return layers;
  }

  /**
   * This function gets the base layers added to the map
   *
   * @function
   * @returns {Array<Layer>}
   * @api
   */
  getBaseLayers() {
    // checks if the implementation can manage layers
    if (isUndefined(MapImpl.prototype.getBaseLayers)) {
      Exception(getValue('exception').getbaselayers_method);
    }

    return this.getImpl().getBaseLayers().sort(Map.LAYER_SORT);
  }

  /**
   * This function adds layers specified by the user
   *
   * @function
   * @returns {M.handler.Feature}
   * @public
   * @api
   */
  getFeatureHandler() {
    return this.featuresHandler_;
  }

  /**
   * This function adds layers specified by the user
   *
   * @function
   * @param {string|Object|Array<String>|Array<Object>} layersParam
   * @returns {Map}
   * @api
   */
  addLayers(layersParameter) {
    let layersParam = layersParameter;
    if (!isNullOrEmpty(layersParam)) {
      // checks if the implementation can manage layers
      if (isUndefined(MapImpl.prototype.addLayers)) {
        Exception(getValue('exception').addlayers_method);
      }
      // parses parameters to Array
      if (!isArray(layersParam)) {
        layersParam = [layersParam];
      }
      // gets the parameters as Layer objects to add
      const layers = layersParam.map((layerParam) => {
        let layer;

        if (layerParam instanceof Layer) {
          layer = layerParam;
        } else {
          // try {
          const parameterVariable = parameter.layer(layerParam);
          if (!isNullOrEmpty(parameterVariable.type)) {
            switch (parameterVariable.type) {
              case 'WFS':
                layer = new WFS(layerParam, { style: parameterVariable.style });
                break;
              case 'WMC':
                layer = new WMC(layerParam);
                break;
              case 'WMS':
                layer = new WMS(layerParam);
                break;
              case 'GeoJSON':
                layer = new GeoJSON(parameterVariable, { style: parameterVariable.style });
                break;
              case 'OSM':
                layer = new OSM(layerParam);
                break;
              case 'Mapbox':
                layer = new Mapbox(layerParam);
                break;
              case 'KML':
                layer = new KML(layerParam);
                break;
              case 'Vector':
                layer = new Vector(layerParam);
                break;
              case 'WMTS':
                layer = new WMTS(layerParam);
                break;
              case 'MVT':
                layer = new MVT(layerParam);
                break;
              default:
                Dialog.error(getValue('dialog').invalid_type_layer);
            }
          } else {
            Dialog.error(getValue('dialog').invalid_type_layer);
          }
          // }
          // catch (err) {
          //   Dialog.error('El formato de la capa (' + layerParam + ') no se reconoce');
          //   throw err;
          // }
        }

        // KML and WFS layers handler its features
        if ((layer instanceof Vector && !(layer instanceof MVT))
          /* && !(layer instanceof KML) */
          &&
          !(layer instanceof WFS)) {
          this.featuresHandler_.addLayer(layer);
        }

        layer.setMap(this);

        return layer;
      });

      // adds the layers
      this.getImpl().addLayers(layers);
      this.fire(EventType.ADDED_LAYER, [layers]);
    }
    return this;
  }

  /**

   * This function removes the specified layers to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam
   * specified by the user
   * @returns {Map}
   * @api
   */
  removeLayers(layersParam) {
    if (!isNullOrEmpty(layersParam)) {
      // checks if the implementation can manage layers
      if (isUndefined(MapImpl.prototype.removeLayers)) {
        Exception(getValue('exception').removelayers_method);
      }

      // gets the layers to remove
      const layers = this.getLayers(layersParam);

      layers.forEach((layer) => {
        // KML and WFS layers handler its features
        if (layer instanceof Vector) {
          this.featuresHandler_.removeLayer(layer);
        }
      });

      // removes the layers
      this.getImpl().removeLayers(layers);
    }

    return this;
  }

  /**
   * TODO
   *
   * @function
   * @returns {Array<M.layer.Group>}
   * @api stable
   */
  getLayerGroup() {
    // checks if the implementation can manage layers
    if (isUndefined(MapImpl.prototype.getLayerGroups)) {
      Exception('La implementación usada no posee el método getLayerGroups');
    }
    return this.getImpl().getLayerGroups().sort(Map.LAYER_SORT);
  }
  /**
   * TODO
   *
   * @function
   * @param {Array<M.layer.Group>} layerGroups
   * @returns {M.Map}
   * @api stable
   */
  addLayerGroup(layerGroups) {
    let lGroups = layerGroups;
    // checks if the parameter is null or empty
    if (isNullOrEmpty(lGroups)) {
      Exception('No ha especificado ningun grupo');
    }
    // checks if the implementation can manage groups
    if (isUndefined(MapImpl.prototype.addLayerGroups)) {
      Exception('La implementación usada no posee el método addLayerGroups');
    }
    // parses parameters to Array
    if (!isArray(lGroups)) {
      lGroups = [lGroups];
    }
    // adds the groups
    this.getImpl().addLayerGroups(lGroups);
    return this;
  }
  /**
   * TODO
   *
   * @function
   * @param {Array<M.layer.Group>} layerGroups
   * specified by the user
   * @returns {M.Map}
   * @api stable
   */
  removeLayerGroup(layerGroups) {
    // checks if the parameter is null or empty
    if (isNullOrEmpty(layerGroups)) {
      Exception('No ha especificado ningun grupo a eliminar');
    }
    // checks if the implementation can manage groups
    if (isUndefined(this.getImpl().removeLayerGroups)) {
      Exception('La implementación usada no posee el método removeGroups');
    }
    // removes the layers
    this.getImpl().removeLayerGroups(layerGroups);
    return this;
  }


  /**
   * This function gets the WMC layers added to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam
   * @returns {Array<WMC>}
   * @api
   */
  getWMC(layersParamVar) {
    let layersParam = layersParamVar;
    // checks if the implementation can manage layers
    if (isUndefined(MapImpl.prototype.getWMC)) {
      Exception(getValue('exception').getwmc_method);
    }

    // parses parameters to Array
    if (isNull(layersParam)) {
      layersParam = [];
    } else if (!isArray(layersParam)) {
      layersParam = [layersParam];
    }

    // gets the parameters as Layer objects to filter
    let filters = [];
    if (layersParam.length > 0) {
      filters = layersParam.map((layerParam) => {
        return parameter.layer(layerParam, LayerType.WMC);
      });
    }

    // gets the layers
    const layers = this.getImpl().getWMC(filters).sort(Map.LAYER_SORT);

    return layers;
  }

  /**
   * This function adds the WMC layers to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam
   * @returns {Map}
   * @api
   */
  addWMC(layersParamVar) {
    let layersParam = layersParamVar;
    if (!isNullOrEmpty(layersParam)) {
      // checks if the implementation can manage layers
      if (isUndefined(MapImpl.prototype.addWMC)) {
        Exception(getValue('exception').addwmc_method);
      }

      // parses parameters to Array
      if (!isArray(layersParam)) {
        layersParam = [layersParam];
      }

      // gets the parameters as WMC objects to add
      const wmcLayers = [];
      layersParam.forEach((layerParam) => {
        if (isObject(layerParam) && (layerParam instanceof WMC)) {
          layerParam.setMap(this);
          wmcLayers.push(layerParam);
        } else if (!(layerParam instanceof Layer)) {
          try {
            const wmcLayer = new WMC(layerParam, layerParam.options);
            wmcLayer.setMap(this);
            wmcLayers.push(wmcLayer);
          } catch (err) {
            Dialog.error(err.toString());
            throw err;
          }
        }
      });

      // adds the layers
      this.getImpl().addWMC(wmcLayers);
      this.fire(EventType.ADDED_LAYER, [wmcLayers]);
      this.fire(EventType.ADDED_WMC, [wmcLayers]);

      /* checks if it should create the WMC control
         to select WMC */
      const addedWmcLayers = this.getWMC();
      const wmcSelected = addedWmcLayers.filter(wmc => wmc.selected === true)[0];
      if (wmcSelected == null) {
        addedWmcLayers[0].select();
      }
      if (addedWmcLayers.length > 1) {
        this.removeControls('wmcselector');
        this.addControls(new WMCSelector());
      }
    }
    return this;
  }

  /**
   * TODO
   * @function
   * @public
   */
  refreshWMCSelectorControl() {
    this.removeControls('wmcselector');
    if (this.getWMC().length === 1) {
      this.getWMC()[0].select();
    } else if (this.getWMC().length > 1) {
      this.addControls(new WMCSelector());
      const wmcSelected = this.getWMC().filter(wmc => wmc.selected === true)[0];
      if (wmcSelected == null) {
        this.getWMC()[0].select();
      }
    }
  }

  /**
   * This function removes the WMC layers to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam
   * @returns {Map}
   * @api
   */
  removeWMC(layersParam) {
    if (!isNullOrEmpty(layersParam)) {
      // checks if the implementation can manage layers
      if (isUndefined(MapImpl.prototype.removeWMC)) {
        Exception(getValue('exception').removewmc_method);
      }

      // gets the layers
      const wmcLayers = this.getWMC(layersParam);
      if (wmcLayers.length > 0) {
        // removes the layers
        this.getImpl().removeWMC(wmcLayers);
      }
    }
    return this;
  }

  /**
   * This function gets the KML layers added to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam
   * @returns {Array<KML>}
   * @api
   */
  getKML(layersParamVar) {
    let layersParam = layersParamVar;
    // checks if the implementation can manage layers
    if (isUndefined(MapImpl.prototype.getKML)) {
      Exception(getValue('exception').getkml_method);
    }

    // parses parameters to Array
    if (isNull(layersParam)) {
      layersParam = [];
    } else if (!isArray(layersParam)) {
      layersParam = [layersParam];
    }

    // gets the parameters as Layer objects to filter
    let filters = [];
    if (layersParam.length > 0) {
      filters = layersParam.map((layerParam) => {
        return parameter.layer(layerParam, LayerType.KML);
      });
    }

    // gets the layers
    const layers = this.getImpl().getKML(filters).sort(Map.LAYER_SORT);

    return layers;
  }

  /**
   * This function adds the KML layers to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.KML>} layersParam
   * @returns {Map}
   * @api
   */
  addKML(layersParamVar) {
    let layersParam = layersParamVar;
    if (!isNullOrEmpty(layersParam)) {
      // checks if the implementation can manage layers
      if (isUndefined(MapImpl.prototype.addKML)) {
        Exception(getValue('exception').addkml_method);
      }

      // parses parameters to Array
      if (!isArray(layersParam)) {
        layersParam = [layersParam];
      }

      // gets the parameters as KML objects to add
      const kmlLayers = [];
      layersParam.forEach((layerParam) => {
        let kmlLayer;
        if (isObject(layerParam) && (layerParam instanceof KML)) {
          kmlLayer = layerParam;
        } else if (!(layerParam instanceof Layer)) {
          kmlLayer = new KML(layerParam, layerParam.options);
        }
        if (kmlLayer.extract === true) {
          this.featuresHandler_.addLayer(kmlLayer);
        }
        kmlLayers.push(kmlLayer);
      });

      // adds the layers
      this.getImpl().addKML(kmlLayers);
      this.fire(EventType.ADDED_LAYER, [kmlLayers]);
      this.fire(EventType.ADDED_KML, [kmlLayers]);
    }
    return this;
  }

  /**
   * This function removes the KML layers to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.KML>} layersParam
   * @returns {Map}
   * @api
   */
  removeKML(layersParam) {
    if (!isNullOrEmpty(layersParam)) {
      // checks if the implementation can manage layers
      if (isUndefined(MapImpl.prototype.removeKML)) {
        Exception(getValue('exception').removekml_method);
      }

      // gets the layers
      const kmlLayers = this.getKML(layersParam);
      if (kmlLayers.length > 0) {
        kmlLayers.forEach((layer) => {
          this.featuresHandler_.removeLayer(layer);
        });
        // removes the layers
        this.getImpl().removeKML(kmlLayers);
      }
    }
    return this;
  }

  /**
   * This function gets the WMS layers added to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.WMC>} layersParam
   * @returns {Array<WMS>} layers from the map
   * @api
   */
  getWMS(layersParamVar) {
    let layersParam = layersParamVar;
    // checks if the implementation can manage layers
    if (isUndefined(MapImpl.prototype.getWMS)) {
      Exception(getValue('exception').getwms_method);
    }

    // parses parameters to Array
    if (isNull(layersParam)) {
      layersParam = [];
    } else if (!isArray(layersParam)) {
      layersParam = [layersParam];
    }

    // gets the parameters as Layer objects to filter
    let filters = [];
    if (layersParam.length > 0) {
      filters = layersParam.map((layerParam) => {
        return parameter.layer(layerParam, LayerType.WMS);
      });
    }

    // gets the layers
    const layers = this.getImpl().getWMS(filters).sort(Map.LAYER_SORT);

    return layers;
  }

  /**
   * This function adds the WMS layers to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.WMS>} layersParam
   * @returns {Map}
   * @api
   */
  addWMS(layersParamVar) {
    let layersParam = layersParamVar;
    if (!isNullOrEmpty(layersParam)) {
      // checks if the implementation can manage layers
      if (isUndefined(MapImpl.prototype.addWMS)) {
        Exception(getValue('exception').addwms_method);
      }

      // parses parameters to Array
      if (!isArray(layersParam)) {
        layersParam = [layersParam];
      }

      // gets the parameters as WMS objects to add
      const wmsLayers = [];
      layersParam.forEach((layerParam) => {
        let wmsLayer = layerParam;
        if (!(layerParam instanceof WMS)) {
          wmsLayer = new WMS(layerParam, layerParam.options);
        }
        wmsLayer.setMap(this);
        wmsLayers.push(wmsLayer);
      });

      // adds the layers
      this.getImpl().addWMS(wmsLayers);
      this.fire(EventType.ADDED_LAYER, [wmsLayers]);
      this.fire(EventType.ADDED_WMS, [wmsLayers]);
    }
    return this;
  }

  /**
   * This function removes the WMS layers to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.WMS>} layersParam
   * @returns {Map}
   * @api
   */
  removeWMS(layersParam) {
    if (!isNullOrEmpty(layersParam)) {
      // checks if the implementation can manage layers
      if (isUndefined(MapImpl.prototype.removeWMS)) {
        Exception(getValue('exception').removewms_method);
      }

      // gets the layers
      const wmsLayers = this.getWMS(layersParam);
      if (wmsLayers.length > 0) {
        // removes the layers
        this.getImpl().removeWMS(wmsLayers);
      }
    }
    return this;
  }

  /**
   * This function gets the WFS layers added to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam
   * @returns {Array<WFS>} layers from the map
   * @api
   */
  getWFS(layersParamVar) {
    let layersParam = layersParamVar;
    // checks if the implementation can manage layers
    if (isUndefined(MapImpl.prototype.getWFS)) {
      Exception(getValue('exception').getwfs_method);
    }

    // parses parameters to Array
    if (isNull(layersParam)) {
      layersParam = [];
    } else if (!isArray(layersParam)) {
      layersParam = [layersParam];
    }

    // gets the parameters as Layer objects to filter
    let filters = [];
    if (layersParam.length > 0) {
      filters = layersParam.map((layerParam) => {
        return parameter.layer(layerParam, LayerType.WFS);
      });
    }

    // gets the layers
    const layers = this.getImpl().getWFS(filters).sort(Map.LAYER_SORT);

    return layers;
  }

  /**
   * This function gets the GeoJSON layers added to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam
   * @returns {Array<WFS>} layers from the map
   * @api
   */
  getGeoJSON(layersParamVar) {
    let layersParam = layersParamVar;
    // checks if the implementation can manage layers
    if (isUndefined(MapImpl.prototype.getGeoJSON)) {
      Exception(getValue('exception').getgeojson_method);
    }

    // parses parameters to Array
    if (isNull(layersParam)) {
      layersParam = [];
    } else if (!isArray(layersParam)) {
      layersParam = [layersParam];
    }

    // gets the layers
    const layers = this.getImpl().getGeoJSON(layersParam).sort(Map.LAYER_SORT);

    return layers;
  }

  /**
   * This function adds the WFS layers to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.WFS>} layersParam
   * @returns {Map}
   * @api
   */
  addWFS(layersParamVar) {
    let layersParam = layersParamVar;
    if (!isNullOrEmpty(layersParam)) {
      // checks if the implementation can manage layers
      if (isUndefined(MapImpl.prototype.addWFS)) {
        Exception(getValue('exception').addwfs_method);
      }

      // parses parameters to Array
      if (!isArray(layersParam)) {
        layersParam = [layersParam];
      }

      // gets the parameters as WFS objects to add
      const wfsLayers = [];
      layersParam.forEach((layerParam) => {
        let wfsLayer;
        if (isObject(layerParam) && (layerParam instanceof WFS)) {
          wfsLayer = layerParam;
        } else if (!(layerParam instanceof Layer)) {
          try {
            wfsLayer = new WFS(layerParam, layerParam.options);
          } catch (err) {
            Dialog.error(err.toString());
            throw err;
          }
        }
        this.featuresHandler_.addLayer(wfsLayer);
        wfsLayers.push(wfsLayer);
      });

      // adds the layers
      this.getImpl().addWFS(wfsLayers);
      this.fire(EventType.ADDED_LAYER, [wfsLayers]);
      this.fire(EventType.ADDED_WFS, [wfsLayers]);
    }
    return this;
  }

  /**
   * This function removes the WFS layers to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.WFS>} layersParam
   * @returns {Map}
   * @api
   */
  removeWFS(layersParam) {
    if (!isNullOrEmpty(layersParam)) {
      // checks if the implementation can manage layers
      if (isUndefined(MapImpl.prototype.removeWFS)) {
        Exception(getValue('exception').removewfs_method);
      }

      // gets the layers
      const wfsLayers = this.getWFS(layersParam);
      if (wfsLayers.length > 0) {
        wfsLayers.forEach((layer) => {
          this.featuresHandler_.removeLayer(layer);
        });
        // removes the layers
        this.getImpl().removeWFS(wfsLayers);
      }
    }
    return this;
  }

  /**
   * This function gets the WMTS layers added to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.WMTS>} layersParam
   * @returns {Array<WMTS>} layers from the map
   * @api
   */
  getWMTS(layersParamVar) {
    let layersParam = layersParamVar;
    // checks if the implementation can manage layers
    if (isUndefined(MapImpl.prototype.getWMTS)) {
      Exception(getValue('exception').getwmts_method);
    }

    // parses parameters to Array
    if (isNull(layersParam)) {
      layersParam = [];
    } else if (!isArray(layersParam)) {
      layersParam = [layersParam];
    }

    // gets the parameters as Layer objects to filter
    let filters = [];
    if (layersParam.length > 0) {
      filters = layersParam.map((layerParam) => {
        return parameter.layer(layerParam, LayerType.WMTS);
      });
    }

    // gets the layers
    const layers = this.getImpl().getWMTS(filters).sort(Map.LAYER_SORT);

    return layers;
  }

  /**
   * This function adds the WMTS layers to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.WMTS>} layersParam
   * @returns {Map}
   * @api
   */
  addWMTS(layersParamVar) {
    let layersParam = layersParamVar;
    if (!isNullOrEmpty(layersParam)) {
      // checks if the implementation can manage layers
      if (isUndefined(MapImpl.prototype.addWMTS)) {
        Exception(getValue('exception').addwmts_method);
      }

      // parses parameters to Array
      if (!isArray(layersParam)) {
        layersParam = [layersParam];
      }

      // gets the parameters as WMS objects to add
      const wmtsLayers = [];
      layersParam.forEach((layerParam) => {
        if (isObject(layerParam) && (layerParam instanceof WMTS)) {
          layerParam.setMap(this);
          wmtsLayers.push(layerParam);
        } else if (!(layerParam instanceof Layer)) {
          const wmtsLayer = new WMTS(layerParam, layerParam.options);
          wmtsLayer.setMap(this);
          wmtsLayers.push(wmtsLayer);
        }
      });

      // adds the layers
      this.getImpl().addWMTS(wmtsLayers);
      this.fire(EventType.ADDED_LAYER, [wmtsLayers]);
      this.fire(EventType.ADDED_WMTS, [wmtsLayers]);
    }
    return this;
  }

  /**
   * This function removes the WMTS layers to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.WMTS>} layersParam
   * @returns {Map}
   * @api
   */
  removeWMTS(layersParam) {
    if (!isNullOrEmpty(layersParam)) {
      // checks if the implementation can manage layers
      if (isUndefined(MapImpl.prototype.removeWMTS)) {
        Exception(getValue('exception').removewmts_method);
      }

      // gets the layers
      const wmtsLayers = this.getWMTS(layersParam);
      if (wmtsLayers.length > 0) {
        // removes the layers
        this.getImpl().removeWMTS(wmtsLayers);
      }
    }
    return this;
  }

  /**
   * This function gets the MBtiles layers added to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam
   * @returns {Array<M.layer.MBtiles>} layers from the map
   * @api
   */
  getMBtiles(layersParamVar) {
    let layersParam = layersParamVar;
    // checks if the implementation can manage layers
    if (isUndefined(MapImpl.prototype.getMBtiles)) {
      Exception(getValue('exception').getmbtiles_method);
    }

    // parses parameters to Array
    if (isNull(layersParam)) {
      layersParam = [];
    } else if (!isArray(layersParam)) {
      layersParam = [layersParam];
    }

    // gets the parameters as Layer objects to filter
    let filters = [];
    if (layersParam.length > 0) {
      filters = layersParam.map(parameter.layer);
    }

    // gets the layers
    const layers = this.getImpl().getMBtiles(filters).sort(Map.LAYER_SORT);

    return layers;
  }

  /**
   * This function adds the MBtiles layers to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.MBtiles>} layersParam
   * @returns {Map}
   * @api
   */
  addMBtiles(layersParam) {
    // TODO
  }

  /**
   * This function removes the MBtiles layers to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.MBtiles>} layersParam
   * @returns {Map}
   * @api
   */
  removeMBtiles(layersParam) {
    // TODO
  }

  /**
   * This function gets the vector tile layers
   *
   * @function
   * @public
   * @api
   */
  getMVT(layersParamVar) {
    let layersParam = layersParamVar;
    if (isUndefined(MapImpl.prototype.getMVT)) {
      Exception('La implementación usada no posee el método getWFS');
    }

    if (isNull(layersParam)) {
      layersParam = [];
    } else if (!isArray(layersParam)) {
      layersParam = [layersParam];
    }

    let filters = [];
    if (layersParam.length > 0) {
      filters = layersParam.map((layerParam) => {
        return parameter.layer(layerParam, LayerType.MVT);
      });
    }

    const layers = this.getImpl().getMVT(filters).sort(Map.LAYER_SORT);

    return layers;
  }

  /**
   * This function removes the vector tile layers from map.
   *
   * @function
   * @public
   * @api
   */
  removeMVT(layersParam) {
    if (!isNullOrEmpty(layersParam)) {
      if (isUndefined(MapImpl.prototype.removeMVT)) {
        Exception('La implementación usada no posee el método removeWFS');
      }
      const mvtLayers = this.getMVT(layersParam);
      if (mvtLayers.length > 0) {
        mvtLayers.forEach((layer) => {
          this.featuresHandler_.removeLayer(layer);
        });
        this.getImpl().removeMVT(mvtLayers);
      }
    }
    return this;
  }

  /**
   * This function adds the vector tile layers
   *
   * @function
   * @public
   * @api
   */
  addMVT(layersParamVar) {
    let layersParam = layersParamVar;
    if (!isNullOrEmpty(layersParam)) {
      if (isUndefined(MapImpl.prototype.addMVT)) {
        Exception('La implementación usada no posee el método addWFS');
      }

      if (!isArray(layersParam)) {
        layersParam = [layersParam];
      }

      const mvtLayers = [];
      layersParam.forEach((layerParam) => {
        let vectorTile;
        if (isObject(layerParam) && (layerParam instanceof MVT)) {
          vectorTile = layerParam;
        } else if (!(layerParam instanceof Layer)) {
          try {
            vectorTile = new MVT(layerParam, layerParam.options);
          } catch (err) {
            Dialog.error(err.toString());
            throw err;
          }
        }
        // FIXME: Hay problemas majenando las features de los vector tiles
        // en openlayers
        // this.featuresHandler_.addLayer(vectorTile);
        mvtLayers.push(vectorTile);
      });

      this.getImpl().addMVT(mvtLayers);
      this.fire(EventType.ADDED_LAYER, [mvtLayers]);
      this.fire(EventType.ADDED_VECTOR_TILE, [mvtLayers]);
    }
    return this;
  }

  /**
   * This function gets controls specified by the user
   *
   * @public
   * @function
   * @param {string|Array<String>} controlsParam
   * @returns {Array<Control>}
   * @api
   */
  getControls(controlsParamVar) {
    let controlsParam = controlsParamVar;

    // checks if the implementation can manage layers
    if (isUndefined(MapImpl.prototype.getControls)) {
      Exception(getValue('exception').getcontrols_method);
    }

    // parses parameters to Array
    if (isNull(controlsParam)) {
      controlsParam = [];
    } else if (!isArray(controlsParam)) {
      controlsParam = [controlsParam];
    }

    // gets the controls
    const controls = this.getImpl().getControls(controlsParam);

    return controls;
  }

  /**
   * This function adds controls specified by the user
   *
   * @public
   * @function
   * @param {string|Object|Array<String>|Array<Object>} controlsParam
   * @returns {Map}
   * @api
   */
  addControls(controlsParamVar) {
    let controlsParam = controlsParamVar;
    if (!isNullOrEmpty(controlsParam)) {
      // checks if the implementation can manage layers
      if (isUndefined(MapImpl.prototype.addControls)) {
        Exception(getValue('exception').addcontrols_method);
      }

      // parses parameters to Array
      if (!isArray(controlsParam)) {
        controlsParam = [controlsParam];
      }

      // gets the parameters as Control to add them
      const controls = [];
      // for (let i = 0, ilen = controlsParam.length; i < ilen; i++) {
      controlsParam.forEach((controlParamVar) => {
        let controlParam = controlParamVar;
        let control;
        let panel;
        if (isString(controlParam)) {
          controlParam = normalize(controlParam);
          switch (controlParam) {
            case Scale.NAME:
              control = new Scale();
              panel = this.getPanels('map-info')[0];
              if (isNullOrEmpty(panel)) {
                panel = new Panel('map-info', {
                  collapsible: false,
                  className: 'm-map-info',
                  position: Position.BR,
                });
                panel.on(EventType.ADDED_TO_MAP, (html) => {
                  if (this.getControls(['wmcselector', 'scale', 'scaleline']).length === 3) {
                    this.getControls(['scaleline'])[0].getImpl().getElement().classList.add('ol-scale-line-up');
                  }
                });
              }
              panel.addClassName('m-with-scale');
              break;
            case `${Scale.NAME}*true`:
              control = new Scale({ exactScale: true });
              panel = this.getPanels('map-info')[0];
              if (isNullOrEmpty(panel)) {
                panel = new Panel('map-info', {
                  collapsible: false,
                  className: 'm-map-info',
                  position: Position.BR,
                });
                panel.on(EventType.ADDED_TO_MAP, (html) => {
                  if (this.getControls(['wmcselector', 'scale', 'scaleline']).length === 3) {
                    this.getControls(['scaleline'])[0].getImpl().getElement().classList.add('ol-scale-line-up');
                  }
                });
              }
              panel.addClassName('m-with-scale');
              break;
            case ScaleLine.NAME:
              control = new ScaleLine();
              panel = new Panel(ScaleLine.NAME, {
                collapsible: false,
                className: 'm-scaleline',
                position: Position.BL,
                tooltip: 'Línea de escala',
              });
              panel.on(EventType.ADDED_TO_MAP, (html) => {
                if (this.getControls(['wmcselector', 'scale', 'scaleline']).length === 3) {
                  this.getControls(['scaleline'])[0].getImpl().getElement().classList.add('ol-scale-line-up');
                }
              });
              break;
            case Panzoombar.NAME:
              control = new Panzoombar();
              panel = new Panel(Panzoombar.NAME, {
                collapsible: false,
                className: 'm-panzoombar',
                position: Position.TL,
                tooltip: 'Nivel de zoom',
              });
              break;
            case Panzoom.NAME:
              control = new Panzoom();
              panel = new Panel(Panzoom.NAME, {
                collapsible: false,
                className: 'm-panzoom',
                position: Position.TL,
              });
              break;
            case LayerSwitcher.NAME:
              control = new LayerSwitcher();
              /* closure a function in order to keep
               * the control value in the scope */
              ((layerswitcherCtrl) => {
                panel = new Panel(LayerSwitcher.NAME, {
                  collapsible: true,
                  className: 'm-layerswitcher',
                  collapsedButtonClass: 'g-cartografia-capas2',
                  position: Position.TR,
                  tooltip: getValue('layerswitcher').title,
                });
                // enables touch scroll
                panel.on(EventType.ADDED_TO_MAP, (html) => {
                  enableTouchScroll(html.querySelector('.m-panel-controls'));
                });
                // renders and registers events
                panel.on(EventType.SHOW, (evt) => {
                  layerswitcherCtrl.registerEvents();
                  layerswitcherCtrl.render();
                });
                // unregisters events
                panel.on(EventType.HIDE, (evt) => {
                  layerswitcherCtrl.unregisterEvents();
                });
              })(control);
              break;
            case Mouse.NAME:
              control = new Mouse();
              panel = this.getPanels('map-info')[0];
              if (isNullOrEmpty(panel)) {
                panel = new Panel('map-info', {
                  collapsible: false,
                  className: 'm-map-info',
                  position: Position.BR,
                  tooltip: 'Coordenadas del puntero',
                });
              }
              panel.addClassName('m-with-mouse');
              break;
            case Navtoolbar.NAME:
              control = new Navtoolbar();
              break;
            case OverviewMap.NAME:
              control = new OverviewMap({ toggleDelay: 400 });
              panel = this.getPanels('map-info')[0];
              if (isNullOrEmpty(panel)) {
                panel = new Panel('map-info', {
                  collapsible: false,
                  className: 'm-map-info',
                  position: Position.BR,
                });
              }
              panel.addClassName('m-with-overviewmap');
              break;
            case Location.NAME:
              control = new Location();
              panel = new Panel(Location.NAME, {
                collapsible: false,
                className: 'm-location',
                position: Position.BR,
              });
              break;
            case GetFeatureInfo.NAME:
              control = new GetFeatureInfo();
              break;
            case Rotate.NAME:
              control = new Rotate();
              panel = new Panel(Rotate.name, {
                collapsible: false,
                className: 'm-rotate',
                position: Position.TR,
              });
              break;
            default:
              const getControlsAvailable = concatUrlPaths([M.config.MAPEA_URL, '/api/actions/controls']);
              Dialog.error(`El control ${controlParam} no está definido. Consulte los controles disponibles <a href='${getControlsAvailable}' target="_blank">aquí</a>`);
          }
        } else if (controlParam instanceof Control) {
          control = controlParam;
          if (control instanceof WMCSelector) {
            panel = this.getPanels('map-info')[0];
            if (isNullOrEmpty(panel)) {
              panel = new Panel('map-info', {
                collapsible: false,
                className: 'm-map-info',
                position: Position.BR,
              });
              panel.on(EventType.ADDED_TO_MAP, (html) => {
                if (this.getControls(['wmcselector', 'scale', 'scaleline']).length === 3) {
                  this.getControls(['scaleline'])[0].getImpl().getElement().classList.add('ol-scale-line-up');
                }
              });
            }
            panel.addClassName('m-with-wmcselector');
          }
        } else {
          Exception('El control "'.concat(controlParam).concat('" no es un control válido.'));
        }

        // checks if it has to be added into a main panel
        if (M.config.panels.TOOLS.indexOf(control.name) !== -1) {
          if (isNullOrEmpty(this.panel.TOOLS)) {
            this.panel.TOOLS = new Panel('tools', {
              collapsible: true,
              className: 'm-tools',
              collapsedButtonClass: 'g-cartografia-herramienta',
              position: Position.TL,
              tooltip: 'Panel de herramientas',
            });
            //               this.addPanels([this.panel.TOOLS]);
          }
          //            if (!this.panel.TOOLS.hasControl(control)) {
          //               this.panel.TOOLS.addControls(control);
          //            }
          panel = this.panel.TOOLS;
        } else if (M.config.panels.EDITION.indexOf(control.name) !== -1) {
          if (isNullOrEmpty(this.panel.EDITION)) {
            this.panel.EDITION = new Panel('edit', {
              collapsible: true,
              className: 'm-edition',
              collapsedButtonClass: 'g-cartografia-editar',
              position: Position.TL,
              tooltip: 'Herramientas de edición',
            });
            //               this.addPanels([this.panel.EDITION]);
          }
          //            if (!this.panel.EDITION.hasControl(control)) {
          //               this.panel.EDITION.addControls(control);
          //            }
          panel = this.panel.EDITION;
        }

        if (!isNullOrEmpty(panel) && !panel.hasControl(control)) {
          panel.addControls(control);
          this.addPanels(panel);
        } else {
          control.addTo(this);
          controls.push(control);
        }
      });
      this.getImpl().addControls(controls);
    }
    return this;
  }

  /**
   * This function removes the specified controls from the map
   *
   * @function
   * @param {string|Array<string>} controlsParam
   * specified by the user
   * @returns {Map}
   * @api
   */
  removeControls(controlsParam) {
    // checks if the parameter is null or empty
    if (isNullOrEmpty(controlsParam)) {
      Exception(getValue('exception').remove_control);
    }

    // checks if the implementation can manage controls
    if (isUndefined(MapImpl.prototype.removeControls)) {
      Exception(getValue('exception').removecontrol_method);
    }

    // gets the contros to remove
    let controls = this.getControls(controlsParam);
    controls = [].concat(controls);
    if (controls.length > 0) {
      // removes controls from their panels
      controls.forEach((control) => {
        if (!isNullOrEmpty(control.getPanel())) {
          control.getPanel().removeControls(control);
        }
      });
      // removes the controls
      this.getImpl().removeControls(controls);
    }

    return this;
  }

  /**
   * This function provides the maximum extent for this
   * map instance
   *
   * @public
   * @function
   * @returns {Mx.Extent}
   * @api
   */
  getMaxExtent() {
    let maxExtent = this.userMaxExtent;
    if (isNullOrEmpty(maxExtent)) {
      const selectedWmc = this.getWMC().find(wmc => wmc.selected);
      if (isNullOrEmpty(selectedWmc)) {
        maxExtent = getEnvolvedExtent(this.getLayers().filter(layer => layer.name !== '__draw__').map(l => l.getMaxExtent()));
      } else {
        maxExtent = selectedWmc.getMaxExtent();
      }
      if (isNullOrEmpty(maxExtent)) {
        maxExtent = this.getProjection().getExtent();
      }
    }
    return maxExtent;
  }

  /**
   * This function provides the maximum extent for this
   * map instance.
   * Async version of getMaxExtent
   *
   * @public
   * @function
   * @returns {Promise}
   * @api
   */
  calculateMaxExtent() {
    return new Promise((resolve) => {
      let maxExtent = this.userMaxExtent;
      if (isNullOrEmpty(maxExtent)) {
        const selectedWmc = this.getWMC().find(wmc => wmc.selected);
        if (isNullOrEmpty(selectedWmc)) {
          const calculateExtents = this.getLayers().filter(layer => layer.name !== '__draw__').map(l => l.calculateMaxExtent());
          Promise.all(calculateExtents).then((extents) => {
            maxExtent = getEnvolvedExtent(extents);
            if (isNullOrEmpty(maxExtent)) {
              maxExtent = this.getProjection().getExtent();
            }
            // if the maxExtent is modified while are calculating maxExtent
            if (!isNullOrEmpty(this.userMaxExtent)) {
              maxExtent = this.userMaxExtent;
            }
            resolve(maxExtent);
          });
        } else {
          selectedWmc.calculateMaxExtent().then(resolve);
        }
      } else {
        resolve(maxExtent);
      }
    });
  }


  /**
   * This function sets the maximum extent for this
   * map instance
   *
   * @public
   * @function
   * @param {String|Array<String>|Array<Number>|Mx.Extent} maxExtentParam the extent max
   * @param {Boolean} zoomToExtent - Set bbox
   * @returns {Map}
   * @api
   */
  setMaxExtent(maxExtentParam, zoomToExtent = true) {
    // checks if the param is null or empty
    if (isNullOrEmpty(maxExtentParam)) {
      this.resetMaxExtent();
    }

    // checks if the implementation can set the maxExtent
    if (isUndefined(MapImpl.prototype.setMaxExtent)) {
      Exception(getValue('exception').setmaxextent_method);
    }

    // parses the parameter
    try {
      let maxExtent = parameter.maxExtent(maxExtentParam);
      if (!isArray(maxExtent) && isObject(maxExtent)) {
        maxExtent = [
          maxExtent.x.min,
          maxExtent.y.min,
          maxExtent.x.max,
          maxExtent.y.max,
        ];
      }
      this.userMaxExtent = maxExtent;
      this.getImpl().setMaxExtent(maxExtent, zoomToExtent);
    } catch (err) {
      Dialog.error(err.toString());
      throw err;
    }
    return this;
  }

  /**
   * This function resets the maximum extent of the Map.
   *
   * @public
   * @function
   * @returns {Map}
   * @api
   */
  resetMaxExtent() {
    this.userMaxExtent = null;
    this.calculateMaxExtent().then((maxExtentParam) => {
      const maxExtent = parameter.maxExtent(maxExtentParam);
      this.getImpl().setMaxExtent(maxExtent, true);
    });
    return this;
  }

  /**
   * This function provides the current extent (bbox) of this
   * map instance
   *
   * @public
   * @function
   * @returns {Mx.Extent}
   * @api
   */
  getBbox() {
    // checks if the implementation can set the maxExtent
    if (isUndefined(MapImpl.prototype.getBbox)) {
      Exception(getValue('exception').getbbox_method);
    }

    const bbox = this.getImpl().getBbox();

    return bbox;
  }

  /**
   * This function sets the bbox for this
   * map instance
   *
   * @public
   * @function
   * @param {String|Array<String>|Array<Number>|Mx.Extent} bboxParam the bbox
   * @param {Object} vendorOpts vendor options
   * @returns {Map}
   * @api
   */
  setBbox(bboxParam, vendorOpts) {
    // checks if the param is null or empty
    if (isNullOrEmpty(bboxParam)) {
      Exception(getValue('exception').no_bbox);
    }

    // checks if the implementation can set the maxExtent
    if (isUndefined(MapImpl.prototype.setBbox)) {
      Exception(getValue('exception').setbbox_method);
    }

    try {
      // parses the parameter
      const bbox = parameter.maxExtent(bboxParam);
      this.getImpl().setBbox(bbox, vendorOpts);
    } catch (err) {
      Dialog.error(getValue('exception').incorrect_format_bbox);
      throw err;
    }
    return this;
  }

  /**
   * This function provides the current zoom of this
   * map instance
   *
   * @public
   * @function
   * @returns {Number}
   * @api
   */
  getZoom() {
    // checks if the implementation can get the zoom
    if (isUndefined(MapImpl.prototype.getZoom)) {
      Exception(getValue('exception').getzoom_method);
    }

    const zoom = this.getImpl().getZoom();

    return zoom;
  }

  /**
   * This function sets the zoom for this
   * map instance
   *
   * @public
   * @function
   * @param {String|Number} zoomParam the zoom
   * @returns {Map}
   * @api
   */
  setZoom(zoomParam) {
    // checks if the param is null or empty
    if (isNullOrEmpty(zoomParam)) {
      Exception(getValue('exception').no_zoom);
    }

    // checks if the implementation can set the zoom
    if (isUndefined(MapImpl.prototype.setZoom)) {
      Exception(getValue('exception').setzoom_method);
    }

    try {
      // parses the parameter
      const zoom = parameter.zoom(zoomParam);
      this._userZoom = zoom;
      this.getImpl().setZoom(zoom);
    } catch (err) {
      Dialog.error(err.toString());
      throw err;
    }

    return this;
  }

  //
  /**
   * This function provides the current center of this
   * map instance
   *
   * @public
   * @function
   * @returns {Array<Number>}
   * @api
   */
  getCenter() {
    // checks if the implementation can get the center
    if (isUndefined(MapImpl.prototype.getCenter)) {
      Exception(getValue('exception').getcenter_method);
    }

    const center = this.getImpl().getCenter();

    return center;
  }

  /**
   * This function sets the center for this
   * map instance
   *
   * @public
   * @function
   * @param {String|Array<String>|Array<Number>|Mx.Center} centerParam the new center
   * @returns {Map}
   * @api
   */
  setCenter(centerParam) {
    // checks if the param is null or empty
    if (isNullOrEmpty(centerParam)) {
      Exception(getValue('exception').no_center);
    }

    // checks if the implementation can set the center
    if (isUndefined(MapImpl.prototype.setCenter)) {
      Exception(getValue('exception').setcenter_method);
    }

    // parses the parameter
    // try {
    const center = parameter.center(centerParam);
    this.getImpl().setCenter(center);
    this.userCenter_ = center;
    if (center.draw === true) {
      this.drawLayer_.clear();

      this.centerFeature_ = new Feature('__mapeacenter__', {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [center.x, center.y],
        },
        properties: {
          vendor: {
            mapea: { // TODO mig
              click: (evt) => {
                const label = this.getLabel();
                if (!isNullOrEmpty(label)) {
                  label.show(this);
                }
              },
            },
          },
        },
      });
      this.drawFeatures([this.centerFeature_]);
    }
    // }
    // catch (err) {
    //   Dialog.error(err.toString());
    //   throw err;
    // }

    return this;
  }

  /**
   * This function remove feature center for this
   * map instance
   *
   * @private
   * @function
   */
  getFeatureCenter() {
    return this.centerFeature_;
  }

  /**
   * This function remove center for this
   * map instance
   *
   * @public
   * @function
   * @api
   */
  removeCenter() {
    this.removeFeatures(this.centerFeature_);
    this.centerFeature_ = null;
    this.zoomToMaxExtent();
  }

  /**
   * This function provides the resolutions of this
   * map instance
   *
   * @public
   * @function
   * @returns {Array<Number>}
   * @api
   */
  getResolutions() {
    // checks if the implementation can set the maxExtent
    if (isUndefined(MapImpl.prototype.getResolutions)) {
      Exception(getValue('exception').getresolutions_method);
    }

    const resolutions = this.getImpl().getResolutions();

    return resolutions;
  }

  /**
   * This function sets the resolutions for this
   * map instance
   *
   * @public
   * @function
   * @param {String|Array<String>|Array<Number>} resolutionsParam the resolutions
   * @returns {Map}
   * @api
   */
  setResolutions(resolutionsParam) {
    // checks if the param is null or empty
    if (isNullOrEmpty(resolutionsParam)) {
      Exception(getValue('exception').no_resolutions);
    }

    // checks if the implementation can set the setResolutions
    if (isUndefined(MapImpl.prototype.setResolutions)) {
      Exception(getValue('exception').setresolutions_method);
    }

    // parses the parameter
    const resolutions = parameter.resolutions(resolutionsParam);

    this.getImpl().setResolutions(resolutions);

    return this;
  }

  /**
   * This function provides the current scale of this
   * map instance
   *
   * @public
   * @function
   * @returns {Mx.Projection}
   * @api
   */
  getScale() {
    // checks if the implementation has the method
    if (isUndefined(MapImpl.prototype.getScale)) {
      Exception(getValue('exception').getscale_method);
    }

    const scale = this.getImpl().getScale();

    return scale;
  }

  /**
   * This function provides the current scale of this
   * map instance
   *
   * @public
   * @function
   * @api
   */
  getExactScale() {
    // checks if the implementation has the method
    if (isUndefined(MapImpl.prototype.getExactScale)) {
      Exception('La implementación usada no posee el método getScale');
    }

    const scale = this.getImpl().getExactScale();

    return scale;
  }

  /**
   * This function provides the current projection of this
   * map instance
   *
   * @public
   * @function
   * @returns {Mx.Projection}
   * @api
   */
  getProjection() {
    // checks if the implementation has the method
    if (isUndefined(MapImpl.prototype.getProjection)) {
      Exception(getValue('exception').getprojection_method);
    }

    const projection = this.getImpl().getProjection();

    return projection;
  }

  /**
   * This function sets the projection for this
   * map instance
   *
   * @public
   * @function
   * @param {String|Mx.Projection} projection the bbox
   * @returns {Map}
   * @api
   */
  setProjection(projectionParam, asDefault) {
    let projection = projectionParam;
    // checks if the param is null or empty
    if (isNullOrEmpty(projection)) {
      Exception(getValue('exception').no_projection);
    }

    // checks if the implementation can set the projection
    if (isUndefined(MapImpl.prototype.setProjection)) {
      Exception(getValue('exception').setprojection_method);
    }

    // parses the parameter
    try {
      const oldProj = this.getProjection();
      projection = parameter.projection(projection);

      if (oldProj.code !== projection.code) {
        this.getImpl().setProjection(projection);
        this._defaultProj = (this._defaultProj && (asDefault === true));
        this.fire(EventType.CHANGE_PROJ, [oldProj, projection]);
      }
    } catch (err) {
      Dialog.error(err.toString());
      if (String(err).indexOf('El formato del parámetro projection no es correcto') >= 0) {
        this.setProjection(M.config.DEFAULT_PROJ, true);
      }
    }

    return this;
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @param {Mx.Plugin} plugin the plugin to add to the map
   * @returns {Map}
   * @api
   */
  getPlugins(namesParam) {
    let names = namesParam;
    // parses parameters to Array
    if (isNull(names)) {
      names = [];
    } else if (!isArray(names)) {
      names = [names];
    }

    let plugins = [];

    // parse to Array
    if (names.length === 0) {
      plugins = this._plugins;
    } else {
      names.forEach((name) => {
        plugins = plugins.concat(this._plugins.filter((plugin) => {
          return (name === plugin.name);
        }));
      });
    }
    return plugins;
  }

  /**
   * This function adds an instance of a specified
   * developed plugin
   *
   * @public
   * @function
   * @param {Mx.Plugin} plugin the plugin to add to the map
   * @returns {Map}
   * @api
   */
  addPlugin(plugin) {
    // checks if the param is null or empty
    if (isNullOrEmpty(plugin)) {
      Exception(getValue('exception').no_plugins);
    }

    // checks if the plugin can be added to the map
    if (isUndefined(plugin.addTo)) {
      Exception(getValue('exception').no_add_plugin_to_map);
    }

    this._plugins.push(plugin);
    plugin.addTo(this);

    return this;
  }

  /**
   * This function removes the specified plugins from the map
   *
   * @function
   * @param {Array<Plugin>} plugins specified by the user
   * @returns {Map}
   * @api
   */
  removePlugins(pluginsParam) {
    let plugins = pluginsParam;
    // checks if the parameter is null or empty
    if (isNullOrEmpty(plugins)) {
      Exception(getValue('exception').no_plugin_to_remove);
    }
    if (!isArray(plugins)) {
      plugins = [plugins];
    }

    plugins = [].concat(plugins);
    if (plugins.length > 0) {
      // removes controls from their panels
      plugins.forEach((plugin) => {
        plugin.destroy();
        this._plugins = this._plugins.filter(plugin2 => plugin.name !== plugin2.name);
      });
    }

    return this;
  }

  /**
   * This function provides the promise of envolved extent of this
   * map instance
   *
   * @public
   * @function
   * @returns {Promise}
   * @api
   */
  getEnvolvedExtent() {
    return new Promise((resolve) => {
      // 1 check the WMC extent
      const wmcLayer = this.getWMC().find(wmc => wmc.selected);
      if (!isNullOrEmpty(wmcLayer)) {
        wmcLayer.getMaxExtent(resolve);
      } else {
        const visibleBaseLayer = this.getBaseLayers().find(layer => layer.isVisible());
        if (!isNullOrEmpty(visibleBaseLayer)) {
          visibleBaseLayer.getMaxExtent(resolve);
        } else {
          const layers = this.getLayers().filter(layer => layer.name !== '__draw__');
          Promise.all(layers.map(layer => layer.calculateMaxExtent()))
            .then((extents) => {
              const extentsToCalculate =
                isNullOrEmpty(extents) ? [this.getProjection().getExtent()] : extents;
              const envolvedMaxExtent = getEnvolvedExtent(extentsToCalculate);
              resolve(envolvedMaxExtent);
            });
        }
      }
    });
  }

  /**
   * This function gets and zooms the map into the
   * calculated extent
   *
   * @public
   * @function
   * @returns {Map}
   * @api
   */
  zoomToMaxExtent(keepUserZoom) {
    this.calculateMaxExtent().then((maxExtent) => {
      if (keepUserZoom !== true || isNullOrEmpty(this._userZoom)) {
        this.setBbox(maxExtent);
      }
      this._finishedMaxExtent = true;
      this._checkCompleted();
    });
    return this;
  }

  /**
   * This function adds a ticket to control secure layers
   *
   * @public
   * @function
   * @param {String} ticket ticket user
   * @api
   */
  setTicket(ticket) {
    if (!isNullOrEmpty(ticket)) {
      if (M.config.PROXY_POST_URL.indexOf('ticket=') === -1) {
        M.config('PROXY_POST_URL', addParameters(M.config.PROXY_POST_URL, { ticket }));
      }
      if (M.config.PROXY_URL.indexOf('ticket=') === -1) {
        M.config('PROXY_URL', addParameters(M.config.PROXY_URL, { ticket }));
      }
    }

    return this;
  }

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
      this.calculateMaxExtent().then((extent) => {
        let center;
        if (isArray(extent)) {
          center = {
            x: ((extent[0] + extent[2]) / 2),
            y: ((extent[1] + extent[3]) / 2),
          };
        } else {
          center = {
            x: ((extent.x.max + extent.x.min) / 2),
            y: ((extent.y.max + extent.y.min) / 2),
          };
        }
        success(center);
      });
    });
  }

  /**
   * This function destroys this map, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @returns {Map}
   * @api
   */
  destroy() {
    // checks if the implementation can provide the implementation map
    if (isUndefined(MapImpl.prototype.destroy)) {
      Exception(getValue('exception').destroy_method);
    }

    this.getImpl().destroy();

    return this;
  }

  /**
   * This function removes the WMC layers to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam
   * @api
   */
  addLabel(labelParam, coordParam) {
    const panMapIfOutOfView = labelParam.panMapIfOutOfView === undefined ?
      true :
      labelParam.panMapIfOutOfView;
    // checks if the param is null or empty
    if (isNullOrEmpty(labelParam)) {
      Exception(getValue('exception').no_projection);
    }

    // checks if the implementation can add labels
    if (isUndefined(MapImpl.prototype.addLabel)) {
      Exception(getValue('exception').addlabel_method);
    }

    let text = null;
    let coord = null;

    // object
    if (isObject(labelParam)) {
      text = escapeJSCode(labelParam.text);
      coord = labelParam.coord;
    } else {
      // string
      text = escapeJSCode(labelParam);
      coord = coordParam;
    }

    if (isNullOrEmpty(coord)) {
      coord = this.getCenter();
    } else {
      coord = parameter.center(coord);
    }

    if (isNullOrEmpty(coord)) {
      this.getInitCenter_().then((initCenter) => {
        const label = new Label(text, initCenter, panMapIfOutOfView);
        this.getImpl().addLabel(label);
      });
    } else {
      const label = new Label(text, coord, panMapIfOutOfView);
      this.getImpl().addLabel(label);
    }

    return this;
  }

  /**
   * This function removes the WMC layers to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam
   * @returns {Map}
   * @api
   */
  getLabel() {
    return this.getImpl().getLabel();
  }

  /**
   * This function removes the WMC layers to the map
   *
   * @function
   * @param {Array<string>|Array<Mx.parameters.Layer>} layersParam
   * @returns {Map}
   * @api
   */
  removeLabel() {
    return this.getImpl().removeLabel();
  }

  /**
   * This function removes the WMC layers to the map
   *
   * @function
   * @param {Array<Mx.Point>|Mx.Point} points
   * @api
   */
  drawPoints(pointsVar) {
    let points = pointsVar;
    // checks if the param is null or empty
    if (isNullOrEmpty(points)) {
      Exception(getValue('exception').no_point);
    }

    if (!isArray(points)) {
      points = [points];
    }

    const features = points.map((point) => {
      const gj = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [point.x, point.y],
        },
        properties: {},
      };
      if (isFunction(point.click)) {
        gj.properties.vendor = {
          mapea: {
            click: point.click,
          },
        };
      }
      return new Feature(null, gj);
    });
    this.drawLayer_.addFeatures(features);
  }

  /**
   * TODO
   *
   * @function
   * @param {Array<Feature>|Feature} features
   * @api
   */
  drawFeatures(features) {
    this.drawLayer_.addFeatures(features);
    return this;
  }

  /**
   * TODO
   *
   * @function
   * @param {Array<Feature>|Feature} features
   * @api
   */
  removeFeatures(features) {
    this.drawLayer_.removeFeatures(features);
    return this;
  }

  /**
   * TODO
   *
   * @function
   * @api
   * @returns {Map}
   */
  addPanels(panelsVar) {
    let panels = panelsVar;
    if (!isNullOrEmpty(panels)) {
      if (!isArray(panels)) {
        panels = [panels];
      }
      panels.forEach((panel) => {
        const isIncluded = this._panels.some(panel2 => panel2.equals(panel));
        if ((panel instanceof Panel) && !isIncluded) {
          this._panels.push(panel);
          const queryArea = 'div.m-area'.concat(panel.position);
          const areaContainer = this._areasContainer.querySelector(queryArea);
          panel.addTo(this, areaContainer);
        }
      });
    }
    return this;
  }

  /**
   * TODO
   *
   * @function
   * @api
   */
  removePanel(panel) {
    if (panel.getControls().length > 0) {
      Exception(getValue('exception').remove_control_from_panel);
    }
    if (panel instanceof Panel) {
      panel.destroy();
      this._panels = this._panels.filter(panel2 => !panel2.equals(panel));
    }

    return this;
  }

  /**
   * TODO
   *
   * @function
   * @api
   * @returns {array<Panel>}
   */
  getPanels(namesVar) {
    let names = namesVar;
    let panels = [];

    // parses parameters to Array
    if (isNullOrEmpty(names)) {
      panels = this._panels;
    } else {
      if (!isArray(names)) {
        names = [names];
      }
      names.forEach((name) => {
        const filteredPanels = this._panels.filter(panel => panel.name === name);
        filteredPanels.forEach((panel) => {
          if (!isNullOrEmpty(panel)) {
            panels.push(panel);
          }
        });
      });
    }

    return panels;
  }

  /**
   * TODO
   *
   * @private
   * @function
   */
  createMainPanels_() {
    // areas container
    this._areasContainer = document.createElement('div');
    this._areasContainer.classList.add('m-areas');

    // top-left area
    const tlArea = document.createElement('div');
    tlArea.classList.add('m-area');
    tlArea.classList.add('m-top');
    tlArea.classList.add('m-left');
    // top-right area
    const trArea = document.createElement('div');
    trArea.classList.add('m-area');
    trArea.classList.add('m-top');
    trArea.classList.add('m-right');

    // bottom-left area
    const blArea = document.createElement('div');
    blArea.classList.add('m-area');
    blArea.classList.add('m-bottom');
    blArea.classList.add('m-left');
    // bottom-right area
    const brArea = document.createElement('div');
    brArea.classList.add('m-area');
    brArea.classList.add('m-bottom');
    brArea.classList.add('m-right');

    this._areasContainer.appendChild(tlArea);
    this._areasContainer.appendChild(trArea);
    this._areasContainer.appendChild(blArea);
    this._areasContainer.appendChild(brArea);

    this.getContainer().appendChild(this._areasContainer);
  }

  /**
   * This function provides the core map used by the
   * implementation
   *
   * @function
   * @api
   * @returns {Object} core map used by the implementation
   */
  getContainer() { // checks if the implementation can provides the container
    if (isUndefined(MapImpl.prototype.getContainer)) {
      Exception(getValue('exception').getcontainer_method);
    }
    return this.getImpl().getContainer();
  }

  /**
   * This function provides the core map used by the
   * implementation
   *
   * @function
   * @api
   * @returns {Object} core map used by the implementation
   */
  getMapImpl() {
    // checks if the implementation can add points
    if (isUndefined(MapImpl.prototype.getMapImpl)) {
      Exception(getValue('exception').getmapimpl_method);
    }
    return this.getImpl().getMapImpl();
  }

  /**
   * TODO
   *
   * @function
   * @api
   * @returns {Popup} core map used by the implementation
   */
  getPopup() {
    return this.popup_;
  }

  /**
   * TODO
   *
   * @function
   * @api
   * @returns {Map} core map used by the implementation
   */
  removePopup() {
    // checks if the implementation can add popups
    if (isUndefined(MapImpl.prototype.removePopup)) {
      Exception(getValue('exception').removepopup_method);
    }

    if (!isNullOrEmpty(this.popup_)) {
      this.getImpl().removePopup(this.popup_);
      this.popup_.destroy();
      this.popup_ = null;
    }

    return this;
  }

  /**
   * TODO
   *
   * @function
   * @api
   * @returns {Map} core map used by the implementation
   */
  addPopup(popup, coordinate) {
    // checks if the param is null or empty
    if (isNullOrEmpty(popup)) {
      Exception(getValue('exception').no_popup);
    }

    if (!(popup instanceof Popup)) {
      Exception(getValue('exception').invalid_popup);
    }

    if (!isNullOrEmpty(this.popup_)) {
      this.removePopup();
    }
    this.popup_ = popup;
    this.popup_.addTo(this, coordinate);

    return this;
  }

  /**
   * TODO
   *
   * @public
   * @function
   */
  _checkCompleted() {
    if (this._finishedInitCenter && this._finishedMaxExtent && this._finishedMapImpl) {
      this._finishedMap = true;
      this.fire(EventType.COMPLETED);
    }
  }

  /**
   * Sets the callback when the instace is loaded
   *
   * @public
   * @function
   * @api
   */
  on(eventType, listener, optThis) {
    super.on(eventType, listener, optThis);
    if ((eventType === EventType.COMPLETED) && (this._finishedMap === true)) {
      this.fire(EventType.COMPLETED);
    }
  }

  /**
   * This function refresh the state of this map instance,
   * this is, all its layers.
   *
   * @function
   * @api
   * @returns {Map} the instance
   */
  refresh() {
    // checks if the implementation has refresh method
    if (!isUndefined(this.getImpl().refresh) && isFunction(this.getImpl().refresh)) {
      this.getImpl().refresh();
    }
    this.getLayers().forEach(layer => layer.refresh());
    return this;
  }

  /**
   * Getter of defaultProj_ attribute
   * @public
   * @function
   * @api
   */
  get defaultProj() {
    return this._defaultProj;
  }

  /**
   * TODO
   * @public
   * @function
   * @api
   */
  static LAYER_SORT(layer1, layer2) {
    if (!isNullOrEmpty(layer1) && !isNullOrEmpty(layer2)) {
      const z1 = layer1.getZIndex();
      const z2 = layer2.getZIndex();

      return (z1 - z2);
    }

    // equals
    return 0;
  }

  /**
   * This function returns true if the map and its impl are completed.
   * @public
   * @returns {bool}
   */
  isFinished() {
    return this._finishedMap;
  }

  /**
   * areasContainer_ getter
   */
  get areasContainer() {
    return this._areasContainer;
  }

  /**
   * This function gets the rotation of the view map
   *
   * @function
   * @public
   * @api
   * @return {number}
   */
  getRotation() {
    if (isUndefined(MapImpl.prototype.getRotation)) {
      Exception(getValue('exception').no_get_rotation_method);
    }
    return (this.getImpl().getRotation()) * (180 / Math.PI);
  }

  /**
   * This function sets the rotation of the view map
   *
   * @function
   * @public
   * @api
   * @param {number}
   */
  setRotation(rotation) {
    if (isUndefined(MapImpl.prototype.setRotation)) {
      Exception(getValue('exception').no_set_rotation_method);
    }
    this.getImpl().setRotation(rotation * (Math.PI / 180));
  }
}

/**
 * Draw layer style options.
 *
 * @const
 * @type {object}
 * @public
 * @api
 */
Map.DRAWLAYER_STYLE = {
  fill: {
    color: '#009e00',
  },
  stroke: {
    color: '#fcfcfc',
    width: 2,
  },
  radius: 7,
};

export default Map;
