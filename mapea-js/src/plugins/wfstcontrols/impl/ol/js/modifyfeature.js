/**
 * @namespace M.impl.control
 */
export default class ModifyFeature extends M.impl.Control {
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
    super();

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
    if (M.utils.isNullOrEmpty(this.modify)) {
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
    if (M.utils.isNullOrEmpty(this.modify)) {
      this.createInteractionModify_();
    }
    const olMap = this.facadeMap_.getMapImpl();
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
    const olMap = this.facadeMap_.getMapImpl();
    const layerImpl = this.layer_.getImpl();
    const olLayer = layerImpl.getOLLayer();
    let olStyle = null;
    const featureAux = olLayer.getSource().getFeatures()[0];
    if (M.utils.isUndefined(featureAux)) {
      olStyle = new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(103, 175, 19, 0.2)',
          opacity: 0.4,
        }),
        stroke: new ol.style.Stroke({
          color: '#67af13',
          width: 1,
        }),
      });
    } else {
      olStyle = olLayer.getStyle()(olLayer.getSource().getFeatures()[0])[0];
    }
    let styleImage = olStyle.getImage();
    let olStroke = olStyle.getStroke();
    const olFill = olStyle.getFill();

    if (styleImage != null) {
      olStroke = styleImage.getStroke();
    }

    const olStrokeClone = olStroke == null ? null : olStroke.clone();
    if (olStrokeClone != null) {
      olStrokeClone.setColor(M.utils.getRgba(olStroke.getColor()));
    }
    if (styleImage == null) {
      styleImage = new ol.style.Circle({
        fill: olFill || olStrokeClone,
        radius: 5,
        stroke: olStroke,
      });
    }
    const layerFeatures = new ol.Collection(olLayer.getSource().getFeatures());
    layerFeatures.forEach((feature) => {
      feature.on('change', (evt) => {
        this.currentFeature_ = evt.target;
      }, this);
    }, this);
    this.modify = new ol.interaction.Modify({
      features: layerFeatures,
      deleteCondition: (event) => {
        return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
      },
      style: new ol.style.Style({
        image: styleImage,
      }),
    });
    this.modify.on('modifyend', (evt) => {
      const featureIdx = this.modifiedFeatures.indexOf(this.currentFeature_);
      if (featureIdx >= 0) {
        this.modifiedFeatures[featureIdx] = this.currentFeature_;
      } else {
        this.modifiedFeatures.push(this.currentFeature_);
      }
      this.currentFeature_ = null;
    }, this);
    olMap.addInteraction(this.modify);

    // updates features from refresh
    this.layer_.on(M.evt.LOAD, this.updateLayerFeatures_.bind(this));
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

  /**
   * @public
   * @function
   * @api stable
   */
  setLayer(layer) {
    this.layer_ = layer;
  }
}
