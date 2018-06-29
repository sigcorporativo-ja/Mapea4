import Function from('./stylefunction.js');
import Utils from('../utils/utils.js');
/**
 * @namespace M.filter
 */
export class Spatial extends Spatial {

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
        geometry = feature.geometry();
      }
      return FunctionParam(geometry, index);
    }
  }
}
