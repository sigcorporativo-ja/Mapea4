import Utils from "facade/js/util/Utils";
import Config from "configuration";
import Object from "facade/js/Object";

export default class LayerBase extends Object {
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
    this.legendUrl_ = Utils.concatUrlPaths([Config.THEME_URL, LayerBase.LEGEND_DEFAULT]);

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
    if (!Utils.isNullOrEmpty(this.ol3Layer)) {
      visible = this.ol3Layer.getVisible();
    }
    else {
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
    if (!Utils.isNullOrEmpty(this.ol3Layer)) {
      let resolution = this.map.getMapImpl().getView().getResolution();
      let maxResolution = this.ol3Layer.getMaxResolution();
      let minResolution = this.ol3Layer.getMinResolution();

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

    if (!Utils.isNullOrEmpty(this.ol3Layer)) {
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
    if (!Utils.isNullOrEmpty(this.getOL3Layer())) {
      this.zIndex_ = this.getOL3Layer().getZIndex();
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
    if (!Utils.isNullOrEmpty(this.getOL3Layer())) {
      this.getOL3Layer().setZIndex(zIndex);
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
    if (!Utils.isNullOrEmpty(this.getOL3Layer())) {
      this.opacity_ = this.getOL3Layer().getOpacity();
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
    if (!Utils.isNullOrEmpty(this.getOL3Layer())) {
      this.getOL3Layer().setOpacity(opacity);
    }
  }

  /**
   * This function gets the created OL layer
   *
   * @function
   * @api stable
   * @expose
   */
  getOL3Layer() {
    return this.ol3Layer;
  }

  /**
   * This function sets the OL layer
   *
   * @function
   * @api stable
   * @expose
   */
  setOL3Layer(layer) {
    let olMap = this.map.getMapImpl();
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
  setOL3Layer(layer) {
    let olMap = this.map.getMapImpl();
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
