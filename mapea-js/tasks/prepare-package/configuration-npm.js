const configuration = {
  MOBILE_WIDTH: 768,
  MAPEA_URL: 'https://sigc.desarrollo.guadaltel.es/mapea6',
  PROXY_URL: 'https://sigc.desarrollo.guadaltel.es/mapea6/api/proxy',
  PROXY_POST_URL: 'https://sigc.desarrollo.guadaltel.es/mapea6/proxyPost',
  TEMPLATES_PATH: '/files/templates/',
  THEME_URL: 'https://sigc.desarrollo.guadaltel.es/mapea6/assets/',
  GEOSEARCH_URL: 'https://geobusquedas-sigc.juntadeandalucia.es',
  GEOSEARCH_CORE: 'sigc',
  GEOSEARCH_HANDLER: '/search?',
  GEOSEARCH_DISTANCE: '600',
  GEOSEARCH_SPATIAL_FIELD: 'geom',
  GEOSEARCH_ROWS: '20',
  GEOSEARCHBYLOCATION_ROWS: '100',
  predefinedWMC: {
    'urls': 'https://sigc.desarrollo.guadaltel.es/mapea6/files/wmc/mapa.xml,https://sigc.desarrollo.guadaltel.es/mapea6/files/wmc/hibrido.xml,https://sigc.desarrollo.guadaltel.es/mapea6/files/wmc/satelite.xml,https://sigc.desarrollo.guadaltel.es/mapea6/files/wmc/context_cdau_callejero.xml,https://sigc.desarrollo.guadaltel.es/mapea6/files/wmc/context_cdau_hibrido.xml,https://sigc.desarrollo.guadaltel.es/mapea6/files/wmc/context_cdau_satelite.xml,https://sigc.desarrollo.guadaltel.es/mapea6/files/wmc/contextCallejeroCache.xml,https://sigc.desarrollo.guadaltel.es/mapea6/files/wmc/contextCallejero.xml,https://sigc.desarrollo.guadaltel.es/mapea6/files/wmc/callejero2011cache.xml,https://sigc.desarrollo.guadaltel.es/mapea6/files/wmc/ortofoto2011cache.xml,https://sigc.desarrollo.guadaltel.es/mapea6/files/wmc/hibrido2011cache.xml,https://sigc.desarrollo.guadaltel.es/mapea6/files/wmc/contextOrtofoto.xml'.split(',').map(e => e),
    'predefinedNames': 'mapa,hibrido,satelite,cdau,cdau_hibrido,cdau_satelite,callejerocacheado,callejero,callejero2011cache,ortofoto2011cache,hibrido2011cache,ortofoto'.split(','),
    'names': 'Mapa,Hibrido,Satelite,Callejero,Hibrido,Satelite,mapa callejero cache,mapa del callejero,Callejero,Ortofoto,H??brido,mapa ortofoto'.split(','),
  },
  tileMappgins: {
    tiledNames: 'base,SPOT_Andalucia,orto_2010-11_25830,CallejeroCompleto,orto_2010-11_23030'.split(','),
    tiledUrls: 'https://www.callejerodeandalucia.es/servicios/base/gwc/service/wms?,https://www.callejerodeandalucia.es/servicios/base/gwc/service/wms?,https://www.ideandalucia.es/geowebcache/service/wms?,https://www.juntadeandalucia.es/servicios/mapas/callejero/wms-tiled?,https://www.ideandalucia.es/geowebcache/service/wms?'.split(',').map(e => e),
    names: 'CDAU_base,mosaico_spot_2005,orto_2010-11,CallejeroCompleto,orto_2010-11'.split(','),
    urls: 'https://www.callejerodeandalucia.es/servicios/base/wms?,https://www.juntadeandalucia.es/medioambiente/mapwms/REDIAM_SPOT_Andalucia_2005?,https://www.ideandalucia.es/wms/ortofoto2010?,https://www.juntadeandalucia.es/servicios/mapas/callejero/wms?,https://www.ideandalucia.es/wms/ortofoto2010?'.split(',').map(e => e),
  },
  DEFAULT_PROJ: 'EPSG:25830*m',
  geoprint: {
    URL: 'https://geoprint-sigc.juntadeandalucia.es/geoprint/pdf',
    DPI: 120,
    FORMAT: 'pdf',
    TEMPLATE: 'A4 landscape (SIGC,',
    FORCE_SCALE: false,
    LEGEND: true
  },
  geoprint2: {
    URL: 'https://geoprint.desarrollo.guadaltel.es/print/SIGC',
    URL_APPLICATION: 'https://geoprint.desarrollo.guadaltel.es',
  },
  panels: {
    TOOLS: 'measurebar,measurelength,measureclear,measurearea,getfeatureinfo'.split(','),
    EDITION: 'drawfeature,modifyfeature,deletefeature,editattribute,savefeature,clearfeature'.split(','),
  },
  SEARCHSTREET_URL: 'https://ws248.juntadeandalucia.es/EXT_PUB_CallejeroREST/geocoderMunProvSrs',
  SEARCHSTREET_URLCODINEAUTOCOMPLETE: 'https://ws248.juntadeandalucia.es/EXT_PUB_CallejeroREST/autocompletarDireccionMunicipio',
  SEARCHSTREET_URLCOMPROBARINE: 'https://ws248.juntadeandalucia.es/EXT_PUB_CallejeroREST/comprobarCodIne',
  SEARCHSTREET_NORMALIZAR: 'https://ws248.juntadeandalucia.es/EXT_PUB_CallejeroREST/normalizar',
  AUTOCOMPLETE_MINLENGTH: '3',
  AUTOCOMPLETE_DELAYTIME: '750',
  AUTOCOMPLETE_LIMIT: '10',
  MAPBOX_URL: 'https://api.mapbox.com/v4/',
  MAPBOX_EXTENSION: 'png',
  MAPBOX_TOKEN_NAME: 'access_token',
  MAPBOX_TOKEN_VALUE: 'pk.eyJ1IjoiZ3VhZGFsdGVsc2lnYyIsImEiOiJjaXppOTE0M2wwMDNiMzNvM3JiZ2h4Zmt3In0.MHjbdKBozmgW0T8LhGDcAA',
  ATTRIBUTETABLE_PAGES: '5',
  SQL_WASM_URL: 'https://sigc.desarrollo.guadaltel.es/mapea6/wasm/',
}

export default configuration;
