goog.provide('P.impl.control.DeleteFeature');

goog.require('P.impl.control.WFSTBase');

/**
 * @namespace M.impl.control
 */
(function () {
   /**
    * @classdesc
    * Main constructor of the class. Creates a WMC selector
    * control
    *
    * @constructor
    * @extends {ol.control.Control}
    * @api stable
    */
   M.impl.control.DeleteFeature = function (layer) {
      /**
       * TODO
       * @private
       * @type {ol.Feature}
       */
      this.layer_ = layer;

      /**
       * TODO
       * @public
       * @type {ol.Feature}
       * @api stable
       */
      this.modifiedFeatures = [];

      goog.base(this, layer);
   };
   goog.inherits(M.impl.control.DeleteFeature, M.impl.Control);

   /**
    * This function add events to the button 'DeleteFeature'
    *
    * @public
    * @function
    * @param {function} html control button
    * @api stable
    */
   M.impl.control.DeleteFeature.prototype.activate = function () {
      var layerImpl = this.layer_.getImpl();
      layerImpl.on(M.evt.SELECT_FEATURES, this.removeFeature_, this);
   };

   /**
    * This function add events to the button 'DeleteFeature'
    *
    * @public
    * @function
    * @param {function} html control button
    * @api stable
    */
   M.impl.control.DeleteFeature.prototype.deactivate = function () {
      var layerImpl = this.layer_.getImpl();
      layerImpl.un(M.evt.SELECT_FEATURES, this.removeFeature_, this);
   };

   /**
    * TODO
    *
    * @private
    * @function
    */
   M.impl.control.DeleteFeature.prototype.removeFeature_ = function (features, coordinate) {
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