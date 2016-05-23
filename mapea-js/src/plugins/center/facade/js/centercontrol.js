goog.provide('P.control.Center');

(function () {
   /**
    * @classdesc
    * Main constructor of the class. Creates a WMCSelector
    * control to provides a way to select an specific WMC
    *
    * @constructor
    * @extends {M.Control}
    * @api stable
    */
   M.control.Center = (function () {
      // checks if the implementation can create WMC layers
      if (M.utils.isUndefined(M.impl.control.Center)) {
         M.exception('La implementación usada no puede crear controles Center');
      }

      // implementation of this control
      var impl = new M.impl.control.Center();

      goog.base(this, impl);
   });
   goog.inherits(M.control.Center, M.Control);

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the control
    * @api stable
    */
   //   M.control.Center.prototype.createView = function (map) {
   //      /* para implementar la vista de un control podemos:
   //         a. Generar y compilar plantillas con handlebars
   //         b. Generar el código HTML de la vista */
   //
   //      // caso a.
   //      return M.template.compile(M.control.Center.TEMPLATE, {});
   //   };

   // caso b.
   M.control.Center.prototype.createView = function (map) {
      // container
      var container = document.createElement("div");
      container.className = 'm-control m-center-container';

      // input x
      var inputX = document.createElement("input");
      inputX.id = 'm-center-x';

      // input y
      var inputY = document.createElement("input");
      inputY.id = 'm-center-y';

      // button
      var button = document.createElement("button");
      button.id = 'm-center-button';

      container.appendChild(inputX);
      container.appendChild(inputY);
      container.appendChild(button);

      return container;
   };

   /**
    * This function checks if an object is equals
    * to this control
    *
    * @function
    * @api stable
    */
   M.control.Center.prototype.equals = function (obj) {
      var equals = (obj instanceof M.control.Center);
      return equals;
   };

   /**
    * function adds the event 'click'
    * 
    * @public
    * @function
    * @api stable
    */
   M.control.Center.prototype.destroy = function () {
      this.getImpl().destroy();
      this.impl = null;
   };
   /**
    * Template for this controls
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.Center.TEMPLATE = 'center.html';
})();