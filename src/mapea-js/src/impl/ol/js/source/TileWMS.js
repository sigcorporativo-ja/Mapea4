import Utils from 'facade/js/util/Utils';

export default class TileWMS extends ol.source.TileWMS {
  /**
   * @classdesc
   * Layer source for tile data from WMS servers.
   *
   * @constructor
   * @extends {ol.source.TileImage}
   * @param {olx.source.TileWMSOptions=} opt_options Tile WMS options.
   * @api stable
   */

  constructor(optOptions = {}) {
    super(optOptions);

    if (Utils.isNullOrEmpty(optOptions.tileLoadFunction)) {
      /* eslint-disable */
      optOptions.tileLoadFunction = TileWMS.tileLoadFunction.bind(this);
      /* eslint-enable */
    }
  }

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */

  changed() {
    if (!Utils.isNullOrEmpty(this.tileCache)) {
      this.tileCache.clear();
    }
    // super changed
    super.changed();
  }

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */

  tileLoadFunction(imageTile, src) {
    /* eslint-disable */
    imageTile.getImage().src = `${src}&_= ${this.revision_}`;
    /* eslint-enable */
  }
}
