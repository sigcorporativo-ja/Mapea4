goog.provide('M.Feature');
goog.require('M.facade.Base');
goog.require('M.utils');
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

    /**
     * Style of feature
     * @private
     * @type {M.style.Feature}
     */

    this.style_ = null;

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

    this.setStyle(style);
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
   * This function set style feature
   *
   * @public
   * @function
   * @param {M.style.Feature}
   * @api stable
   */
  M.Feature.prototype.setStyle = function(style) {
    if (!M.utils.isNullOrEmpty(style) || style instanceof M.style.Feature) {
      this.style_ = style;
    }
    else {
      let geom = this.getGeometry();
      if (!M.utils.isNullOrEmpty(geom)) {
        if (geom.type === M.geom.geojson.type.POINT || geom.type === M.geom.geojson.type.MULTI_POINT) {
          this.style_ = new M.style.Point();
        }
        else if (geom.type === M.geom.geojson.type.LINE_STRING || geom.type === M.geom.geojson.type.MULTI_LINE_STRING) {
          this.style_ = new M.style.Line();
        }
        else if (geom.type === M.geom.geojson.type.POLYGON || geom.type === M.geom.geojson.type.MULTI_POLYGON) {
          this.style_ = new M.style.Polygon();
        }
        else {
          // Provisional (¿Que estilo debería ponerse?)
          this.style_ = new M.style.Point();
        }
      }
      else {
        // En caso de los iconos, al clickar, si no se define algun estilo
        // lanza un error (provisional)
        this.style_ = new M.style.Point();

      }
    }
    this.style_.applyToFeature(this);
  };


  /**
   * This function returns style feature
   *
   * @public
   * @function
   * @return {M.style.Feature} returns the style feature
   * @api stable
   */
  M.Feature.prototype.getStyle = function() {
    return this.style_;
  };
})();
