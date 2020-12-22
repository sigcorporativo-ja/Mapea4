import { GeoPackageTileRetriever } from '@ngageoint/geopackage';
import AbstractProvider from './AbstractProvider.js';
import { isNumber } from '../util/Utils.js';

/**
 * @classdesc
 */
class GeoPackageTile extends AbstractProvider {
  constructor(connector, tableName, options) {
    super(connector, tableName, options);

    /**
     * Tile width
     * @private
     * @type {number}
     */
    this.tileWidth_ = isNumber(this.options_.width) ? this.options_.width : 256;

    /**
     * Tile width
     * @private
     * @type {number}
     */
    this.tileHeight_ = isNumber(this.options_.height) ? this.options_.height : 256;
  }

  getTile(x, y, z) {
    const dao = this.connector_.getTileDao(this.tableName_);
    const tileRetriever = new GeoPackageTileRetriever(dao, this.tileWidth_, this.tileHeight_);
    return tileRetriever.getTile(x, y, z);
  }

  getExtent() {
    const dao = this.connector_.getTileDao(this.tableName_);
    return [
      dao.tileMatrixSet.min_x,
      dao.tileMatrixSet.min_y,
      dao.tileMatrixSet.max_x,
      dao.tileMatrixSet.max_y,
    ];
  }

  getMinZoom() {
    const dao = this.connector_.getTileDao(this.tableName_);
    return dao.minWebMapZoom;
  }

  getMaxZoom() {
    const dao = this.connector_.getTileDao(this.tableName_);
    return dao.maxWebMapZoom;
  }
}

export default GeoPackageTile;
