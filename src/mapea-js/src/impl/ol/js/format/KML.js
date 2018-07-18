import Utils from 'facade/js/util/Utils';

export default class KML extends ol.format.KML {
  /**
   * @classdesc
   * Feature format for reading and writing data in the KML format.
   *
   * @constructor
   * @extends {ol.format.KML}
   * @param {olx.format.KMLOptions=} optOptions Options.
   * @api stabl
   */
  constructor(optOptions = {}) {
    super();
    const options = optOptions || {};

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
  static readOverlayXY(node, objectStack) {
    const overlayObject = KML.readOverlay(node) || null;
    return overlayObject;
  }

  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   * @return {Object} Icon object.
   */
  static readScreenXY(node, objectStack) {
    const screenObject = KML.readOverlay(node) || null;
    return screenObject;
  }

  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   * @return {Array.<ol.style.Style>} Style.
   */
  static readStyle(node, objectStack) {
    const styleObject = ol.xml.pushParseAndPop({}, KML.STYLE_PARSERS_, node, objectStack);
    if (!styleObject) {
      return null;
    }
    let fillStyle = 'fillStyle' in styleObject ? styleObject.fillStyle : ol.format.KML.DEFAULT_FILL_STYLE_;
    const fill = styleObject.fill;
    if (fill !== undefined && !fill) {
      fillStyle = null;
    }
    let imageStyle = 'imageStyle' in styleObject ? styleObject.imageStyle : ol.format.KML.DEFAULT_IMAGE_STYLE_;
    if (imageStyle === ol.format.KML.DEFAULT_NO_IMAGE_STYLE_) {
      imageStyle = undefined;
    }
    const textStyle = 'textStyle' in styleObject ? styleObject.textStyle : ol.format.KML.DEFAULT_TEXT_STYLE_;
    let strokeStyle = 'strokeStyle' in styleObject ? styleObject.strokeStyle : ol.format.KML.DEFAULT_STROKE_STYLE_;
    const outline = styleObject.outline;
    if (outline !== undefined && !outline) {
      strokeStyle = null;
    }
    return [new ol.style.Style({
      fill: fillStyle,
      image: imageStyle,
      stroke: strokeStyle,
      text: textStyle,
      zIndex: undefined, // FIXME
    })];
  }

  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   * @return {Object} Icon object.
   */
  static readRotationXY(node, objectStack) {
    const rotationObject = KML.readOverlay(node) || null;
    return rotationObject;
  }

  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   * @return {Object} Icon object.
   */
  static readSize(node, objectStack) {
    const sizeObject = KML.readOverlay(node) || null;
    return sizeObject;
  }

  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   */
  readSharedStyle(node, objectStack) {
    const id = node.getAttribute('id');
    if (id !== null) {
      const style = KML.readStyle(node, objectStack);
      if (style) {
        let styleUri;
        if (node.baseURI) {
          const url = new URL(`#${id}`, node.baseURI);
          styleUri = url.href;
        }
        else {
          styleUri = `#${id}`;
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
  static pairDataParser(node, objectStack) {
    const pairObject = ol.xml.pushParseAndPop({}, KML.PAIR_PARSERS_, node, objectStack);
    if (!pairObject) {
      return;
    }
    const key = pairObject.key;
    if (key && key === 'normal') {
      const styleUrl = pairObject.styleUrl;
      if (styleUrl) {
        const objectStackVar = objectStack;
        objectStackVar[objectStack.length - 1] = styleUrl;
      }
      const Style = pairObject.Style;
      if (Style) {
        const objectStackVar = objectStack;
        objectStackVar[objectStack.length - 1] = Style;
      }
    }
  }

  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   * @return {Array.<ol.style.Style>|string|undefined} StyleMap.
   */
  static readStyleMapValue(node, objectStack) {
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
  static IconStyleParser(node, objectStack) {
    // FIXME refreshMode
    // FIXME refreshInterval
    // FIXME viewRefreshTime
    // FIXME viewBoundScale
    // FIXME viewFormat
    // FIXME httpQuery
    const object = ol.xml.pushParseAndPop({}, ol.format.KML.ICON_STYLE_PARSERS_, node, objectStack);
    if (!object) {
      return;
    }
    const styleObject = objectStack[objectStack.length - 1];
    const IconObject = 'Icon' in object ? object.Icon : {};
    const drawIcon = (!('Icon' in object) || Object.keys(IconObject).length > 0);
    let src;
    const href = IconObject.href;
    if (href) {
      src = href;
    }
    else if (drawIcon) {
      src = ol.format.KML.DEFAULT_IMAGE_STYLE_SRC_;
    }
    let anchor;
    let anchorXUnits;
    let anchorYUnits;
    const hotSpot = object.hotSpot;
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
    const x = IconObject.x;
    const y = /** @type {number|undefined} */
      (IconObject.y);
    if (x !== undefined && y !== undefined) {
      offset = [x, y];
    }

    let size;
    const w = IconObject.w;
    const h = IconObject.h;
    if (w !== undefined && h !== undefined) {
      size = [w, h];
    }

    let rotation;
    const heading =
      (object.heading);
    if (heading !== undefined) {
      rotation = (heading * Math.PI) / 180;
    }

    let scale = object.scale;
    if (drawIcon) {
      if (src === ol.format.KML.DEFAULT_IMAGE_STYLE_SRC_) {
        size = ol.format.KML.DEFAULT_IMAGE_STYLE_SIZE_;
        if (scale === undefined) {
          scale = ol.format.KML.DEFAULT_IMAGE_SCALE_MULTIPLIER_;
        }
      }

      const imageStyle = new ol.style.Icon({
        anchor,
        anchorOrigin: ol.style.IconOrigin.BOTTOM_LEFT,
        anchorXUnits,
        anchorYUnits,
        crossOrigin: null, // PATCH: before 'anonymous'
        offset,
        offsetOrigin: ol.style.IconOrigin.BOTTOM_LEFT,
        rotation,
        scale,
        size,
        src,
      });
      styleObject.imageStyle = imageStyle;
    }
    else {
      // handle the case when we explicitly want to draw no icon.
      styleObject.imageStyle = ol.format.KML.DEFAULT_NO_IMAGE_STYLE_;
    }
  }

  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   * @return {ol.Feature|undefined} Feature.
   */
  readPlacemark(node, objectStack) {
    const object = ol.xml.pushParseAndPop({
      geometry: null,
    }, KML.PLACEMARK_PARSERS_, node, objectStack);
    if (!object) {
      return undefined;
    }
    const feature = new ol.Feature();
    const id = node.getAttribute('id');
    if (id !== null) {
      feature.setId(id);
    }
    const options = objectStack[0];

    const geometry = object.geometry;
    if (geometry) {
      ol.format.Feature.transformWithOptions(geometry, false, options);
    }
    feature.setGeometry(geometry);
    delete object.geometry;

    if (this.extractStyles_) {
      const style = object.Style;
      const styleUrl = object.styleUrl;
      const styleFunction = ol.format.KML.createFeatureStyleFunction_(
        style,
        styleUrl,
        this.defaultStyle_,
        this.sharedStyles_,
        this.showPointNames,
      );
      feature.setStyle(styleFunction);
    }
    delete object.Style;
    // we do not remove the styleUrl property from the object, so it
    // gets stored on feature when setProperties is called

    feature.setProperties(object);

    // fixes #3: decodes name to remove HTML entities
    feature.set('name', Utils.decodeHtml(feature.get('name')));

    return feature;
  }

  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   */

  static placemarkStyleMapParser(node, objectStack) {
    const styleMapValue = KML.readStyleMapValue(node, objectStack);
    if (!styleMapValue) {
      return;
    }
    const placemarkObject = objectStack[objectStack.length - 1];
    if (Array.isArray(styleMapValue)) {
      placemarkObject.Style = styleMapValue;
    }
    else if (typeof styleMapValue === 'string') {
      placemarkObject.styleUrl = styleMapValue;
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
  readSharedStyleMap(node, objectStack) {
    const id = node.getAttribute('id');
    if (id === null) {
      return;
    }
    const styleMapValue = KML.readStyleMapValue(node, objectStack);
    if (!styleMapValue) {
      return;
    }
    let styleUri;
    if (node.baseURI) {
      const url = new URL(`#${id}`, node.baseURI);
      styleUri = url.href;
    }
    else {
      styleUri = `#${id}`;
    }
    this.sharedStyles_[styleUri] = styleMapValue;
  }

  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   */
  static readOverlay(node, objectStack) {
    // x, y
    const x = ol.xsd.readDecimalString(node.getAttribute('x'));
    const y = ol.xsd.readDecimalString(node.getAttribute('y'));

    // xunits
    const xunits = node.getAttribute('xunits');

    // yunits
    const yunits = node.getAttribute('yunits');

    return {
      x,
      y,
      xunits,
      yunits,
    };
  }

  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   */
  readScreenOverlay(node, objectStack) {
    const screenOverlayObject =
      ol.xml.pushParseAndPop({}, KML.SCREEN_OVERLAY_PARSERS_, node, objectStack);

    if (!screenOverlayObject) {
      return;
    }

    const iconAttr = 'Icon';
    const hrefAttr = 'href';
    const overlayXYAttr = 'overlayXY';
    const screenXYAttr = 'screenXY';
    const rotationXYAttr = 'rotationXY';
    const sizeAttr = 'size';
    const xUnitsAttr = 'xunits';
    const yUnitsAttr = 'yunits';

    // src
    let src;
    const IconObject = screenOverlayObject[iconAttr];
    if (!Utils.isNullOrEmpty(IconObject)) {
      src = IconObject[hrefAttr];
    }
    if (Utils.isNullOrEmpty(src)) {
      src = ol.format.KML.DEFAULT_IMAGE_STYLE_SRC_;
    }

    // overlayXY (offset)
    let overlayXY;
    let overlayXUnits;
    let overlayYUnits;
    const overlayXYObject = screenOverlayObject[overlayXYAttr];
    if (!Utils.isNullOrEmpty(overlayXYObject)) {
      overlayXY = [overlayXYObject.x, overlayXYObject.y];
      overlayXUnits = overlayXYObject[xUnitsAttr];
      overlayYUnits = overlayXYObject[yUnitsAttr];
    }

    // screenXY (anchor)
    let screenXY;
    let screenXUnits;
    let screenYUnits;
    const screenXYObject = screenOverlayObject[screenXYAttr];
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
    let rotationXY;
    // let rotationXUnits;
    // let rotationYUnits;
    const rotationObject = screenOverlayObject[rotationXYAttr];
    if (!Utils.isNullOrEmpty(rotationObject)) {
      rotationXY = (rotationObject.x * Math.PI) / 180;
      // rotationYUnits = rotationObject[yUnitsAttr];
      //    rotationXUnits = rotationObject[xUnitsAttr];
    }

    // size
    let size;
    // let sizeXUnits;
    // let sizeYUnits;
    const sizeObject = screenOverlayObject[sizeAttr];
    if (!Utils.isNullOrEmpty(sizeObject)) {
      size = [sizeObject.x, sizeObject.y];
      // sizeXUnits = sizeObject[xUnitsAttr];
      // sizeYUnits = sizeObject[yUnitsAttr];
    }

    this.screenOverlay_ = {
      screenXY,
      screenXUnits,
      screenYUnits,
      overlayXY,
      overlayXUnits,
      overlayYUnits,
      rotationXY,
      size,
      src,
    };
  }

  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   * @return {Array.<ol.Feature>|undefined} Features.
   */
  readDocumentOrFolder(node, objectStack) {
    // FIXME use scope somehow
    const parsersNS = ol.xml.makeStructureNS(ol.format.KML.NAMESPACE_URIS_, {
      Document: ol.xml.makeArrayExtender(this.readDocumentOrFolder, this),
      Folder: ol.xml.makeArrayExtender(this.readDocumentOrFolder, this),
      Placemark: ol.xml.makeArrayPusher(this.readPlacemark, this),
      ScreenOverlay: this.readScreenOverlay.bind(this),
      Style: this.readSharedStyle.bind(this),
      StyleMap: this.readSharedStyleMap.bind(this),
    });
    const features = ol.xml.pushParseAndPop([], parsersNS, node, objectStack, this) || undefined;
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
  x: ol.xml.makeObjectPropertyPusher(ol.xsd.readDecimal),
  y: ol.xml.makeObjectPropertySetter(ol.xsd.readDecimal),
  xunits: ol.xml.makeObjectPropertySetter(ol.xsd.readDecimal),
  yunits: ol.xml.makeObjectPropertySetter(ol.xsd.readDecimal),
});

/**
 * @const
 * @type {Object.<string, Object.<string, ol.xml.Parser>>}
 * @private
 */
KML.SCREEN_OVERLAY_PARSERS_ = ol.xml.makeStructureNS(ol.format.KML.NAMESPACE_URIS_, {
  Icon: ol.xml.makeObjectPropertySetter(ol.format.KML.readIcon_),
  overlayXY: ol.xml.makeObjectPropertySetter(KML.readOverlayXY),
  screenXY: ol.xml.makeObjectPropertySetter(KML.readScreenXY),
  rotationXY: ol.xml.makeObjectPropertySetter(KML.readRotationXY),
  size: ol.xml.makeObjectPropertySetter(KML.readSize),
});


/**
 * @const
 * @type {Object.<string, Object.<string, ol.xml.Parser>>}
 * @private
 */
KML.STYLE_PARSERS_ = ol.xml.makeStructureNS(ol.format.KML.NAMESPACE_URIS_, {
  IconStyle: KML.IconStyleParser,
  LabelStyle: ol.format.KML.LabelStyleParser_,
  LineStyle: ol.format.KML.LineStyleParser_,
  PolyStyle: ol.format.KML.PolyStyleParser_,
});

/**
 * @const
 * @type {Object.<string, Object.<string, ol.xml.Parser>>}
 * @private
 */
KML.PAIR_PARSERS_ = ol.xml.makeStructureNS(ol.format.KML.NAMESPACE_URIS_, {
  Style: ol.xml.makeObjectPropertySetter(KML.readStyle),
  key: ol.xml.makeObjectPropertySetter(ol.xsd.readString),
  styleUrl: ol.xml.makeObjectPropertySetter(ol.format.KML.readURI_),
});

/**
 * @const
 * @type {Object.<string, Object.<string, ol.xml.Parser>>}
 * @private
 */
KML.PLACEMARK_PARSERS_ = ol.xml.makeStructureNS(ol.format.KML.NAMESPACE_URIS_, {
  ExtendedData: ol.format.KML.ExtendedDataParser_,
  Region: ol.format.KML.RegionParser_,
  MultiGeometry: ol.xml.makeObjectPropertySetter(ol.format.KML.readMultiGeometry_, 'geometry'),
  LineString: ol.xml.makeObjectPropertySetter(ol.format.KML.readLineString_, 'geometry'),
  LinearRing: ol.xml.makeObjectPropertySetter(ol.format.KML.readLinearRing_, 'geometry'),
  Point: ol.xml.makeObjectPropertySetter(ol.format.KML.readPoint_, 'geometry'),
  Polygon: ol.xml.makeObjectPropertySetter(ol.format.KML.readPolygon_, 'geometry'),
  Style: ol.xml.makeObjectPropertySetter(KML.readStyle),
  StyleMap: KML.placemarkStyleMapParser,
  address: ol.xml.makeObjectPropertySetter(ol.xsd.readString),
  description: ol.xml.makeObjectPropertySetter(ol.xsd.readString),
  name: ol.xml.makeObjectPropertySetter(ol.xsd.readString),
  open: ol.xml.makeObjectPropertySetter(ol.xsd.readBoolean),
  phoneNumber: ol.xml.makeObjectPropertySetter(ol.xsd.readString),
  styleUrl: ol.xml.makeObjectPropertySetter(ol.format.KML.readURI_),
  visibility: ol.xml.makeObjectPropertySetter(ol.xsd.readBoolean),
}, ol.xml.makeStructureNS(ol.format.KML.GX_NAMESPACE_URIS_, {
  MultiTrack: ol.xml.makeObjectPropertySetter(ol.format.KML.readGxMultiTrack_, 'geometry'),
  Track: ol.xml.makeObjectPropertySetter(ol.format.KML.readGxTrack_, 'geometry'),
}));

/**
 * @const
 * @type {Object.<string, Object.<string, ol.xml.Parser>>}
 * @private
 */
KML.STYLE_MAP_PARSERS_ = ol.xml.makeStructureNS(ol.format.KML.NAMESPACE_URIS_, {
  Pair: KML.pairDataParser,
});

/**
 * @const
 * @type {Object.<string, Object.<string, ol.xml.Parser>>}
 * @private
 */
ol.format.KML.STYLE_PARSERS_ = ol.xml.makeStructureNS(ol.format.KML.NAMESPACE_URIS_, {
  IconStyle: KML.IconStyleParser,
  LabelStyle: ol.format.KML.LabelStyleParser_,
  LineStyle: ol.format.KML.LineStyleParser_,
  PolyStyle: ol.format.KML.PolyStyleParser_,
});
