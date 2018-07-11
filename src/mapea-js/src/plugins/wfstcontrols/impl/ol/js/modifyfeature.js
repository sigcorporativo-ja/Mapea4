import EventsManager from "facade/js/event/Eventsmanager";
import Utils from "facade/js/utils/Utils";
import ControlImpl from "impl/ol/js/controls/Controlbase";

/**
 * @namespace M.impl.control
 */
export default class ModifyFeature extends ControlImpl {
  /**
   * @classdesc
   * Main constructor of the class. Creates a ModifyFeature
   * control
   *
   * @constructor
   * @param {M.layer.WFS} layer - Layer for use in control
   * @extends {M.impl.Control}
   * @api stable
   */
  constructor(layer) {
    /**
     * Layer for use in control
     * @private
     * @type {M.layer.WFS}
     */
    this.layer_ = layer;
    /**
     * Interaction modify
     * @public
     * @type {ol.interaction.Modify}
     * @api stable
     */
    this.modify = null;
    /**
     * Store modified features
     * @public
     * @type {array}
     * @api stable
     */
    this.modifiedFeatures = [];
    /**
     * Current feature
     * @public
     * @type {array}
     */
    this.currentFeature_ = null;
  }

  /**
   * This function active control
   *
   * @public
   * @function
   * @api stable
   */
  activate() {
    if (Utils.isNullOrEmpty(this.modify)) {
      this.createInteractionModify_();
    }
    this.modify.setActive(true);
  }

  /**
   * This function deactivate control
   *
   * @public
   * @function
   * @api stable
   */
  deactivate() {
    if (Utils.isNullOrEmpty(this.modify)) {
      this.createInteractionModify_();
    }
    let olMap = this.facadeMap_.getMapImpl();
    olMap.removeInteraction(this.modify);
    this.modify = null;
  }

  /**
   * This function creates the interaction to modify
   *
   * @private
   * @function
   */
  createInteractionModify_() {
    let olMap = this.facadeMap_.getMapImpl();
    let layerImpl = this.layer_.getImpl();
    let olLayer = layerImpl.getOL3Layer();
    let olStyle = olLayer.getStyle()()[0];
    let styleImage = olStyle.getImage();
    let [olFill, olStroke] = [olStyle.getFill(), olStyle.getStroke()];

    if (styleImage != null) {
      olStroke = styleImage.getStroke();
    }

    let olStrokeClone = olStroke == null ? null : olStroke.clone();
    if (olStrokeClone != null) {
      olStrokeClone.setColor(Utils.getRgba(olStroke.getColor()));
    }
    if (styleImage == null) {
      styleImage = new ol.style.Circle({
        fill: olFill || olStrokeClone,
        radius: 5,
        stroke: olStroke
      });
    }
    let layerFeatures = new ol.Collection(olLayer.getSource().getFeatures());
    layerFeatures.forEach(feature => {
      feature.on('change', evt => {
        this.currentFeature_ = evt.target;
      }, this);
    }, this);
    this.modify = new ol.interaction.Modify({
      features: layerFeatures,
      deleteCondition: function (event) {
        return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
      },
      style: new ol.style.Style({
        image: styleImage,
      })
    });
    this.modify.on('modifyend', evt => {
      let featureIdx = this.modifiedFeatures.indexOf(this.currentFeature_);
      if (featureIdx >= 0) {
        this.modifiedFeatures[featureIdx] = this.currentFeature_;
      } else {
        this.modifiedFeatures.push(this.currentFeature_);
      }
      this.currentFeature_ = null;
    }, this);
    olMap.addInteraction(this.modify);

    // updates features from refresh
    this.layer_.on(EventsManager.LOAD, this.updateLayerFeatures_, this);
  }

  /**
   * This function remove unsaved changes
   *
   * @private
   * @function
   */
  updateLayerFeatures_() {
    this.facadeMap_.getMapImpl().removeInteraction(this.modify);
    this.modify = null;
  }

  /**
   * This function destroys this control and cleaning the HTML
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.facadeMap_.getMapImpl().removeControl(this);
    this.layer_ = null;
    this.modify = null;
    this.modifiedFeatures = [];
  }
}
