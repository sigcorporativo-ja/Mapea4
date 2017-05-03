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
   * Control MeasureLength
   * @private
   * @type {M.control.MeasureLength}
   */
  this.measureLength_ = null;

  /**
   * Control MeasureArea
   * @private
   * @type {M.control.MeasureArea}
   */
  this.measureArea_ = null;

  /**
   * Name of this control
   * @public
   * @type {string}
   * @api stable
   */
  this.name = M.plugin.Measurebar.NAME;

  /**
   * Control MeasureClear
   * @private
   * @type {M.control.MeasureClear}
   */
  this.measureClear_ = null;

  goog.base(this);
});
goog.inherits(M.plugin.Measurebar, M.Plugin);

/**
 * @inheritdoc
 * @public
 * @function
 * @param {M.Map} map - Map to add the plugin
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
  this.measureLength_ = null;
  this.measureArea_ = null;
  this.measureClear_ = null;
  this.name = null;
};

/**
 * This function compare if pluging recieved by param is instance of M.plugin.Measurebar
 *
 * @public
 * @function
 * @param {M.plugin} plugin to comapre
 * @api stable
 */
M.plugin.Measurebar.prototype.equals = function (plugin) {
  if (plugin instanceof M.plugin.Measurebar) {
    return true;
  }
  else {
    return false;
  }
};

M.plugin.Measurebar.NAME = "measurebar";
