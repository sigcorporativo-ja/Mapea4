/**
 * Mapea API
 * Version ${pom.version}
 * Date ${build.timestamp}
 */
(function (M) {
   /**
    * The Mapea URL
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.config('MAPEA_URL', '${mapea.url}');

   /**
    * The path to the Mapea proxy to send
    * jsonp requests
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.config('PROXY_PATH', '${mapea.proxy.path}');

   /**
    * The path to the Mapea proxy to send
    * jsonp requests
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.config('PROXY_POST_PATH', '${mapea.proxy_post.path}');

   /**
    * The path to the Mapea templates
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.config('TEMPLATES_PATH', '${mapea.templates.path}');

   /**
    * The Geosearch URL
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.config('GEOSEARCH_URL', '${geosearch.url}');

   /**
    * The Geosearch core
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.config('GEOSEARCH_CORE', '${geosearch.core}');

   /**
    * The Geosearch handler
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.config('GEOSEARCH_HANDLER', '${geosearch.handler}');

   /**
    * The Geosearch distance
    * @const
    * @type {int}
    * @public
    * @api stable
    */
   M.config('GEOSEARCH_DISTANCE', '${geosearch.distance}');

   /**
    * The Geosearchbylocation spatial field
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.config('GEOSEARCH_SPATIAL_FIELD', '${geosearch.spatialField}');

   /**
    * The Geosearch rows
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.config('GEOSEARCH_ROWS', '${geosearch.rows}');

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
      })('${wmc.urls}'),

      /**
       * WMC predefined names
       * @const
       * @type {Array<string>}
       * @public
       * @api stable
       */
      'predefinedNames': (function (stringValue) {
         return stringValue.split(',');
      })('${wmc.predefinedNames}'),

      /**
       * WMC context names
       * @const
       * @type {Array<string>}
       * @public
       * @api stable
       */
      'names': (function (stringValue) {
         return stringValue.split(',');
      })('${wmc.names}')
   });


   /**
    * Default projection
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.config('DEFAULT_PROJ', '${mapea.proj.default}');
})(window.M);