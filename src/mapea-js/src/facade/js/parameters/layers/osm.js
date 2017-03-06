goog.provide('M.parameter.osm');

goog.require('M.utils');
goog.require('M.exception');

(function () {
   'use strict';

   /**
    * Parses the specified user layer KML parameters to a object
    *
    * @param {string|Mx.parameters.Layer} userParameters parameters
    * provided by the user
    * @returns {Mx.parameters.KML|Array<Mx.parameters.KML>}
    * @public
    * @function
    * @api stable
    */
   M.parameter.osm = function (userParameters) {
      var layers = [{
         'type': M.layer.type.OSM,
         'name': 'osm'
      }];

      if (!M.utils.isArray(userParameters)) {
         layers = layers[0];
      }

      return layers;
   };
})();