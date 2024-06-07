import GeoStyle from './geosearchstyle.js';
import UtilsGeosearch from './utils.js';
import resultsPopupHTML from '../../../templates/geosearchfeaturepopup.html';

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
  constructor(name = 'geosearch', optionsParam = {}) {
    const options = optionsParam;

    // calls the super constructor
    super(options);

    /**
     * Currently drawn feature coordinate.
     * @private
     * @type {ol.format.M.geom.wkt}
     */

    /* eslint new-cap: ["error", { "newIsCap": false } ] */

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
    super.addTo(map);

    this.ol3Layer.setSource(new ol.source.Vector({
      useSpatialIndex: false,
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
    const projection = ol.proj.get(this.map.getProjection().code);
    // const resultVar = JSON.parse(results);
    let docs = [];
    if (!M.utils.isNullOrEmpty(results.spatial_response)) {
      docs = results.spatial_response.docs;
    }
    if (M.utils.isNullOrEmpty(docs)) {
      docs = results.response.docs;
    }

    const features = docs.map((doc) => {
      const feature = this.wktFormatter_.readFeature(doc.geom, {
        dataProjection: projection,
      });
      feature.setId(doc.solrid);
      feature.setProperties(doc);
      GeosearchLayer.setStyleFeature(feature, M.style.state.DEFAULT);

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
    const projection = ol.proj.get(this.map.getProjection().code);

    let docs;
    if (!M.utils.isNullOrEmpty(results.spatial_response)) {
      docs = results.spatial_response.docs;
    } else if (!M.utils.isNullOrEmpty(results.response)) {
      docs = results.response.docs;
    }

    const features = docs.map((doc) => {
      const feature = this.wktFormatter_.readFeature(doc.geom, {
        dataProjection: projection,
      });
      feature.setId(doc.solrid);
      feature.setProperties(doc);
      GeosearchLayer.setStyleFeature(feature, M.style.state.NEW);

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
  selectFeatures(featuresParam, coord, evt, noPanMapIfOutOfView) {
    let features = featuresParam;

    // unselects previous features
    this.unselectFeatures();

    // sets the style
    this.selectedFeatures_ = features;

    // gets olFeatures
    features = features.map(M.impl.Feature.facade2OLFeature);

    GeosearchLayer.setStyleFeature(features, M.style.state.SELECTED);

    const featureForTemplate = this.parseFeaturesForTemplate_(features);
    const options = { jsonp: true, vars: featureForTemplate, parseToHtml: false };
    const htmlAsText = M.template.compileSync(resultsPopupHTML, options);
    const featureTabOpts = {
      icon: 'g-cartografia-pin',
      title: 'Geosearch',
      content: htmlAsText,
    };
    let popup = this.map.getPopup();
    if (M.utils.isNullOrEmpty(popup)) {
      popup = new M.Popup({
        panMapIfOutOfView: !noPanMapIfOutOfView,
        ani: null,
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
    const feature = this.facadeVector_.getFeatureById(solrid);
    this.selectedFeatures_ = [feature];

    const featureGeom = feature.getImpl().getOLFeature().getGeometry();
    const coord = UtilsGeosearch.getCentroidCoordinate(featureGeom);

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
    const featuresTemplate = {
      features: [],
    };

    features.forEach((feature) => {
      const hiddenAttributes = ['geom', '_version_', 'keywords', 'solrid', feature.getGeometryName()];
      const properties = feature.getProperties();
      const attributes = [];
      const propKey = Object.keys(properties);
      propKey.forEach((key) => {
        if (!M.utils.includes(hiddenAttributes, key.toLowerCase())) {
          attributes.push({
            key: M.utils.beautifyAttributeName(key),
            value: properties[key],
          });
        }
      });
      const featureTemplate = {
        solrid: feature.getId(),
        attributes,
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
    const featureGeom = feature.getGeometry();
    if ((featureGeom.getType() === M.geom.wkt.type.POLYGON)
      || (featureGeom.getType() === M.geom.wkt.type.MULTI_POLYGON)) {
      let centroid;
      if (featureGeom.getType() === M.geom.wkt.type.POLYGON) {
        centroid = featureGeom.getInteriorPoint();
      } else {
        centroid = featureGeom.getInteriorPoints();
      }
      const geometryCollection = new ol.geom.GeometryCollection([centroid, featureGeom]);
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
      GeosearchLayer.setStyleFeature(this.selectedFeatures_
        .map(M.impl.Feature.facade2OLFeature), M.style.state.DEFAULT);
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
    GeosearchLayer.setStyleFeature(this.facadeVector_.getFeatures()
      .map(M.impl.Feature.facade2OLFeature), M.style.state.DEFAULT);
  }

  getCentroidCoordinate(geometry) {
    let centroid;
    let coordinates;
    let medianIdx;
    let points;
    let lineStrings;
    let geometries;

    // POINT
    if (geometry.getType() === M.geom.wkt.type.POINT) {
      centroid = geometry.getCoordinates();
    } else if (geometry.getType() === M.geom.wkt.type.LINE_STRING) {
      // LINE
      coordinates = geometry.getCoordinates();
      medianIdx = Math.floor(coordinates.length / 2);
      centroid = coordinates[medianIdx];
    } else if (geometry.getType() === M.geom.wkt.type.LINEAR_RING) {
      coordinates = geometry.getCoordinates();
      medianIdx = Math.floor(coordinates.length / 2);
      centroid = coordinates[medianIdx];
    } else if (geometry.getType() === M.geom.wkt.type.POLYGON) {
      // POLYGON
      centroid = this.getCentroidCoordinate(geometry.getInteriorPoint());
    } else if (geometry.getType() === M.geom.wkt.type.MULTI_POINT) {
      // MULTI
      points = geometry.getPoints();
      medianIdx = Math.floor(points.length / 2);
      centroid = this.getCentroidCoordinate(points[medianIdx]);
    } else if (geometry.getType() === M.geom.wkt.type.MULTI_LINE_STRING) {
      lineStrings = geometry.getLineStrings();
      medianIdx = Math.floor(lineStrings.length / 2);
      centroid = this.getCentroidCoordinate(lineStrings[medianIdx]);
    } else if (geometry.getType() === M.geom.wkt.type.MULTI_POLYGON) {
      points = geometry.getInteriorPoints();
      centroid = this.getCentroidCoordinate(points);
    } else if (geometry.getType() === M.geom.wkt.type.CIRCLE) {
      centroid = geometry.getCenter();
    } else if (geometry.getType() === M.geom.wkt.type.GEOMETRY_COLLECTION) {
      geometries = geometry.getGeometries();
      medianIdx = Math.floor(geometries.length / 2);
      centroid = this.getCentroidCoordinate(geometries[medianIdx]);
    }
    return centroid;
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
    const olMap = this.map.getMapImpl();
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
  static setStyleFeature(featuresParam, state) {
    let features = featuresParam;
    GeoStyle.init();

    if (!M.utils.isArray(features)) {
      features = [features];
    }

    features.forEach((feature) => {
      // gets the geometry type
      const geometryType = feature.getGeometry().getType();
      if (M.utils.isNullOrEmpty(state) || (state === M.style.state.DEFAULT)) {
        feature.setStyle(GeoStyle.DEFAULT[geometryType]);
      } else if (state === M.style.state.NEW) {
        feature.setStyle(GeoStyle.NEW[geometryType]);
      } else if (state === M.style.state.SELECTED) {
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
GeosearchLayer.POPUP_RESULT = 'geosearchfeaturepopup.html';
