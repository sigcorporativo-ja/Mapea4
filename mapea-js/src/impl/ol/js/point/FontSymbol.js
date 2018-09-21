import OLFontSymbol from '../ext/OLStyleFontSymbol';
/**
 * @namespace M.impl.style.PointFontSymbol
 */
export default class FontSymbol extends OLFontSymbol {
  /**
   * @classdesc
   * chart style for vector features
   *
   * @constructor
   * @param {object} options - Options style PointFontSymbol
   * @extends {ol.style.FontSymbol}
   * @api stable
   */
  constructor(options = {}) {
    // super call
    const optionsC = options;
    if (!options.anchor) {
      optionsC.anchor = [];
    }
    if (!options.offset) {
      optionsC.offset = [];
    }
    super({
      glyph: options.glyph,
      color: options.color,
      fontSize: options.fontSize,
      stroke: options.stroke,
      fill: options.fill,
      radius: options.radius,
      form: options.form,
      gradient: options.gradient,
      offsetX: options.offset[0],
      offsetY: options.offset[1],
      opacity: options.opacity,
      rotation: options.rotation,
      rotateWithView: options.rotateWithView,
    });
  }
}
