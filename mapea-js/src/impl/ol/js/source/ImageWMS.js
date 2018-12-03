/**
 * @module M/impl/source/ImageWMS
 */
import OLSourceImageWMS from 'ol/source/ImageWMS';

/**
 * @classdesc
 * Source for WMS servers providing single, untiled images.
 * @api
 */
class ImageWMS extends OLSourceImageWMS {
  /**
   * @constructor
   * @fires ol.source.ImageEvent
   * @extends {ol.source.Image}
   * @param {olx.source.ImageWMSOptions=} optOptions Options.
   * @api stable
   */
  constructor(optOptions = {}) {
    const options = optOptions;

    super(options);
    this.imageLoadFunction_ = options.imageLoadFunction || this.imageLoadFunction;
  }

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  changed() {
    // super changed
    super.changed();
  }

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  imageLoadFunction(image, src) {
    const imageVariable = image;
    imageVariable.getImage().src = `${src}&_=${this.revision_}`;
  }
}

export default ImageWMS;
