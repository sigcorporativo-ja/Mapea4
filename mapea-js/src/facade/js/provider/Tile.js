import sqljs from 'sql.js';
import { inflate } from 'pako';
import { isNullOrEmpty, bytesToBase64, getUint8ArrayFromData } from '../util/Utils.js';

export const DEFAULT_WHITE_TILE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAQAAAD2e2DtAAABu0lEQVR42u3SQREAAAzCsOHf9F6oIJXQS07TxQIABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAgAACwAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAAsAEAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAKg9kK0BATSHu+YAAAAASUVORK5CYII=';

/**
 * @classdesc
 */
class Tile {
  /**
   * @constructor
   * @param {ArrayBuffer} data
   */
  constructor(data) {
    this.tiles_ = {};
    this.db_ = null;
    this.init(data);
  }

  init(data) {
    this.initPromise_ = new Promise((resolve, reject) => {
      sqljs({
        locateFile: file => `${M.config.SQL_WASM_URL}${file}`,
      }).then((SQL) => {
        getUint8ArrayFromData(data).then((uint8Array) => {
          this.db_ = new SQL.Database(uint8Array);
          resolve(this.db_);
        });
      }).catch((err) => {
        reject(err);
      });
    });
  }

  executeQuery(query) {
    return this.initPromise_.then((db) => {
      return db.exec(query)[0];
    });
  }

  getTile(tileCoord) {
    const SELECT_SQL = 'select tile_data from tiles where zoom_level={z} and tile_column={x} and tile_row={y}';
    const PREPARED = SELECT_SQL.replace('{z}', tileCoord[0]).replace('{x}', tileCoord[1]).replace('{y}', tileCoord[2]);
    let byteTile = this.tiles_[tileCoord] || null;
    let tile = DEFAULT_WHITE_TILE;
    if (this.db_ && !byteTile) {
      const select = this.db_.exec(PREPARED)[0];
      if (!isNullOrEmpty(select)) {
        byteTile = select.values[0][0];
        tile = bytesToBase64(byteTile);
      }
    }
    this.setTile(tileCoord, tile);
    return tile;
  }

  getVectorTile(tileCoord) {
    const SELECT_SQL = 'select tile_data from tiles where zoom_level={z} and tile_column={x} and tile_row={y}';
    const PREPARED = SELECT_SQL.replace('{z}', tileCoord[0]).replace('{x}', tileCoord[1]).replace('{y}', tileCoord[2]);
    let vectorTile;
    let cacheVectorTile = this.tiles_[tileCoord] || null;
    if (!cacheVectorTile) {
      cacheVectorTile = this.executeQuery(PREPARED).then((result) => {
        if (!isNullOrEmpty(result)) {
          vectorTile = result.values[0][0];
          vectorTile = inflate(vectorTile);
        }
        this.setTile(tileCoord, vectorTile);
        return vectorTile;
      });
    } else {
      cacheVectorTile = new Promise(resolve => resolve(cacheVectorTile));
    }
    return cacheVectorTile;
  }

  setTile(tileCoord, tile) {
    this.tiles_[tileCoord] = tile;
  }

  getExtent() {
    let extent = null;
    const SELECT_SQL = 'select value from metadata where name="bounds"';
    return this.executeQuery(SELECT_SQL).then((result) => {
      if (result) {
        const value = result.values[0][0];
        extent = value.split(',').map(Number.parseFloat);
      }
      return extent;
    });
  }

  getFormat() {
    let format = 'png';
    const SELECT_SQL = 'select value from metadata where name="format"';
    return this.executeQuery(SELECT_SQL).then((result) => {
      if (result) {
        format = result.values[0][0];
      }
      return format;
    });
  }

  getZoomLevels() {
    let zoomLevels = 16;
    const SELECT_SQL = 'select count(*) from (select zoom_level from tiles group by zoom_level)';
    return this.executeQuery(SELECT_SQL).then((result) => {
      if (result) {
        zoomLevels = result.values[0][0];
      }
      return zoomLevels;
    });
  }
}

export default Tile;
