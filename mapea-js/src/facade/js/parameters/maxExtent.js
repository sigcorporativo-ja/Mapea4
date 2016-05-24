goog.provide('M.parameter.maxExtent');

goog.require('M.utils');
goog.require('M.exception');

(function() {
   'use strict';

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
   M.parameter.maxExtent = function(maxExtentParameter) {
      var maxExtent = {
         x: {},
         y: {}
      };

      // checks if the param is null or empty
      if (M.utils.isNullOrEmpty(maxExtentParameter)) {
         M.exception('No ha especificado ningún parámetro maxExtent');
      }

      // string
      if (M.utils.isString(maxExtentParameter)) {
         if (/^\s*-?\d+(\.\d+)?\s*[\,\;]\s*-?\d+(\.\d+)?\s*[\,\;]\s*-?\d+(\.\d+)?\s*[\,\;]\s*-?\d+(\.\d+)?$/.test(maxExtentParameter)) {
            var extentArray = maxExtentParameter.split(/[\,\;]+/);
            if (extentArray.length === 4) {
               maxExtent.x.min = Number.parseFloat(extentArray[0]);
               maxExtent.y.min = Number.parseFloat(extentArray[1]);
               maxExtent.x.max = Number.parseFloat(extentArray[2]);
               maxExtent.y.max = Number.parseFloat(extentArray[3]);
            }
            else {
               M.exception('El formato del parámetro maxExtent no es correcto');
            }
         }
         else {
            M.exception('El formato del parámetro maxExtent no es correcto');
         }
      }
      // array
      else if (M.utils.isArray(maxExtentParameter)) {
         if (maxExtentParameter.length === 4) {
            if (M.utils.isString(maxExtentParameter[0])) {
               maxExtentParameter[0] = Number.parseFloat(maxExtentParameter[0]);
            }
            if (M.utils.isString(maxExtentParameter[1])) {
               maxExtentParameter[1] = Number.parseFloat(maxExtentParameter[1]);
            }
            if (M.utils.isString(maxExtentParameter[2])) {
               maxExtentParameter[2] = Number.parseFloat(maxExtentParameter[2]);
            }
            if (M.utils.isString(maxExtentParameter[3])) {
               maxExtentParameter[3] = Number.parseFloat(maxExtentParameter[3]);
            }
            maxExtent.x.min = maxExtentParameter[0];
            maxExtent.y.min = maxExtentParameter[1];
            maxExtent.x.max = maxExtentParameter[2];
            maxExtent.y.max = maxExtentParameter[3];
         }
         else {
            M.exception('El formato del parámetro maxExtent no es correcto');
         }
      }
      // object
      else if (M.utils.isObject(maxExtentParameter)) {
         // x min
         if (!M.utils.isNull(maxExtentParameter.left)) {
            if (M.utils.isString(maxExtentParameter.left)) {
               maxExtentParameter.left = Number.parseFloat(maxExtentParameter.left);
            }
            maxExtent.x.min = maxExtentParameter.left;
         }
         else if (!M.utils.isNull(maxExtentParameter.x.min)) {
            if (M.utils.isString(maxExtentParameter.x.min)) {
               maxExtentParameter.x.min = Number.parseFloat(maxExtentParameter.x.min);
            }
            maxExtent.x.min = maxExtentParameter.x.min;
         }
         else {
            M.exception('El formato del parámetro maxExtent no es correcto');
         }
         // y min
         if (!M.utils.isNull(maxExtentParameter.bottom)) {
            if (M.utils.isString(maxExtentParameter.bottom)) {
               maxExtentParameter.bottom = Number.parseFloat(maxExtentParameter.bottom);
            }
            maxExtent.y.min = maxExtentParameter.bottom;
         }
         else if (!M.utils.isNull(maxExtentParameter.y.min)) {
            if (M.utils.isString(maxExtentParameter.y.min)) {
               maxExtentParameter.y.min = Number.parseFloat(maxExtentParameter.y.min);
            }
            maxExtent.y.min = maxExtentParameter.y.min;
         }
         else {
            M.exception('El formato del parámetro maxExtent no es correcto');
         }
         // x max
         if (!M.utils.isNull(maxExtentParameter.right)) {
            if (M.utils.isString(maxExtentParameter.right)) {
               maxExtentParameter.right = Number.parseFloat(maxExtentParameter.right);
            }
            maxExtent.x.max = maxExtentParameter.right;
         }
         else if (!M.utils.isNull(maxExtentParameter.x.max)) {
            if (M.utils.isString(maxExtentParameter.x.max)) {
               maxExtentParameter.x.max = Number.parseFloat(maxExtentParameter.x.max);
            }
            maxExtent.x.max = maxExtentParameter.x.max;
         }
         else {
            M.exception('El formato del parámetro maxExtent no es correcto');
         }
         // y max
         if (!M.utils.isNull(maxExtentParameter.top)) {
            if (M.utils.isString(maxExtentParameter.top)) {
               maxExtentParameter.top = Number.parseFloat(maxExtentParameter.top);
            }
            maxExtent.y.max = maxExtentParameter.top;
         }
         else if (!M.utils.isNull(maxExtentParameter.y.max)) {
            if (M.utils.isString(maxExtentParameter.y.max)) {
               maxExtentParameter.y.max = Number.parseFloat(maxExtentParameter.y.max);
            }
            maxExtent.y.max = maxExtentParameter.y.max;
         }
         else {
            M.exception('El formato del parámetro maxExtent no es correcto');
         }
      }
      // unknown
      else {
         M.exception('El parámetro no es de un tipo soportado: ' + (typeof maxExtentParameter));
      }

      if (Number.isNaN(maxExtent.x.min) || Number.isNaN(maxExtent.y.min) || Number.isNaN(maxExtent.x.max) || Number.isNaN(maxExtent.y.max)) {
         M.exception('El formato del parámetro maxExtent no es correcto');
      }

      return maxExtent;
   };
})();