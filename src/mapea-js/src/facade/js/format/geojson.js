import Feature from '../feature/feature';
import Base from '../facade';
import Utils from '../utils/utils';
import Exception from '../exception/exception';
import GeoJSONImpl from '../../../impl/js/format/geojsonformat';

export default class GeoJSON extends Base {

  constructor(options) {
    let impl = new GeoJSONImpl(options);

    // calls the super constructor
    super(impl);

    // checks if the implementation can create format GeoJSON
    if (Utils.isUndefined(GeoJSONImpl)) {
      Exception('La implementación usada no puede M.impl.format.GeoJSON');
    }

    options = (options || {});

    /**
     * Implementation of this formatter
     * @public
     * @type {M.impl.format.GeoJSON}
     */

  }

  /**
   * TODO
   *
   * @public
   * @function
   * @param {Array<M.Feature>} features features array to parsed
   * as a GeoJSON FeatureCollection
   * @return {Array<Object>}
   * @api stable
   */
  write(features) {
    if (!Utils.isArray(features)) {
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
   * @api stable
   */
  read(geojson, projection) {
    let features = [];
    if (!Utils.isNullOrEmpty(geojson)) {
      if (Utils.isString(geojson)) {
        geojson = JSON.parse(geojson);
      }
      let geojsonFeatures = [];
      if (geojson.type === "FeatureCollection") {
        geojsonFeatures = geojson.features;
      } else if (geojson.type === "Feature") {
        geojsonFeatures = [geojson];
      }
      features = this.getImpl().read(geojson, geojsonFeatures, projection);
    }
    return features;
  }
}
