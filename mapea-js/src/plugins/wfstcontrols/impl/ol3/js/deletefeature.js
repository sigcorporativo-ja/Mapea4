goog.provide('P.impl.control.DeleteFeature');

goog.require('P.impl.control.WFSTBase');

/**
 * @namespace M.impl.control
 */
(function() {
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
   M.impl.control.DeleteFeature = function(layer) {
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

      goog.base(this, layer);
   };
   goog.inherits(M.impl.control.DeleteFeature, M.impl.Control);

   /**
    * This function active control
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.control.DeleteFeature.prototype.activate = function() {
      var layerImpl = this.layer_.getImpl();
      layerImpl.on(M.evt.SELECT_FEATURES, this.removeFeature_, this);
   };

   /**
    * This function deactivate control
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.control.DeleteFeature.prototype.deactivate = function() {
      var layerImpl = this.layer_.getImpl();
      layerImpl.un(M.evt.SELECT_FEATURES, this.removeFeature_, this);
   };

   /**
    * This function remove a specific feature
    *
    * @private
    * @function
    * @param {ol.Feature} features - Feature to remove
    * @param {array} coordinate - Coordinates
    */
   M.impl.control.DeleteFeature.prototype.removeFeature_ = function(features, coordinate) {
      var feature = features[0];
      var olLayer = this.layer_.getImpl().getOL3Layer();
      olLayer.getSource().removeFeature(feature);

      // prevents saving new features
      if (!M.utils.isNullOrEmpty(feature.getId())) {
         this.modifiedFeatures.push(feature);
      }
      else {
         // removes the created feature from the drawfeature control
         var drawfeatureCtrl = this.facadeMap_.getControls('drawfeature')[0];
         if (!M.utils.isNullOrEmpty(drawfeatureCtrl)) {
            var drawnFeatures = drawfeatureCtrl.getImpl().modifiedFeatures;
            var idx = drawnFeatures.indexOf(feature);
            drawnFeatures.splice(idx, 1);
         }
      }
   };
})();