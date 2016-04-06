goog.provide('P.control.Geosearchbylocation');

goog.require('P.control.Geosearch');

(function() {
   /**
    * @classdesc
    * Main constructor of the class. Creates a Geosearchbylocation
    * Control to display nearby points of interest to your location
    *
    * @constructor
    * @extends {Geosearch}
    * @api stable
    */
   M.control.Geosearchbylocation = (function(url, core, handler, distance, spatialField, rows, searchParameters) {
      /**
       * Status button Geosearchbylocation
       * @private
       * @type {Boolean}
       */
      this.activate_ = true;

      /**
       * Status button Mostar Lista
       * @private
       * @type {Boolean}
       */
      this.activatebtnList_ = true;

      /**
       * Parameters to the URL for the request
       * @private
       * @type {Object}
       */
      this.searchParameters_ = searchParameters;

      /**
       * Distance to the URL for the request
       * @private
       * @type {Object}
       */
      this.distance_ = distance;

      /**
       * Spatial field to the URL for the request
       * @private
       * @type {Object}
       */
      this.spatialField_ = spatialField;

      /**
       * Rows to the URL for the request
       * @private
       * @type {Object}
       */
      this.rows_ = rows;

      /**
       * Search URL
       * @private
       * @type {String}
       */
      this.searchUrl_ = M.utils.concatUrlPaths([url, core, handler]);

      // checks if the implementation can create Geosearchbylocation Control
      if (M.utils.isUndefined(M.impl.control.Geosearchbylocation)) {
         M.exception('La implementación usada no puede crear controles Geosearchbylocation');
      }

      // calls super
      goog.base(this, url, core, handler, searchParameters);

      // modifies the name for this control
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
    * @function
    * @returns {Boolean}
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
    * @returns {Promise}
    * @api stable
    */
   M.control.Geosearchbylocation.prototype.createView = function(map) {
      return M.template.compile(M.control.Geosearchbylocation.TEMPLATE);
   };

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the control
    * @api stable
    */
   M.control.Geosearchbylocation.prototype.addEvents = function(html) {};

   /**
    * TODO
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
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the control
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
    * If active is true content removed, otherwise it will display the content
    * @param {Boolean} active decides whether to display the contents or delete
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
    * This function calls the function drawLocation implementation
    * @param {Array} coor location coordinates
    * @private
    * @function
    */
   M.control.Geosearchbylocation.prototype.drawLocation_ = function(coor) {
      this.getImpl().drawLocation(coor);
   };


   /**
    * This function builds the request URL and the requesting
    * @param {String} coorTrans formatted coordinates with WKT
    * @param {Array} coor coordinates
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
               this_.map_.setCenter(coor).setZoom(12);
               goog.dom.classlist.remove(this_.activationBtn_, M.control.Geosearch.HIDDEN_RESULTS_CLASS);
               goog.dom.classlist.remove(this_.element_, M.control.Geosearch.SEARCHING_CLASS);
            }
         });
      })(this.searchTime_);
   };

   /**
    * This function adds a button click event to show list
    *
    * @private
    * @function
    * @param {Object} results query results
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
    * @param {Object} results query results
    */
   M.control.Geosearchbylocation.prototype.showList_ = function() {
      var this_ = this;
      if (this.showList === true) {
         var resultsTemplateVars = this_.parseResultsForTemplate_(this.results);
         M.template.compile(M.control.Geosearchbylocation.RESULTS_TEMPLATE, resultsTemplateVars).then(function(html) {
            this_.resultsContainer_ = html;
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
    * Name of this control
    *
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.control.Geosearchbylocation.NAME = 'geosearchbylocation';

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