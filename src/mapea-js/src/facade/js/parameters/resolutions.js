goog.provide('M.parameter.resolutions');

goog.require('M.utils');
goog.require('M.exception');

(function () {
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
   M.parameter.resolutions = function (resolutionsParameter) {
      var resolutions = [];

      // checks if the param is null or empty
      if (M.utils.isNullOrEmpty(resolutionsParameter)) {
         M.exception('No ha especificado ningún parámetro resolutions');
      }

      // string
      if (M.utils.isString(resolutionsParameter)) {
         if (/^\d+(\.\d+)?([\,\;]\d+(\.\d+)?)*$/.test(resolutionsParameter)) {
            resolutionsParameter = resolutionsParameter.split(/[\,\;]+/);
         }
         else {
            M.exception('El formato del parámetro resolutions no es correcto');
         }
      }
      // array
      if (M.utils.isArray(resolutionsParameter)) {
         resolutions = resolutionsParameter.map(function (resolution) {
            if (M.utils.isString(resolution)) {
               return Number.parseFloat(resolution);
            }
            else {
               return resolution;
            }
         });
      }
      // unknown
      else {
         M.exception('El parámetro no es de un tipo soportado: ' + (typeof resolutionsParameter));
      }

      var valid = true;
      for (var i = 0, len = resolutions.length; i < len && valid; i++) {
         valid = !Number.isNaN(resolutions[i]);
      }
      if (!valid) {
         M.exception('El formato del parámetro resolutions no es correcto');
      }
      return resolutions;
   };
})();