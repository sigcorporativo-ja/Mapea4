/**
 * @module M/impl/layer/WMS
 */
import {
  isNullOrEmpty,
  isNull,
  getResolutionFromScale,
  addParameters,
  concatUrlPaths,
  getWMSGetCapabilitiesUrl,
  extend,
  fillResolutions,
  generateResolutionsFromExtent,
} from 'M/util/Utils';
import FacadeLayerBase from 'M/layer/Layer';
import * as LayerType from 'M/layer/Type';
import FacadeWMS from 'M/layer/WMS';
import { get as getRemote } from 'M/util/Remote';
import * as EventType from 'M/event/eventtype';
import OLLayerTile from 'ol/layer/Tile';
import OLLayerImage from 'ol/layer/Image';
import { get as getProj } from 'ol/proj';
import OLTileGrid from 'ol/tilegrid/TileGrid';
import { getBottomLeft } from 'ol/extent';
import ImplUtils from '../util/Utils';
import ImplMap from '../Map';
import LayerBase from './Layer';
import GetCapabilities from '../util/WMSCapabilities';
import FormatWMS from '../format/WMS';
import TileWMS from '../source/TileWMS';
import ImageWMS from '../source/ImageWMS';
import { isUndefined } from '../../../facade/js/util/Utils';

/**
 * @classdesc
 * @api
 */
class WMS extends LayerBase {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WMS layer
   * with parameters specified by the user
   *
   * @constructor
   * @implements {M.impl.Layer}
   * @param {Mx.parameters.LayerOptions} options custom options for this layer
   * @param {Object} vendorOptions vendor options for the base library
   * @api stable
   */
  constructor(options = {}, vendorOptions) {
    // calls the super constructor
    super(options, vendorOptions);

    /**
     * The facade layer instance
     * @private
     * @type {M.layer.WMS}
     * @expose
     */
    this.facadeLayer_ = null;

    /**
     * WMS layer options
     * @private
     * @type {object}
     * @expose
     */
    this.options = options;

    /**
     * The WMS layers instances from capabilities
     * @private
     * @type {Array<M.layer.WMS>}
     */
    this.layers = [];

    /**
     * WMS layer options
     * @private
     * @type {boolean}
     * @expose
     */
    this.displayInLayerSwitcher_ = true;

    /**
     * get WMS getCapabilities promise
     * @private
     * @type {Promise}
     */
    this.getCapabilitiesPromise = null;

    /**
     * Function to override the tile loading
     * @private
     * @type {Function}
     */
    this.tileLoadFunction = options.tileLoadFunction;

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

    /**
     * Current projection
     * @private
     * @type {ol.Projection}
     */
    this.extentProj_ = null;

    // sets visibility
    if (this.options.visibility === false) {
      this.visibility = false;
    }

    // tiled
    if (isNullOrEmpty(this.tiled)) {
      this.tiled = (this.options.singleTile !== true);
    }

    // number of zoom levels
    if (isNullOrEmpty(this.options.numZoomLevels)) {
      this.options.numZoomLevels = M.config.ZOOM_LEVELS; // by default
    }

    // animated
    if (isNullOrEmpty(this.options.animated)) {
      this.options.animated = false; // by default
    }

    // styles
    this.styles = this.options.styles || '';

    // sldBody
    this.sldBody = options.sldBody;

    this.zIndex_ = ImplMap.Z_INDEX[LayerType.WMS];
  }

  /**
   * This function sets the visibility of this layer
   *
   * @function
   * @api stable
   */
  setVisible(visibility) {
    this.visibility = visibility;
    if (this.inRange() === true) {
      // if this layer is base then it hides all base layers
      if ((visibility === true) && (this.transparent !== true)) {
        // hides all base layers
        this.map.getBaseLayers()
          .filter(layer => !layer.equals(this) && layer.isVisible())
          .forEach(layer => layer.setVisible(false));

        // set this layer visible
        if (!isNullOrEmpty(this.ol3Layer)) {
          this.ol3Layer.setVisible(visibility);
        }

        // updates resolutions and keep the zoom
        const oldZoom = this.map.getZoom();
        this.map.getImpl().updateResolutionsFromBaseLayer();
        if (!isNullOrEmpty(oldZoom)) {
          this.map.setZoom(oldZoom);
        }
      } else if (!isNullOrEmpty(this.ol3Layer)) {
        this.ol3Layer.setVisible(visibility);
      }
    }
  }

  /**
   * This function indicates if the layer is queryable
   *
   * @function
   * @api stable
   * @expose
   */
  isQueryable() {
    return (this.options.queryable !== false);
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.impl.Map} map
   * @api stable
   */
  addTo(map) {
    this.map = map;

    // calculates the resolutions from scales
    if (!isNull(this.options) &&
      !isNull(this.options.minScale) && !isNull(this.options.maxScale)) {
      const units = this.map.getProjection().units;
      this.options.minResolution = getResolutionFromScale(this.options.minScale, units);
      this.options.maxResolution = getResolutionFromScale(this.options.maxScale, units);
    }

    // checks if it is a WMS_FULL
    if (isNullOrEmpty(this.name)) { // WMS_FULL (add all wms layers)
      this.addAllLayers_();
    } else {
      this.addSingleLayer_();
    }
    if (this.legendUrl_ === concatUrlPaths([M.config.THEME_URL, FacadeLayerBase.LEGEND_DEFAULT])) {
      this.legendUrl_ = addParameters(this.url, {
        SERVICE: 'WMS',
        VERSION: this.version,
        REQUEST: 'GetLegendGraphic',
        LAYER: this.name,
        FORMAT: 'image/png',
        STYLE: this.styles[0] || '',
        SLD_VERSION: '1.1.0',
      });
    }
    this.fire(EventType.ADDED_TO_MAP);
    this.facadeLayer_?.fire(EventType.ADDED_TO_MAP);
  }

  /**
   * This function sets the resolutions for this layer
   *
   * @public
   * @function
   * @param {Array<Number>} resolutions
   * @api stable
   */
  setResolutions(resolutions) {
    this.resolutions_ = resolutions;
    this.facadeLayer_.calculateMaxExtent().then((extent) => {
      if (!isNullOrEmpty(this.ol3Layer)) {
        const minResolution = this.options.minResolution;
        const maxResolution = this.options.maxResolution;
        const source = this.createOLSource_(resolutions, minResolution, maxResolution, extent);
        this.ol3Layer.setSource(source);
        this.ol3Layer.setExtent(extent);
      }
    });
  }

  /**
   * This function add this layer as unique layer
   *
   * @private
   * @function
   */
  addSingleLayer_() {
    this.facadeLayer_.calculateMaxExtent().then((extent) => {
      const minResolution = this.options.minResolution;
      const maxResolution = this.options.maxResolution;
      const opacity = this.opacity_;
      const zIndex = this.zIndex_;
      const visible = this.visibility && (this.options.visibility !== false);
      let resolutions = this.map.getResolutions();
      if (isNullOrEmpty(resolutions) && !isNullOrEmpty(this.resolutions_)) {
        resolutions = this.resolutions_;
      } else if (isNullOrEmpty(resolutions)) {
        // generates the resolution
        const zoomLevels = this.getNumZoomLevels();
        const size = this.map.getMapImpl().getSize();
        const units = this.map.getProjection().units;
        if (!isNullOrEmpty(minResolution) && !isNullOrEmpty(maxResolution)) {
          resolutions = fillResolutions(minResolution, maxResolution, zoomLevels);
        } else {
          resolutions = generateResolutionsFromExtent(extent, size, zoomLevels, units);
        }
      }
      const source = this.createOLSource_(resolutions, minResolution, maxResolution, extent);
      if (this.tiled === true) {
        this.ol3Layer = new OLLayerTile(extend({
          visible,
          source,
          extent,
          minResolution,
          maxResolution,
          opacity,
          zIndex,
        }, this.vendorOptions_, true));
      } else {
        this.ol3Layer = new OLLayerImage(extend({
          visible,
          source,
          extent,
          minResolution,
          maxResolution,
          opacity,
          zIndex,
        }, this.vendorOptions_, true));
      }
      this.map.getMapImpl().addLayer(this.ol3Layer);
      // Fire the Event LOAD.
      this.facadeLayer_.fire(EventType.LOAD);
      // sets its visibility if it is in range
      if (this.isVisible() && !this.inRange()) {
        this.setVisible(false);
      } else {
        this.setVisible(this.visibility);
      }

      // sets its z-index
      if (zIndex !== null) {
        this.setZIndex(zIndex);
      }
      // sets the resolutions
      if (this.resolutions_ !== null) {
        this.setResolutions(this.resolutions_);
      }
      // activates animation for base layers or animated parameters
      const animated = ((this.transparent === false) || (this.options.animated === true));
      this.ol3Layer.set('animated', animated);
    });
  }

  /**
   * This function creates the ol source for this instance
   *
   * @private
   * @function
   */
  createOLSource_(resolutions, minResolution, maxResolution, extent) {
    let olSource = this.vendorOptions_.source;
    if (isNullOrEmpty(this.vendorOptions_.source)) {
      const crossOrigin = this.options.crossOrigin;
      const layerParams = {
        LAYERS: this.name,
        TILED: true,
        VERSION: this.version,
        TRANSPARENT: this.transparent,
        FORMAT: 'image/png',
        STYLES: this.styles,
      };

      if (!isNullOrEmpty(this.sldBody)) {
        layerParams.SLD_BODY = this.sldBody;
      }

      if (!isNullOrEmpty(this.options.params)) {
        Object.keys(this.options.params).forEach((key) => {
          layerParams[key.toUpperCase()] = this.options.params[key];
        });
      }
      const opacity = this.opacity_;
      const zIndex = this.zIndex_;
      if (this.tiled === true) {
        const origin = getBottomLeft(extent);
        const opts = {
          url: this.url,
          tileGrid: new OLTileGrid({
            resolutions,
            extent,
            origin,
          }),
          extent,
          minResolution,
          maxResolution,
          opacity,
          zIndex,
        };
        if (!isUndefined(crossOrigin)) {
          opts.crossOrigin = crossOrigin;
        }

        opts.tileLoadFunction = this.tileLoadFunction;

        olSource = new TileWMS(opts);        
        olSource.updateParams(layerParams);
      } else {
        const opts = {
          url: this.url,
          resolutions,
          extent,
          minResolution,
          maxResolution,
          opacity,
          zIndex,
          params: {},
        };
        if (!isUndefined(crossOrigin)) {
          opts.crossOrigin = crossOrigin;
        }
        olSource = new ImageWMS(opts);
        olSource.updateParams(layerParams);
      }
    }
    return olSource;
  }

  /**
   * This function adds all layers defined int the server
   *
   * @private
   * @function
   */
  addAllLayers_() {
    this.getCapabilities().then((getCapabilities) => {
      getCapabilities.getLayers().forEach((layer) => {
        const wmsLayer = new FacadeWMS({
          url: this.url,
          name: layer.name,
          version: layer.version,
          tiled: this.tiled,
        }, this.vendorOptions_);
        this.layers.push(wmsLayer);
      });

      // if no base layers was specified then it stablishes
      // the first layer as base
      // if (this.map.getBaseLayers().length === 0) {
      //    this.layers[0].transparent = false;
      // }

      this.map.addWMS(this.layers);

      // updates the z-index of the layers
      let baseLayersIdx = this.layers.length;
      this.layers.forEach((layer) => {
        layer.setZIndex(ImplMap.Z_INDEX[LayerType.WMS] + baseLayersIdx);
        baseLayersIdx += 1;
      });
    });
  }

  /**
   * This function sets 
   * the tileLoadFunction
   *
   * @public
   * @function
   * @api stable
   */
  setTileLoadFunction(func){
    this.getOLLayer().getSource().setTileLoadFunction(func);
  }

  /**
   * Sets the url of the layer
   *
   * @public
   * @function
   * @api stable
   */
  setURL(newURL) {
    this.url = newURL;
    this.recreateOlLayer();
  }

  /**
   * Sets the name of the layer
   *
   * @public
   * @function
   * @api stable
   */
  setName(newName) {
    this.name = newName;
    this.recreateOlLayer();
  }

  /**
   * This function gets the envolved extent for
   * this WMS
   *
   * @public
   * @function
   * @api stable
   */
  getExtent() {
    const olProjection = getProj(this.map.getProjection().code);

    // creates the promise
    this.extentPromise = new Promise((success, fail) => {
      if (!isNullOrEmpty(this.extent_)) {
        this.extent_ = ImplUtils.transformExtent(this.extent_, this.extentProj_, olProjection);
        this.extentProj_ = olProjection;
        success(this.extent_);
      } else {
        this.getCapabilities().then((getCapabilities) => {
          this.extent_ = getCapabilities.getLayerExtent(this.name);
          this.extentProj_ = olProjection;
          success(this.extent_);
        });
      }
    });
    return this.extentPromise;
  }

  /**
   * This function gets the min resolution for
   * this WMS
   *
   * @public
   * @function
   * @api stable
   */
  getMinResolution() {
    return this.options.minResolution;
  }

  /**
   * This function gets the max resolution for
   * this WMS
   *
   * @public
   * @function
   * @api stable
   */
  getMaxResolution() {
    return this.options.maxResolution;
  }

  /**
   * Update minimum and maximum resolution WMS layers
   *
   * @public
   * @function
   * @param {ol.Projection} projection - Projection map
   * @api stable
   */
  updateMinMaxResolution(projection) {
    if (!isNullOrEmpty(this.options.minResolution)) {
      this.options.minResolution = getResolutionFromScale(this.options.minScale, projection.units);
      this.ol3Layer.setMinResolution(this.options.minResolution);
    }

    if (!isNullOrEmpty(this.options.maxResolution)) {
      this.options.maxResolution = getResolutionFromScale(this.options.maxScale, projection.units);
      this.ol3Layer.setMaxResolution(this.options.maxResolution);
    }
  }

  /**
   * TODO
   */
  setMaxExtent(maxExtent) {
    const minResolution = this.options.minResolution;
    const maxResolution = this.options.maxResolution;
    const olLayer = this.getOLLayer();
    if (!isNullOrEmpty(olLayer)) {
      olLayer.setExtent(maxExtent);
      if (this.tiled === true) {
        let resolutions = this.map.getResolutions();
        if (isNullOrEmpty(resolutions) && !isNullOrEmpty(this.resolutions_)) {
          resolutions = this.resolutions_;
        }
        // gets the tileGrid
        if (!isNullOrEmpty(resolutions)) {
          const source = this.createOLSource_(resolutions, minResolution, maxResolution, maxExtent);
          olLayer.setSource(source);
        }
      }
    }
  }

  /**
   * This function gets the max resolution for
   * this WMS
   *
   * @public
   * @function
   * @api stable
   */
  getNumZoomLevels() {
    return this.options.numZoomLevels;
  }

  /**
   * This function gets the layers loaded from this
   * WMS FULL
   *
   * @public
   * @function
   * @api stable
   */
  getLayers() {
    return this.layers;
  }

  /**
   * This function destroys this layer, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  getCapabilities() {
    // creates the promise
    if (isNullOrEmpty(this.getCapabilitiesPromise)) {
      const layerUrl = this.url;
      const layerVersion = this.version;
      const projection = this.map.getProjection();
      const ticket = this.map.getTicket();

      this.getCapabilitiesPromise = new Promise((success, fail) => {
        // gest the capabilities URL
        const wmsGetCapabilitiesUrl = getWMSGetCapabilitiesUrl(layerUrl, layerVersion, ticket);
        // gets the getCapabilities response
        getRemote(wmsGetCapabilitiesUrl).then((response) => {
          if ('xml' in response && !isNullOrEmpty(response.xml)) {
            const getCapabilitiesDocument = response.xml;
            const getCapabilitiesParser = new FormatWMS();
            const getCapabilities = getCapabilitiesParser.customRead(getCapabilitiesDocument);
            const getCapabilitiesUtils = new GetCapabilities(getCapabilities, layerUrl, projection);
            success(getCapabilitiesUtils);
          } else {
            getRemote(wmsGetCapabilitiesUrl, '', { ticket: false }).then((response2) => {
              const getCapabilitiesDocument = response2.xml;
              const getCapabilitiesParser = new FormatWMS();
              const getCapabilities = getCapabilitiesParser.customRead(getCapabilitiesDocument);
              const capabilities = new GetCapabilities(getCapabilities, layerUrl, projection);
              success(capabilities);
            });
          }
        });
      });
    }
    return this.getCapabilitiesPromise;
  }

  /**
   * This funcion returns the URL of the legend of GetCapabilities
   *
   * @function
   * @return {Promise} url WMS equivalen service for this layer.
   * @api
   */
  getLegendCapabilities() {
    return this.getCapabilities().then((getCapabilities) => {
      let url = '';
      let layer = getCapabilities.capabilities.Capability.Layer.Layer;
      if (layer.length > 1) {
        layer =
          layer.find(elm => elm.Name === this.name);
      } else if (layer.length === 1 && layer[0].Name !== this.name) {
        layer = layer[0].Layer.find(elm => elm.Name === this.name);
      } else {
        layer = layer[0];
      }
      if (!isUndefined(layer.Style) && !isUndefined(layer.Style[0].LegendURL) &&
        !isUndefined(layer.Style[0].LegendURL[0].OnlineResource)) {
        url = layer.Style[0].LegendURL[0].OnlineResource;
      }
      return url;
    });
  }

  /**
   * This function destroys this layer, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  getLegendURL() {
    return this.legendUrl_;
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  setLegendURL(legendUrl) {
    this.legendUrl_ = legendUrl;
  }

  /**
   * This function refreshes the state of this
   * layer
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  refresh() {
    const ol3Layer = this.getOLLayer();
    if (!isNullOrEmpty(ol3Layer)) {
      ol3Layer.getSource().updateParams({ time: Date.now() });
    }
  }

  /**
   * Removes and creates the ol3layer
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  recreateOlLayer() {
    const olMap = this.map.getMapImpl();
    if (!isNullOrEmpty(this.ol3Layer)) {
      olMap.removeLayer(this.ol3Layer);
    }
    this.addSingleLayer_();
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  getExtentFromCapabilities(capabilities) {
    const name = this.facadeLayer_.name;
    const projection = this.map.getProjection().code;
    return capabilities.getLayerExtent(name, projection);
  }

  /**
   * This function set facade class WMS
   *
   * @function
   * @param {object} obj - Facade layer
   * @api stable
   */
  setFacadeObj(obj) {
    this.facadeLayer_ = obj;
  }

  /**
   * This function returns the styles of the layer
   *
   * @public
   * @function
   * @api stable
   */
  getStyles() {
    const ol3Layer = this.getOLLayer();
    const params = ol3Layer.getSource().getParams();
    return params.STYLES;
  }

  /**
   * This function applies styles to the layer
   *
   * @public
   * @function
   * @param { string | Array } styles style name
   * @api stable
   */
  setStyles(styles) {
    const ol3Layer = this.getOLLayer();
    if (!isNullOrEmpty(ol3Layer)) {
      ol3Layer.getSource().updateParams({ STYLES: styles });
    }
  }

  /**
   * This function destroys this layer, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    const olMap = this.map.getMapImpl();
    if (!isNullOrEmpty(this.ol3Layer)) {
      olMap.removeLayer(this.ol3Layer);
      this.ol3Layer = null;
    }
    if (!isNullOrEmpty(this.layers)) {
      this.layers.map(this.map.removeLayers, this.map);
      this.layers.length = 0;
    }
    // this.map = null;
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api stable
   */
  equals(obj) {
    let equals = false;
    if (obj instanceof WMS) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
      equals = equals && (this.cql === obj.cql);
      equals = equals && (this.version === obj.version);
    }

    return equals;
  }

  /**
   * This methods returns a layer clone of this instance
   * @return {ol/layer/Tile|ol/layer/Image}
   */
  cloneOLLayer() {
    let olLayer = null;
    if (this.ol3Layer != null) {
      const properties = this.ol3Layer.getProperties();
      if (this.tiled === true) {
        olLayer = new OLLayerTile(properties);
      } else {
        olLayer = new OLLayerImage(properties);
      }
    }
    return olLayer;
  }
}

/**
 * TODO
 */
WMS.LEGEND_IMAGE = null;

export default WMS;
