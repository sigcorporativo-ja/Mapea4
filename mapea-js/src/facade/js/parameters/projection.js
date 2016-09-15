goog.provide('M.parameter.projection');

goog.require('M.utils');
goog.require('M.exception');

(function() {
   'use strict';

   /**
    * Parses the specified user projection parameter into an object
    *
    * @param {String|Mx.Projection} projectionParameter parameters
    * provided by the user
    * @returns {Mx.Projection}
    * @public
    * @function
    * @api stable
    */
   M.parameter.projection = function(projectionParameter) {
      var projection = {
         code: null,
         units: null
      };

      // checks if the param is null or empty
      if (M.utils.isNullOrEmpty(projectionParameter)) {
         M.exception('No ha especificado ningún parámetro projection');
      }

      // string
      if (M.utils.isString(projectionParameter)) {
         if (/^(EPSG\:)?\d+\*((d(egrees)?)|(m(eters)?))$/i.test(projectionParameter)) {
            var projectionArray = projectionParameter.split(/\*/);
            projection.code = projectionArray[0];
            projection.units = M.utils.normalize(projectionArray[1].substring(0, 1));
         }
         else {
            M.exception('El formato del parámetro projection no es correcto. </br>Se usará la proyección por defecto: '+M.config.DEFAULT_PROJ);
         }
      }
      // object
      else if (M.utils.isObject(projectionParameter)) {
         // y max
         if (!M.utils.isNull(projectionParameter.code) &&
            !M.utils.isNull(projectionParameter.units)) {
            projection.code = projectionParameter.code;
            projection.units = M.utils.normalize(projectionParameter.units.substring(0, 1));
         }
         else {
            M.exception('El formato del parámetro projection no es correcto. </br>Se usará la proyección por defecto: '+M.config.DEFAULT_PROJ);
         }
      }
      // unknown
      else {
         M.exception('El parámetro no es de un tipo soportado: ' + (typeof projectionParameter));
      }

      if ((projection.units !== 'm') && (projection.units !== 'd')) {
         M.exception('La unidad "' + projectionParameter.units + '" del parámetro projection no es válida. Las disponibles son: "m" o "d"');
      }

      return projection;
   };
})();