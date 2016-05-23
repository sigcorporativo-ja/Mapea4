goog.provide('P.impl.plugin.CountLayers');

/**
 * @namespace M.impl.control
 */
(function () {
   /**
    * @classdesc
    * Main constructor of the measure conrol.
    *
    * @constructor
    * @extends {ol.control.Control}
    * @api stable
    */
   M.impl.plugin.CountLayers = function () {};

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the plugin
    * @param {function} template template of this control
    * @api stable
    */
   M.impl.plugin.CountLayers.prototype.addTo = function (map) {
      M.impl.Map.prototype.countLayers = goog.bind(M.impl.plugin.CountLayers.countLayersFn, map.getImpl());
   };

   M.impl.plugin.CountLayers.countLayersFn = function (layers) {
      console.log('Estamos en la impl de OL3');
      console.log('num de layers: ' + layers.length);

      return this;
   };
})();