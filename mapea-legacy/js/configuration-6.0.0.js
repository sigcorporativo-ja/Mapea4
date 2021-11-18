/**
 * Mapea API
 * Version 6.0.0
 * Date 22-03-2021
 */
(function(M) {
  /**
   * Pixels width for mobile devices
   *
   * @private
   * @type {Number}
   */
  M.config('MOBILE_WIDTH', 768);

  /**
   * The Mapea URL
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('MAPEA_URL', location.protocol + '//mapea4-sigc.juntadeandalucia.es/mapea');

  /**
   * The path to the Mapea proxy to send
   * jsonp requests
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('PROXY_URL', location.protocol + '//mapea4-sigc.juntadeandalucia.es/mapea/api/proxy');

  /**
   * The path to the Mapea proxy to send
   * jsonp requests
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('PROXY_POST_URL', location.protocol + '//mapea4-sigc.juntadeandalucia.es/mapea/proxyPost');

  /**
   * The path to the Mapea templates
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('TEMPLATES_PATH', '/files/templates/');

  /**
   * The path to the Mapea theme
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('THEME_URL', location.protocol + '//mapea4-sigc.juntadeandalucia.es/mapea/assets/');

  /**
   * The Geosearch URL
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('GEOSEARCH_URL', location.protocol + '//geobusquedas-sigc.juntadeandalucia.es');

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
  M.config('GEOSEARCH_ROWS', '20');

  /**
   * The Geosearch rows
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('GEOSEARCHBYLOCATION_ROWS', '100');

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
    'urls': '//mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/mapa.xml,//mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/hibrido.xml,//mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/satelite.xml,//mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/context_cdau_callejero.xml,//mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/context_cdau_hibrido.xml,//mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/context_cdau_satelite.xml,//mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/contextCallejeroCache.xml,//mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/contextCallejero.xml,//mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/contextIDEA.xml,//mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/contextOrtofoto2009.xml,//mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/callejero2011cache.xml,//mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/ortofoto2011cache.xml,//mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/hibrido2011cache.xml,//mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/contextOrtofoto.xml'.split(',').map(e => location.protocol + e),

    /**
     * WMC predefined names
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    'predefinedNames': 'mapa,hibrido,satelite,cdau,cdau_hibrido,cdau_satelite,callejerocacheado,callejero,idea,ortofoto09,callejero2011cache,ortofoto2011cache,hibrido2011cache,ortofoto'.split(','),

    /**
     * WMC context names
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    'names': 'Mapa,Hibrido,Satelite,Callejero,Hibrido,Satelite,mapa callejero cache,mapa del callejero,mapa idea,mapa ortofoto09,Callejero,Ortofoto,HÃ­brido,mapa ortofoto'.split(',')
  });

  /**
   * TODO
   * @type {object}
   * @public
   * @api stable
   */
  M.config('tileMappgins', {
    /**
     * Predefined WMC URLs
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    'tiledNames': 'base,SPOT_Andalucia,orto_2010-11_25830,CallejeroCompleto,orto_2010-11_23030'.split(','),

    /**
     * WMC predefined names
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    'tiledUrls': '//www.callejerodeandalucia.es/servicios/base/gwc/service/wms?,//www.callejerodeandalucia.es/servicios/base/gwc/service/wms?,//www.ideandalucia.es/geowebcache/service/wms?,//www.juntadeandalucia.es/servicios/mapas/callejero/wms-tiled?,//www.ideandalucia.es/geowebcache/service/wms?'.split(',').map(e => location.protocol + e),

    /**
     * WMC context names
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    'names': 'CDAU_base,mosaico_spot_2005,orto_2010-11,CallejeroCompleto,orto_2010-11'.split(','),

    /**
     * WMC context names
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    'urls': '//www.callejerodeandalucia.es/servicios/base/wms?,//www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_SPOT_Andalucia_2005?,//www.ideandalucia.es/wms/ortofoto2010?,//www.juntadeandalucia.es/servicios/mapas/callejero/wms?,//www.ideandalucia.es/wms/ortofoto2010?'.split(',').map(e => location.protocol + e)
  });

  /**
   * Default projection
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('DEFAULT_PROJ', 'EPSG:25830*m');

  /**
   * Predefined WMC files. It is composed of URL,
   * predefined name and context name.
   * @type {object}
   * @public
   * @api stable
   */
  M.config('geoprint', {
    /**
     * Printer service URL
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    'URL': location.protocol + '//geoprint-sigc.juntadeandalucia.es/geoprint/pdf',

    /**
     * WMC predefined names
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    'DPI': 120,

    /**
     * WMC context names
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    'FORMAT': 'pdf',

    /**
     * WMC context names
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    'TEMPLATE': 'A4 landscape (SIGC)',

    /**
     * WMC context names
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    'FORCE_SCALE': false,

    /**
     * TODO
     * @const
     * @type {boolean}
     * @public
     * @api stable
     */
    'LEGEND': true
  });

  /**
   * Geoprint configuration.
   * @type {object}
   * @public
   * @api stable
   */
  M.config('geoprint2', {
    /**
     * Printer service URL
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    'URL': location.protocol + '//geoprint-sigc.juntadeandalucia.es/geoprint3/print/SIGC',

    /**
     * Printer service URL
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    'URL_APPLICATION': location.protocol  + '//geoprint-sigc.juntadeandalucia.es/geoprint3',
  });

  /**
   * Predefined WMC files. It is composed of URL,
   * predefined name and context name.
   * @type {object}
   * @public
   * @api stable
   */
  M.config('panels', {
    /**
     * TODO
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    'TOOLS': 'measurebar,measurelength,measureclear,measurearea,getfeatureinfo'.split(','),

    /**
     * TODO
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    'EDITION': 'drawfeature,modifyfeature,deletefeature,editattribute,savefeature,clearfeature'.split(',')
  });

  /**
   * Searchstreet service URL
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('SEARCHSTREET_URL', location.protocol + '//ws248.juntadeandalucia.es/EXT_PUB_CallejeroREST/geocoderMunProvSrs');

  /**
   * Autocomplete municipality service URL
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('SEARCHSTREET_URLCODINEAUTOCOMPLETE', location.protocol + '//ws248.juntadeandalucia.es/EXT_PUB_CallejeroREST/autocompletarDireccionMunicipio');

  /**
   * service URL check code INE
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('SEARCHSTREET_URLCOMPROBARINE', location.protocol + '//ws248.juntadeandalucia.es/EXT_PUB_CallejeroREST/comprobarCodIne');

  /**
   * Normalizar searchstreet service URL
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.config('SEARCHSTREET_NORMALIZAR', location.protocol + '//ws248.juntadeandalucia.es/EXT_PUB_CallejeroREST/normalizar');

  /**
   * Minimum number of characters to start autocomplete
   * @const
   * @type {number}
   * @public
   * @api stable
   */
  M.config('AUTOCOMPLETE_MINLENGTH', '3');

  /**
   * TODO
   *
   * @private
   * @type {Number}
   */
  M.config('AUTOCOMPLETE_DELAYTIME', '750');

  /**
   * Number of results to show
   *
   * @private
   * @type {Number}
   */
  M.config('AUTOCOMPLETE_LIMIT', '10');

  /**
   * TODO
   *
   * @private
   * @type {String}
   */
  M.config('MAPBOX_URL', 'https://api.mapbox.com/v4/');

  /**
   * TODO
   *
   * @private
   * @type {String}
   */
  M.config('MAPBOX_EXTENSION', 'png');

  /**
   * TODO
   *
   * @private
   * @type {String}
   */
  M.config('MAPBOX_TOKEN_NAME', 'access_token');

  /**
   * TODO
   *
   * @private
   * @type {String}
   */
  M.config('MAPBOX_TOKEN_VALUE', 'pk.eyJ1Ijoic2lnY29ycG9yYXRpdm9qYSIsImEiOiJjaXczZ3hlc2YwMDBrMm9wYnRqd3gyMWQ0In0.wF12VawgDM31l5RcAGb6AA');

  /**
   * Number of pages for the plugin AttributeTable
   *
   * @private
   * @type {String}
   */
  M.config('ATTRIBUTETABLE_PAGES', '5');
})(window.M);
