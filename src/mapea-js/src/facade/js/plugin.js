goog.provide('M.Plugin');
goog.provide('M.plugin');

goog.require('M.facade.Base');

(function () {
   /**
    * @namespace
    * @api stable
    */
   M.plugin = {};

   /**
    * @classdesc
    * Main facade plugin object. This class creates a plugin
    * object which has an implementation Object
    *
    * @constructor
    * @extends {M.facade.Base}
    * @param {Object} impl implementation object
    * @api stable
    */
   M.Plugin = (function (impl) {
      goog.base(this, impl);
   });
   goog.inherits(M.Plugin, M.facade.Base);

   /**
    * This function provides the implementation
    * of the object
    *
    * @public
    * @function
    * @param {Object} map the map to add the plugin
    * @api stable
    */
   M.Plugin.prototype.addTo = function (map) {
      var this_;
      
      // checks if the parameter is null or empty
      if (M.utils.isNullOrEmpty(map)) {
         M.exception('No ha especificado ningún mapa');
      }

      // checks if the implementation can add itself into the map
      var impl = this.getImpl();
      if (M.utils.isUndefined(impl.addTo)) {
         M.exception('La implementación usada no posee el método addTo');
      }

      var view = this.createView(map);
      // checks if the view is a promise
      if (view instanceof Promise) {
         this_ = this;
         view.then(function (html) {
            impl.addTo(map, html);
            // executes load callback
            this_.fire(M.evt.ADDED_TO_MAP);
         });
      }
      else { // view is an HTML or text
         impl.addTo(map, view);
         // executes load callback
         this.fire(M.evt.ADDED_TO_MAP);
      }
   };

   /**
    * This function creates the HTML view for this control
    * @public
    * @function
    * @param {M.Map} map to add the plugin
    * @api stable
    */
   M.Plugin.prototype.createView = function (map) {};
})();