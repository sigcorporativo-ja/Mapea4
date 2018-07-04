import Utils from '../utils/utils';
import Exception from '../exception/exception';

export default class Zoom {
  /**
   * Parses the specified user zoom parameter into a number
   *
   * @param {String|Number} zoomParameter parameters
   * provided by the user
   * @returns {Number}
   * @public
   * @function
   * @api stable
   */
  zoom(zoomParameter) {
    let zoom;

    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(zoomParameter)) {
      Exception('No ha especificado ningún parámetro zoom');
    }

    // string
    if (Utils.isString(zoomParameter)) {
      zoom = Number.parseInt(zoomParameter);
    }
    // number
    else if (typeof zoomParameter === 'number') {
      zoom = zoomParameter;
    }
    // unknown
    else {
      Exception('El parámetro no es de un tipo soportado: ' + (typeof zoomParameter));
    }

    if (Number.isNaN(zoom)) {
      Exception('El formato del parámetro zoom no es correcto');
    }
    return zoom;
  }
}
