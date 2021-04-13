const config = (configKey, configValue) => {
  config[configKey] = configValue;
};

if (!window.M) {
  const M = {};
  window.M = M;
}
M.config = config;

function fun(M_) {
  /**
   * Pixels width for mobile devices
   *
   * @private
   * @type {Number}
   */
  M_.config('MOBILE_WIDTH', 768);

  /**
   * The Mapea URL
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M_.config('MAPEA_URL', location.protocol + '//sigc.desarrollo.guadaltel.es/mapea6');

  /**
   * The path to the Mapea proxy to send
   * jsonp requests
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M_.config('PROXY_URL', location.protocol + '//sigc.desarrollo.guadaltel.es/mapea6/api/proxy');

  /**
   * The path to the Mapea proxy to send
   * jsonp requests
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M_.config('PROXY_POST_URL', location.protocol + '//sigc.desarrollo.guadaltel.es/mapea6/proxyPost');

  /**
   * The path to the Mapea templates
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M_.config('TEMPLATES_PATH', '/files/templates/');

  /**
   * The path to the Mapea theme
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M_.config('THEME_URL', location.protocol + '//mapea4-sigc.juntadeandalucia.es/mapea/assets/');

  /**
   * The Geosearch URL
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M_.config('GEOSEARCH_URL', location.protocol + '//geobusquedas-sigc.juntadeandalucia.es');

  /**
   * The Geosearch core
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M_.config('GEOSEARCH_CORE', 'sigc');

  /**
   * The Geosearch handler
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M_.config('GEOSEARCH_HANDLER', '/search?');

  /**
   * The Geosearch distance
   * @const
   * @type {int}
   * @public
   * @api stable
   */
  M_.config('GEOSEARCH_DISTANCE', '600');

  /**
   * The Geosearchbylocation spatial field
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M_.config('GEOSEARCH_SPATIAL_FIELD', 'geom');

  /**
   * The Geosearch rows
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M_.config('GEOSEARCH_ROWS', '20');

  /**
   * The Geosearch rows
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M_.config('GEOSEARCHBYLOCATION_ROWS', '100');

  /**
   * Predefined WMC files. It is composed of URL,
   * predefined name and context name.
   * @type {object}
   * @public
   * @api stable
   */
  M_.config('predefinedWMC', {
    /**
     * Predefined WMC URLs
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    'urls': '//mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/context_cdau_callejero.xml,//mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/context_cdau_hibrido.xml,//mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/context_cdau_satelite.xml,//mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/contextCallejeroCache.xml,//mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/contextCallejero.xml,//mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/contextIDEA.xml,//mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/contextOrtofoto2009.xml,//mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/callejero2011cache.xml,//mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/ortofoto2011cache.xml,//mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/hibrido2011cache.xml,//mapea4-sigc.juntadeandalucia.es/mapea/files/wmc/contextOrtofoto.xml'.split(',').map(e => location.protocol + e),

    /**
     * WMC predefined names
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    'predefinedNames': 'cdau,cdau_hibrido,cdau_satelite,callejerocacheado,callejero,idea,ortofoto09,callejero2011cache,ortofoto2011cache,hibrido2011cache,ortofoto'.split(','),

    /**
     * WMC context names
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    'names': 'Callejero,Hibrido,Satelite,mapa callejero cache,mapa del callejero,mapa idea,mapa ortofoto09,Callejero,Ortofoto,HÃ­brido,mapa ortofoto'.split(',')
  });

  /**
   * TODO
   * @type {object}
   * @public
   * @api stable
   */
  M_.config('tileMappgins', {
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
  M_.config('DEFAULT_PROJ', 'EPSG:25830*m');

  /**
   * Geoprint configuration.
   * @type {object}
   * @public
   * @api stable
   */
  M_.config('geoprint', {
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
  M_.config('geoprint2', {
    /**
     * Printer service URL
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    'URL': location.protocol + '//geoprint.desarrollo.guadaltel.es/print/SIGC',

    /**
     * Printer service URL
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    'URL_APPLICATION': location.protocol + '//geoprint.desarrollo.guadaltel.es',
  });

  /**
   * Predefined WMC files. It is composed of URL,
   * predefined name and context name.
   * @type {object}
   * @public
   * @api stable
   */
  M_.config('panels', {
    /**
     * TODO
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    'TOOLS': 'measurebar,getfeatureinfo'.split(','),

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
  M_.config('SEARCHSTREET_URL', location.protocol + '//ws248.juntadeandalucia.es/EXT_PUB_CallejeroREST/geocoderMunProvSrs');

  /**
   * Autocomplete municipality service URL
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M_.config('SEARCHSTREET_URLCODINEAUTOCOMPLETE', location.protocol + '//ws248.juntadeandalucia.es/EXT_PUB_CallejeroREST/autocompletarDireccionMunicipio');

  /**
   * service URL check code INE
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M_.config('SEARCHSTREET_URLCOMPROBARINE', location.protocol + '//ws248.juntadeandalucia.es/EXT_PUB_CallejeroREST/comprobarCodIne');

  /**
   * Normalizar searchstreet service URL
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M_.config('SEARCHSTREET_NORMALIZAR', location.protocol + '//ws248.juntadeandalucia.es/EXT_PUB_CallejeroREST/normalizar');

  /**
   * Minimum number of characters to start autocomplete
   * @const
   * @type {number}
   * @public
   * @api stable
   */
  M_.config('AUTOCOMPLETE_MINLENGTH', '3');

  /**
   * TODO
   *
   * @private
   * @type {Number}
   */
  M_.config('AUTOCOMPLETE_DELAYTIME', '750');

  /**
   * Number of results to show
   *
   * @private
   * @type {Number}
   */
  M_.config('AUTOCOMPLETE_LIMIT', '10');

  /**
   * TODO
   *
   * @private
   * @type {String}
   */
  M_.config('MAPBOX_URL', 'https://api.mapbox.com/v4/');

  /**
   * TODO
   *
   * @private
   * @type {String}
   */
  M_.config('MAPBOX_EXTENSION', 'png');

  /**
   * TODO
   *
   * @private
   * @type {String}
   */
  M_.config('MAPBOX_TOKEN_NAME', 'access_token');

  /**
   * TODO
   *
   * @private
   * @type {String}
   */
  M_.config('MAPBOX_TOKEN_VALUE', 'pk.eyJ1Ijoic2lnY29ycG9yYXRpdm9qYSIsImEiOiJjaXczZ3hlc2YwMDBrMm9wYnRqd3gyMWQ0In0.wF12VawgDM31l5RcAGb6AA');

  /**
   * Number of pages for the plugin AttributeTable
   *
   * @private
   * @type {String}
   */
  M_.config('ATTRIBUTETABLE_PAGES', '5');

  /**
   * URL of sql wasm file
   * @private
   * @type {String}
   */
  M_.config('SQL_WASM_URL', '../../../../node_modules/sql.js/dist/');
}

fun(window.M);
