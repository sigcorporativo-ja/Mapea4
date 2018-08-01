/* eslint-disable */

import Dialog from 'facade/js/dialog';
import XML from '../XML';

export default class DescribeFeatureTypeXML extends XML {
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
  constructor(options) {
    super(options);
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
  }

  /**
   * @private
   * @function
   * @param {Document} data Document.
   * @return {Object} parsed object.
   * @api stable
   */
  read_root(context, node) {
    const root = node.documentElement;

    if (/ServiceExceptionReport/i.test(root.localName)) {
      this.serviceException_ = true;
    }
    else {
      this.rootPrefix = root.prefix;
      const contextVar = context;
      contextVar.elementFormDefault = root.getAttribute('elementFormDefault');
      contextVar.elementFormDefault = root.getAttribute('targetNamespace');
      contextVar.targetPrefix = root.getAttribute('targetPrefix');
      contextVar.featureTypes = [];
    }
    this.runChildNodes(context, root);
  }

  /**
   * @private
   * @function
   * @param {Object} obj
   * @param {Document} node
   * @api stable
   */
  read_ogc_ServiceException(context, node) {
    Dialog.error(`Error en el DescribeFeatureType: ${node.textContent.trim()} `);
  }

  /**
   * @private
   * @function
   * @param {Object} obj
   * @param {Document} node
   * @api stable
   */
  read_xsd_schema(context, node) {
    this.runChildNodes(context, node);
  }

  /**
   * @private
   * @function
   * @param {Object} obj
   * @param {Document} node
   * @api stable
   */
  read_xsd_import(context, node) {
    // none
  }

  /**
   * @private
   * @function
   * @param {Object} obj
   * @param {Document} node
   * @api stable
   */
  read_xsd_complexType(context, node) {
    this.readingFeatureType_ = true;
    context.featureTypes.push({
      properties: [],
    });
    this.runChildNodes(context, node);
    this.readingFeatureType_ = false;
  }

  /**
   * @private
   * @function
   * @param {Object} obj
   * @param {Document} node
   * @api stable
   */
  read_xsd_complexContent(context, node) {
    this.runChildNodes(context, node);
  }

  /**
   * @private
   * @function
   * @param {Object} obj
   * @param {Document} node
   * @api stable
   */
  read_xsd_extension(context, node) {
    this.runChildNodes(context, node);
  }


  /**
   * @private
   * @function
   * @param {Object} obj
   * @param {Document} node
   * @api stable
   */
  read_xsd_sequence(context, node) {
    this.runChildNodes(context, node);
  }

  /**
   * @private
   * @function
   * @param {Object} obj
   * @param {Document} node
   * @api stable
   */
  read_xsd_element(context, node) {
    if (this.readingFeatureType_ === true) {
      context.featureTypes[this.featureTypeIdx_].properties.push({
        name: node.getAttribute('name'),
        maxOccurs: node.getAttribute('maxOccurs'),
        minOccurs: node.getAttribute('minOccurs'),
        nillable: node.getAttribute('nillable'),
        type: node.getAttribute('type'),
        localType: node.getAttribute('type').replace(/^\w+:/g, ''),
      });
    }
    else {
      const contextVar = context;
      contextVar.featureTypes[this.featureTypeIdx_].typeName = node.getAttribute('name');
      this.featureTypeIdx_ += 1;
    }
  }
}

/* eslint-enable */