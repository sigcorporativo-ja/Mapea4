goog.provide('M.impl.Feature');

(function () {
  /**
   * @classdesc
   * Main constructor of the class. Create a Feature
   *
   * @constructor
   * @implements {M.impl.Layer}
   * @param {string} id - id to feature
   * @param {Object} geojson - geojson to feature
   * @api stable
   */
  M.impl.Feature = (function (id, geojson, style) {
    if (!M.utils.isNullOrEmpty(geojson)) {
      let formatter = new M.impl.format.GeoJSON();
      if (M.utils.isNullOrEmpty(geojson.type)) {
        geojson.type = "Feature";
      }
      this.olFeature_ = formatter.readFeature(geojson);
    }
    else {
      this.olFeature_ = new ol.Feature();
    }
    if (!M.utils.isNullOrEmpty(id)) {
      this.olFeature_.setId(id);
    }
    else if (M.utils.isNullOrEmpty(this.olFeature_.getId())) {
      this.olFeature_.setId(M.utils.generateRandom('mapea_feature_'));
    }
    if (!M.utils.isNullOrEmpty(style)) {
      this.getOLFeature().setStyle(style);
    }
  });

  /**
   * This function returns the openlayers object of the features
   * @public
   * @function
   * @return {ol.Feature} returns the openlayers object of the features
   * @api stable
   */
  M.impl.Feature.prototype.getOLFeature = function () {
    return this.olFeature_;
  };

  /**
   * This function set the openlayers object of the features
   * @public
   * @param {ol.Feature} olFeature - ol Feature to feature
   * @function
   * @api stable
   */
  M.impl.Feature.prototype.setOLFeature = function (olFeature) {
    if (!M.utils.isNullOrEmpty(olFeature)) {
      this.olFeature_ = olFeature;
      if (M.utils.isNullOrEmpty(this.olFeature_.getId())) {
        this.olFeature_.setId(M.utils.generateRandom('mapea_feature_'));
      }
    }
  };

  /**
   * This function return attributes feature
   * @public
   * @return {Object} Attributes feature
   * @function
   * @api stable
   */
  M.impl.Feature.prototype.getAttributes = function () {
    return this.olFeature_.getProperties();
  };

  /**
   * This function return id feature
   *
   * @public
   * @function
   * @return {string} ID to feature
   * @api stable
   */
  M.impl.Feature.prototype.getId = function () {
    return this.olFeature_.getId();
  };

  /**
   * This function set attributes feature
   *
   * @public
   * @function
   * @param {Object} attributes - attributes to feature
   * @api stable
   */
  M.impl.Feature.prototype.setAttributes = function (attributes) {
    this.olFeature_.setProperties(attributes);
  };

  /**
   * This funcion transform ol.Feature to M.Feature
   *
   * @public
   * @function
   * @param {ol.Feature} olFeature - ol.Feature
   * @return {M.Feature}  facadeFeature - M.Feature
   * @api stable
   */
  M.impl.Feature.olFeature2Facade = function (olFeature) {
    //let featureStyle = null;
    let facadeFeature = null;
    if (!M.utils.isNullOrEmpty(olFeature)) {
      facadeFeature = new M.Feature();
      facadeFeature.getImpl().setOLFeature(olFeature);
    }
    return facadeFeature;
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
  M.impl.Feature.prototype.getAttribute = function (attribute) {
    return this.olFeature_.get(attribute);
  };

  /**
   * This function set value of the indicated attribute
   *
   * @public
   * @function
   * @param {string} attribute - Name attribute
   * @return  {string|number|object} returns the value of the indicated attribute
   * @api stable
   */
  M.impl.Feature.prototype.setAttribute = function (attribute, value) {
    return this.olFeature_.set(attribute, value);
  };
})();
