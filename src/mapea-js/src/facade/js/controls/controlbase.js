goog.provide('M.Control');

goog.require('M.utils');
goog.require('M.exception');
goog.require('M.facade.Base');

(function() {
   /**
    * @classdesc
    * Main constructor of the class. Creates a layer
    * with parameters specified by the user
    *
    * @constructor
    * @extends {M.facade.Base}
    * @api stable
    */
   M.Control = (function(impl, name) {
      // checks if the implementation can create WMC layers
      if (M.utils.isUndefined(impl.addTo)) {
         M.exception('La implementación usada no posee el método addTo');
      }

      // checks if the implementation can create WMC layers
      if (M.utils.isUndefined(impl.getElement)) {
         M.exception('La implementación usada no posee el método getElement');
      }

      // checks if the implementation can create default controls
      if (M.utils.isUndefined(impl.isByDefault)) {
         impl.isByDefault = true;
      }

      /**
       * @public
       * @type {string}
       * @api stable
       * @expose
       */
      this.name = name;

      /**
       * @private
       * @type {M.Map}
       * @expose
       */
      this.map_ = null;

      /**
       * @private
       * @type {HTMLElement}
       * @expose
       */
      this.element_ = null;

      /**
       * @private
       * @type {HTMLElement}
       * @expose
       */
      this.activationBtn_ = null;

      /**
       * @public
       * @type {boolean}
       * @api stable
       * @expose
       */
      this.activated = false;

      /**
       * @private
       * @type {M.ui.Panel}
       * @expose
       */
      this.panel_ = null;

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
   M.Control.prototype.setImpl = function(impl) {
      // checks if the implementation can create WMC layers
      if (M.utils.isUndefined(impl.addTo)) {
         M.exception('La implementación usada no posee el método addTo');
      }
      if (M.utils.isUndefined(impl.getElement)) {
         M.exception('La implementación usada no posee el método getElement');
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
   M.Control.prototype.addTo = function(map) {
      this.map_ = map;
      var impl = this.getImpl();
      var view = this.createView(map);
      if (view instanceof Promise) { // the view is a promise
         var this_ = this;
         view.then(function(html) {
            this_.manageActivation(html);
            impl.addTo(map, html);
            this_.fire(M.evt.ADDED_TO_MAP);
         });
      }
      else { // view is an HTML or text or null
         this.manageActivation(view);
         impl.addTo(map, view);
         this.fire(M.evt.ADDED_TO_MAP);
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
   M.Control.prototype.createView = function(map) {};

   /**
    * TODO
    *
    * @public
    * @function
    * @param {HTMLElement} html to add the plugin
    * @api stable
    * @export
    */
   M.Control.prototype.manageActivation = function(html) {
      this.element_ = html;
      this.activationBtn_ = this.getActivationButton(this.element_);
      if (!M.utils.isNullOrEmpty(this.activationBtn_)) {
         goog.events.listen(this.activationBtn_, goog.events.EventType.CLICK, function(evt) {
            evt.preventDefault();
            if (!this.activated) {
               this.activate();
               this.activated = true;
            }
            else {
               this.deactivate();
               this.activated = false;
            }
         }, false, this);
      }
   };

   /**
    * TODO
    *
    * @public
    * @function
    * @param {HTMLElement} html to add the plugin
    * @api stable
    * @export
    */
   M.Control.prototype.getActivationButton = function(html) {};

   /**
    * function adds the event 'click'
    *
    * @public
    * @function
    * @api stable
    * @export
    */
   M.Control.prototype.activate = function() {
      if (!M.utils.isNullOrEmpty(this.element_)) {
         goog.dom.classlist.add(this.element_, 'activated');
      }
      if (!M.utils.isUndefined(this.getImpl().activate)) {
         this.getImpl().activate();
      }
      this.activated = true;
      this.fire(M.evt.ACTIVATED);
   };

   /**
    * function remove the event 'click'
    *
    * @public
    * @function
    * @api stable
    * @export
    */
   M.Control.prototype.deactivate = function() {
      if (!M.utils.isNullOrEmpty(this.element_)) {
         goog.dom.classlist.remove(this.element_, 'activated');
      }
      if (!M.utils.isUndefined(this.getImpl().deactivate)) {
         this.getImpl().deactivate();
      }
      this.activated = false;
      this.fire(M.evt.DEACTIVATED);
   };

   /**
    * function remove the event 'click'
    *
    * @public
    * @function
    * @api stable
    * @export
    */
   M.Control.prototype.getElement = function() {
      return this.getImpl().getElement();
   };

   /**
    * Sets the panel of the control
    *
    * @public
    * @function
    * @param {M.ui.Panel} panel
    * @api stable
    * @export
    */
   M.Control.prototype.setPanel = function(panel) {
      this.panel_ = panel;
   };

   /**
    * Gets the panel of the control
    *
    * @public
    * @function
    * @returns {M.ui.Panel}
    * @api stable
    * @export
    */
   M.Control.prototype.getPanel = function() {
      return this.panel_;
   };
})();