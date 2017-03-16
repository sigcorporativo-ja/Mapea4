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

    //Añadir plugin attributions
    this.hasAttributtion = false;

    //Tiene alguna capa que necesite el attributions
    this.haveOSMorMapboxLayer = false;

    // sets visibility
    if (options.visibility === false) {
      this.visibility = false;
    }

    // calls the super constructor
    goog.base(this, options);

    this.zIndex_ = M.impl.Map.Z_INDEX[M.layer.type.Mapbox];
  });
  goog.inherits(M.impl.layer.Mapbox, M.impl.Layer);

  /**
   * This function sets the visibility of this layer
   *
   * @function
   * @api stable
   */
  M.impl.layer.Mapbox.prototype.setVisible = function (visibility) {
    this.visibility = visibility;
    if (this.inRange() === true) {
      // if this layer is base then it hides all base layers
      if ((visibility === true) && (this.transparent !== true)) {
        // hides all base layers
        this.map.getBaseLayers().forEach(function (layer) {
          if (!layer.equals(this) && layer.isVisible()) {
            layer.setVisible(false);
          }
        });

        // set this layer visible
        if (!M.utils.isNullOrEmpty(this.ol3Layer)) {
          this.ol3Layer.setVisible(visibility);
        }

        // updates resolutions and keep the bbox
        var oldBbox = this.map.getBbox();
        this.map.getImpl().updateResolutionsFromBaseLayer();
        if (!M.utils.isNullOrEmpty(oldBbox)) {
          this.map.setBbox(oldBbox);
        }
      }
      else if (!M.utils.isNullOrEmpty(this.ol3Layer)) {
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
        'url': this.url,
        'name': this.name,
        'accessToken': this.accessToken
      })
    });

    this.map.getMapImpl().addLayer(this.ol3Layer);

    this.map.getMapImpl().getControls().getArray().forEach(function (cont) {
      if (cont instanceof ol.control.Attribution) {
        this.hasAttributtion = true;
      }
    }, this);
    if (!this.hasAttributtion) {
      this.map.getMapImpl().addControl(new ol.control.Attribution({
        className: 'ol-attribution ol-unselectable ol-control ol-collapsed m-attribution'
      }));
      this.hasAttributtion = false;
    }

    // recalculate resolutions
    this.resolutions_ = M.utils.generateResolutionsFromExtent(this.getExtent(), this.map.getMapImpl().getSize(), 16, this.map.getProjection().units);

    // sets its visibility if it is in range
    if (this.isVisible() && !this.inRange()) {
      this.setVisible(false);
    }
    if (this.zIndex_ !== null) {
      this.setZIndex(this.zIndex_);
    }
    // sets the resolutions
    if (this.resolutions_ !== null) {
      this.setResolutions(this.resolutions_);
    }
    // activates animation for base layers or animated parameters
    let animated = ((this.transparent === false) || (this.options.animated === true));
    this.ol3Layer.set("animated", animated);
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
        var olExtent;
        if (M.utils.isArray(extent)) {
          olExtent = extent;
        }
        else {
          olExtent = [extent.x.min, extent.y.min, extent.x.max, extent.y.max];
        }

        var newSource = new M.impl.source.Mapbox({
          'url': this_.url,
          'name': this_.name,
          'accessToken': this_.accessToken,
          'tileGrid': new ol.tilegrid.TileGrid({
            resolutions: resolutions,
            extent: olExtent,
            origin: ol.extent.getBottomLeft(olExtent)
          }),
          'extent': olExtent,
          attributionControl: true
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
    return {
      "x": {
        "min": extent[0],
        "max": extent[2]
      },
      "y": {
        "min": extent[1],
        "max": extent[3]
      }
    };
  };

  /**
   * This function gets the min resolution for
   * this WMS
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.layer.Mapbox.prototype.getMinResolution = function () {
    return this.resolutions_[0];
  };

  /**
   * This function gets the max resolution for
   * this WMS
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.layer.Mapbox.prototype.getMaxResolution = function () {
    return this.resolutions_[this.resolutions_.length - 1];
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

    this.map.getLayers().forEach(function (lay) {
      if (lay instanceof M.layer.Mapbox || lay instanceof M.layer.OSM) {
        this.haveOSMorMapboxLayer = true;
      }
    }, this);

    if (!this.haveOSMorMapboxLayer) {
      this.map.getImpl().getMapImpl().getControls().getArray().forEach(function (data) {
        if (data instanceof ol.control.Attribution) {
          this.map.getImpl().getMapImpl().removeControl(data);
        }
      });
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
