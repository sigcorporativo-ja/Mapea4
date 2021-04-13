import OLStyleCircle from 'ol/style/Circle';

export default class Circle extends OLStyleCircle {
  /**
   * @classdesc
   * chart style for vector features
   *
   * @constructor
   * @param {object} options - Options style PointCircle
   * @extends {OLStyleCircle}
   */
  constructor(options = {}) {
    // super call
    super({
      points: Infinity,
      fill: options.fill,
      radius: options.radius,
      snapToPixel: options.snapToPixel,
      stroke: options.stroke,
      atlasManager: options.atlasManager,
    });
  }

  /**
   * clones the style
   * @public
   * @function
   */
  clone() {
    const style = new Circle({
      fill: this.getFill() ? this.getFill().clone() : undefined,
      stroke: this.getStroke() ? this.getStroke().clone() : undefined,
      radius: this.getRadius(),
      atlasManager: this.atlasManager_,
    });
    style.setOpacity(this.getOpacity());
    style.setScale(this.getScale());
    return style;
  }
}
