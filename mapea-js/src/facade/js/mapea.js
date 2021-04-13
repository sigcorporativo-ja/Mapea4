/**
 * @module M
 */
import 'assets/css/fonts.css';
import 'assets/css/mapea.css';
import 'assets/css/animations.css';
import 'impl/projections.js';
import pkg from 'package.json';
import MapImpl from 'impl/Map.js';
import Map from './Map.js';
import { isNullOrEmpty } from './util/Utils.js';
import Exception from './exception/exception.js';
import './util/Window.js';
import './util/polyfills.js';
import { getValue } from './i18n/language.js';

/**
 * This function sets the configuration variables
 *
 * @function
 * @param {String} configKey key of the configuration variable
 * @param {*} configValue value of the configuration variable
 * @api
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
    Exception(getValue('exception').no_impl);
  }
  return new Map(parameters, options);
};

/**
 * Flag that indicates if the proxy is
 * enabled to use
 * @type {boolean}
 */
export let useproxy = true;

/**
 * This function enables/disables the proxy
 *
 * @public
 * @function
 * @param {boolean} enable
 * @api
 */
export const proxy = (enable) => {
  if (typeof enable === 'boolean') {
    useproxy = enable;
  }
};

/**
 * Lists of hosts that will not pass through proxy
 * @type {Array}
 */
export const proxyExceptions = [];

/**
 * Add an url to the list of hosts that will not pass through proxy
 * @public
 * @function
 * @param {String} url
 * @api
 */
export const addProxyException = (url) => {
  const urlOrigin = new URL(url).origin;
  if (proxyExceptions.indexOf(urlOrigin) === -1) proxyExceptions.push(urlOrigin);
};

/**
 * Remove an url from the list of hosts that will not pass through proxy
 * @public
 * @function
 * @param {String} url
 * @api
 */
export const removeProxyException = (url) => {
  const urlOrigin = new URL(url).origin;
  const loc = proxyExceptions.indexOf(urlOrigin);
  if (loc !== -1) proxyExceptions.splice(loc, 1);
};

/**
 * Indicate the version of Mapea
 * @public
 * @const {String}
 * @api
 */
export const version = pkg.version;
