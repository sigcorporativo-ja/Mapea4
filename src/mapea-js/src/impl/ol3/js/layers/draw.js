goog.provide('M.impl.layer.Draw');

goog.require('M.utils');
goog.require('M.exception');
goog.require('M.impl.Layer');
goog.require('M.impl.format.GeoJSON');
goog.require('M.impl.Popup');

goog.require('ol.layer.Vector');
goog.require('ol.source.Vector');

goog.require('goog.style');

(function() {
   /**
    * @classdesc
    * Main constructor of the class. Creates a KML layer
    * with parameters specified by the user
    *
    * @constructor
    * @implements {M.impl.Layer}
    * @param {Mx.parameters.LayerOptions} options custom options for this layer
    * @api stable
    */
   M.impl.layer.Draw = (function() {
      /**
       * Currently drawn feature coordinate.
       * @private
       * @type {M.impl.format.GeoJSON}
       */
      this.geojsonFormatter_ = new M.impl.format.GeoJSON();

      /**
       * Name of the layer
       * @private
       * @type {String}
       */
      this.name = 'drawLayer';

      /**
       * Selected features for this layer
       * @private
       * @type {Array<ol.Feature>}
       */
      this.selectedFeatures_ = [];

      // calls the super constructor
      goog.base(this);
   });
   goog.inherits(M.impl.layer.Draw, M.impl.Layer);

   /**
    * This function sets the map object of the layer
    *
    * @public
    * @function
    * @param {M.impl.Map} map
    * @api stable
    */
   M.impl.layer.Draw.prototype.addTo = function(map) {
      this.map = map;

      this.ol3Layer = new ol.layer.Vector({
         source: new ol.source.Vector(),
         style: new ol.style.Style({
            fill: new ol.style.Fill({
               color: 'rgba(0, 158, 0, 0.1)'
            }),
            stroke: new ol.style.Stroke({
               color: '#fcfcfc',
               width: 2
            }),
            image: new ol.style.Circle({
               radius: 7,
               fill: new ol.style.Fill({
                  color: '#009E00'
               }),
               stroke: new ol.style.Stroke({
                  color: '#fcfcfc',
                  width: 2
               })
            })
         }),
         zIndex: M.impl.Map.Z_INDEX[M.layer.type.WFS] + 999
      });
      // sets its visibility if it is in range
      if (this.options.visibility !== false) {
         this.setVisible(this.inRange());
      }
      var olMap = this.map.getMapImpl();
      olMap.addLayer(this.ol3Layer);
   };

   /**
    * This function checks if an object is equals
    * to this layer
    * @public
    * @function
    * @param {ol.Feature} feature
    * @api stable
    */
   M.impl.layer.Draw.prototype.selectFeatures = function(features) {
      this.selectedFeatures_ = features;

      // TODO: manage multiples features
      if (M.utils.isFunction(this.selectedFeatures_[0].click)) {
         this.selectedFeatures_[0].click();
      }
   };

   /**
    * This function checks if an object is equals
    * to this layer
    *
    * @public
    * @function
    * @param {ol.Feature} feature
    * @api stable
    */
   M.impl.layer.Draw.prototype.unselectFeatures = function() {
      if (this.selectedFeatures_.length > 0) {
         this.selectedFeatures_.length = 0;
         this.map.removePopup();
      }
   };

   /**
    * This function checks if an object is equals
    * to this layer
    *
    * @public
    * @function
    * @param {Array<Mx.Point>} coordinate
    * @api stable
    */
   M.impl.layer.Draw.prototype.drawPoints = function(points) {
      // checks if the param is null or empty
      if (M.utils.isNullOrEmpty(points)) {
         M.exception('No ha especificado ningún punto');
      }
      if (!M.utils.isArray(points)) {
         points = [points];
      }
      var geojsons = this.pointsToGeoJSON_(points);
      this.drawGeoJSON(geojsons);
   };

   /**
    * This function checks if an object is equals
    * to this layer
    *
    * @public
    * @function
    * @param {Array<Mx.Point>} coordinate
    * @api stable
    */
   M.impl.layer.Draw.prototype.drawGeoJSON = function(geojsons) {
      // checks if the param is null or empty
      if (M.utils.isNullOrEmpty(geojsons)) {
         M.exception('No ha especificado ningún GeoJSON');
      }
      if (!M.utils.isArray(geojsons)) {
         geojsons = [geojsons];
      }

      // gets the projection
      var projection = ol.proj.get(this.map.getProjection().code);

      var features = [];
      geojsons.forEach(function(geojson) {
         var formattedFeatures = this.geojsonFormatter_.readFeatures(geojson, {
            'dataProjection': projection
         });
         features = features.concat(formattedFeatures);
      }, this);

      this.ol3Layer.getSource().addFeatures(features);
   };

   /**
    * This function checks if an object is equals
    * to this layer
    *
    * @public
    * @function
    * @param {Array<Mx.Point>} coordinate
    * @api stable
    */
   M.impl.layer.Draw.prototype.drawFeatures = function(features) {
      // checks if the param is null or empty
      if (!M.utils.isNullOrEmpty(features)) {
         if (!M.utils.isArray(features)) {
            features = [features];
         }
         this.ol3Layer.getSource().addFeatures(features);
      }
   };

   /**
    * This function checks if an object is equals
    * to this layer
    *
    * @public
    * @function
    * @param {Array<Mx.Point>} coordinate
    * @api stable
    */
   M.impl.layer.Draw.prototype.removeFeatures = function(features) {
      // checks if the param is null or empty
      if (!M.utils.isNullOrEmpty(features)) {
         if (!M.utils.isArray(features)) {
            features = [features];
         }
         var olSource = this.ol3Layer.getSource();

         features.forEach(function(feature) {
            try {
               this.removeFeature(feature);
            }
            catch (err) {
               // the feature does not exist in the source
            }
         }, olSource);
      }
   };


   /**
    * This function checks if an object is equals
    * to this layer
    *
    * @public
    * @function
    * @param {ol.Coordinate} coordinate
    * @api stable
    */
   M.impl.layer.Draw.prototype.getPoints = function(coordinate) {
      var features = [];
      var drawSource = this.ol3Layer.getSource();

      if (!M.utils.isNullOrEmpty(coordinate)) {
         features = drawSource.getFeaturesAtCoordinate(coordinate);
      }
      else {
         features = drawSource.getFeatures();
      }

      return this.featuresToPoints_(features);
   };

   /**
    * This function destroys this layer, cleaning the HTML
    * and unregistering all events
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.layer.Draw.prototype.destroy = function() {
      var olMap = this.map.getMapImpl();

      if (!M.utils.isNullOrEmpty(this.ol3Layer)) {
         olMap.removeLayer(this.ol3Layer);
         this.ol3Layer = null;
      }
      this.options = null;
      this.map = null;
   };

   /**
    * This function checks if an object is equals
    * to this layer
    *
    * @function
    * @api stable
    */
   M.impl.layer.Draw.prototype.equals = function(obj) {
      var equals = false;

      if (obj instanceof M.impl.layer.Draw) {
         equals = equals && (this.name === obj.name);
      }
      return equals;
   };

   /**
    * This function checks if an object is equals
    * to this layer
    *
    * @private
    * @function
    */
   M.impl.layer.Draw.prototype.pointsToGeoJSON_ = function(points) {
      var geojsons = [];

      // gets the projection
      var projection = ol.proj.get(this.map.getProjection().code);

      geojsons = points.map(function(point) {
         // properties
         var geojsonProperties = point.data;

         // geometry
         var pointGeom = new ol.geom.Point([point.x, point.y]);
         var geojsonGeom = this.geojsonFormatter_.writeGeometryObject(pointGeom, {
            'dataProjection': projection
         });

         // return geojson
         return {
            "type": "Feature",
            "geometry": geojsonGeom,
            "properties": geojsonProperties,
            "click": point.click,
            "showPopup": point.showPopup
         };
      }, this);

      return geojsons;
   };

   /**
    * This function checks if an object is equals
    * to this layer
    *
    * @private
    * @function
    */
   M.impl.layer.Draw.prototype.featuresToPoints_ = function(points) {
      var features = [];

      return features;
   };
})();