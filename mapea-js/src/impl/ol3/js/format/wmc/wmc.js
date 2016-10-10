goog.provide('M.impl.format.WMC');

goog.require('M.impl.format.XML');

/**
 * @classdesc
 * Main constructor of the class. Creates a WMC formater
 *
 * @constructor
 * @param {Mx.parameters.LayerOptions} options custom options for this formater
 * @extends {ol.format.XML}
 * @api stable
 */
M.impl.format.WMC = function (options) {
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

  goog.base(this, options);
};
goog.inherits(M.impl.format.WMC, M.impl.format.XML);

/**
 * @private
 * @function
 * @param {Document} data Document.
 * @return {Object} WMC object.
 * @api stable
 */
M.impl.format.WMC.prototype.readFromDocument = function (data) {
  if (data.nodeType !== goog.dom.NodeType.DOCUMENT) {
    M.excetion('doc.nodeType should be DOCUMENT');
  }

  var root = data.documentElement;
  this.version = root.getAttribute("version");
  if (!this.version) {
    this.version = M.impl.format.WMC.DEFAULT_VERSION;
  }

  var paerserVersion = 'v'.concat(M.utils.normalize(this.version).replace(/\./g, ""));
  this.parser = new M.impl.format.WMC[paerserVersion](this.options);

  var context = this.parser.read(data);

  return context;
};

M.impl.format.WMC.DEFAULT_VERSION = '1.0.0';
