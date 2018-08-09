/**
 * @module M
 */
import 'assets/css/fonts';
import 'assets/css/mapea';
import 'assets/css/animations';
import 'impl/projections';
import MapImpl from 'impl/Map';
import Map from './Map';
import { isNullOrEmpty } from './util/Utils';
import Exception from './exception/exception';
import './util/Window';
import './util/polyfills';

/**
 * Default messages language
 * @type {string}
 * @api
 */
export let lang_ = 'es';

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
export const lang = (langCode) => {
  if (!isNullOrEmpty(langCode)) {
    lang_ = langCode;
  }
};

/**
 * This function sets the configuration variables
 *
 * @function
 * @param {String} configKey key of the configuration variable
 * @param {*} configValue value of the configuration variable
 * @api stable
 */
export const config = (configKey, configValue) => {
  config[configKey] = configValue;
};

/**
 * This function creates a new map using the parameters
 * specified by the user
 *
 * @function
 * @param {string|Mx.parameters.Map} parameters to build the map
 * @param {Mx.parameters.MapOptions} options custom options to build the map
 * @returns {M.Map}
 * @api
 */
export const map = (parameters, options) => {
  // checks if the user specified an implementation
  if (isNullOrEmpty(MapImpl)) {
    Exception('No se ha especificado ninguna implementación');
  }
  return new Map(parameters, options);
};

// /**
//  * Implementation of Mapea
//  * @type {Object}
//  * @api stable
//  */
// const impl = null;
