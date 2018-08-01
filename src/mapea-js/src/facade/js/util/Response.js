export default class Response {
  /**
   * @classdesc
   * Response for proxy requests
   *
   * @constructor
   * @extends {M.Object}
   * @param {Object} response from proxy requests
   * @api stable
   */
  constructor(xmlHttpResponse) {
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
    this.text = xmlHttpResponse.responseText;
    this.xml = xmlHttpResponse.responseXML;
    this.code = xmlHttpResponse.status;
    this.error = (xmlHttpResponse.statusText !== 'OK');

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
        const contentType = proxyResponse.headers['Content-Type'];
        if ((typeof DOMParser !== 'undefined') && /text\/html/i.test(contentType)) {
          this.xml = (new DOMParser()).parseFromString(this.text, 'text/html');
        }
        // it avoids responses that aren't xml format
        else if (/xml/i.test(contentType)) {
          this.xml = ol.xml.parse(this.text);
        }
      }
      catch (err) {
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
