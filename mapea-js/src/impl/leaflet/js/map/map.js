goog.provide('M.l');
goog.provide('M.l.Map');

/*goog.require('M.l.control.navtoolbar');
goog.require('M.l.control.overviewmap');
goog.require('M.l.layer.osm');
goog.require('M.l.layer.wms');

goog.require('l.Map');*/

(function () {
   'use strict';

   /**
    * Creates a new map
    *
    * @public
    * @constructs M.l.Map
    * @param {<HTMLDivElement>} div
    */
   M.l.Map = function (div) {
      this.map = L.Map(div.id);
   };

   /**
    * This function adds layers specified by the user
    *
    * @public
    * @function addLayers
    * @param {array<object>} layers
    */
   M.l.Map.prototype.addLayers = function (layers) {

      // creates each layer
      layers.forEach(function (layer) {
         // creates the layer by its type
         var type = layer.type;
         if (M.utils.isUndefined(M.l.layer[type])) {
            M.exception('El tipo de capa ' + type + ' no está soportado');
         }
         var lLayer = M.l.layer[type](layer);

         // adds the created layer
         lLayer.addTo(this.map);

      }, this);
   };

   /**
    * This function adds controls specified by the user
    *
    * @public
    * @function addControls
    * @param {array<object>} controls
    */
   M.l.Map.prototype.addControls = function (controls) {
      // creates each control
      controls.forEach(function (control) {
         // creates the control by its name
         var name = control.name;
         if (M.utils.isUndefined(M.l.control[name])) {
            M.exception('El control ' + name + ' no está soportado');
         }
         var lControl = M.l.control[name](control);

         // adds the created control
         lControl.addTo(this.map);

      }, this);
   };
})();