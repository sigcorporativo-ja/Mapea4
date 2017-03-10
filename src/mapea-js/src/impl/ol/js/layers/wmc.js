goog.provide('M.impl.layer.WMC');

goog.require('M.utils');
goog.require('M.exception');
goog.require('M.impl.Layer');
goog.require('M.impl.format.WMC.v110');
goog.require('M.evt.EventsManager');

(function () {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WMC layer
   * with parameters specified by the user
   *
   * @constructor
   * @implements {M.impl.Layer}
   * @param {Mx.parameters.LayerOptions} options custom options for this layer
   * @api stable
   */
  M.impl.layer.WMC = (function (options) {
    /**
     * Indicates if the layer was selected
     * @private
     * @type {boolean}
     */
    this.selected = false;

    /**
     * WMS layers defined into the WMC
     * @private
     * @type {Array<M.layer.WMS>}
     */
    this.layers = [];

    /**
     * Load WMC file promise
     * @private
     * @type {Promise}
     */
    this.loadContextPromise = null;

    /**
     * Envolved extent for the WMC
     * @private
     * @type {Mx.Extent}
     */
    this.maxExtent = null;

    /**
     * Current projection
     * @private
     * @type {ol.Projection}
     */
    this.extentProj_ = null;

    // calls the super constructor
    goog.base(this, options);
  });
  goog.inherits(M.impl.layer.WMC, M.impl.Layer);

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.impl.Map} map
   * @api stable
   */
  M.impl.layer.WMC.prototype.addTo = function (map) {
    this.map = map;
  };

  /**
   * This function select this WMC layer and
   * triggers the event to draw it
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.layer.WMC.prototype.select = function () {
    if (this.selected === false) {
      var bbox = this.map.getBbox();

      // unselect layers
      this.map.getWMC().forEach(function (wmcLayer) {
        wmcLayer.unselect();
      });

      this.selected = true;

      // loads the layers from this WMC if it is not cached
      this.loadContextPromise = new Promise(function (success, fail) {
        M.remote.get(this.url).then(function (response) {
          var proj;
          if (this.map._defaultProj === false) {
            proj = this.map.getProjection().code;
          }
          var wmcDocument = response.xml;
          var formater = new M.impl.format.WMC({
            'projection': proj
          });
          var context = formater.readFromDocument(wmcDocument);
          success.call(this, context);
        }.bind(this));
      }.bind(this));
      this.loadContextPromise.then(function (context) {
        // set projection with the wmc
        if (this.map._defaultProj) {
          var olproj = ol.proj.get(context.projection);
          this.map.setProjection({
            "code": olproj.getCode(),
            "units": olproj.getUnits()
          }, true);
        }
        // load layers
        this.loadLayers(context);
        if (!M.utils.isNullOrEmpty(bbox)) {
          this.map.setBbox(bbox);
        }
        this.map.fire(M.evt.CHANGE_WMC, this);
      }.bind(this));
    }
  };

  /**
   * This function unselect this WMC layer and
   * triggers the event to remove it
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.layer.WMC.prototype.unselect = function () {
    if (this.selected === true) {
      this.selected = false;

      // removes all loaded layers
      if (!M.utils.isNullOrEmpty(this.layers)) {
        this.map.removeLayers(this.layers);
      }
    }
  };

  /**
   * This function load all layers of the WMC and
   * it adds them to the map
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.layer.WMC.prototype.loadLayers = function (context) {
    this.layers = context.layers;
    this.maxExtent = context.maxExtent;

    this.map.addWMS(this.layers, true);

    // updates the z-index of the layers
    var baseLayersIdx = this.layers.length;
    this.layers.forEach(function (layer) {
      layer.setZIndex(M.impl.Map.Z_INDEX[M.layer.type.WMC] + baseLayersIdx);
      baseLayersIdx++;
    });
  };

  /**
   * This function gets the envolved extent for
   * this WMC
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.layer.WMC.prototype.getMaxExtent = function () {
    var this_ = this;
    var olProjection = ol.proj.get(this.map.getProjection().code);
    var promise = new Promise(function (success, fail) {
      if (M.utils.isNullOrEmpty(this_.maxExtent)) {
        this_.loadContextPromise.then(function (context) {
          this_.maxExtent = context.maxExtent;
          if (M.utils.isNullOrEmpty(this_.extentProj_)) {
            this_.extentProj_ = M.parameter.projection(M.config.DEFAULT_PROJ).code;
          }
          this_.maxExtent = ol.proj.transformExtent(this_.maxExtent, this_.extentProj_, olProjection);
          this_.extentProj_ = olProjection;
          success(this_.maxExtent);
        });
      }
      else {
        this_.extentProj_ = olProjection;
        success(this_.maxExtent);
      }
    });
    return promise;
  };

  /**
   * This function gets layers loaded from
   * this WMC
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.layer.WMC.prototype.getLayers = function () {
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
  M.impl.layer.WMC.prototype.destroy = function () {
    if (!M.utils.isNullOrEmpty(this.layers)) {
      this.map.removeLayers(this.layers);
    }
    this.map = null;
    this.layers.length = 0;
    this.wmcDocument = null;
  };

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api stable
   */
  M.impl.layer.WMC.prototype.equals = function (obj) {
    var equals = false;

    if (obj instanceof M.impl.layer.WMC) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
    }

    return equals;
  };
})();
