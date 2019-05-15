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
import { getValue } from './i18n/language';

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
