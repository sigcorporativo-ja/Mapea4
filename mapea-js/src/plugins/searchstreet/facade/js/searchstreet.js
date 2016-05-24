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
       * Autocomplete Control
       *
       * @private
       * @type {Object}
       */
      this.autocompletador_ = null;

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
      this.locality_ = "";
      if (!M.utils.isNullOrEmpty(parameters.locality)) {
         this.locality_ = parameters.locality;
      }

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

      goog.dom.classlist.add(map._areasContainer.getElementsByClassName("m-top m-right")[0],
         "top-extra");

      // Checks if the received INE code is correct.
      var comCodIne = M.utils.addParameters(M.config.SEARCHSTREET_URLCOMPROBARINE, {
         codigo: this.locality_
      });
      M.remote.get(comCodIne).then(
         function(response) {
            var results;
            try {
               if (!M.utils.isNullOrEmpty(response.text)) {
                  results = JSON.parse(response.text);
                  if (!M.utils.isNullOrEmpty(this_.locality_) && M.utils.isNullOrEmpty(results.comprobarCodIneResponse.comprobarCodIneReturn)) {
                     // If not correct, value empty
                     M.dialog.error("El código del municipio '" + this_.locality_ + "' no es válido");
                     this_.locality_ = "";
                  }
               }
               this_.control_ = new M.control.Searchstreet(this_.url_, this_.locality_);
               this_.control_.on(M.evt.ADDED_TO_MAP, function() {
                  this_.fire(M.evt.ADDED_TO_MAP);
                  this_.autocompletador_ = new M.plugin.Autocomplete({
                     'locality': this_.locality_,
                     'target': this_.control_.getInput(),
                     'html': this_.control_.getHtml()
                  });
                  this_.map_.addPlugin(this_.autocompletador_);
               }, this);
               this_.panel_ = new M.ui.Panel('searchstreet', {
                  'collapsible': true,
                  'className': 'm-searchstreet',
                  'position': M.ui.position.TL
               });
               this_.panel_.addControls(this_.control_);
               this_.map_.addPanels(this_.panel_);
            }
            catch (err) {
               M.exception('La respuesta no es un JSON válido: ' + err);
            }
         });
   };

   /**
    * This function destroys this plugin
    *
    * @public
    * @function
    * @api stable
    */
   M.plugin.Searchstreet.prototype.destroy = function() {
      this.map_.removeControls([this.control_]);
      this.autocompletador_.destroy();
      this.name = null;
      this.map_ = null;
      this.control_ = null;
      this.autocompletador_ = null;
      this.panel_ = null;
      this.url_ = null;
      this.locality_ = null;
   };
})();