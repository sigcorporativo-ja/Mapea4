import Utils from '../utils/utils';
import Exception from '../exception/exception';

export default class Projection {

  projection(projectionParameter) {
    let projection = {
      code: null,
      units: null
    }

    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(projectionParameter)) {
      Exception('No ha especificado ningún parámetro projection');
    }

    // string
    if (Utils.isString(projectionParameter)) {
      if (/^(EPSG\:)?\d+\*((d(egrees)?)|(m(eters)?))$/i.test(projectionParameter)) {
        let projectionArray = projectionParameter.split(/\*/);
        projection.code = projectionArray[0];
        projection.units = Utils.normalize(projectionArray[1].substring(0, 1));
      } else {
        Exception('El formato del parámetro projection no es correcto. </br>Se usará la proyección por defecto: ' + M.config.DEFAULT_PROJ);
      }
    }
    // object
    else if (Utils.isObject(projectionParameter)) {
      // y max
      if (!Utils.isNull(projectionParameter.code) &&
        !Utils.isNull(projectionParameter.units)) {
        projection.code = projectionParameter.code;
        projection.units = Utils.normalize(projectionParameter.units.substring(0, 1));
      } else {
        Exception('El formato del parámetro projection no es correcto. </br>Se usará la proyección por defecto: ' + M.config.DEFAULT_PROJ);
      }
    }
    // unknown
    else {
      Exception('El parámetro no es de un tipo soportado: ' + (typeof projectionParameter));
    }

    if ((projection.units !== 'm') && (projection.units !== 'd')) {
      Exception('La unidad "' + projectionParameter.units + '" del parámetro projection no es válida. Las disponibles son: "m" o "d"');
    }

    return projection;
  }
}
