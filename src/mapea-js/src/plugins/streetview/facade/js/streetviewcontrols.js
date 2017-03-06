goog.provide('P.control.Streetview');

goog.require('goog.dom.classlist');
goog.require('goog.fx.Dragger');

(function() {
   /**
    * @classdesc Main constructor of the class. Creates a Streetview
    * control to draw features on the map.
    *
    * @constructor
    * @extends {M.Control}
    * @api stable
    */
   M.control.Streetview = (function() {

      if (M.utils.isUndefined(M.impl.control.Streetview)) {
         M.exception('La implementación usada no puede crear controles Streetview');
      }
      // implementation of this control
      var impl = new M.impl.control.Streetview();

      /**
       * Canvas Streetview
       * @private
       * @type {HTMLElement}
       */
      this.canvas_ = null;

      // calls the super constructor
      goog.base(this, impl);
   });
   goog.inherits(M.control.Streetview, M.Control);

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map - Map to add the control
    * @returns {Promise} html response
    * @api stable
    */
   M.control.Streetview.prototype.createView = function(map) {
      this.facadeMap_ = map;
      var this_ = this;
      return M.template.compile(M.control.Streetview.TEMPLATE_DIALOG, {
         'jsonp': true
      }).then(function(dialogHtml) {
         // canvas
         this_.canvas_ = dialogHtml.querySelector('div#streetview-canvas');
         goog.dom.appendChild(map.getContainer(), dialogHtml);

         // close button
         var closeStreetView = dialogHtml.querySelector("div#closeStreetView");
         goog.events.listen(closeStreetView, goog.events.EventType.CLICK, this_.closeStreetView, false, this_);
         return M.template.compile(M.control.Streetview.TEMPLATE, {
            'jsonp': true
         });
      });
   };

   /**
    * This function adds events to change styles control
    *
    * @public
    * @function
    * @param {HTMLElement} html - Container Streetview
    * @api stable
    * @export
    */
   M.control.Streetview.prototype.manageActivation = function(html) {
      this.element_ = html;

      // drag button
      var svButton = html.querySelector('button#streetViewControl');
      var dd = new goog.fx.Dragger(svButton);
      dd.setHysteresis(0);
      goog.events.listen(dd, 'start', function(evt) {
         goog.dom.classlist.remove(svButton, 'g-cartografia-posicion2');
         goog.dom.classlist.add(svButton, 'g-cartografia-posicion5');
         goog.dom.classlist.add(svButton, 'm-dragging');
      });
      goog.events.listen(dd, 'end', function(evt) {
         goog.dom.classlist.remove(svButton, 'm-dragging');
         goog.dom.classlist.remove(svButton, 'g-cartografia-posicion5');
         goog.dom.classlist.add(svButton, 'g-cartografia-posicion2');
         goog.style.setStyle(svButton, 'top', 0);
         goog.style.setStyle(svButton, 'left', 0);

         this.openStreetView(evt);
      }, false, this);
   };

   /**
    * This function close the window Streetview
    * @function
    * @param {goog.events.BrowserEvent} evt - Click event
    * @api stable
    */
   M.control.Streetview.prototype.closeStreetView = function(evt) {
      goog.style.setStyle(this.canvas_, 'visibility', 'hidden');
      myPano.setVisible(false);
   };

   /**
    * This function checks if an object is equals to this control
    *
    * @function
    * @param {*} obj - Object to compare
    * @returns {boolean} equals - Returns if they are equal or not
    * @api stable
    */
   M.control.Streetview.prototype.equals = function(obj) {
      var equals = (obj instanceof M.control.Streetview);
      return equals;
   };

   /**
    * This function opens the window Streetview
    *
    * @public
    * @function
    * @param {goog.events.Event} evt - End event
    * @api stable
    */
   M.control.Streetview.prototype.openStreetView = function(evt) {
      this.getImpl().openStreetView(evt, this.canvas_);
   };


   /**
    * Name for this controls
    *
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.Streetview.NAME = 'streetview';

   /**
    * Template for this controls - button
    *
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.Streetview.TEMPLATE = 'streetview.html';

   /**
    * Template dialog for this control
    *
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.Streetview.TEMPLATE_DIALOG = 'streetview_dialog.html';
})();