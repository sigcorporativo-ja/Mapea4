import Style from "./style";
import Heatmap from "../layers/heatmap";
import Utils from "../utils/utils";

export default class HeatMap extends Style {
  /**
   * @classdesc
   * Main constructor of the class. Creates a Heatmap
   * control
   *
   * @constructor
   * @param {Object} options - config options of user
   * @api stable
   */
  constructor(attribute, options, vendorOptions) {

    super({});

    /**
     * @private
     * @type {ol.layer.Heatmap}
     */
    this.heatmapLayer_ = null;
    /**
     * @private
     * @type {string}
     */
    this.attribute_ = attribute;

    /**
     * @private
     * @type {object}
     */
    this.opt_options_ = Utils.extends(options, vendorOptions);

    this.opt_options_.zIndex = 999999;
    /**
     * @private
     * @type {ol.layer.Vector}
     *
     */
    this.oldOLLayer_ = null;

  }

  /**
   * This function apply the style to specified layer
   * @function
   * @public
   * @param{M.layer.Vector}
   * @api stable
   */
  applyToLayer(layer) {
    this.layer_ = layer;
    if (!Utils.isNullOrEmpty(layer)) {
      let ol3Layer = this.layer_.getImpl().getOL3Layer();
      if (!(ol3Layer instanceof ol.layer.Heatmap)) {
        this.oldOLLayer_ = ol3Layer;
      }
      let features = this.layer_.getFeatures();
      let olFeatures = features.map(f => f.getImpl().getOLFeature());
      olFeatures.forEach(f => f.setStyle(null));
      this.createHeatmapLayer_(olFeatures);
      this.layer_.getImpl().setOL3Layer(this.heatmapLayer_);
    }
  }

  /**
   * This function remove the style to specified layer
   * @function
   * @public
   * @api stable
   */
  unapply(layer) {
    if (!Utils.isNullOrEmpty(this.oldOLLayer_)) {
      this.layer_.getImpl().setOL3Layer(this.oldOLLayer_);
      this.layer_.redraw();
      this.layer_ = null;
      this.oldOLLayer_ = null;
      this.heatmapLayer_ = null;
    }
  }

  /**
   * This function creates a heatmap layer
   * @function
   * @private
   * @api stable
   */
  createHeatmapLayer_(olFeatures) {
    this.opt_options_.source = new ol.source.Vector({
      features: olFeatures,
    });
    this.heatmapLayer_ = new Heatmap(this.opt_options_);
  }

  /**
   * This function
   * @public
   * @param {object} options_
   * @param {object} vendorOptions
   * @function
   */
  setOptions(options, vendorOptions) {
    this.opt_options_ = Utils.extends(options, vendorOptions);
  }

  /**
   * This function
   * @public
   * @function
   * @return {number}
   */
  getMinWeight() {
    return this.heatmapLayer_.getMinWeight();
  }

  /**
   * This function
   * @public
   * @function
   * @return {number}
   */
  getMaxWeight() {
    return this.heatmapLayer_.getMaxWeight();
  }
}
