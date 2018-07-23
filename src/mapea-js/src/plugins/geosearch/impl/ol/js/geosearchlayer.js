import GeoStyle from "./geosearchstyle";

export default class GeosearchLayer extends M.impl.layer.Vector {
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
  constructor(name = 'geosearch', options = {}) {
    // calls the super constructor
    super(options);
    /**
     * Currently drawn feature coordinate.
     * @private
     * @type {ol.format.M.geom.wkt}
     */
    this.wktFormatter_ = new ol.format.M.geom.wkt();

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

    if (!options.displayInLayerSwitcher) {
      options.displayInLayerSwitcher = false;
    }

    /**
     * Name of the layer
     * @private
     * @type {String}
     */
    this.name = name;

  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.Map} map
   * @api stable
   */
  addTo(map) {
    super('addTo', map);

    this.ol3Layer.setSource(new ol.source.Vector({
      'useSpatialIndex': false
    }));
  }

  /**
   * This function draws the results into the specified map
   *
   * @public
   * @function
   * @param {Array<Object>} results to draw
   * @api stable
   */
  drawResults(results) {
    let projection = ol.proj.get(this.map.getProjection().code);

    let docs = [];
    if (!M.utils.isNullOrEmpty(results.spatial_response)) {
      docs = results.spatial_response.docs;
    }
    if (M.utils.isNullOrEmpty(docs)) {
      docs = results.response.docs;
    }

    let features = docs.map(doc => {
      let feature = this.wktFormatter_.readFeature(doc.geom, {
        'dataProjection': projection
      });
      feature.setId(doc.solrid);
      feature.setProperties(doc);
      GeosearchLayer.setStyleFeature_(feature, M.style.state.DEFAULT);

      this.wrapComplexFeature_(feature);

      return M.impl.Feature.olFeature2Facade(feature);
    }, this);

    this.facadeVector_.addFeatures(features);
  }

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  drawNewResults(results) {
    let projection = ol.proj.get(this.map.getProjection().code);

    let docs;
    if (!M.utils.isNullOrEmpty(results.spatial_response)) {
      docs = results.spatial_response.docs;
    } else if (!M.utils.isNullOrEmpty(results.response)) {
      docs = results.response.docs;
    }

    let features = docs.map(function (doc) {
      let feature = this.wktFormatter_.readFeature(doc.geom, {
        'dataProjection': projection
      });
      feature.setId(doc.solrid);
      feature.setProperties(doc);
      GeosearchLayer.setStyleFeature_(feature, M.style.state.NEW);

      return M.impl.Feature.olFeature2Facade(feature);
    }, this);

    this.facadeVector_.addFeatures(features);
  }

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  clear(results) {
    this.map.removePopup();
    // this.ol3Layer.getSource().clear();
    this.facadeVector_.clear();
  }

  /**
   * This function checks if an object is equals
   * to this layer
   * @public
   * @function
   * @param {ol.Feature} feature
   * @api stable
   */
  selectFeatures(features, coord, evt, noPanMapIfOutOfView) {
    // unselects previous features
    this.unselectFeatures();

    // sets the style
    this.selectedFeatures_ = features;

    // gets olFeatures
    features = features.map(M.impl.Feature.facade2OLFeature);

    GeosearchLayer.setStyleFeature_(features, M.style.state.SELECTED);

    let featureForTemplate = this.parseFeaturesForTemplate_(features);
    M.Template.compile(GeosearchLayer.POPUP_RESULT, {
        'jsonp': true,
        'vars': featureForTemplate,
        'parseToHtml': false
      })
      .then(htmlAsText => {
        let featureTabOpts = {
          'icon': 'g-cartografia-pin',
          'title': 'Geosearch',
          'content': htmlAsText
        };
        let popup = this.map.getPopup();
        if (M.utils.isNullOrEmpty(popup)) {
          popup = new M.Popup({
            'panMapIfOutOfView': !noPanMapIfOutOfView,
            'ani': null
          });
          popup.addTab(featureTabOpts);
          this.map.addPopup(popup, coord);
        } else {
          popup.addTab(featureTabOpts);
        }
        // removes events on destroy
        popup.on(M.evt.DESTROY, () => {
          this.internalUnselectFeatures_(true);
        }, this);
      });
  }

  /**
   * This function checks if an object is equals
   * to this layer
   * @public
   * @function
   * @param {ol.Feature} feature
   * @api stable
   */
  selectFeatureBySolrid(solrid) {
    // var feature = this.ol3Layer.getSource().getFeatureById(solrid);
    let feature = this.facadeVector_.getFeatureById(solrid);
    this.selectedFeatures_ = [feature];

    let featureGeom = feature.getImpl().getOLFeature().getGeometry();
    let coord = M.impl.utils.getCentroidCoordinate(featureGeom);

    this.unselectFeatures();
    this.selectFeatures([feature], coord, null, true);

    this.map.setBbox(featureGeom.getExtent());
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  parseFeaturesForTemplate_(features) {
    let featuresTemplate = {
      'features': []
    }

    features.forEach(feature => {
      let hiddenAttributes = ['geom', '_version_', 'keywords', 'solrid', feature.getGeometryName()];
      let properties = feature.getProperties();
      let attributes = [];
      for (var key in properties) {
        if (!M.utils.includes(hiddenAttributes, key.toLowerCase())) {
          attributes.push({
            'key': M.utils.beautifyAttributeName(key),
            'value': properties[key]
          });
        }
      }
      let featureTemplate = {
        'solrid': feature.getId(),
        'attributes': attributes
      };
      featuresTemplate.features.push(featureTemplate);
    });
    return featuresTemplate;
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  wrapComplexFeature_(feature) {
    let featureGeom = feature.getGeometry();
    if ((featureGeom.getType() === M.geom.wkt.type.POLYGON) || (featureGeom.getType() === M.geom.wkt.type.MULTI_POLYGON)) {
      let centroid;
      if (featureGeom.getType() === M.geom.wkt.type.POLYGON) {
        centroid = featureGeom.getInteriorPoint();
      } else {
        centroid = featureGeom.getInteriorPoints();
      }
      let geometryCollection = new ol.geom.GeometryCollection([centroid, featureGeom]);
      feature.setGeometry(geometryCollection);
    }
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @public
   * @function
   * @param {ol.Feature} feature
   * @api stable
   */
  unselectFeatures(features, coord) {
    this.internalUnselectFeatures_();
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @private
   * @function
   * @param {ol.Feature} feature
   */
  internalUnselectFeatures_(keepPopup) {
    if (this.selectedFeatures_.length > 0) {
      // sets the style
      GeosearchLayer.setStyleFeature_(this.selectedFeatures_.map(M.impl.Feature.facade2OLFeature), M.style.state.DEFAULT);
      this.selectedFeatures_.length = 0;

      // removes the popup just when event destroy was not fired
      if (!keepPopup) {
        this.map.removePopup();
      }
    }
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @public
   * @function
   * @param {ol.Feature} feature
   * @api stable
   */
  setNewResultsAsDefault() {
    GeosearchLayer.setStyleFeature_(this.facadeVector_.getFeatures().map(M.impl.Feature.facade2OLFeature), M.style.state.DEFAULT);
  }

  /**
   * This function destroys this layer, clearing the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    let olMap = this.map.getMapImpl();
    if (!M.utils.isNullOrEmpty(this.ol3Layer)) {
      olMap.removeLayer(this.ol3Layer);
      this.ol3Layer = null;
    }
    this.map = null;
    this.wktFormatter_ = null;
    this.popup_ = null;
    this.selectedFeatures_ = null;
    this.name = null;
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api stable
   */
  equals(obj) {
    let equals = false;

    if (obj instanceof GeosearchLayer) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
    }
    return equals;
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @private
   * @function
   */
  static setStyleFeature_(features, state) {
    GeoStyle.init();

    if (!M.utils.isArray(features)) {
      features = [features];
    }

    features.forEach(feature => {
      // gets the geometry type
      let geometryType = feature.getGeometry().getType();
      if (M.utils.isNullOrEmpty(state) || (state === Style.state.DEFAULT)) {
        feature.setStyle(GeoStyle.DEFAULT[geometryType]);
      } else if (state === Style.state.NEW) {
        feature.setStyle(GeoStyle.NEW[geometryType]);
      } else if (state === Style.state.SELECTED) {
        feature.setStyle(GeoStyle.SELECTED[geometryType]);
      }
    });
  }
}

/**
 * Template for this controls
 * @const
 * @type {string}
 * @public
 * @api stable
 */
GeosearchLayer.POPUP_RESULT = "geosearchfeaturepopup.html";
