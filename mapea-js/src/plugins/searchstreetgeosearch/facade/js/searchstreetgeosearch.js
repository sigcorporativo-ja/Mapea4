goog.provide('P.plugin.SearchstreetGeosearch');
goog.require('P.plugin.Autocomplete');

(function() {
   /**
    * @classdesc Main facade plugin object. This class creates a plugin
    *            object which has an implementation Object
    *
    * @constructor
    * @extends {M.Plugin}
    * @param {Object}
    * parameters parameter group to form URL Query
    * @api stable
    */
   M.plugin.SearchstreetGeosearch = (function(parameters) {
      parameters = (parameters || {});

      /**
       * Name plugin
       *
       * @public
       * @type {String}
       * @api stable
       */
      this.name = "searchstreetgeosearch";

      this.parameters_ = parameters;

      /**
       * Facade of the map
       *
       * @private
       * @type {M.Map}
       */
      this.map_ = null;

      /**
       * SearchstreetGeosearch Control
       *
       * @private
       * @type {Object}
       */
      this.control_ = null;

      /**
       * Service URL
       *
       * @private
       * @type {String}
       */
      this.urlAutocomplete_ = parameters.urlAutocomplete;

      /**
       * Minimum number of characters to start autocomplete
       *
       * @private
       * @type {Number}
       */
      this.minLengthAutocomplete_ = parameters.minLengthAutocomplete;

      /**
       * TODO
       *
       * @private
       * @type {Number}
       */
      this.delayAutocomplete_ = parameters.delayAutocomplete;

      /**
       * Number of results to show
       *
       * @private
       * @type {Number}
       */
      this.limitAutocomplete_ = parameters.limitAutocomplete;

      /**
       * INE code to specify the search
       *
       * @private
       * @type {Number}
       */
      this.locality_ = parameters.locality;

      goog.base(this);
   });
   goog.inherits(M.plugin.SearchstreetGeosearch, M.Plugin);

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {Object}
    *        map the map to add the plugin
    * @api stable
    */
   M.plugin.SearchstreetGeosearch.prototype.addTo = function(map) {
      this.map_ = map;
      var this_ = this;
      this.control_ = new M.control.SearchstreetGeosearch(this.parameters_);

      goog.dom.classlist.add(map._areasContainer.getElementsByClassName("m-top m-right")[0],
         "top-extra");

      this.control_.on(M.evt.ADDED_TO_MAP, function() {
         this.fire(M.evt.ADDED_TO_MAP);

         // Checks if the received INE code is correct.
         var comCodIne = M.utils.addParameters(M.config.SEARCHSTREET_URLCOMPROBARINE, {
            codigo: this.locality_
         });
         M.remote.get(comCodIne).then(
            function(response) {
               var results = JSON.parse(response.text);
               if (M.utils.isNullOrEmpty(results.comprobarCodIneResponse.comprobarCodIneReturn)) {
                  this_.locality_ = "";
               }
               var autocompletador = new M.plugin.Autocomplete({
                  'locality': this_.locality_,
                  'url': this_.urlAutocomplete_,
                  'minLength': this_.minLengthAutocomplete_,
                  'delay': this_.delayAutocomplete_,
                  'target': this_.control_.getInput(),
                  'limit': this_.limitAutocomplete_,
                  'html': this_.control_.getHtml()
               });
               this_.map_.addPlugin(autocompletador);
            });
      }, this);
      this.panel_ = new M.ui.Panel('SearchstreetGeosearch', {
         'collapsible': true,
         'className': 'm-geosearch',
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
   M.plugin.SearchstreetGeosearch.prototype.destroy = function() {
      this.map_.removeControls([this.control_]);
      this.name = null;
      this.parameters_ = null;
      this.map_ = null;
      this.control_ = null;
      this.urlAutocomplete_ = null;
      this.minLengthAutocomplete_ = null;
      this.delayAutocomplete_ = null;
      this.limitAutocomplete_ = null;
      this.locality_ = null;
   };
})();