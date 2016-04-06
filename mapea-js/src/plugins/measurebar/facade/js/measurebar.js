goog.provide('P.plugin.Measurebar');

goog.require('P.control.MeasureLength');
goog.require('P.control.MeasureArea');
goog.require('P.control.MeasureClear');

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
M.plugin.Measurebar = (function () {
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
   this.measureLength_ = null;

   /**
    * Implementation of this object
    * @private
    * @type {Object}
    */
   this.measureArea_ = null;

   /**
    * Implementation of this object
    * @private
    * @type {Object}
    */
   this.measureClear_ = null;

   goog.base(this);
});
goog.inherits(M.plugin.Measurebar, M.Plugin);

/**
 * This function provides the implementation
 * of the object
 *
 * @public
 * @function
 * @param {Object} map the map to add the plugin
 * @api stable
 */
M.plugin.Measurebar.prototype.addTo = function (map) {
   this.map_ = map;

   this.measureLength_ = new M.control.MeasureLength();
   this.measureArea_ = new M.control.MeasureArea();
   this.measureClear_ = new M.control.MeasureClear(this.measureLength_, this.measureArea_);

   map.addControls([this.measureLength_, this.measureArea_, this.measureClear_]);
};

/**
 * This function destroys this plugin
 *
 * @public
 * @function
 * @api stable
 */
M.plugin.Measurebar.prototype.destroy = function () {
   this.map_.removeControls([this.measureLength_, this.measureArea_, this.measureClear_]);
   this.map_ = null;
};