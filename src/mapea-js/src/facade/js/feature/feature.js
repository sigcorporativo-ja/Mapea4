goog.provide('M.Feature');
goog.require('M.facade.Base');

(function () {
  /**
   * @classdesc
   * Main constructor of the class. Create a Feature
   *
   * @constructor
   * @extends {M.facade.Base}
   * @param {string} id - id to feature
   * @param {Object} geojson - geojson to feature
   * @api stable
   */
  M.Feature = (function (id, geojson, style) {
    this.id_ = id;
    this.GeoJSON_ = geojson;
    this.style_ = style;

    /**
     * Implementation of feature
     * @public
     * @type {M.impl.Feature}
     */
    var impl = new M.impl.Feature(id, geojson, style);

    goog.base(this, impl);
  });
  goog.inherits(M.Feature, M.facade.Base);

  /**
   * This function set id
   *
   * @public
   * @function
   * @param {string} id - ID to feature
   * @api stable
   */
  M.Feature.prototype.setId = function (id) {
    this.id = id;
  };

  /**
   * This function return id feature
   *
   * @public
   * @function
   * @return {string} ID to feature
   * @api stable
   */
  M.Feature.prototype.getId = function () {
    return this.id;
  };

  /**
   * This function return geometry feature
   *
   * @public
   * @function
   * @return {Object} geometry feature
   * @api stable
   */
  M.Feature.prototype.getGeometry = function () {
    return this.GeoJSON_.geometry;
  };

  /**
   * This function return geojson feature
   *
   * @public
   * @function
   * @return {Object} geojson feature
   * @api stable
   */
  M.Feature.prototype.getGeoJSON = function () {
    return this.GeoJSON_;
  };

  /**
   * This function set geojson to feature
   *
   * @public
   * @function
   * @api stable
   */
  M.Feature.prototype.setGeoJSON = function (GeoJSON) {
    this.GeoJSON_ = GeoJSON;
  };

  /**
   * This function return attributes feature
   *
   * @public
   * @function
   * @return {Object} attributes feature
   * @api stable
   */
  M.Feature.prototype.getAttributes = function () {
    return this.getImpl().getAttributes();
  };

  /**
   * This function set attributes feature
   *
   * @public
   * @function
   * @param {Object} attributes - attributes to feature
   * @api stable
   */
  M.Feature.prototype.setAttributes = function (attributes) {
    if (typeof attributes === "object") {
      this.getImpl().setAttributes(attributes);
    }
    else {
      M.dialog.info("No se han especificado correctamente los atributos.");
    }
  };

  /**
   * This function returns the value of the indicated attribute
   *
   * @public
   * @function
   * @param {string} attribute - Name attribute
   * @return  {string|number|object} returns the value of the indicated attribute
   * @api stable
   */
  M.Feature.prototype.getAttribute = function (attribute) {
    return this.getImpl().getAttribute(attribute);
  };

  /**
   * This function set value the value of the indicated attribute
   *
   * @public
   * @function
   * @param {string} attribute - Name attribute
   * @return  {string|number|object} returns the value of the indicated attribute
   * @api stable
   */
  M.Feature.prototype.setAttribute = function (attribute, value) {
    return this.getImpl().setAttribute(attribute, value);
  };

})();
