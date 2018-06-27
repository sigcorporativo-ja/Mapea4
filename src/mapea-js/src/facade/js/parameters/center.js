import Utils from('../utils/utils.js');
import Exception from('../exception/exception.js');

export class Center {
  /**
   * Parses the specified user center parameter into an object
   *
   * @param {String|Array<String>|Array<Number>|Mx.Center} centerParameter parameters
   * provided by the user
   * @returns {Mx.Center}
   * @public
   * @function
   * @api stable
   */
  center(centerParameter) {
    let center = {};
    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(centerParameter)) {
      Exception('No ha especificado ningún parámetro center');
    }
    // string
    if (Utils.isString(centerParameter)) {
      centerParameter = Utils.normalize(centerParameter);
      if (/^\-?\d+(\.\d+)?[\,\;]\-?\d+(\.\d+)?([\*](true|false))?$/i.test(centerParameter)) {
        let centerArray = centerParameter.split(/\*/);
        let coord = centerArray[0];
        let draw = centerArray[1];
        let coordArray = coord.split(/[\,\;]+/);
        if (coordArray.length === 2) {
          center.x = Number.parseFloat(coordArray[0]);
          center.y = Number.parseFloat(coordArray[1]);
        } else {
          Exception('El formato del parámetro center no es correcto');
        }
        center.draw = /^1|(true)$/i.test(draw);
      } else {
        Exception('El formato del parámetro center no es correcto');
      }
    }
    // array
    else if (Utils.isArray(centerParameter)) {
      if ((centerParameter.length === 2) || (centerParameter.length === 3)) {
        if (Utils.isString(centerParameter[0])) {
          centerParameter[0] = Number.parseFloat(centerParameter[0]);
        }
        if (Utils.isString(centerParameter[1])) {
          centerParameter[1] = Number.parseFloat(centerParameter[1]);
        }
        center.x = centerParameter[0];
        center.y = centerParameter[1];
      } else {
        Exception('El formato del parámetro center no es correcto');
      }
    }
    // object
    else if (Utils.isObject(centerParameter)) {
      // x
      if (!Utils.isNull(centerParameter.x)) {
        if (Utils.isString(centerParameter.x)) {
          centerParameter.x = Number.parseFloat(centerParameter.x);
        }
        center.x = centerParameter.x;
      } else {
        Exception('El formato del parámetro center no es correcto');
      }
      // y
      if (!Utils.isNull(centerParameter.y)) {
        if (Utils.isString(centerParameter.y)) {
          centerParameter.y = Number.parseFloat(centerParameter.y);
        }
        center.y = centerParameter.y;
      } else {
        Exception('El formato del parámetro center no es correcto');
      }
      // draw
      if (!Utils.isNull(centerParameter.draw)) {
        center.draw = /^true$/.test(centerParameter.draw);
      } else {
        center.draw = false;
      }
    }
    // unknown
    else {
      Exception('El parámetro no es de un tipo soportado: ' + (typeof maxExtentParameter));
    }

    if (Number.isNaN(center.x) || Number.isNaN(center.y)) {
      Exception('El formato del parámetro center no es correcto');
    }

    return center;
  }
}
