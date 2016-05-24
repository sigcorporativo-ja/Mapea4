goog.provide('P.impl.control.ClearFeature');

/**
 * @namespace M.impl.control
 */
(function () {
   /**
    * @classdesc
    * Main constructor of the class. Creates a WMC ClearFeature
    * control
    *
    * @constructor
    * @extends {ol.control.Control}
    * @api stable
    */
   M.impl.control.ClearFeature = function (layer) {
      this.layer_ = layer;
   };

   goog.inherits(M.impl.control.ClearFeature, M.impl.Control);

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the plugin
    * @param {function} template template of this control
    * @api stable
    */
   M.impl.control.ClearFeature.prototype.addTo = function (map, element) {
      this.facadeMap_ = map;
      goog.base(this, 'addTo', map, element);
   };

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the plugin
    * @param {function} template template of this control
    * @api stable
    */
   M.impl.control.ClearFeature.prototype.clear = function () {
      var drawfeatureCtrl = this.facadeMap_.getControls('drawfeature')[0];
      if (!M.utils.isNullOrEmpty(drawfeatureCtrl)) {
         drawfeatureCtrl.getImpl().modifiedFeatures.length = 0;
         drawfeatureCtrl.deactivate();
      }
      var modifyfeatureCtrl = this.facadeMap_.getControls('modifyfeature')[0];
      if (!M.utils.isNullOrEmpty(modifyfeatureCtrl)) {
         modifyfeatureCtrl.getImpl().modifiedFeatures.length = 0;
         modifyfeatureCtrl.deactivate();
      }
      var deletefeatureCtrl = this.facadeMap_.getControls('deletefeature')[0];
      if (!M.utils.isNullOrEmpty(deletefeatureCtrl)) {
         deletefeatureCtrl.getImpl().modifiedFeatures.length = 0;
         deletefeatureCtrl.deactivate();
      }
      var editattributeCtrl = this.facadeMap_.getControls('editattribute')[0];
      if (!M.utils.isNullOrEmpty(editattributeCtrl)) {
         editattributeCtrl.getImpl().editedFeature = null;
         editattributeCtrl.deactivate();
      }
      this.layer_.getImpl().refresh();
   };

   /**
    * This function destroys this control, cleaning the HTML
    * and unregistering all events
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.control.ClearFeature.prototype.destroy = function () {
      this.layer_ = null;
      this.facadeMap_.getMapImpl().removeControl(this);
   };
})();