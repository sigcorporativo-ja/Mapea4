goog.provide('P.control.Geosearchbylocation');

goog.require('P.control.Geobusquedas');

(function () {
   /**
    * @classdesc
    * Main constructor of the class. Creates a Geosearchbylocation
    * Control to display nearby points of interest to your location
    *
    * @constructor
    * @extends {M.control.Geobusquedas}
    * @api stable
    */
   M.control.Geosearchbylocation = (function (url, core, handler, distance, spatialField, rows, searchParameters) {
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

      // implementation of this control
      var impl = new M.impl.control.Geosearchbylocation(this.searchUrl_);
      this.setImpl(impl);
   });
    goog.inherits(M.control.Geosearchbylocation, M.control.Geobusquedas);
   
   /**
    * This function checks if an object is equals
    * to this control
    * 
    * @function
    * @returns {Boolean}
    * @api stable
    */
   M.control.Geosearchbylocation.prototype.equals = function (obj) {
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
   M.control.Geosearchbylocation.prototype.createView = function (map) {
      var this_ = this;
      var promise = new Promise(function (success, fail) {
         M.template.compile(M.control.Geosearchbylocation.TEMPLATE).then(function (html) {
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
   M.control.Geosearchbylocation.prototype.addEvents = function (html) {
      this.element_ = html;
      var button = html.getElementsByTagName('button')['m-geosearchbylocation-button'];
      goog.dom.classlist.add(html.getElementsByTagName('button')['m-geosearchbylocation-button-list'],'m-geosearchbylocation-button-list');
      goog.events.listen(button, [goog.events.EventType.CLICK, goog.events.EventType.TOUCHEND],
         function (e) {
            this.locate(this.activate_);
         }, false, this);
   };
   
   /**
    * If active is true content removed, otherwise it will display the content
    * @param {Boolean} active decides whether to display the contents or delete
    * @public
    * @function
    * @api stable
    */
   M.control.Geosearchbylocation.prototype.locate = function (active) {
      var ob = this;
      if(active === true){
         this.getImpl().locate().then(function (coor){
            var pointGeom = new ol.geom.Point(coor);
            var format = new ol.format.WKT();
            var coorTrans = format.writeGeometry(pointGeom);
            ob.searchFrom_(coorTrans, coor);
            ob.activate_ = false;
         });
      }else{
         this.getImpl().clear();
         this.getImpl().removeLocate();
         goog.dom.classlist.add(document.getElementsByTagName('button')['m-geosearchbylocation-button-list'],'m-geosearchbylocation-button-list');
         var btnShowList = document.getElementsByTagName('button')["m-geosearchbylocation-button-list"];
         this.getImpl().removeResultsContainer(this.resultsContainer_);
         this.activate_ = true;
      }
   };
   
   /**
    * This function calls the function drawLocation implementation
    * @param {Array} coor location coordinates
    * @private
    * @function
    */
   M.control.Geosearchbylocation.prototype.drawLocation_ = function (coor) {
      this.getImpl().drawLocation(coor);
   };
   
   
   /**
    * This function builds the request URL and the requesting
    * @param {String} coorTrans formatted coordinates with WKT
    * @param {Array} coor coordinates
    * @private
    * @function
    */
   M.control.Geosearchbylocation.prototype.searchFrom_ = function (coorTrans, coor) {
      var this_ = this;
      this.searchTime_ = Date.now();
         var searchUrl = null;
         searchUrl = M.utils.addParameters(this.searchUrl_, {
            wt: 'json',
            pt: coorTrans,
            q: '*:*',
            start: 0,
            d: this.distance_,
            spatialField: this.spatialField_,
            row: this.rows_,
            srs: this.map_.getProjection().code
        });
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
                  this_.showResults_(results);
                  this_.drawLocation_(coor);
                  goog.dom.classlist.remove(document.getElementsByTagName('button')['m-geosearchbylocation-button-list'],'m-geosearchbylocation-button-list');
                  goog.dom.classlist.remove(document.getElementById("m-geosearchbylocation-div"),'m-geosearchbylocation-div-load');
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
      M.control.Geosearchbylocation.prototype.showResults_ = function (results) {
         // clears the layer
         this.getImpl().clear();
         
         this.results = results;
         this.showList = true;

         // draws the results on the map
         this.drawResults(results);
         
         var btnShowList = document.getElementsByTagName('button')["m-geosearchbylocation-button-list"];

         goog.events.listen(btnShowList, [
               goog.events.EventType.CLICK,
               goog.events.EventType.TOUCHEND], this.showList_, false, this);
      };
      
      /**
       * This function adds a button click event to show list
       *
       * @private
       * @function
       * @param {Object} results query results
       */
      M.control.Geosearchbylocation.prototype.showList_ = function () {
         var this_ = this;
         if(this.showList === true){
         var resultsTemplateVars = this_.parseResultsForTemplate_(this.results);
         M.template.compile(M.control.Geosearchbylocation.RESULTS_TEMPLATE, resultsTemplateVars).then(function (html) {
            this_.resultsContainer_ = html;
            this_.getImpl().addResultsContainer(this_.resultsContainer_);
            var resultsHtmlElements = this_.resultsContainer_.getElementsByClassName("result");
            for (var i = 0, ilen = resultsHtmlElements.length; i < ilen; i++) {
               var resultHtml = resultsHtmlElements.item(i);
               goog.events.listen(resultHtml, [
                                               goog.events.EventType.CLICK,
                                               goog.events.EventType.TOUCHEND
                                             ], function(evt) {
                             this.resultClick_(evt);
                             this.getImpl().removeResultsContainer(this.resultsContainer_);
                             this.showList = true;
                     }, false, this_);
            }
         });
         this.showList = false;
      } else {
        this_.getImpl().removeResultsContainer(this_.resultsContainer_);
         this.showList = true;
      }
      
      };
      
   

      
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