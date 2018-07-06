import Utils from "../utils/utils";

export default class ImageWMS extends ol.source.ImageWMS {
  /**
   * @classdesc
   * Source for WMS servers providing single, untiled images.
   *
   * @constructor
   * @fires ol.source.ImageEvent
   * @extends {ol.source.Image}
   * @param {olx.source.ImageWMSOptions=} opt_options Options.
   * @api stable
   */
  constructor(opt_options) {
    super(options);

    let options = opt_options || {};
    if (Utils.isNullOrEmpty(options.imageLoadFunction)) {
      options.imageLoadFunction = ImageWMS.imageLoadFunction.bind(this);
    }
  }

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  changed() {
    // super changed
    super(this, 'changed');
  }

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  imageLoadFunction(image, src) {
    image.getImage().src = src + "&_=" + this.revision_;
  }
}
