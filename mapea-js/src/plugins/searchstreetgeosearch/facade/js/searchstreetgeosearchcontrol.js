goog.provide('P.control.SearchstreetGeosearch');

goog.require('P.control.SearchstreetIntegrated');
goog.require('P.control.GeosearchIntegrated');

(function() {
   /**
    * @classdesc Main constructor of the class. Creates a SearchstreetGeosearch
    * control to search streets and geosearchs
    *
    * @constructor
    * @extends {M.Control}
    * @param {Mx.parameters.SearchstreetGeosearch} parameters - parameters SearchstreetGeosearch
    * @api stable
    */
   M.control.SearchstreetGeosearch = (function(parameters) {
      // checks if the implementation can create SearchstreetGeosearch
      if (M.utils.isUndefined(M.impl.control.SearchstreetGeosearch)) {
         M.exception('La implementación usada no puede crear controles SearchStreetGeosearch');
      }

      /**
       * Parameters SearchstreetGeosearch
       *
       * @private
       * @type {Mx.parameters.SearchstreetGeosearch}
       */
      parameters = (parameters || {});

      /**
       * INE code to specify the search
       *
       * @private
       * @type {number}
       */
      if (!M.utils.isNullOrEmpty(parameters.locality)) {
         this.locality_ = parameters.locality;
      }
      
      /**
       * Search URL - Searchstreet
       *
       * @private
       * @type {string}
       */
      this.urlSearchstret_ = M.config.SEARCHSTREET_URL;

      /**
       * Search URL - Geosearch
       *
       * @private
       * @type {string}
       */
      this.urlGeosearch_ = M.config.GEOSEARCH_URL;

      /**
       * Core to the URL for the query - Geosearch
       * @private
       * @type {string}
       */
      this.coreGeosearch_ = M.config.GEOSEARCH_CORE;

      /**
       * Handler to the URL for the query - Geosearch
       * @private
       * @type {string}
       */
      this.handlerGeosearch_ = M.config.GEOSEARCH_HANDLER;

      /**
       * Others parameters for Geosearch
       * @private
       * @type {String}
       */
      this.paramsGeosearch_ = parameters.paramsGeosearch || {};

      /**
       * Input SearchstreetGeosearch
       *
       * @private
       * @type {HTMLElement}
       */
      this.input_ = null;

      /**
       * Control Searchstreet
       *
       * @public
       * @type {M.control.SearchstreetIntegrated}
       * @api stable
       */
      this.ctrlSearchstreet = null;

      /**
       * Control Geosearch
       *
       * @public
       * @type {M.control.GeosearchIntegrated}
       * @api stable
       */
      this.ctrlGeosearch = null;

      /**
       * Name plugin
       *
       * @private
       * @type {string}
       */
      this.name_ = "searchstreetgeosearch";

      /**
       * Template SearchstreetGeosearch
       *
       * @private
       * @type {HTMLElement}
       */
      this.element_ = null;

      /**
       * Facade of the map
       * @private
       * @type {M.Map}
       */
      this.facadeMap_ = null;

      // implementation of this control
      var impl = new M.impl.control.SearchstreetGeosearch();

      goog.base(this, impl, this.name_);
   });
   goog.inherits(M.control.SearchstreetGeosearch, M.Control);


   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map - Map to add the plugin
    * @api stable
    * @export
    */
   M.control.SearchstreetGeosearch.prototype.addTo = function(map) {
      var this_ = this;
      var impl = this.getImpl();
      this.facadeMap_ = map;
      var view = this.createView(map);
      if (view instanceof Promise) { // the view is a promise
         view.then(function(html) {
            impl.addTo(map, html);
            this_.html = html;
            this_.fire(M.evt.ADDED_TO_MAP);
         });
      }

      this.on(M.evt.ADDED_TO_MAP, function(evt) {
         if (M.utils.isUndefined(this_.locality_)) {
            this_.ctrlSearchstreet = new M.control.SearchstreetIntegrated(this_.urlSearchstret_);
         }
         else {
            this_.ctrlSearchstreet = new M.control.SearchstreetIntegrated(this_.urlSearchstret_, this_.locality_);
         }
         var impl = this_.ctrlSearchstreet.getImpl();
         var view = this_.ctrlSearchstreet.createView(this_.html, map);
         impl.addTo(map, this_.html);

         this_.ctrlGeosearch = new M.control.GeosearchIntegrated(this_.urlGeosearch_, this_.coreGeosearch_,
            this_.handlerGeosearch_, this_.paramsGeosearch_);
         impl = this_.ctrlGeosearch.getImpl();
         view = this_.ctrlGeosearch.createView(this_.html, this_.facadeMap_);
         impl.addTo(map, this_.html);

         var completados = false;

         this_.ctrlSearchstreet.on(M.evt.COMPLETED, function() {
            if (completados === true) {
               goog.dom.classlist.add(this_.element_,
                  "shown");
               completados = false;
               this_.zoomResults();
            }
            completados = true;
         }, this);

         this_.ctrlGeosearch.on(M.evt.COMPLETED, function() {
            if (completados === true) {
               goog.dom.classlist.add(this_.element_,
                  "shown");
               completados = false;
               this_.zoomResults();
            }
            completados = true;
         }, this);
      });
   };


   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map - Map to add the control
    * @returns {Promise} HTML template
    * @api stable
    */
   M.control.SearchstreetGeosearch.prototype.createView = function(map) {
      var this_ = this;
      var promise = new Promise(function(success, fail) {
         M.template.compile(M.control.SearchstreetGeosearch.TEMPLATE, {
            'jsonp': true
         }).then(
            function(html) {
               this_.element_ = html;
               this_.input_ = html.querySelector("input#m-searchstreetgeosearch-search-input");
               var searchstreetResuts = html.querySelector('div#m-searchstreet-results');
               var geosearchResuts = html.querySelector('div#m-geosearch-results');
               var searchstreetTab = html.querySelector("ul#m-tabs > li:nth-child(1) > a");
               var geosearchTab = html.querySelector("ul#m-tabs > li:nth-child(2) > a");
               goog.events.listen(searchstreetTab, goog.events.EventType.CLICK, function(evt) {
                  evt.preventDefault();
                  if (!goog.dom.classlist.contains(searchstreetTab, 'activated')) {
                     goog.dom.classlist.add(searchstreetTab, 'activated');
                     goog.dom.classlist.remove(geosearchTab, 'activated');
                     goog.dom.classlist.add(searchstreetResuts, 'show');
                     goog.dom.classlist.remove(geosearchResuts, 'show');
                  }
               }, false, this);
               goog.events.listen(geosearchTab, goog.events.EventType.CLICK, function(evt) {
                  evt.preventDefault();
                  if (!goog.dom.classlist.contains(geosearchTab, 'activated')) {
                     goog.dom.classlist.add(geosearchTab, 'activated');
                     goog.dom.classlist.remove(searchstreetTab, 'activated');
                     goog.dom.classlist.remove(searchstreetResuts, 'show');
                     goog.dom.classlist.add(geosearchResuts, 'show');
                  }
               }, false, this);
               success(html);
            });
      });
      return promise;
   };

   /**
    * This query returns the input SearchstreetGeosearch
    *
    * @public
    * @function
    * @returns {HTMLElement} Input SearchstreetGeosearch
    * @api stable
    */
   M.control.SearchstreetGeosearch.prototype.getInput = function() {
      return this.input_;
   };


   /**
    * This function checks if an object is equals to this control
    *
    * @function
    * @api stable
    * @param {*} obj - Object to compare
    * @returns {boolean} equals - Returns if they are equal or not
    */
   M.control.SearchstreetGeosearch.prototype.equals = function(obj) {
      var equals = false;
      if (obj instanceof M.control.SearchstreetGeosearch) {
         equals = (this.name === obj.name);
      }
      return equals;
   };


   /**
    * This function return HTML template
    *
    * @public
    * @function
    * @returns {HTMLElement} HTML template
    * @api stable
    */
   M.control.SearchstreetGeosearch.prototype.getHtml = function() {
      return this.element_;
   };

   /**
    * This function zoom results
    *
    * @public
    * @function
    * @api stable
    */
   M.control.SearchstreetGeosearch.prototype.zoomResults = function() {
      this.getImpl().zoomResults();
   };

   /**
    * Template for this controls
    *
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.SearchstreetGeosearch.TEMPLATE = 'searchstreetgeosearch.html';

})();