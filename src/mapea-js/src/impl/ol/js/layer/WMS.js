import Utils from "facade/js/util/Utils";
import ImplMap from "../Map";
import LayerBase from "./Layer";
import LayerType from "facade/js/layer/Type";
import Config from "configuration";
import GetCapabilities from "../util/WMSCapabilities";
import FormatWMS from "../format/WMS";
import TileWMS from "../source/TileWMS";
import ImageWMS from "../source/ImageWMS";
import Remote from "facade/js/util/Remote";
import EnvolvedExtent from "../util/EnvolvedExtent";

export default class WMS extends LayerBase {
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
  constructor(options = {}) {

    // calls the super constructor
    super(options);

    /**
     * The WMS layers instances from capabilities
     * @private
     * @type {Array<M.layer.WMS>}
     */
    this.layers = [];

    /**
     * WMS layer options
     * @private
     * @type {object}
     * @expose
     */

    /**
     * WMS layer options
     * @private
     * @type {boolean}
     * @expose
     */
    this.displayInLayerSwitcher = true;

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

    /**
     * Legend URL for this layer
     * @private
     * @type {string}
     * @expose
     */
    this.legendUrl_ = null;

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
    if (Utils.isNullOrEmpty(this.tiled)) {
      this.tiled = (this.options.singleTile !== true);
    }

    // number of zoom levels
    if (Utils.isNullOrEmpty(this.options.numZoomLevels)) {
      this.options.numZoomLevels = 16; // by default
    }

    // animated
    if (Utils.isNullOrEmpty(this.options.animated)) {
      this.options.animated = false; // by default
    }

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
        if (!Utils.isNullOrEmpty(this.ol3Layer)) {
          this.ol3Layer.setVisible(visibility);
        }

        // updates resolutions and keep the bbox
        let oldBbox = this.map.getBbox();
        this.map.getImpl().updateResolutionsFromBaseLayer();
        if (!Utils.isNullOrEmpty(oldBbox)) {
          this.map.setBbox(oldBbox);
        }
      }
      else if (!Utils.isNullOrEmpty(this.ol3Layer)) {
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
    if (!Utils.isNull(this.options) && !Utils.isNull(this.options.minScale) && !Utils.isNull(this.options.maxScale)) {
      let units = this.map.getProjection().units;
      this.options.minResolution = Utils.getResolutionFromScale(this.options.minScale, units);
      this.options.maxResolution = Utils.getResolutionFromScale(this.options.maxScale, units);
    }

    // checks if it is a WMS_FULL
    if (Utils.isNullOrEmpty(this.name)) { // WMS_FULL (add all wms layers)
      this.addAllLayers_();
    }
    else { // just one WMS layer
      this.addSingleLayer_();
    }

    if (this.legendUrl_ === Utils.concatUrlPaths([Config.THEME_URL, LayerBase.LEGEND_DEFAULT])) {
      this.legendUrl_ = Utils.addParameters(this.url, {
        'SERVICE': "WMS",
        'VERSION': this.version,
        'REQUEST': "GetLegendGraphic",
        'LAYER': this.name,
        'FORMAT': "image/png",
        'EXCEPTIONS': "image/png"
      });
    }
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
    if ((this.tiled === true) && !Utils.isNullOrEmpty(this.ol3Layer)) {
      // gets the extent
      this.getMaxExtent_().then(olExtent => {
        let layerParams = {};
        let optParams = this.options.params;
        if (!Utils.isNullOrEmpty(optParams)) {
          for (let key in optParams) {
            if (optParams.hasOwnProperty(key)) {
              layerParams[key.toUpperCase()] = optParams[key];
            }
          }
          //TODO: parche para pedir todas las capas en PNG
          // layerParams.FORMAT = "image/png";
        }
        else {
          layerParams = {
            'LAYERS': this.name,
            'TILED': true,
            'VERSION': this.version,
            'TRANSPARENT': this.transparent,
            'FORMAT': 'image/png'
          };
        }


        let newSource;
        if (this.tiled === true) {
          newSource = new TileWMS({
            url: this.url,
            params: layerParams,
            tileGrid: new ol.tilegrid.TileGrid({
              resolutions: resolutions,
              extent: olExtent,
              origin: ol.extent.getBottomLeft(olExtent)
            }),
            extent: olExtent,
            minResolution: this.options.minResolution,
            maxResolution: this.options.maxResolution,
            opacity: this.opacity_,
            zIndex: this.zIndex_
          });
        }
        else {
          newSource = new ImageWMS({
            url: this.url,
            params: layerParams,
            resolutions: resolutions
          });
        }
        this.ol3Layer.setSource(newSource);
        this.ol3Layer.setExtent(olExtent);
      });
    }
  }

  /**
   * This function add this layer as unique layer
   *
   * @private
   * @function
   */
  addSingleLayer_() {
    // gets resolutions of the map
    let resolutions = this.map.getResolutions();

    // gets the extent
    this.getMaxExtent_().then(function(olExtent) {
      let tileGrid;

      if (Utils.isNullOrEmpty(resolutions) && !Utils.isNullOrEmpty(this.resolutions_)) {
        resolutions = this.resolutions_;
      }

      // gets the tileGrid
      if (!Utils.isNullOrEmpty(resolutions)) {
        tileGrid = new ol.tilegrid.TileGrid({
          resolutions: resolutions,
          extent: olExtent,
          origin: ol.extent.getBottomLeft(olExtent)
        });
      }

      let layerParams = {};
      let optParams = this.options.params;
      if (!Utils.isNullOrEmpty(optParams)) {
        for (let key in optParams) {
          if (optParams.hasOwnProperty(key)) {
            layerParams[key.toUpperCase()] = optParams[key];
          }
        }
        //TODO: parche para pedir todas las capas en PNG
        // layerParams.FORMAT = "image/png";
      }
      else {
        layerParams = {
          'LAYERS': this.name,
          'TILED': true,
          'VERSION': this.version,
          'TRANSPARENT': this.transparent,
          'FORMAT': 'image/png'
        };
      }

      if (this.tiled === true) {
        this.ol3Layer = new ol.layer.Tile({
          visible: this.visibility && (this.options.visibility !== false),
          source: new TileWMS({
            url: this.url,
            params: layerParams,
            tileGrid: tileGrid
          }),
          extent: olExtent,
          minResolution: this.options.minResolution,
          maxResolution: this.options.maxResolution,
          opacity: this.opacity_,
          zIndex: this.zIndex_
        });
      }
      else {
        this.ol3Layer = new ol.layer.Image({
          visible: this.visibility && (this.options.visibility !== false),
          source: new ImageWMS({
            url: this.url,
            params: layerParams
          }),
          extent: olExtent,
          minResolution: this.options.minResolution,
          maxResolution: this.options.maxResolution,
          opacity: this.opacity_,
          zIndex: this.zIndex_
        });
      }
      // keeps z-index values before ol resets
      let zIndex = this.zIndex_;
      this.map.getMapImpl().addLayer(this.ol3Layer);
      // sets its visibility if it is in range
      if (this.isVisible() && !this.inRange()) {
        this.setVisible(false);
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
      let animated = ((this.transparent === false) || (this.options.animated === true));
      this.ol3Layer.set("animated", animated);
    });
  }

  /**
   * This function adds all layers defined int the server
   *
   * @private
   * @function
   */
  addAllLayers_() {
    this.getCapabilities().then(getCapabilities => {
      getCapabilities.getLayers().forEach(layer => {
        let wmsLayer = new FacadeWMS({
          'url': this.url,
          'name': layer.name,
          'version': layer.version,
          'tiled': this.tiled
        }, this.options);
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
      this.layers.forEach(layer => {
        layer.setZIndex(ImplMap.Z_INDEX[LayerType.WMS] + baseLayersIdx);
        baseLayersIdx++;
      });
    });
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
    let olProjection = ol.proj.get(this.map.getProjection().code);

    // creates the promise
    this.extentPromise = new Promise((success, fail) => {
      if (!Utils.isNullOrEmpty(this.extent_)) {
        this.extent_ = ol.proj.transformExtent(this.extent_, this.extentProj_, olProjection);
        this.extentProj_ = olProjection;
        success(this.extent_);
      }
      else {
        this.getCapabilities().then(getCapabilities => {
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
    if (!Utils.isNullOrEmpty(this.options.minResolution)) {
      this.options.minResolution = Utils.getResolutionFromScale(this.options.minScale, projection.units);
      this.ol3Layer.setMinResolution(this.options.minResolution);
    }

    if (!Utils.isNullOrEmpty(this.options.maxResolution)) {
      this.options.maxResolution = Utils.getResolutionFromScale(this.options.maxScale, projection.units);
      this.ol3Layer.setMaxResolution(this.options.maxResolution);
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
    if (Utils.isNullOrEmpty(this.getCapabilitiesPromise)) {
      let layerUrl = this.url;
      let layerVersion = this.version;
      let projection = this.map.getProjection();
      this.getCapabilitiesPromise = new Promise((success, fail) => {
        // gest the capabilities URL
        let wmsGetCapabilitiesUrl = Utils.getWMSGetCapabilitiesUrl(layerUrl, layerVersion);
        // gets the getCapabilities response
        Remote.get(wmsGetCapabilitiesUrl).then(response => {
          let getCapabilitiesDocument = response.xml;
          let getCapabilitiesParser = new FormatWMS();
          let getCapabilities = getCapabilitiesParser.read(getCapabilitiesDocument);

          let getCapabilitiesUtils = new GetCapabilities(getCapabilities, layerUrl, projection);
          success(getCapabilitiesUtils);
        });
      });
    }
    return this.getCapabilitiesPromise;
  }

  /**
   * TODO
   *
   * @private
   * @function
   */
  getMaxExtent_() {
    let extent = this.map.getMaxExtent();
    return new Promise((success, fail) => {
      if (!Utils.isNullOrEmpty(extent)) {
        if (!Utils.isArray(extent)) {
          extent = [extent.x.min, extent.y.min, extent.x.max, extent.y.max];
        }
        success.call(this, extent);
      }
      else {
        EnvolvedExtent.calculate(this.map, this).then((extent) => {
          if (!Utils.isNullOrEmpty(this.map)) {
            let maxExtent = this.map.getMaxExtent();
            if (!Utils.isNullOrEmpty(maxExtent)) {
              if (!Utils.isArray(maxExtent)) {
                maxExtent = [maxExtent.x.min, maxExtent.y.min, maxExtent.x.max, maxExtent.y.max];
              }
              success.call(this, maxExtent);
            }
            else {
              success.call(this, extent);
            }
          }
        });
      }
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
    let ol3Layer = this.getOL3Layer();
    if (!Utils.isNullOrEmpty(ol3Layer)) {
      ol3Layer.getSource().changed();
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
    let olMap = this.map.getMapImpl();
    if (!Utils.isNullOrEmpty(this.ol3Layer)) {
      olMap.removeLayer(this.ol3Layer);
      this.ol3Layer = null;
    }
    if (!Utils.isNullOrEmpty(this.layers)) {
      this.layers.map(this.map.removeLayers, this.map);
      this.layers.length = 0;
    }
    this.map = null;
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
}

/**
 * TODO
 */
WMS.LEGEND_IMAGE = null;
