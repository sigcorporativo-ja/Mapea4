/**
 * @module M/remote/Response
 */

/**
 * @classdesc
 * Response for proxy requests
 * @api
 */
class Response {
  /**
   *
   * @constructor
   * @extends {M.Object}
   * @param {Object} response from proxy requests
   * @api
   */
  constructor(xmlHttpResponse) {
    /**
     * @public
     * @type {string}
     * @api
     */
    this.text = null;

    /**
     * @public
     * @type {XML}
     * @api
     */
    this.xml = null;

    /**
     * @public
     * @type {Object}
     * @api
     */
    this.headers = {};

    /**
     * @public
     * @type {boolean}
     * @api
     */
    this.error = false;

    /**
     * @public
     * @type {int}
     * @api
     */
    this.code = 0;
  }

  /**
   * This function parses a XmlHttp response
   * from an ajax request
   *
   * @function
   * @param {Object} url
   * @api
   */
  parseXmlHttp(xmlHttpResponse) {
    this.text = xmlHttpResponse.responseText;
    this.xml = xmlHttpResponse.responseXML;
    this.code = xmlHttpResponse.status;
    this.error = xmlHttpResponse.statusText !== '' && xmlHttpResponse.statusText !== 'OK';

    let headers = xmlHttpResponse.getAllResponseHeaders();
    headers = headers.split('\n');
    headers.forEach((head) => {
      let headParameter = head;
      headParameter = headParameter.trim();
      const headName = headParameter.replace(/^([^:]+):(.+)$/, '$1').trim();
      const headValue = headParameter.replace(/^([^:]+):(.+)$/, '$2').trim();
      if (headName !== '') {
        this.headers[headName] = headValue;
      }
    });
  }

  /**
   * This function parses a XmlHttp response
   * from an ajax request
   *
   * @function
   * @param {Object} url
   * @api
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
        const contentType = proxyResponse.headers['Content-Type'];
        if ((typeof DOMParser !== 'undefined') && /text\/html/i.test(contentType)) {
          this.xml = (new DOMParser()).parseFromString(this.text, 'text/html');
        } else if (/xml/i.test(contentType)) { // it avoids responses that aren't xml format
          this.xml = (new DOMParser()).parseFromString(this.text, 'text/xml');
        }
      } catch (err) {
        this.xml = null;
        this.error = true;
      }
    }

    // adds headers
    Object.keys(proxyResponse.headers).forEach((head) => {
      this.headers[head] = proxyResponse.headers[head];
    });
  }
}

export default Response;
