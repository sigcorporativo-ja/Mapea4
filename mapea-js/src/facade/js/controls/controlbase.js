goog.provide('M.Control');

goog.require('M.utils');
goog.require('M.exception');
goog.require('M.facade.Base');

(function () {
   /**
    * @classdesc
    * Main constructor of the class. Creates a layer
    * with parameters specified by the user
    *
    * @constructor
    * @extends {M.facade.Base}
    * @api stable
    */
   M.Control = (function (impl) {
      // checks if the implementation can create WMC layers
      if (M.utils.isUndefined(impl.addTo)) {
         M.exception('La implementación usada no posee el método addTo');
      }

      // checks if the implementation can create default controls
      if (M.utils.isUndefined(impl.isByDefault)) {
         impl.isByDefault = true;
      }

      /**
       * @private
       * @type {string}
       */
      this.map_ = null;

      // calls the super constructor
      goog.base(this, impl);
   });
   goog.inherits(M.Control, M.facade.Base);

   /**
    * This function set implementation of this control
    *
    * @public
    * @function
    * @param {M.Map} impl to add the plugin
    * @api stable
    */
   M.Control.prototype.setImpl = function (impl) {
      // checks if the implementation can create WMC layers
      if (M.utils.isUndefined(impl.addTo)) {
         M.exception('La implementación usada no posee el método addTo');
      }
      // checks if the implementation can create default controls
      if (M.utils.isUndefined(impl.isByDefault)) {
         impl.isByDefault = true;
      }

      goog.base(this, 'setImpl', impl);
   };

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the plugin
    * @api stable
    * @export
    */
   M.Control.prototype.addTo = function (map) {
      this.map_ = map;
      var impl = this.getImpl();
      var view = this.createView(map);
      if (view instanceof Promise) { // the view is a promise
         var this_ = this;
         view.then(function (html) {
            impl.addTo(map, html);
            this_.onLoadCallback_();
         });
      }
      else { // view is an HTML or text or null
         impl.addTo(map, view);
         this.onLoadCallback_();
      }
   };

   /**
    * This function creates the HTML view for this control
    * @public
    * @function
    * @param {M.Map} map to add the plugin
    * @api stable
    * @export
    */
   M.Control.prototype.createView = function (map) {};

   /**
    * function adds the event 'click'
    * 
    * @public
    * @function
    * @api stable
    * @export
    */
   M.Control.prototype.activate = function () {
      if (!M.utils.isUndefined(this.getImpl().activate)) {
         this.getImpl().activate();
      }
   };

   /**
    * function remove the event 'click'
    * 
    * @public
    * @function
    * @api stable
    * @export
    */
   M.Control.prototype.deactivate = function () {
      if (!M.utils.isUndefined(this.getImpl().deactivate)) {
         this.getImpl().deactivate();
      }
   };
})();