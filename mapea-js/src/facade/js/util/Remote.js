/**
 * @module M/remote
 */

import { addParameters, generateRandom, isNullOrEmpty, isObject } from './Utils.js';
import { useproxy, proxyExceptions } from '../mapea.js';
import Response from './Response.js';

/**
 * HTTP methods POST y GET
 * @const
 * @type {object}
 * @public
 * @api2
 */
export const method = {
  GET: 'GET',
  POST: 'POST',
};

/**
 * TODO
 */
const createScriptTag = (proxyUrl, jsonpHandlerName) => {
  const scriptTag = document.createElement('script');
  scriptTag.type = 'text/javascript';
  scriptTag.id = jsonpHandlerName;
  scriptTag.src = proxyUrl;
  scriptTag.setAttribute('async', '');
  window.document.body.appendChild(scriptTag);
};

/**
 * TODO
 */
const removeScriptTag = (jsonpHandlerName) => {
  const scriptTag = document.getElementById(jsonpHandlerName);
  scriptTag.parentNode.removeChild(scriptTag);
};

/**
 * TODO
 */
const manageProxy = (url, methodType) => {
  // deafult GET
  let proxyUrl = M.config.PROXY_URL;
  if (methodType === method.POST) {
    proxyUrl = M.config.PROXY_POST_URL;
  }

  proxyUrl = addParameters(proxyUrl, {
    url,
  });

  return proxyUrl;
};

/**
 * TODO
 */
const jsonp = (urlVar, data, options) => {
  const toExclude = ['geoprint', 'api.json'];
  let url = !useproxy && window.mapjs && !toExclude.some(excl => urlVar.includes(excl)) ? `${urlVar}&ticket=${window.mapjs.getTicket()}` : urlVar;
  if (!isNullOrEmpty(data)) {
    url = addParameters(url, data);
  }

  if (useproxy) {
    url = manageProxy(url, method.GET);
  }

  // creates a random name to avoid clonflicts
  const jsonpHandlerName = generateRandom('mapea_jsonphandler_');
  url = addParameters(url, {
    callback: jsonpHandlerName,
  });

  if (!isNullOrEmpty(options) && 'ticket' in options && (options.ticket === false)) {
    const indexTicket = url.indexOf('ticket=');
    const endTicket = url.indexOf('&', indexTicket);
    url = url.substring(url, indexTicket) + url.substring(endTicket, url.length);
  }

  const req = new Promise((success, fail) => {
    const userCallback = success;
    // get the promise of the script tag
    const scriptTagPromise = new Promise((scriptTagSuccess) => {
      window[jsonpHandlerName] = scriptTagSuccess;
    });
    /* when the script tag was executed remove
     * the handler and execute the callback
     */
    scriptTagPromise.then((proxyResponse) => {
      // remove the jsonp handler from global window
      delete window[jsonpHandlerName];

      // remove the script tag from the html
      removeScriptTag(jsonpHandlerName);

      const response = new Response();
      response.parseProxy(proxyResponse);

      userCallback(response);
    });
  });

  // creates the script tag
  createScriptTag(url, jsonpHandlerName);

  return req;
};

/**
 * TODO
 */
const ajax = (urlVar, dataVar, methodType, useProxy) => {
  let url = !useproxy && window.mapjs && !urlVar.includes('geoprint') ? `${urlVar}&ticket=${window.mapjs.getTicket()}` : urlVar;
  let data = dataVar;
  if ((useProxy !== false) && (useproxy === true)) {
    url = manageProxy(url, methodType);
  }

  // parses parameters to string
  if (isObject(data)) {
    data = JSON.stringify(data);
  }

  return new Promise((success, fail) => {
    let xhr;
    if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        const response = new Response();
        response.parseXmlHttp(xhr);
        success(response);
      }
    };
    xhr.open(methodType, url, true);
    xhr.send(data);
  });
};

/**
 * This function gets a resource throw a
 * HTTP GET method and checks if the request
 * is ajax or jsonp based
 *
 * @function
 * @param {string} url
 * @param {Object} options
 * @returns {Promise}
 * @api
 */
export const get = (url, data, options) => {
  let req;

  let useProxy = ((isNullOrEmpty(options) || (options.jsonp !== false)) &&
    useproxy !== false);

  const urlOrigin = new URL(url).origin;
  useProxy = useProxy && proxyExceptions.indexOf(urlOrigin) === -1;

  if (useProxy === true) {
    req = jsonp(url, data, options);
  } else {
    req = ajax(url, data, method.GET, false);
  }

  return req;
};

/**
 * This function gets a resource throw a
 * HTTP POST method using ajax
 *
 * @function
 * @param {string} url
 * @param {Object} data
 * @returns {Promise}
 * @api
 */
export const post = (url, data, options) => {
  return ajax(url, data, method.POST);
};
