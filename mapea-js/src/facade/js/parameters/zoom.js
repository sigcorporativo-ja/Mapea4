goog.provide('M.parameter.zoom');

goog.require('M.utils');
goog.require('M.exception');

(function () {
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
   M.parameter.zoom = function (zoomParameter) {
      var zoom;

      // checks if the param is null or empty
      if (M.utils.isNullOrEmpty(zoomParameter)) {
         M.exception('No ha especificado ningún parámetro zoom');
      }

      // string
      if (M.utils.isString(zoomParameter)) {
         zoom = Number.parseInt(zoomParameter);
      }
      // number
      else if (typeof zoomParameter === 'number') {
         zoom = zoomParameter;
      }
      // unknown
      else {
         M.exception('El parámetro no es de un tipo soportado: ' + (typeof zoomParameter));
      }

      if (Number.isNaN(zoom)) {
         M.exception('El formato del parámetro zoom no es correcto');
      }
      return zoom;
   };
})();