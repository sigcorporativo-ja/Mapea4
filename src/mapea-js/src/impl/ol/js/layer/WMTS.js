import { isNullOrEmpty, isNull, getResolutionFromScale, getWMTSGetCapabilitiesUrl } from 'facade/js/util/Utils';
import { get as getRemote } from 'facade/js/util/Remote';
import * as EventType from 'facade/js/event/eventtype';
import { get as getProj } from 'ol/proj';
import OLLayerTile from 'ol/layer/Tile';
import OLSourceWMTS from 'ol/source/WMTS';
import OLTileGridWMTS from 'ol/tilegrid/WMTS';
import { getBottomLeft } from 'ol/extent';
import OLFormatWMTSCapabilities from 'ol/format/WMTSCapabilities';
import LayerBase from './Layer';

export default class WMTS extends LayerBase {
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
  constructor(options = {}) {
    // calls the super constructor
    super(options);

    /**
     * Options from the GetCapabilities
     * @private
     * @type {M.impl.format.WMTSCapabilities}
     */
    this.capabilitiesOptions = null;
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
    // gets the projection
    const projection = getProj(this.map.getProjection().code);

    // gets the extent
    const extent = this.map.getMaxExtent();
    let olExtent;
    if (!isNullOrEmpty(extent)) {
      olExtent = [extent.x.min, extent.y.min, extent.x.max, extent.y.max];
    } else {
      olExtent = projection.getExtent();
    }

    if (!isNull(this.capabilitiesParser)) {
      // gets matrix
      const matrixSet = this.capabilitiesParser.getMatrixSet(this.name);
      const matrixIds = this.capabilitiesParser.getMatrixIds(this.name);

      // gets format
      const format = this.capabilitiesParser.getFormat(this.name);

      const newSource = new OLSourceWMTS({
        url: this.url,
        layer: this.name,
        matrixSet,
        format,
        projection,
        tileGrid: new OLTileGridWMTS({
          origin: getBottomLeft(olExtent),
          resolutions,
          matrixIds,
        }),
        extent: olExtent,
      });
      this.ol3Layer.setSource(newSource);
    } else {
      // adds layer from capabilities
      this.getCapabilities_().then((capabilitiesParser) => {
        this.capabilitiesParser = capabilitiesParser;

        // gets matrix
        const matrixSet = this.capabilitiesParser.getMatrixSet(this.name);
        const matrixIds = this.capabilitiesParser.getMatrixIds(this.name);

        // gets format
        const format = this.capabilitiesParser.getFormat(this.name);

        const newSource = new OLSourceWMTS({
          url: this.url,
          layer: this.name,
          matrixSet,
          format,
          projection,
          tileGrid: new OLTileGridWMTS({
            origin: getBottomLeft(olExtent),
            resolutions,
            matrixIds,
          }),
          extent: olExtent,
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

        // updates resolutions and keep the bbox
        const oldBbox = this.map.getBbox();
        this.map.getImpl().updateResolutionsFromBaseLayer();
        if (!isNullOrEmpty(oldBbox)) {
          this.map.setBbox(oldBbox);
        }
      } else if (!isNullOrEmpty(this.ol3Layer)) {
        this.ol3Layer.setVisible(visibility);
      }
    }
  }

  /**
   * This function add this layer as unique layer
   *
   * @private
   * @function
   */
  addLayer_(capabilitiesOptions) {
    // gets resolutions from defined min/max resolutions
    const capabilitiesOptionsVariable = capabilitiesOptions;
    const minResolution = this.options.minResolution;
    const maxResolution = this.options.maxResolution;
    capabilitiesOptionsVariable.format = this.options.format || capabilitiesOptions.format;

    this.ol3Layer = new OLLayerTile({
      visible: this.options.visibility,
      source: new OLSourceWMTS(capabilitiesOptionsVariable),
      minResolution,
      maxResolution,
    });

    // keeps z-index values before ol resets
    const zIndex = this.zIndex_;
    this.map.getMapImpl().addLayer(this.ol3Layer);

    // sets its z-index
    if (zIndex !== null) {
      this.setZIndex(zIndex);
    }

    // activates animation always for WMTS layers
    this.ol3Layer.set('animated', true);

    this.fire(EventType.ADDED_TO_MAP, this);
  }

  /**
   * This function gets the capabilities
   * of the WMTS service
   *
   * @private
   * @function
   */
  getCapabilitiesOptions_() {
    // name
    const layerName = this.name;
    // matrix set
    let matrixSet = this.matrixSet;
    if (isNullOrEmpty(matrixSet)) {
      /* if no matrix set was specified then
         it supposes the matrix set has the name
         of the projection
         */
      matrixSet = this.map.getProjection().code;
    }
    return this.getCapabilities().then((parsedCapabilities) => {
      return OLSourceWMTS.optionsFromCapabilities(parsedCapabilities, {
        layer: layerName,
        matrixSet,
      });
    });
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  getCapabilities() {
    const getCapabilitiesUrl = getWMTSGetCapabilitiesUrl(this.url);
    const parser = new OLFormatWMTSCapabilities();
    return new Promise((success, fail) => {
      getRemote(getCapabilitiesUrl).then((response) => {
        const getCapabilitiesDocument = response.xml;
        const parsedCapabilities = parser.read(getCapabilitiesDocument);
        success.call(this, parsedCapabilities);
      });
    });
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
}
