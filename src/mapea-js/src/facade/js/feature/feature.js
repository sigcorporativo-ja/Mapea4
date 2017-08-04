goog.provide('M.Feature');
goog.require('M.facade.Base');

(function() {
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
  M.Feature = (function(id, geojson, style) {
    this.style_ = style;

    /**
     * GeoJSON format
     * @private
     * @type {M.format.GeoJSON}
     */
    this.formatGeoJSON_ = new M.format.GeoJSON();

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
   * TODO
   */
  M.Feature.prototype.addTo = function(layer) {
    if (layer instanceof M.layer.Vector) {
      this.getImpl().addTo(layer);
    }
  };

  /**
   * This function set id
   *
   * @public
   * @function
   * @param {string} id - ID to feature
   * @api stable
   */
  M.Feature.prototype.setId = function(id) {
    this.getImpl().setId(id);
  };

  /**
   * This function return id feature
   *
   * @public
   * @function
   * @return {string} ID to feature
   * @api stable
   */
  M.Feature.prototype.getId = function() {
    return this.getImpl().getId();
  };

  /**
   * This function return geometry feature
   *
   * @public
   * @function
   * @return {object} Geometry feature
   * @api stable
   */
  M.Feature.prototype.getGeometry = function() {
    return this.getGeoJSON().geometry;
  };

  /**
   * This function set geometry feature
   *
   * @public
   * @function
   * @param {object} Geometry feature
   * @api stable
   */
  M.Feature.prototype.setGeometry = function(geometry) {
    this.getImpl().setGeometry(geometry);
  };

  /**
   * This function return geojson feature
   *
   * @public
   * @function
   * @return {Object} geojson feature
   * @api stable
   */
  M.Feature.prototype.getGeoJSON = function() {
    return this.formatGeoJSON_.write(this)[0];
  };

  /**
   * This function return attributes feature
   *
   * @public
   * @function
   * @return {Object} attributes feature
   * @api stable
   */
  M.Feature.prototype.getAttributes = function() {
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
  M.Feature.prototype.setAttributes = function(attributes) {
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
  M.Feature.prototype.getAttribute = function(attribute) {
    let attrValue;

    attrValue = this.getImpl().getAttribute(attribute);
    if (M.utils.isNullOrEmpty(attrValue)) {
      // we look up the attribute by its path. Example: getAttribute('foo.bar.attr')
      // --> return feature.properties.foo.bar.attr value
      let attrPath = attribute.split('.');
      if (attrPath.length > 1) {
        attrValue = attrPath.reduce((obj, attr) => !M.utils.isNullOrEmpty(obj) ? ((obj instanceof M.Feature) ? obj.getAttribute(attr) : obj[attr]) : undefined, this);
      }
    }

    return attrValue;
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
  M.Feature.prototype.setAttribute = function(attribute, value) {
    return this.getImpl().setAttribute(attribute, value);
  };

  /**
   * TODO
   */
  // REVISION #86837 guardar el style
  M.Feature.prototype.setStyle = function(style) {
    style.applyToFeature(this);
  };

  // REVISION #86837 implementar getStyle
})();
