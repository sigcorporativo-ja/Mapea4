goog.provide('P.impl.control.Searchstreet');

/**
 * @namespace M.impl.control
 */
(function() {
   /**
    * @classdesc Main constructor of the searchstreet control.
    *
    * @constructor
    * @extends {ol.control.Control}
    * @api stable
    */
   M.impl.control.Searchstreet = function() {
      /**
       * Facade of the map
       *
       * @private
       * @type {M.Map}
       */
      this.facadeMap_ = null;

      /**
       * List of items drawn on the map for control
       *
       * @private
       * @type {Array}
       */
      this.listPoints = [];

      /**
       * HTML template
       *
       * @private
       * @type {HTMLElement}
       */
      this.element_ = null;
   };
   goog.inherits(M.impl.control.Searchstreet, ol.control.Control);

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {M.Map}
    *        map to add the plugin
    * @param {HTMLElement}
    *        element template of this control
    * @api stable
    */
   M.impl.control.Searchstreet.prototype.addTo = function(map, element) {
      this.facadeMap_ = map;
      this.element_ = element;

      ol.control.Control.call(this, {
         'element': element,
         'target': null
      });
      map.getMapImpl().addControl(this);
   };

   /**
    * This function draw points on the map
    *
    * @public
    * @function
    * @param {Array}
    *        results results query results
    * @api stable
    */
   M.impl.control.Searchstreet.prototype.drawPoints = function(results) {
      var coordZoomXmax = 0;
      var coordZoomYmax = 0;
      var coordZoomXmin = 0;
      var coordZoomYmin = 0;
      var accuracyFeature = null;
      var positionFeature = null;
      var arrayX = [];
      var arrayY = [];
      for (var i = 0, ilen = results.length; i < ilen; i++) {
         accuracyFeature = new ol.Feature();
         positionFeature = new ol.Feature();
         positionFeature.setStyle(new ol.style.Style({
            image: new ol.style.Circle({
               radius: 6,
               fill: new ol.style.Fill({
                  color: '#3399CC'
               }),
               stroke: new ol.style.Stroke({
                  color: '#fff',
                  width: 2
               })
            })
         }));
         arrayX.push(results[i].coordinateX);
         arrayY.push(results[i].coordinateY);
         positionFeature.setGeometry([results[i].coordinateX,
            results[i].coordinateY
         ] ? new ol.geom.Point([
            results[i].coordinateX, results[i].coordinateY
         ]) : null);
         this.facadeMap_.getImpl().drawFeatures(
            [accuracyFeature, positionFeature]);
         var feature = results[i];

         this.addEventClickFeature(feature, positionFeature);
         this.listPoints.push([accuracyFeature, positionFeature]);
      }
      coordZoomXmin = arrayX.sort()[0];
      coordZoomYmin = arrayY.sort()[0];
      coordZoomXmax = arrayX.sort()[arrayX.length - 1];
      coordZoomYmax = arrayY.sort()[arrayX.length - 1];
      if (coordZoomXmin !== 0 && coordZoomYmin !== 0 && coordZoomXmax !== 0 && coordZoomYmax !== 0) {
         this.facadeMap_.setBbox([coordZoomXmin, coordZoomYmin, coordZoomXmax, coordZoomYmax]);
      }
      else {
         this.facadeMap_.setBbox([results[0].coordinateX, results[0].coordinateY, results[0].coordinateX, results[0].coordinateY]);
      }
   };


   /**
    * This function calls the show popup function to display information
    *
    * @public
    * @function
    * @param {HTMLElement} element item in the list
    * @param {Object} result specific result query response
    * @api stable
    */
   M.impl.control.Searchstreet.prototype.addEventClickFeature = function(
      element, result) {
      this.facadeMap_.removePopup();
      var this_ = this;
      if (M.utils.isNullOrEmpty(result)) {
         this.showPopup_(element);
      }
      else {
         result.click = function(evt) {
            this_.showPopup_(element);
         };
      }
   };

   /**
    * This function show popup with information
    *
    * @private
    * @function
    * @param {Object}
    *        feature specific feature
    */
   M.impl.control.Searchstreet.prototype.showPopup_ = function(feature) {
      var this_ = this;
      M.template.compile(M.impl.control.Searchstreet.POPUP_TEMPLATE, {
         'tVia': feature.streetType,
         'nVia': feature.streetName,
         'num': feature.streetNumber,
         'mun': feature.localityName,
         'prov': feature.cityName
      }, false).then(function(htmlAsText) {
         var popupContent = {
            'icon': 'g-cartografia-zoom',
            'title': 'Searchstreet',
            'content': htmlAsText
         };

         this_.popup_ = this_.facadeMap_.getPopup();
         if (!M.utils.isNullOrEmpty(this_.popup_)) {
            var hasExternalContent = this_.popup_.getTabs().some(function(tab) {
               return (tab['title'] !== 'Searchstreet');
            });
            if (!hasExternalContent) {
               this_.facadeMap_.removePopup();
               this_.popup_ = new M.Popup();
               this_.popup_.addTab(popupContent);
               this_.facadeMap_.addPopup(this_.popup_, [feature.coordinateX, feature.coordinateY]);
            }
            else {
               this_.popup_.addTab(popupContent);
            }
         }
         else {
            this_.popup_ = new M.Popup();
            this_.popup_.addTab(popupContent);
            this_.facadeMap_.addPopup(this_.popup_, [feature.coordinateX, feature.coordinateY]);
         }
      });
   };

   /**
    * This function return HTML template
    *
    * @public
    * @function
    * @api stable
    * @returns {HTMLElement}
    */
   M.impl.control.Searchstreet.prototype.getElement = function() {
      return this.element_;
   };


   /**
    * This function remove the points drawn on the map
    *
    * @private
    * @function
    */
   M.impl.control.Searchstreet.prototype.removePoints_ = function() {
      for (var i = 0, ilen = this.listPoints.length; i < ilen; i++) {
         this.facadeMap_.getImpl().removeFeatures(this.listPoints[i]);
      }
      this.listPoints = [];
   };


   /**
    * This function destroys this control, clearing the HTML and
    * unregistering all events
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.control.Searchstreet.prototype.destroy = function() {
      this.removePoints_();
      this.facadeMap_.getMapImpl().removeControl(this);
      this.facadeMap_.getImpl().removePopup();
      this.facadeMap_ = null;
      this.listPoints_ = null;
      this.element_ = null;
   };

   /**
    * Template for popup
    *
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.impl.control.Searchstreet.POPUP_TEMPLATE = "searchstreetpopup.html";
})();