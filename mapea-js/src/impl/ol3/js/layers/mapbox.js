goog.provide('M.impl.layer.Mapbox');

goog.require('M.utils');
goog.require('M.exception');
goog.require('M.impl.Layer');
goog.require('M.impl.source.Mapbox');

goog.require('ol.layer.Tile');
//goog.require('ol.source.XYZ');

(function () {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WMS layer
   * with parameters specified by the user
   *
   * @constructor
   * @implements {M.impl.Layer}
   * @param {Mx.parameters.LayerOptions} options custom options for this layer
   * @api stable
   */
  M.impl.layer.Mapbox = (function (userParameters, options) {
    /**
     * Layer resolutions
     * @private
     * @type {Array<Number>}
     */
    this.resolutions_ = null;

    // sets visibility
    if (options.visibility === false) {
      this.visibility = false;
    }

    // calls the super constructor
    goog.base(this, options);
  });
  goog.inherits(M.impl.layer.Mapbox, M.impl.Layer);

  /**
   * This function sets the visibility of this layer
   *
   * @function
   * @api stable
   */
  M.impl.layer.Mapbox.prototype.setVisible = function (visibility) {
    if (this.inRange() === true) {
      this.visibility = visibility;

      // if this layer is base then it hides all base layers
      if ((visibility === true) && (this.transparent !== true)) {
        this.map.getBaseLayers().forEach(function (layer) {
          this.ol3Layer.setVisible(false);
        });
      }

      if (!M.utils.isNullOrEmpty(this.ol3Layer)) {
        this.ol3Layer.setVisible(visibility);
      }
    }
  };

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.impl.Map} map
   * @api stable
   */
  M.impl.layer.Mapbox.prototype.addTo = function (map) {
    this.map = map;

    this.ol3Layer = new ol.layer.Tile({
      source: new M.impl.source.Mapbox({
        'name': this.name
      })
    });

    this.map.getMapImpl().addLayer(this.ol3Layer);

    // sets its visibility if it is in range
    if (this.options.visibility !== false) {
      this.setVisible(this.inRange());
    }
    if (this.zIndex_ !== null) {
      this.setZIndex(this.zIndex_);
    }
    // sets the resolutions
    if (this.resolutions_ !== null) {
      this.setResolutions(this.resolutions_);
    }
  };

  /**
   * This function sets the resolutions for this layer
   *
   * @public
   * @function
   * @param {Array<Number>} resolutions
   * @api stable
   */
  M.impl.layer.Mapbox.prototype.setResolutions = function (resolutions) {
    this.resolutions_ = resolutions;

    if (!M.utils.isNullOrEmpty(this.ol3Layer)) {
      // gets the extent
      var this_ = this;
      (new Promise(function (success, fail) {
        // gets the extent
        var extent = this_.map.getMaxExtent();
        if (!M.utils.isNullOrEmpty(extent)) {
          success.call(this_, extent);
        }
        else {
          M.impl.envolvedExtent.calculate(this_.map, this_).then(success);
        }
      })).then(function (extent) {
        var olExtent = [extent.x.min, extent.y.min, extent.x.max, extent.y.max];

        var newSource = new M.impl.source.Mapbox({
          name: this_.name,
          tileGrid: new ol.tilegrid.TileGrid({
            resolutions: resolutions,
            extent: olExtent,
            origin: ol.extent.getBottomLeft(olExtent)
          }),
          extent: olExtent
        });
        this_.ol3Layer.setSource(newSource);
      });
    }
  };

  /**
   * This function gets the envolved extent for
   * this WMS
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.layer.Mapbox.prototype.getExtent = function () {
    var extent = null;
    if (!M.utils.isNullOrEmpty(this.ol3Layer)) {
      extent = ol.proj.get(this.map.getProjection().code).getExtent();
    }
    return extent;
  };

  /**
   * This function destroys this layer, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.layer.Mapbox.prototype.destroy = function () {
    var olMap = this.map.getMapImpl();
    if (!M.utils.isNullOrEmpty(this.ol3Layer)) {
      olMap.removeLayer(this.ol3Layer);
      this.ol3Layer = null;
    }
    this.map = null;
  };

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api stable
   */
  M.impl.layer.Mapbox.prototype.equals = function (obj) {
    var equals = false;

    if (obj instanceof M.impl.layer.Mapbox) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
    }

    return equals;
  };
})();
