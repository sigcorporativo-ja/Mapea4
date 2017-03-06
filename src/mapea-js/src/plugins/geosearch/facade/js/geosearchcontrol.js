goog.provide('P.control.Geosearch');

goog.require('goog.dom.classlist');
goog.require('goog.events');
goog.require('goog.style');

(function() {
   /**
    * @classdesc
    * Main constructor of the class. Creates a WMCSelector
    * control to provides a way to select an specific WMC
    *
    * @constructor
    * @extends {M.Control}
    * @api stable
    */
   M.control.Geosearch = (function(url, core, handler, searchParameters) {
      // checks if the implementation can create WMC layers
      if (M.utils.isUndefined(M.impl.control.Geosearch)) {
         M.exception('La implementación usada no puede crear controles Geosearch');
      }

      /**
       * Facade of the map
       * @private
       * @type {HTMLElement}
       */
      this.input_ = null;

      /**
       * Container of the control
       * @private
       * @type {HTMLElement}
       */
      this.element_ = null;

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

      /**
       * Searching result
       * @private
       * @type {HTMLElement}
       */
      this.searchingResult_ = null;

      /**
       * Timestamp of the search to abort
       * old requests
       * @private
       * @type {Nunber}
       */
      this.searchTime_ = 0;

      /**
       * Facade of the map
       * @private
       * @type {M.Map}
       */
      this.url_ = url;

      /**
       * Facade of the map
       * @private
       * @type {M.Map}
       */
      this.core_ = core;

      /**
       * Facade of the map
       * @private
       * @type {M.Map}
       */
      this.handler_ = handler;

      /**
       * Search URL
       * @private
       * @type {String}
       */
      this.searchUrl_ = M.utils.concatUrlPaths([this.url_, this.core_, this.handler_]);

      /**
       * Help API URL
       * @private
       * @type {String}
       */
      this.helpUrl_ = M.utils.concatUrlPaths([this.url_, this.core_, '/help']);

      /**
       * Facade of the map
       * @private
       * @type {M.Map}
       */
      this.searchParameters_ = searchParameters;
      if (!M.utils.isNullOrEmpty(this.searchParameters_)) {
         if (M.utils.isNullOrEmpty(this.searchParameters_.rows)) {
            this.searchParameters_.rows = M.config.GEOSEARCH_ROWS;
         }
         this.searchUrl_ = M.utils.addParameters(this.searchUrl_, this.searchParameters_);
      }

      /**
       * Results of the search
       * @private
       * @type {Array<Object>}
       */
      this.results_ = [];

      /**
       * Flag that indicates if the help was
       * shown
       * @private
       * @type {Boolean}
       */
      this.helpShown_ = false;

      /**
       * Flag that indicates the scroll is up
       * shown
       * @private
       * @type {Boolean}
       */
      this.scrollIsUp_ = true;

      /**
       * Flag that indicates the search is spatial
       * shown
       * @private
       * @type {Boolean}
       */
      this.spatialSearch_ = false;

      /**
       * Facade of the map
       * @private
       * @type {M.Map}
       */
      this.facadeMap_ = null;

      // implementation of this control
      var impl = new M.impl.control.Geosearch();

      goog.base(this, impl, M.control.Geosearch.NAME);
   });
   goog.inherits(M.control.Geosearch, M.Control);

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the control
    * @api stabletrue
    */
   M.control.Geosearch.prototype.createView = function(map) {
      var this_ = this;
      this.facadeMap_ = map;
      var promise = new Promise(function(success, fail) {
         M.template.compile(M.control.Geosearch.TEMPLATE, {
            'jsonp': true
         }).then(function(html) {
            this_.addEvents(html);
            success(html);
         });
      });
      return promise;
   };

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the control
    * @api stable
    */
   M.control.Geosearch.prototype.addEvents = function(html) {
      this.element_ = html;

      this.on(M.evt.COMPLETED, function() {
         goog.dom.classlist.add(this.element_,
            "shown");
      }, this);

      // input search
      this.input_ = this.element_.getElementsByTagName('input')["m-geosearch-search-input"];
      goog.events.listen(this.input_, goog.events.EventType.KEYUP, this.searchClick_, false, this);

      // search buntton
      var btnSearch = this.element_.getElementsByTagName('button')["m-geosearch-search-btn"];
      goog.events.listen(btnSearch, goog.events.EventType.CLICK, this.searchClick_, false, this);

      // help buntton
      var btnHelp = this.element_.getElementsByTagName('button')["m-geosearch-help-btn"];
      goog.events.listen(btnHelp, goog.events.EventType.CLICK, function(evt) {
         evt.preventDefault();
         goog.dom.classlist.toggle(btnHelp, 'shown');
         this.helpClick_();
      }, false, this);

      // clear buntton
      var btnClean = this.element_.getElementsByTagName('button')["m-geosearch-clear-btn"];
      goog.events.listen(btnClean, goog.events.EventType.CLICK, this.clearClick_, false, this);

      // results container
      this.resultsContainer_ = this.element_.querySelector('div#m-geosearch-results');
      M.utils.enableTouchScroll(this.resultsContainer_);
      this.searchingResult_ = this.element_.querySelector('div#m-geosearch-results > div#m-searching-result');
   };

   /**
    * This function checks if an object is equals
    * to this control
    *
    * @private
    * @function
    */
   M.control.Geosearch.prototype.searchClick_ = function(evt) {
      evt.preventDefault();

      if ((evt.type !== goog.events.EventType.KEYUP) || (evt.keyCode === 13)) {
         // resets the results
         this.results_.length = 0;

         // gets the query
         var query = this.input_.value;
         if (M.utils.isNullOrEmpty(query)) {
            M.dialog.info('Debe introducir una búsqueda.');
         }
         else {
            this.search_(query, this.showResults_);
         }
      }
   };

   /**
    * This function checks if an object is equals
    * to this control
    *
    * @private
    * @function
    */
   M.control.Geosearch.prototype.resultClick_ = function(evt) {
      evt.preventDefault();
      // hidden results on click for mobile devices
      if (M.window.WIDTH <= M.config.MOBILE_WIDTH) {
         evt.target = this.resultsContainer_.querySelector('div.page > div.g-cartografia-flecha-arriba');
         this.resultsClick_(evt);
      }
      this.getImpl().facadeMap_.removePopup();
      var solrid = evt.currentTarget.id;
      this.getImpl().resultClick(solrid);
   };

   /**
    * This function checks if an object is equals
    * to this control
    *
    * @private
    * @function
    */
   M.control.Geosearch.prototype.search_ = function(query, processor) {
      goog.dom.appendChild(this.resultsContainer_, this.searchingResult_);

      this.searchTime_ = Date.now();

      // adds the class
      goog.dom.classlist.add(this.element_, M.control.Geosearch.SEARCHING_CLASS);

      var searchUrl = M.utils.addParameters(this.searchUrl_, {
         'q': query,
         'start': this.results_.length,
         'srs': this.facadeMap_.getProjection().code
      });

      /* Stores the current search time into a
         closure function. When the promise returns a
         value we compare the current search time
         (this_.searchTime) and the saved search time of
         the request (searchTime parameter).
         If they are different then aborts the response */
      var this_ = this;
      (function(searchTime) {
         M.remote.get(searchUrl).then(function(response) {
            // if it is the current search then show the results
            if (searchTime === this_.searchTime_) {
               var results;
               try {
                  results = JSON.parse(response.text);
               }
               catch (err) {
                  M.exception('La respuesta no es un JSON válido: ' + err);
               }
               processor.call(this_, results);
               goog.dom.classlist.remove(this_.element_, M.control.Geosearch.SEARCHING_CLASS);
            }
         });
      })(this.searchTime_);
   };

   /**
    * This function checks if an object is equals
    * to this control
    *
    * @private
    * @function
    */
   M.control.Geosearch.prototype.showResults_ = function(results) {
      // clears the layer
      this.getImpl().clear();

      // draws the results on the map
      this.drawResults(results);

      var resultsTemplateVars = this.parseResultsForTemplate_(results);
      var this_ = this;
      M.template.compile(M.control.Geosearch.RESULTS_TEMPLATE, {
         'jsonp': true,
         'vars': resultsTemplateVars
      }).then(function(html) {
         goog.dom.classlist.remove(this_.resultsContainer_, M.control.Geosearch.HIDDEN_RESULTS_CLASS);
         /* unregisters previous events */
         // scroll
         if (!M.utils.isNullOrEmpty(this_.resultsScrollContainer_)) {
            goog.events.unlisten(this_.resultsScrollContainer_, goog.events.EventType.SCROLL, this_.resultsScroll_, false, this_);
         }
         // results
         var resultsHtmlElements = this_.resultsContainer_.querySelectorAll(".result");
         var resultHtml;
         for (var i = 0, ilen = resultsHtmlElements.length; i < ilen; i++) {
            resultHtml = resultsHtmlElements.item(i);
            goog.events.unlisten(resultHtml, goog.events.EventType.CLICK, this_.resultClick_, false, this_);
         }
         if (results.response.docs.length > 0) {
            this_.zoomToResults();
         }

         // results buntton
         var btnResults = this_.resultsContainer_.querySelector('div.page > div.g-cartografia-flecha-arriba');
         if (!M.utils.isNullOrEmpty(btnResults)) {
            goog.events.unlisten(btnResults, goog.events.EventType.CLICK, this_.resultsClick_, false, this_);
         }

         // gets the new results scroll
         this_.resultsContainer_.innerHTML = html.innerHTML;
         this_.resultsScrollContainer_ = this_.resultsContainer_.querySelector("div#m-geosearch-results-scroll");
         // registers the new event
         M.utils.enableTouchScroll(this_.resultsScrollContainer_);
         goog.events.listen(this_.resultsScrollContainer_, goog.events.EventType.SCROLL, this_.resultsScroll_, false, this_);

         // adds new events
         resultsHtmlElements = this_.resultsContainer_.getElementsByClassName("result");
         for (i = 0, ilen = resultsHtmlElements.length; i < ilen; i++) {
            resultHtml = resultsHtmlElements.item(i);
            goog.events.listen(resultHtml, goog.events.EventType.CLICK, this_.resultClick_, false, this_);
         }

         // results buntton
         btnResults = this_.resultsContainer_.querySelector('div.page > div.g-cartografia-flecha-arriba');
         goog.events.listen(btnResults, goog.events.EventType.CLICK, this_.resultsClick_, false, this_);

         this_.checkScrollSearch_(results);

         this_.fire(M.evt.COMPLETED);
      });
   };

   /**
    * This function draws the results into the specified map
    *
    * @public
    * @function
    * @param {Array<Object>} results to draw
    * @api stable
    */
   M.control.Geosearch.prototype.drawResults = function(results) {
      this.getImpl().drawResults(results);
   };

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the control
    * @api stable
    */
   M.control.Geosearch.prototype.drawNewResults = function(results) {
      this.getImpl().drawNewResults(results);
   };

   /**
    * This function sets zoom to results
    *
    * @public
    * @function
    * @param {M.Map} map to add the control
    * @api stable
    */
   M.control.Geosearch.prototype.zoomToResults = function() {
      this.getImpl().zoomToResults();
   };

   /**
    * This function provides the input search
    *
    * @public
    * @function
    * @returns {HTMLElement} the input that executes the search
    * @api stable
    */
   M.control.Geosearch.prototype.getInput = function() {
      return this.input_;
   };

   /**
    * This function checks if an object is equals
    * to this control
    *
    * @private
    * @function
    */
   M.control.Geosearch.prototype.appendResults_ = function(results) {
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
   M.control.Geosearch.prototype.resultsScroll_ = function(evt) {
      var target = evt.target;
      var height = goog.style.getSize(target).height;
      var scrollHeight = target.scrollHeight;
      var scrollTop = target.scrollTop;

      var scrollPosition = scrollHeight - scrollTop;
      var scrollIsDown = ((scrollPosition - height) <= 15);
      if (scrollIsDown && this.scrollIsUp_) {
         this.scrollIsUp_ = false;
         this.scrollSearch_();
      }
      else if (!scrollIsDown) {
         // updates the scroll state
         this.scrollIsUp_ = true;
      }
   };

   /**
    * This function checks if an object is equals
    * to this control
    *
    * @private
    * @function
    */
   M.control.Geosearch.prototype.scrollSearch_ = function() {
      // unselects features
      this.getImpl().unselectResults(true);
      this.getImpl().setNewResultsAsDefault();

      // gets the query
      var query = this.input_.value;
      this.search_(query, this.appendResults_);
   };

   /**
    * This function checks if an object is equals
    * to this control
    *
    * @private
    * @function
    */
   M.control.Geosearch.prototype.helpClick_ = function(evt) {
      if (this.helpShown_ === true) {
         this.getImpl().hideHelp();
         this.helpShown_ = false;
      }
      else {
         var this_ = this;
         M.remote.get(this.helpUrl_).then(function(response) {
            var help;
            try {
               help = JSON.parse(response.text);
            }
            catch (err) {
               M.exception('La respuesta no es un JSON válido: ' + err);
            }
            M.template.compile(M.control.Geosearch.HELP_TEMPLATE, {
               'jsonp': true,
               'vars': {
                  'entities': help
               }
            }).then(function(html) {
               this_.getImpl().showHelp(html);
               this_.helpShown_ = true;
            });
         });
      }
   };

   /**
    * This function checks if an object is equals
    * to this control
    *
    * @private
    * @function
    */
   M.control.Geosearch.prototype.clearClick_ = function(evt) {
      goog.dom.classlist.remove(this.element_, "shown");
      if (!M.utils.isNullOrEmpty(this.input_)) {
         this.input_.value = '';
      }
      if (!M.utils.isNullOrEmpty(this.resultsContainer_)) {
         this.resultsContainer_.innerHTML = '';
      }
      if (!M.utils.isNullOrEmpty(this.resultsScrollContainer_)) {
         this.resultsScrollContainer_.innerHTML = '';
         this.resultsScrollContainer_ = null;
      }
      this.results_.length = 0;
      goog.dom.classlist.remove(this.resultsContainer_, M.control.Geosearch.HIDDEN_RESULTS_CLASS);
      this.getImpl().clear();
      this.spatialSearch_ = false;
   };

   /**
    * This function checks if an object is equals
    * to this control
    *
    * @private
    * @function
    */
   M.control.Geosearch.prototype.resultsClick_ = function(evt) {
      goog.dom.classlist.add(this.facadeMap_._areasContainer.getElementsByClassName("m-top m-right")[0],
         "top-extra-search");
      goog.dom.classlist.toggle(evt.target, 'g-cartografia-flecha-arriba');
      goog.dom.classlist.toggle(evt.target, 'g-cartografia-flecha-abajo');
      goog.dom.classlist.toggle(this.resultsContainer_, M.control.Geosearch.HIDDEN_RESULTS_CLASS);
   };

   /**
    * This function checks if an object is equals
    * to this control
    *
    * @function
    * @api stable
    */
   M.control.Geosearch.prototype.equals = function(obj) {
      var equals = false;
      if (obj instanceof M.control.Geosearch) {
         equals = (this.name === obj.name);
      }
      return equals;
   };

   /**
    * This function checks if an object is equals
    * to this control
    *
    * @private
    * @function
    */
   M.control.Geosearch.prototype.parseResultsForTemplate_ = function(results, append) {
      var search = '';
      if (!M.utils.isNullOrEmpty(this.input_)) {
         search = this.input_.value;
      }
      var total = 0;
      if (!M.utils.isUndefined(results.spatial_response)) {
         total = results.spatial_response.numFound;
         this.spatialSearch_ = true;
      }
      else {
         total = results.response.numFound;
         this.spatialSearch_ = false;
      }
      var docs = this.getDocsFromResults_(results);
      if (append === true) {
         this.results_ = this.results_.concat(docs);
      }
      else {
         this.results_ = docs;
      }
      var partial = (this.spatialSearch_ && M.utils.isNullOrEmpty(results.spatial_response.docs));
      var resultsTemplateVar = null;
      if (total !== 0) {
         resultsTemplateVar = {
            'docs': docs,
            'total': total,
            'partial': partial
         };
      }
      else {
         resultsTemplateVar = {
            'docs': docs,
            'total': total,
            'notResutls': true,
            'query': search
         };
      }
      return resultsTemplateVar;
   };

   /**
    * This function checks if an object is equals
    * to this control
    *
    * @private
    * @function
    */
   M.control.Geosearch.prototype.getDocsFromResults_ = function(results) {
      var docs = [];
      if (this.spatialSearch_) {
         docs = results.spatial_response.docs;
      }
      else {
         docs = results.response.docs;
      }
      var hiddenAttributes = ['geom', '_version_', 'keywords', 'solrid'];
      docs = docs.map(function(doc) {
         var attributes = [];
         for (var key in doc) {
            if (!M.utils.includes(hiddenAttributes, key)) {
               attributes.push({
                  'key': M.utils.beautifyAttributeName(key),
                  'value': doc[key]
               });
            }
         }
         return {
            'solrid': doc.solrid,
            'attributes': attributes
         };
      });
      return docs;
   };

   /**
    * Disables scroll if gets all results
    *
    * @private
    * @function
    */
   M.control.Geosearch.prototype.checkScrollSearch_ = function(results) {
      let total = 0;
      if (!M.utils.isUndefined(results.spatial_response)) {
         total = results.spatial_response.numFound;
      }
      else {
         total = results.response.numFound;
      }
      if ((this.results_.length === total) && (!M.utils.isNullOrEmpty(this.resultsScrollContainer_))) {
         goog.events.unlisten(this.resultsScrollContainer_, goog.events.EventType.SCROLL, this.resultsScroll_, false, this);
      }
   };

   /**
    * Name of this control
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.Geosearch.NAME = 'geosearch';

   /**
    * Template for this controls
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.Geosearch.TEMPLATE = 'geosearch.html';

   /**
    * Template for this controls
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.Geosearch.RESULTS_TEMPLATE = 'geosearchresults.html';

   /**
    * Template for this controls
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.Geosearch.HELP_TEMPLATE = 'geosearchhelp.html';

   /**
    * Template for this controls
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.Geosearch.SEARCHING_CLASS = 'm-searching';

   /**
    * Template for this controls
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.Geosearch.HIDDEN_RESULTS_CLASS = 'hidden';
})();