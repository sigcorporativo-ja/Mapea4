goog.provide('M.impl.format.KML');

goog.require('M.impl.style.Icon');
goog.require('ol.format.KML');

/**
 * @classdesc
 * Feature format for reading and writing data in the KML format.
 *
 * @constructor
 * @extends {ol.format.KML}
 * @param {olx.format.KMLOptions=} opt_options Options.
 * @api stable
 */
M.impl.format.KML = function (opt_options) {

   var options = opt_options ? opt_options : {};

   // anonymous by default
   if (!options.crossOriginIcons_) {
      options.crossOriginIcons_ = 'anonymous';
   }

   goog.base(this);

   /**
    * @private
    * @type {Object}
    */
   this.screenOverlay_ = null;
};
goog.inherits(M.impl.format.KML, ol.format.KML);

/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 * @return {Object} Icon object.
 */
M.impl.format.KML.readOverlayXY_ = function (node, objectStack) {
   goog.asserts.assert(node.nodeType == goog.dom.NodeType.ELEMENT,
      'node.nodeType should be ELEMENT');
   goog.asserts.assert(node.localName == 'overlayXY', 'localName should be overlayXY');

   var overlayObject = M.impl.format.KML.readOverlay_(node);
   if (overlayObject) {
      return overlayObject;
   }
   else {
      return null;
   }
};

/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 * @return {Object} Icon object.
 */
M.impl.format.KML.readScreenXY_ = function (node, objectStack) {
   goog.asserts.assert(node.nodeType == goog.dom.NodeType.ELEMENT,
      'node.nodeType should be ELEMENT');
   goog.asserts.assert(node.localName == 'screenXY', 'localName should be screenXY');
   var screenObject = M.impl.format.KML.readOverlay_(node);
   if (screenObject) {
      return screenObject;
   }
   else {
      return null;
   }
};

/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 * @return {Array.<ol.style.Style>} Style.
 */
M.impl.format.KML.readStyle_ = function (node, objectStack) {
   goog.asserts.assert(node.nodeType == goog.dom.NodeType.ELEMENT,
      'node.nodeType should be ELEMENT');
   goog.asserts.assert(node.localName == 'Style', 'localName should be Style');
   var styleObject = ol.xml.pushParseAndPop({}, M.impl.format.KML.STYLE_PARSERS_, node, objectStack);
   if (!styleObject) {
      return null;
   }
   var fillStyle = /** @type {ol.style.Fill} */
      ('fillStyle' in styleObject ?
         styleObject['fillStyle'] : ol.format.KML.DEFAULT_FILL_STYLE_);
   var fill = /** @type {boolean|undefined} */ (styleObject['fill']);
   if (fill !== undefined && !fill) {
      fillStyle = null;
   }
   var imageStyle = /** @type {ol.style.Image} */
      ('imageStyle' in styleObject ?
         styleObject['imageStyle'] : ol.format.KML.DEFAULT_IMAGE_STYLE_);
   var textStyle = /** @type {ol.style.Text} */
      ('textStyle' in styleObject ?
         styleObject['textStyle'] : ol.format.KML.DEFAULT_TEXT_STYLE_);
   var strokeStyle = /** @type {ol.style.Stroke} */
      ('strokeStyle' in styleObject ?
         styleObject['strokeStyle'] : ol.format.KML.DEFAULT_STROKE_STYLE_);
   var outline = /** @type {boolean|undefined} */
      (styleObject['outline']);
   if (outline !== undefined && !outline) {
      strokeStyle = null;
   }
   return [new ol.style.Style({
      fill: fillStyle,
      image: imageStyle,
      stroke: strokeStyle,
      text: textStyle,
      zIndex: undefined // FIXME
   })];
};

/**
 * @const
 * @type {Object.<string, Object.<string, ol.xml.Parser>>}
 * @private
 */
ol.format.KML.STYLE_PARSERS_ = ol.xml.makeStructureNS(
   ol.format.KML.NAMESPACE_URIS_, {
      'IconStyle': M.impl.format.KML.IconStyleParser_,
      'LabelStyle': ol.format.KML.LabelStyleParser_,
      'LineStyle': ol.format.KML.LineStyleParser_,
      'PolyStyle': ol.format.KML.PolyStyleParser_
   });

/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 * @return {Object} Icon object.
 */
M.impl.format.KML.readRotationXY_ = function (node, objectStack) {
   goog.asserts.assert(node.nodeType == goog.dom.NodeType.ELEMENT,
      'node.nodeType should be ELEMENT');
   goog.asserts.assert(node.localName == 'rotationXY', 'localName should be rotationXY');
   var rotationObject = M.impl.format.KML.readOverlay_(node);
   if (rotationObject) {
      return rotationObject;
   }
   else {
      return null;
   }
};

/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 * @return {Object} Icon object.
 */
M.impl.format.KML.readSize_ = function (node, objectStack) {
   goog.asserts.assert(node.nodeType == goog.dom.NodeType.ELEMENT,
      'node.nodeType should be ELEMENT');
   goog.asserts.assert(node.localName == 'size', 'localName should be size');
   var sizeObject = M.impl.format.KML.readOverlay_(node);
   if (sizeObject) {
      return sizeObject;
   }
   else {
      return null;
   }
};

/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 */
M.impl.format.KML.prototype.readSharedStyle_ = function (node, objectStack) {
   goog.asserts.assert(node.nodeType == goog.dom.NodeType.ELEMENT,
      'node.nodeType should be ELEMENT');
   goog.asserts.assert(node.localName == 'Style', 'localName should be Style');
   var id = node.getAttribute('id');
   if (id !== null) {
      var style = M.impl.format.KML.readStyle_(node, objectStack);
      if (style) {
         var styleUri;
         if (node.baseURI) {
            styleUri = goog.Uri.resolve(node.baseURI, '#' + id).toString();
         }
         else {
            styleUri = '#' + id;
         }
         this.sharedStyles_[styleUri] = style;
      }
   }
};

/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 */
M.impl.format.KML.PairDataParser_ = function (node, objectStack) {
   goog.asserts.assert(node.nodeType == goog.dom.NodeType.ELEMENT,
      'node.nodeType should be ELEMENT');
   goog.asserts.assert(node.localName == 'Pair', 'localName should be Pair');
   var pairObject = ol.xml.pushParseAndPop({}, M.impl.format.KML.PAIR_PARSERS_, node, objectStack);
   if (!pairObject) {
      return;
   }
   var key = /** @type {string|undefined} */
      (pairObject['key']);
   if (key && key == 'normal') {
      var styleUrl = /** @type {string|undefined} */
         (pairObject['styleUrl']);
      if (styleUrl) {
         objectStack[objectStack.length - 1] = styleUrl;
      }
      var Style = /** @type {ol.style.Style} */
         (pairObject['Style']);
      if (Style) {
         objectStack[objectStack.length - 1] = Style;
      }
   }
};

/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 * @return {Array.<ol.style.Style>|string|undefined} StyleMap.
 */
M.impl.format.KML.readStyleMapValue_ = function (node, objectStack) {
   return ol.xml.pushParseAndPop(
      /** @type {Array.<ol.style.Style>|string|undefined} */
      (undefined),
      M.impl.format.KML.STYLE_MAP_PARSERS_, node, objectStack);
};

/**
 *
 * PATCH: sets the crossOrigin for KML icons to void
 * CORS exceptions
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 */
M.impl.format.KML.IconStyleParser_ = function (node, objectStack) {
   goog.asserts.assert(node.nodeType == goog.dom.NodeType.ELEMENT,
      'node.nodeType should be an ELEMENT');
   goog.asserts.assert(node.localName == 'IconStyle',
      'localName should be IconStyle');
   // FIXME refreshMode
   // FIXME refreshInterval
   // FIXME viewRefreshTime
   // FIXME viewBoundScale
   // FIXME viewFormat
   // FIXME httpQuery
   var object = ol.xml.pushParseAndPop({}, ol.format.KML.ICON_STYLE_PARSERS_, node, objectStack);
   if (!object) {
      return;
   }
   var styleObject = /** @type {Object} */ (objectStack[objectStack.length - 1]);
   goog.asserts.assert(goog.isObject(styleObject),
      'styleObject should be an Object');
   var IconObject = 'Icon' in object ? object['Icon'] : {};
   var src;
   var href = /** @type {string|undefined} */
      (IconObject['href']);
   if (href) {
      src = href;
   }
   else {
      src = ol.format.KML.DEFAULT_IMAGE_STYLE_SRC_;
   }
   var anchor, anchorXUnits, anchorYUnits;
   var hotSpot = /** @type {ol.format.KMLVec2_|undefined} */
      (object['hotSpot']);
   if (hotSpot) {
      anchor = [hotSpot.x, hotSpot.y];
      anchorXUnits = hotSpot.xunits;
      anchorYUnits = hotSpot.yunits;
   }
   else if (src === ol.format.KML.DEFAULT_IMAGE_STYLE_SRC_) {
      anchor = ol.format.KML.DEFAULT_IMAGE_STYLE_ANCHOR_;
      anchorXUnits = ol.format.KML.DEFAULT_IMAGE_STYLE_ANCHOR_X_UNITS_;
      anchorYUnits = ol.format.KML.DEFAULT_IMAGE_STYLE_ANCHOR_Y_UNITS_;
   }
   else if (/^http:\/\/maps\.(?:google|gstatic)\.com\//.test(src)) {
      anchor = [0.5, 0];
      anchorXUnits = ol.style.IconAnchorUnits.FRACTION;
      anchorYUnits = ol.style.IconAnchorUnits.FRACTION;
   }

   var offset;
   var x = /** @type {number|undefined} */
      (IconObject['x']);
   var y = /** @type {number|undefined} */
      (IconObject['y']);
   if (x !== undefined && y !== undefined) {
      offset = [x, y];
   }

   var size;
   var w = /** @type {number|undefined} */
      (IconObject['w']);
   var h = /** @type {number|undefined} */
      (IconObject['h']);
   if (w !== undefined && h !== undefined) {
      size = [w, h];
   }

   var rotation;
   var heading = /** @type {number} */
      (object['heading']);
   if (heading !== undefined) {
      rotation = ol.math.toRadians(heading);
   }

   var scale = /** @type {number|undefined} */
      (object['scale']);
   if (src == ol.format.KML.DEFAULT_IMAGE_STYLE_SRC_) {
      size = ol.format.KML.DEFAULT_IMAGE_STYLE_SIZE_;
      if (scale === undefined) {
         scale = ol.format.KML.DEFAULT_IMAGE_SCALE_MULTIPLIER_;
      }
   }

   var imageStyle = new M.impl.style.Icon({
      anchor: anchor,
      anchorOrigin: ol.style.IconOrigin.BOTTOM_LEFT,
      anchorXUnits: anchorXUnits,
      anchorYUnits: anchorYUnits,
      crossOrigin: null, // PATCH: before 'anonymous'
      offset: offset,
      offsetOrigin: ol.style.IconOrigin.BOTTOM_LEFT,
      rotation: rotation,
      scale: scale,
      size: size,
      src: src
   });
   styleObject['imageStyle'] = imageStyle;
};

/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 * @return {ol.Feature|undefined} Feature.
 */
M.impl.format.KML.prototype.readPlacemark_ = function (node, objectStack) {
   goog.asserts.assert(node.nodeType == goog.dom.NodeType.ELEMENT,
      'node.nodeType should be ELEMENT');
   goog.asserts.assert(node.localName == 'Placemark',
      'localName should be Placemark');
   var object = ol.xml.pushParseAndPop({
         'geometry': null
      },
      M.impl.format.KML.PLACEMARK_PARSERS_, node, objectStack);
   if (!object) {
      return undefined;
   }
   var feature = new ol.Feature();
   var id = node.getAttribute('id');
   if (id !== null) {
      feature.setId(id);
   }
   var options = /** @type {olx.format.ReadOptions} */ (objectStack[0]);

   var geometry = object['geometry'];
   if (geometry) {
      ol.format.Feature.transformWithOptions(geometry, false, options);
   }
   feature.setGeometry(geometry);
   delete object['geometry'];

   if (this.extractStyles_) {
      var style = object['Style'];
      var styleUrl = object['styleUrl'];
      var styleFunction = ol.format.KML.createFeatureStyleFunction_(
         style, styleUrl, this.defaultStyle_, this.sharedStyles_,
         this.showPointNames_);
      feature.setStyle(styleFunction);
   }
   delete object['Style'];
   // we do not remove the styleUrl property from the object, so it
   // gets stored on feature when setProperties is called

   feature.setProperties(object);

   // fixes #3: decodes name to remove HTML entities
   feature.set("name", M.utils.decodeHtml(feature.get("name")));

   return feature;
};

/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 */
M.impl.format.KML.PlacemarkStyleMapParser_ = function (node, objectStack) {
   goog.asserts.assert(node.nodeType == goog.dom.NodeType.ELEMENT,
      'node.nodeType should be ELEMENT');
   goog.asserts.assert(node.localName == 'StyleMap',
      'localName should be StyleMap');
   var styleMapValue = M.impl.format.KML.readStyleMapValue_(node, objectStack);
   if (!styleMapValue) {
      return;
   }
   var placemarkObject = objectStack[objectStack.length - 1];
   goog.asserts.assert(goog.isObject(placemarkObject),
      'placemarkObject should be an Object');
   if (goog.isArray(styleMapValue)) {
      placemarkObject['Style'] = styleMapValue;
   }
   else if (goog.isString(styleMapValue)) {
      placemarkObject['styleUrl'] = styleMapValue;
   }
   else {
      goog.asserts.fail('styleMapValue has an unknown type');
   }
};

/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 */
M.impl.format.KML.prototype.readSharedStyleMap_ = function (node, objectStack) {
   goog.asserts.assert(node.nodeType == goog.dom.NodeType.ELEMENT,
      'node.nodeType should be ELEMENT');
   goog.asserts.assert(node.localName == 'StyleMap',
      'localName should be StyleMap');
   var id = node.getAttribute('id');
   if (id === null) {
      return;
   }
   var styleMapValue = M.impl.format.KML.readStyleMapValue_(node, objectStack);
   if (!styleMapValue) {
      return;
   }
   var styleUri;
   if (node.baseURI) {
      styleUri = goog.Uri.resolve(node.baseURI, '#' + id).toString();
   }
   else {
      styleUri = '#' + id;
   }
   this.sharedStyles_[styleUri] = styleMapValue;
};

/**
 * @const
 * @type {Object.<string, Object.<string, ol.xml.Parser>>}
 * @private
 */
M.impl.format.KML.OVERLAY_PARSERS_ = ol.xml.makeStructureNS(
   ol.format.KML.GX_NAMESPACE_URIS_, {
      'x': ol.xml.makeObjectPropertyPusher(ol.format.XSD.readDecimal),
      'y': ol.xml.makeObjectPropertySetter(ol.format.XSD.readDecimal),
      'xunits': ol.xml.makeObjectPropertySetter(ol.format.XSD.readDecimal),
      'yunits': ol.xml.makeObjectPropertySetter(ol.format.XSD.readDecimal)
   });

/**
 * @const
 * @type {Object.<string, Object.<string, ol.xml.Parser>>}
 * @private
 */
M.impl.format.KML.SCREEN_OVERLAY_PARSERS_ = ol.xml.makeStructureNS(
   ol.format.KML.NAMESPACE_URIS_, {
      'Icon': ol.xml.makeObjectPropertySetter(ol.format.KML.readIcon_),
      'overlayXY': ol.xml.makeObjectPropertySetter(M.impl.format.KML.readOverlayXY_),
      'screenXY': ol.xml.makeObjectPropertySetter(M.impl.format.KML.readScreenXY_),
      'rotationXY': ol.xml.makeObjectPropertySetter(M.impl.format.KML.readRotationXY_),
      'size': ol.xml.makeObjectPropertySetter(M.impl.format.KML.readSize_)
   });


/**
 * @const
 * @type {Object.<string, Object.<string, ol.xml.Parser>>}
 * @private
 */
M.impl.format.KML.STYLE_PARSERS_ = ol.xml.makeStructureNS(
   ol.format.KML.NAMESPACE_URIS_, {
      'IconStyle': M.impl.format.KML.IconStyleParser_,
      'LabelStyle': ol.format.KML.LabelStyleParser_,
      'LineStyle': ol.format.KML.LineStyleParser_,
      'PolyStyle': ol.format.KML.PolyStyleParser_
   });

/**
 * @const
 * @type {Object.<string, Object.<string, ol.xml.Parser>>}
 * @private
 */
M.impl.format.KML.PAIR_PARSERS_ = ol.xml.makeStructureNS(
   ol.format.KML.NAMESPACE_URIS_, {
      'Style': ol.xml.makeObjectPropertySetter(M.impl.format.KML.readStyle_),
      'key': ol.xml.makeObjectPropertySetter(ol.format.XSD.readString),
      'styleUrl': ol.xml.makeObjectPropertySetter(ol.format.KML.readStyleUrl_)
   });

/**
 * @const
 * @type {Object.<string, Object.<string, ol.xml.Parser>>}
 * @private
 */
M.impl.format.KML.PLACEMARK_PARSERS_ = ol.xml.makeStructureNS(
   ol.format.KML.NAMESPACE_URIS_, {
      'ExtendedData': ol.format.KML.ExtendedDataParser_,
      'MultiGeometry': ol.xml.makeObjectPropertySetter(
         ol.format.KML.readMultiGeometry_, 'geometry'),
      'LineString': ol.xml.makeObjectPropertySetter(
         ol.format.KML.readLineString_, 'geometry'),
      'LinearRing': ol.xml.makeObjectPropertySetter(
         ol.format.KML.readLinearRing_, 'geometry'),
      'Point': ol.xml.makeObjectPropertySetter(
         ol.format.KML.readPoint_, 'geometry'),
      'Polygon': ol.xml.makeObjectPropertySetter(
         ol.format.KML.readPolygon_, 'geometry'),
      'Style': ol.xml.makeObjectPropertySetter(M.impl.format.KML.readStyle_),
      'StyleMap': M.impl.format.KML.PlacemarkStyleMapParser_,
      'address': ol.xml.makeObjectPropertySetter(ol.format.XSD.readString),
      'description': ol.xml.makeObjectPropertySetter(ol.format.XSD.readString),
      'name': ol.xml.makeObjectPropertySetter(ol.format.XSD.readString),
      'open': ol.xml.makeObjectPropertySetter(ol.format.XSD.readBoolean),
      'phoneNumber': ol.xml.makeObjectPropertySetter(ol.format.XSD.readString),
      'styleUrl': ol.xml.makeObjectPropertySetter(ol.format.KML.readURI_),
      'visibility': ol.xml.makeObjectPropertySetter(ol.format.XSD.readBoolean)
   }, ol.xml.makeStructureNS(
      ol.format.KML.GX_NAMESPACE_URIS_, {
         'MultiTrack': ol.xml.makeObjectPropertySetter(
            ol.format.KML.readGxMultiTrack_, 'geometry'),
         'Track': ol.xml.makeObjectPropertySetter(
            ol.format.KML.readGxTrack_, 'geometry')
      }
   ));

/**
 * @const
 * @type {Object.<string, Object.<string, ol.xml.Parser>>}
 * @private
 */
M.impl.format.KML.STYLE_MAP_PARSERS_ = ol.xml.makeStructureNS(
   ol.format.KML.NAMESPACE_URIS_, {
      'Pair': M.impl.format.KML.PairDataParser_
   });

/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 */
M.impl.format.KML.readOverlay_ = function (node, objectStack) {
   // x, y
   var x = ol.format.XSD.readDecimalString(node.getAttribute('x'));
   var y = ol.format.XSD.readDecimalString(node.getAttribute('y'));

   // xunits
   var xunits = node.getAttribute('xunits');

   // yunits
   var yunits = node.getAttribute('yunits');

   return {
      'x': x,
      'y': y,
      'xunits': xunits,
      'yunits': yunits
   };
};

/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 */
M.impl.format.KML.prototype.readScreenOverlay_ = function (node, objectStack) {
   goog.asserts.assert(node.nodeType == goog.dom.NodeType.ELEMENT,
      'node.nodeType should be ELEMENT');
   goog.asserts.assert(node.localName == 'ScreenOverlay', 'localName should be ScreenOverlay');

   var screenOverlayObject = ol.xml.pushParseAndPop({}, M.impl.format.KML.SCREEN_OVERLAY_PARSERS_, node, objectStack);

   if (!screenOverlayObject) {
      return;
   }

   var iconAttr = 'Icon';
   var hrefAttr = 'href';
   var overlayXYAttr = 'overlayXY';
   var screenXYAttr = 'screenXY';
   var rotationXYAttr = 'rotationXY';
   var sizeAttr = 'size';
   var xUnitsAttr = 'xunits';
   var yUnitsAttr = 'yunits';

   // src
   var src;
   var IconObject = screenOverlayObject[iconAttr];
   if (!M.utils.isNullOrEmpty(IconObject)) {
      src = /** @type {string|undefined} */ (IconObject[hrefAttr]);
   }
   if (M.utils.isNullOrEmpty(src)) {
      src = ol.format.KML.DEFAULT_IMAGE_STYLE_SRC_;
   }

   // overlayXY (offset)
   var overlayXY, overlayXUnits, overlayYUnits;
   var overlayXYObject = screenOverlayObject[overlayXYAttr];
   if (!M.utils.isNullOrEmpty(overlayXYObject)) {
      overlayXY = [overlayXYObject.x, overlayXYObject.y];
      overlayXUnits = overlayXYObject[xUnitsAttr];
      overlayYUnits = overlayXYObject[yUnitsAttr];
   }

   // screenXY (anchor)
   var screenXY, screenXUnits, screenYUnits;
   var screenXYObject = screenOverlayObject[screenXYAttr];
   if (!M.utils.isNullOrEmpty(screenXYObject)) {
      screenXY = [screenXYObject.x, screenXYObject.y];
      screenXUnits = screenXYObject[xUnitsAttr];
      screenYUnits = screenXYObject[yUnitsAttr];
   }
   else if (src === ol.format.KML.DEFAULT_IMAGE_STYLE_SRC_) {
      screenXY = ol.format.KML.DEFAULT_IMAGE_STYLE_ANCHOR_;
      screenXUnits = ol.format.KML.DEFAULT_IMAGE_STYLE_ANCHOR_X_UNITS_;
      screenYUnits = ol.format.KML.DEFAULT_IMAGE_STYLE_ANCHOR_Y_UNITS_;
   }
   else if (/^http:\/\/maps\.(?:google|gstatic)\.com\//.test(src)) {
      screenXY = [0.5, 0];
      screenXUnits = ol.style.IconAnchorUnits.FRACTION;
      screenYUnits = ol.style.IconAnchorUnits.FRACTION;
   }

   // rotation
   var rotationXY, rotationXUnits, rotationYUnits;
   var rotationObject = screenOverlayObject[rotationXYAttr];
   if (!M.utils.isNullOrEmpty(rotationObject)) {
      rotationXY = goog.math.toRadians(rotationObject.x);
      rotationXUnits = rotationObject[xUnitsAttr];
      rotationYUnits = rotationObject[yUnitsAttr];
   }

   // size
   var size, sizeXUnits, sizeYUnits;
   var sizeObject = screenOverlayObject[sizeAttr];
   if (!M.utils.isNullOrEmpty(sizeObject)) {
      size = [sizeObject.x, sizeObject.y];
      sizeXUnits = sizeObject[xUnitsAttr];
      sizeYUnits = sizeObject[yUnitsAttr];
   }

   this.screenOverlay_ = {
      'screenXY': screenXY,
      'screenXUnits': screenXUnits,
      'screenYUnits': screenYUnits,
      'overlayXY': overlayXY,
      'overlayXUnits': overlayXUnits,
      'overlayYUnits': overlayYUnits,
      'rotationXY': rotationXY,
      'size': size,
      'src': src
   };
};

/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @private
 * @return {Array.<ol.Feature>|undefined} Features.
 */
M.impl.format.KML.prototype.readDocumentOrFolder_ = function (node, objectStack) {
   goog.asserts.assert(node.nodeType == goog.dom.NodeType.ELEMENT,
      'node.nodeType should be ELEMENT');
   var localName = ol.xml.getLocalName(node);
   goog.asserts.assert(localName == 'Document' || localName == 'Folder',
      'localName should be Document or Folder');
   // FIXME use scope somehow
   var parsersNS = ol.xml.makeStructureNS(
      ol.format.KML.NAMESPACE_URIS_, {
         'Document': ol.xml.makeArrayExtender(this.readDocumentOrFolder_, this),
         'Folder': ol.xml.makeArrayExtender(this.readDocumentOrFolder_, this),
         'Placemark': ol.xml.makeArrayPusher(this.readPlacemark_, this),
         'ScreenOverlay': goog.bind(this.readScreenOverlay_, this),
         'Style': goog.bind(this.readSharedStyle_, this),
         'StyleMap': goog.bind(this.readSharedStyleMap_, this)
      });
   var features = ol.xml.pushParseAndPop( /** @type {Array.<ol.Feature>} */ ([]),
      parsersNS, node, objectStack, this);
   if (features) {
      return features;
   }
   else {
      return undefined;
   }
};

/**
 * @param {Node} node Node.
 * @param {Array.<*>} objectStack Object stack.
 * @public
 * @return {Array.<ol.Feature>|undefined} Features.
 * @api stable
 */
M.impl.format.KML.prototype.getScreenOverlay = function () {
   return this.screenOverlay_;
};
