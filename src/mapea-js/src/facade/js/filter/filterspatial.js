import Function from './stylefunction';
import Utils from '../utils/utils';
/**
 * @namespace M.filter
 */
export default class Spatial extends Function {

  /**
   * Creates a Filter Spatial to filter features
   *
   * @param {function} Function - filter function
   * TODO @param {object} options
   * @api stable
   */
  constructor(FunctionParam, options) {
    //TODO
    super(this, Function, options);


    let Function = (feature, index) => {
      let geometry = null;
      if (!Utils.isNullOrEmpty(feature)) {
        geometry = feature.getGeometry();
      }
      return FunctionParam(geometry, index);
    }
  }
}
