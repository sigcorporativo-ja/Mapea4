import Config from 'configuration';
import { addParameters, generateRandom, isNullOrEmpty, isObject } from './Utils';
import M from '../Mapea';
import Response from './Response';
/**
 * @namespace Remote
 */
export default class Remote {
  /**
   * This function gets a resource throw a
   * HTTP GET method and checks if the request
   * is ajax or jsonp based
   *
   * @function
   * @param {string} url
   * @param {Object} options
   * @returns {Promise}
   * @api stable
   */
  static get(url, data, options) {
    let req;

    const useProxy = ((isNullOrEmpty(options) || (options.jsonp !== false)) &&
      M.proxy_ !== false);

    if (useProxy === true) {
      req = Remote.jsonp_(url, data, options);
    } else {
      req = Remote.ajax_(url, data, Remote.method.GET, false);
    }

    return req;
  }

  /**
   * This function gets a resource throw a
   * HTTP POST method using ajax
   *
   * @function
   * @param {string} url
   * @param {Object} data
   * @returns {Promise}
   * @api stable
   */
  static post(url, data, options) {
    return Remote.ajax_(url, data, Remote.method.POST);
  }

  /**
   * TODO
   */
  static jsonp_(urlVar, data, options) {
    let url = urlVar;
    if (!isNullOrEmpty(data)) {
      url = addParameters(url, data);
    }

    if (M.proxy_) {
      url = Remote.manageProxy_(url, Remote.method.GET);
    }

    // creates a random name to avoid clonflicts
    const jsonpHandlerName = generateRandom('mapea_jsonp_handler_');
    url = addParameters(url, {
      callback: jsonpHandlerName,
    });

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
        Remote.removeScriptTag_(jsonpHandlerName);

        const response = new Response();
        response.parseProxy(proxyResponse);

        userCallback(response);
      });
    });

    // creates the script tag
    Remote.createScriptTag_(url, jsonpHandlerName);

    return req;
  }

  /**
   * TODO
   */
  static ajax_(urlVar, dataVar, method, useProxy) {
    let url = urlVar;
    let data = dataVar;
    if ((useProxy !== false) && (M.proxy_ === true)) {
      url = Remote.manageProxy_(url, method);
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
      xhr.open(method, url, true);
      xhr.send(data);
    });
  }

  /**
   * TODO
   */
  static manageProxy_(url, method) {
    // deafult GET
    let proxyUrl = Config.PROXY_URL;
    if (method === Remote.method.POST) {
      proxyUrl = Config.PROXY_POST_URL;
    }

    proxyUrl = addParameters(proxyUrl, {
      url,
    });

    return proxyUrl;
  }

  /**
   * TODO
   */
  static createScriptTag_(proxyUrl, jsonpHandlerName) {
    const scriptTag = document.createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.id = jsonpHandlerName;
    scriptTag.src = proxyUrl;
    scriptTag.setAttribute('async', '');
    window.document.body.appendChild(scriptTag);
  }

  static removeScriptTag_(jsonpHandlerName) {
    const scriptTag = document.getElementById(jsonpHandlerName);
    scriptTag.parentNode.removeChild(scriptTag);
  }
}


Remote.method = {};
/**
 * HTTP method GET
 * @const
 * @type {string}
 * @public
 * @api stable
 */
Remote.method.GET = 'GET';

/**
 * HTTP method POST
 * @const
 * @type {string}
 * @public
 * @api stable
 */
Remote.method.POST = 'POST';
