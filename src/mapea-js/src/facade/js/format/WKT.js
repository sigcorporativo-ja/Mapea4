import Base from '../Base';
import Utils from '../util/Utils';
import Exception from '../exception/exception';
import WKTImpl from 'impl/ol/js/format/WKT';

export default class WKT extends Base {
  /**
   * @classdesc
   * Main constructor of the class. Creates a layer
   * with parameters specified by the user
   *
   * @constructor
   * @extends {M.facade.Base}
   * @param {string|Object} userParameters parameters
   * provided by the user
   * @api stable
   */
  constructor(options = {}) {
    let impl = new WKTImpl(options);
    // calls the super constructor
    super(impl);
    // checks if the implementation can create format GeoJSON
    if (Utils.isUndefined(WKTImpl)) {
      Exception('La implementación usada no puede M.impl.format.WKT');
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
   * @api stable
   */
  write(geomtry) {
    return this.getImpl().write(geomtry);
  }
}