goog.provide('P.plugin.HelloWorld');

goog.require('P.control.HelloWorldControl');

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
M.plugin.HelloWorld = (function () {
  goog.base(this);
});
goog.inherits(M.plugin.HelloWorld, M.Plugin);

/**
 * This function adds this plugin into the map
 *
 * @public
 * @function
 * @param {M.Map} map the map to add the plugin
 * @api stable
 */
M.plugin.HelloWorld.prototype.addTo = function (map) {
  var miControl = new M.control.HelloWorldControl();
  map.addControls([miControl]);
};

/**
 * This function destroys the plugin from the map
 *
 * @public
 * @function
 * @api stable
 */
M.plugin.HelloWorld.prototype.destroy = function () {
  // TODO implement this method
};
