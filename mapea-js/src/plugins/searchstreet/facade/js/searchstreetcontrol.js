goog.provide('P.control.Searchstreet');

goog.require('goog.events');
goog.require('goog.dom');

(function() {
   /**
    * @classdesc
    * Main constructor of the class. Creates a Searchstreet control
    *
    * @constructor
    * @extends {M.Control}
    * @param {String}
    * url Service URL
    * @param {Number}
    * locality INE code to specify the search
    * @api stable
    */
   M.control.Searchstreet = (function(url, locality, searchParameters) {
      if (M.utils.isUndefined(M.impl.control.Searchstreet)) {
         M.exception('La implementación usada no puede crear controles Searchstreet');
      }

      /**
       * HTML element where the query will be written
       *
       * @private
       * @type {HTMLElement}
       */
      this.input_ = null;

      /**
       * HTML element where the query is sent to press
       *
       * @private
       * @type {HTMLElement}
       */
      this.button_ = null;

      /**
       * HTML template
       *
       * @private
       * @type {HTMLElement}
       */
      this.element_ = null;

      /**
       * HTML element for container of the results
       *
       * @private
       * @type {HTMLElement}
       */
      this.resultsContainer_ = null;

      /**
       * Timestamp of the search to abort old requests
       *
       * @private
       * @type {Number}
       */
      this.searchTime_ = 0;

      /**
       * Control name
       *
       * @private
       * @type {String}
       */
      this.name_ = "searchstreet";

      /**
       * Search URL
       *
       * @private
       * @type {String}
       */
      this.searchUrl_ = url;

      /**
       * Municipality to search
       *
       * @private
       * @type {String}
       */
      this.municipio_ = null;

      /**
       * Province to search
       *
       * @private
       * @type {String}
       */
      this.provincia_ = null;

      /**
       * Provinces
       *
       * @private
       * @type {Array}
       */
      this.provincias_ = ["huelva", "sevilla", "córdoba", "jaén", "cádiz", "málaga", "granada", "almería"];

      // checks if you receive the locality parameter, if so create two attributes.
      if (!M.utils.isUndefined(locality)) {
         this.codIne_ = locality;
         this.searchCodIne_ = M.config.SEARCHSTREET_URLCOMPROBARINE;
      }

      /**
       * Minimum number of characters to start autocomplete
       *
       * @private
       * @type {Number}
       */
      this.minAutocomplete_ = M.config.AUTOCOMPLETE_MINLENGTH;

      /**
       * Facade of the map
       * @private
       * @type {M.Map}
       */
      this.facadeMap_ = null;

      /**
       * HTML element for container of the results (Autocomplete)
       *
       * @private
       * @type {HTMLElement}
       */
      this.resultsAutocomplete_ = null;

      /**
       * State consultation
       *
       * @public
       * @type {Boolean}
       * @api stable
       */
      this.completed = false;

      /**
       * Stores the answers of the query when the province isn't indicated
       *
       * @private
       * @type {Array}
       */
      this.respuestasProvincias_ = [];

      /**
       * Counter consulted provinces
       *
       * @public
       * @type {number}
       */
      this.contadorProvincias = 0;

      /**
       * Container of the results
       * @private
       * @type {HTMLElement}
       */
      this.resultsContainer_ = null;

      /**
       * Container of the results to scroll
       * @private
       * @type {HTMLElement}
       */
      this.resultsScrollContainer_ = null;

      // implementation of this control
      var impl = new M.impl.control.Searchstreet();

      goog.base(this, impl);
   });
   goog.inherits(M.control.Searchstreet, M.Control);

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map}
    *        map map to add the control
    * @api stable
    */
   M.control.Searchstreet.prototype.createView = function(map) {
      var this_ = this;
      this.facadeMap_ = map;
      var promise = new Promise(function(success, fail) {
         M.template.compile(M.control.Searchstreet.TEMPLATE, {
            'jsonp': true
         }).then(
            function(html) {
               this_.addEvents(html);
               success(html);
            });
      });
      return promise;
   };

   /**
    * This function add events to HTML elements
    *
    * @public
    * @function
    * @param {HTMLElement}
    *        html html to add events
    * @api stable
    */
   M.control.Searchstreet.prototype.addEvents = function(html) {
      var this_ = this;
      this.element_ = html;

      this.on(M.evt.COMPLETED, function() {
         goog.dom.classlist.add(this.element_,
            "shown");
      }, this);

      // searchs
      this.input_ = this.element_.getElementsByTagName("input")["m-searchstreet-search-input"];
      this.button_ = this.element_.getElementsByTagName("button")["m-searchstreet-search-btn"];
      this.clear_ = this.element_.getElementsByTagName("button")["m-searchstreet-clear-btn"];

      // events
      goog.events.listen(this.input_, goog.events.EventType.KEYUP,
         this.searchClick_, false, this);
      goog.events.listen(this.button_, goog.events.EventType.CLICK, this.searchClick_, false, this);
      goog.events.listen(this.clear_, goog.events.EventType.CLICK, this.clearSearchs_, false, this);

      // results container
      this.resultsContainer_ = this.element_.getElementsByTagName('div')["m-searchstreet-results"];
      this.resultsAutocomplete_ = this.element_.getElementsByTagName('div')["m-autocomplete-results"];
      this.searchingResult_ = this.element_.querySelector('div#m-searchstreet-results > div#m-searching-result-searchstreet');

      if (!M.utils.isUndefined(this.codIne_) && !M.utils.isNullOrEmpty(this.codIne_)) {
         var searchCodIne = M.utils.addParameters(this.searchCodIne_, {
            codigo: this.codIne_
         });
         M.remote.get(searchCodIne).then(
            function(response) {
               var results;
               try {
                  if (!M.utils.isNullOrEmpty(response.text)) {
                     results = JSON.parse(response.text);
                     if (M.utils.isNullOrEmpty(results.comprobarCodIneResponse.comprobarCodIneReturn)) {
                        M.dialog.error("El código del municipio '" + this_.codIne_ + "' no es válido");
                     }
                     else {
                        this_.getMunProv_(results);
                        this_.element_.getElementsByTagName("span")["codIne"].innerHTML = "Búsquedas en " + this_.municipio_ + "  (" + this_.provincia_ + ")";
                     }
                  }
               }
               catch (err) {
                  M.exception('La respuesta no es un JSON válido: ' + err);
               }
            });
      }
      goog.dom.removeChildren(this.resultsContainer_, this.searchingResult_);
   };

   /**
    * Specifies the value of the municipality and province
    *
    * @param {Object} results query results
    * @private
    * @function
    */
   M.control.Searchstreet.prototype.getMunProv_ = function(results) {
      this.provincia_ = results.comprobarCodIneResponse.comprobarCodIneReturn.comprobarCodIneReturn.nombreProvincia;
      this.municipio_ = results.comprobarCodIneResponse.comprobarCodIneReturn.comprobarCodIneReturn.nombreMunicipio;
   };

   /**
    * This function checks the query field is not empty, if it is not
    * sending the query to the search function
    *
    * @private
    * @function
    */
   M.control.Searchstreet.prototype.searchClick_ = function(evt) {
      evt.preventDefault();

      if ((evt.type !== goog.events.EventType.KEYUP) || (evt.keyCode === 13)) {
         goog.dom.classlist.remove(this.resultsAutocomplete_,
            M.control.Searchstreet.MINIMUM);
         goog.dom.removeChildren(this.resultsAutocomplete_, this.resultsAutocomplete_.querySelector("div#m-searching-result-autocomplete"));
         // gets the query
         var query = this.input_.value;
         if (M.utils.isNullOrEmpty(query)) {
            M.dialog.error('Debe introducir una búsqueda.');
         }
         else {
            if (query.length < this.minAutocomplete_) {
               this.completed = false;
            }
            else {
               this.completed = true;
            }
            if (!M.utils.isUndefined(this.codIne_) && !M.utils.isNullOrEmpty(this.codIne_)) {
               // It does not take into account the municipality if indicated
               var pos = query.indexOf(",");
               if (query.indexOf(",") > -1) {
                  query = query.substring(0, pos);
               }
               this.search_(query + ", " + this.municipio_ + " (" + this.provincia_ + ")", this.showResults_);
            }
            else {
               this.search_(query, this.showResults_);
            }
         }
      }
   };

   /**
    * This function performs the query
    *
    * @private
    * @function
    * @param {String} query query to search
    * @param {Function} processor calls function
    */
   M.control.Searchstreet.prototype.search_ = function(query, processor) {
      var this_ = this;
      var searchUrl = null;
      this.provincia_ = null;
      this.municipio_ = null;
      goog.dom.appendChild(this.resultsContainer_, this.searchingResult_);
      // adds the class
      goog.dom.classlist.add(this.element_, M.control.Searchstreet.SEARCHING_CLASS);
      goog.dom.classlist.add(this.resultsContainer_,
         M.control.Searchstreet.MINIMUM);

      var normalizar = M.utils.addParameters(M.config.SEARCHSTREET_NORMALIZAR, {
         cadena: query
      });

      M.remote.get(normalizar).then(function(response) {
         var results = JSON.parse(response.text).normalizarResponse.normalizarReturn;
         this_.provincia_ = M.utils.beautifyString(results.provincia);
         this_.municipio_ = M.utils.beautifyString(results.municipio);
         if (!M.utils.isNullOrEmpty(this_.provincia_)) {
            searchUrl = M.utils.addParameters(this_.searchUrl_, {
               streetname: results.nombreVia,
               streetNumber: results.numeroPortal,
               streetType: results.tipoVia,
               municipio: this_.municipio_,
               provincia: this_.provincia_,
               srs: this_.facadeMap_.getProjection().code
            });
            this_.searchTime_ = Date.now();
            this_.querySearch_(searchUrl, this_.provincia_, processor);
         }
         else if (M.utils.isNullOrEmpty(this_.provincia_) && !M.utils.isNullOrEmpty(this_.municipio_)) {
            this_.searchTime_ = Date.now();
            this_.respuestasProvincias_ = [];
            this_.contadorProvincias = 0;
            for (var i = 0, ilen = this_.provincias_.length; i < ilen; i++) {
               searchUrl = M.utils.addParameters(this_.searchUrl_, {
                  streetname: results.nombreVia,
                  streetNumber: results.numeroPortal,
                  streetType: results.tipoVia,
                  municipio: this_.municipio_,
                  provincia: this_.provincias_[i],
                  srs: this_.facadeMap_.getProjection().code
               });
               this_.querySearchProvinces(searchUrl, this_.provincias_[i], processor);
            }
         }
         else {
            searchUrl = M.utils.addParameters(this_.searchUrl_, {
               streetname: results.direccionSinNormalizar,
               streetNumber: null,
               streetType: null,
               municipio: null,
               provincia: null,
               srs: this_.facadeMap_.getProjection().code
            });
            this_.searchTime_ = Date.now();
            this_.querySearch_(searchUrl, null, processor);
         }
      });
   };

   /**
    * This function performs the query if the town and province have value
    *
    * @private
    * @function
    * @param {Object} results query results
    */
   M.control.Searchstreet.prototype.querySearch_ = function(searchUrl, provincia, processor) {
      var this_ = this;
      (function(searchTime) {
         M.remote.get(searchUrl).then(function(response) {
            if (searchTime === this_.searchTime_) {
               var results;
               try {
                  if (!M.utils.isNullOrEmpty(response.text) && response.text.indexOf("No se ha podido obtener el codigoINE") == -1) {
                     results = JSON.parse(response.text);
                  }
                  else {
                     results = null;
                  }
               }
               catch (err) {
                  M.exception('La respuesta no es un JSON válido: ' + err);
               }
               if (!M.utils.isNullOrEmpty(results)) {
                  this_.provincia_ = M.utils.beautifyString(provincia);
                  processor.call(this_, results);
                  goog.dom.classlist.remove(this_.element_, M.control.Searchstreet.SEARCHING_CLASS);
                  goog.dom.classlist.remove(this_.resultsContainer_,
                     M.control.Searchstreet.MINIMUM);
               }
               else {
                  processor.call(this_, results);
                  goog.dom.classlist.remove(this_.element_, M.control.Searchstreet.SEARCHING_CLASS);
                  goog.dom.classlist.remove(this_.resultsContainer_,
                     M.control.Searchstreet.MINIMUM);
               }
            }
         });
      })(this.searchTime_);
   };

   /**
    * This function performs the query if the town and province haven't value
    *
    * @private
    * @function
    * @param {Object} results query results
    */
   M.control.Searchstreet.prototype.querySearchProvinces = function(searchUrl, provincia, processor) {
      var this_ = this;
      (function(searchTime) {
         M.remote.get(searchUrl).then(function(response) {
            this_.respuestasProvincias_.push(response);
            this_.contadorProvincias++;
            if (this_.contadorProvincias == 8) {
               for (var i = 0, ilen = this_.respuestasProvincias_.length; i < ilen; i++) {
                  if (searchTime === this_.searchTime_) {
                     var results;
                     try {
                        var item = this_.respuestasProvincias_[i].text;
                        if (!M.utils.isNullOrEmpty(item) && item.indexOf("No se ha podido obtener el codigoINE") == -1) {
                           results = JSON.parse(item);
                        }
                        else {
                           results = null;
                        }
                     }
                     catch (err) {
                        M.exception('La respuesta no es un JSON válido: ' + err);
                     }
                     if (!M.utils.isNullOrEmpty(results) && results.geocoderMunProvSrsResponse.geocoderMunProvSrsReturn.geocoderMunProvSrsReturn.coordinateX !== 0) {
                        this_.provincia_ = M.utils.beautifyString(provincia);
                        processor.call(this_, results);
                        goog.dom.classlist.remove(this_.element_, M.control.Searchstreet.SEARCHING_CLASS);
                        goog.dom.classlist.remove(this_.resultsContainer_,
                           M.control.Searchstreet.MINIMUM);
                     }
                  }
               }
            }
         });
      })(this.searchTime_);
   };

   /**
    * This function displays the results of the consultation
    *
    * @private
    * @function
    * @param {Object} results query results
    */
   M.control.Searchstreet.prototype.showResults_ = function(results) {
      var this_ = this;
      var resultsTemplateVars = this.parseResultsForTemplate_(results);
      if (!M.utils.isUndefined(this.codIne_)) {
         for (var i = 0, ilen = resultsTemplateVars.docs.length; i < ilen; i++) {
            if (!M.utils.isUndefined(resultsTemplateVars.docs[i])) {
               if (resultsTemplateVars.docs[i].coordinateX === undefined) {
                  resultsTemplateVars.docs.splice(i, 1);
                  ilen--;
                  i--;
               }
            }
         }
      }
      M.template.compile(M.control.Searchstreet.RESULTS_TEMPLATE, {
         'jsonp': true,
         'vars': resultsTemplateVars
      }).then(function(html) {
         goog.dom.classlist.remove(this_.resultsContainer_, M.control.Searchstreet.HIDDEN_RESULTS_CLASS);
         this_.resultsContainer_.innerHTML = html.innerHTML;
         this_.resultsScrollContainer_ = this_.resultsContainer_.querySelector("div#m-searchstreet-results-scroll");
         if (!M.utils.isNullOrEmpty(this_.resultsScrollContainer_)) {
            M.utils.enableTouchScroll(this_.resultsScrollContainer_);
         }

         this_.facadeMap_.removePopup();
         if (this_.getImpl().listPoints.length > 0) {
            this_.getImpl().removePoints_();
         }
         if (!M.utils.isUndefined(resultsTemplateVars.docs[0])) {
            this_.getImpl().drawPoints(resultsTemplateVars.docs);
            this_.eventList_(resultsTemplateVars.docs);
         }
         goog.dom.classlist.remove(this_.element_, M.control.Searchstreet.SEARCHING_CLASS);
         goog.dom.classlist.remove(this_.resultsContainer_,
            M.control.Searchstreet.MINIMUM);

         // results buntton
         var btnResults = this_.resultsContainer_.querySelector('div.page > div.g-cartografia-flecha-arriba');
         goog.events.listen(btnResults, goog.events.EventType.CLICK, this_.resultsClick_, false, this_);

         this_.fire(M.evt.COMPLETED);
      });
      this.element_.getElementsByTagName('div')["m-autocomplete-results"].innerHTML = "";
   };

   /**
    * This function parse query results for template
    *
    * @private
    * @function
    * @param {Object} results query results
    * @returns {Object}
    */
   M.control.Searchstreet.prototype.parseResultsForTemplate_ = function(results) {
      var resultsTemplateVar = null;
      var containtResult = null;
      var resultado = results;
      var search = this.input_.value;
      if (!M.utils.isNullOrEmpty(resultado)) {
         var docs = resultado.geocoderMunProvSrsResponse.geocoderMunProvSrsReturn;
         containtResult = !M.utils.isNullOrEmpty(docs);
         if (docs.geocoderMunProvSrsReturn instanceof Array) {
            if (!M.utils.isUndefined(docs.geocoderMunProvSrsReturn[0].coordinateX)) {
               for (var i = 0, ilen = docs.geocoderMunProvSrsReturn.length; i < ilen; i++) {
                  docs.geocoderMunProvSrsReturn[i].localityName = this.municipio_;
                  docs.geocoderMunProvSrsReturn[i].cityName = this.provincia_;
                  docs.geocoderMunProvSrsReturn[i].streetType = M.utils.beautifyString(docs.geocoderMunProvSrsReturn[i].streetType);
                  docs.geocoderMunProvSrsReturn[i].streetName = M.utils.beautifyString(docs.geocoderMunProvSrsReturn[i].streetName);
               }
               resultsTemplateVar = {
                  'docs': docs.geocoderMunProvSrsReturn,
                  'containtResult': containtResult,
                  'search': search
               };
            }
            else {
               resultsTemplateVar = {
                  'docs': [undefined],
                  'containtResult': false,
                  'search': search
               };
            }
         }
         else {
            if (M.utils.isNullOrEmpty(docs)) {
               resultsTemplateVar = {
                  'docs': [undefined],
                  'containtResult': containtResult,
                  'search': search
               };
            }
            else if (docs.geocoderMunProvSrsReturn.coordinateX === 0) {
               resultsTemplateVar = {
                  'docs': [undefined],
                  'containtResult': false,
                  'search': search
               };
            }
            else {
               docs.geocoderMunProvSrsReturn.localityName = this.municipio_;
               docs.geocoderMunProvSrsReturn.cityName = this.provincia_;
               docs.geocoderMunProvSrsReturn.streetType = M.utils.beautifyString(docs.geocoderMunProvSrsReturn.streetType);
               docs.geocoderMunProvSrsReturn.streetName = M.utils.beautifyString(docs.geocoderMunProvSrsReturn.streetName);
               resultsTemplateVar = {
                  'docs': [docs.geocoderMunProvSrsReturn],
                  'containtResult': containtResult,
                  'search': search
               };
            }
         }
      }
      else {
         resultsTemplateVar = {
            'docs': [undefined],
            'containtResult': containtResult,
            'search': search
         };
      }
      return resultsTemplateVar;
   };

   /**
    * This function adds a click event to the elements of the list
    *
    * @private
    * @function
    * @param {Array} results query results
    */
   M.control.Searchstreet.prototype.eventList_ = function(results) {
      var rows = this.resultsContainer_.getElementsByClassName("result");
      for (var i = 0, ilen = rows.length; i < ilen; i++) {
         this.addEventClickList_(rows[i], results[i]);
      }
   };

   /**
    * This function adds a click event to the elements of the list
    *
    * @private
    * @function
    * @param {HTMLElement} specific item in the list
    * @param {Object} result result specific
    */
   M.control.Searchstreet.prototype.addEventClickList_ = function(element,
      result) {
      var this_ = this;
      goog.events.listen(element, goog.events.EventType.CLICK, function(e) {
         // hidden results on click for mobile devices
         if (M.window.WIDTH <= M.config.MOBILE_WIDTH) {
            e.target = this.resultsContainer_.querySelector('div.page > div.g-cartografia-flecha-arriba');
            this.resultsClick_(e);
         }
         this_.getImpl().addEventClickFeature(result);
      }, false, this);
   };

   /**
    * This function checks if an object is equals to this control
    *
    * @function
    * @api stable
    * @returns {Boolean}
    */
   M.control.Searchstreet.prototype.equals = function(obj) {
      var equals = false;
      if (obj instanceof M.control.Searchstreet) {
         equals = (this.name === obj.name);
      }
      return equals;
   };

   /**
    * This function return element input
    *
    * @public
    * @function
    * @returns {HTMLElement}
    */
   M.control.Searchstreet.prototype.getInput = function() {
      return this.input_;
   };

   /**
    * This function return HTML template
    *
    * @private
    * @function
    * @returns {HTMLElement}
    */
   M.control.Searchstreet.prototype.getHtml = function() {
      return this.element_;
   };

   /**
    * Clear results and searchs
    *
    * @private
    * @function
    */
   M.control.Searchstreet.prototype.clearSearchs_ = function() {
      goog.dom.classlist.remove(this.element_,
         "shown");
      this.facadeMap_.removePopup();
      this.getImpl().removePoints_();
      this.input_.value = "";
      this.resultsContainer_.innerHTML = "";
      this.resultsAutocomplete_.innerHTML = "";
   };

   /**
    * This function checks if an object is equals
    * to this control
    *
    * @private
    * @function
    */
   M.control.Searchstreet.prototype.resultsClick_ = function(evt) {
      goog.dom.classlist.add(this.facadeMap_._areasContainer.getElementsByClassName("m-top m-right")[0],
         "top-extra-search");
      goog.dom.classlist.toggle(evt.target, 'g-cartografia-flecha-arriba');
      goog.dom.classlist.toggle(evt.target, 'g-cartografia-flecha-abajo');
      goog.dom.classlist.toggle(this.resultsContainer_, M.control.Searchstreet.HIDDEN_RESULTS_CLASS);
   };

   /**
    * Template for this controls
    *
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.Searchstreet.TEMPLATE = 'searchstreet.html';

   /**
    * Template for show results
    *
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.Searchstreet.RESULTS_TEMPLATE = 'searchstreetresults.html';

   /**
    * Class searching
    *
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.Searchstreet.SEARCHING_CLASS = 'm-searching';

   /**
    * Class for this controls
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.Searchstreet.HIDDEN_RESULTS_CLASS = 'hidden';

   /**
    * Class minimum
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.Searchstreet.MINIMUM = 'minimum';

})();