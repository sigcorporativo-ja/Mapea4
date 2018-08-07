import OLGeomGeometry from 'ol/geom/Geometry';
import OLGeomPoint from 'ol/geom/Point';
import OLGeomCircle from 'ol/geom/Circle';
import OLGeomMultiPoint from 'ol/geom/MultiPoint';
import OLGeomLineString from 'ol/geom/LineString';
import OLGeomPolygon from 'ol/geom/Polygon';
import OLGeomMultiLineString from 'ol/geom/MultiLineString';
import OLGeomMultiPolygon from 'ol/geom/MultiPolygon';
import OLFeature from 'ol/Feature';
import FacadeFeature from 'facade/js/feature/Feature';
import { isNullOrEmpty, generateRandom } from 'facade/js/util/Utils';
import FormatGeoJSON from '../format/GeoJSON';
import ImplUtils from '../util/Utils';

export default class Feature {
  /**
   * @classdesc
   * Main constructor of the class. Create a Feature
   *
   * @constructor
   * @implements {M.impl.Layer}
   * @param {string} id - id to feature
   * @param {Object} geojson - geojson to feature
   * @api stable
   */
  constructor(id, geojson, style) {
    const geojsonVariable = geojson;
    this.facadeFeature_ = null;
    this.formatter_ = new FormatGeoJSON();
    if (!isNullOrEmpty(geojson)) {
      if (isNullOrEmpty(geojson.type)) {
        geojsonVariable.type = 'Feature';
      }
      this.olFeature_ = this.formatter_.readFeature(geojsonVariable);
    } else {
      this.olFeature_ = new OLFeature();
    }
    if (!isNullOrEmpty(id)) {
      this.olFeature_.setId(id);
    } else if (isNullOrEmpty(this.olFeature_.getId())) {
      this.olFeature_.setId(generateRandom('mapea_feature_'));
    }
  }

  /**
   * This function returns the openlayers object of the features
   * @public
   * @function
   * @return {OLFeature} returns the openlayers object of the features
   * @api stable
   */
  getOLFeature() {
    return this.olFeature_;
  }

  /**
   * This function set the openlayers object of the features
   * @public
   * @param {OLFeature} olFeature - ol Feature to feature
   * @function
   * @api stable
   */
  setOLFeature(olFeature, canBeModified) {
    if (!isNullOrEmpty(olFeature)) {
      this.olFeature_ = olFeature;
      if (canBeModified !== false && isNullOrEmpty(this.olFeature_.getId())) {
        this.olFeature_.setId(generateRandom('mapea_feature_'));
      }
    }
  }

  /**
   * This function return attributes feature
   * @public
   * @return {Object} Attributes feature
   * @function
   * @api stable
   */
  getAttributes() {
    const properties = this.olFeature_.getProperties();
    const geometry = properties.geometry;
    if (!isNullOrEmpty(geometry) && geometry instanceof OLGeomGeometry) {
      delete properties.geometry;
    }
    return properties;
  }

  /**
   * This function return id feature
   *
   * @public
   * @function
   * @return {string} ID to feature
   * @api stable
   */
  getId() {
    return this.olFeature_.getId();
  }

  /**
   * This function set id
   *
   * @public
   * @function
   * @param {string} id - ID to feature
   * @api stable
   */
  setId(id) {
    this.olFeature_.setId(id);
  }

  /**
   * This function set attributes feature
   *
   * @public
   * @function
   * @param {Object} attributes - attributes to feature
   * @api stable
   */
  setAttributes(attributes) {
    this.olFeature_.setProperties(attributes);
  }

  /**
   * This funcion transform OLFeature to M.Feature
   *
   * @public
   * @function
   * @param {OLFeature} olFeature - OLFeature
   * @return {M.Feature}  facadeFeature - M.Feature
   * @api stable
   */
  static olFeature2Facade(olFeature, canBeModified) {
    let facadeFeature = null;
    if (!isNullOrEmpty(olFeature)) {
      facadeFeature = new FacadeFeature();
      facadeFeature.getImpl().setOLFeature(olFeature, canBeModified);
    }
    return facadeFeature;
  }

  /**
   * This funcion transform M.Feature to OLFeature
   *
   * @public
   * @function
   * @param {M.Feature}  facadeFeature - M.Feature
   * @return {OLFeature} olFeature - OLFeature
   * @api stable
   */
  static facade2OLFeature(feature) {
    return feature.getImpl().getOLFeature();
  }

  /**
   * This function returns the value of the indicated attribute
   *
   * @public
   * @function
   * @param {string} attribute - Name attribute
   * @return  {string|number|object} returns the value of the indicated attribute
   * @api stable
   */
  getAttribute(attribute) {
    return this.olFeature_.get(attribute);
  }

  /**
   * This function set value of the indicated attribute
   *
   * @public
   * @function
   * @param {string} attribute - Name attribute
   * @return  {string|number|object} returns the value of the indicated attribute
   * @api stable
   */
  setAttribute(attribute, value) {
    return this.olFeature_.set(attribute, value);
  }

  /**
   * This function return geometry feature
   *
   * @public
   * @function
   * @param {object} geojson - GeoJSON Feature
   * @return {object} Geometry feature
   * @api stable
   */
  static getGeometry(geojson) {
    let geometry;
    const type = geojson.geometry.type;
    if (type === 'circle') {
      geometry = new OLGeomCircle(geojson.geometry.coordinates);
    } else if (type === 'geometry') {
      geometry = new OLGeomGeometry(geojson.geometry.coordinates);
    } else if (type === 'linestring') {
      geometry = new OLGeomLineString(geojson.geometry.coordinates);
    } else if (type === 'multilinestring') {
      geometry = new OLGeomMultiLineString(geojson.geometry.coordinates);
    } else if (type === 'multipoint') {
      geometry = new OLGeomMultiPoint(geojson.geometry.coordinates);
    } else if (type === 'multipolygon') {
      geometry = new OLGeomMultiPolygon(geojson.geometry.coordinates);
    } else if (type === 'point') {
      geometry = new OLGeomPoint(geojson.geometry.coordinates);
    } else if (type === 'polygon') {
      geometry = new OLGeomPolygon(geojson.geometry.coordinates);
    }
    return geometry;
  }

  /**
   * This function set geometry feature
   *
   * @public
   * @function
   * @param {object} Geometry - GeoJSON Feature
   * @api stable
   */
  setGeometry(geometry) {
    const type = geometry.type.toLowerCase();
    if (type === 'circle') {
      this.olFeature_.setGeometry(new OLGeomCircle(geometry.coordinates));
    } else if (type === 'geometry') {
      this.olFeature_.setGeometry(new OLGeomGeometry(geometry.coordinates));
    } else if (type === 'linestring') {
      this.olFeature_.setGeometry(new OLGeomLineString(geometry.coordinates));
    } else if (type === 'multilinestring') {
      this.olFeature_.setGeometry(new OLGeomMultiLineString(geometry.coordinates));
    } else if (type === 'multipoint') {
      this.olFeature_.setGeometry(new OLGeomMultiPoint(geometry.coordinates));
    } else if (type === 'multipolygon') {
      this.olFeature_.setGeometry(new OLGeomMultiPolygon(geometry.coordinates));
    } else if (type === 'point') {
      this.olFeature_.setGeometry(new OLGeomPoint(geometry.coordinates));
    } else if (type === 'polygon') {
      this.olFeature_.setGeometry(new OLGeomPolygon(geometry.coordinates));
    }
  }

  /**
   * This function set facade class vector
   *
   * @function
   * @param {object} obj - Facade vector
   * @api stable
   */
  setFacadeObj(obj) {
    this.facadeFeature_ = obj;
  }

  /**
   * This function returns de centroid of feature
   *
   * @public
   * @function
   * @return {Array<number>}
   * @api stable
   */
  getCentroid() {
    let olCentroid;
    const olFeature = this.getOLFeature();
    const geometry = olFeature.getGeometry();
    const center = ImplUtils.getCentroid(geometry);
    if (!isNullOrEmpty(center)) {
      const geom = new OLGeomPoint();
      geom.setCoordinates(center);
      olCentroid = new OLFeature({
        geometry: geom,
        name: 'centroid',
      });
    }
    olCentroid = olCentroid || Feature.olFeature2Facade(olCentroid);
    return olCentroid;
  }

  /**
   * This function clear the style of feature
   *
   * @public
   * @function
   * @return {Array<number>}
   * @api stable
   */
  clearStyle() {
    this.olFeature_.setStyle(null);
  }
}
