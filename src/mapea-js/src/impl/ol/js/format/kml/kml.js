import OLKML from "ol/format/KML";
import olxml from "ol/xml";
import olxsd from "ol/format/xsd";
import OLStyle from "ol/style/style";
import OLIconAnchorUnits from "ol/style/IconAnchorUnits";
import OLIconOrigin from "ol/style/IconOrigin";
import OLFeature from "ol/Feature";
import OLFeatureFormat from "ol/format/Feature";
import OLAsserts from "ol/asserts";
import Icon from "../style/icon";
import Utils from "facade/js/utils/utils";


export default class KML extends OLKML {
  /**
   * @classdesc
   * Feature format for reading and writing data in the KML format.
   *
   * @constructor
   * @extends {OLKML}
   * @param {olx.format.KMLOptions=} opt_options Options.
   * @api stable
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
  };

  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   * @return {Object} Icon object.
   */
  static readScreenXY_(node, objectStack) {
    let screenObject = KML.readOverlay_(node) || null;
    return screenObject;
  };

  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   * @return {Array.<OLStyle>} Style.
   */
  static readStyle_(node, objectStack) {
    let styleObject = olxml.pushParseAndPop({}, KML.STYLE_PARSERS_, node, objectStack);
    if (!styleObject) {
      return null;
    }
    let fillStyle = 'fillStyle' in styleObject ? styleObject['fillStyle'] : OLKML.DEFAULT_FILL_STYLE_;
    let fill = styleObject['fill'];
    if (fill !== undefined && !fill) {
      fillStyle = null;
    }
    let imageStyle = 'imageStyle' in styleObject ? styleObject['imageStyle'] : OLKML.DEFAULT_IMAGE_STYLE_;
    if (imageStyle == OLKML.DEFAULT_NO_IMAGE_STYLE_) {
      imageStyle = undefined;
    }
    let textStyle = 'textStyle' in styleObject ? styleObject['textStyle'] : OLKML.DEFAULT_TEXT_STYLE_;
    let strokeStyle = 'strokeStyle' in styleObject ? styleObject['strokeStyle'] : OLKML.DEFAULT_STROKE_STYLE_;
    let outline = styleObject['outline'];
    if (outline !== undefined && !outline) {
      strokeStyle = null;
    }
    return [new OLStyle({
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
  };

  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   * @return {Object} Icon object.
   */
  static readSize_(node, objectStack) {
    let sizeObject = KML.readOverlay_(node) || null;
    return sizeObject;
  };

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
  };

  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   */
  static PairDataParser_(node, objectStack) {
    let pairObject = olxml.pushParseAndPop({}, KML.PAIR_PARSERS_, node, objectStack);
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
  };

  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   * @return {Array.<OLStyle>|string|undefined} StyleMap.
   */
  static readStyleMapValue_(node, objectStack) {
    return olxml.pushParseAndPop(undefined, KML.STYLE_MAP_PARSERS_, node, objectStack);
  };

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
    let object = olxml.pushParseAndPop({}, OLKML.ICON_STYLE_PARSERS_, node, objectStack);
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
      src = OLKML.DEFAULT_IMAGE_STYLE_SRC_;
    }
    let anchor, anchorXUnits, anchorYUnits;
    let hotSpot = object['hotSpot'];
    if (hotSpot) {
      anchor = [hotSpot.x, hotSpot.y];
      anchorXUnits = hotSpot.xunits;
      anchorYUnits = hotSpot.yunits;
    }
    else if (src === OLKML.DEFAULT_IMAGE_STYLE_SRC_) {
      anchor = OLKML.DEFAULT_IMAGE_STYLE_ANCHOR_;
      anchorXUnits = OLKML.DEFAULT_IMAGE_STYLE_ANCHOR_X_UNITS_;
      anchorYUnits = OLKML.DEFAULT_IMAGE_STYLE_ANCHOR_Y_UNITS_;
    }
    else if (/^http:\/\/maps\.(?:google|gstatic)\.com\//.test(src)) {
      anchor = [0.5, 0];
      anchorXUnits = OLIconAnchorUnits.FRACTION;
      anchorYUnits = OLIconAnchorUnits.FRACTION;
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
      if (src == OLKML.DEFAULT_IMAGE_STYLE_SRC_) {
        size = OLKML.DEFAULT_IMAGE_STYLE_SIZE_;
        if (scale === undefined) {
          scale = OLKML.DEFAULT_IMAGE_SCALE_MULTIPLIER_;
        }
      }

      let imageStyle = new Icon({
        anchor: anchor,
        anchorOrigin: OLIconOrigin.BOTTOM_LEFT,
        anchorXUnits: anchorXUnits,
        anchorYUnits: anchorYUnits,
        crossOrigin: null, // PATCH: before 'anonymous'
        offset: offset,
        offsetOrigin: OLIconOrigin.BOTTOM_LEFT,
        rotation: rotation,
        scale: scale,
        size: size,
        src: src
      });
      styleObject['imageStyle'] = imageStyle;
    }
    else {
      // handle the case when we explicitly want to draw no icon.
      styleObject['imageStyle'] = OLKML.DEFAULT_NO_IMAGE_STYLE_;
    }
  };

  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   * @return {ol.Feature|undefined} Feature.
   */
  readPlacemark_(node, objectStack) {
    let object = olxml.pushParseAndPop({
        'geometry': null
      },
      KML.PLACEMARK_PARSERS_, node, objectStack);
    if (!object) {
      return undefined;
    }
    let feature = new OLFeature();
    let id = node.getAttribute('id');
    if (id !== null) {
      feature.setId(id);
    }
    let options = objectStack[0];

    let geometry = object['geometry'];
    if (geometry) {
      OLFeatureFormat.transformWithOptions(geometry, false, options);
    }
    feature.setGeometry(geometry);
    delete object['geometry'];

    if (this.extractStyles_) {
      let style = object['Style'];
      let styleUrl = object['styleUrl'];
      let styleFunction = OLKML.createFeatureStyleFunction_(
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
  };

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
      OLAsserts.assert(false, 38); // `styleMapValue` has an unknown type
    }
  };

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
  };

  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   */
  static readOverlay_(node, objectStack) {
    // x, y
    let x = olxsd.readDecimalString(node.getAttribute('x'));
    let y = olxsd.readDecimalString(node.getAttribute('y'));

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
  };

  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   */
  readScreenOverlay_(node, objectStack) {
    let screenOverlayObject = olxml.pushParseAndPop({}, KML.SCREEN_OVERLAY_PARSERS_, node, objectStack);

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
      src = OLKML.DEFAULT_IMAGE_STYLE_SRC_;
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
    else if (src === OLKML.DEFAULT_IMAGE_STYLE_SRC_) {
      screenXY = OLKML.DEFAULT_IMAGE_STYLE_ANCHOR_;
      screenXUnits = OLKML.DEFAULT_IMAGE_STYLE_ANCHOR_X_UNITS_;
      screenYUnits = OLKML.DEFAULT_IMAGE_STYLE_ANCHOR_Y_UNITS_;
    }
    else if (/^http:\/\/maps\.(?:google|gstatic)\.com\//.test(src)) {
      screenXY = [0.5, 0];
      screenXUnits = OLIconAnchorUnits.FRACTION;
      screenYUnits = OLIconAnchorUnits.FRACTION;
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
  };

  /**
   * @param {Node} node Node.
   * @param {Array.<*>} objectStack Object stack.
   * @private
   * @return {Array.<ol.Feature>|undefined} Features.
   */
  readDocumentOrFolder_(node, objectStack) {
    // FIXME use scope somehow
    let parsersNS = olxml.makeStructureNS(OLKML.NAMESPACE_URIS_, {
      'Document': olxml.makeArrayExtender(this.readDocumentOrFolder_, this),
      'Folder': olxml.makeArrayExtender(this.readDocumentOrFolder_, this),
      'Placemark': olxml.makeArrayPusher(this.readPlacemark_, this),
      'ScreenOverlay': this.readScreenOverlay_.bind(this),
      'Style': this.readSharedStyle_.bind(this),
      'StyleMap': this.readSharedStyleMap_.bind(this)
    });
    let features = olxml.pushParseAndPop([], parsersNS, node, objectStack, this) || undefined;
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
 * @type {Object.<string, Object.<string, olxml.Parser>>}
 * @private
 */
KML.OVERLAY_PARSERS_ = olxml.makeStructureNS(OLKML.GX_NAMESPACE_URIS_, {
  'x': olxml.makeObjectPropertyPusher(olxsd.readDecimal),
  'y': olxml.makeObjectPropertySetter(olxsd.readDecimal),
  'xunits': olxml.makeObjectPropertySetter(olxsd.readDecimal),
  'yunits': olxml.makeObjectPropertySetter(olxsd.readDecimal)
});

/**
 * @const
 * @type {Object.<string, Object.<string, olxml.Parser>>}
 * @private
 */
KML.SCREEN_OVERLAY_PARSERS_ = olxml.makeStructureNS(OLKML.NAMESPACE_URIS_, {
  'Icon': olxml.makeObjectPropertySetter(OLKML.readIcon_),
  'overlayXY': olxml.makeObjectPropertySetter(KML.readOverlayXY_),
  'screenXY': olxml.makeObjectPropertySetter(KML.readScreenXY_),
  'rotationXY': olxml.makeObjectPropertySetter(KML.readRotationXY_),
  'size': olxml.makeObjectPropertySetter(KML.readSize_)
});


/**
 * @const
 * @type {Object.<string, Object.<string, olxml.Parser>>}
 * @private
 */
KML.STYLE_PARSERS_ = olxml.makeStructureNS(OLKML.NAMESPACE_URIS_, {
  'IconStyle': KML.IconStyleParser_,
  'LabelStyle': OLKML.LabelStyleParser_,
  'LineStyle': OLKML.LineStyleParser_,
  'PolyStyle': OLKML.PolyStyleParser_
});

/**
 * @const
 * @type {Object.<string, Object.<string, olxml.Parser>>}
 * @private
 */
KML.PAIR_PARSERS_ = olxml.makeStructureNS(OLKML.NAMESPACE_URIS_, {
  'Style': olxml.makeObjectPropertySetter(KML.readStyle_),
  'key': olxml.makeObjectPropertySetter(olxsd.readString),
  'styleUrl': olxml.makeObjectPropertySetter(OLKML.readURI_)
});

/**
 * @const
 * @type {Object.<string, Object.<string, olxml.Parser>>}
 * @private
 */
KML.PLACEMARK_PARSERS_ = olxml.makeStructureNS(OLKML.NAMESPACE_URIS_, {
  'ExtendedData': OLKML.ExtendedDataParser_,
  'Region': OLKML.RegionParser_,
  'MultiGeometry': olxml.makeObjectPropertySetter(
    OLKML.readMultiGeometry_, 'geometry'),
  'LineString': olxml.makeObjectPropertySetter(
    OLKML.readLineString_, 'geometry'),
  'LinearRing': olxml.makeObjectPropertySetter(
    OLKML.readLinearRing_, 'geometry'),
  'Point': olxml.makeObjectPropertySetter(
    OLKML.readPoint_, 'geometry'),
  'Polygon': olxml.makeObjectPropertySetter(
    OLKML.readPolygon_, 'geometry'),
  'Style': olxml.makeObjectPropertySetter(KML.readStyle_),
  'StyleMap': KML.PlacemarkStyleMapParser_,
  'address': olxml.makeObjectPropertySetter(olxsd.readString),
  'description': olxml.makeObjectPropertySetter(olxsd.readString),
  'name': olxml.makeObjectPropertySetter(olxsd.readString),
  'open': olxml.makeObjectPropertySetter(olxsd.readBoolean),
  'phoneNumber': olxml.makeObjectPropertySetter(olxsd.readString),
  'styleUrl': olxml.makeObjectPropertySetter(OLKML.readURI_),
  'visibility': olxml.makeObjectPropertySetter(olxsd.readBoolean)
}, olxml.makeStructureNS(OLKML.GX_NAMESPACE_URIS_, {
  'MultiTrack': olxml.makeObjectPropertySetter(OLKML.readGxMultiTrack_, 'geometry'),
  'Track': olxml.makeObjectPropertySetter(OLKML.readGxTrack_, 'geometry')
}));

/**
 * @const
 * @type {Object.<string, Object.<string, olxml.Parser>>}
 * @private
 */
KML.STYLE_MAP_PARSERS_ = olxml.makeStructureNS(OLKML.NAMESPACE_URIS_, {
  'Pair': KML.PairDataParser_
});

/**
 * @const
 * @type {Object.<string, Object.<string, olxml.Parser>>}
 * @private
 */
OLKML.STYLE_PARSERS_ = olxml.makeStructureNS(OLKML.NAMESPACE_URIS_, {
  'IconStyle': KML.IconStyleParser_,
  'LabelStyle': OLKML.LabelStyleParser_,
  'LineStyle': OLKML.LineStyleParser_,
  'PolyStyle': OLKML.PolyStyleParser_
});
