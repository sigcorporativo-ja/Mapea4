/**
 * @namespace M.impl.style.PointCircle
 */
export default class Circle extends ol.style.Circle {
  /**
   * @classdesc
   * chart style for vector features
   *
   * @constructor
   * @param {object} options - Options style PointCircle
   * @extends {ol.style.Circle}
   * @api stable
   */
  constructor(options = {}) {
    // super call
    ol.style.Circle.call(this, {
      points: Infinity,
      fill: options.fill,
      radius: options.radius,
      snapToPixel: options.snapToPixel,
      stroke: options.stroke,
      atlasManager: options.atlasManager
    });
  }

  /**
   * clones the style
   * @public
   * @function
   * @api stable
   */
  clone() {
    let style = new Circle({
      fill: this.getFill() ? this.getFill().clone() : undefined,
      stroke: this.getStroke() ? this.getStroke().clone() : undefined,
      radius: this.getRadius(),
      snapToPixel: this.getSnapToPixel(),
      atlasManager: this.atlasManager_
    });
    style.setOpacity(this.getOpacity());
    style.setScale(this.getScale());
    return style;
  }
}
