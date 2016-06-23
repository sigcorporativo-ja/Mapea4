goog.provide('P.impl.control.Searchstreet');

/**
 * @namespace M.impl.control
 */
(function() {
   /**
    * @classdesc Main constructor of the Searchstreet control.
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
       * @public
       * @type {array}
       * @api stable
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
    * @param {M.Map} map - Map to add the plugin
    * @param {HTMLElement} element - Template of this control
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
    * @param {array} results - Results query results
    * @api stable
    */
   M.impl.control.Searchstreet.prototype.drawPoints = function(results) {
      var positionFeature = null;
      for (var i = 0, ilen = results.length; i < ilen; i++) {
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
         positionFeature.setGeometry([results[i].coordinateX,
            results[i].coordinateY
         ] ? new ol.geom.Point([
            results[i].coordinateX, results[i].coordinateY
         ]) : null);
         this.facadeMap_.getImpl().drawFeatures([positionFeature]);
         var feature = results[i];

         this.addEventClickFeature(feature, positionFeature);
         this.listPoints.push([positionFeature]);
      }
      this.zoomResults();
   };

   /**
    * This function zooms results
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.control.Searchstreet.prototype.zoomResults = function() {
      var features = this.facadeMap_.getImpl().getDrawLayer().getOL3Layer().getSource().getFeatures();
      var bbox = ol.extent.boundingExtent(features
         .filter(function(feature) {
            return (!M.utils.isNullOrEmpty(feature.getGeometry()));
         })
         .map(function(feature) {
            return feature.getGeometry().getFirstCoordinate();
         }));
      this.facadeMap_.setBbox(bbox);
   };


   /**
    * This function calls the show popup function to display information
    *
    * @public
    * @function
    * @param {object} element - Specific result query response
    * @param {ol.Feature} result - Feature
    * @api stable
    */
   M.impl.control.Searchstreet.prototype.addEventClickFeature = function(
      element, result) {
      this.facadeMap_.removePopup();
      var this_ = this;
      if (M.utils.isNullOrEmpty(result)) {
         this.showPopup_(element, false);
         this.facadeMap_.setBbox([element.coordinateX, element.coordinateY, element.coordinateX, element.coordinateY]);
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
    * @param {object} feature - Specific result query response
    * @param {boolean} noPanMapIfOutOfView
    */
   M.impl.control.Searchstreet.prototype.showPopup_ = function(feature, noPanMapIfOutOfView) {
      var this_ = this;
      M.template.compile(M.impl.control.Searchstreet.POPUP_TEMPLATE, {
         'jsonp': true,
         'vars': {
            'tVia': feature.streetType,
            'nVia': feature.streetName,
            'num': feature.streetNumber,
            'mun': feature.localityName,
            'prov': feature.cityName
         },
         'parseToHtml': false
      }).then(function(htmlAsText) {
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
               if (M.utils.isUndefined(noPanMapIfOutOfView)) {
                  this_.popup_ = new M.Popup();
               }
               else {
                  this_.popup_ = new M.Popup({
                     'panMapIfOutOfView': noPanMapIfOutOfView
                  });
               }
               this_.popup_.addTab(popupContent);
               this_.facadeMap_.addPopup(this_.popup_, [feature.coordinateX, feature.coordinateY]);
            }
            else {
               this_.popup_.addTab(popupContent);
            }
         }
         else {
            if (M.utils.isUndefined(noPanMapIfOutOfView)) {
               this_.popup_ = new M.Popup();
            }
            else {
               this_.popup_ = new M.Popup({
                  'panMapIfOutOfView': noPanMapIfOutOfView
               });
            }
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
    * @returns {HTMLElement} HTML template
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
    * This function destroys this control and clearing the HTML
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.control.Searchstreet.prototype.destroy = function() {
      goog.dom.classlist.remove(this.facadeMap_._areasContainer.getElementsByClassName("m-top m-right")[0],
         "top-extra");
      this.removePoints_();
      this.facadeMap_.getMapImpl().removeControl(this);
      this.facadeMap_.getImpl().removePopup();
      this.facadeMap_ = null;
      this.listPoints = null;
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