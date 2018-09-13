/**
 * @module M/impl/format/wfs/DescribeFeatureTypeXML
 */
import Dialog from 'M/dialog';
import XML from '../XML';
/**
 * @classdesc
 * @api
 */
class DescribeFeatureTypeXML extends XML {
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
    this.readingFeatureType = false;

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
  readRoot(context, node) {
    const root = node.documentElement;

    if (/ServiceExceptionReport/i.test(root.localName)) {
      this.serviceException_ = true;
    } else {
      this.rootPrefix = root.prefix;
      const contextVar = context;
      contextVar.elementFormDefault = root.getAttribute('elementFormDefault');
      contextVar.targetNamespace = root.getAttribute('targetNamespace');
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
  readogcServiceException(context, node) {
    Dialog.error(`Error en el DescribeFeatureType: ${node.textContent.trim()} `);
  }

  /**
   * @private
   * @function
   * @param {Object} obj
   * @param {Document} node
   * @api stable
   */
  readxsdschema(context, node) {
    this.runChildNodes(context, node);
  }

  /**
   * @private
   * @function
   * @param {Object} obj
   * @param {Document} node
   * @api stable
   */
  readxsdimport(context, node) {
    // none
  }

  /**
   * @private
   * @function
   * @param {Object} obj
   * @param {Document} node
   * @api stable
   */
  readxsdcomplexType(context, node) {
    this.readingFeatureType = true;
    context.featureTypes.push({
      properties: [],
    });
    this.runChildNodes(context, node);
    this.readingFeatureType = false;
  }

  /**
   * @private
   * @function
   * @param {Object} obj
   * @param {Document} node
   * @api stable
   */
  readxsdcomplexContent(context, node) {
    this.runChildNodes(context, node);
  }

  /**
   * @private
   * @function
   * @param {Object} obj
   * @param {Document} node
   * @api stable
   */
  readxsdextension(context, node) {
    this.runChildNodes(context, node);
  }


  /**
   * @private
   * @function
   * @param {Object} obj
   * @param {Document} node
   * @api stable
   */
  readxsdsequence(context, node) {
    this.runChildNodes(context, node);
  }

  /**
   * @private
   * @function
   * @param {Object} obj
   * @param {Document} node
   * @api stable
   */
  readxsdelement(context, node) {
    if (this.readingFeatureType === true) {
      context.featureTypes[this.featureTypeIdx_].properties.push({
        name: node.getAttribute('name'),
        maxOccurs: node.getAttribute('maxOccurs'),
        minOccurs: node.getAttribute('minOccurs'),
        nillable: node.getAttribute('nillable'),
        type: node.getAttribute('type'),
        localType: node.getAttribute('type').replace(/^\w+:/g, ''),
      });
    } else {
      const contextVar = context;
      contextVar.featureTypes[this.featureTypeIdx_].typeName = node.getAttribute('name');
      this.featureTypeIdx_ += 1;
    }
  }
}

export default DescribeFeatureTypeXML;
