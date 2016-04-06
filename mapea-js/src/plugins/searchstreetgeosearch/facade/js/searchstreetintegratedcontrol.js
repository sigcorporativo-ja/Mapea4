goog.provide('P.control.SearchstreetIntegrated');

goog.require('P.impl.control.SearchstreetIntegrated');
goog.require('P.control.Searchstreet');
goog.require('P.impl.control.Searchstreet');

(function () {
   /**
    * @classdesc
    * Main constructor of the class. Creates a Searchstreet control
    * 
    * @constructor
    * @extends {M.control.Searchstreet}
    * @param {String}
    * url Service URL 
    * @param {Number}
    * locality INE code to specify the search
    * @api stable
    */
   M.control.SearchstreetIntegrated = (function (url, locality) {
      if (M.utils.isUndefined(M.impl.control.SearchstreetIntegrated)) {
         M.exception('La implementación usada no puede crear controles SearchstreetIntegrated');
      }

      // implementation of this control
      this.impl = new M.impl.control.SearchstreetIntegrated();
      // call super
      goog.base(this, url, locality);
   });
   goog.inherits(M.control.SearchstreetIntegrated, M.control.Searchstreet);

   /**
    * This function replaces createView of geosearch not to add the template control
    * 
    * @public
    * @function
    * @param {HTMLElement}
    *        html HTML template searchstreetgeosearch
    * @param {M.Map}
    *        map to add the control
    * @api stable
    * @return {null}
    */
   M.control.SearchstreetIntegrated.prototype.createView = function (html, map) {
      this.facadeMap_ = map;
      this.addEvents(html);
      return null;
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
   M.control.SearchstreetIntegrated.prototype.addEvents = function (html) {
      this.element_ = html;
      var this_ = this;

      this.on(M.evt.COMPLETED, function () {
         goog.dom.classlist.add(this.element_,
            "shown");
      }, this);

      // searchs
      this.input_ = this.element_.getElementsByTagName("input")["m-searchstreetgeosearch-search-input"];
      this.button_ = this.element_.getElementsByTagName("button")["m-searchstreetgeosearch-search-btn"];
      this.clear_ = this.element_.getElementsByTagName("button")["m-searchstreetgeosearch-clear-btn"];

      // events
      goog.events.listen(this.input_, goog.events.EventType.KEYUP,
         this.searchClick_, false, this);
      goog.events.listen(this.button_, goog.events.EventType.CLICK, this.searchClick_, false, this);
      goog.events.listen(this.clear_, goog.events.EventType.CLICK, this.clearSearchs_, false, this);

      // results container
      this.resultsContainer_ = this.element_.getElementsByTagName('div')["m-searchstreet-results"];
      this.resultsAutocomplete_ = this.element_.getElementsByTagName('div')["m-autocomplete-results"];
      this.resultsGeosearch_ = this.element_.getElementsByTagName('div')["m-geosearch-results"];
      this.searchingResult_ = this.element_.querySelector('div#m-searchstreet-results > div#m-searching-result-searchstreet');

      if (!M.utils.isUndefined(this.codIne_)) {
         this.searchTime_ = Date.now();
         var searchCodIne = M.utils.addParameters(this.searchCodIne_, {
            codigo: this.codIne_
         });
         (function (searchTime) {
            M.remote.get(searchCodIne).then(
               function (response) {
                  var results;
                  try {
                     if (!M.utils.isNullOrEmpty(response.text)) {
                        results = JSON.parse(response.text);
                        this_.getMunProv_(results);
                        this_.element_.getElementsByTagName("span")["codIne"].innerHTML = "Búsquedas en " + this_.municipio_ + "  (" + this_.provincia_ + ")";
                     }
                  }
                  catch (err) {
                     M.exception('La respuesta no es un JSON válido: ' + err);
                  }
               });
         })(this.searchTime_);
      }
   };

   /**
    * Clear results and searchs
    * 
    * @private
    * @function
    */
   M.control.SearchstreetIntegrated.prototype.clearSearchs_ = function () {
      goog.dom.classlist.remove(this.element_,
         "shown");
      var controls = this.facadeMap_.getControls();
      for (var x = 0, ilen = controls.length; x < ilen; x++) {
         if (controls[x].name_ === "searchstreetgeosearch") {
            controls[x].ctrlGeosearch.getImpl().layer_.ol3Layer.getSource().clear();
         }
      }
      this.facadeMap_.removePopup();
      this.getImpl().removePoints_();
      this.input_.value = "";
      this.resultsContainer_.innerHTML = "";
      this.resultsAutocomplete_.innerHTML = "";
      this.resultsGeosearch_.innerHTML = "";
   };

   /**
    * This function checks the query field is not empty, if it is not 
    * sending the query to the search function
    * 
    * @private
    * @function
    */
   M.control.SearchstreetIntegrated.prototype.searchClick_ = function (evt) {
      evt.preventDefault();

      if ((evt.type !== goog.events.EventType.KEYUP) || (evt.keyCode === 13)) {
         // gets the query
         var query = this.input_.value;
         if (!M.utils.isNullOrEmpty(query)) {
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
    * This function return impl control
    * 
    * @public
    * @function
    * @api stable
    * @return {Object}
    */
   M.control.SearchstreetIntegrated.prototype.getImpl = (function () {
      return this.impl;
   });


})();