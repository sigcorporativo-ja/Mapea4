goog.provide('P.impl.layer.Geobusquedas');

goog.require('P.impl.utils.Geobusquedas');
goog.require('Geobusquedas.feature.style');

(function () {
   /**
    * @classdesc
    * Main constructor of the class. Creates a WFS layer
    * with parameters specified by the user
    *
    * @constructor
    * @implements {M.impl.Layer}
    * @param {Mx.parameters.LayerOptions} options custom options for this layer
    * @api stable
    */
   M.impl.layer.Geobusquedas = (function (options) {
      /**
       * Currently drawn feature coordinate.
       * @private
       * @type {ol.format.WKT}
       */
      this.wktFormatter_ = new ol.format.WKT();

      /**
       * Popup showed
       * @private
       * @type {M.impl.Popup}
       */
      this.popup_ = null;

      /**
       * Features selected by the user
       * @private
       * @type {Array<ol.Features>}
       */
      this.selectedFeatures_ = [];

      /**
       * Name of the layer
       * @private
       * @type {String}
       */
      this.name = 'geobusquedas';

      // calls the super constructor
      goog.base(this, options);
   });
   goog.inherits(M.impl.layer.Geobusquedas, M.impl.Layer);

   /**
    * This function sets the map object of the layer
    *
    * @public
    * @function
    * @param {M.Map} map
    * @api stable
    */
   M.impl.layer.Geobusquedas.prototype.addTo = function (map) {
      this.map = map;
      this.ol3Layer = new ol.layer.Vector({
         source: new ol.source.Vector({
            'useSpatialIndex': false
         }),
         zIndex: M.impl.Map.Z_INDEX[M.layer.type.WFS] + 999
      });
      // sets its visibility if it is in range
      if (this.options.visibility !== false) {
         this.setVisible(this.inRange());
      }
      this.map.getMapImpl().addLayer(this.ol3Layer);
   };

   /**
    * This function draws the results into the specified map
    *
    * @public
    * @function
    * @param {Array<Object>} results to draw
    * @api stable
    */
   M.impl.layer.Geobusquedas.prototype.drawResults = function (results) {
      var projection = ol.proj.get(this.map.getProjection().code);

      var docs = [];
      if (!M.utils.isNullOrEmpty(results.spatial_response)) {
         docs = results.spatial_response.docs;
      }
      if (M.utils.isNullOrEmpty(docs)) {
         docs = results.response.docs;
      }

      var features = docs.map(function (doc) {
         var feature = this.wktFormatter_.readFeature(doc.geom, {
            'dataProjection': projection
         });
         feature.setId(doc.solrid);
         feature.setProperties(doc);
         M.impl.layer.Geobusquedas.setStyleFeature_(feature, M.impl.style.STATE.DEFAULT);

         this.wrapComplexFeature_(feature);

         return feature;
      }, this);

      this.ol3Layer.getSource().addFeatures(features);
   };

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the control
    * @api stable
    */
   M.impl.layer.Geobusquedas.prototype.drawNewResults = function (results) {
      var projection = ol.proj.get(this.map.getProjection().code);

      var docs;
      if (!M.utils.isNullOrEmpty(results.spatial_response)) {
         docs = results.spatial_response.docs;
      }
      else if (!M.utils.isNullOrEmpty(results.response)) {
         docs = results.response.docs;
      }

      var features = docs.map(function (doc) {
         var feature = this.wktFormatter_.readFeature(doc.geom, {
            'dataProjection': projection
         });
         feature.setId(doc.solrid);
         feature.setProperties(doc);
         M.impl.layer.Geobusquedas.setStyleFeature_(feature, M.impl.style.STATE.NEW);

         return feature;
      }, this);

      this.ol3Layer.getSource().addFeatures(features);
   };

   /**
    * This function creates the view to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the control
    * @api stable
    */
   M.impl.layer.Geobusquedas.prototype.clear = function (results) {
      this.map.removePopup();
      this.ol3Layer.getSource().clear();
   };

   /**
    * This function checks if an object is equals
    * to this layer
    * @public
    * @function
    * @param {ol.Feature} feature
    * @api stable
    */
   M.impl.layer.Geobusquedas.prototype.selectFeatures = function (features, coord, noPanMapIfOutOfView) {

      // sets the style
      this.selectedFeatures_ = features;
      M.impl.layer.Geobusquedas.setStyleFeature_(features, M.impl.style.STATE.SELECTED);

      var featureForTemplate = this.parseFeaturesForTemplate_(features);
      var this_ = this;
      M.template.compile(M.impl.layer.Geobusquedas.POPUP_RESULT, featureForTemplate)
         .then(function (html) {
            this_.popup_ = new M.impl.Popup(html, {
               'panMapIfOutOfView': !noPanMapIfOutOfView,
               'ani': null
            });
            this_.map.addPopup(this_.popup_);
            this_.popup_.show(coord, html);
         });
   };

   /**
    * This function checks if an object is equals
    * to this layer
    * @public
    * @function
    * @param {ol.Feature} feature
    * @api stable
    */
   M.impl.layer.Geobusquedas.prototype.selectFeatureBySolrid = function (solrid) {
      var feature = this.ol3Layer.getSource().getFeatureById(solrid);
      this.selectedFeatures_ = [feature];

      var featureGeom = feature.getGeometry();
      var coord = M.impl.utils.getCentroidCoordinate(featureGeom);

      this.unselectFeatures();
      this.selectFeatures([feature], coord, true);

      this.map.setBbox(featureGeom.getExtent());
   };

   /**
    * This function checks if an object is equals
    * to this control
    *
    * @private
    * @function
    */
   M.impl.layer.Geobusquedas.prototype.parseFeaturesForTemplate_ = function (features) {
      var featuresTemplate = {
         'features': []
      };

      features.forEach(function (feature) {
         var hiddenAttributes = ['geom', '_version_', 'keywords', 'solrid', feature.getGeometryName()];
         var properties = feature.getProperties();
         var attributes = [];
         for (var key in properties) {
            if (!M.utils.includes(hiddenAttributes, key.toLowerCase())) {
               attributes.push({
                  'key': M.utils.beautifyAttributeName(key),
                  'value': properties[key]
               });
            }
         }
         var featureTemplate = {
            'solrid': feature.getId(),
            'attributes': attributes
         };
         featuresTemplate.features.push(featureTemplate);
      });
      return featuresTemplate;
   };

   /**
    * This function checks if an object is equals
    * to this control
    *
    * @private
    * @function
    */
   M.impl.layer.Geobusquedas.prototype.wrapComplexFeature_ = function (feature) {
      var featureGeom = feature.getGeometry();
      if ((featureGeom.getType() === M.geom.wkt.type.POLYGON) || (featureGeom.getType() === M.geom.wkt.type.MULTI_POLYGON)) {
         var centroid;
         if (featureGeom.getType() === M.geom.wkt.type.POLYGON) {
            centroid = featureGeom.getInteriorPoint();
         }
         else {
            centroid = featureGeom.getInteriorPoints();
         }
         var geometryCollection = new ol.geom.GeometryCollection([centroid, featureGeom]);
         feature.setGeometry(geometryCollection);
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
   M.impl.layer.Geobusquedas.prototype.unselectFeatures = function () {
      // sets the style
      M.impl.layer.Geobusquedas.setStyleFeature_(this.selectedFeatures_, M.impl.style.STATE.DEFAULT);
      this.selectedFeatures_.length = 0;

      this.map.removePopup();
   };

   /**
    * This function destroys this layer, clearing the HTML
    * and unregistering all events
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.layer.Geobusquedas.prototype.destroy = function () {
      var olMap = this.map.getMapImpl();
      if (!M.utils.isNullOrEmpty(this.ol3Layer)) {
         olMap.removeLayer(this.ol3Layer);
         this.ol3Layer = null;
      }
      this.map = null;
   };

   /**
    * This function checks if an object is equals
    * to this layer
    *
    * @function
    * @api stable
    */
   M.impl.layer.Geobusquedas.prototype.equals = function (obj) {
      var equals = false;

      if (obj instanceof M.layer.Geobusquedas) {
         equals = (this.url === obj.url);
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
   M.impl.layer.Geobusquedas.setStyleFeature_ = function (features, state) {
      if (!M.utils.isArray(features)) {
         features = [features];
      }

      features.forEach(function (feature) {
         // gets the geometry type
         var geometryType = feature.getGeometry().getType();
         if (M.utils.isNullOrEmpty(state) || (state === M.impl.style.STATE.DEFAULT)) {
            feature.setStyle(Geobusquedas.feature.style.DEFAULT[geometryType]);
         }
         else if (state === M.impl.style.STATE.NEW) {
            feature.setStyle(Geobusquedas.feature.style.NEW[geometryType]);
         }
         else if (state === M.impl.style.STATE.SELECTED) {
            feature.setStyle(Geobusquedas.feature.style.SELECTED[geometryType]);
         }
      });
   };

   /**
    * Template for this controls
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.impl.layer.Geobusquedas.POPUP_RESULT = "geobusquedasfeaturepopup.html";
})();