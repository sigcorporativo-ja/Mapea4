import Utils from "facade/js/util/Utils";

export default class KML extends ol.format.KML {
  /**
   * @classdesc
   * Feature format for reading and writing data in the KML format.
   *
   * @constructor
   * @extends {ol.format.KML}
   * @param {olx.format.KMLOptions=} opt_options Options.
   * @api stabl
   */
  constructor(opt_options = {}) {
    super();
    let options = opt_options ? opt_options : {};

    // anonymous by default
    if (!options.crossOriginIcons_) {
      options.crossOriginIcons_ = 'anonymous';
    }

    /**
     * @private
     * @type {Object}
     */
    this.screenOverlay_ = null;
  }

  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   * @return {Object} Icon object.
   */
  static readOverlayXY_(node, objectStack) {
    let overlayObject = KML.readOverlay_(node) || null;
    return overlayObject;
  }

  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   * @return {Object} Icon object.
   */
  static readScreenXY_(node, objectStack) {
    let screenObject = KML.readOverlay_(node) || null;
    return screenObject;
  }

  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   * @return {Array.<ol.style.Style>} Style.
   */
  static readStyle_(node, objectStack) {
    let styleObject = ol.xml.pushParseAndPop({}, KML.STYLE_PARSERS_, node, objectStack);
    if (!styleObject) {
      return null;
    }
    let fillStyle = 'fillStyle' in styleObject ? styleObject['fillStyle'] : ol.format.KML.DEFAULT_FILL_STYLE_;
    let fill = styleObject['fill'];
    if (fill !== undefined && !fill) {
      fillStyle = null;
    }
    let imageStyle = 'imageStyle' in styleObject ? styleObject['imageStyle'] : ol.format.KML.DEFAULT_IMAGE_STYLE_;
    if (imageStyle == ol.format.KML.DEFAULT_NO_IMAGE_STYLE_) {
      imageStyle = undefined;
    }
    let textStyle = 'textStyle' in styleObject ? styleObject['textStyle'] : ol.format.KML.DEFAULT_TEXT_STYLE_;
    let strokeStyle = 'strokeStyle' in styleObject ? styleObject['strokeStyle'] : ol.format.KML.DEFAULT_STROKE_STYLE_;
    let outline = styleObject['outline'];
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
  }

  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   * @return {Object} Icon object.
   */
  static readRotationXY_(node, objectStack) {
    let rotationObject = KML.readOverlay_(node) || null;
    return rotationObject;
  }

  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   * @return {Object} Icon object.
   */
  static readSize_(node, objectStack) {
    let sizeObject = KML.readOverlay_(node) || null;
    return sizeObject;
  }

  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   */
  readSharedStyle_(node, objectStack) {
    let id = node.getAttribute('id');
    if (id !== null) {
      let style = KML.readStyle_(node, objectStack);
      if (style) {
        let styleUri;
        if (node.baseURI) {
          let url = new URL('#' + id, node.baseURI);
          styleUri = url.href;
        }
        else {
          styleUri = '#' + id;
        }
        this.sharedStyles_[styleUri] = style;
      }
    }
  }

  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   */
  static PairDataParser_(node, objectStack) {
    let pairObject = ol.xml.pushParseAndPop({}, KML.PAIR_PARSERS_, node, objectStack);
    if (!pairObject) {
      return;
    }
    let key = pairObject['key'];
    if (key && key == 'normal') {
      let styleUrl = pairObject['styleUrl'];
      if (styleUrl) {
        objectStack[objectStack.length - 1] = styleUrl;
      }
      let Style = pairObject['Style'];
      if (Style) {
        objectStack[objectStack.length - 1] = Style;
      }
    }
  }

  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   * @return {Array.<ol.style.Style>|string|undefined} StyleMap.
   */
  static readStyleMapValue_(node, objectStack) {
    return ol.xml.pushParseAndPop(undefined, KML.STYLE_MAP_PARSERS_, node, objectStack);
  }

  /**
   *
   * PATCH: sets the crossOrigin for KML icons to void
   * CORS exceptions
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   */
  static IconStyleParser_(node, objectStack) {
    // FIXME refreshMode
    // FIXME refreshInterval
    // FIXME viewRefreshTime
    // FIXME viewBoundScale
    // FIXME viewFormat
    // FIXME httpQuery
    let object = ol.xml.pushParseAndPop({}, ol.format.KML.ICON_STYLE_PARSERS_, node, objectStack);
    if (!object) {
      return;
    }
    let styleObject = objectStack[objectStack.length - 1];
    let IconObject = 'Icon' in object ? object['Icon'] : {};
    let drawIcon = (!('Icon' in object) || Object.keys(IconObject).length > 0);
    let src;
    let href = IconObject['href'];
    if (href) {
      src = href;
    }
    else if (drawIcon) {
      src = ol.format.KML.DEFAULT_IMAGE_STYLE_SRC_;
    }
    let anchor, anchorXUnits, anchorYUnits;
    let hotSpot = object['hotSpot'];
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

    let offset;
    let x = IconObject['x'];
    let y = /** @type {number|undefined} */
      (IconObject['y']);
    if (x !== undefined && y !== undefined) {
      offset = [x, y];
    }

    let size;
    let w = IconObject['w'];
    let h = IconObject['h'];
    if (w !== undefined && h !== undefined) {
      size = [w, h];
    }

    let rotation;
    let heading =
      (object['heading']);
    if (heading !== undefined) {
      rotation = (heading * Math.PI) / 180;
    }

    let scale = object['scale'];
    if (drawIcon) {
      if (src == ol.format.KML.DEFAULT_IMAGE_STYLE_SRC_) {
        size = ol.format.KML.DEFAULT_IMAGE_STYLE_SIZE_;
        if (scale === undefined) {
          scale = ol.format.KML.DEFAULT_IMAGE_SCALE_MULTIPLIER_;
        }
      }

      let imageStyle = new ol.style.Icon({
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
    }
    else {
      // handle the case when we explicitly want to draw no icon.
      styleObject['imageStyle'] = ol.format.KML.DEFAULT_NO_IMAGE_STYLE_;
    }
  }

  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   * @return {ol.Feature|undefined} Feature.
   */
  readPlacemark_(node, objectStack) {
    let object = ol.xml.pushParseAndPop({
        'geometry': null
      },
      KML.PLACEMARK_PARSERS_, node, objectStack);
    if (!object) {
      return undefined;
    }
    let feature = new ol.Feature();
    let id = node.getAttribute('id');
    if (id !== null) {
      feature.setId(id);
    }
    let options = objectStack[0];

    let geometry = object['geometry'];
    if (geometry) {
      ol.format.Feature.transformWithOptions(geometry, false, options);
    }
    feature.setGeometry(geometry);
    delete object['geometry'];

    if (this.extractStyles_) {
      let style = object['Style'];
      let styleUrl = object['styleUrl'];
      let styleFunction = ol.format.KML.createFeatureStyleFunction_(
        style, styleUrl, this.defaultStyle_, this.sharedStyles_,
        this.showPointNames_);
      feature.setStyle(styleFunction);
    }
    delete object['Style'];
    // we do not remove the styleUrl property from the object, so it
    // gets stored on feature when setProperties is called

    feature.setProperties(object);

    // fixes #3: decodes name to remove HTML entities
    feature.set("name", Utils.decodeHtml(feature.get("name")));

    return feature;
  }

  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   */
  static PlacemarkStyleMapParser_(node, objectStack) {
    let styleMapValue = KML.readStyleMapValue_(node, objectStack);
    if (!styleMapValue) {
      return;
    }
    let placemarkObject = objectStack[objectStack.length - 1];
    if (Array.isArray(styleMapValue)) {
      placemarkObject['Style'] = styleMapValue;
    }
    else if (typeof styleMapValue === 'string') {
      placemarkObject['styleUrl'] = styleMapValue;
    }
    else {
      ol.asserts.assert(false, 38); // `styleMapValue` has an unknown type
    }
  }

  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   */
  readSharedStyleMap_(node, objectStack) {
    let id = node.getAttribute('id');
    if (id === null) {
      return;
    }
    let styleMapValue = KML.readStyleMapValue_(node, objectStack);
    if (!styleMapValue) {
      return;
    }
    let styleUri;
    if (node.baseURI) {
      let url = new URL('#' + id, node.baseURI);
      styleUri = url.href;
    }
    else {
      styleUri = '#' + id;
    }
    this.sharedStyles_[styleUri] = styleMapValue;
  }

  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   */
  static readOverlay_(node, objectStack) {
    // x, y
    let x = ol.xsd.readDecimalString(node.getAttribute('x'));
    let y = ol.xsd.readDecimalString(node.getAttribute('y'));

    // xunits
    let xunits = node.getAttribute('xunits');

    // yunits
    let yunits = node.getAttribute('yunits');

    return {
      'x': x,
      'y': y,
      'xunits': xunits,
      'yunits': yunits
    };
  }

  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   */
  readScreenOverlay_(node, objectStack) {
    let screenOverlayObject = ol.xml.pushParseAndPop({}, KML.SCREEN_OVERLAY_PARSERS_, node, objectStack);

    if (!screenOverlayObject) {
      return;
    }

    let iconAttr = 'Icon';
    let hrefAttr = 'href';
    let overlayXYAttr = 'overlayXY';
    let screenXYAttr = 'screenXY';
    let rotationXYAttr = 'rotationXY';
    let sizeAttr = 'size';
    let xUnitsAttr = 'xunits';
    let yUnitsAttr = 'yunits';

    // src
    let src;
    let IconObject = screenOverlayObject[iconAttr];
    if (!Utils.isNullOrEmpty(IconObject)) {
      src = IconObject[hrefAttr];
    }
    if (Utils.isNullOrEmpty(src)) {
      src = ol.format.KML.DEFAULT_IMAGE_STYLE_SRC_;
    }

    // overlayXY (offset)
    let overlayXY, overlayXUnits, overlayYUnits;
    let overlayXYObject = screenOverlayObject[overlayXYAttr];
    if (!Utils.isNullOrEmpty(overlayXYObject)) {
      overlayXY = [overlayXYObject.x, overlayXYObject.y];
      overlayXUnits = overlayXYObject[xUnitsAttr];
      overlayYUnits = overlayXYObject[yUnitsAttr];
    }

    // screenXY (anchor)
    let screenXY, screenXUnits, screenYUnits;
    let screenXYObject = screenOverlayObject[screenXYAttr];
    if (!Utils.isNullOrEmpty(screenXYObject)) {
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
    let rotationXY, rotationXUnits, rotationYUnits;
    let rotationObject = screenOverlayObject[rotationXYAttr];
    if (!Utils.isNullOrEmpty(rotationObject)) {
      rotationXY = (rotationObject.x * Math.PI) / 180;
      rotationXUnits = rotationObject[xUnitsAttr];
      rotationYUnits = rotationObject[yUnitsAttr];
    }

    // size
    let size, sizeXUnits, sizeYUnits;
    let sizeObject = screenOverlayObject[sizeAttr];
    if (!Utils.isNullOrEmpty(sizeObject)) {
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
  }

  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   * @return {Array.<ol.Feature>|undefined} Features.
   */
  readDocumentOrFolder_(node, objectStack) {
    // FIXME use scope somehow
    let parsersNS = ol.xml.makeStructureNS(ol.format.KML.NAMESPACE_URIS_, {
      'Document': ol.xml.makeArrayExtender(this.readDocumentOrFolder_, this),
      'Folder': ol.xml.makeArrayExtender(this.readDocumentOrFolder_, this),
      'Placemark': ol.xml.makeArrayPusher(this.readPlacemark_, this),
      'ScreenOverlay': this.readScreenOverlay_.bind(this),
      'Style': this.readSharedStyle_.bind(this),
      'StyleMap': this.readSharedStyleMap_.bind(this)
    });
    let features = ol.xml.pushParseAndPop([], parsersNS, node, objectStack, this) || undefined;
    return features;
  }

  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @public
   * @return {Array.<ol.Feature>|undefined} Features.
   * @api stable
   */
  getScreenOverlay() {
    return this.screenOverlay_;
  }
}

/**
 * @const
 * @type {Object.<string, Object.<string, ol.xml.Parser>>}
 * @private
 */
KML.OVERLAY_PARSERS_ = ol.xml.makeStructureNS(ol.format.KML.GX_NAMESPACE_URIS_, {
  'x': ol.xml.makeObjectPropertyPusher(ol.xsd.readDecimal),
  'y': ol.xml.makeObjectPropertySetter(ol.xsd.readDecimal),
  'xunits': ol.xml.makeObjectPropertySetter(ol.xsd.readDecimal),
  'yunits': ol.xml.makeObjectPropertySetter(ol.xsd.readDecimal)
});

/**
 * @const
 * @type {Object.<string, Object.<string, ol.xml.Parser>>}
 * @private
 */
KML.SCREEN_OVERLAY_PARSERS_ = ol.xml.makeStructureNS(ol.format.KML.NAMESPACE_URIS_, {
  'Icon': ol.xml.makeObjectPropertySetter(ol.format.KML.readIcon_),
  'overlayXY': ol.xml.makeObjectPropertySetter(KML.readOverlayXY_),
  'screenXY': ol.xml.makeObjectPropertySetter(KML.readScreenXY_),
  'rotationXY': ol.xml.makeObjectPropertySetter(KML.readRotationXY_),
  'size': ol.xml.makeObjectPropertySetter(KML.readSize_)
});


/**
 * @const
 * @type {Object.<string, Object.<string, ol.xml.Parser>>}
 * @private
 */
KML.STYLE_PARSERS_ = ol.xml.makeStructureNS(ol.format.KML.NAMESPACE_URIS_, {
  'IconStyle': KML.IconStyleParser_,
  'LabelStyle': ol.format.KML.LabelStyleParser_,
  'LineStyle': ol.format.KML.LineStyleParser_,
  'PolyStyle': ol.format.KML.PolyStyleParser_
});

/**
 * @const
 * @type {Object.<string, Object.<string, ol.xml.Parser>>}
 * @private
 */
KML.PAIR_PARSERS_ = ol.xml.makeStructureNS(ol.format.KML.NAMESPACE_URIS_, {
  'Style': ol.xml.makeObjectPropertySetter(KML.readStyle_),
  'key': ol.xml.makeObjectPropertySetter(ol.xsd.readString),
  'styleUrl': ol.xml.makeObjectPropertySetter(ol.format.KML.readURI_)
});

/**
 * @const
 * @type {Object.<string, Object.<string, ol.xml.Parser>>}
 * @private
 */
KML.PLACEMARK_PARSERS_ = ol.xml.makeStructureNS(ol.format.KML.NAMESPACE_URIS_, {
  'ExtendedData': ol.format.KML.ExtendedDataParser_,
  'Region': ol.format.KML.RegionParser_,
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
  'Style': ol.xml.makeObjectPropertySetter(KML.readStyle_),
  'StyleMap': KML.PlacemarkStyleMapParser_,
  'address': ol.xml.makeObjectPropertySetter(ol.xsd.readString),
  'description': ol.xml.makeObjectPropertySetter(ol.xsd.readString),
  'name': ol.xml.makeObjectPropertySetter(ol.xsd.readString),
  'open': ol.xml.makeObjectPropertySetter(ol.xsd.readBoolean),
  'phoneNumber': ol.xml.makeObjectPropertySetter(ol.xsd.readString),
  'styleUrl': ol.xml.makeObjectPropertySetter(ol.format.KML.readURI_),
  'visibility': ol.xml.makeObjectPropertySetter(ol.xsd.readBoolean)
}, ol.xml.makeStructureNS(ol.format.KML.GX_NAMESPACE_URIS_, {
  'MultiTrack': ol.xml.makeObjectPropertySetter(ol.format.KML.readGxMultiTrack_, 'geometry'),
  'Track': ol.xml.makeObjectPropertySetter(ol.format.KML.readGxTrack_, 'geometry')
}));

/**
 * @const
 * @type {Object.<string, Object.<string, ol.xml.Parser>>}
 * @private
 */
KML.STYLE_MAP_PARSERS_ = ol.xml.makeStructureNS(ol.format.KML.NAMESPACE_URIS_, {
  'Pair': KML.PairDataParser_
});

/**
 * @const
 * @type {Object.<string, Object.<string, ol.xml.Parser>>}
 * @private
 */
ol.format.KML.STYLE_PARSERS_ = ol.xml.makeStructureNS(ol.format.KML.NAMESPACE_URIS_, {
  'IconStyle': KML.IconStyleParser_,
  'LabelStyle': ol.format.KML.LabelStyleParser_,
  'LineStyle': ol.format.KML.LineStyleParser_,
  'PolyStyle': ol.format.KML.PolyStyleParser_
});