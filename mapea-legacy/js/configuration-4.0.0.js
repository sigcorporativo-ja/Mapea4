/**
 * Mapea API
 * Version 4.0.0-SNAPSHOT
 * Date 17-12-2015
 */
(function (M) {
   /**
    * The Mapea URL
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.config('MAPEA_URL', 'http://mapea4-sigc.juntadeandalucia.es/mapea');

   /**
    * The path to the Mapea proxy to send
    * jsonp requests
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.config('PROXY_PATH', '/api/proxy');

   /**
    * The path to the Mapea proxy to send
    * jsonp requests
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.config('PROXY_POST_PATH', '/proxyPost');

   /**
    * The path to the Mapea templates
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.config('TEMPLATES_PATH', '/files/templates/');

   /**
    * The Geosearch URL
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.config('GEOSEARCH_URL', 'http://geobusquedas-sigc.juntadeandalucia.es');

   /**
    * The Geosearch core
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.config('GEOSEARCH_CORE', 'sigc');

   /**
    * The Geosearch handler
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.config('GEOSEARCH_HANDLER', '/search?');

   /**
    * The Geosearch distance
    * @const
    * @type {int}
    * @public
    * @api stable
    */
   M.config('GEOSEARCH_DISTANCE', '600');

   /**
    * The Geosearchbylocation spatial field
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.config('GEOSEARCH_SPATIAL_FIELD', 'geom');

   /**
    * The Geosearch rows
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.config('GEOSEARCH_ROWS', '100');

   /**
    * Predefined WMC files. It is composed of URL,
    * predefined name and context name.
    * @type {object}
    * @public
    * @api stable
    */
   M.config('predefinedWMC', {
      /**
       * Predefined WMC URLs
       * @const
       * @type {Array<string>}
       * @public
       * @api stable
       */
      'urls': (function (stringValue) {
         return stringValue.split(',');
      })('http://mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/context_cdau_callejero.xml,http://mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/context_cdau_hibrido.xml,http://mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/context_cdau_satelite.xml,http://mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/contextCallejeroCache.xml,http://mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/contextCallejero.xml,http://mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/contextIDEA.xml,http://mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/contextOrtofoto2009.xml,http://mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/callejero2011cache.xml,http://mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/ortofoto2011cache.xml,http://mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/hibrido2011cache.xml,http://mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/contextOrtofoto.xml'),

      /**
       * WMC predefined names
       * @const
       * @type {Array<string>}
       * @public
       * @api stable
       */
      'predefinedNames': (function (stringValue) {
         return stringValue.split(',');
      })('cdau,cdau_hibrido,cdau_satelite,callejerocacheado,callejero,idea,ortofoto09,callejero2011cache,ortofoto2011cache,hibrido2011cache,ortofoto'),

      /**
       * WMC context names
       * @const
       * @type {Array<string>}
       * @public
       * @api stable
       */
      'names': (function (stringValue) {
         return stringValue.split(',');
      })('Callejero,Hibrido,Satelite,mapa callejero cache,mapa del callejero,mapa idea,mapa ortofoto09,Callejero,Ortofoto,Hibrido,mapa ortofoto')
   });


   /**
    * Default projection
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.config('DEFAULT_PROJ', 'EPSG:23030*m');
})(window.M);
