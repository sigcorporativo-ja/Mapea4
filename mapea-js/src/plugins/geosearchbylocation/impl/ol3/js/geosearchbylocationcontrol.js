goog.provide('P.impl.control.Geosearchbylocation');

goog.require('P.impl.control.Geobusquedas');

/**
 * @namespace M.impl.control
 */
(function () {
   /**
    * @classdesc
    * Main constructor of the class. Creates a Geosearchbylocation
    * control
    *
    * @constructor
    * @param {String} searchUrl_ URL for the request
    * @extends {M.impl.control.Geobusquedas}
    * @api stable
    */
   M.impl.control.Geosearchbylocation = function (searchUrl_) {

      /**
       * Popup showed
       * @private
       * @type {M.impl.Popup}
       */
      this.popup_ = null;

      // calls super
      goog.base(this);

      this.searchUrl_ = searchUrl_;
   };
   goog.inherits(M.impl.control.Geosearchbylocation, M.impl.control.Geobusquedas);


   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the plugin
    * @param {Object} element template of this control
    * @api stable
    */
   M.impl.control.Geosearchbylocation.prototype.addTo = function (map, element) {
      goog.base(this, 'addTo', map, element);
   };

   /**
    * Set the map instance the control is associated with.
    * @param {ol.Map} map The map instance.
    * @public
    * @function
    * @api stable
    */
   M.impl.control.Geosearchbylocation.prototype.setMap = function (map) {
      if (M.utils.isNullOrEmpty(map)) {
         this.facadeMap_.getImpl().removeFeatures([this.accuracyFeature_, this.positionFeature_]);
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
    * @returns {Promise}
    * @api stable
    */
   M.impl.control.Geobusquedas.prototype.locate = function () {
      var ob_ = this;
      return new Promise(function (success, fail) {
         goog.dom.classlist.add(document.getElementById("m-geosearchbylocation-div"), 'm-geosearchbylocation-div-load');
         var view = ob_.map_.getView();
         var geolocation = new ol.Geolocation({
            projection: view.getProjection()
         });
         geolocation.setTracking(true);
         ob_.accuracyFeature_ = new ol.Feature();
         geolocation.on('change:accuracyGeometry', function () {
            this.accuracyFeature_.setGeometry(geolocation.getAccuracyGeometry());
         }, ob_);
         ob_.positionFeature_ = new ol.Feature();
         ob_.positionFeature_.setStyle(new ol.style.Style({
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
         geolocation.on('change:position', function () {
            ob_.coordinates = geolocation.getPosition();
            success(ob_.coordinates);
         }, ob_);
         ob_.positionFeature_.click = function (evt) {
            M.template.compile(M.impl.control.Geosearchbylocation.POPUP_LOCATION, {
               'valorX': ob_.coordinates[0],
               'valorY': ob_.coordinates[1]
            }).then(function (html) {
               ob_.popup_ = new M.impl.Popup(html);
               ob_.facadeMap_.getImpl().addPopup(ob_.popup_);
               ob_.popup_.show(ob_.coordinates, html);
            });
         };
      });
   };

   /**
    * This function remove point locate
    * @public
    * @function
    * @api stable
    */
   M.impl.control.Geobusquedas.prototype.removeLocate = function () {
      this.facadeMap_.getImpl().removeFeatures([this.accuracyFeature_, this.positionFeature_]);
   };

   /**
    * This function draw point location
    * @param {Array} coord coordinate
    * @public
    * @function
    * @api stable
    */
   M.impl.control.Geosearchbylocation.prototype.drawLocation = function (coord) {
      this.positionFeature_.setGeometry(coord ? new ol.geom.Point(coord) : null);
      this.facadeMap_.getImpl().drawFeatures([this.accuracyFeature_, this.positionFeature_]);
   };

   /**
    * This function shows the container with the results
    *
    * @public
    * @function
    * @param {Object} container HTML to display
    * @api stable
    */
   M.impl.control.Geosearchbylocation.prototype.addResultsContainer = function (container) {
      var mapContainer = this.map.getTargetElement();
      goog.dom.appendChild(mapContainer, container);
   };

   /**
    * This function destroy the container with the results
    *
    * @public
    * @function
    * @param {Object} container HTML to destroy
    * @api stable
    */
   M.impl.control.Geosearchbylocation.prototype.removeResultsContainer = function (container) {
      goog.dom.removeNode(container);
   };


   /**
    * This function destroys this control, clearing the HTML
    * and unregistering all events
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.control.Geosearchbylocation.prototype.destroy = function () {
      this.map.removeControl(this);
      this.popup_ = null;
      this.searchUrl_ = null;
      this.clear();
      this.map = null;
      this.facadeMap_.getImpl().removeFeatures([this.accuracyFeature_, this.positionFeature_]);
      this.facadeMap_ = null;
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