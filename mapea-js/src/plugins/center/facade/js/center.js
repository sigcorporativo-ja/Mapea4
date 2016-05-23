goog.provide('P.plugin.Center');

goog.require('P.control.Center');

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
   M.plugin.Center = (function () {
      /**
       * Facade of the map
       * @private
       * @type {M.Map}
       */
      this.map_ = null;

      /**
       * Implementation of this object
       * @private
       * @type {Object}
       */
      this.centerControl_ = null;

      goog.base(this);
   });
   goog.inherits(M.plugin.Center, M.Plugin);

   /**
    * This function provides the implementation
    * of the object
    *
    * @public
    * @function
    * @param {Object} map the map to add the plugin
    * @api stable
    */
   M.plugin.Center.prototype.addTo = function (map) {
      this.map_ = map;

      this.centerControl_ = new M.control.Center();
      map.addControls(this.centerControl_);
   };

   /**
    * This function destroys this plugin
    *
    * @public
    * @function
    * @api stable
    */
   M.plugin.Center.prototype.destroy = function () {
      this.map_.removeControls(this.centerControl_);
      this.map_ = null;
   };
})();