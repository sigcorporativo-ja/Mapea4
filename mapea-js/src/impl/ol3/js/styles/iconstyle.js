goog.provide('M.impl.style.Icon');

goog.require('ol.style.Icon');


/**
 * @classdesc
 * Set icon style for vector features.
 *
 * @constructor
 * @param {olx.style.IconOptions=} opt_options Options.
 * @extends {ol.style.Icon}
 * @api
 */
M.impl.style.Icon = function (opt_options) {
   goog.base(this, opt_options);
};
goog.inherits(M.impl.style.Icon, ol.style.Icon);


/**
 * Real Image size used.
 * @public
 * @return {ol.Size} Size.
 * @api stable
 * @expose
 */
M.impl.style.Icon.prototype.getImageSize = function () {
   return this.iconImage_.getSize();
};