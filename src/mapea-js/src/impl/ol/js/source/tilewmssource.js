goog.provide('M.impl.source.TileWMS');

goog.require('ol.source.TileWMS');

/**
 * @classdesc
 * Layer source for tile data from WMS servers.
 *
 * @constructor
 * @extends {ol.source.TileImage}
 * @param {olx.source.TileWMSOptions=} opt_options Tile WMS options.
 * @api stable
 */
M.impl.source.TileWMS = function (opt_options) {

  var options = opt_options || {};
  if (M.utils.isNullOrEmpty(options.tileLoadFunction)) {
    options.tileLoadFunction = M.impl.source.TileWMS.tileLoadFunction.bind(this);
  }
  goog.base(this, options);
};
goog.inherits(M.impl.source.TileWMS, ol.source.TileWMS);

/**
 * TODO
 * @public
 * @function
 * @api stable
 */
M.impl.source.TileWMS.prototype.changed = function () {
  if (!M.utils.isNullOrEmpty(this.tileCache)) {
    this.tileCache.clear();
  }
  // super changed
  goog.base(this, 'changed');
};

/**
 * TODO
 * @public
 * @function
 * @api stable
 */
M.impl.source.TileWMS.tileLoadFunction = function (imageTile, src) {
  imageTile.getImage().src = src + "&_=" + this.revision_;
};
