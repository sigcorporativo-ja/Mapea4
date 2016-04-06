goog.provide('P.impl.control.SaveFeature');

goog.require('goog.dom.xml');
goog.require('goog.dom.classes');

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
   M.impl.control.SaveFeature = function (layer) {
      this.layer_ = layer;
   };
   goog.inherits(M.impl.control.SaveFeature, M.impl.Control);

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the plugin
    * @param {function} template template of this control
    * @api stable
    */
   M.impl.control.SaveFeature.prototype.addTo = function (map, element) {
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
   M.impl.control.SaveFeature.prototype.saveFeature = function () {
      // TODO
      //      goog.dom.classes.add(goog.dom.$('m-button-savefeature'), 'm-savefeature-saving');
      var saveFeaturesDraw = null;
      var saveFeaturesModify = null;
      var saveFeaturesDelete = null;

      var drawfeatureCtrl = this.facadeMap_.getControls('drawfeature')[0];
      if (!M.utils.isNullOrEmpty(drawfeatureCtrl)) {
         saveFeaturesDraw = drawfeatureCtrl.getImpl().modifiedFeatures;
      }
      var modifyfeatureCtrl = this.facadeMap_.getControls('modifyfeature')[0];
      if (!M.utils.isNullOrEmpty(modifyfeatureCtrl)) {
         saveFeaturesModify = modifyfeatureCtrl.getImpl().modifiedFeatures;
      }
      var deletefeatureCtrl = this.facadeMap_.getControls('deletefeature')[0];
      if (!M.utils.isNullOrEmpty(deletefeatureCtrl)) {
         saveFeaturesDelete = deletefeatureCtrl.getImpl().modifiedFeatures;
      }

      var this_ = this;
      var layerImpl = this.layer_.getImpl();
      layerImpl.getDescribeFeatureType().then(function (describeFeatureType) {
         var projectionCode = this_.facadeMap_.getProjection().code;
         var formatWFS = new ol.format.WFS();
         var wfstRequestXml = formatWFS.writeTransaction(saveFeaturesDraw, saveFeaturesModify, saveFeaturesDelete, {
            'featureNS': describeFeatureType.featureNS,
            'featurePrefix': describeFeatureType.featurePrefix,
            'featureType': this_.layer_.name,
            'srsName': projectionCode,
            'gmlOptions': {
               'srsName': projectionCode
            }
         });

         var wfstRequestText = goog.dom.xml.serialize(wfstRequestXml);
         M.remote.post(this_.layer_.url, wfstRequestText).then(function (response) {
            if (response.code === 200 && response.text.indexOf("ExceptionText") === -1) {
               M.dialog.success('Se ha guardado correctamente');
            }
            else {
               M.dialog.error('Ha ocurrido un error al guardar: '.concat(response.text));
            }
         });
      });
   };

   /**
    * This function destroys this control, cleaning the HTML
    * and unregistering all events
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.control.SaveFeature.prototype.destroy = function () {
      this.layer_ = null;
      this.facadeMap_.getMapImpl().removeControl(this);
   };
})();