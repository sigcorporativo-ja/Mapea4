goog.provide('M.impl.layer.WMS');

goog.require('M.utils');
goog.require('M.exception');
goog.require('M.impl.Layer');
goog.require('M.impl.format.WMSCapabilities');
goog.require('M.impl.GetCapabilities');

goog.require('ol.layer.Tile');
goog.require('ol.layer.Image');
goog.require('ol.source.TileWMS');
goog.require('ol.tilegrid.TileGrid');
goog.require('ol.source.ImageWMS');
goog.require('ol.extent');

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
  M.impl.layer.WMS = (function (options) {
    /**
     * The WMS layers instances from capabilities
     * @private
     * @type {Array<M.layer.WMS>}
     */
    this.layers = [];

    /**
     * WMS layer options
     * @private
     * @type {object}
     * @expose
     */
    this.options = options || {};

    /**
     * WMS layer options
     * @private
     * @type {boolean}
     * @expose
     */
    this.displayInLayerSwitcher = true;

    /**
     * get WMS getCapabilities promise
     * @private
     * @type {Promise}
     */
    this.getCapabilitiesPromise = null;

    /**
     * get WMS extent promise
     * @private
     * @type {Promise}
     */
    this.extentPromise = null;

    /**
     * Layer extent which was got from service getCapabilities
     * @private
     * @type {Mx.Extent}
     */
    this.extent = null;

    /**
     * Layer resolutions
     * @private
     * @type {Array<Number>}
     */
    this.resolutions_ = null;

    /**
     * Legend URL for this layer
     * @private
     * @type {string}
     * @expose
     */
    this.legendUrl_ = null;

    /**
     * Current projection
     * @private
     * @type {ol.Projection}
     */
    this.extentProj_ = null;

    // sets visibility
    if (this.options.visibility === false) {
      this.visibility = false;
    }

    // tiled
    if (M.utils.isNullOrEmpty(this.tiled)) {
      this.tiled = (this.options.singleTile !== true);
    }

    // number of zoom levels
    if (M.utils.isNullOrEmpty(this.options.numZoomLevels)) {
      this.options.numZoomLevels = 16; // by default
    }

    // animated
    if (M.utils.isNullOrEmpty(this.options.animated)) {
      this.options.animated = false; // by default
    }

    // calls the super constructor
    goog.base(this, this.options);

    this.zIndex_ = M.impl.Map.Z_INDEX[M.layer.type.WMS];
  });
  goog.inherits(M.impl.layer.WMS, M.impl.Layer);

  /**
   * This function sets the visibility of this layer
   *
   * @function
   * @api stable
   */
  M.impl.layer.WMS.prototype.setVisible = function (visibility) {
    this.visibility = visibility;
    if (this.inRange() === true) {
      // if this layer is base then it hides all base layers
      if ((visibility === true) && (this.transparent !== true)) {
        // hides all base layers
        this.map.getBaseLayers().filter(function (layer) {
          return (!layer.equals(this) && layer.isVisible());
        }).forEach(function (layer) {
          layer.setVisible(false);
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
   * This function indicates if the layer is queryable
   *
   * @function
   * @api stable
   * @expose
   */
  M.impl.layer.WMS.prototype.isQueryable = function () {
    return (this.options.queryable !== false);
  };

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.impl.Map} map
   * @api stable
   */
  M.impl.layer.WMS.prototype.addTo = function (map) {
    this.map = map;

    // calculates the resolutions from scales
    if (!M.utils.isNull(this.options) && !M.utils.isNull(this.options.minScale) && !M.utils.isNull(this.options.maxScale)) {
      var units = this.map.getProjection().units;
      this.options.minResolution = M.utils.getResolutionFromScale(this.options.minScale, units);
      this.options.maxResolution = M.utils.getResolutionFromScale(this.options.maxScale, units);
    }

    // checks if it is a WMS_FULL
    if (M.utils.isNullOrEmpty(this.name)) { // WMS_FULL (add all wms layers)
      this.addAllLayers_();
    }
    else { // just one WMS layer
      this.addSingleLayer_();
    }

    this.legendUrl_ = M.utils.addParameters(this.url, {
      'SERVICE': "WMS",
      'VERSION': this.version,
      'REQUEST': "GetLegendGraphic",
      'LAYER': this.name,
      'FORMAT': "image/png",
      'EXCEPTIONS': "image/png"
    });
  };

  /**
   * This function sets the resolutions for this layer
   *
   * @public
   * @function
   * @param {Array<Number>} resolutions
   * @api stable
   */
  M.impl.layer.WMS.prototype.setResolutions = function (resolutions) {
    this.resolutions_ = resolutions;
    if ((this.tiled === true) && !M.utils.isNullOrEmpty(this.ol3Layer)) {
      // gets the extent
      var this_ = this;
      this.getMaxExtent_().then(function (olExtent) {
        var layerParams = {};
        var optParams = this_.options.params;
        if (!M.utils.isNullOrEmpty(optParams)) {
          for (var key in optParams) {
            if (optParams.hasOwnProperty(key)) {
              layerParams[key.toUpperCase()] = optParams[key];
            }
          }
          //TODO: parche para pedir todas las capas en PNG
          // layerParams.FORMAT = "image/png";
        }
        else {
          layerParams = {
            'LAYERS': this_.name,
            'TILED': true,
            'VERSION': this_.version,
            'TRANSPARENT': this_.transparent,
            'FORMAT': 'image/png'
          };
        }


        var newSource;
        if (this_.tiled === true) {
          newSource = new ol.source.TileWMS({
            url: this_.url,
            params: layerParams,
            tileGrid: new ol.tilegrid.TileGrid({
              resolutions: resolutions,
              extent: olExtent,
              origin: ol.extent.getBottomLeft(olExtent)
            }),
            extent: olExtent,
            minResolution: this_.options.minResolution,
            maxResolution: this_.options.maxResolution,
            opacity: this.opacity_,
            zIndex: this.zIndex_
          });
        }
        else {
          newSource = new ol.source.ImageWMS({
            params: layerParams,
            resolutions: resolutions,
            projection: this.map.getProjection().code
          });
        }
        this_.ol3Layer.setSource(newSource);
        this_.ol3Layer.setExtent(olExtent);
      });
    }
  };

  /**
   * This function add this layer as unique layer
   *
   * @private
   * @function
   */
  M.impl.layer.WMS.prototype.addSingleLayer_ = function () {
    // gets resolutions of the map
    var resolutions = this.map.getResolutions();

    // gets the extent
    this.getMaxExtent_().then(function (olExtent) {
      var tileGrid;

      if (M.utils.isNullOrEmpty(resolutions) && !M.utils.isNullOrEmpty(this.resolutions_)) {
        resolutions = this.resolutions_;
      }

      // gets the tileGrid
      if (!M.utils.isNullOrEmpty(resolutions)) {
        tileGrid = new ol.tilegrid.TileGrid({
          resolutions: resolutions,
          extent: olExtent,
          origin: ol.extent.getBottomLeft(olExtent)
        });
      }

      var layerParams = {};
      var optParams = this.options.params;
      if (!M.utils.isNullOrEmpty(optParams)) {
        for (var key in optParams) {
          if (optParams.hasOwnProperty(key)) {
            layerParams[key.toUpperCase()] = optParams[key];
          }
        }
        //TODO: parche para pedir todas las capas en PNG
        // layerParams.FORMAT = "image/png";
      }
      else {
        layerParams = {
          'LAYERS': this.name,
          'TILED': true,
          'VERSION': this.version,
          'TRANSPARENT': this.transparent,
          'FORMAT': 'image/png'
        };
      }

      if (this.tiled === true) {
        this.ol3Layer = new ol.layer.Tile({
          visible: this.visibility && (this.options.visibility !== false),
          source: new ol.source.TileWMS({
            url: this.url,
            params: layerParams,
            tileGrid: tileGrid
          }),
          extent: olExtent,
          minResolution: this.options.minResolution,
          maxResolution: this.options.maxResolution,
          opacity: this.opacity_,
          zIndex: this.zIndex_
        });
      }
      else {
        this.ol3Layer = new ol.layer.Image({
          visible: this.visibility && (this.options.visibility !== false),
          source: new ol.source.ImageWMS({
            url: this.url,
            params: layerParams,
            resolutions: resolutions,
            projection: this.map.getProjection().code
          }),
          extent: olExtent,
          minResolution: this.options.minResolution,
          maxResolution: this.options.maxResolution,
          opacity: this.opacity_
        });
      }
      // keeps z-index values before ol resets
      let zIndex = this.zIndex_;
      this.map.getMapImpl().addLayer(this.ol3Layer);
      // sets its visibility if it is in range
      if (this.isVisible() && !this.inRange()) {
        this.setVisible(false);
      }
      // sets its z-index
      if (zIndex !== null) {
        this.setZIndex(zIndex);
      }
      // sets the resolutions
      if (this.resolutions_ !== null) {
        this.setResolutions(this.resolutions_);
      }
      // activates animation for base layers or animated parameters
      let animated = ((this.transparent === false) || (this.options.animated === true));
      this.ol3Layer.set("animated", animated);
    }.bind(this));
  };

  /**
   * This function adds all layers defined int the server
   *
   * @private
   * @function
   */
  M.impl.layer.WMS.prototype.addAllLayers_ = function () {
    this.getCapabilities().then(function (getCapabilities) {
      getCapabilities.getLayers().forEach(function (layer) {
        var wmsLayer = new M.layer.WMS({
          'url': this.url,
          'name': layer.name,
          'version': layer.version,
          'tiled': this.tiled
        }, this.options);
        this.layers.push(wmsLayer);
      }, this);

      // if no base layers was specified then it stablishes
      // the first layer as base
      // if (this.map.getBaseLayers().length === 0) {
      //    this.layers[0].transparent = false;
      // }

      this.map.addWMS(this.layers);

      // updates the z-index of the layers
      var baseLayersIdx = this.layers.length;
      this.layers.forEach(function (layer) {
        layer.setZIndex(M.impl.Map.Z_INDEX[M.layer.type.WMS] + baseLayersIdx);
        baseLayersIdx++;
      });
    }.bind(this));
  };

  /**
   * This function gets the envolved extent for
   * this WMS
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.layer.WMS.prototype.getExtent = function () {
    var olProjection = ol.proj.get(this.map.getProjection().code);

    // creates the promise
    this.extentPromise = new Promise(function (success, fail) {
      if (!M.utils.isNullOrEmpty(this.extent_)) {
        this.extent_ = ol.proj.transformExtent(this.extent_, this.extentProj_, olProjection);
        this.extentProj_ = olProjection;
        success(this.extent_);
      }
      else {
        this.getCapabilities().then(function (getCapabilities) {
          this.extent_ = getCapabilities.getLayerExtent(this.name);
          this.extentProj_ = olProjection;
          success(this.extent_);
        }.bind(this));
      }
    }.bind(this));
    return this.extentPromise;
  };

  /**
   * This function gets the min resolution for
   * this WMS
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.layer.WMS.prototype.getMinResolution = function () {
    return this.options.minResolution;
  };

  /**
   * This function gets the max resolution for
   * this WMS
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.layer.WMS.prototype.getMaxResolution = function () {
    return this.options.maxResolution;
  };

  /**
   * Update minimum and maximum resolution WMS layers
   *
   * @public
   * @function
   * @param {ol.Projection} projection - Projection map
   * @api stable
   */
  M.impl.layer.WMS.prototype.updateMinMaxResolution = function (projection) {
    if (!M.utils.isNullOrEmpty(this.options.minResolution)) {
      this.options.minResolution = M.utils.getResolutionFromScale(this.options.minScale, projection.units);
      this.ol3Layer.setMinResolution(this.options.minResolution);
    }

    if (!M.utils.isNullOrEmpty(this.options.maxResolution)) {
      this.options.maxResolution = M.utils.getResolutionFromScale(this.options.maxScale, projection.units);
      this.ol3Layer.setMaxResolution(this.options.maxResolution);
    }
  };

  /**
   * This function gets the max resolution for
   * this WMS
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.layer.WMS.prototype.getNumZoomLevels = function () {
    return this.options.numZoomLevels;
  };

  /**
   * This function gets the layers loaded from this
   * WMS FULL
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.layer.WMS.prototype.getLayers = function () {
    return this.layers;
  };

  /**
   * This function destroys this layer, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.layer.WMS.prototype.getCapabilities = function () {
    // creates the promise
    if (M.utils.isNullOrEmpty(this.getCapabilitiesPromise)) {
      var layerUrl = this.url;
      var layerVersion = this.version;
      var projection = this.map.getProjection();
      this.getCapabilitiesPromise = new Promise(function (success, fail) {
        // gest the capabilities URL
        var wmsGetCapabilitiesUrl = M.utils.getWMSGetCapabilitiesUrl(layerUrl, layerVersion);
        // gets the getCapabilities response
        M.remote.get(wmsGetCapabilitiesUrl).then(function (response) {
          var getCapabilitiesDocument = response.xml;
          var getCapabilitiesParser = new M.impl.format.WMSCapabilities();
          var getCapabilities = getCapabilitiesParser.read(getCapabilitiesDocument);

          var getCapabilitiesUtils = new M.impl.GetCapabilities(getCapabilities, layerUrl, projection);
          success(getCapabilitiesUtils);
        });
      });
    }
    return this.getCapabilitiesPromise;
  };

  /**
   * TODO
   *
   * @private
   * @function
   */
  M.impl.layer.WMS.prototype.getMaxExtent_ = function () {
    var extent = this.map.getMaxExtent();
    return (new Promise(function (success, fail) {
      if (!M.utils.isNullOrEmpty(extent)) {
        if (!M.utils.isArray(extent)) {
          extent = [extent.x.min, extent.y.min, extent.x.max, extent.y.max];
        }
        success.call(this, extent);
      }
      else {
        M.impl.envolvedExtent.calculate(this.map, this).then(function (extent) {
          let maxExtent = this.map.getMaxExtent();
          if (!M.utils.isNullOrEmpty(maxExtent)) {
            success.call(this, maxExtent);
          }
          else {
            success.call(this, extent);
          }
        }.bind(this));
      }
    }.bind(this)));
  };

  /**
   * This function destroys this layer, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.layer.WMS.prototype.getLegendURL = function () {
    return this.legendUrl_;
  };

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.layer.WMS.prototype.setLegendURL = function (legendUrl) {
    this.legendUrl_ = legendUrl;
  };

  /**
   * This function destroys this layer, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.layer.WMS.prototype.destroy = function () {
    var olMap = this.map.getMapImpl();
    if (!M.utils.isNullOrEmpty(this.ol3Layer)) {
      olMap.removeLayer(this.ol3Layer);
      this.ol3Layer = null;
    }
    if (!M.utils.isNullOrEmpty(this.layers)) {
      this.layers.map(this.map.removeLayers, this.map);
      this.layers.length = 0;
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
  M.impl.layer.WMS.prototype.equals = function (obj) {
    var equals = false;

    if (obj instanceof M.impl.layer.WMS) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
      equals = equals && (this.cql === obj.cql);
      equals = equals && (this.version === obj.version);
    }

    return equals;
  };

  M.impl.layer.WMS.LEGEND_IMAGE = null;
})();
