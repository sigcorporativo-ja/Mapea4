import Utils from '../utils/utils';
import Exception from '../exception/exception';

export default class maxExtent {

  /**
   * Parses the specified user maxExtent parameter into an object
   *
   * @param {String|Array<String>|Array<Number>|Mx.Extent} maxExtentParameter parameters
   * provided by the user
   * @returns {Mx.Extent}
   * @public
   * @function
   * @api stable
   */
  maxExtent(maxExtentParameter) {
    let maxExtent = {
      x: {},
      y: {}
    };

    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(maxExtentParameter)) {
      Exception('No ha especificado ningún parámetro maxExtent');
    }

    // string
    if (Utils.isString(maxExtentParameter)) {
      if (/^\s*-?\d+(\.\d+)?\s*[\,\;]\s*-?\d+(\.\d+)?\s*[\,\;]\s*-?\d+(\.\d+)?\s*[\,\;]\s*-?\d+(\.\d+)?$/.test(maxExtentParameter)) {
        let extentArray = maxExtentParameter.split(/[\,\;]+/);
        if (extentArray.length === 4) {
          maxExtent.x.min = Number.parseFloat(extentArray[0]);
          maxExtent.y.min = Number.parseFloat(extentArray[1]);
          maxExtent.x.max = Number.parseFloat(extentArray[2]);
          maxExtent.y.max = Number.parseFloat(extentArray[3]);
        } else {
          Exception('El formato del parámetro maxExtent no es correcto');
        }
      } else {
        Exception('El formato del parámetro maxExtent no es correcto');
      }
    }
    // array
    else if (Utils.isArray(maxExtentParameter)) {
      if (maxExtentParameter.length === 4) {
        if (Utils.isString(maxExtentParameter[0])) {
          maxExtentParameter[0] = Number.parseFloat(maxExtentParameter[0]);
        }
        if (Utils.isString(maxExtentParameter[1])) {
          maxExtentParameter[1] = Number.parseFloat(maxExtentParameter[1]);
        }
        if (Utils.isString(maxExtentParameter[2])) {
          maxExtentParameter[2] = Number.parseFloat(maxExtentParameter[2]);
        }
        if (Utils.isString(maxExtentParameter[3])) {
          maxExtentParameter[3] = Number.parseFloat(maxExtentParameter[3]);
        }
        maxExtent.x.min = maxExtentParameter[0];
        maxExtent.y.min = maxExtentParameter[1];
        maxExtent.x.max = maxExtentParameter[2];
        maxExtent.y.max = maxExtentParameter[3];
      } else {
        Exception('El formato del parámetro maxExtent no es correcto');
      }
    }
    // object
    else if (Utils.isObject(maxExtentParameter)) {
      // x min
      if (!Utils.isNull(maxExtentParameter.left)) {
        if (Utils.isString(maxExtentParameter.left)) {
          maxExtentParameter.left = Number.parseFloat(maxExtentParameter.left);
        }
        maxExtent.x.min = maxExtentParameter.left;
      } else if (!Utils.isNull(maxExtentParameter.x.min)) {
        if (Utils.isString(maxExtentParameter.x.min)) {
          maxExtentParameter.x.min = Number.parseFloat(maxExtentParameter.x.min);
        }
        maxExtent.x.min = maxExtentParameter.x.min;
      } else {
        Exception('El formato del parámetro maxExtent no es correcto');
      }
      // y min
      if (!Utils.isNull(maxExtentParameter.bottom)) {
        if (Utils.isString(maxExtentParameter.bottom)) {
          maxExtentParameter.bottom = Number.parseFloat(maxExtentParameter.bottom);
        }
        maxExtent.y.min = maxExtentParameter.bottom;
      } else if (!Utils.isNull(maxExtentParameter.y.min)) {
        if (Utils.isString(maxExtentParameter.y.min)) {
          maxExtentParameter.y.min = Number.parseFloat(maxExtentParameter.y.min);
        }
        maxExtent.y.min = maxExtentParameter.y.min;
      } else {
        Exception('El formato del parámetro maxExtent no es correcto');
      }
      // x max
      if (!Utils.isNull(maxExtentParameter.right)) {
        if (Utils.isString(maxExtentParameter.right)) {
          maxExtentParameter.right = Number.parseFloat(maxExtentParameter.right);
        }
        maxExtent.x.max = maxExtentParameter.right;
      } else if (!Utils.isNull(maxExtentParameter.x.max)) {
        if (Utils.isString(maxExtentParameter.x.max)) {
          maxExtentParameter.x.max = Number.parseFloat(maxExtentParameter.x.max);
        }
        maxExtent.x.max = maxExtentParameter.x.max;
      } else {
        Exception('El formato del parámetro maxExtent no es correcto');
      }
      // y max
      if (!Utils.isNull(maxExtentParameter.top)) {
        if (Utils.isString(maxExtentParameter.top)) {
          maxExtentParameter.top = Number.parseFloat(maxExtentParameter.top);
        }
        maxExtent.y.max = maxExtentParameter.top;
      } else if (!Utils.isNull(maxExtentParameter.y.max)) {
        if (Utils.isString(maxExtentParameter.y.max)) {
          maxExtentParameter.y.max = Number.parseFloat(maxExtentParameter.y.max);
        }
        maxExtent.y.max = maxExtentParameter.y.max;
      } else {
        Exception('El formato del parámetro maxExtent no es correcto');
      }
    }
    // unknown
    else {
      Exception('El parámetro no es de un tipo soportado: ' + (typeof maxExtentParameter));
    }

    if (Number.isNaN(maxExtent.x.min) || Number.isNaN(maxExtent.y.min) || Number.isNaN(maxExtent.x.max) || Number.isNaN(maxExtent.y.max)) {
      Exception('El formato del parámetro maxExtent no es correcto');
    }

    return maxExtent;
  }
}
