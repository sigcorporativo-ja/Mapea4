import sqljs from 'sql.js';
import { isNullOrEmpty, bytesToBase64, getUint8ArrayFromData } from '../util/Utils.js';

const DEFAULT_WHITE_TILE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAQAAAD2e2DtAAABu0lEQVR42u3SQREAAAzCsOHf9F6oIJXQS07TxQIABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAgAACwAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAAsAEAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAAgAASAABIAAEAACQAAIAAEgAASAABAAAkAACAABIAAEgAAQAAJAAKg9kK0BATSHu+YAAAAASUVORK5CYII=';

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
    sqljs({
      locateFile: file => `${M.config.SQL_WASM_URL}${file}`,
    }).then((SQL) => {
      getUint8ArrayFromData(data).then((uint8Array) => {
        this.db_ = new SQL.Database(uint8Array);
      });
    }).catch((err) => {
      throw err;
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

  setTile(tileCoord, tile) {
    this.tiles_[tileCoord] = tile;
  }
}

export default Tile;
