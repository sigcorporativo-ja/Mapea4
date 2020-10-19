import sqljs from 'sql.js';
import { isNullOrEmpty, bytesToBase64 } from '../util/Utils';

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
      this.getUint8ArrayFromData(data).then((uint8Array) => {
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

  /**
   * @function
   * @param {File|ArrayBuffer|Response|Uint8Array} data
   * @return {Uint8Array}
   */
  getUint8ArrayFromData(data) {
    return new Promise((resolve, reject) => {
      let uint8Array = new Uint8Array();
      if (data instanceof ArrayBuffer) {
        uint8Array = new Uint8Array(data);
      } else if (data instanceof File) {
        data.arrayBuffer().then((buffer) => {
          uint8Array = new Uint8Array(buffer);
          resolve(uint8Array);
        });
      } else if (data instanceof Response) {
        resolve(data.arrayBuffer().then(this.getUint8ArrayFromData));
      } else if (data instanceof Uint8Array) {
        resolve(data);
      } else {
        resolve(uint8Array);
      }
    });
  }
}

export default Tile;
