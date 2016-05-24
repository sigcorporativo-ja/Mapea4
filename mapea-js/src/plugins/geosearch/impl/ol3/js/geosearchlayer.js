goog.provide('P.impl.layer.Geosearch');

goog.require('P.impl.utils.Geosearch');
goog.require('P.impl.geosearch.style');

(function() {
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
   M.impl.layer.Geosearch = (function(name, options) {
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
      this.name = 'geosearch';
      if (!M.utils.isNullOrEmpty(name)) {
         this.name = name;
      }

      // calls the super constructor
      goog.base(this, options);
   });
   goog.inherits(M.impl.layer.Geosearch, M.impl.Layer);

   /**
    * This function sets the map object of the layer
    *
    * @public
    * @function
    * @param {M.Map} map
    * @api stable
    */
   M.impl.layer.Geosearch.prototype.addTo = function(map) {
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
   M.impl.layer.Geosearch.prototype.drawResults = function(results) {
      var projection = ol.proj.get(this.map.getProjection().code);

      var docs = [];
      if (!M.utils.isNullOrEmpty(results.spatial_response)) {
         docs = results.spatial_response.docs;
      }
      if (M.utils.isNullOrEmpty(docs)) {
         docs = results.response.docs;
      }

      var features = docs.map(function(doc) {
         var feature = this.wktFormatter_.readFeature(doc.geom, {
            'dataProjection': projection
         });
         feature.setId(doc.solrid);
         feature.setProperties(doc);
         M.impl.layer.Geosearch.setStyleFeature_(feature, M.style.state.DEFAULT);

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
   M.impl.layer.Geosearch.prototype.drawNewResults = function(results) {
      var projection = ol.proj.get(this.map.getProjection().code);

      var docs;
      if (!M.utils.isNullOrEmpty(results.spatial_response)) {
         docs = results.spatial_response.docs;
      }
      else if (!M.utils.isNullOrEmpty(results.response)) {
         docs = results.response.docs;
      }

      var features = docs.map(function(doc) {
         var feature = this.wktFormatter_.readFeature(doc.geom, {
            'dataProjection': projection
         });
         feature.setId(doc.solrid);
         feature.setProperties(doc);
         M.impl.layer.Geosearch.setStyleFeature_(feature, M.style.state.NEW);

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
   M.impl.layer.Geosearch.prototype.clear = function(results) {
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
   M.impl.layer.Geosearch.prototype.selectFeatures = function(features, coord, noPanMapIfOutOfView) {
      // unselects previous features
      this.unselectFeatures();

      // sets the style
      this.selectedFeatures_ = features;
      M.impl.layer.Geosearch.setStyleFeature_(features, M.style.state.SELECTED);

      var featureForTemplate = this.parseFeaturesForTemplate_(features);
      var this_ = this;
      M.template.compile(M.impl.layer.Geosearch.POPUP_RESULT, {
            'jsonp': true,
            'vars': featureForTemplate,
            'parseToHtml': false
         })
         .then(function(htmlAsText) {
            var featureTabOpts = {
               'icon': 'g-cartografia-pin',
               'title': 'Geosearch',
               'content': htmlAsText
            };
            var popup = this_.map.getPopup();
            if (M.utils.isNullOrEmpty(popup)) {
               popup = new M.Popup({
                  'panMapIfOutOfView': !noPanMapIfOutOfView,
                  'ani': null
               });
               popup.addTab(featureTabOpts);
               this_.map.addPopup(popup, coord);
            }
            else {
               popup.addTab(featureTabOpts);
            }
            // removes events on destroy
            popup.on(M.evt.DESTROY, function() {
               this.internalUnselectFeatures_(true);
            }, this_);
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
   M.impl.layer.Geosearch.prototype.selectFeatureBySolrid = function(solrid) {
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
   M.impl.layer.Geosearch.prototype.parseFeaturesForTemplate_ = function(features) {
      var featuresTemplate = {
         'features': []
      };

      features.forEach(function(feature) {
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
   M.impl.layer.Geosearch.prototype.wrapComplexFeature_ = function(feature) {
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
   M.impl.layer.Geosearch.prototype.unselectFeatures = function(features, coord) {
      this.internalUnselectFeatures_();
   };

   /**
    * This function checks if an object is equals
    * to this layer
    *
    * @private
    * @function
    * @param {ol.Feature} feature
    */
   M.impl.layer.Geosearch.prototype.internalUnselectFeatures_ = function(keepPopup) {
      if (this.selectedFeatures_.length > 0) {
         // sets the style
         M.impl.layer.Geosearch.setStyleFeature_(this.selectedFeatures_, M.style.state.DEFAULT);
         this.selectedFeatures_.length = 0;

         // removes the popup just when event destroy was not fired
         if (!keepPopup) {
            this.map.removePopup();
         }
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
   M.impl.layer.Geosearch.prototype.setNewResultsAsDefault = function() {
      M.impl.layer.Geosearch.setStyleFeature_(this.getOL3Layer().getSource().getFeatures(), M.style.state.DEFAULT);
   };

   /**
    * This function destroys this layer, clearing the HTML
    * and unregistering all events
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.layer.Geosearch.prototype.destroy = function() {
      var olMap = this.map.getMapImpl();
      if (!M.utils.isNullOrEmpty(this.ol3Layer)) {
         olMap.removeLayer(this.ol3Layer);
         this.ol3Layer = null;
      }
      this.map = null;
      this.wktFormatter_ = null;
      this.popup_ = null;
      this.selectedFeatures_ = null;
      this.name = null;
   };

   /**
    * This function checks if an object is equals
    * to this layer
    *
    * @function
    * @api stable
    */
   M.impl.layer.Geosearch.prototype.equals = function(obj) {
      var equals = false;

      if (obj instanceof M.impl.layer.Geosearch) {
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
   M.impl.layer.Geosearch.setStyleFeature_ = function(features, state) {
      M.impl.geosearch.style.init();

      if (!M.utils.isArray(features)) {
         features = [features];
      }

      features.forEach(function(feature) {
         // gets the geometry type
         var geometryType = feature.getGeometry().getType();
         if (M.utils.isNullOrEmpty(state) || (state === M.style.state.DEFAULT)) {
            feature.setStyle(M.impl.geosearch.style.DEFAULT[geometryType]);
         }
         else if (state === M.style.state.NEW) {
            feature.setStyle(M.impl.geosearch.style.NEW[geometryType]);
         }
         else if (state === M.style.state.SELECTED) {
            feature.setStyle(M.impl.geosearch.style.SELECTED[geometryType]);
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
   M.impl.layer.Geosearch.POPUP_RESULT = "geosearchfeaturepopup.html";
})();