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
    const options = optOptions;
    if (Utils.isNullOrEmpty(optOptions.tileLoadFunction)) {
      options.tileLoadFunction = TileWMS.tileLoadFunction;
    }
    super(options);
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
  static tileLoadFunction(imageTileParam, src) {
    const imageTile = imageTileParam;
    imageTile.getImage().src = `${src}&_= ${this.revision_}`;
  }
}
