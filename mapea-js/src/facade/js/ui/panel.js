goog.provide('M.ui.Panel');

goog.require('M.ui.position');
goog.require('M.utils');
goog.require('M.exception');
goog.require('M.facade.Base');

(function () {
   /**
    * @classdesc
    * TODO
    *
    * @constructor
    * @param {string} name of the panel
    * @param {Mx.parameters.Panel} options of the panel
    * @extends {M.Object}
    * @api stable
    */
   M.ui.Panel = (function (name, options) {
      options = (options || {});

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
      this._map = null;

      /**
       * @private
       * @type {array}
       * @expose
       */
      this._controls = [];

      /**
       * @private
       * @type {boolean}
       * @expose
       */
      this._collapsible = false;
      if (!M.utils.isNullOrEmpty(options.collapsible)) {
         this._collapsible = options.collapsible;
      }

      /**
       * @public
       * @type {M.ui.position}
       * @api stable
       * @expose
       */
      this.position = M.ui.position.TL;
      if (!M.utils.isNullOrEmpty(options.position)) {
         this.position = options.position;
      }

      /**
       * @private
       * @type {boolean}
       * @expose
       */
      this._collapsed = this._collapsible;
      if (!M.utils.isNullOrEmpty(options.collapsed)) {
         this._collapsed = (options.collapsed && (this._collapsible === true));
      }

      /**
       * @private
       * @type {boolean}
       * @expose
       */
      this._multiActivation = false;
      if (!M.utils.isNullOrEmpty(options.multiActivation)) {
         this._multiActivation = options.multiActivation;
      }

      /**
       * @private
       * @type {string}
       * @expose
       */
      this._className = null;
      if (!M.utils.isNullOrEmpty(options.className)) {
         this._className = options.className;
      }

      /**
       * @private
       * @type {string}
       * @expose
       */
      this._collapsedButtonClass = null;
      if (!M.utils.isNullOrEmpty(options.collapsedButtonClass)) {
         this._collapsedButtonClass = options.collapsedButtonClass;
      }
      else if ((this.position === M.ui.position.TL) || (this.position === M.ui.position.BL)) {
         this._collapsedButtonClass = 'g-cartografia-flecha-derecha';
      }
      else if ((this.position === M.ui.position.TR) || (this.position === M.ui.position.BR)) {
         this._collapsedButtonClass = 'g-cartografia-flecha-izquierda';
      }

      /**
       * @private
       * @type {string}
       * @expose
       */
      this._openedButtonClass = null;
      if (!M.utils.isNullOrEmpty(options.openedButtonClass)) {
         this._openedButtonClass = options.openedButtonClass;
      }
      else if ((this.position === M.ui.position.TL) || (this.position === M.ui.position.BL)) {
         this._openedButtonClass = 'g-cartografia-flecha-izquierda';
      }
      else if ((this.position === M.ui.position.TR) || (this.position === M.ui.position.BR)) {
         this._openedButtonClass = 'g-cartografia-flecha-derecha';
      }

      /**
       * @private
       * @type {HTMLElement}
       * @expose
       */
      this._element = null;

      /**
       * @private
       * @type {HTMLElement}
       * @expose
       */
      this._controlsContainer = null;

      // calls the super constructor
      goog.base(this);
   });
   goog.inherits(M.ui.Panel, M.Object);

   /**
    * TODO
    *
    * @public
    * @function
    * @param {array<M.Control>} controls
    * @api stable
    */
   M.ui.Panel.prototype.addTo = function (map, areaContainer) {
      this._map = map;
      var this_ = this;
      M.template.compile(M.ui.Panel.TEMPLATE).then(function (html) {
         this_._element = html;
         var buttonPanel = html.querySelector('button.m-panel-btn');
         if (!M.utils.isNullOrEmpty(this_._className)) {
            this_._className.split(/\s+/).forEach(function (className) {
               goog.dom.classlist.add(html, className);
            });
         }

         if (this_._collapsed === true) {
            goog.dom.classlist.add(html, 'collapsed');
            goog.dom.classlist.add(buttonPanel, this_._collapsedButtonClass);
         }
         else {
            goog.dom.classlist.add(html, 'opened');
            goog.dom.classlist.add(buttonPanel, this_._openedButtonClass);
         }

         if (this_._collapsible !== true) {
            goog.dom.classlist.add(html, 'no-collapsible');
         }

         this_._controlsContainer = html.querySelector('div.m-panel-controls');
         goog.dom.appendChild(areaContainer, html);

         goog.events.listen(buttonPanel, goog.events.EventType.CLICK, function (evt) {
            evt.preventDefault();
            goog.dom.classlist.toggle(html, 'collapsed');
            goog.dom.classlist.toggle(html, 'opened');
            goog.dom.classlist.toggle(buttonPanel, this_._collapsedButtonClass);
            goog.dom.classlist.toggle(buttonPanel, this_._openedButtonClass);
            this._collapsed = !this._collapsed;
         }, false, this_);

         this_.addControls(this_._controls);
         this_.fire(M.evt.ADDED_TO_MAP, html);
      });
   };

   /**
    * TODO
    *
    * @public
    * @function
    * @param {array<M.Control>} controls
    * @api stable
    */
   M.ui.Panel.prototype.getControls = function () {
      return this._controls;
   };

   /**
    * TODO
    *
    * @public
    * @function
    * @param {array<M.Control>} controls
    * @api stable
    */
   M.ui.Panel.prototype.addControls = function (controls) {
      if (!M.utils.isNullOrEmpty(controls)) {
         if (!M.utils.isArray(controls)) {
            controls = [controls];
         }
         controls.forEach(function (control) {
            if (control instanceof M.Control) {
               if (!this.hasControl(control)) {
                  this._controls.push(control);
               }
               if (!M.utils.isNullOrEmpty(this._controlsContainer)) {
                  control.on(M.evt.ADDED_TO_MAP, this._moveControlView, this);
                  this._map.addControls(control);
               }
               control.on(M.evt.ACTIVATED, this._manageActivation, this);
            }
         }, this);
      }
   };

   /**
    * TODO
    *
    * @public
    * @function
    * @param {array<M.Control>} controls
    * @api stable
    */
   M.ui.Panel.prototype.hasControl = function (controlParam) {
      var hasControl = false;
      if (!M.utils.isNullOrEmpty(controlParam)) {
         if (M.utils.isString(controlParam)) {
            for (var i = 0, ilen = this._controls.length; i < ilen && !hasControl; i++) {
               hasControl = (this._controls[i].name === controlParam);
            }
         }
         else if (controlParam instanceof M.Control) {
            hasControl = M.utils.includes(this._controls, controlParam);
         }
      }
      return hasControl;
   };

   /**
    * TODO
    *
    * @public
    * @function
    * @param {array<M.Control>} controls
    * @api stable
    */
   M.ui.Panel.prototype.removeControls = function (controlsParam) {
      var controls = this._map.getControls(controlsParam);
      controls.forEach(function (control) {
         var index = this._controls.indexOf(control);
         if (index !== -1) {
            this._controls.splice(index, 1);
            this._map.removeControls(control);
         }
      });
   };

   /**
    * TODO
    *
    * @public
    * @function
    * @param {array<M.Control>} controls
    * @api stable
    */
   M.ui.Panel.prototype.removeClassName = function (className) {
      if (!M.utils.isNullOrEmpty(this._element)) {
         goog.dom.classlist.remove(this._element, className);
      }
      else {
         this._className = this._className.replace(new RegExp('\s*' + className + '\s*'), '');
      }
   };

   /**
    * TODO
    *
    * @public
    * @function
    * @param {array<M.Control>} controls
    * @api stable
    */
   M.ui.Panel.prototype.addClassName = function (className) {
      if (!M.utils.isNullOrEmpty(this._element)) {
         goog.dom.classlist.add(this._element, className);
      }
      else {
         this._className = this._className.concat(' ').concat(className);
      }
   };

   /**
    * TODO
    *
    * @private
    * @function
    * @param {array<M.Control>} controls
    * @api stable
    */
   M.ui.Panel.prototype._moveControlView = function (control) {
      var controlElem = control.getElement();
      goog.dom.appendChild(this._controlsContainer, controlElem);
      control.fire(M.evt.ADDED_TO_PANEL);
   };

   /**
    * TODO
    *
    * @private
    * @function
    * @param {array<M.Control>} controls
    * @api stable
    */
   M.ui.Panel.prototype._manageActivation = function (control) {
      if (this._multiActivation !== true) {
         this._controls.forEach(function (panelControl) {
            if (!panelControl.equals(control) && panelControl.activated) {
               panelControl.deactivate();
            }
         });
      }
   };

   /**
    * TODO
    *
    * @private
    * @function
    * @param {array<M.Control>} controls
    * @api stable
    */
   M.ui.Panel.prototype.equals = function (obj) {
      var equals = false;
      if (obj instanceof M.ui.Panel) {
         equals = (obj.name === this.name);
      }
      return equals;
   };

   /**
    * Template for this controls - button
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.ui.Panel.TEMPLATE = 'panel.html';
})();