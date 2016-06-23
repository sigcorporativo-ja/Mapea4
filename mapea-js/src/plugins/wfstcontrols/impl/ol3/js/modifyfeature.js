goog.provide('P.impl.control.ModifyFeature');


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
   M.impl.control.ModifyFeature = function (layer) {
      this.layer_ = layer;
      this.modify = null;
      this.modifiedFeatures = [];
      this.currentFeature_ = null;
   };
   goog.inherits(M.impl.control.ModifyFeature, M.impl.Control);

   /**
    * This function add events to the button 'DeleteFeature'
    *
    * @public
    * @function
    * @param {function} html control button
    * @api stable
    */
   M.impl.control.ModifyFeature.prototype.activate = function () {
      if (M.utils.isNullOrEmpty(this.modify)) {
         this.createInteractionModify_();
      }
      this.modify.setActive(true);
   };

   /**
    * This function add events to the button 'DeleteFeature'
    *
    * @public
    * @function
    * @param {function} html control button
    * @api stable
    */
   M.impl.control.ModifyFeature.prototype.deactivate = function () {
      if (M.utils.isNullOrEmpty(this.modify)) {
         this.createInteractionModify_();
      }
      var olMap = this.facadeMap_.getMapImpl();
      olMap.removeInteraction(this.modify);
      this.modify = null;
   };

   /**
    * This function creates the view to the specified map
    *
    * @private
    * @function
    * @param {M.Map} map to add the control
    */
   M.impl.control.ModifyFeature.prototype.createInteractionModify_ = function () {
      var olMap = this.facadeMap_.getMapImpl();
      var layerImpl = this.layer_.getImpl();
      var olLayer = layerImpl.getOL3Layer();

      var layerFeatures = new ol.Collection(olLayer.getSource().getFeatures());
      layerFeatures.forEach(function (feature) {
         feature.on('change', function (evt) {
            this.currentFeature_ = evt.target;
         }, this);
      }, this);
      this.modify = new ol.interaction.Modify({
         features: layerFeatures,
         deleteCondition: function (event) {
            return ol.events.condition.shiftKeyOnly(event) && ol.events.condition.singleClick(event);
         },
         style: olLayer.getStyle()
      });
      this.modify.on('modifyend', function (evt) {
         var featureIdx = this.modifiedFeatures.indexOf(this.currentFeature_);
         if (featureIdx >= 0) {
            this.modifiedFeatures[featureIdx] = this.currentFeature_;
         }
         else {
            this.modifiedFeatures.push(this.currentFeature_);
         }
         this.currentFeature_ = null;
      }, this);
      olMap.addInteraction(this.modify);

      // updates features from refresh
      layerImpl.on(M.evt.LOAD, this.updateLayerFeatures_, this);
   };

   /**
    * This function destroys this control, cleaning the HTML
    * and unregistering all events
    *
    * @private
    * @function
    */
   M.impl.control.ModifyFeature.prototype.updateLayerFeatures_ = function () {
      this.facadeMap_.getMapImpl().removeInteraction(this.modify);
      this.modify = null;
   };

   /**
    * This function destroys this control, cleaning the HTML
    * and unregistering all events
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.control.ModifyFeature.prototype.destroy = function () {
      this.facadeMap_.getMapImpl().removeControl(this);
      this.layer_ = null;
      this.modify = null;
      this.modifiedFeatures = [];
   };
})();