goog.provide('M.impl.format.XML');

goog.require('M.utils');
goog.require('ol.format.XML');
goog.require('ol.xml');

/**
 * @classdesc
 * Main constructor of the class. Creates a WMC formater
 * for version 1.0.0
 *
 * @constructor
 * @param {Mx.parameters.LayerOptions} options custom options for this formater
 * @extends {M.impl.format.XML}
 * @api stable
 */
M.impl.format.XML = function (options) {
  /**
   * Prefix on the root node that maps to the context namespace URI
   * @private
   * @type {string}
   */
  this.rootPrefix = null;

  /**
   * Mapping of namespace aliases to namespace URIs
   * @private
   * @type {Object}
   */
  this.namespaces = {
    "ol": "http://openlayers.org/context",
    "wmc": "http://www.opengis.net/context",
    "sld": "http://www.opengis.net/sld",
    "xlink": "http://www.w3.org/1999/xlink",
    "xsi": "http://www.w3.org/2001/XMLSchema-instance",
    "xsd": "http://www.w3.org/2001/XMLSchema",
    "ogc": "http://www.opengis.net/ogc"
  };

  /**
   * Custom options for this formater
   * @private
   * @type {Mx.parameters.LayerOptions}
   */
  this.options = (options || {});

  goog.base(this);
};
goog.inherits(M.impl.format.XML, ol.format.XML);


/**
 * @public
 * @function
 * @param {Document} data Document.
 * @return {Object} parsed object.
 * @api stable
 */
M.impl.format.XML.prototype.read = function (data) {
  if (M.utils.isString(data)) {
    data = ol.xml.parse(data);
  }

  if (data.nodeType !== goog.dom.NodeType.DOCUMENT) {
    M.excetion('doc.nodeType should be DOCUMENT');
  }

  var context = {};
  this.read_root(context, data);
  return context;
};

/**
 * @private
 * @function
 * @param {Document} data Document.
 * @return {Object} parsed object.
 * @api stable
 */
M.impl.format.XML.prototype.read_root = function (context, node) {
  var root = node.documentElement;
  this.rootPrefix = root.prefix;
  context["version"] = root.getAttribute("version");
  this.runChildNodes(context, root);
};

/**
 * @private
 * @function
 * @param {Object} obj
 * @param {Document} node
 * @api stable
 */
M.impl.format.XML.prototype.runChildNodes = function (obj, node) {
  var children = node.childNodes;
  var childNode, processor, prefix, local;
  for (var i = 0, len = children.length; i < len; ++i) {
    childNode = children[i];
    if (childNode.nodeType == 1) {
      prefix = this.getNamespacePrefix(childNode.namespaceURI);
      local = childNode.nodeName.split(":").pop();
      processor = this["read_" + prefix + "_" + local];
      if (processor) {
        processor.apply(this, [obj, childNode]);
      }
    }
  }
};

/**
 * Get the namespace prefix for a given uri from the <namespaces> object.
 *
 * @private
 * @function
 * @param {String} uri
 * @return {String} A namespace prefix or null if none found
 * @api stable
 */
M.impl.format.XML.prototype.getNamespacePrefix = function (uri) {
  var prefix = null;
  if (uri === null) {
    prefix = this.namespaces[this.defaultPrefix];
  }
  else {
    for (prefix in this.namespaces) {
      if (this.namespaces[prefix] == uri) {
        break;
      }
    }
  }
  return prefix;
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.XML.prototype.getChildValue = function (node, def) {
  var value = def || "";
  if (node) {
    for (var child = node.firstChild; child; child = child.nextSibling) {
      switch (child.nodeType) {
        case 3: // text node
        case 4: // cdata section
          value += child.nodeValue;
      }
    }
  }
  return value;
};

/**
 * Get an attribute value given the namespace URI and local name
 *
 * @private
 * @function
 * @param {Element} node Node on which to search for an attribute
 * @param {String} uri Namespace URI
 * @param {String} name Local name of the attribute (without the prefix)
 * @return {String} An attribute value or and empty string if none found
 * @api stable
 */
M.impl.format.XML.prototype.getAttributeNS = function (node, uri, name) {
  var attributeValue = "";
  if (node.getAttributeNS) {
    attributeValue = node.getAttributeNS(uri, name) || "";
  }
  else {
    var attributeNode = this.getAttributeNodeNS(node, uri, name);
    if (attributeNode) {
      attributeValue = attributeNode.nodeValue;
    }
  }
  return attributeValue;
};
