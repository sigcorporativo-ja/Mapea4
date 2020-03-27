/**
 * @module M/impl/source/TileWMS
 */
import { isNullOrEmpty } from 'M/util/Utils';
import OLSourceTileWMS from 'ol/source/TileWMS';
import { getParameterValue } from 'M/util/Utils';

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
    const ticket = getParameterValue('ticket', M.config.PROXY_URL);
    imageTile.getImage().src = `${src}&ticket=${ticket}&_=${this.revision_}`;
  }
}

export default TileWMS;
