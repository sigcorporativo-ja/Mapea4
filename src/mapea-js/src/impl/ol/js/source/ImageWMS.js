import Utils from 'facade/js/util/Utils';

export default class ImageWMS extends ol.source.ImageWMS {
  /**
   * @classdesc
   * Source for WMS servers providing single, untiled images.
   *
   * @constructor
   * @fires ol.source.ImageEvent
   * @extends {ol.source.Image}
   * @param {olx.source.ImageWMSOptions=} optOptions Options.
   * @api stable
   */
  constructor(optOptions = {}) {
    const options = optOptions;

    super(options);

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
