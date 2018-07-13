import Utils from "facade/js/util/Utils";

export default class WMSCapabilities extends ol.format.WMSCapabilities {

  /**
   * @classdesc
   * Main constructor of the class. Creates a WMC formater
   *
   * @constructor
   * @param {Mx.parameters.LayerOptions} options custom options for this formater
   * @extends {ol.format.XML}
   * @api stable
   */
  constructor() {
    super();

    /**
     * @type {Number}
     */
    this.maxScale_ = Number.NEGATIVE_INFINITY;

    /**
     * @type {Number}
     */
    this.minScale_ = Number.POSITIVE_INFINITY;
  }

  /**
   * @private
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @return {Object|undefined} Layer object.
   */
  static readScaleHint_(node, objectStack) {
    let minScale = ol.xsd.readDecimalString(node.getAttribute('min'));
    let maxScale = ol.xsd.readDecimalString(node.getAttribute('max'));

    return {
      'minScale': minScale,
      'maxScale': maxScale
    };
  };

  /**
   * @private
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @return {Object|undefined} Layer object.
   */
  static readLayer_(node, objectStack) {
    let parentLayerObject = objectStack[objectStack.length - 1];

    let layerObject = ol.xml.pushParseAndPop({}, ol.format.WMSCapabilities.LAYER_PARSERS_, node, objectStack);

    if (!layerObject) {
      return undefined;
    }
    let queryableProp = 'queryable';
    let cascadedProp = 'cascaded';
    let opaqueProp = 'opaque';
    let noSubsetsProp = 'noSubsets';
    let fixedWidthProp = 'fixedWidth';
    let fixedHeightProp = 'fixedHeight';

    let queryable = ol.xsd.readBooleanString(node.getAttribute('queryable'));
    if (queryable === undefined) {
      queryable = parentLayerObject[queryableProp];
    }
    layerObject[queryableProp] = queryable !== undefined ? queryable : false;

    let cascaded = ol.xsd.readNonNegativeIntegerString(
      node.getAttribute('cascaded'));
    if (cascaded === undefined) {
      cascaded = parentLayerObject[cascadedProp];
    }
    layerObject[cascadedProp] = cascaded;

    let opaque = ol.xsd.readBooleanString(node.getAttribute('opaque'));
    if (opaque === undefined) {
      opaque = parentLayerObject[opaqueProp];
    }
    layerObject[opaqueProp] = opaque !== undefined ? opaque : false;

    let noSubsets = ol.xsd.readBooleanString(node.getAttribute('noSubsets'));
    if (noSubsets === undefined) {
      noSubsets = parentLayerObject[noSubsetsProp];
    }
    layerObject[noSubsetsProp] = noSubsets !== undefined ? noSubsets : false;

    let fixedWidth = ol.xsd.readDecimalString(node.getAttribute('fixedWidth'));
    if (!fixedWidth) {
      fixedWidth = parentLayerObject[fixedWidthProp];
    }
    layerObject[fixedWidthProp] = fixedWidth;

    let fixedHeight = ol.xsd.readDecimalString(node.getAttribute('fixedHeight'));
    if (!fixedHeight) {
      fixedHeight = parentLayerObject[fixedHeightProp];
    }
    layerObject[fixedHeightProp] = fixedHeight;

    // See 7.2.4.8
    let addKeys = ['Style', 'CRS', 'AuthorityURL'];
    addKeys.forEach(key => {
      if (key in parentLayerObject) {
        let childValue = goog.object.setIfUndefined(layerObject, key, []);
        childValue = childValue.concat(parentLayerObject[key]);
        layerObject[key] = childValue;
      }
    });

    let replaceKeys = ['EX_GeographicBoundingBox', 'BoundingBox', 'Dimension',
         'Attribution', 'MinScaleDenominator', 'MaxScaleDenominator', 'ScaleHint',
         'SRS', 'LatLonBoundingBox'];
    replaceKeys.forEach(key => {
      if (!(key in layerObject)) {
        let parentValue = parentLayerObject[key];
        layerObject[key] = parentValue;
      }
    });

    // replaces the BoundingBox by LatLonBoundinBox
    let latLonBoundingBoxProp = 'LatLonBoundingBox';
    let boundingBoxProp = 'BoundingBox';
    if (Utils.isNullOrEmpty(layerObject[boundingBoxProp]) && !Utils.isNullOrEmpty(layerObject[latLonBoundingBoxProp])) {
      layerObject[boundingBoxProp] = layerObject[latLonBoundingBoxProp];
    }

    // replaces the maxScale by ScaleHint
    let maxScaleDenominatorProp = 'MaxScaleDenominator';
    if (Utils.isNullOrEmpty(layerObject[maxScaleDenominatorProp]) && !Utils.isNullOrEmpty(layerObject.ScaleHint)) {
      layerObject[maxScaleDenominatorProp] = layerObject.ScaleHint[0].maxScale;
    }

    // replaces the minScale by ScaleHint
    let minScaleDenominatorProp = 'MinScaleDenominator';
    if (Utils.isNullOrEmpty(layerObject[minScaleDenominatorProp]) && !Utils.isNullOrEmpty(layerObject.ScaleHint)) {
      layerObject[minScaleDenominatorProp] = layerObject.ScaleHint[0].minScale;
    }
    return layerObject;
  };

  /**
   * @private
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @return {Object} Bounding box object.
   */
  static readBoundingBox_(node, objectStack) {
    let extent = [
        ol.xsd.readDecimalString(node.getAttribute('minx')),
        ol.xsd.readDecimalString(node.getAttribute('miny')),
        ol.xsd.readDecimalString(node.getAttribute('maxx')),
        ol.xsd.readDecimalString(node.getAttribute('maxy'))
      ];

    // CRS
    let crs = node.getAttribute('CRS');
    if (Utils.isNullOrEmpty(crs)) {
      crs = node.getAttribute('SRS');
    }

    // resolutions
    let resolutions = [
        ol.xsd.readDecimalString(node.getAttribute('resx')),
        ol.xsd.readDecimalString(node.getAttribute('resy'))
      ];

    return {
      'crs': crs,
      'extent': extent,
      'res': resolutions
    };
  }

  /**
   * @private
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @return {Object} Bounding box object.
   */
  static readLatLonBoundingBox_(node, objectStack) {
    // extent
    let extent = [
        ol.xsd.readDecimalString(node.getAttribute('minx')),
        ol.xsd.readDecimalString(node.getAttribute('miny')),
        ol.xsd.readDecimalString(node.getAttribute('maxx')),
        ol.xsd.readDecimalString(node.getAttribute('maxy'))
      ];

    return {
      'crs': 'EPSG:4326',
      'extent': extent
    };
  }
}

ol.format.WMSCapabilities.LAYER_PARSERS_ = ol.xml.makeStructureNS(ol.format.WMSCapabilities.NAMESPACE_URIS_, {
  'Name': ol.xml.makeObjectPropertySetter(ol.xsd.readString),
  'Title': ol.xml.makeObjectPropertySetter(ol.xsd.readString),
  'Abstract': ol.xml.makeObjectPropertySetter(ol.xsd.readString),
  'KeywordList': ol.xml.makeObjectPropertySetter(ol.format.WMSCapabilities.readKeywordList_),
  'CRS': ol.xml.makeObjectPropertyPusher(ol.xsd.readString),
  'SRS': ol.xml.makeObjectPropertyPusher(ol.xsd.readString),
  'EX_GeographicBoundingBox': ol.xml.makeObjectPropertySetter(ol.format.WMSCapabilities.readEXGeographicBoundingBox_),
  'BoundingBox': ol.xml.makeObjectPropertyPusher(WMSCapabilities.readBoundingBox_),
  'LatLonBoundingBox': ol.xml.makeObjectPropertyPusher(WMSCapabilities.readLatLonBoundingBox_),
  'Dimension': ol.xml.makeObjectPropertyPusher(ol.format.WMSCapabilities.readDimension_),
  'Attribution': ol.xml.makeObjectPropertySetter(ol.format.WMSCapabilities.readAttribution_),
  'AuthorityURL': ol.xml.makeObjectPropertyPusher(ol.format.WMSCapabilities.readAuthorityURL_),
  'Identifier': ol.xml.makeObjectPropertyPusher(ol.xsd.readString),
  'MetadataURL': ol.xml.makeObjectPropertyPusher(ol.format.WMSCapabilities.readMetadataURL_),
  'DataURL': ol.xml.makeObjectPropertyPusher(ol.format.WMSCapabilities.readFormatOnlineresource_),
  'FeatureListURL': ol.xml.makeObjectPropertyPusher(ol.format.WMSCapabilities.readFormatOnlineresource_),
  'Style': ol.xml.makeObjectPropertyPusher(ol.format.WMSCapabilities.readStyle_),
  'MinScaleDenominator': ol.xml.makeObjectPropertySetter(ol.xsd.readDecimal),
  'MaxScaleDenominator': ol.xml.makeObjectPropertySetter(ol.xsd.readDecimal),
  'Layer': ol.xml.makeObjectPropertyPusher(WMSCapabilities.readLayer_),
  'ScaleHint': ol.xml.makeObjectPropertyPusher(WMSCapabilities.readScaleHint_)
});
