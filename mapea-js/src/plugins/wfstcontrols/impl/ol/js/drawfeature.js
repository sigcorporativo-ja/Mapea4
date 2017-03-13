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

      this.interaction_ = new ol.interaction.Draw({
         'source': olLayer.getSource(),
         'type': M.geom.parseWFS(this.layer_.geometry),
         'style': olLayer.getStyle(),
      });

      this.interaction_.on('drawend', function(event) {
         var feature = event.feature;
         this.modifiedFeatures.push(feature);
      }, this);

      // updates features from refresh
      layerImpl.on(M.evt.LOAD, this.updateLayerFeatures_, this);
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
})();
