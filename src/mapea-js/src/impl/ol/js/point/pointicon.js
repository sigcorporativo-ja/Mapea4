goog.provide('M.impl.style.PointIcon');

goog.require('goog.style');
goog.require('ol.style.Icon');

/**
 * @namespace M.impl.style.PointIcon
 */
export default class PointCircle extends ol.style.Icon {
  /**
   * @classdesc
   * chart style for vector features
   *
   * @constructor
   * @param {object} options - Options style PointIcon
   * @extends {ol.style.Icon}
   * @api stable
   */
  constructor(options = {}) {
    // super call
    ol.style.Icon.call(this, {
      anchor: !options.anchor ? undefined : options.anchor.slice(),
      anchorOrigin: options.anchorOrigin,
      anchorXUnits: options.anchorXUnits,
      anchorYUnits: options.anchorYUnits,
      crossOrigin: options.crossOrigin || null,
      color: (options.color && options.color.slice) ? options.color.slice() : options.color || undefined,
      src: options.src,
      offset: !options.offset ? undefined : options.offset.slice(),
      offsetOrigin: options.offsetOrigin,
      size: !options.size ? undefined : options.size.slice(),
      imgSize: options.imgSize,
      opacity: options.opacity,
      scale: options.scale,
      snapToPixel: options.snapToPixel,
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
  M.impl.style.PointIcon.prototype.clone = function() {
    return new PointIcon({
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
      snapToPixel: this.getSnapToPixel(),
      rotation: this.getRotation(),
      rotateWithView: this.getRotateWithView()
    });
  }
}
