goog.provide('P.control.HelloWorldControl');

/**
 * @classdesc
 * Main constructor of the class. Creates a HelloWorldControl
 * control
 *
 * @constructor
 * @extends {M.Control}
 * @api stable
 */
M.control.HelloWorldControl = (function() {
   // 1. checks if the implementation can create HelloWorldControl
   if (M.utils.isUndefined(M.impl.control.HelloWorldControl)) {
      M.exception('La implementación usada no puede crear controles HelloWorldControl');
   }

   // 2. implementation of this control
   var impl = new M.impl.control.HelloWorldControl();

   // 3. calls super constructor (scope, implementation, controlName)
   goog.base(this, impl, "HelloWorld");
});
goog.inherits(M.control.HelloWorldControl, M.Control);

/**
 * This function creates the view
 *
 * @public
 * @function
 * @param {M.Map} map to add the control
 * @api stable
 */
M.control.HelloWorldControl.prototype.createView = function(map) {
   return M.template.compile('helloworld.html');
};

/**
 * @public
 * @function
 * @param {HTMLElement} html to add the plugin
 * @api stable
 * @export
 */
M.control.HelloWorldControl.prototype.getActivationButton = function(html) {
   return html.querySelector('button#m-helloworldcontrol-button');
};