goog.provide('M.remote');
goog.provide('M.remote.method');
goog.provide('M.remote.Response');

goog.require('M.utils');
goog.require('M.exception');

goog.require('goog.dom');
goog.require('goog.dom.xml');

/**
 * @namespace M.remote
 */
(function(window) {
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
   M.remote.get = function(url, data, options) {
      var req;

      var useProxy = (M.utils.isNullOrEmpty(options) || (options.jsonp !== false));

      if (useProxy === true) {
         req = M.remote.jsonp_(url, data, options);
      }
      else {
         req = M.remote.ajax_(url, data, M.remote.method.GET, false);
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
    * @api stable
    */
   M.remote.post = function(url, data, options) {
      return M.remote.ajax_(url, data, M.remote.method.POST);
   };

   M.remote.jsonp_ = function(url, data, options) {
      if (!M.utils.isNullOrEmpty(data)) {
         url = M.utils.addParameters(url, data);
      }

      if (M.proxy_) {
         url = M.remote.manageProxy_(url, M.remote.method.GET);
      }

      // creates a random name to avoid clonflicts
      var jsonpHandlerName = M.utils.generateRandom('mapea_jsonp_handler_');
      url = M.utils.addParameters(url, {
         'callback': jsonpHandlerName
      });

      var req = new Promise(function(success, fail) {
         var userCallback = success;
         // get the promise of the script tag
         var scriptTagPromise = new Promise(function(scriptTagSuccess) {
            window[jsonpHandlerName] = scriptTagSuccess;
         });
         /* when the script tag was executed remove
          * the handler and execute the callback
          */
         scriptTagPromise.then(function(proxyResponse) {
            // remove the jsonp handler from global window
            delete window[jsonpHandlerName];

            // remove the script tag from the html
            M.remote.removeScriptTag_(jsonpHandlerName);

            var response = new M.remote.Response();
            response.parseProxy(proxyResponse);

            userCallback(response);
         });
      });

      // creates the script tag
      M.remote.createScriptTag_(url, jsonpHandlerName);

      return req;
   };

   M.remote.ajax_ = function(url, data, method, useProxy) {
      if ((useProxy !== false) && (M.proxy_ === true)) {
         url = M.remote.manageProxy_(url, method);
      }

      // parses parameters to string
      if (M.utils.isObject(data)) {
         data = JSON.stringify(data);
      }

      return new Promise(function(success, fail) {
         var xhr;
         if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
         }
         else if (window.ActiveXObject) {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
         }
         xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
               var response = new M.remote.Response();
               response.parseXmlHttp(xhr);
               success(response);
            }
         };
         xhr.open(method, url, true);
         xhr.send(data);
      });
   };

   M.remote.manageProxy_ = function(url, method) {
      // deafult GET
      var proxyUrl = M.config.MAPEA_URL.concat(M.config.PROXY_PATH);
      if (method === M.remote.method.POST) {
         proxyUrl = M.config.MAPEA_URL.concat(M.config.PROXY_POST_PATH);
      }

      proxyUrl = M.utils.addParameters(proxyUrl, {
         'url': url
      });

      return proxyUrl;
   };

   M.remote.createScriptTag_ = function(proxyUrl, jsonpHandlerName) {
      var scriptTag = document.createElement("script");
      scriptTag.type = "text/javascript";
      scriptTag.id = jsonpHandlerName;
      scriptTag.src = proxyUrl;
      scriptTag.setAttribute("async", "");
      goog.dom.appendChild(window.document.body, scriptTag);
   };

   M.remote.removeScriptTag_ = function(jsonpHandlerName) {
      var scriptTag = document.getElementById(jsonpHandlerName);
      goog.dom.removeNode(scriptTag);
   };

   /**
    * @classdesc
    * Response for proxy requests
    *
    * @constructor
    * @extends {M.Object}
    * @param {Object} response from proxy requests
    * @api stable
    */
   M.remote.Response = function(xmlHttpResponse) {
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
   };

   /**
    * This function parses a XmlHttp response
    * from an ajax request
    *
    * @function
    * @param {Object} url
    * @api stable
    */
   M.remote.Response.prototype.parseXmlHttp = function(xmlHttpResponse) {
      this.text = xmlHttpResponse['responseText'];
      this.xml = xmlHttpResponse['responseXML'];
      this.code = xmlHttpResponse['status'];
      this.error = (xmlHttpResponse['statusText'] !== 'OK');

      var headers = xmlHttpResponse.getAllResponseHeaders();
      headers = headers.split('\n');
      headers.forEach(function(head) {
         head = head.trim();
         var headName = head.replace(/^([^\:]+)\:(.+)$/, '$1').trim();
         var headValue = head.replace(/^([^\:]+)\:(.+)$/, '$2').trim();
         if (headName !== '') {
            this.headers[headName] = headValue;
         }
      }, this);
   };

   /**
    * This function parses a XmlHttp response
    * from an ajax request
    *
    * @function
    * @param {Object} url
    * @api stable
    */
   M.remote.Response.prototype.parseProxy = function(proxyResponse) {
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
      Object.keys(proxyResponse.headers).forEach(function(head) {
         this.headers[head] = proxyResponse.headers[head];
      }, this);
   };

   /**
    * HTTP method GET
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.remote.method.GET = 'GET';

   /**
    * HTTP method POST
    * @const
    * @type {string}
    * @public
    * @api stable
    */
   M.remote.method.POST = 'POST';
})(window || {});