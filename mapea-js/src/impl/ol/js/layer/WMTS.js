/**
 * @module M/impl/layer/WMTS
 */
import {
  isNullOrEmpty,
  isNull,
  getResolutionFromScale,
  getWMTSGetCapabilitiesUrl,
  extend,
  addParameters,
} from 'M/util/Utils';
import { default as OLSourceWMTS } from 'ol/source/WMTS';
import OLFormatWMTSCapabilities from 'ol/format/WMTSCapabilities';
import OLTileGridWMTS from 'ol/tilegrid/WMTS';
import { getBottomLeft } from 'ol/extent';
import { get as getRemote } from 'M/util/Remote';
import * as EventType from 'M/event/eventtype';
import { get as getProj } from 'ol/proj';
import OLLayerTile from 'ol/layer/Tile';
import { optionsFromCapabilities } from 'patches';
import LayerBase from './Layer';
/**
 * @classdesc
 * @api
 */
class WMTS extends LayerBase {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WMTS layer
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
     * Options from the GetCapabilities
     * @private
     * @type {Prosmie}
     */
    this.capabilitiesOptionsPromise = null;

    /**
     * Options from the GetCapabilities
     * @private
     * @type {Promise}
     */
    this.getCapabilitiesPromise_ = null;
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
    this.fire(EventType.ADDED_TO_MAP);

    // calculates the resolutions from scales
    if (!isNull(this.options) &&
      !isNull(this.options.minScale) && !isNull(this.options.maxScale)) {
      const units = this.map.getMapImpl().getView().getProjection().getUnits();
      this.options.minResolution = getResolutionFromScale(this.options.minScale, units);
      this.options.maxResolution = getResolutionFromScale(this.options.maxScale, units);
    }

    // adds layer from capabilities
    this.getCapabilitiesOptions_()
      .then(capabilitiesOptions => this.addLayer_(capabilitiesOptions));
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
    if (isNullOrEmpty(this.vendorOptions_.source)) {
      const extent = this.facadeLayer_.getMaxExtent();
      const projection = getProj(this.map.getProjection().code);
      this.getCapabilities().then((capabilities) => {
        // gets matrix
        const matrixSet = capabilities.getMatrixSet(this.name);
        const matrixIds = capabilities.getMatrixIds(this.name);

        // gets format
        const format = capabilities.getFormat(this.name);

        const newSource = new OLSourceWMTS({
          url: this.url,
          layer: this.name,
          matrixSet,
          format,
          projection,
          tileGrid: new OLTileGridWMTS({
            origin: getBottomLeft(extent),
            resolutions,
            matrixIds,
          }),
          extent,
        });
        this.ol3Layer.setSource(newSource);
      });
    }
  }

  /**
   * This function sets the visibility of this layer
   *
   * @function
   * @api stable
   */
  setVisible(visibility) {
    this.visibility = visibility;
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

      // updates resolutions and keep the bbox
      const oldBbox = this.map.getBbox();
      if (!isNullOrEmpty(oldBbox)) {
        this.map.setBbox(oldBbox, { nearest: true });
      }
    } else if (!isNullOrEmpty(this.ol3Layer)) {
      this.ol3Layer.setVisible(visibility);
    }
  }

  /**
   * This function add this layer as unique layer
   *
   * @private
   * @function
   */
  addLayer_(capabilitiesOptions) {
    const extent = this.facadeLayer_.getMaxExtent();
    // gets resolutions from defined min/max resolutions
    const capabilitiesOptionsVariable = capabilitiesOptions;
    const minResolution = this.options.minResolution;
    const maxResolution = this.options.maxResolution;
    capabilitiesOptionsVariable.format = this.options.format || capabilitiesOptions.format;

    const wmtsSource = new OLSourceWMTS(extend(capabilitiesOptionsVariable, {
      // tileGrid: new OLTileGridWMTS({
      //   origin: getBottomLeft(extent),
      //   resolutions,
      //   matrixIds,
      // }),
      extent,
    }, true));

    this.ol3Layer = new OLLayerTile(extend({
      visible: this.options.visibility,
      source: wmtsSource,
      minResolution,
      maxResolution,
    }, this.vendorOptions_, true));

    // keeps z-index values before ol resets
    const zIndex = this.zIndex_;
    this.map.getMapImpl().addLayer(this.ol3Layer);

    // sets its z-index
    if (zIndex !== null) {
      this.setZIndex(zIndex);
    }

    this.setVisible(this.visibility);


    // activates animation always for WMTS layers
    this.ol3Layer.set('animated', true);

    this.fire(EventType.ADDED_TO_MAP, this);
  }

  /**
   * TODO
   */
  setMaxExtent(maxExtent) {
    this.getOL3Layer().setExtent(maxExtent);
  }


  /**
   * This function gets the capabilities
   * of the WMTS service
   *
   * @private
   * @function
   */
  getCapabilitiesOptions_() {
    if (isNullOrEmpty(this.capabilitiesOptionsPromise)) {
      this.capabilitiesOptionsPromise = this.getCapabilities().then((capabilities) => {
        const layerName = this.name;
        let matrixSet = this.matrixSet;
        if (isNullOrEmpty(matrixSet)) {
          /* if no matrix set was specified then
          it supposes the matrix set has the name
          of the projection
          */
          matrixSet = this.map.getProjection().code;
        }
        const extent = this.facadeLayer_.getMaxExtent();
        const capabilitiesOpts = optionsFromCapabilities(capabilities, {
          layer: layerName,
          matrixSet,
          extent,
        });
        capabilitiesOpts.tileGrid.extent = extent;
        return capabilitiesOpts;
      });
    }
    return this.capabilitiesOptionsPromise;
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  getCapabilities() {
    if (isNullOrEmpty(this.getCapabilitiesPromise_)) {
      this.getCapabilitiesPromise_ = new Promise((success, fail) => {
        const getCapabilitiesUrl = getWMTSGetCapabilitiesUrl(this.url);
        const parser = new OLFormatWMTSCapabilities();
        getRemote(getCapabilitiesUrl).then((response) => {
          const getCapabilitiesDocument = response.xml;
          const parsedCapabilities = parser.read(getCapabilitiesDocument);
          success.call(this, parsedCapabilities);
        });
      });
    }
    return this.getCapabilitiesPromise_;
  }

  /**
   * This function gets the min resolution for
   * this WMTS
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
   * this WMTS
   *
   * @public
   * @function
   * @api stable
   */
  getMaxResolution() {
    return this.options.maxResolution;
  }

  /**
   * This function set facade class WMTS
   *
   * @function
   * @param {object} obj - Facade layer
   * @api stable
   */
  setFacadeObj(obj) {
    this.facadeLayer_ = obj;
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

    if (obj instanceof WMTS) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
      equals = equals && (this.matrixSet === obj.matrixSet);
    }

    return equals;
  }

  /**
   * @function
   * @public
   * @api
   */
  getGetFeatureInfoUrl(coordinate, zoom, formatInfo) {
    const tcr = this.getTileColTileRow(coordinate, zoom);
    const coordPxl = this.getRelativeTileCoordInPixel_(coordinate, zoom);
    const service = 'WMTS';
    const request = 'GetFeatureInfo';
    const version = '1.0.0';
    const layer = this.name;
    const style = 'default';
    const format = 'image/jpeg';
    const tilematrixset = this.matrixSet;
    const tilematrix = zoom;
    const infoFormat = formatInfo;
    const tilecol = tcr[0];
    const tilerow = tcr[1];
    const I = coordPxl[0];
    const J = coordPxl[1];
    const url = addParameters(this.url, {
      service,
      request,
      version,
      layer,
      style,
      format,
      tilematrixset,
      tilematrix,
      tilerow,
      tilecol,
      J,
      I,
      infoFormat,
    });
    return url;
  }

  /**
   * @function
   * @public
   * @api
   */
  getTileColTileRow(coordinate, zoom) {
    let tcr = null;
    if (!isNullOrEmpty(this.ol3Layer)) {
      const source = this.ol3Layer.getSource();
      if (!isNullOrEmpty(source)) {
        const { tileGrid } = source;
        tcr = tileGrid.getTileCoordForCoordAndZ(coordinate, zoom);
        tcr[2] = -tcr[2] - 1;
      }
    }
    return tcr.slice(1);
  }

  /**
   * @function
   * @private
   */
  getRelativeTileCoordInPixel_(coordinate, zoom) {
    let coordPixel;
    if (!isNullOrEmpty(this.ol3Layer)) {
      const source = this.ol3Layer.getSource();
      if (!isNullOrEmpty(source)) {
        const { tileGrid } = source;
        const tileCoord = tileGrid.getTileCoordForCoordAndZ(coordinate, zoom);
        const tileExtent = tileGrid.getTileCoordExtent(tileCoord, []);
        const tileResolution = tileGrid.getResolution(tileCoord[0]);
        const x = Math.floor((coordinate[0] - tileExtent[0]) / tileResolution);
        const y = Math.floor((tileExtent[3] - coordinate[1]) / tileResolution);
        coordPixel = [x, y];
      }
    }
    return coordPixel;
  }
}

export default WMTS;
