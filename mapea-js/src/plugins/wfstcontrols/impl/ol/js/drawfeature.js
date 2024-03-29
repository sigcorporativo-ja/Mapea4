import WFSTBase from './wfstcontrolbase';

/**
 * @namespace M.impl.control
 */
export default class DrawFeature extends WFSTBase {
  /**
   * This function creates the interaction to draw
   *
   * @private
   * @function
   * @api stable
   */
  createInteraction_() {
    const layerImpl = this.layer_.getImpl();
    const olLayer = layerImpl.getOLLayer();
    const featureAux = olLayer.getSource().getFeatures()[0];
    let olStyle = null;
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
    const [olFill, olStroke] = [olStyle.getFill(), olStyle.getStroke()];
    let image = new ol.style.Circle({
      fill: olFill || olStroke,
      radius: 5,
      stroke: olStroke,
    });
    if (olStyle.getImage()) {
      image = olStyle.getImage();
    }
    this.interaction_ = new ol.interaction.Draw({
      source: olLayer.getSource(),
      type: M.geom.parseWFS(this.layer_.geometry),
      style: new ol.style.Style({
        image,
        fill: olFill,
        stroke: olStroke || new ol.style.Stroke({
          fill: {
            color: '#000',
          },
        }),
      }),
    });

    this.interaction_.on('drawend', (event) => {
      const feature = event.feature;
      this.modifiedFeatures.push(feature);
      this.layer_.addFeatures(M.impl.Feature.olFeature2Facade(feature));
    }, this);

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
    const olMap = this.facadeMap_.getMapImpl();
    olMap.removeInteraction(this.interaction_);
    this.interaction_ = null;
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
