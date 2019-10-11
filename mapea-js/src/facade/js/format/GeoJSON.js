/**
 * @module M/format/GeoJSON
 */
import GeoJSONImpl from 'impl/format/GeoJSON';
import Base from '../Base';
import { isUndefined, isArray, isNullOrEmpty, isString } from '../util/Utils';
import Exception from '../exception/exception';
import { getValue } from '../i18n/language';

/**
 * @classdesc
 * Main constructor of the class. Creates a layer
 * with parameters specified by the user
 * @api
 */
class GeoJSON extends Base {
  /**
   *
   * @constructor
   * @extends {M.facade.Base}
   * @param {string|Object} userParameters parameters
   * provided by the user
   * @api
   */
  constructor(options = {}) {
    /**
     * Implementation of this formatter
     * @public
     * @type {M.impl.format.GeoJSON}
     */
    const impl = new GeoJSONImpl(options);

    // calls the super constructor
    super(impl);

    // checks if the implementation can create format GeoJSON
    if (isUndefined(GeoJSONImpl)) {
      Exception(getValue('exception').geojson_method);
    }
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @param {Array<M.Feature>} features features array to parsed
   * as a GeoJSON FeatureCollection
   * @return {Array<Object>}
   * @api
   */
  write(featuresParam) {
    let features = featuresParam;
    if (!isArray(features)) {
      features = [features];
    }
    return this.getImpl().write(features);
  }

  /**
   * This function read Features
   *
   * @public
   * @function
   * @param {object} geojson GeoJSON to parsed as a
   * M.Feature array
   * @return {Array<M.Feature>}
   * @api
   */
  read(geojsonParam, projection) {
    let geojson = geojsonParam;
    let features = [];
    if (!isNullOrEmpty(geojson)) {
      if (isString(geojson)) {
        geojson = JSON.parse(geojson);
      }
      let geojsonFeatures = [];
      if (geojson.type === 'FeatureCollection') {
        geojsonFeatures = geojson.features;
      } else if (geojson.type === 'Feature') {
        geojsonFeatures = [geojson];
      }
      features = this.getImpl().read(geojson, geojsonFeatures, projection);
    }
    return features;
  }
}

export default GeoJSON;
