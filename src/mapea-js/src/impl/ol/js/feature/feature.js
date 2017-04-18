goog.provide('M.impl.Feature');


(function () {
  /**
   * @classdesc
   * Main constructor of the class. Creates a KML layer
   * with parameters specified by the user
   *
   * @constructor
   * @implements {M.impl.Layer}
   * @param {Mx.parameters.LayerOptions} options custom options for this layer
   * @api stable
   */
  M.impl.Feature = (function (id, geojson, options) {
    let geom = new ol.geom[geojson.geometry.type](geojson.geometry.coordinates.map(coord => ol.proj.transform(coord, 'EPSG:23030', 'EPSG:23030')));
    // geojson.properties.geometry = geom;
    /**
     * ol feature
     * @private
     * @type {ol.Feature}
     */
    this.olFeature_ = new ol.Feature({
      geometry: geom
    } /*geojson.properties*/ );
    if (!M.utils.isNullOrEmpty(geojson.properties)) {
      this.olFeature_.setProperties(geojson.properties);
    }

    this.olFeature_.setId(id);

    if (M.utils.isNullOrEmpty(options) || !M.utils.isObject(options)) {
      options = {};
    }

    if (!M.utils.isNullOrEmpty(options.ol_uid)) {
      this.olFeature_.ol_uid = options.ol_uid;
    }

    if (!M.utils.isNullOrEmpty(options.style)) {
      this.olFeature_.setStyle(options.style);
    }

    // funcion para formatear de un objeto original al feature de la implementacion (en este caso ol.Feature)
    if (!M.utils.isNullOrEmpty(options.implFormat) && typeof options.implFormat === 'function') {
      options.implFormat(this.olFeature_);
    }
  });

  M.impl.Feature.prototype.getOLFeature = function () {
    return this.olFeature_;
  };

  M.impl.Feature.prototype.setOLFeature = function (ol) {
    this.olFeature_ = ol;
  };



})();
