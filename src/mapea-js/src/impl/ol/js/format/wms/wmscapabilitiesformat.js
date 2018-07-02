import OLWMSCapabilities from "ol/format/WMSCapabilities";
import OLXSD from "ol/xsd";
import OLXML from "ol/xml";
import Utils from "facade/js/utils/utils";

export default class WMSCapabilities extends OLWMSCapabilities {

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
    let minScale = OLXSD.readDecimalString(node.getAttribute('min'));
    let maxScale = OLXSD.readDecimalString(node.getAttribute('max'));

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

    let layerObject = OLXML.pushParseAndPop({}, OLWMSCapabilities.LAYER_PARSERS_, node, objectStack);

    if (!layerObject) {
      return undefined;
    }
    let queryableProp = 'queryable';
    let cascadedProp = 'cascaded';
    let opaqueProp = 'opaque';
    let noSubsetsProp = 'noSubsets';
    let fixedWidthProp = 'fixedWidth';
    let fixedHeightProp = 'fixedHeight';

    let queryable = OLXSD.readBooleanString(node.getAttribute('queryable'));
    if (queryable === undefined) {
      queryable = parentLayerObject[queryableProp];
    }
    layerObject[queryableProp] = queryable !== undefined ? queryable : false;

    let cascaded = OLXSD.readNonNegativeIntegerString(
      node.getAttribute('cascaded'));
    if (cascaded === undefined) {
      cascaded = parentLayerObject[cascadedProp];
    }
    layerObject[cascadedProp] = cascaded;

    let opaque = OLXSD.readBooleanString(node.getAttribute('opaque'));
    if (opaque === undefined) {
      opaque = parentLayerObject[opaqueProp];
    }
    layerObject[opaqueProp] = opaque !== undefined ? opaque : false;

    let noSubsets = OLXSD.readBooleanString(node.getAttribute('noSubsets'));
    if (noSubsets === undefined) {
      noSubsets = parentLayerObject[noSubsetsProp];
    }
    layerObject[noSubsetsProp] = noSubsets !== undefined ? noSubsets : false;

    let fixedWidth = OLXSD.readDecimalString(node.getAttribute('fixedWidth'));
    if (!fixedWidth) {
      fixedWidth = parentLayerObject[fixedWidthProp];
    }
    layerObject[fixedWidthProp] = fixedWidth;

    let fixedHeight = OLXSD.readDecimalString(node.getAttribute('fixedHeight'));
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
        OLXSD.readDecimalString(node.getAttribute('minx')),
        OLXSD.readDecimalString(node.getAttribute('miny')),
        OLXSD.readDecimalString(node.getAttribute('maxx')),
        OLXSD.readDecimalString(node.getAttribute('maxy'))
      ];

    // CRS
    let crs = node.getAttribute('CRS');
    if (Utils.isNullOrEmpty(crs)) {
      crs = node.getAttribute('SRS');
    }

    // resolutions
    let resolutions = [
        OLXSD.readDecimalString(node.getAttribute('resx')),
        OLXSD.readDecimalString(node.getAttribute('resy'))
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
        OLXSD.readDecimalString(node.getAttribute('minx')),
        OLXSD.readDecimalString(node.getAttribute('miny')),
        OLXSD.readDecimalString(node.getAttribute('maxx')),
        OLXSD.readDecimalString(node.getAttribute('maxy'))
      ];

    return {
      'crs': 'EPSG:4326',
      'extent': extent
    };
  }

  OLWMSCapabilities.LAYER_PARSERS_ = OLXML.makeStructureNS(OLWMSCapabilities.NAMESPACE_URIS_, {
    'Name': OLXML.makeObjectPropertySetter(OLXSD.readString),
    'Title': OLXML.makeObjectPropertySetter(OLXSD.readString),
    'Abstract': OLXML.makeObjectPropertySetter(OLXSD.readString),
    'KeywordList': OLXML.makeObjectPropertySetter(OLWMSCapabilities.readKeywordList_),
    'CRS': OLXML.makeObjectPropertyPusher(OLXSD.readString),
    'SRS': OLXML.makeObjectPropertyPusher(OLXSD.readString),
    'EX_GeographicBoundingBox': OLXML.makeObjectPropertySetter(OLWMSCapabilities.readEXGeographicBoundingBox_),
    'BoundingBox': OLXML.makeObjectPropertyPusher(WMSCapabilities.readBoundingBox_),
    'LatLonBoundingBox': OLXML.makeObjectPropertyPusher(WMSCapabilities.readLatLonBoundingBox_),
    'Dimension': OLXML.makeObjectPropertyPusher(OLWMSCapabilities.readDimension_),
    'Attribution': OLXML.makeObjectPropertySetter(OLWMSCapabilities.readAttribution_),
    'AuthorityURL': OLXML.makeObjectPropertyPusher(OLWMSCapabilities.readAuthorityURL_),
    'Identifier': OLXML.makeObjectPropertyPusher(OLXSD.readString),
    'MetadataURL': OLXML.makeObjectPropertyPusher(OLWMSCapabilities.readMetadataURL_),
    'DataURL': OLXML.makeObjectPropertyPusher(OLWMSCapabilities.readFormatOnlineresource_),
    'FeatureListURL': OLXML.makeObjectPropertyPusher(OLWMSCapabilities.readFormatOnlineresource_),
    'Style': OLXML.makeObjectPropertyPusher(OLWMSCapabilities.readStyle_),
    'MinScaleDenominator': OLXML.makeObjectPropertySetter(OLXSD.readDecimal),
    'MaxScaleDenominator': OLXML.makeObjectPropertySetter(OLXSD.readDecimal),
    'Layer': OLXML.makeObjectPropertyPusher(WMSCapabilities.readLayer_),
    'ScaleHint': OLXML.makeObjectPropertyPusher(WMSCapabilities.readScaleHint_)
  });
}
