/**
 * @module M/impl/source/TileWMS
 */
import { isNullOrEmpty } from 'M/util/Utils';
import OLSourceTileWMS from 'ol/source/TileWMS';
/**
 * @classdesc
 * Layer source for tile data from WMS servers.
 * @api
 */
class TileWMS extends OLSourceTileWMS {
  /**
   * @constructor
   * @extends {ol.source.TileImage}
   * @param {olx.source.TileWMSOptions=} opt_options Tile WMS options.
   * @api stable
   */

  constructor(optOptions = {}) {
    const options = optOptions;
    if (isNullOrEmpty(optOptions.tileLoadFunction)) {
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
    if (!isNullOrEmpty(this.tileCache)) {
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
    imageTile.getImage().src = `${src}&_=${this.revision_}`;
    if (M.config.ticket != null) {
      imageTile.getImage().src += `&ticket=${M.config.ticket}`;
    }
  }
}

export default TileWMS;
