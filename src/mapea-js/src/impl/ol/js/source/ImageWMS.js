/**
 * @classdesc
 * Source for WMS servers providing single, untiled images.
 */
export default class ImageWMS extends ol.source.ImageWMS {
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
