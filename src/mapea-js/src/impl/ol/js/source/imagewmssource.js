goog.provide('M.impl.source.ImageWMS');

goog.require('ol.source.ImageWMS');

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
M.impl.source.ImageWMS = function (opt_options) {

  var options = opt_options || {};
  if (M.utils.isNullOrEmpty(options.imageLoadFunction)) {
    options.imageLoadFunction = M.impl.source.ImageWMS.imageLoadFunction.bind(this);
  }
  goog.base(this, options);
};
goog.inherits(M.impl.source.ImageWMS, ol.source.ImageWMS);

/**
 * TODO
 * @public
 * @function
 * @api stable
 */
M.impl.source.ImageWMS.prototype.changed = function () {
  // super changed
  goog.base(this, 'changed');
};

/**
 * TODO
 * @public
 * @function
 * @api stable
 */
M.impl.source.ImageWMS.imageLoadFunction = function (image, src) {
  image.getImage().src = src + "&_=" + this.revision_;
};
