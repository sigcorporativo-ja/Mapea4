goog.provide('M');

goog.require('M.Map');
goog.require('M.template');
goog.require('M.utils');
goog.require('M.exception');

(function () {
   'use strict';

   /** 
    * 0.02540005080010160020 (A sensible default)
    * @const {Number}
    */
   M.METERS_PER_INCH = 0.02540005080010160020;

   /** 
    * 72 (A sensible default)
    * @const {Number}
    */
   M.DOTS_PER_INCH = 72;

   /**
    * Constant inches per unit -- borrowed from MapServer mapscale.c
    * derivation of nautical miles from http://en.wikipedia.org/wiki/Nautical_mile
    * Includes the full set of units supported by CS-MAP (http://trac.osgeo.org/csmap/)
    * and PROJ.4 (http://trac.osgeo.org/proj/)
    * The hardcoded table is maintain in a CS-MAP source code module named CSdataU.c
    * The hardcoded table of PROJ.4 units are in pj_units.c.
    * @const {Object}
    * @api stable
    */
   M.INCHES_PER_UNIT = {
      'inches': 1.0,
      'in': 1.0,
      'Inch': 1.0,
      'ft': 12.0,
      'mi': 63360.0,
      'm': 39.3701,
      'dd': 4374754,
      'yd': 36,
      'degrees': 4374754,
      'nmi': 1852 * 39.3701,
      'Meter': 1.0 / M.METERS_PER_INCH, //EPSG:9001
      'Foot': 0.30480060960121920243 / M.METERS_PER_INCH, //EPSG:9003
      'IFoot': 0.30480000000000000000 / M.METERS_PER_INCH, //EPSG:9002
      'ClarkeFoot': 0.3047972651151 / M.METERS_PER_INCH, //EPSG:9005
      'SearsFoot': 0.30479947153867624624 / M.METERS_PER_INCH, //EPSG:9041
      'GoldCoastFoot': 0.30479971018150881758 / M.METERS_PER_INCH, //EPSG:9094
      'IInch': 0.02540000000000000000 / M.METERS_PER_INCH,
      'MicroInch': 0.00002540000000000000 / M.METERS_PER_INCH,
      'Mil': 0.00000002540000000000 / M.METERS_PER_INCH,
      'Centimeter': 0.01000000000000000000 / M.METERS_PER_INCH,
      'Kilometer': 1000.00000000000000000000 / M.METERS_PER_INCH, //EPSG:9036
      'Yard': 0.91440182880365760731 / M.METERS_PER_INCH,
      'SearsYard': 0.914398414616029 / M.METERS_PER_INCH, //EPSG:9040
      'IndianYard': 0.91439853074444079983 / M.METERS_PER_INCH, //EPSG:9084
      'IndianYd37': 0.91439523 / M.METERS_PER_INCH, //EPSG:9085
      'IndianYd62': 0.9143988 / M.METERS_PER_INCH, //EPSG:9086
      'IndianYd75': 0.9143985 / M.METERS_PER_INCH, //EPSG:9087
      'IndianFoot': 0.30479951 / M.METERS_PER_INCH, //EPSG:9080
      'IndianFt37': 0.30479841 / M.METERS_PER_INCH, //EPSG:9081
      'IndianFt62': 0.3047996 / M.METERS_PER_INCH, //EPSG:9082
      'IndianFt75': 0.3047995 / M.METERS_PER_INCH, //EPSG:9083
      'Mile': 1609.34721869443738887477 / M.METERS_PER_INCH,
      'IYard': 0.91440000000000000000 / M.METERS_PER_INCH, //EPSG:9096
      'IMile': 1609.34400000000000000000 / M.METERS_PER_INCH, //EPSG:9093
      'NautM': 1852.00000000000000000000 / M.METERS_PER_INCH, //EPSG:9030
      'Lat-66': 110943.316488932731 / M.METERS_PER_INCH,
      'Lat-83': 110946.25736872234125 / M.METERS_PER_INCH,
      'Decimeter': 0.10000000000000000000 / M.METERS_PER_INCH,
      'Millimeter': 0.00100000000000000000 / M.METERS_PER_INCH,
      'Dekameter': 10.00000000000000000000 / M.METERS_PER_INCH,
      'Decameter': 10.00000000000000000000 / M.METERS_PER_INCH,
      'Hectometer': 100.00000000000000000000 / M.METERS_PER_INCH,
      'GermanMeter': 1.0000135965 / M.METERS_PER_INCH, //EPSG:9031
      'CaGrid': 0.999738 / M.METERS_PER_INCH,
      'ClarkeChain': 20.1166194976 / M.METERS_PER_INCH, //EPSG:9038
      'GunterChain': 20.11684023368047 / M.METERS_PER_INCH, //EPSG:9033
      'BenoitChain': 20.116782494375872 / M.METERS_PER_INCH, //EPSG:9062
      'SearsChain': 20.11676512155 / M.METERS_PER_INCH, //EPSG:9042
      'ClarkeLink': 0.201166194976 / M.METERS_PER_INCH, //EPSG:9039
      'GunterLink': 0.2011684023368047 / M.METERS_PER_INCH, //EPSG:9034
      'BenoitLink': 0.20116782494375872 / M.METERS_PER_INCH, //EPSG:9063
      'SearsLink': 0.2011676512155 / M.METERS_PER_INCH, //EPSG:9043
      'Rod': 5.02921005842012 / M.METERS_PER_INCH,
      'IntnlChain': 20.1168 / M.METERS_PER_INCH, //EPSG:9097
      'IntnlLink': 0.201168 / M.METERS_PER_INCH, //EPSG:9098
      'Perch': 5.02921005842012 / M.METERS_PER_INCH,
      'Pole': 5.02921005842012 / M.METERS_PER_INCH,
      'Furlong': 201.1684023368046 / M.METERS_PER_INCH,
      'Rood': 3.778266898 / M.METERS_PER_INCH,
      'CapeFoot': 0.3047972615 / M.METERS_PER_INCH,
      'Brealey': 375.00000000000000000000 / M.METERS_PER_INCH,
      'ModAmFt': 0.304812252984505969011938 / M.METERS_PER_INCH,
      'Fathom': 1.8288 / M.METERS_PER_INCH,
      'NautM-UK': 1853.184 / M.METERS_PER_INCH,
      '50kilometers': 50000.0 / M.METERS_PER_INCH,
      '150kilometers': 150000.0 / M.METERS_PER_INCH,
      'mm': (1.0 / M.METERS_PER_INCH) / 1000.0,
      'cm': (1.0 / M.METERS_PER_INCH) / 100.0,
      'dm': (1.0 / M.METERS_PER_INCH) * 100.0,
      'km': (1.0 / M.METERS_PER_INCH) * 1000.0,
      'kmi': 1852 * 39.3701, //International Nautical Mile
      'fath': 1.8288 / M.METERS_PER_INCH, //International Fathom
      'ch': 20.1168 / M.METERS_PER_INCH, //International Chain
      'link': 0.201168 / M.METERS_PER_INCH, //International Link
      'us-in': 1.0, //U.S. Surveyor's Inch
      'us-ft': 0.30480060960121920243 / M.METERS_PER_INCH, //U.S. Surveyor's Foot
      'us-yd': 0.91440182880365760731 / M.METERS_PER_INCH, //U.S. Surveyor's Yard
      'us-ch': 20.11684023368047 / M.METERS_PER_INCH, //U.S. Surveyor's Chain
      'us-mi': 1609.34721869443738887477 / M.METERS_PER_INCH, //U.S. Surveyor's Statute Mile
      'ind-yd': 0.91439523 / M.METERS_PER_INCH, //Indian Yard
      'ind-ft': 0.30479841 / M.METERS_PER_INCH, //Indian Foot
      'ind-ch': 20.11669506 / M.METERS_PER_INCH //Indian Chain
   };

   /**
    * Default messages language
    * @type {string}
    */
   M.lang_ = 'es';

   /**
    * Flag that indicates if the proxy is
    * enabled to use
    * @type {boolean}
    * @api stable
    */
   M.proxy = true;

   /**
    * This function sets the language used
    * to display messages
    *
    * @public
    * @function
    * @param {string} code of the language
    * following the standard ISO 639-1:2002
    * @see https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
    * @api stable
    */
   M.lang = function (langCode) {
      if (!M.utils.isNullOrEmpty(langCode)) {
         M.lang_ = langCode;
      }
      return this;
   };

   /**
    * Implementation of Mapea
    * @type {Object}
    * @api stable
    */
   M.impl = null;

   /**
    * This function sets the configuration variables
    *
    * @function
    * @param {String} configKey key of the configuration variable
    * @param {*} configValue value of the configuration variable
    * @api stable
    */
   M.config = function (configKey, configValue) {
      M.config[configKey] = configValue;
   };

   /**
    * This function creates a new map using the parameters
    * specified by the user
    *
    * @function
    * @param {string|Mx.parameters.Map} parameters to build the map
    * @param {Mx.parameters.MapOptions} options custom options to build the map
    * @returns {M.Map}
    * @api stable
    */
   M.map = function (parameters, options) {
      // checks if the user specified an implementation
      if (M.utils.isUndefined(M.impl) || M.utils.isNull(M.impl)) {
         M.exception('No se ha especificado ninguna implementación');
      }
      return new M.Map(parameters, options);
   };
})();