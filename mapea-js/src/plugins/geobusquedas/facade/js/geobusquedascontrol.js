goog.provide('P.control.Geobusquedas');

goog.require('goog.dom.classlist');
goog.require('goog.events');
goog.require('goog.style');

(function () {
   /**
    * @classdesc
    * Main constructor of the class. Creates a WMCSelector
    * control to provides a way to select an specific WMC
    *
    * @constructor
    * @extends {M.Control}
    * @api stable
    */
   M.control.Geobusquedas = (function (url, core, handler, searchParameters) {
      // checks if the implementation can create WMC layers
      if (M.utils.isUndefined(M.impl.control.Geobusquedas)) {
         M.exception('La implementación usada no puede crear controles Geobusquedas');
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

      // implementation of this control
      var impl = new M.impl.control.Geobusquedas();

      goog.base(this, impl);
   });
   goog.inherits(M.control.Geobusquedas, M.Control);

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the control
    * @api stabletrue
    */
   M.control.Geobusquedas.prototype.createView = function (map) {
      var this_ = this;
      var promise = new Promise(function (success, fail) {
         M.template.compile(M.control.Geobusquedas.TEMPLATE).then(function (html) {
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
   M.control.Geobusquedas.prototype.addEvents = function (html) {
      this.element_ = html;

      // input search
      this.input_ = this.element_.getElementsByTagName('input')["m-geobusquedas-search-input"];
      goog.events.listen(this.input_, goog.events.EventType.KEYUP, this.searchClick_, false, this);

      // search buntton
      var btnSearch = this.element_.getElementsByTagName('button')["m-geobusquedas-search-btn"];
      goog.events.listen(btnSearch, [
               goog.events.EventType.CLICK,
               goog.events.EventType.TOUCHEND
            ], this.searchClick_, false, this);

      // help buntton
      var btnHelp = this.element_.getElementsByTagName('button')["m-geobusquedas-help-btn"];
      goog.events.listen(btnHelp, [
               goog.events.EventType.CLICK,
               goog.events.EventType.TOUCHEND
            ], this.helpClick_, false, this);

      // clear buntton
      var btnClean = this.element_.getElementsByTagName('button')["m-geobusquedas-clear-btn"];
      goog.events.listen(btnClean, [
               goog.events.EventType.CLICK,
               goog.events.EventType.TOUCHEND
            ], this.clearClick_, false, this);

      // results buntton
      var btnResults = this.element_.getElementsByTagName('button')["m-geobusquedas-results-btn"];
      goog.events.listen(btnResults, [
               goog.events.EventType.CLICK,
               goog.events.EventType.TOUCHEND
            ], this.resultsClick_, false, this);

      // results container
      this.resultsContainer_ = this.element_.getElementsByTagName('div')["m-geobusquedas-results"];
   };

   /**
    * This function checks if an object is equals
    * to this control
    *
    * @private
    * @function
    */
   M.control.Geobusquedas.prototype.searchClick_ = function (evt) {
      evt.preventDefault();

      if ((evt.type !== goog.events.EventType.KEYUP) || (evt.keyCode === 13)) {
         // resets the results
         this.results_.length = 0;

         // gets the query
         var query = this.input_.value;
         if (M.utils.isNullOrEmpty(query)) {
            window.alert('Debe introducir una búsqueda');
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
   M.control.Geobusquedas.prototype.resultClick_ = function (evt) {
      evt.preventDefault();

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
   M.control.Geobusquedas.prototype.search_ = function (query, processor) {
      this.searchTime_ = Date.now();

      // adds the class
      goog.dom.classlist.add(this.element_, M.control.Geobusquedas.SEARCHING_CLASS);

      var searchUrl = M.utils.addParameters(this.searchUrl_, {
         q: query,
         start: this.results_.length
      });

      /* Stores the current search time into a
         closure function. When the promise returns a
         value we compare the current search time
         (this_.searchTime) and the saved search time of
         the request (searchTime parameter).
         If they are different then aborts the response */
      var this_ = this;
      (function (searchTime) {
         M.remote.get(searchUrl).then(function (response) {
            // if it is the current search then show the results
            if (searchTime === this_.searchTime_) {
               var results;
               try {
                  results = JSON.parse(response.responseTxt);
               }
               catch (err) {
                  M.exception('La respuesta no es un JSON válido: ' + err);
               }
               processor.call(this_, results);
               goog.dom.classlist.remove(this_.element_, M.control.Geobusquedas.SEARCHING_CLASS);
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
   M.control.Geobusquedas.prototype.showResults_ = function (results) {
      // clears the layer
      this.getImpl().clear();

      // draws the results on the map
      this.drawResults(results);

      var resultsTemplateVars = this.parseResultsForTemplate_(results);
      var this_ = this;
      M.template.compile(M.control.Geobusquedas.RESULTS_TEMPLATE, resultsTemplateVars).then(function (html) {
         this_.resultsContainer_.innerHTML = html.innerHTML;

         // unregisters previous events
         if (!M.utils.isNullOrEmpty(this_.resultsScrollContainer_)) {
            goog.events.unlisten(this_.resultsScrollContainer_, goog.events.EventType.SCROLL, this_.resultsScroll_, false, this_);
         }

         // gets the new results scroll
         this_.resultsScrollContainer_ = this_.resultsContainer_.getElementsByTagName("div")["m-geobusquedas-results-scroll"];
         // registers the new event
         goog.events.listen(this_.resultsScrollContainer_, goog.events.EventType.SCROLL, this_.resultsScroll_, false, this_);

         var resultsHtmlElements = this_.resultsContainer_.getElementsByClassName("result");
         for (var i = 0, ilen = resultsHtmlElements.length; i < ilen; i++) {
            var resultHtml = resultsHtmlElements.item(i);
            goog.events.listen(resultHtml, [
               goog.events.EventType.CLICK,
               goog.events.EventType.TOUCHEND], this_.resultClick_, false, this_);
         }
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
   M.control.Geobusquedas.prototype.drawResults = function (results) {
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
   M.control.Geobusquedas.prototype.drawNewResults = function (results) {
      this.getImpl().drawNewResults(results);
   };

   /**
    * This function provides the input search
    *
    * @public
    * @function
    * @returns {HTMLElement} the input that executes the search
    * @api stable
    */
   M.control.Geobusquedas.prototype.getInput = function () {
      return this.input_;
   };

   /**
    * This function checks if an object is equals
    * to this control
    *
    * @private
    * @function
    */
   M.control.Geobusquedas.prototype.appendResults_ = function (results) {
      // draws the new results on the map
      this.drawNewResults(results);

      var resultsTemplateVars = this.parseResultsForTemplate_(results, true);
      var this_ = this;
      M.template.compile(M.control.Geobusquedas.RESULTS_TEMPLATE, resultsTemplateVars).then(function (html) {
         // appends the new results
         var newResultsScrollContainer = html.getElementsByTagName("div")["m-geobusquedas-results-scroll"];
         var newResults = newResultsScrollContainer.children;
         var newResult;
         while ((newResult = newResults.item(0)) !== null) {
            this_.resultsScrollContainer_.appendChild(newResult);
            goog.events.listen(newResult, [
               goog.events.EventType.CLICK,
               goog.events.EventType.TOUCHEND], this_.resultClick_, false, this_);
         }

         // updates the found num elements
         var spanNumFound = this_.resultsContainer_.getElementsByTagName("span")["m-geobusquedas-page-found"];
         spanNumFound.innerHTML = this_.results_.length;
      });
   };

   /**
    * This function checks if an object is equals
    * to this control
    *
    * @private
    * @function
    */
   M.control.Geobusquedas.prototype.resultsScroll_ = function (evt) {
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
   M.control.Geobusquedas.prototype.scrollSearch_ = function () {
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
   M.control.Geobusquedas.prototype.helpClick_ = function (evt) {
      if (this.helpShown_ === true) {
         this.getImpl().hideHelp();
         this.helpShown_ = false;
      }
      else {
         var this_ = this;
         M.remote.get(this.helpUrl_).then(function (response) {
            var help;
            try {
               help = JSON.parse(response.responseTxt);
            }
            catch (err) {
               M.exception('La respuesta no es un JSON válido: ' + err);
            }
            M.template.compile(M.control.Geobusquedas.HELP_TEMPLATE, {
               'entities': help
            }).then(function (html) {
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
   M.control.Geobusquedas.prototype.clearClick_ = function (evt) {
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
      this.getImpl().clear();
   };

   /**
    * This function checks if an object is equals
    * to this control
    *
    * @private
    * @function
    */
   M.control.Geobusquedas.prototype.resultsClick_ = function (evt) {
      if (goog.dom.classlist.contains(this.resultsContainer_, M.control.Geobusquedas.HIDDEN_RESULTS_CLASS)) {
         goog.dom.classlist.remove(this.resultsContainer_, M.control.Geobusquedas.HIDDEN_RESULTS_CLASS);
      }
      else {
         goog.dom.classlist.add(this.resultsContainer_, M.control.Geobusquedas.HIDDEN_RESULTS_CLASS);
      }
   };

   /**
    * This function checks if an object is equals
    * to this control
    *
    * @function
    * @api stable
    */
   M.control.Geobusquedas.prototype.equals = function (obj) {
      var equals = false;
      if (obj instanceof M.control.Geobusquedas) {
         equals = (this.name === obj.name);
      }
      return equals;
   };

   /**
    * function adds the event 'click'
    * 
    * @public
    * @function
    * @api stable
    */
   M.control.Geobusquedas.prototype.destroy = function () {
      this.getImpl().destroy();
      this.template_ = null;
      this.impl = null;
   };

   /**
    * This function checks if an object is equals
    * to this control
    *
    * @private
    * @function
    */
   M.control.Geobusquedas.prototype.parseResultsForTemplate_ = function (results, append) {
      var total = 0;
      if (!M.utils.isUndefined(results.spatial_response)) {
         total = results.spatial_response.numFound;
      }
      if (total === 0) {
         total = results.response.numFound;
      }
      var docs = this.getDocsFromResults_(results);
      if (append === true) {
         this.results_ = this.results_.concat(docs);
      }
      else {
         this.results_ = docs;
      }
      var partial = (!M.utils.isUndefined(results.spatial_response) && M.utils.isNullOrEmpty(results.spatial_response.docs));
      var resultsTemplateVar = {
         'docs': docs,
         'total': total,
         'partial': partial
      };
      return resultsTemplateVar;
   };

   /**
    * This function checks if an object is equals
    * to this control
    *
    * @private
    * @function
    */
   M.control.Geobusquedas.prototype.getDocsFromResults_ = function (results) {
      var docs = [];
      if (!M.utils.isNullOrEmpty(results.spatial_response)) {
         docs = results.spatial_response.docs;
      }
      if (M.utils.isNullOrEmpty(docs)) {
         docs = results.response.docs;
      }
      var hiddenAttributes = ['geom', '_version_', 'keywords', 'solrid'];
      docs = docs.map(function (doc) {
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
    * Template for this controls
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.Geobusquedas.TEMPLATE = 'geobusquedas.html';

   /**
    * Template for this controls
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.Geobusquedas.RESULTS_TEMPLATE = 'geobusquedasresults.html';

   /**
    * Template for this controls
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.Geobusquedas.HELP_TEMPLATE = 'geobusquedashelp.html';

   /**
    * Template for this controls
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.Geobusquedas.SEARCHING_CLASS = 'searching';

   /**
    * Template for this controls
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.Geobusquedas.HIDDEN_RESULTS_CLASS = 'hidden';
})();