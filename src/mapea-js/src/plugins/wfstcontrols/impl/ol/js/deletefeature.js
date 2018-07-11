import WFSTBase from "./wfstcontrolbase";
import ControlImpl from "impl/ol/js/controls/Controlbase";
import EventsManager from "facade/js/event/Eventsmanager";
import Utils from "facade/js/utils/Utils";

/**
 * @namespace M.impl.control
 */
export default class DeleteFeature extends ControlImpl {
  /**
   * @classdesc
   * Main constructor of the class. Creates a DeleteFeature
   * control
   *
   * @constructor
   * @param {M.layer.WFS} layer - Layer for use in control
   * @extends {ol.control.Control}
   * @api stable
   */
  constructor(layer) {

    super(layer);

    /**
     * Layer for use in control
     * @private
     * @type {ol.Feature}
     */
    this.layer_ = layer;

    /**
     * Store modified features
     * @public
     * @type {array}
     * @api stable
     */
    this.modifiedFeatures = [];

  }

  /**
   * This function active control
   *
   * @public
   * @function
   * @api stable
   */
  activate() {
    this.layer_.on(EventsManager.SELECT_FEATURES, this.removeFeature_, this);
  }

  /**
   * This function deactivate control
   *
   * @public
   * @function
   * @api stable
   */
  deactivate() {
    this.layer_.un(EventsManager.SELECT_FEATURES, this.removeFeature_, this);
  }

  /**
   * This function remove a specific feature
   *
   * @private
   * @function
   * @param {ol.Feature} features - Feature to remove
   * @param {array} evt - Select event
   */
  removeFeature_(features, evt) {
    let feature = features[0].getImpl().getOLFeature();
    let olLayer = this.layer_.getImpl().getOL3Layer();
    olLayer.getSource().removeFeature(feature);

    // prevents saving new features
    if (!Utils.isNullOrEmpty(feature.getId())) {
      this.modifiedFeatures.push(feature);
    } else {
      // removes the created feature from the drawfeature control
      let drawfeatureCtrl = this.facadeMap_.getControls('drawfeature')[0];
      if (!Utils.isNullOrEmpty(drawfeatureCtrl)) {
        let drawnFeatures = drawfeatureCtrl.getImpl().modifiedFeatures;
        let idx = drawnFeatures.indexOf(feature);
        drawnFeatures.splice(idx, 1);
      }
    }
  }
}
