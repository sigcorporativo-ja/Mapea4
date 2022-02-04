/**
 * @module M/impl/Layer
 */
import { isNullOrEmpty, concatUrlPaths, getResolutionFromScale, getScaleFromResolution } from 'M/util/Utils';
import MObject from 'M/Object';
import FacadeLayer from 'M/layer/Layer';
/**
 * @classdesc
 * @api
 */
class LayerBase extends MObject {
  /**
   * @classdesc
   * Main constructor of the class. Creates a layer
   * with parameters specified by the user
   *
   * @interface
   * @extends {M.Object}
   * @param {Object} options options provided by the user
   * @param {Object} vendorOptions vendor options for the base library
   * @api stable
   */
  constructor(options = {}, vendorOptions = {}) {
    // calls the super constructor
    super(options);

    /**
     * Vendor options for the base library
     * @private
     * @type {Object}
     */
    this.vendorOptions_ = vendorOptions;

    /**
     * The map instance
     * @private
     * @type {M.Map}
     * @expose
     */
    this.map = null;

    /**
     * The ol3 layer instance
     * @private
     * @type {ol.layer.Vector}
     * @expose
     */
    this.ol3Layer = null;

    /**
     * Custom options for this layer
     * @private
     * @type {Mx.parameters.LayerOptions}
     * @expose
     */
    this.options = options;

    /**
     * Indicates the visibility of the layer
     * @private
     * @type {Boolean}
     * @expose
     */
    this.visibility = this.options.visibility !== false;

    /**
     * Indicates if the layer is displayed in
     * layerswitcher control
     * @private
     * @type {Boolean}
     * @expose
     */
    this.displayInLayerSwitcher = this.options.displayInLayerSwitcher !== false;

    /**
     * Layer z-index
     * @private
     * @type {Number}
     * @expose
     */
    this.zIndex_ = null;

    /**
     * Layer min-scale
     * @private
     * @type {number}
     * @expose
     */
    this.minScale_ = null;

    /**
     * Layer max-scale
     * @private
     * @type {number}
     * @expose
     */
    this.maxScale_ = null;

    /**
     * Layer opacity
     * @private
     * @type {Number}
     * @expose
     */
    this.opacity_ = this.options.opacity || 1;

    /**
     * Legend URL of this layer
     * @private
     * @type {String}
     * @expose
     */
    this.legendUrl_ = concatUrlPaths([M.config.THEME_URL, FacadeLayer.LEGEND_DEFAULT]);
  }

  /**
   * This function indicates if the layer is visible
   *
   * @function
   * @api stable
   * @expose
   */
  isVisible() {
    let visible = false;
    if (!isNullOrEmpty(this.ol3Layer)) {
      visible = this.ol3Layer.getVisible();
    } else {
      visible = this.visibility;
    }
    return visible;
  }

  /**
   * This function indicates if the layer is queryable
   *
   * @function
   * @api stable
   * @expose
   *
   */
  isQueryable() {
    return false;
  }

  /**
   * This function indicates if the layer is in range
   *
   * @function
   * @api stable
   * @expose
   */
  inRange() {
    let inRange = false;
    if (!isNullOrEmpty(this.ol3Layer)) {
      const resolution = this.map.getMapImpl().getView().getResolution();
      const maxResolution = this.ol3Layer.getMaxResolution();
      const minResolution = this.ol3Layer.getMinResolution();

      inRange = ((resolution >= minResolution) && (resolution <= maxResolution));
    }
    return inRange;
  }

  /**
   * This function sets the visibility of this layer
   *
   * @function
   * @api stable
   * @expose
   */
  setVisible(visibility) {
    this.visibility = visibility;

    if (!isNullOrEmpty(this.ol3Layer)) {
      this.ol3Layer.setVisible(visibility);
    }
  }

  /**
   * This function sets the visibility of this layer
   *
   * @function
   * @api stable
   * @expose
   */
  getZIndex() {
    if (!isNullOrEmpty(this.getOLLayer())) {
      this.zIndex_ = this.getOLLayer().getZIndex();
    }
    return this.zIndex_;
  }

  /**
   * This function sets the visibility of this layer
   *
   * @function
   * @api stable
   * @expose
   */
  setZIndex(zIndex) {
    this.zIndex_ = zIndex;
    if (!isNullOrEmpty(this.getOLLayer())) {
      this.getOLLayer().setZIndex(zIndex);
    }
  }

  /**
   * This function gets the min-scale for this layer
   *
   * @function
   * @api
   */
  getMinScale() {
    const units = this.map.getProjection().units;
    if (!isNullOrEmpty(this.getOLLayer()) && !isNullOrEmpty(units)) {
      this.minScale_ = getScaleFromResolution(this.getOLLayer().getMinResolution(), units);
    }
    return this.minScale_;
  }

  /**
   * This function sets the min-scale for this layer
   *
   * @function
   * @api
   */
  setMinScale(minScale) {
    this.minScale_ = minScale;
    const units = this.map.getProjection().units;
    const minResolution = getResolutionFromScale(minScale, units);
    if (!isNullOrEmpty(this.getOLLayer()) && !isNullOrEmpty(minResolution) &&
      !isNullOrEmpty(units)) {
      this.getOLLayer().setMinResolution(minResolution);
    }
  }
  /**
   * This function gets the max-scale for this layer
   *
   * @function
   * @api
   */
  getMaxScale() {
    const units = this.map.getProjection().units;
    if (!isNullOrEmpty(this.getOLLayer()) && !isNullOrEmpty(units)) {
      this.maxScale_ = getScaleFromResolution(this.getOLLayer().getMaxResolution(), units);
    }
    return this.maxScale_;
  }

  /**
   * This function sets the max-scale for this layer
   *
   * @function
   * @api
   */
  setMaxScale(maxScale) {
    this.maxScale_ = maxScale;
    const units = this.map.getProjection().units;
    const maxResolution = getResolutionFromScale(maxScale, units);
    if (!isNullOrEmpty(this.getOLLayer()) && !isNullOrEmpty(maxResolution) &&
      !isNullOrEmpty(units)) {
      this.getOLLayer().setMaxResolution(maxResolution);
    }
  }

  /**
   * This function sets the visibility of this layer
   *
   * @function
   * @api stable
   * @expose
   */
  getOpacity() {
    if (!isNullOrEmpty(this.getOLLayer())) {
      this.opacity_ = this.getOLLayer().getOpacity();
    }
    return this.opacity_;
  }

  /**
   * This function sets the visibility of this layer
   *
   * @function
   * @api stable
   * @expose
   */
  setOpacity(opacity) {
    this.opacity_ = opacity;
    if (!isNullOrEmpty(this.getOLLayer())) {
      this.getOLLayer().setOpacity(opacity);
    }
  }

  /**
   * This function gets the created OL layer
   *
   * @function
   * @api stable
   * @expose
   * @deprecated
   */
  getOL3Layer() {
    return this.ol3Layer;
  }

  /**
   * This function gets the created OL layer
   *
   * @function
   * @api stable
   * @expose
   */
  getOLLayer() {
    return this.ol3Layer;
  }

  /**
   * This function sets the OL layer
   *
   * @function
   * @api stable
   * @expose
   * @deprecated
   */
  setOL3Layer(layer) {
    const olMap = this.map.getMapImpl();
    olMap.removeLayer(this.ol3Layer);
    this.ol3Layer = layer;
    olMap.addLayer(layer);
    return this;
  }

  /**
   * This function sets the OL layer
   *
   * @function
   * @api stable
   * @expose
   */
  setOLLayer(layer) {
    const olMap = this.map.getMapImpl();
    olMap.removeLayer(this.ol3Layer);
    this.ol3Layer = layer;
    olMap.addLayer(layer);
    return this;
  }

  /**
   * This function gets the created OL layer
   *
   * @function
   * @api stable
   * @expose
   */
  getMap() {
    return this.map;
  }

  /**
   * This function gets the created OL layer
   *
   * @function
   * @api stable
   * @expose
   */
  getLegendURL() {
    return this.legendUrl_;
  }

  /**
   * This function gets the created OL layer
   *
   * @function
   * @api stable
   * @expose
   */
  setLegendURL(legendUrl) {
    this.legendUrl_ = legendUrl;
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
    return 16; // 16 zoom levels by default
  }

  /**
   * This function exectues an unselect feature
   *
   * @public
   * @function
   * @api stable
   * @expose
   */
  unselectFeatures(features, coord, evt) {}

  /**
   * This function exectues a select feature
   *
   * @function
   * @api stable
   * @expose
   */
  selectFeatures(features, coord, evt) {}
}

export default LayerBase;
