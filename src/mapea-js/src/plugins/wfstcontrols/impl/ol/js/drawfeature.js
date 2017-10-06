goog.provide('P.impl.control.DrawFeature');

goog.require('P.impl.control.WFSTBase');
/**
 * @namespace M.impl.control
 */
(function() {
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
  M.impl.control.DrawFeature = function(layer) {
    goog.base(this, layer);
  };
  goog.inherits(M.impl.control.DrawFeature, M.impl.control.WFSTBase);

  /**
   * This function creates the interaction to draw
   *
   * @private
   * @function
   * @api stable
   */
  M.impl.control.DrawFeature.prototype.createInteraction_ = function() {
    var layerImpl = this.layer_.getImpl();
    var olLayer = layerImpl.getOL3Layer();
    let olStyle = olLayer.getStyle()()[0];
    let [olFill, olStroke] = [olStyle.getFill(), olStyle.getStroke()];
    this.interaction_ = new ol.interaction.Draw({
      'source': olLayer.getSource(),
      'type': M.geom.parseWFS(this.layer_.geometry),
      'style': new ol.style.Style({
        image: new ol.style.Circle({
          fill: olFill,
          radius: 5,
          stroke: olStroke
        }),
        fill: olFill,
        stroke: olStroke || new ol.style.Stroke({
          fill: {
            color: '#000'
          }
        }),
      }),
    });

    this.interaction_.on('drawend', function(event) {
      var feature = event.feature;
      this.modifiedFeatures.push(feature);
    }, this);

    // updates features from refresh
    this.layer_.on(M.evt.LOAD, this.updateLayerFeatures_, this);
  };

  /**
   * This function remove unsaved changes
   *
   * @private
   * @function
   */
  M.impl.control.DrawFeature.prototype.updateLayerFeatures_ = function() {
    this.facadeMap_.getMapImpl().removeInteraction(this.interaction_);
    this.interaction_ = null;
  };

  /**
   * This function deactivate control
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.control.DrawFeature.prototype.deactivate = function() {
    if (M.utils.isNullOrEmpty(this.interaction_)) {
      this.createInteractionModify_();
    }
    var olMap = this.facadeMap_.getMapImpl();
    olMap.removeInteraction(this.interaction_);
    this.interaction_ = null;
  };
})();
