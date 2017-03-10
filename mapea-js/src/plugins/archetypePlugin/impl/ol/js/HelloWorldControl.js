goog.provide('P.impl.control.HelloWorldControl');

/**
 * @classdesc
 * Main constructor of the HelloWorldControl.
 *
 * @constructor
 * @extends {M.impl.Control}
 * @api stable
 */
M.impl.control.HelloWorldControl = function() {
   goog.base(this);
};
goog.inherits(M.impl.control.HelloWorldControl, M.impl.Control);

/**
 * This function adds the control to the specified map
 *
 * @public
 * @function
 * @param {M.Map} map to add the plugin
 * @param {HTMLElement} html of the plugin
 * @api stable
 */
M.impl.control.HelloWorldControl.prototype.addTo = function(map, html) {
   // specific code

   // super addTo
   goog.base(this, 'addTo', map, html);
};

/**
 *
 * @public
 * @function
 * @api stable
 */
M.impl.control.HelloWorldControl.prototype.activate = function() {
   M.dialog.info('Hello World!');
};

/**
 *
 * @public
 * @function
 * @api stable
 */
M.impl.control.HelloWorldControl.prototype.deactivate = function() {
   M.dialog.info('Bye World!');
};