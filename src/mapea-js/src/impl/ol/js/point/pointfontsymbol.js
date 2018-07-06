/**
 * @namespace M.impl.style.PointFontSymbol
 */
export default class PointFontSymbol extends ol.style.FontSymbol {
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
    if (!options.anchor) {
      options.anchor = [];
    }
    if (!options.offset) {
      options.offset = [];
    }
    // super call
    ol.style.FontSymbol.call(this, {
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
      rotateWithView: options.rotateWithView
    });
  }

  /**
   * clones the style
   * @public
   * @function
   * @api stable
   */
  clone() {
    let style = new PointFontSymbol({
      glyph: "",
      color: this.color_,
      fontSize: this.fontSize_,
      stroke: this.stroke_,
      fill: this.fill_,
      radius: this.radius_ + (this.stroke_ ? this.stroke_.getWidth() : 0),
      form: this.form_,
      gradient: this.gradient_,
      offsetX: this.offset_[0],
      offsetY: this.offset_[1],
      opacity: this.getOpacity(),
      rotation: this.getRotation(),
      rotateWithView: this.getRotateWithView()
    });
    style.setScale(this.getScale());
    style.glyph_ = this.glyph_;
    style.renderMarker_();
    return style;
  }
}
