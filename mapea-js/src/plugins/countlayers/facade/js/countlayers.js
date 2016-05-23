goog.provide('P.plugin.CountLayers');

(function () {
   /**
    * @classdesc
    * Main facade plugin object. This class creates a plugin
    * object which has an implementation Object
    *
    * @constructor
    * @extends {M.Plugin}
    * @param {Object} impl implementation object
    * @api stable
    */
   M.plugin.CountLayers = (function () {
      goog.base(this);
   });
   goog.inherits(M.plugin.CountLayers, M.Plugin);

   /**
    * This function provides the implementation
    * of the object
    *
    * @public
    * @function
    * @param {Object} map the map to add the plugin
    * @api stable
    */
   M.plugin.CountLayers.prototype.addTo = function (map) {
      M.Map.prototype.countLayers = goog.bind(M.plugin.CountLayers.countLayersFn, map);
      var impl = new M.impl.plugin.CountLayers();
      impl.addTo(map);
   };

   M.plugin.CountLayers.countLayersFn = function () {
      // checks if the implementation can manage layers
      if (M.utils.isUndefined(M.impl.Map.prototype.countLayers)) {
         M.exception('La implementación usada no posee el método countLayers');
      }

      var layers = this.getLayers();
      console.log('Estamos en la fachada');

      this.getImpl().countLayers(layers);

      return this;
   };
})();