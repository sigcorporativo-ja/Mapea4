goog.provide('P.impl.control.ClearFeature');

/**
 * @namespace M.impl.control
 */
(function () {
   /**
    * @classdesc
    * Main constructor of the class. Creates a ClearFeature
    * control
    *
    * @constructor
    * @param {M.layer.WFS} layer - Layer for use in control
    * @extends {M.impl.Control}
    * @api stable
    */
   M.impl.control.ClearFeature = function (layer) {
      /**
       * Layer for use in control
       * @private
       * @type {M.layer.WFS}
       */
      this.layer_ = layer;
   };

   goog.inherits(M.impl.control.ClearFeature, M.impl.Control);

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map - Map to add the plugin
    * @param {function} element - Template of this control
    * @api stable
    */
   M.impl.control.ClearFeature.prototype.addTo = function (map, element) {
      this.facadeMap_ = map;
      goog.base(this, 'addTo', map, element);
   };

   /**
    * This function remove unsaved changes
    *
    * @public
    * @function
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
    * This function destroys this control and cleaning the HTML
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