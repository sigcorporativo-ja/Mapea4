import Utils from "./Utils";
import Exception from "../exception/exception";
import M from "../mapea.js";
import Config from "configuration";

/**
 * @namespace Remote
 */
export class Remote {
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

    let useProxy = ((Utils.isNullOrEmpty(options) || (options.jsonp !== false)) && M.proxy_ !== false);

    if (useProxy === true) {
      req = Remote.jsonp_(url, data, options);
    }
    else {
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

  static jsonp_(url, data, options) {
    if (!Utils.isNullOrEmpty(data)) {
      url = Utils.addParameters(url, data);
    }

    if (M.proxy_) {
      url = Remote.manageProxy_(url, Remote.method.GET);
    }

    // creates a random name to avoid clonflicts
    let jsonpHandlerName = Utils.generateRandom('mapea_jsonp_handler_');
    url = Utils.addParameters(url, {
      'callback': jsonpHandlerName
    });

    let req = new Promise((success, fail) => {
      let userCallback = success;
      // get the promise of the script tag
      let scriptTagPromise = new Promise((scriptTagSuccess) => {
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

        let response = new Remote.Response();
        response.parseProxy(proxyResponse);

        userCallback(response);
      });
    });

    // creates the script tag
    Remote.createScriptTag_(url, jsonpHandlerName);

    return req;
  }

  static ajax_(url, data, method, useProxy) {
    if ((useProxy !== false) && (M.proxy_ === true)) {
      url = Remote.manageProxy_(url, method);
    }

    // parses parameters to string
    if (Utils.isObject(data)) {
      data = JSON.stringify(data);
    }

    return new Promise((success, fail) => {
      let xhr;
      if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
      }
      else if (window.ActiveXObject) {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
      }
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          let response = new Remote.Response();
          response.parseXmlHttp(xhr);
          success(response);
        }
      };
      xhr.open(method, url, true);
      xhr.send(data);
    });
  }

  static manageProxy_(url, method) {
    // deafult GET
    let proxyUrl = Config.PROXY_URL;
    if (method === Remote.method.POST) {
      proxyUrl = Config.PROXY_POST_URL;
    }

    proxyUrl = Utils.addParameters(proxyUrl, {
      'url': url
    });

    return proxyUrl;
  }

  static createScriptTag_(proxyUrl, jsonpHandlerName) {
    let scriptTag = document.createElement("script");
    scriptTag.type = "text/javascript";
    scriptTag.id = jsonpHandlerName;
    scriptTag.src = proxyUrl;
    scriptTag.setAttribute("async", "");
    window.document.body.appendChild(scriptTag);
  }

  static removeScriptTag_(jsonpHandlerName) {
    let scriptTag = document.getElementById(jsonpHandlerName);
    delete scriptTag;
  }

  /**
   * @classdesc
   * Response for proxy requests
   *
   * @constructor
   * @extends {M.Object}
   * @param {Object} response from proxy requests
   * @api stable
   */
  export class Response(xmlHttpResponse) {
    /**
     * @public
     * @type {string}
     * @api stable
     */
    this.text = null;

    /**
     * @public
     * @type {XML}
     * @api stable
     */
    this.xml = null;

    /**
     * @public
     * @type {Object}
     * @api stable
     */
    this.headers = {};

    /**
     * @public
     * @type {boolean}
     * @api stable
     */
    this.error = false;

    /**
     * @public
     * @type {int}
     * @api stable
     */
    this.code = 0;
  }

  /**
   * This function parses a XmlHttp response
   * from an ajax request
   *
   * @function
   * @param {Object} url
   * @api stable
   */
  parseXmlHttp(xmlHttpResponse) {
    this.text = xmlHttpResponse['responseText'];
    this.xml = xmlHttpResponse['responseXML'];
    this.code = xmlHttpResponse['status'];
    this.error = (xmlHttpResponse['statusText'] !== 'OK');

    let headers = xmlHttpResponse.getAllResponseHeaders();
    headers = headers.split('\n');
    headers.forEach((head) => {
      head = head.trim();
      let headName = head.replace(/^([^\:]+)\:(.+)$/, '$1').trim();
      let headValue = head.replace(/^([^\:]+)\:(.+)$/, '$2').trim();
      if (headName !== '') {
        this.headers[headName] = headValue;
      }
    }, this);
  }

  /**
   * This function parses a XmlHttp response
   * from an ajax request
   *
   * @function
   * @param {Object} url
   * @api stable
   */
  parseProxy(proxyResponse) {
    this.code = proxyResponse.code;
    this.error = proxyResponse.error;

    // adds content
    if ((this.code === 200) && (this.error !== true)) {
      this.text = proxyResponse.content.trim();
      try {
        // it uses DOMParser for html responses
        // google XML parser in other case
        let contentType = proxyResponse.headers['Content-Type'];
        if ((typeof DOMParser !== 'undefined') && /text\/html/i.test(contentType)) {
          this.xml = (new DOMParser()).parseFromString(this.text, 'text/html');
        }
        // it avoids responses that aren't xml format
        else if (/xml/i.test(contentType)) {
          this.xml = goog.dom.xml.loadXml(this.text);
        }
      }
      catch (err) {
        this.xml = null;
        this.error = true;
      }
    }

    // adds headers
    Object.keys(proxyResponse.headers).forEach(head => {
      this.headers[head] = proxyResponse.headers[head];
    });
  }

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
}
