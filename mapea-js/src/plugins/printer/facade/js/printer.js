goog.provide('P.plugin.Printer');

goog.require('P.control.Printer');

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
   M.plugin.Printer = (function (parameters) {
      parameters = (parameters || {});

      /**
       * Facade of the map
       * @private
       * @type {M.Map}
       */
      this.map_ = null;

      /**
       * Control that executes the searches
       * @private
       * @type {Object}
       */
      this.control_ = null;

      /**
       * TODO
       * @private
       * @type {M.ui.Panel}
       */
      this.panel_ = null;

      /**
       * Facade of the map
       * @private
       * @type {String}
       */
      this.url_ = M.config.geoprint.URL;
      if (!M.utils.isNullOrEmpty(parameters.url)) {
         this.url_ = parameters.url;
      }

      /**
       * Facade of the map
       * @private
       * @type {String}
       */
      this.params_ = {};
      if (!M.utils.isNullOrEmpty(parameters.params)) {
         this.params_ = parameters.params;
      }

      /**
       * Facade of the map
       * @private
       * @type {String}
       */
      this.options_ = {};
      if (!M.utils.isNullOrEmpty(parameters.options)) {
         this.options_ = parameters.options;
      }

      goog.base(this);
   });
   goog.inherits(M.plugin.Printer, M.Plugin);

   /**
    * This function provides the implementation
    * of the object
    *
    * @public
    * @function
    * @param {Object} map the map to add the plugin
    * @api stable
    */
   M.plugin.Printer.prototype.addTo = function (map) {
      this.map_ = map;

      this.control_ = new M.control.Printer(this.url_, this.params_,
         this.options_);
      this.panel_ = new M.ui.Panel('printer', {
         'collapsible': true,
         'className': 'm-printer',
         'collapsedButtonClass': 'g-cartografia-impresora',
         'position': M.ui.position.TR
      });
      this.panel_.on(M.evt.ADDED_TO_MAP, function (html) {
         M.utils.enableTouchScroll(html);
      });
      this.panel_.addControls(this.control_);
      this.map_.addPanels(this.panel_);
   };

   /**
    * This function destroys this plugin
    *
    * @public
    * @function
    * @api stable
    */
   M.plugin.Printer.prototype.destroy = function () {
      this.map_.removeControls(this.control_);
      this.map_ = null;
   };
})();