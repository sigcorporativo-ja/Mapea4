goog.provide('M.Parameters');

goog.require('M.utils');
goog.require('M.exception');
goog.require('M.parameter.layer');
goog.require('M.parameter.projection');
goog.require("M.parameter.maxExtent");
goog.require("M.parameter.resolutions");
goog.require("M.parameter.zoom");
goog.require("M.parameter.center");

(function (document) {
   'use strict';

   /**
    * @classdesc
    * Main constructor of the class. Creates the parsed parameters
    * with parameters specified by the user
    *
    * @constructor
    * @param {string|Mx.parameters.Map} userParameters parameters
    * provided by the user
    * @api stable
    */
   M.Parameters = (function (userParameters) {
      if (M.utils.isNullOrEmpty(userParameters)) {
         M.exception('No ha especificado ningún parámetro');
      }

      /**
       * @public
       * @type {Object}
       * @api stable
       */
      this.container = parseContainer(userParameters);

      /**
       * @public
       * @type {Object}
       * @api stable
       */
      this.layers = parseLayers(userParameters);

      /**
       * @public
       * @type {Object}
       * @api stable
       */
      this.wmc = parseWMC(userParameters);

      /**
       * @public
       * @type {Object}
       * @api stable
       */
      this.wms = parseWMS(userParameters);

      /**
       * @public
       * @type {Object}
       * @api stable
       */
      this.wmts = parseWMTS(userParameters);

      /**
       * @public
       * @type {Object}
       * @api stable
       */
      this.kml = parseKML(userParameters);

      /**
       * @public
       * @type {Object}
       * @api stable
       */
      this.controls = parseControls(userParameters);

      /**
       * @public
       * @type {Object}
       * @api stable
       */
      this.getfeatureinfo = parseGetFeatureInfo(userParameters);

      /**
       * @public
       * @type {Object}
       * @api stable
       */
      this.maxExtent = parseMaxExtent(userParameters);

      /**
       * @public
       * @type {Object}
       * @api stable
       */
      this.bbox = parseBbox(userParameters);

      /**
       * @public
       * @type {Number}
       * @api stable
       */
      this.zoom = parseZoom(userParameters);

      /**
       * @public
       * @type {Object}
       * @api stable
       */
      this.center = parseCenter(userParameters);

      /**
       * @public
       * @type {String|Array<String>|Array<Number>}
       * @api stable
       */
      this.resolutions = parseResolutions(userParameters);

      /**
       * @public
       * @type {Object}
       * @api stable
       */
      this.projection = parseProjection(userParameters);

      /**
       * @public
       * @type {Object}
       * @api stable
       */
      this.label = parseLabel(userParameters);
   });

   /**
    * This function parses a container parameter in a legible
    * parameter to Mapea and checks posible errors
    *
    * @private
    * @function
    * @param {string|Mx.parameters.Map} userParameters parameters
    * especified by the user
    * @returns {Object} container of the map
    */
   var parseContainer = function (userParameters) {
      var container;

      if (M.utils.isString(userParameters)) {
         container = document.getElementById(userParameters);
      }
      else if (M.utils.isObject(userParameters)) {
         if (!M.utils.isNullOrEmpty(userParameters.id)) {
            container = document.getElementById(userParameters.id);
         }
         else if (!M.utils.isNullOrEmpty(userParameters.container)) {
            container = parseContainer(userParameters.container);
         }
         else {
            M.exception('No ha especificado ningún parámetro contenedor');
         }
      }
      else {
         M.exception('El tipo del parámetro container no es válido: ' + (typeof userParameters));
      }

      if (M.utils.isNullOrEmpty(container)) {
         M.exception('No existe ningún contenedor con el id especificado');
      }

      return container;
   };

   /**
    * This function parses a layer parameter in a legible
    * parameter to Mapea and checks posible errors
    *
    * @private
    * @function
    * @param {string|Mx.parameters.Map} parameter parameters
    * especified by the user
    * @returns {string|Object|Array<string|Object>} layers specified by the user
    */
   var parseLayers = function (parameter) {
      var layers;

      if (M.utils.isString(parameter)) {
         layers = M.utils.getParameterValue('layers', parameter);
      }
      else if (M.utils.isObject(parameter)) {
         layers = parameter.layers;
      }
      else {
         M.exception('El tipo del parámetro container no es válido: ' + (typeof parameter));
      }

      return layers;
   };

   /**
    * This function parses a wmc parameter in a legible
    * parameter to Mapea and checks posible errors
    *
    * @private
    * @function
    * @param {string|Mx.parameters.Map} parameter parameters
    * especified by the user
    * @returns {string|Object|Array<string|Object>} WMC layers
    */
   var parseWMC = function (parameter) {
      var wmc;

      if (M.utils.isString(parameter)) {
         wmc = M.utils.getParameterValue('wmc', parameter);
         if (M.utils.isNullOrEmpty(wmc)) {
            wmc = M.utils.getParameterValue('wmcfile', parameter);
         }
         if (M.utils.isNullOrEmpty(wmc)) {
            wmc = M.utils.getParameterValue('wmcfiles', parameter);
         }
      }
      else if (M.utils.isObject(parameter)) {
         wmc = parameter.wmc;
         if (M.utils.isNullOrEmpty(wmc)) {
            wmc = parameter.wmcfile;
         }
         if (M.utils.isNullOrEmpty(wmc)) {
            wmc = parameter.wmcfiles;
         }
      }
      else {
         M.exception('El tipo del parámetro container no es válido: ' + (typeof parameter));
      }
      return wmc;
   };

   /**
    * This function parses a wms parameter in a legible
    * parameter to Mapea and checks posible errors
    *
    * @private
    * @function
    * @param {string|Mx.parameters.Map} parameter parameters
    * especified by the user
    * @returns {string|Object|Array<string|Object>} WMS layers
    */
   var parseWMS = function (parameter) {
      var wms, layers;

      if (M.utils.isString(parameter)) {
         wms = M.utils.getParameterValue('wms', parameter);
      }
      else if (M.utils.isObject(parameter)) {
         wms = parameter.wms;
      }
      else {
         M.exception('El tipo del parámetro container no es válido: ' + (typeof parameter));
      }

      return wms;
   };

   /**
    * This function parses a wmts parameter in a legible
    * parameter to Mapea and checks posible errors
    *
    * @private
    * @function
    * @param {string|Mx.parameters.Map} parameter parameters
    * especified by the user
    * @returns {string|Object|Array<string|Object>} WMTS layers
    */
   var parseWMTS = function (parameter) {
      var wmts, layers;

      if (M.utils.isString(parameter)) {
         wmts = M.utils.getParameterValue('wmts', parameter);
      }
      else if (M.utils.isObject(parameter)) {
         wmts = parameter.wmts;
      }
      else {
         M.exception('El tipo del parámetro container no es válido: ' + (typeof parameter));
      }

      return wmts;
   };

   /**
    * This function parses a kml parameter in a legible
    * parameter to Mapea and checks posible errors
    *
    * @private
    * @function
    * @param {string|Mx.parameters.Map} parameter parameters
    * especified by the user
    * @returns {string|Object|Array<string|Object>} KML layers
    */
   var parseKML = function (parameter) {
      var kml, layers;

      if (M.utils.isString(parameter)) {
         kml = M.utils.getParameterValue('kml', parameter);
      }
      else if (M.utils.isObject(parameter)) {
         kml = parameter.kml;
      }
      else {
         M.exception('El tipo del parámetro container no es válido: ' + (typeof parameter));
      }

      return kml;
   };

   /**
    * This function parses a controls parameter in a legible
    * parameter to Mapea and checks posible errors
    *
    * @private
    * @function
    * @param {string|Mx.parameters.Map} parameter parameters
    * especified by the user
    * @returns {string|Object|Array<string|Object>} WMS layers
    */
   var parseControls = function (parameter) {
      var controls;

      if (M.utils.isString(parameter)) {
         controls = M.utils.getParameterValue('controls', parameter);
      }
      else if (M.utils.isObject(parameter)) {
         controls = parameter.controls;
      }
      else {
         M.exception('El tipo del parámetro controls no es válido: ' + (typeof parameter));
      }

      return controls;
   };

   /**
    * This function parses a controls parameter in a legible
    * parameter to Mapea and checks posible errors
    *
    * @private
    * @function
    * @param {string|Mx.parameters.Map} parameter parameters
    * especified by the user
    * @returns {string|Object|Array<string|Object>} WMS layers
    */
   var parseGetFeatureInfo = function (parameter) {
      var getFeatureInfo;

      if (M.utils.isString(parameter)) {
         getFeatureInfo = M.utils.getParameterValue('getfeatureinfo', parameter);
      }
      else if (M.utils.isObject(parameter)) {
         getFeatureInfo = parameter.getfeatureinfo;
      }
      else {
         M.exception('El tipo del parámetro controls no es válido: ' + (typeof parameter));
      }

      return getFeatureInfo;
   };

   /**
    * This function parses a maxExtent parameter in a legible
    * parameter to Mapea and checks posible errors
    *
    * @private
    * @function
    * @param {string|Mx.parameters.Map} parameter parameters
    * especified by the user
    * @returns {String|Array<String>|Array<Number>|Mx.Extent} maximum extent
    * established by the user
    */
   var parseMaxExtent = function (parameter) {
      var maxExtent;

      if (M.utils.isString(parameter)) {
         maxExtent = M.utils.getParameterValue('maxExtent', parameter);
         if (M.utils.isNullOrEmpty(maxExtent)) {
            maxExtent = M.utils.getParameterValue('maxextent', parameter);
         }
      }
      else if (M.utils.isObject(parameter)) {
         maxExtent = parameter.maxExtent;
         if (M.utils.isNullOrEmpty(maxExtent)) {
            maxExtent = parameter.maxextent;
         }
      }
      else {
         M.exception('El tipo del parámetro container no es válido: ' + (typeof parameter));
      }
      return maxExtent;
   };

   /**
    * This function parses a bbox parameter in a legible
    * parameter to Mapea and checks posible errors
    *
    * @private
    * @function
    * @param {string|Mx.parameters.Map} parameter parameters
    * especified by the user
    * @returns {String|Array<String>|Array<Number>|Mx.Extent} bbox
    * established by the user
    */
   var parseBbox = function (parameter) {
      var bbox;

      if (M.utils.isString(parameter)) {
         bbox = M.utils.getParameterValue('bbox', parameter);
      }
      else if (M.utils.isObject(parameter)) {
         bbox = parameter.bbox;
      }
      else {
         M.exception('El tipo del parámetro container no es válido: ' + (typeof parameter));
      }

      return bbox;
   };

   var parseZoom = function (parameter) {
      var zoom;

      if (M.utils.isString(parameter)) {
         zoom = M.utils.getParameterValue('zoom', parameter);
      }
      else if (M.utils.isObject(parameter)) {
         zoom = parameter.zoom;
      }
      else {
         M.exception('El tipo del parámetro zoom no es válido: ' + (typeof parameter));
      }

      return zoom;
   };

   var parseCenter = function (parameter) {
      var center;

      if (M.utils.isString(parameter)) {
         center = M.utils.getParameterValue('center', parameter);
      }
      else if (M.utils.isObject(parameter)) {
         center = parameter.center;
      }
      else {
         M.exception('El tipo del parámetro center no es válido: ' + (typeof parameter));
      }

      return center;
   };

   /**
    * This function parses a resolutions parameter in a legible
    * parameter to Mapea and checks posible errors
    *
    * @private
    * @function
    * @param {string|Mx.parameters.Map} parameter parameters
    * especified by the user
    * @returns {String|Array<String>|Array<Number> resolutions
    * established by the user
    */
   var parseResolutions = function (parameter) {
      var resolutions;

      if (M.utils.isString(parameter)) {
         resolutions = M.utils.getParameterValue('resolutions', parameter);
      }
      else if (M.utils.isObject(parameter)) {
         resolutions = parameter.resolutions;
      }
      else {
         M.exception('El tipo del parámetro container no es válido: ' + (typeof parameter));
      }

      return resolutions;
   };

   /**
    * This function parses a projection parameter in a legible
    * parameter to Mapea and checks posible errors
    *
    * @private
    * @function
    * @param {string|Mx.parameters.Map} parameter parameters
    * especified by the user
    * @returns {String|Array<String>|Array<Number>|Mx.Extent} bbox
    * established by the user
    */
   var parseProjection = function (parameter) {
      var projection;

      if (M.utils.isString(parameter)) {
         projection = M.utils.getParameterValue('projection', parameter);
      }
      else if (M.utils.isObject(parameter)) {
         projection = parameter.projection;
      }
      else {
         M.exception('El tipo del parámetro container no es válido: ' + (typeof parameter));
      }

      return projection;
   };

   /**
    * This function parses a projection parameter in a legible
    * parameter to Mapea and checks posible errors
    *
    * @private
    * @function
    * @param {string|Mx.parameters.Map} parameter parameters
    * especified by the user
    * @returns {String|Array<String>|Array<Number>|Mx.Extent} bbox
    * established by the user
    */
   var parseLabel = function (parameter) {
      var label;

      if (M.utils.isString(parameter)) {
         label = M.utils.getParameterValue('label', parameter);
      }
      else if (M.utils.isObject(parameter)) {
         label = parameter.label;
      }
      else {
         M.exception('El tipo del parámetro container no es válido: ' + (typeof parameter));
      }

      return label;
   };
})((window && window.document) || {});