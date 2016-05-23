goog.provide('M.parameter.center');

goog.require('M.utils');
goog.require('M.exception');

(function () {
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
   M.parameter.center = function (centerParameter) {
      var center = {};

      // checks if the param is null or empty
      if (M.utils.isNullOrEmpty(centerParameter)) {
         M.exception('No ha especificado ningún parámetro center');
      }

      // string
      if (M.utils.isString(centerParameter)) {
         centerParameter = M.utils.normalize(centerParameter);
         if (/^\-?\d+(\.\d+)?[\,\;]\-?\d+(\.\d+)?([\*](true|false))?$/i.test(centerParameter)) {
            var centerArray = centerParameter.split(/\*/);
            var coord = centerArray[0];
            var draw = centerArray[1];
            var coordArray = coord.split(/[\,\;]+/);
            if (coordArray.length === 2) {
               center.x = Number.parseFloat(coordArray[0]);
               center.y = Number.parseFloat(coordArray[1]);
            }
            else {
               M.exception('El formato del parámetro center no es correcto');
            }
            center.draw = /^true$/i.test(draw);
         }
         else {
            M.exception('El formato del parámetro center no es correcto');
         }
      }
      // array
      else if (M.utils.isArray(centerParameter)) {
         if (centerParameter.length === 2) {
            if (M.utils.isString(centerParameter[0])) {
               centerParameter[0] = Number.parseFloat(centerParameter[0]);
            }
            if (M.utils.isString(centerParameter[1])) {
               centerParameter[1] = Number.parseFloat(centerParameter[1]);
            }
            center.x = centerParameter[0];
            center.y = centerParameter[1];
         }
         else {
            M.exception('El formato del parámetro center no es correcto');
         }
      }
      // object
      else if (M.utils.isObject(centerParameter)) {
         // x
         if (!M.utils.isNull(centerParameter.x)) {
            if (M.utils.isString(centerParameter.x)) {
               centerParameter.x = Number.parseFloat(centerParameter.x);
            }
            center.x = centerParameter.x;
         }
         else {
            M.exception('El formato del parámetro center no es correcto');
         }
         // y
         if (!M.utils.isNull(centerParameter.y)) {
            if (M.utils.isString(centerParameter.y)) {
               centerParameter.y = Number.parseFloat(centerParameter.y);
            }
            center.y = centerParameter.y;
         }
         else {
            M.exception('El formato del parámetro center no es correcto');
         }
         // draw
         if (!M.utils.isNull(centerParameter.draw)) {
            center.draw = /^true$/.test(centerParameter.draw);
         }
         else {
            center.draw = false;
         }
      }
      // unknown
      else {
         M.exception('El parámetro no es de un tipo soportado: ' + (typeof maxExtentParameter));
      }

      if (Number.isNaN(center.x) || Number.isNaN(center.y)) {
         M.exception('El formato del parámetro center no es correcto');
      }

      return center;
   };
})();