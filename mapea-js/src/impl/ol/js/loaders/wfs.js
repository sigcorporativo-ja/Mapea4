goog.provide('M.impl.loader.WFS');

/**
 * @namespace M.impl.control
 */
(function () {
  /**
   * @classdesc TODO
   * control
   * @param {function} element template of this control
   * @param {M.Map} map map to add the plugin
   * @constructor
   * @extends {M.Object}
   * @api stable
   */
  M.impl.loader.WFS = function (map, service, format) {
    /**
     * TODO
     * @private
     * @type {M.Map}
     */
    this.map_ = map;

    /**
     * TODO
     * @private
     * @type {M.impl.service.WFS}
     */
    this.service_ = service;

    /**
     * TODO
     * @private
     * @type {M.impl.format.GeoJSON | M.impl.format.GML}
     */
    this.format_ = format;

    goog.base(this);
  };
  goog.inherits(M.impl.loader.WFS, M.Object);

  /**
   * This function destroys this control, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.loader.WFS.prototype.getLoaderFn = function (callback) {
    var this_ = this;
    return (function (extent, resolution, projection) {
      var requestUrl = this_.getRequestUrl_(extent, projection);
      this_.loadInternal_(requestUrl, projection).then(callback.bind(this));
    });
  };

  /**
   * TODO
   *
   * @private
   * @function
   */
  M.impl.loader.WFS.prototype.loadInternal_ = function (url, projection) {
    var this_ = this;
    return (new Promise(function (success, fail) {
      M.remote.get(url).then(function (response) {
        if (!M.utils.isNullOrEmpty(response.text) && response.text.indexOf("ServiceExceptionReport") < 0) {
          var features = this_.format_.readFeatures(response.text, {
            featureProjection: projection
          });
          success(features);
        }
        else {
          if (response.code === 401) {
            M.dialog.error('Ha ocurrido un error al cargar la capa: Usuario no autorizado.');
          }
          else if (response.text.indexOf("featureId and cql_filter") >= 0) {
            M.dialog.error('FeatureID y CQL son mutuamente excluyentes. Indicar sólo un tipo de filtrado.');
          }
          else {
            M.exception('No hubo respuesta en la operación GetFeature');
          }
        }
      });
    }));
  };

  /**
   * TODO
   *
   * @private
   * @function
   */
  M.impl.loader.WFS.prototype.getRequestUrl_ = function (extent, projection) {
    // var mapBbox = this.map_.getBbox();
    // var minExtent = [
    //    Math.min(Math.abs(extent[0]), mapBbox.x.min),
    //    Math.min(Math.abs(extent[1]), mapBbox.y.min),
    //    Math.min(Math.abs(extent[2]), mapBbox.x.max),
    //    Math.min(Math.abs(extent[3]), mapBbox.y.max)
    // ];

    // return this.service_.getFeatureUrl(minExtent, projection);
    return this.service_.getFeatureUrl(null, projection);
  };
})();
