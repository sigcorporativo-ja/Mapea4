goog.provide('P.impl.control.DrawFeature');

goog.require('P.impl.control.WFSTBase');
/**
 * @namespace M.impl.control
 */
(function() {
   /**
    * @classdesc
    * Main constructor of the class. Creates a WMC selector
    * control
    *
    * @constructor
    * @extends {ol.control.Control}
    * @api stable
    */
   M.impl.control.DrawFeature = function(layer) {
      goog.base(this, layer);
   };
   goog.inherits(M.impl.control.DrawFeature, M.impl.control.WFSTBase);

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the plugin
    * @param {function} template template of this control
    * @api stable
    */
   M.impl.control.DrawFeature.prototype.createInteraction_ = function() {
      var layerImpl = this.layer_.getImpl();
      var olLayer = layerImpl.getOL3Layer();

      this.interaction_ = new ol.interaction.Draw({
         'source': olLayer.getSource(),
         'type': M.geom.parseWFS(this.layer_.geometry),
         'style': olLayer.getStyle(),
         'geometryName': this.describeFeatureType_.geometryName
      });

      this.interaction_.on('drawend', function(event) {
         var feature = event.feature;
         this.describeFeatureType_.properties.forEach(function(property) {
            if (!M.utils.isGeometryType(property.localType)) {
               feature.set(property.name, layerImpl.getDefaultValue(property.localType));
            }
         });
         this.modifiedFeatures.push(feature);
      }, this);

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
   M.impl.control.DrawFeature.prototype.updateLayerFeatures_ = function() {
      this.facadeMap_.getMapImpl().removeInteraction(this.interaction_);
      this.interaction_ = null;
   };
})();