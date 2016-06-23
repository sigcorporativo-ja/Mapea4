goog.provide('P.impl.control.Geosearchbylocation');

goog.require('P.impl.control.Geosearch');

/**
 * @namespace M.impl.control
 */
(function() {
   /**
    * @classdesc
    * Main constructor of the Geosearchbylocation control.
    *
    * @constructor
    * @param {string} searchUrl_ - URL for the request
    * @extends {M.impl.control.Geosearch}
    * @api stable
    */
   M.impl.control.Geosearchbylocation = function(searchUrl_) {

      /**
       * Popup showed
       * @private
       * @type {Mx.Popup}
       */
      this.popup_ = null;

      /**
       * URL for the query
       * @private
       * @type {string}
       */
      this.searchUrl_ = searchUrl_;

      // calls super
      goog.base(this, {
         'layerName': M.control.Geosearchbylocation.NAME
      });
   };
   goog.inherits(M.impl.control.Geosearchbylocation, M.impl.control.Geosearch);

   /**
    * Set the map instance the control is associated with.
    * @param {ol.Map} map - The map instance.
    * @public
    * @function
    * @api stable
    */
   M.impl.control.Geosearchbylocation.prototype.setMap = function(map) {
      if (M.utils.isNullOrEmpty(map)) {
         this.facadeMap_.getImpl().removeFeatures([this.positionFeature_]);
      }
      else {
         this.map = map;
      }
      goog.base(this, 'setMap', map);
   };

   /**
    * This function get coordinates
    * @public
    * @function
    * @returns {Promise} coordinates
    * @api stable
    */
   M.impl.control.Geosearch.prototype.locate = function() {
      var geolocation = new ol.Geolocation({
         projection: this.facadeMap_.getMapImpl().getView().getProjection()
      });
      geolocation.setTracking(true);
      this.positionFeature_ = new ol.Feature();
      this.positionFeature_.setStyle(new ol.style.Style({
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
      var this_ = this;
      var coordinates;
      this.positionFeature_.click = function(evt) {
         M.template.compile(M.impl.control.Geosearchbylocation.POPUP_LOCATION, {
            'jsonp': true,
            'vars': {
               'valorX': coordinates[0],
               'valorY': coordinates[1]
            },
            'parseToHtml': false
         }).then(function(htmlAsText) {
            var positionTabOpts = {
               'icon': 'g-cartografia-gps2',
               'title': 'posición',
               'content': htmlAsText
            };
            this_.popup_ = this_.facadeMap_.getPopup();
            if (M.utils.isNullOrEmpty(this_.popup_)) {
               this_.popup_ = new M.Popup();
               this_.popup_.addTab(positionTabOpts);
               this_.facadeMap_.addPopup(this_.popup_, coordinates);
            }
            else {
               this_.popup_.addTab(positionTabOpts);
            }
         });
      };
      return new Promise(function(success, fail) {
         geolocation.on('change:position', function() {
            geolocation.setTracking(false);
            coordinates = geolocation.getPosition();
            success(coordinates);
         }, this);
      });
   };

   /**
    * This function remove point locate
    * @public
    * @function
    * @api stable
    */
   M.impl.control.Geosearch.prototype.removeLocate = function() {
      this.facadeMap_.getImpl().removeFeatures([this.positionFeature_]);
   };

   /**
    * This function draw point location
    * @param {array} coord - Coordinates
    * @public
    * @function
    * @api stable
    */
   M.impl.control.Geosearchbylocation.prototype.drawLocation = function(coord) {
      this.positionFeature_.setGeometry(coord ? new ol.geom.Point(coord) : null);
      this.facadeMap_.getImpl().drawFeatures([this.positionFeature_]);
   };

   /**
    * This function shows the container with the results
    *
    * @public
    * @function
    * @param {HTMLElement} container HTML to display
    * @api stable
    */
   M.impl.control.Geosearchbylocation.prototype.addResultsContainer = function(container) {
      var mapContainer = this.map.getTargetElement();
      goog.dom.appendChild(mapContainer, container);
   };

   /**
    * This function destroy the container with the results
    *
    * @public
    * @function
    * @param {HTMLElement} container HTML results panel
    * @api stable
    */
   M.impl.control.Geosearchbylocation.prototype.removeResultsContainer = function(container) {
      goog.dom.removeNode(container);
   };

   /**
    * Zoom Results
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.control.Geosearchbylocation.prototype.zoomToResultsAll = function() {
      var features = this.facadeMap_.getControls("geosearchbylocation")[0].getImpl().getLayer().getOL3Layer().getSource().getFeatures().concat(this.facadeMap_.getImpl().getDrawLayer().getOL3Layer().getSource().getFeatures());
      var bbox = ol.extent.boundingExtent(features.map(function(feature) {
         return ol.extent.getCenter(feature.getGeometry().getExtent());
      }));
      this.facadeMap_.setBbox(bbox);
   };

   /**
    * This function destroys this control and clear HTML
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.control.Geosearchbylocation.prototype.destroy = function() {
      this.facadeMap_.getMapImpl().removeControl(this);
      this.clear();
      this.facadeMap_.getImpl().removeFeatures([this.positionFeature_]);
      this.popup_ = null;
      this.searchUrl_ = null;
   };

   /**
    * Template for popup
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.impl.control.Geosearchbylocation.POPUP_LOCATION = "geosearchbylocationfeaturepopup.html";
})();