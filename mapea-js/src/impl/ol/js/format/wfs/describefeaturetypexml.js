goog.provide('M.impl.format.DescribeFeatureTypeXML');

goog.require('M.utils');
goog.require('M.impl.format.XML');

/**
 * @classdesc
 * Main constructor of the class. Creates a XML formater
 * for a DescribeFeatureType response
 *
 * @constructor
 * @param {Mx.parameters.LayerOptions} options custom options for this formater
 * @extends {M.impl.format.XML}
 * @api stable
 */
M.impl.format.DescribeFeatureTypeXML = function (options) {
  /**
   * FeatureType index
   * @private
   * @type {number}
   */
  this.featureTypeIdx_ = 0;

  /**
   * flag to indicate if a FeatureType is being read
   * @private
   * @type {boolean}
   */
  this.readingFeatureType_ = false;

  /**
   * flag to indicate if service responded with
   * an exception
   * @private
   * @type {boolean}
   */
  this.serviceException_ = false;

  goog.base(this, options);
};
goog.inherits(M.impl.format.DescribeFeatureTypeXML, M.impl.format.XML);

/**
 * @private
 * @function
 * @param {Document} data Document.
 * @return {Object} parsed object.
 * @api stable
 */
M.impl.format.DescribeFeatureTypeXML.prototype.read_root = function (context, node) {
  var root = node.documentElement;

  if (/ServiceExceptionReport/i.test(root.localName)) {
    this.serviceException_ = true;
  }
  else {
    this.rootPrefix = root.prefix;
    context["elementFormDefault"] = root.getAttribute("elementFormDefault");
    context["targetNamespace"] = root.getAttribute("targetNamespace");
    context["targetPrefix"] = root.getAttribute("targetPrefix");
    context["featureTypes"] = [];
  }
  this.runChildNodes(context, root);
};

/**
 * @private
 * @function
 * @param {Object} obj
 * @param {Document} node
 * @api stable
 */
M.impl.format.DescribeFeatureTypeXML.prototype.read_ogc_ServiceException = function (context, node) {
  M.dialog.error('Error en el DescribeFeatureType: ' + node.textContent.trim());
};

/**
 * @private
 * @function
 * @param {Object} obj
 * @param {Document} node
 * @api stable
 */
M.impl.format.DescribeFeatureTypeXML.prototype.read_xsd_schema = function (context, node) {
  this.runChildNodes(context, node);
};

/**
 * @private
 * @function
 * @param {Object} obj
 * @param {Document} node
 * @api stable
 */
M.impl.format.DescribeFeatureTypeXML.prototype.read_xsd_import = function (context, node) {
  // none
};

/**
 * @private
 * @function
 * @param {Object} obj
 * @param {Document} node
 * @api stable
 */
M.impl.format.DescribeFeatureTypeXML.prototype.read_xsd_complexType = function (context, node) {
  this.readingFeatureType_ = true;
  context["featureTypes"].push({
    "properties": []
  });
  this.runChildNodes(context, node);
  this.readingFeatureType_ = false;
};

/**
 * @private
 * @function
 * @param {Object} obj
 * @param {Document} node
 * @api stable
 */
M.impl.format.DescribeFeatureTypeXML.prototype.read_xsd_complexContent = function (context, node) {
  this.runChildNodes(context, node);
};

/**
 * @private
 * @function
 * @param {Object} obj
 * @param {Document} node
 * @api stable
 */
M.impl.format.DescribeFeatureTypeXML.prototype.read_xsd_extension = function (context, node) {
  this.runChildNodes(context, node);
};

/**
 * @private
 * @function
 * @param {Object} obj
 * @param {Document} node
 * @api stable
 */
M.impl.format.DescribeFeatureTypeXML.prototype.read_xsd_sequence = function (context, node) {
  this.runChildNodes(context, node);
};

/**
 * @private
 * @function
 * @param {Object} obj
 * @param {Document} node
 * @api stable
 */
M.impl.format.DescribeFeatureTypeXML.prototype.read_xsd_element = function (context, node) {
  if (this.readingFeatureType_ === true) {
    context["featureTypes"][this.featureTypeIdx_]["properties"].push({
      "name": node.getAttribute("name"),
      "maxOccurs": node.getAttribute("maxOccurs"),
      "minOccurs": node.getAttribute("minOccurs"),
      "nillable": node.getAttribute("nillable"),
      "type": node.getAttribute("type"),
      "localType": node.getAttribute("type").replace(/^\w+\:/g, '')
    });
  }
  else {
    context["featureTypes"][this.featureTypeIdx_]["typeName"] = node.getAttribute("name");
    this.featureTypeIdx_++;
  }
};
