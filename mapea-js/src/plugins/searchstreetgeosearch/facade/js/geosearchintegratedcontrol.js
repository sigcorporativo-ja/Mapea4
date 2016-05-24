goog.provide('P.control.GeosearchIntegrated');

goog.require('P.control.Geosearch');
goog.require('P.impl.control.Geosearch');
goog.require('P.impl.control.GeosearchIntegrated');

(function() {
   /**
    * @classdesc Main constructor of the class. Creates a GeosearchIntegrated
    *            control.
    *
    * @constructor
    * @extends {M.control.Geosearch}
    * @param {String}
    *        url Service URL
    * @param {String}
    *        core core URL
    * @param {String}
    *        handler handler URL
    * @param {Object}
    *        searchParameters parameters to the URL
    * @api stable
    */
   M.control.GeosearchIntegrated = (function(url, core, handler, searchParameters) {
      if (M.utils.isUndefined(M.impl.control.GeosearchIntegrated)) {
         M.exception('La implementación usada no puede crear controles GeosearchIntegrated');
      }

      // implementation of this control
      this.impl = new M.impl.control.GeosearchIntegrated();

      goog.base(this, url, core, handler, searchParameters);
   });
   goog.inherits(M.control.GeosearchIntegrated, M.control.Geosearch);


   /**
    * This function replaces createView of geosearch not to add the template control
    *
    * @public
    * @function
    * @param {HTMLElement} html HTML template searchstreetgeosearch
    * @api stabletrue
    */
   M.control.GeosearchIntegrated.prototype.createView = function(html, map) {
      this.facadeMap_ = map;
      this.addEvents(html);
      return null;
   };

   /**
    * This function add events to HTML elements
    *
    * @public
    * @function
    * @param {HTMLElement} html HTML template searchstreetgeosearch
    * @api stable
    */
   M.control.GeosearchIntegrated.prototype.addEvents = function(html) {
      this.element_ = html;

      this.on(M.evt.COMPLETED, function() {
         goog.dom.classlist.add(this.element_,
            "shown");
      }, this);

      // input search
      this.input_ = this.element_.getElementsByTagName('input')["m-searchstreetgeosearch-search-input"];
      goog.events.listen(this.input_, goog.events.EventType.KEYUP, this.searchClick_, false, this);

      // search buntton
      var btnSearch = this.element_.getElementsByTagName('button')["m-searchstreetgeosearch-search-btn"];
      goog.events.listen(btnSearch, goog.events.EventType.CLICK, this.searchClick_, false, this);

      // help buntton
      var btnHelp = this.element_.getElementsByTagName('button')["m-searchstreetgeosearch-help-btn"];
      goog.events.listen(btnHelp, goog.events.EventType.CLICK, function(evt) {
         evt.preventDefault();
         goog.dom.classlist.toggle(btnHelp, 'shown');
         this.helpClick_();
      }, false, this);

      // results container
      this.resultsContainer_ = this.element_.getElementsByTagName('div')["m-geosearch-results"];
      M.utils.enableTouchScroll(this.resultsContainer_);
      this.searchingResult_ = this.element_.querySelector('div#m-geosearch-results > div#m-searching-result-geosearch');
      goog.dom.removeChildren(this.resultsContainer_, this.searchingResult_);
   };



   /**
    * This function checks if an object is equals
    * to this control
    *
    * @private
    * @function
    */
   M.control.GeosearchIntegrated.prototype.appendResults_ = function(results) {
      // draws the new results on the map
      this.drawNewResults(results);

      var resultsTemplateVars = this.parseResultsForTemplate_(results, true);
      var this_ = this;
      M.template.compile(M.control.Geosearch.RESULTS_TEMPLATE, {
         'jsonp': true,
         'vars': resultsTemplateVars
      }).then(function(html) {
         // appends the new results
         var newResultsScrollContainer = html.getElementsByTagName("div")["m-geosearch-results-scroll"];
         var newResults = newResultsScrollContainer.children;
         var newResult;
         while ((newResult = newResults.item(0)) !== null) {
            this_.resultsScrollContainer_.appendChild(newResult);
            goog.events.listen(newResult, goog.events.EventType.CLICK, this_.resultClick_, false, this_);
         }

         // updates the found num elements
         var spanNumFound = this_.resultsContainer_.getElementsByTagName("span")["m-geosearch-page-found"];
         spanNumFound.innerHTML = this_.results_.length;


         goog.dom.classlist.remove(this_.element_, M.control.Geosearch.SEARCHING_CLASS);
         this_.resultsContainer_.removeChild(this_.searchingResult_);
         // disables scroll if gets all results
         this_.checkScrollSearch_(results);
      });
   };

   /**
    * This function checks if an object is equals
    * to this control
    *
    * @private
    * @function
    */
   M.control.GeosearchIntegrated.prototype.resultsClick_ = function(evt) {
      goog.dom.classlist.toggle(this.facadeMap_._areasContainer.getElementsByClassName("m-top m-right")[0],
         "top-extra-search");
      goog.dom.classlist.toggle(evt.target, 'g-cartografia-flecha-arriba');
      goog.dom.classlist.toggle(evt.target, 'g-cartografia-flecha-abajo');
      goog.dom.classlist.toggle(this.resultsContainer_, "hidden");
      if (M.utils.isNullOrEmpty(this.resultsContainer_.parentElement.querySelector("div#m-searchstreet-results.hidden"))) {
         goog.dom.classlist.toggle(this.resultsContainer_.parentElement, "hidden");
      }
   };


   /**
    * This function return impl control
    *
    * @public
    * @function
    * @api stabletrue
    * @return {Object}
    */
   M.control.GeosearchIntegrated.prototype.getImpl = function(html) {
      return this.impl;
   };

})();