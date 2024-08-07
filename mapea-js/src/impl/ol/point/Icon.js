import OLStyleIcon from 'ol/style/Icon';

export default class Icon extends OLStyleIcon {
  /**
   * @classdesc
   * chart style for vector features
   *
   * @constructor
   * @param {object} options - Options style PointIcon
   * @extends {OLStyleIcon}
   */
  constructor(options = {}) {
    // super call
    super({
      anchor: !options.anchor ? undefined : options.anchor.slice(),
      anchorOrigin: options.anchorOrigin,
      anchorXUnits: options.anchorXUnits,
      anchorYUnits: options.anchorYUnits,
      crossOrigin: options.crossOrigin || null,
      color: (options.color && options.color.slice)
        ? options.color.slice() : options.color || undefined,
      src: options.src,
      offset: !options.offset ? undefined : options.offset.slice(),
      offsetOrigin: options.offsetOrigin,
      size: !options.size ? undefined : options.size.slice(),
      imgSize: options.imgSize,
      opacity: options.opacity,
      scale: options.scale,
      snapToPixel: options.snapToPixel,
      rotation: options.rotation,
      rotateWithView: options.rotateWithView,
    });
  }

  /**
   * clones the style
   * @public
   * @function
   */
  clone() {
    return new Icon({
      anchor: this.anchor_.slice(),
      anchorOrigin: this.anchorOrigin_,
      anchorXUnits: this.anchorXUnits_,
      anchorYUnits: this.anchorYUnits_,
      crossOrigin: this.crossOrigin_,
      color: (this.color_ && this.color_.slice) ? this.color_.slice() : this.color_ || undefined,
      src: this.getSrc(),
      offset: this.offset_.slice(),
      offsetOrigin: this.offsetOrigin_,
      size: this.size_ !== null ? this.size_.slice() : undefined,
      opacity: this.getOpacity(),
      scale: this.getScale(),
      rotation: this.getRotation(),
      rotateWithView: this.getRotateWithView(),
    });
  }

  /**
   * Setter size
   */
  set size(value) {
    this.size_ = Array.isArray(value) ? value : null;
  }

  /**
   * Setter anchor
   */
  set anchor(value) {
    this.anchor_ = Array.isArray(value) ? value : null;
  }

  /**
   * Setter anchor
   */
  set origin(value) {
    this.origin_ = Array.isArray(value) ? value : null;
  }
}
