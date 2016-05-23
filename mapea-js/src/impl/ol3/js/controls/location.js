goog.provide('M.impl.control.Location');

goog.require('M.impl.Control');
goog.require('ol.Geolocation');

/**
 * @namespace M.impl.control
 */
(function () {
   /**
    * @classdesc Main constructor of the class. Creates a Location
    * control
    * @param {function} element template of this control
    * @param {M.Map} map map to add the plugin
    * @constructor
    * @extends {ol.control.Control}
    * @api stable
    */

   M.impl.control.Location = function () {
      /**
       * Specifies the status of the location
       * @private
       * @type {Boolean}
       */
      this.activeLocation_ = false;

      /**
       * The map instance
       * @private
       * @type {M.Map}
       */
      this.facadeMap_ = null;

      /**
       * Feature of the accuracy position
       * @private
       * @type {ol.Feature}
       */
      this.accuracyFeature_ = null;

      /**
       * Feature of the position
       * @private
       * @type {ol.Feature}
       */
      this.positionFeature_ = null;
   };
   goog.inherits(M.impl.control.Location, M.impl.Control);

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the plugin
    * @param {function} template template of this control
    * @api stable
    */
   M.impl.control.Location.prototype.addTo = function (map, element) {
      this.facadeMap_ = map;
      var btnLocate = element.querySelector('button#m-location-button');
      goog.events.listen(btnLocate, [
               goog.events.EventType.CLICK,
               goog.events.EventType.TOUCHEND
            ], this.locate, false, this);
      goog.base(this, 'addTo', map, element);
   };

   /**
    * This function destroys this control, cleaning the HTML
    * and unregistering all events
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.control.Location.prototype.destroy = function () {
      this.facadeMap_.getImpl().removeFeatures([this.accuracyFeature_, this.positionFeature_]);
      this.scaleContainer_ = null;
      goog.base(this, 'destroy');
   };

   /**
    * This function paints a point on the map with your location
    * 
    * @public
    * @function
    * @api stable
    */
   M.impl.control.Location.prototype.locate = function () {
      if (this.activeLocation_ === true) {
         this.facadeMap_.getImpl().removeFeatures([this.accuracyFeature_, this.positionFeature_]);
         this.activeLocation_ = false;
      }
      else {
         goog.dom.classlist.add(document.getElementById("m-location-div"), 'm-location-div-load');
         var view = this.map_.getView();
         var geolocation = new ol.Geolocation({
            projection: this.map_.getView().getProjection()
         });
         geolocation.setTracking(true);
         this.accuracyFeature_ = new ol.Feature();
         geolocation.on('change:accuracyGeometry', function () {
            this.accuracyFeature_.setGeometry(geolocation.getAccuracyGeometry());
         }, this);
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
         geolocation.on('change:position', function () {
            var coordinates = geolocation.getPosition();
            this.positionFeature_.setGeometry(coordinates ? new ol.geom.Point(
               coordinates) : null);
            this.facadeMap_.setZoom(12).setCenter(coordinates);
            goog.dom.classlist.remove(document.getElementById("m-location-div"), 'm-location-div-load');
         }, this);
         this.facadeMap_.getImpl().drawFeatures(
               [this.accuracyFeature_, this.positionFeature_]);
         this.activeLocation_ = true;
      }
   };
})();