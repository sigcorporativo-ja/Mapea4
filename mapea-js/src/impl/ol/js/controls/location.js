goog.provide('M.impl.control.Location');

goog.require('M.impl.Control');
goog.require('ol.Geolocation');

/**
 * @namespace M.impl.control
 */
(function() {
   /**
    * @classdesc
    * Main constructor of the class. Creates a Location
    * control
    *
    * @constructor
    * @extends {M.impl.Control}
    * @api stable
    */

   M.impl.control.Location = function() {
      /**
       * Helper class for providing HTML5 Geolocation
       * @private
       * @type {ol.Geolocation}
       */
      this.geolocation_ = null;

      /**
       * Feature of the accuracy position
       * @private
       * @type {ol.Feature}
       */
      this.accuracyFeature_ = new ol.Feature();

      /**
       * Feature of the position
       * @private
       * @type {ol.Feature}
       */
      this.positionFeature_ = new ol.Feature({
         'style': M.impl.control.Location.POSITION_STYLE
      });
   };
   goog.inherits(M.impl.control.Location, M.impl.Control);

   /**
    * This function paints a point on the map with your location
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.control.Location.prototype.activate = function() {
      goog.dom.classlist.add(this.element, 'm-locating');

      if (M.utils.isNullOrEmpty(this.geolocation_)) {
         var proj = ol.proj.get(this.facadeMap_.getProjection().code);
         this.geolocation_ = new ol.Geolocation({
            projection: proj
         });
         this.geolocation_.on('change:accuracyGeometry', function(evt) {
            var accuracyGeom = evt.target.get(evt.key);
            this.accuracyFeature_.setGeometry(accuracyGeom);
         }, this);
         this.geolocation_.on('change:position', function(evt) {
            var newCoord = evt.target.get(evt.key);
            var newPosition = null;
            if (!M.utils.isNullOrEmpty(newCoord)) {
               newPosition = new ol.geom.Point(newCoord);
            }
            this.positionFeature_.setGeometry(newPosition);
            this.facadeMap_.setZoom(12).setCenter(newCoord);
            goog.dom.classlist.remove(this.element, 'm-locating');
            goog.dom.classlist.add(this.element, 'm-located');

            this.geolocation_.setTracking(false);
         }, this);
      }

      this.geolocation_.setTracking(true);
      this.facadeMap_.getImpl().drawFeatures([this.accuracyFeature_, this.positionFeature_]);
   };

   /**
    * This function remove the drawn location
    *
    * @private
    * @function
    */
   M.impl.control.Location.prototype.removePositions_ = function() {
      if (!M.utils.isNullOrEmpty(this.accuracyFeature_)) {
         this.facadeMap_.getImpl().removeFeatures([this.accuracyFeature_]);
      }
      if (!M.utils.isNullOrEmpty(this.positionFeature_)) {
         this.facadeMap_.getImpl().removeFeatures([this.positionFeature_]);
      }
   };

   /**
    * This function remove the drawn location and restores the style button
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.control.Location.prototype.deactivate = function() {
      this.removePositions_();
      goog.dom.classlist.remove(this.element, 'm-located');
   };

   /**
    * This function destroys this control and cleaning the HTML
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.control.Location.prototype.destroy = function() {
      this.removePositions_();
      goog.base(this, 'destroy');
   };

   /**
    * Style for location
    * @const
    * @type {ol.style.Style}
    * @public
    * @api stable
    */
   M.impl.control.Location.POSITION_STYLE = new ol.style.Style({
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
   });
})();