goog.provide('M.layer.type');

goog.require('M.layer');

(function () {
   'use strict';

   /**
    * WMC type
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.layer.type.WMC = 'WMC';

   /**
    * KML type
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.layer.type.KML = 'KML';

   /**
    * WMS type
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.layer.type.WMS = 'WMS';

   /**
    * WFS type
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.layer.type.WFS = 'WFS';

   /**
    * WMTS type
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.layer.type.WMTS = 'WMTS';

   /**
    * MBtiles type
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.layer.type.MBtiles = 'MBtiles';

   /**
    * MBtiles type
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.layer.type.OSM = 'OSM';

   /**
    * Parses the type
    * @private
    * @function
    * @param {string} rawType the type to be parsed
    */
   M.layer.type.parse = function (rawType) {
      var type = M.utils.normalize(rawType, true);
      if (type === 'WMS_FULL') {
         type = M.layer.type.WMS;
      }
      if (type === 'WFST') {
         type = M.layer.type.WFS;
      }
      return M.layer.type[type];
   };
})();