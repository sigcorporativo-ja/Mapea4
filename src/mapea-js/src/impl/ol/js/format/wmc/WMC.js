import Exception from 'facade/js/exception/exception';
import { normalize } from 'facade/js/util/Utils';
import XML from '../XML';
import WMC110 from './WMC110';

export default class WMC extends XML {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WMC formater
   *
   * @constructor
   * @param {Mx.parameters.LayerOptions} options custom options for this formater
   * @extends {ol.format.XML}
   * @api stable
   */
  constructor(options) {
    super(options);
    /**
     * WMC version
     * @private
     * @type {string}
     */
    this.version = null;

    /**
     * Parser of an specified WMC version
     * @private
     * @type {ol.format.XML}
     */
    this.parser = null;
  }

  /**
   * @private
   * @function
   * @param {Document} data Document.
   * @return {Object} WMC object.
   * @api stable
   */
  readFromDocument(data) {
    if (data.nodeType !== 9) {
      Exception('doc.nodeType should be DOCUMENT');
    }

    const root = data.documentElement;
    this.version = root.getAttribute('version');
    if (!this.version) {
      this.version = WMC.DEFAULT_VERSION;
    }

    const parserVersion = 'v'.concat(normalize(this.version).replace(/\./g, ''));
    this.parser = new WMC.VERSION[parserVersion](this.options);

    const context = this.parser.read(data);

    return context;
  }
}

WMC.VERSION = {
  v110: WMC110,
};
