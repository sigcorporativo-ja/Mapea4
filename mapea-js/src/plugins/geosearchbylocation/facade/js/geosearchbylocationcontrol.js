goog.provide('P.control.Geosearchbylocation');

goog.require('P.control.Geosearch');

(function() {
   /**
    * @classdesc
    * Main constructor of the class. Creates a Geosearchbylocation
    * Control to display nearby points of interest to your location
    *
    * @constructor
    * @param {string} url - URL for the query
    * @param {string} core - Core to the URL for the query
    * @param {string} handler - Handler to the URL for the query
    * @param {number} distance - Distance search
    * @param {string} spatialField - Spatial field
    * @param {number} rows - Number of responses allowed
    * @extends {M.control.Geosearch}
    * @api stable
    */
   M.control.Geosearchbylocation = (function(url, core, handler, distance, spatialField, rows) {
      /**
       * Status button 'Geosearchbylocation'
       * @private
       * @type {boolean}
       */
      this.activate_ = true;

      /**
       * Status button 'List' Geosearchbylocation
       * @private
       * @type {boolean}
       */
      this.activatebtnList_ = true;

      /**
       * Distance search
       * @private
       * @type {number}
       */
      this.distance_ = distance;

      /**
       * Spatial field
       * @private
       * @type {string}
       */
      this.spatialField_ = spatialField;

      /**
       * Number of responses allowed
       * @private
       * @type {number}
       */
      this.rows_ = rows;

      /**
       * URL for the query
       * @private
       * @type {string}
       */
      this.searchUrl_ = M.utils.concatUrlPaths([url, core, handler]);

      /**
       * Facade Map
       * @private
       * @type {M.map}
       */
      this.facadeMap_ = null;

      /**
       * Container of the results to scroll
       * @private
       * @type {HTMLElement}
       */
      this.resultsScrollContainer_ = null;

      // checks if the implementation can create Geosearchbylocation Control
      if (M.utils.isUndefined(M.impl.control.Geosearchbylocation)) {
         M.exception('La implementación usada no puede crear controles Geosearchbylocation');
      }

      // calls super
      goog.base(this, url, core, handler);

      // name for this control
      this.name = M.control.Geosearchbylocation.NAME;

      // implementation of this control
      var impl = new M.impl.control.Geosearchbylocation(this.searchUrl_);
      this.setImpl(impl);
   });
   goog.inherits(M.control.Geosearchbylocation, M.control.Geosearch);

   /**
    * This function checks if an object is equals
    * to this control
    *
    * @public
    * @function
    * @param {*} obj - Object to compare
    * @returns {boolean} equals - Returns if they are equal or not
    * @api stable
    */
   M.control.Geosearchbylocation.prototype.equals = function(obj) {
      var equals = false;
      if (obj instanceof M.control.Geosearchbylocation) {
         equals = (this.name === obj.name);
      }
      return equals;
   };

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map - Facade map
    * @returns {Promise} HTML template
    * @api stable
    */
   M.control.Geosearchbylocation.prototype.createView = function(map) {
      this.facadeMap_ = map;
      return M.template.compile(M.control.Geosearchbylocation.TEMPLATE, {
         'jsonp': true
      });
   };

   /**
    * This function returns the HTML control button
    *
    * @public
    * @function
    * @param {HTMLElement} html to add the plugin
    * @api stable
    * @export
    */
   M.control.Geosearchbylocation.prototype.getActivationButton = function(element) {
      return element.querySelector('button#m-geosearchbylocation-button');
   };

   /**
    * This function enables search
    *
    * @public
    * @function
    * @api stable
    */
   M.control.Geosearchbylocation.prototype.activate = function() {
      goog.dom.classlist.add(this.element_, 'activated');
      goog.dom.classlist.add(this.element_, M.control.Geosearch.SEARCHING_CLASS);
      var this_ = this;
      this.getImpl().locate().then(function(coor) {
         var pointGeom = new ol.geom.Point(coor);
         var format = new ol.format.WKT();
         var coorTrans = format.writeGeometry(pointGeom);
         this_.searchFrom_(coorTrans, coor);
      });
   };

   /**
    * This feature disables the search and delete the contents displayed by this control
    * @public
    * @function
    * @api stable
    */
   M.control.Geosearchbylocation.prototype.deactivate = function() {
      goog.dom.classlist.remove(this.element_, 'activated');
      this.getImpl().clear();
      this.getImpl().removeLocate();
      this.getImpl().removeResultsContainer(this.resultsContainer_);
   };

   /**
    * This function draws the location on the map
    * @param {array} coor - Location coordinates
    * @private
    * @function
    */
   M.control.Geosearchbylocation.prototype.drawLocation_ = function(coor) {
      this.getImpl().drawLocation(coor);
   };


   /**
    * This function performs search
    *
    * @param {string} coorTrans - Formatted coordinates with WKT
    * @param {array} coor - Coordinates
    * @private
    * @function
    */
   M.control.Geosearchbylocation.prototype.searchFrom_ = function(coorTrans, coor) {
      var searchUrl = null;
      searchUrl = M.utils.addParameters(this.searchUrl_, {
         'wt': 'json',
         'pt': coorTrans,
         'q': '*:*',
         'start': 0,
         'd': this.distance_,
         'spatialField': this.spatialField_,
         'rows': this.rows_,
         'srs': this.map_.getProjection().code
      });

      this.searchTime_ = Date.now();
      var this_ = this;
      /* uses closure to keep the search time and it checks
       if the response is about the last executed search */
      (function(searchTime) {
         M.remote.get(searchUrl).then(function(response) {
            // if searchTime was updated by this promise then this is the last
            if (searchTime === this_.searchTime_) {
               var results;
               try {
                  results = JSON.parse(response.text);
               }
               catch (err) {
                  M.exception('La respuesta no es un JSON válido: ' + err);
               }
               this_.showResults_(results);
               this_.drawLocation_(coor);
               this_.zoomToResultsAll_();
               goog.dom.classlist.remove(this_.activationBtn_, M.control.Geosearch.HIDDEN_RESULTS_CLASS);
               goog.dom.classlist.remove(this_.element_, M.control.Geosearch.SEARCHING_CLASS);
            }
         });
      })(this.searchTime_);
   };

   /**
    * This function zooms results
    *
    * @private
    * @function
    */
   M.control.Geosearchbylocation.prototype.zoomToResultsAll_ = function() {
      this.getImpl().zoomToResultsAll();
   };

   /**
    * This function clear map. draw results and adds a button click event to show list
    *
    * @private
    * @function
    * @param {object} results - Query results
    */
   M.control.Geosearchbylocation.prototype.showResults_ = function(results) {
      // clears the layer
      this.getImpl().clear();

      this.results = results;
      this.showList = true;

      // draws the results on the map
      this.drawResults(results);

      var btnShowList = this.element_.querySelector('button#m-geosearchbylocation-button-list');
      goog.events.listen(btnShowList, goog.events.EventType.CLICK, this.showList_, false, this);
   };

   /**
    * This function adds a button click event to show list
    *
    * @private
    * @function
    */
   M.control.Geosearchbylocation.prototype.showList_ = function() {
      var this_ = this;
      if (this.showList === true) {
         var resultsTemplateVars = this_.parseResultsForTemplate_(this.results);
         M.template.compile(M.control.Geosearchbylocation.RESULTS_TEMPLATE, {
            'jsonp': true,
            'vars': resultsTemplateVars
         }).then(function(html) {
            this_.resultsContainer_ = html;
            this_.resultsScrollContainer_ = this_.resultsContainer_.querySelector("div#m-geosearchbylocation-results-scroll");
            M.utils.enableTouchScroll(this_.resultsScrollContainer_);
            this_.getImpl().addResultsContainer(this_.resultsContainer_);
            var resultsHtmlElements = this_.resultsContainer_.getElementsByClassName("result");
            for (var i = 0, ilen = resultsHtmlElements.length; i < ilen; i++) {
               var resultHtml = resultsHtmlElements.item(i);
               goog.events.listen(resultHtml, goog.events.EventType.CLICK, function(evt) {
                  this.resultClick_(evt);
                  this.getImpl().removeResultsContainer(this.resultsContainer_);
                  this.showList = true;
               }, false, this_);
            }
            var btnCloseList = html.querySelector('.title > button.m-panel-btn');
            goog.events.listen(btnCloseList, goog.events.EventType.CLICK, this_.showList_, false, this_);
         });
         this.showList = false;
      }
      else {
         this_.getImpl().removeResultsContainer(this_.resultsContainer_);
         this.showList = true;
      }

   };

   /**
    * This function add/remove 'hidden' class
    *
    * @private
    * @function
    * @param {goog.events.BrowserEvent} evt - Keypress event
    */
   M.control.Geosearchbylocation.prototype.resultsClick_ = function(evt) {
      goog.dom.classlist.toggle(this.resultsContainer_, M.control.Geosearch.HIDDEN_RESULTS_CLASS);
   };

   /**
    * Name of this control
    *
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.Geosearchbylocation.NAME = 'geosearchbylocation';

   /**
    * Hidden class
    *
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.Geosearchbylocation.HIDDEN = 'hidden';

   /**
    * Template for this controls
    *
    * @const
    * @type {string}
    * @public
    * @api stable
    */

   M.control.Geosearchbylocation.TEMPLATE = 'geosearchbylocation.html';

   /**
    * Template for show results
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.Geosearchbylocation.RESULTS_TEMPLATE = 'geosearchbylocationresults.html';

})();