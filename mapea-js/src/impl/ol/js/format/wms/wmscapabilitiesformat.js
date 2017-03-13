goog.provide('M.impl.format.WMSCapabilities');

goog.require('ol.format.WMSCapabilities');

(function () {

   /**
    * @classdesc
    * Main constructor of the class. Creates a WMC formater
    *
    * @constructor
    * @param {Mx.parameters.LayerOptions} options custom options for this formater
    * @extends {ol.format.XML}
    * @api stable
    */
   M.impl.format.WMSCapabilities = function () {
      /**
       * @type {Number}
       */
      this.maxScale_ = Number.NEGATIVE_INFINITY;

      /**
       * @type {Number}
       */
      this.minScale_ = Number.POSITIVE_INFINITY;

      goog.base(this);
   };
   goog.inherits(M.impl.format.WMSCapabilities, ol.format.WMSCapabilities);

   /**
    * @private
    * @param {Node} node Node.
    * @param {Array.<*>} objectStack Object stack.
    * @return {Object|undefined} Layer object.
    */
   M.impl.format.WMSCapabilities.readScaleHint_ = function (node, objectStack) {
      goog.asserts.assert(node.nodeType == goog.dom.NodeType.ELEMENT,
         'node.nodeType should be ELEMENT');
      goog.asserts.assert(node.localName == 'ScaleHint',
         'localName should be ScaleHint');

      var minScale = ol.format.XSD.readDecimalString(node.getAttribute('min'));
      var maxScale = ol.format.XSD.readDecimalString(node.getAttribute('max'));

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
   M.impl.format.WMSCapabilities.readLayer_ = function (node, objectStack) {
      goog.asserts.assert(node.nodeType == goog.dom.NodeType.ELEMENT,
         'node.nodeType should be ELEMENT');
      goog.asserts.assert(node.localName == 'Layer', 'localName should be Layer');
      var parentLayerObject = /**  @type {Object.<string,*>} */
         (objectStack[objectStack.length - 1]);

      var layerObject = /**  @type {Object.<string,*>} */ (ol.xml.pushParseAndPop({}, ol.format.WMSCapabilities.LAYER_PARSERS_, node, objectStack));

      if (!layerObject) {
         return undefined;
      }
      var queryableProp = 'queryable';
      var cascadedProp = 'cascaded';
      var opaqueProp = 'opaque';
      var noSubsetsProp = 'noSubsets';
      var fixedWidthProp = 'fixedWidth';
      var fixedHeightProp = 'fixedHeight';

      var queryable =
         ol.format.XSD.readBooleanString(node.getAttribute('queryable'));
      if (queryable === undefined) {
         queryable = parentLayerObject[queryableProp];
      }
      layerObject[queryableProp] = queryable !== undefined ? queryable : false;

      var cascaded = ol.format.XSD.readNonNegativeIntegerString(
         node.getAttribute('cascaded'));
      if (cascaded === undefined) {
         cascaded = parentLayerObject[cascadedProp];
      }
      layerObject[cascadedProp] = cascaded;

      var opaque = ol.format.XSD.readBooleanString(node.getAttribute('opaque'));
      if (opaque === undefined) {
         opaque = parentLayerObject[opaqueProp];
      }
      layerObject[opaqueProp] = opaque !== undefined ? opaque : false;

      var noSubsets =
         ol.format.XSD.readBooleanString(node.getAttribute('noSubsets'));
      if (noSubsets === undefined) {
         noSubsets = parentLayerObject[noSubsetsProp];
      }
      layerObject[noSubsetsProp] = noSubsets !== undefined ? noSubsets : false;

      var fixedWidth =
         ol.format.XSD.readDecimalString(node.getAttribute('fixedWidth'));
      if (!fixedWidth) {
         fixedWidth = parentLayerObject[fixedWidthProp];
      }
      layerObject[fixedWidthProp] = fixedWidth;

      var fixedHeight =
         ol.format.XSD.readDecimalString(node.getAttribute('fixedHeight'));
      if (!fixedHeight) {
         fixedHeight = parentLayerObject[fixedHeightProp];
      }
      layerObject[fixedHeightProp] = fixedHeight;

      // See 7.2.4.8
      var addKeys = ['Style', 'CRS', 'AuthorityURL'];
      addKeys.forEach(function (key) {
         if (key in parentLayerObject) {
            var childValue = goog.object.setIfUndefined(layerObject, key, []);
            childValue = childValue.concat(parentLayerObject[key]);
            layerObject[key] = childValue;
         }
      });

      var replaceKeys = ['EX_GeographicBoundingBox', 'BoundingBox', 'Dimension',
         'Attribution', 'MinScaleDenominator', 'MaxScaleDenominator', 'ScaleHint',
         'SRS', 'LatLonBoundingBox'];
      replaceKeys.forEach(function (key) {
         if (!(key in layerObject)) {
            var parentValue = parentLayerObject[key];
            layerObject[key] = parentValue;
         }
      });

      // replaces the BoundingBox by LatLonBoundinBox
      var latLonBoundingBoxProp = 'LatLonBoundingBox';
      var boundingBoxProp = 'BoundingBox';
      if (M.utils.isNullOrEmpty(layerObject[boundingBoxProp]) &&
         !M.utils.isNullOrEmpty(layerObject[latLonBoundingBoxProp])) {
         layerObject[boundingBoxProp] = layerObject[latLonBoundingBoxProp];
      }

      // replaces the maxScale by ScaleHint
      var maxScaleDenominatorProp = 'MaxScaleDenominator';
      if (M.utils.isNullOrEmpty(layerObject[maxScaleDenominatorProp]) &&
         !M.utils.isNullOrEmpty(layerObject.ScaleHint)) {
         layerObject[maxScaleDenominatorProp] = layerObject.ScaleHint[0].maxScale;
      }

      // replaces the minScale by ScaleHint
      var minScaleDenominatorProp = 'MinScaleDenominator';
      if (M.utils.isNullOrEmpty(layerObject[minScaleDenominatorProp]) &&
         !M.utils.isNullOrEmpty(layerObject.ScaleHint)) {
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
   M.impl.format.WMSCapabilities.readBoundingBox_ = function (node, objectStack) {
      goog.asserts.assert(node.nodeType == goog.dom.NodeType.ELEMENT,
         'node.nodeType should be ELEMENT');
      goog.asserts.assert(node.localName == 'BoundingBox',
         'localName should be BoundingBox');

      // extent
      var extent = [
        ol.format.XSD.readDecimalString(node.getAttribute('minx')),
        ol.format.XSD.readDecimalString(node.getAttribute('miny')),
        ol.format.XSD.readDecimalString(node.getAttribute('maxx')),
        ol.format.XSD.readDecimalString(node.getAttribute('maxy'))
      ];

      // CRS
      var crs = node.getAttribute('CRS');
      if (M.utils.isNullOrEmpty(crs)) {
         crs = node.getAttribute('SRS');
      }

      // resolutions
      var resolutions = [
        ol.format.XSD.readDecimalString(node.getAttribute('resx')),
        ol.format.XSD.readDecimalString(node.getAttribute('resy'))
      ];

      return {
         'crs': crs,
         'extent': extent,
         'res': resolutions
      };
   };

   /**
    * @private
    * @param {Node} node Node.
    * @param {Array.<*>} objectStack Object stack.
    * @return {Object} Bounding box object.
    */
   M.impl.format.WMSCapabilities.readLatLonBoundingBox_ = function (node, objectStack) {
      goog.asserts.assert(node.nodeType == goog.dom.NodeType.ELEMENT,
         'node.nodeType should be ELEMENT');
      goog.asserts.assert(node.localName == 'LatLonBoundingBox',
         'localName should be BoundingBox');

      // extent
      var extent = [
        ol.format.XSD.readDecimalString(node.getAttribute('minx')),
        ol.format.XSD.readDecimalString(node.getAttribute('miny')),
        ol.format.XSD.readDecimalString(node.getAttribute('maxx')),
        ol.format.XSD.readDecimalString(node.getAttribute('maxy'))
      ];

      return {
         'crs': 'EPSG:4326',
         'extent': extent
      };
   };

   ol.format.WMSCapabilities.LAYER_PARSERS_ = ol.xml.makeStructureNS(
      ol.format.WMSCapabilities.NAMESPACE_URIS_, {
         'Name': ol.xml.makeObjectPropertySetter(ol.format.XSD.readString),
         'Title': ol.xml.makeObjectPropertySetter(ol.format.XSD.readString),
         'Abstract': ol.xml.makeObjectPropertySetter(ol.format.XSD.readString),
         'KeywordList': ol.xml.makeObjectPropertySetter(
            ol.format.WMSCapabilities.readKeywordList_),
         'CRS': ol.xml.makeObjectPropertyPusher(ol.format.XSD.readString),
         'SRS': ol.xml.makeObjectPropertyPusher(ol.format.XSD.readString),
         'EX_GeographicBoundingBox': ol.xml.makeObjectPropertySetter(
            ol.format.WMSCapabilities.readEXGeographicBoundingBox_),
         'BoundingBox': ol.xml.makeObjectPropertyPusher(
            M.impl.format.WMSCapabilities.readBoundingBox_),
         'LatLonBoundingBox': ol.xml.makeObjectPropertyPusher(
            M.impl.format.WMSCapabilities.readLatLonBoundingBox_),
         'Dimension': ol.xml.makeObjectPropertyPusher(
            ol.format.WMSCapabilities.readDimension_),
         'Attribution': ol.xml.makeObjectPropertySetter(
            ol.format.WMSCapabilities.readAttribution_),
         'AuthorityURL': ol.xml.makeObjectPropertyPusher(
            ol.format.WMSCapabilities.readAuthorityURL_),
         'Identifier': ol.xml.makeObjectPropertyPusher(ol.format.XSD.readString),
         'MetadataURL': ol.xml.makeObjectPropertyPusher(
            ol.format.WMSCapabilities.readMetadataURL_),
         'DataURL': ol.xml.makeObjectPropertyPusher(
            ol.format.WMSCapabilities.readFormatOnlineresource_),
         'FeatureListURL': ol.xml.makeObjectPropertyPusher(
            ol.format.WMSCapabilities.readFormatOnlineresource_),
         'Style': ol.xml.makeObjectPropertyPusher(
            ol.format.WMSCapabilities.readStyle_),
         'MinScaleDenominator': ol.xml.makeObjectPropertySetter(
            ol.format.XSD.readDecimal),
         'MaxScaleDenominator': ol.xml.makeObjectPropertySetter(
            ol.format.XSD.readDecimal),
         'Layer': ol.xml.makeObjectPropertyPusher(
            M.impl.format.WMSCapabilities.readLayer_),
         'ScaleHint': ol.xml.makeObjectPropertyPusher(
            M.impl.format.WMSCapabilities.readScaleHint_)
      });
})();