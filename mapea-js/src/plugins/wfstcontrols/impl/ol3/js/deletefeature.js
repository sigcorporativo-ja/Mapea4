goog.provide('P.impl.control.DeleteFeature');

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
      this.layer_ = layer;
      this.deleteFeature = null;
      this.newDeletes = [];
   };
   goog.inherits(M.impl.control.DeleteFeature, M.impl.Control);

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the plugin
    * @param {function} template template of this control
    * @api stable
    */
   M.impl.control.DeleteFeature.prototype.addTo = function (map, element) {
      this.facadeMap_ = map;
      goog.base(this, 'addTo', map, element);
   };

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the control
    * @api stable
    */
   M.impl.control.DeleteFeature.prototype.activeDelete = function () {
      if (this.deleteFeature !== null) {
         if (this.deleteFeature.getActive() === false) {
            this.deleteFeature.setActive(true);
         }
         else {
            this.deleteFeature.setActive(false);
         }
      }
      else {
         this.createInteractionDelete_();
      }
   };


   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the control
    * @api stable
    */
   M.impl.control.DeleteFeature.prototype.createInteractionDelete_ = function () {
      var this_ = this;
      this.deleteFeature = new ol.interaction.Select();
      this.facadeMap_.getMapImpl().addInteraction(this.deleteFeature);
      this.deleteFeature.getFeatures().on("add", function (event) {
         this_.deleteFeature_(event.element);
      });
   };

   /**
    * This function creates the view to the specified map
    *
    * @private
    * @function
    * @param {M.Map} map to add the control
    */

   M.impl.control.DeleteFeature.prototype.deleteFeature_ = function (feature) {
      var controls = this.facadeMap_.getControls();
      this.layer_.getImpl().getOL3Layer().getSource().removeFeature(feature);
      for (var i = 0; i < controls.length; i++) {
         if (controls[i].name === "drawfeature") {
            controls[i].getImpl().newDraw.remove(feature);
            this.newDeletes.push(feature);
         }
      }
   };

   /**
    * This function destroys this control, cleaning the HTML
    * and unregistering all events
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.control.DeleteFeature.prototype.destroy = function () {
      this.facadeMap_.getMapImpl().removeControl(this);
      this.layer_ = null;
      this.deleteFeature = null;
      this.newDeletes = [];
   };
})();