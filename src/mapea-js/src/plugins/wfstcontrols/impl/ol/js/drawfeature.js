import WFSTBase from "./wfstcontrolbase";

/**
 * @namespace M.impl.control
 */
export default class DrawFeature extends WFSTBase {
  /**
   * @classdesc
   * Main constructor of the class. Creates a DrawFeature
   * control
   *
   * @constructor
   * @param {M.layer.WFS} layer - Layer for use in control
   * @extends {M.impl.control.WFSTBase}
   * @api stable
   */
  constructor(layer) {
    super(layer);
  }
  /**
   * This function creates the interaction to draw
   *
   * @private
   * @function
   * @api stable
   */
  createInteraction_() {
    let layerImpl = this.layer_.getImpl();
    let olLayer = layerImpl.getOL3Layer();
    let olStyle = olLayer.getStyle()()[0];
    let [olFill, olStroke] = [olStyle.getFill(), olStyle.getStroke()];
    let image = new ol.style.Circle({
      fill: olFill || olStroke,
      radius: 5,
      stroke: olStroke
    });
    if (olStyle.getImage()) {
      image = olStyle.getImage();
    }
    this.interaction_ = new ol.interaction.Draw({
      'source': olLayer.getSource(),
      'type': M.geom.parseWFS(this.layer_.geometry),
      'style': new ol.style.Style({
        image: image,
        fill: olFill,
        stroke: olStroke || new ol.style.Stroke({
          fill: {
            color: '#000'
          }
        }),
      }),
    });

    this.interaction_.on('drawend', (event) => {
      let feature = event.feature;
      this.modifiedFeatures.push(feature);
    }, this);

    // updates features from refresh
    this.layer_.on(M.evt.LOAD, this.updateLayerFeatures_, this);
  }

  /**
   * This function remove unsaved changes
   *
   * @private
   * @function
   */
  updateLayerFeatures_() {
    this.facadeMap_.getMapImpl().removeInteraction(this.interaction_);
    this.interaction_ = null;
  }

  /**
   * This function deactivate control
   *
   * @public
   * @function
   * @api stable
   */
  deactivate() {
    if (M.utils.isNullOrEmpty(this.interaction_)) {
      this.createInteraction_();
    }
    let olMap = this.facadeMap_.getMapImpl();
    olMap.removeInteraction(this.interaction_);
    this.interaction_ = null;
  }
}
