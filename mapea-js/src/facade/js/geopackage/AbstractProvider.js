/**
 * @classdesc
 */
class GeoPackageAbstractProvider {
  constructor(connector, tableName, options = {}) {
    /**
     * GeoPacakage connector
     * @private
     * @type {geopackage/GeoPackage}
     */
    this.connector_ = connector;

    /**
     * Name of table layer
     * @private
     * @type {string}
     */
    this.tableName_ = tableName;

    /**
     * User options
     * @private
     * @type {object}
     */
    this.options_ = options;
  }

  /**
   * This function gets the name of table layer.
   * @function
   * @return {string}
   */
  getTableName() {
    return this.tableName_;
  }

  /**
   * This function gets the user options
   * @function
   * @return {object}
   */
  getOptions() {
    return this.options_;
  }
}

export default GeoPackageAbstractProvider;
