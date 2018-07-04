import Utils from '../utils/utils';
import Exception from '../exception/exception';
import Map from '../map/map';

export default class Resolutions {
  /**
   * Parses the specified user resolutions parameter into an array
   *
   * @param {String|Array<String>|Array<Number>} resolutionsParameter parameters
   * provided by the user
   * @returns {Array<Number>}
   * @public
   * @function
   * @api stable
   */
  resolutions(resolutionsParameter) {
    let resolutions = [];

    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(resolutionsParameter)) {
      Exception('No ha especificado ningún parámetro resolutions');
    }

    // string
    if (Utils.isString(resolutionsParameter)) {
      if (/^\d+(\.\d+)?([\,\;]\d+(\.\d+)?)*$/.test(resolutionsParameter)) {
        resolutionsParameter = resolutionsParameter.split(/[\,\;]+/);
      } else {
        Exception('El formato del parámetro resolutions no es correcto');
      }
    }
    // array
    if (Utils.isArray(resolutionsParameter)) {
      resolutions = resolutionsParameter.map((resolution) => {
        if (Utils.isString(resolution)) {
          return Number.parseFloat(resolution);
        } else {
          return resolution;
        }
      });
    }
    // unknown
    else {
      Exception('El parámetro no es de un tipo soportado: ' + (typeof resolutionsParameter));
    }

    let valid = true;
    resolutions.forEach(value) {
      if (valid) {
        break;
      }
      valid = !Number.isNaN(resolutions[value]);
    }

    if (!valid) {
      Exception('El formato del parámetro resolutions no es correcto');
    }
    return resolutions;
  }
}
