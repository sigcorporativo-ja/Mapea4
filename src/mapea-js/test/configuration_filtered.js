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
  //   M_.config('MAPEA_URL', 'http://192.168.60.2:8080/mapea');
  M_.config('MAPEA_URL', 'http://sigc.desarrollo.guadaltel.es/mapea5');
  /**
   * The path to the Mapea proxy to send
   * jsonp requests
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M_.config('PROXY_URL', 'http://sigc.desarrollo.guadaltel.es/mapea5/api/proxy');
  /**
   * The path to the Mapea proxy to send
   * jsonp requests
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M_.config('PROXY_POST_URL', 'http://sigc.desarrollo.guadaltel.es/mapea5/proxyPost');
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
  //   M_.config('THEME_URL', 'http://192.168.60.2:8080/mapea/assets/');
  M_.config('THEME_URL', 'http://sigc.desarrollo.guadaltel.es/mapea5/assets/');
  /**
   * The Geosearch URL
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M_.config('GEOSEARCH_URL', 'http://geobusquedas-sigc.juntadeandalucia.es');
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
  M_.config('GEOSEARCH_DISTANCE', 600);
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
  M_.config('GEOSEARCH_ROWS', 20);
  /**
   * The Geosearch rows
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M_.config('GEOSEARCHBYLOCATION_ROWS', 100);
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
    urls: (function(stringValue) {
      return stringValue.split(',');
    })('http://sigc.desarrollo.guadaltel.es/mapea5/files/wmc/context_cdau_callejero.xml,http://sigc.desarrollo.guadaltel.es/mapea5/files/wmc/context_cdau_hibrido.xml,http://sigc.desarrollo.guadaltel.es/mapea5/files/wmc/context_cdau_satelite.xml,http://sigc.desarrollo.guadaltel.es/mapea5/files/wmc/contextCallejeroCache.xml,http://sigc.desarrollo.guadaltel.es/mapea5/files/wmc/contextCallejero.xml,http://sigc.desarrollo.guadaltel.es/mapea5/files/wmc/contextIDEA.xml,http://sigc.desarrollo.guadaltel.es/mapea5/files/wmc/contextOrtofoto2009.xml,http://sigc.desarrollo.guadaltel.es/mapea5/files/wmc/callejero2011cache.xml,http://sigc.desarrollo.guadaltel.es/mapea5/files/wmc/ortofoto2011cache.xml,http://sigc.desarrollo.guadaltel.es/mapea5/files/wmc/hibrido2011cache.xml,http://sigc.desarrollo.guadaltel.es/mapea5/files/wmc/contextOrtofoto.xml'),
    /**
     * WMC predefined names
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    predefinedNames: (function(stringValue) {
      return stringValue.split(',');
    })('callejerocacheado,callejero,ortofoto,idea,ortofoto09,callejero2011cache,ortofoto2011cache,hibrido2011cache'),
    /**
     * WMC context names
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    names: (function(stringValue) {
      return stringValue.split(',');
    })('mapa callejero cache,mapa del callejero,mapa ortofoto,mapa idea,mapa ortofoto09,Callejero,Ortofoto,Híbrido')
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
    tiledNames: 'base,SPOT_Andalucia,orto_2010-11_25830,CallejeroCompleto,orto_2010-11_28080'.split(','),
    /**
     * WMC predefined names
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    tiledUrls: 'http://www.callejerodeandalucia.es/servicios/base/gwc/service/wms?,http://www.callejerodeandalucia.es/servicios/base/gwc/service/wms?,http://www.ideandalucia.es/geowebcache/service/wms?,http://www.juntadeandalucia.es/servicios/mapas/callejero/wms-tiled?,http://www.ideandalucia.es/geowebcache/service/wms?'.split(','),
    /**
     * WMC context names
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    names: 'CDAU_base,mosaico_spot_2005,orto_2010-11,CallejeroCompleto,orto_2010-11'.split(','),
    /**
     * WMC context names
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    urls: 'http://www.callejerodeandalucia.es/servicios/base/wms?,http://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_SPOT_Andalucia_2005?,http://www.ideandalucia.es/wms/ortofoto2010?,http://www.juntadeandalucia.es/servicios/mapas/callejero/wms?,http://www.ideandalucia.es/wms/ortofoto2010?'.split(',')
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
   * Predefined WMC files. It is composed of URL,
   * predefined name and context name.
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
    URL: 'http://geoprint-sigc.juntadeandalucia.es/geoprint/pdf',
    /**
     * WMC predefined names
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    DPI: 150,
    /**
     * WMC context names
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    FORMAT: 'png',
    /**
     * WMC context names
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    TEMPLATE: 'A4 horizontal (Leyenda en una hoja)',
    /**
     * WMC context names
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    FORCE_SCALE: false,
    /**
     * TODO
     * @const
     * @type {boolean}
     * @public
     * @api stable
     */
    LEGEND: true
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
    TOOLS: 'history,measurebar,measurelength,measureclear,measurearea,getfeatureinfo'.split(','),
    /**
     * TODO
     * @const
     * @type {Array<string>}
     * @public
     * @api stable
     */
    EDITION: 'drawfeature,modifyfeature,deletefeature,editattribute,savefeature,clearfeature'.split(',')
  });
  /**
   * Searchstreet service URL
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M_.config('SEARCHSTREET_URL', 'http://ws079.juntadeandalucia.es/EXT_PUB_CallejeroREST/geocoderMunProvSrs');
  /**
   * Autocomplete municipality service URL
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M_.config('SEARCHSTREET_URLCODINEAUTOCOMPLETE', 'http://ws079.juntadeandalucia.es/EXT_PUB_CallejeroREST/autocompletarDireccionMunicipio');
  /**
   * service URL check code INE
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M_.config('SEARCHSTREET_URLCOMPROBARINE', 'http://ws079.juntadeandalucia.es/EXT_PUB_CallejeroREST/comprobarCodIne');
  /**
   * Normalizar searchstreet service URL
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M_.config('SEARCHSTREET_NORMALIZAR', 'http://ws079.juntadeandalucia.es/EXT_PUB_CallejeroREST/normalizar');
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
   * Number of results to show
   *
   * @private
   * @type {String}
   */
  M_.config('MAPBOX_URL', 'https://api.mapbox.com/v4/');
  /**
   * Number of results to show
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
  M_.config('ATTRIBUTETABLE_PAGES', 5);
}

fun(window.M);
