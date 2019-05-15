/**
 * @module M/impl/format/XML
 */
import { isString } from 'M/util/Utils';
import Exception from 'M/exception/exception';
import { parse as olXMLParse } from 'ol/xml';
import { getValue } from 'M/i18n/language';

/**
 * @classdesc
 * @api
 */
class XML {
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
  constructor(options = {}) {
    // super();
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
      ol: 'http://openlayers.org/context',
      wmc: 'http://www.opengis.net/context',
      sld: 'http://www.opengis.net/sld',
      xlink: 'http://www.w3.org/1999/xlink',
      xsi: 'http://www.w3.org/2001/XMLSchema-instance',
      xsd: 'http://www.w3.org/2001/XMLSchema',
      ogc: 'http://www.opengis.net/ogc',
    };

    /**
     * Custom options for this formater
     * @private
     * @type {Mx.parameters.LayerOptions}
     */
    this.options = options;
  }


  /**
   * @public
   * @function
   * @param {Document} data Document.
   * @return {Object} parsed object.
   * @api stable
   */
  read(data) {
    let dataVariable = data;
    if (isString(data)) {
      dataVariable = olXMLParse(data);
    }

    if (dataVariable.nodeType !== 9) {
      Exception(getValue('exception').must_be_document);
    }

    const context = {};
    this.readRoot(context, dataVariable);
    return context;
  }

  /**
   * @private
   * @function
   * @param {Document} data Document.
   * @return {Object} parsed object.
   * @api stable
   */

  readRoot(context, node) {
    const contextVariable = context;
    const root = node.documentElement;
    this.rootPrefix = root.prefix;
    contextVariable.version = root.getAttribute('version');
    this.runChildNodes(contextVariable, root);
  }

  /**
   * @private
   * @function
   * @param {Object} obj
   * @param {Document} node
   * @api stable
   */
  runChildNodes(obj, node) {
    const children = node.childNodes;
    let childNode;
    let processor;
    let prefix;
    let local;
    for (let i = 0, len = children.length; i < len; i += 1) {
      childNode = children[i];
      if (childNode.nodeType === 1) {
        prefix = this.getNamespacePrefix(childNode.namespaceURI);
        local = childNode.nodeName.split(':').pop();
        processor = this[`read${prefix}${local}`];
        if (processor) {
          processor.apply(this, [obj, childNode]);
        }
      }
    }
  }

  /**
   * Get the namespace prefix for a given uri from the <namespaces> object.
   *
   * @private
   * @function
   * @param {String} uri
   * @return {String} A namespace prefix or null if none found
   * @api stable
   */
  getNamespacePrefix(uri) {
    let prefix = null;
    if (uri === null) {
      prefix = this.namespaces[this.defaultPrefix];
    } else {
      const keys = Object.keys(this.namespaces);
      for (let i = 0; i < keys.length; i += 1) {
        prefix = keys[i];
        if (this.namespaces[prefix] === uri) {
          break;
        }
      }
    }
    return prefix;
  }

  /**
   * @private
   * @function
   * @api stable
   */
  static getChildValue(node, def) {
    let value = def || '';
    if (node) {
      for (let child = node.firstChild; child; child = child.nextSibling) {
        switch (child.nodeType) {
          case 3: // text node
          case 4: // cdata section
            value += child.nodeValue;
            break;
          default:
        }
      }
    }
    return value;
  }

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
  getAttributeNS(node, uri, name) {
    let attributeValue = '';
    if (node.getAttributeNS) {
      attributeValue = node.getAttributeNS(uri, name) || '';
    } else {
      const attributeNode = this.getAttributeNodeNS(node, uri, name);
      if (attributeNode) {
        attributeValue = attributeNode.nodeValue;
      }
    }
    return attributeValue;
  }
}

export default XML;
