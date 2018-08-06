import MObject from 'facade/js/Object';
import { isNullOrEmpty, concatUrlPaths } from 'facade/js/util/Utils';
import Config from 'Configuration';
import FacadeLayer from 'facade/js/layer/Layer';

export default class Layer extends MObject {
  /**
   * @classdesc
   * Main constructor of the class. Creates a layer
   * with parameters specified by the user
   *
   * @interface
   * @extends {M.facade.Base}
   * @param {string | Mx.parameters.Layer} userParameters parameters
   * provided by the user
   * @api stable
   */
  constructor(options = {}) {
    // calls the super constructor
    super();

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
     * @type {L.Layer}
     * @expose
     */
    this.leafletLayer = null;

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
    this.visibility = (this.options.visibility !== false);

    /**
     * Indicates if the layer is displayed in
     * layerswitcher control
     * @private
     * @type {Boolean}
     * @expose
     */
    this.displayInLayerSwitcher = (this.options.displayInLayerSwitcher !== false);

    /**
     * Layer opacity
     * @private
     * @type {Number}
     * @expose
     */
    this.opacity_ = (this.options.opacity || 1);
  }

  /**
   * This function indicates if the layer is visible
   *
   * @function
   * @api stable
   * @expose
   */
  isVisible() {
    return this.map.getMapImpl().hasLayer(this.leafletLayer);
  }

  /**
   * This function indicates if the layer is queryable
   *
   * @function
   * @api stable
   * @expose
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
    // TODO
    return true;
  }

  /**
   * This function sets the visibility of this layer
   *
   * @function
   * @api stable
   * @expose
   */
  setVisible(visibility) {
    if (!isNullOrEmpty(this.leafletLayer)) {
      const lMap = this.map.getMapImpl();
      if ((visibility === true) && !lMap.hasLayer(this.leafletLayer)) {
        lMap.addLayer(this.leafletLayer);
      } else if ((visibility !== true) && lMap.hasLayer(this.leafletLayer)) {
        lMap.removeLayer(this.leafletLayer);
      }
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
    if (!isNullOrEmpty(this.leafletLayer)) {
      this.zIndex_ = this.leafletLayer.zIndex;
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
    if (!isNullOrEmpty(this.leafletLayer)) {
      this.leafletLayer.setZIndex(this.zIndex_);
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
    if (!isNullOrEmpty(this.leafletLayer)) {
      this.opacity_ = this.leafletLayer.opacity;
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
    if (!isNullOrEmpty(this.leafletLayer)) {
      this.leafletLayer.setOpacity(opacity);
    }
  }

  /**
   * This function gets the created OL layer
   *
   * @function
   * @api stable
   * @expose
   */
  getLegendURL() {
    return concatUrlPaths([Config.THEME_URL, FacadeLayer.LEGEND_DEFAULT]);
  }

  /**
   * This function gets the created OL layer
   *
   * @function
   * @api stable
   * @expose
   */
  setLegendURL(legendUrl) {}

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
  unselectFeatures(features, coord) {}

  /**
   * This function exectues a select feature
   *
   * @function
   * @api stable
   * @expose
   */
  selectFeatures(features, coord) {}
}
