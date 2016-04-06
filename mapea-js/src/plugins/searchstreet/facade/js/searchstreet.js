goog.provide('P.plugin.Searchstreet');
goog.require('P.plugin.Autocomplete');

(function() {
   /**
    * @classdesc
    * Main facade plugin object. This class creates a plugin
    * object which has an implementation Object
    *
    * @constructor
    * @extends {M.Plugin}
    * @param {Object}
    * parameters parameter group to form URL Query
    * @api stable
    */
   M.plugin.Searchstreet = (function(parameters) {
      parameters = (parameters || {});

      /**
       * Name plugin
       *
       * @public
       * @type {String}
       * @api stable
       */
      this.name = "searchstreet";

      /**
       * Facade of the map
       * @private
       * @type {M.Map}
       */
      this.map_ = null;

      /**
       * Searchstreet Control
       *
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
       * Service URL (Searchstreet)
       *
       * @private
       * @type {String}
       */
      this.url_ = M.config.SEARCHSTREET_URL;

      /**
       * INE code to specify the search
       *
       * @private
       * @type {Number}
       */
      this.locality_ = parameters.locality;

      /**
       * TODO
       * @private
       * @type {String}
       */
      this.searchParameters_ = parameters.params || {};

      goog.base(this);
   });
   goog.inherits(M.plugin.Searchstreet, M.Plugin);

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {Object}
    *        map the map to add the plugin
    * @api stable
    */
   M.plugin.Searchstreet.prototype.addTo = function(map) {
      var this_ = this;
      this.map_ = map;

      // checks if the user specified the srs parameter
      if (M.utils.isNullOrEmpty(this.searchParameters_) ||
         M.utils.isNullOrEmpty(this.searchParameters_.srs)) {
         this.searchParameters_.srs = this.map_.getProjection().code;
      }

      // Checks if the received INE code is correct.
      if (!M.utils.isNullOrEmpty(this.locality_)) {
         var comCodIne = M.utils.addParameters(M.config.SEARCHSTREET_URLCOMPROBARINE, {
            codigo: this.locality_
         });
         M.remote.get(comCodIne).then(
            function(response) {
               var results;
               try {
                  if (!M.utils.isNullOrEmpty(response.text)) {
                     results = JSON.parse(response.text);
                     if (M.utils.isUndefined(results.comprobarCodIneResponse.comprobarCodIneReturn)) {
                        // If not correct, value null
                        this_.locality_ = null;
                     }
                  }
               }
               catch (err) {
                  M.exception('La respuesta no es un JSON válido: ' + err);
               }
            });
      }
      this.control_ = new M.control.Searchstreet(this.url_, this.locality_, this.searchParameters_);
      this.control_.on(M.evt.ADDED_TO_MAP, function() {
         this.fire(M.evt.ADDED_TO_MAP);
         var autocompletador = new M.plugin.Autocomplete({
            'locality': this_.locality_,
            'target': this_.control_.getInput(),
            'html': this_.control_.getHtml()
         });
         this.map_.addPlugin(autocompletador);
      }, this);
      this.panel_ = new M.ui.Panel('searchstreet', {
         'collapsible': true,
         'className': 'm-searchstreet',
         'position': M.ui.position.TL
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
   M.plugin.Searchstreet.prototype.destroy = function() {
      this.map_.removeControls(this.control_);
      this.map_ = null;
      this.control_ = null;
      this.panel_ = null;
      this.url_ = null;
      this.locality_ = null;
   };
})();