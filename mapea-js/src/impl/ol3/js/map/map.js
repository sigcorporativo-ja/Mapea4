goog.provide('M.impl');
goog.provide('M.impl.Map');

goog.require('M');
goog.require('M.layer.type');
goog.require('M.impl.Layer');
goog.require('M.impl.layer.WMC');
goog.require('M.impl.layer.WMS');
goog.require('M.impl.layer.KML');
goog.require('M.impl.layer.WFS');
goog.require('M.impl.layer.WMTS');
goog.require('M.impl.layer.OSM');
goog.require('M.impl.layer.GeoJSON');
goog.require('M.impl.layer.Mapbox');
goog.require('M.impl.layer.Draw');
goog.require('M.impl.utils');
goog.require('M.impl.View');
goog.require('M.impl.projections');
goog.require('M.impl.envolvedExtent');
goog.require('M.impl.control.WMCSelector');
goog.require('M.impl.control.Scale');
goog.require('M.impl.control.ScaleLine');
goog.require('M.impl.control.Panzoombar');
goog.require('M.impl.control.Panzoom');
goog.require('M.impl.control.LayerSwitcher');
goog.require('M.impl.control.Mouse');
goog.require('M.impl.control.Navtoolbar');
goog.require('M.impl.control.OverviewMap');
goog.require('M.impl.control.Location');
goog.require('M.impl.control.GetFeatureInfo');
goog.require('M.impl.Label');
goog.require('M.impl.handler.Features');
goog.require('M.impl.Popup');
goog.require('M.impl.patches');

goog.require('ol.RendererType');
goog.require('ol.Map');

(function () {
  /**
   * @classdesc
   * Main constructor of the class. Creates a Map
   * with the specified div
   *
   * @constructor
   * @extends {M.Object}
   * @param {Object} div
   * @param {Mx.parameters.MapOptions} options
   * @api stable
   */
  M.impl.Map = function (div, options) {
    goog.base(this);

    /**
     * Facade map to implement
     * @private
     * @type {M.Map}
     */
    this.facadeMap_ = null;

    /**
     * Layers added to the map
     * @private
     * @type {ol.Collection<M.Layer>}
     */
    this.layers_ = [];

    /**
     * Controls added to the map
     * @private
     * @type {Array<M.Control>}
     */
    this.controls_ = [];

    /**
     * MBtiles layers added to the map
     * @private
     * @type {Mx.parameters.MapOptions}
     */
    this.options_ = (options || {});

    /**
     * Flag to indicate if the initial zoom was calculated
     * @private
     * @type {Boolean}
     */
    this.initZoom_ = true;

    /**
     * Vector layer used to draw
     * @private
     * @type {ol.layer.Vector}
     */
    this.drawLayer_ = null;

    /**
     * Resolutions specified by the user
     * @private
     * @type {Array<Number>}
     */
    this.userResolutions_ = null;

    /**
     * Bbox specified by the user
     * @private
     * @type {Mx.Extent}
     */
    this.userBbox_ = null;

    /**
     * MaxExtent specified by the user
     * @private
     * @type {Mx.Extent}
     */
    this.maxExtentForResolutions_ = null;

    /**
     * calculated envolved maxExtent
     * @private
     * @type {Mx.Extent}
     */
    this.envolvedMaxExtent_ = null;

    /**
     * calculated resolutions
     * @private
     * @type {Boolean}
     */
    this._calculatedResolutions = false;

    /**
     * calculated resolution form envolved extent
     * @private
     * @type {Boolean}
     */
    this._resolutionsEnvolvedExtent = false;

    /**
     * calculated resolution form base layer
     * @private
     * @type {Boolean}
     */
    this._resolutionsBaseLayer = false;

    // gets the renderer
    var renderer = ol.RendererType.CANVAS;
    if (!M.utils.isNullOrEmpty(this.options_.renderer)) {
      renderer = this.options_.renderer;
    }

    /**
     * Implementation of this map
     * @private
     * @type {ol.Map}
     */
    this.map_ = new ol.Map({
      controls: [],
      target: div.id,
      renderer: renderer,
      view: new M.impl.View()
    });

    /**
     * Features manager
     * @private
     * @type {M.impl.FeaturesHandler}
     */
    this.featuresHandler_ = new M.impl.handler.Features(this);
  };
  goog.inherits(M.impl.Map, M.Object);

  /**
   * This function gets the layers added to the map
   *
   * @public
   * @function
   * @param {Array<M.Layer>} filters to apply to the search
   * @returns {Array<M.Layer>} layers from the map
   * @api stable
   */
  M.impl.Map.prototype.getLayers = function (filters) {
    var wmcLayers = this.getWMC(filters);
    var kmlLayers = this.getKML(filters);
    var wmsLayers = this.getWMS(filters);
    var wfsLayers = this.getWFS(filters);
    var wmtsLayers = this.getWMTS(filters);
    var mbtilesLayers = this.getMBtiles(filters);

    var unknowLayers = this.layers_.filter(function (layer) {
      return !M.layer.type.know(layer.type);
    });

    return wmcLayers.concat(kmlLayers).concat(wmsLayers)
      .concat(wfsLayers).concat(wmtsLayers)
      .concat(mbtilesLayers).concat(unknowLayers);
  };

  /**
   * This function gets the layers added to the map
   *
   * @public
   * @function
   * @param {Array<M.Layer>} filters to apply to the search
   * @returns {Array<M.Layer>} layers from the map
   * @api stable
   */
  M.impl.Map.prototype.getBaseLayers = function () {
    var baseLayers = this.getLayers().filter(function (layer) {
      var isBaseLayer = false;
      if ((layer.type === M.layer.type.WMS) || (layer.type === M.layer.type.Mapbox)) {
        isBaseLayer = (layer.transparent !== true);
      }
      return isBaseLayer;
    });

    return baseLayers;
  };

  /**
   * This function adds layers specified by the user
   *
   * @public
   * @function
   * @param {Array<Object>} layers
   * @returns {M.impl.Map}
   */
  M.impl.Map.prototype.addLayers = function (layers) {
    // gets the layers with type defined and undefined
    var unknowLayers = layers.filter(function (layer) {
      return !M.layer.type.know(layer.type);
    });
    var knowLayers = layers.filter(function (layer) {
      return M.layer.type.know(layer.type);
    });

    this.addWMC(knowLayers);
    this.addMBtiles(knowLayers);
    this.addWMS(knowLayers);
    this.addWMTS(knowLayers);
    this.addKML(knowLayers);
    this.addWFS(knowLayers);

    // cehcks if exists a base layer
    var existsBaseLayer = this.getBaseLayers().length > 0;

    // adds unknow layers
    unknowLayers.forEach(function (layer) {
      if (!M.utils.includes(this.layers_, layer)) {
        layer.getImpl().addTo(this.facadeMap_);
        this.layers_.push(layer);

        /* if the layer is a base layer then
        sets its visibility */
        if (layer.transparent !== true) {
          layer.setVisible(!existsBaseLayer);
          existsBaseLayer = true;
          if (layer.isVisible()) {
            this.updateResolutionsFromBaseLayer();
          }
          layer.getImpl().setZIndex(0);
        }
        else {
          var zIndex = this.layers_.length + layer.getImpl().getZIndex();
          layer.getImpl().setZIndex(zIndex);
          // recalculates resolution if there are not
          // any base layer
          if (!existsBaseLayer) {
            this.updateResolutionsFromBaseLayer();
          }
        }
      }
    }, this);

    return this;
  };

  /**
   * This function removes the layers from the map
   *
   * @function
   * @param {Array<Object>} layers to remove
   * @returns {M.impl.Map}
   * @api stable
   */
  M.impl.Map.prototype.removeLayers = function (layers) {

    // gets the layers with type defined and undefined
    var unknowLayers = layers.filter(function (layer) {
      return M.utils.isNullOrEmpty(layer.type);
    });
    var knowLayers = layers.filter(function (layer) {
      return !M.utils.isNullOrEmpty(layer.type);
    });

    this.removeWMC(knowLayers);
    this.removeKML(knowLayers);
    this.removeWMS(knowLayers);
    this.removeWFS(knowLayers);
    this.removeWMTS(knowLayers);
    this.removeMBtiles(knowLayers);

    // removes unknow layers
    unknowLayers.forEach(function (layer) {
      if (!M.utils.includes(this.layers_, layer)) {
        this.layers_.remove(layer);
        layer.getImpl().destroy();
      }
    }, this);

    return this;
  };

  /**
   * This function gets the WMC layers added to the map
   *
   * @function
   * @param {Array<M.Layer>} filters to apply to the search
   * @returns {Array<M.layer.WMC>} layers from the map
   * @api stable
   */
  M.impl.Map.prototype.getWMC = function (filters) {
    var foundLayers = [];

    // get all wmcLayers
    var wmcLayers = this.layers_.filter(function (layer) {
      return (layer.type === M.layer.type.WMC);
    });

    // parse to Array
    if (M.utils.isNullOrEmpty(filters)) {
      filters = [];
    }
    if (!M.utils.isArray(filters)) {
      filters = [filters];
    }

    if (filters.length === 0) {
      foundLayers = wmcLayers;
    }
    else {
      filters.forEach(function (filterLayer) {
        foundLayers = foundLayers.concat(wmcLayers.filter(function (wmcLayer) {
          var layerMatched = true;
          // checks if the layer is not in selected layers
          if (!foundLayers.includes(wmcLayer)) {
            // type
            if (!M.utils.isNullOrEmpty(filterLayer.type)) {
              layerMatched = (layerMatched && (filterLayer.type === wmcLayer.type));
            }
            // URL
            if (!M.utils.isNullOrEmpty(filterLayer.url)) {
              layerMatched = (layerMatched && (filterLayer.url === wmcLayer.url));
            }
            // name
            if (!M.utils.isNullOrEmpty(filterLayer.name)) {
              layerMatched = (layerMatched && (filterLayer.name === wmcLayer.name));
            }
          }
          else {
            layerMatched = false;
          }
          return layerMatched;
        }));
      }, this);
    }
    return foundLayers;
  };

  /**
   * This function adds the WMC layers to the map
   *
   * @function
   * @param {Array<M.impl.layer.WMC>} layers
   * @returns {M.impl.Map}
   * @api stable
   */
  M.impl.Map.prototype.addWMC = function (layers) {
    layers.forEach(function (layer, zIndex) {
      // checks if layer is WMC and was added to the map
      if (layer.type == M.layer.type.WMC) {
        if (!M.utils.includes(this.layers_, layer)) {
          layer.getImpl().setZIndex();
          layer.getImpl().addTo(this.facadeMap_);
          this.layers_.push(layer);
        }
      }
    }, this);

    return this;
  };

  /**
   * This function removes the WMC layers to the map
   *
   * @function
   * @param {Array<M.layer.WMC>} layers
   * @returns {M.impl.Map}
   * @api stable
   */
  M.impl.Map.prototype.removeWMC = function (layers) {
    var wmcMapLayers = this.getWMC(layers);
    wmcMapLayers.forEach(function (wmcLayer) {
      // TODO removing the WMC layer with ol3
      this.layers_.remove(wmcLayer);
    }, this);

    return this;
  };

  /**
   * This function gets the KML layers added to the map
   *
   * @function
   * @param {Array<M.Layer>} filters to apply to the search
   * @returns {Array<M.layer.KML>} layers from the map
   * @api stable
   */
  M.impl.Map.prototype.getKML = function (filters) {
    var foundLayers = [];

    // get all kmlLayers
    var kmlLayers = this.layers_.filter(function (layer) {
      return (layer.type === M.layer.type.KML);
    });

    // parse to Array
    if (M.utils.isNullOrEmpty(filters)) {
      filters = [];
    }
    if (!M.utils.isArray(filters)) {
      filters = [filters];
    }

    if (filters.length === 0) {
      foundLayers = kmlLayers;
    }
    else {
      filters.forEach(function (filterLayer) {
        var filteredKMLLayers = kmlLayers.filter(function (kmlLayer) {
          var layerMatched = true;
          // checks if the layer is not in selected layers
          if (!foundLayers.includes(kmlLayer)) {
            // type
            if (!M.utils.isNullOrEmpty(filterLayer.type)) {
              layerMatched = (layerMatched && (filterLayer.type === kmlLayer.type));
            }
            // URL
            if (!M.utils.isNullOrEmpty(filterLayer.url)) {
              layerMatched = (layerMatched && (filterLayer.url === kmlLayer.url));
            }
            // name
            if (!M.utils.isNullOrEmpty(filterLayer.name)) {
              layerMatched = (layerMatched && (filterLayer.name === kmlLayer.name));
            }
            // extract
            if (!M.utils.isNullOrEmpty(filterLayer.extract)) {
              layerMatched = (layerMatched && (filterLayer.extract === kmlLayer.extract));
            }
          }
          else {
            layerMatched = false;
          }
          return layerMatched;
        });
        foundLayers = foundLayers.concat(filteredKMLLayers);
      }, this);
    }
    return foundLayers;
  };

  /**
   * This function adds the KML layers to the map
   *
   * @function
   * @param {Array<M.layer.KML>} layers
   * @returns {M.impl.Map}
   * @api stable
   */
  M.impl.Map.prototype.addKML = function (layers) {
    layers.forEach(function (layer) {
      // checks if layer is WMC and was added to the map
      if (layer.type == M.layer.type.KML) {
        if (!M.utils.includes(this.layers_, layer)) {
          layer.getImpl().addTo(this.facadeMap_);
          this.layers_.push(layer);
          var zIndex = this.layers_.length + M.impl.Map.Z_INDEX[M.layer.type.KML];
          layer.getImpl().setZIndex(zIndex);

          // adds to featurehandler
          if (layer.extract === true) {
            this.featuresHandler_.addLayer(layer.getImpl());
          }
        }
      }
    }, this);

    return this;
  };

  /**
   * This function removes the KML layers to the map
   *
   * @function
   * @param {Array<M.layer.KML>} layers
   * @returns {M.impl.Map}
   * @api stable
   */
  M.impl.Map.prototype.removeKML = function (layers) {
    var kmlMapLayers = this.getKML(layers);
    kmlMapLayers.forEach(function (kmlLayer) {
      this.layers_.remove(kmlLayer);
      kmlLayer.getImpl().destroy();

      // remove to featurehandler
      if (kmlLayer.extract === true) {
        this.featuresHandler_.removeLayer(kmlLayer.getImpl());
      }
    }, this);

    return this;
  };

  /**
   * This function gets the WMS layers added to the map
   *
   * @function
   * @param {Array<M.Layer>} filters to apply to the search
   * @returns {Array<M.layer.WMS>} layers from the map
   * @api stable
   */
  M.impl.Map.prototype.getWMS = function (filters) {
    var foundLayers = [];

    // get all wmsLayers
    var wmsLayers = this.layers_.filter(function (layer) {
      return (layer.type === M.layer.type.WMS);
    });

    // parse to Array
    if (M.utils.isNullOrEmpty(filters)) {
      filters = [];
    }
    if (!M.utils.isArray(filters)) {
      filters = [filters];
    }

    if (filters.length === 0) {
      foundLayers = wmsLayers;
    }
    else {
      filters.forEach(function (filterLayer) {
        var filteredWMSLayers = wmsLayers.filter(function (wmsLayer) {
          var layerMatched = true;
          // checks if the layer is not in selected layers
          if (!foundLayers.includes(wmsLayer)) {
            // if instanceof M.layer.WMS check if it is the same
            if (filterLayer instanceof M.layer.WMS) {
              layerMatched = (filterLayer === wmsLayer);
            }
            else {
              // type
              if (!M.utils.isNullOrEmpty(filterLayer.type)) {
                layerMatched = (layerMatched && (filterLayer.type === wmsLayer.type));
              }
              // URL
              if (!M.utils.isNullOrEmpty(filterLayer.url)) {
                layerMatched = (layerMatched && (filterLayer.url === wmsLayer.url));
              }
              // name
              if (!M.utils.isNullOrEmpty(filterLayer.name)) {
                layerMatched = (layerMatched && (filterLayer.name === wmsLayer.name));
              }
              // legend
              if (!M.utils.isNullOrEmpty(filterLayer.legend)) {
                layerMatched = (layerMatched && (filterLayer.legend === wmsLayer.legend));
              }
              // transparent
              if (!M.utils.isNullOrEmpty(filterLayer.transparent)) {
                layerMatched = (layerMatched && (filterLayer.transparent === wmsLayer.transparent));
              }
              // tiled
              if (!M.utils.isNullOrEmpty(filterLayer.tiled)) {
                layerMatched = (layerMatched && (filterLayer.tiled === wmsLayer.tiled));
              }
              // cql
              if (!M.utils.isNullOrEmpty(filterLayer.cql)) {
                layerMatched = (layerMatched && (filterLayer.cql === wmsLayer.cql));
              }
              // version
              if (!M.utils.isNullOrEmpty(filterLayer.version)) {
                layerMatched = (layerMatched && (filterLayer.version === wmsLayer.version));
              }
            }
          }
          else {
            layerMatched = false;
          }
          return layerMatched;
        });
        foundLayers = foundLayers.concat(filteredWMSLayers);
      }, this);
    }
    return foundLayers;
  };

  /**
   * This function adds the WMS layers to the map
   *
   * @function
   * @param {Array<M.layer.WMS>} layers
   * @returns {M.impl.Map}
   * @api stable
   */
  M.impl.Map.prototype.addWMS = function (layers) {
    // cehcks if exists a base layer
    var baseLayers = this.getBaseLayers();
    var existsBaseLayer = (baseLayers.length > 0);

    layers.forEach(function (layer) {
      // checks if layer is WMC and was added to the map
      if (layer.type == M.layer.type.WMS) {
        if (!M.utils.includes(this.layers_, layer)) {
          layer.getImpl().addTo(this.facadeMap_);
          this.layers_.push(layer);

          /* if the layer is a base layer then
          sets its visibility */
          if (layer.transparent !== true) {
            layer.setVisible(!existsBaseLayer);
            existsBaseLayer = true;
            if (layer.isVisible()) {
              this.updateResolutionsFromBaseLayer();
            }
            layer.getImpl().setZIndex(0);
          }
          else {
            var zIndex = this.layers_.length + layer.getImpl().getZIndex();
            layer.getImpl().setZIndex(zIndex);
            // recalculates resolution if there are not
            // any base layer
            if (!existsBaseLayer) {
              this.updateResolutionsFromBaseLayer();
            }
          }
        }
      }
    }, this);
    return this;
  };

  /**
   * This function removes the WMS layers to the map
   *
   * @function
   * @param {Array<M.layer.WMS>} layers
   * @returns {M.impl.Map}
   * @api stable
   */
  M.impl.Map.prototype.removeWMS = function (layers) {
    var wmsMapLayers = this.getWMS(layers);
    wmsMapLayers.forEach(function (wmsLayer) {
      this.layers_.remove(wmsLayer);
      wmsLayer.getImpl().destroy();
    }, this);

    return this;
  };

  /**
   * This function gets the WFS layers added to the map
   *
   * @function
   * @param {Array<M.Layer>} filters to apply to the search
   * @returns {Array<M.layer.WFS>} layers from the map
   * @api stable
   */
  M.impl.Map.prototype.getWFS = function (filters) {
    var foundLayers = [];

    // get all wfsLayers
    var wfsLayers = this.layers_.filter(function (layer) {
      return (layer.type === M.layer.type.WFS);
    });

    // parse to Array
    if (M.utils.isNullOrEmpty(filters)) {
      filters = [];
    }
    if (!M.utils.isArray(filters)) {
      filters = [filters];
    }

    if (filters.length === 0) {
      foundLayers = wfsLayers;
    }
    else {
      filters.forEach(function (filterLayer) {
        var filteredWFSLayers = wfsLayers.filter(function (wfsLayer) {
          var layerMatched = true;
          // checks if the layer is not in selected layers
          if (!foundLayers.includes(wfsLayer)) {
            // type
            if (!M.utils.isNullOrEmpty(filterLayer.type)) {
              layerMatched = (layerMatched && (filterLayer.type === wfsLayer.type));
            }
            // URL
            if (!M.utils.isNullOrEmpty(filterLayer.url)) {
              layerMatched = (layerMatched && (filterLayer.url === wfsLayer.url));
            }
            // name
            if (!M.utils.isNullOrEmpty(filterLayer.name)) {
              layerMatched = (layerMatched && (filterLayer.name === wfsLayer.name));
            }
            // namespace
            if (!M.utils.isNullOrEmpty(filterLayer.namespace)) {
              layerMatched = (layerMatched && (filterLayer.namespace === wfsLayer.namespace));
            }
            // legend
            if (!M.utils.isNullOrEmpty(filterLayer.legend)) {
              layerMatched = (layerMatched && (filterLayer.legend === wfsLayer.legend));
            }
            // cql
            if (!M.utils.isNullOrEmpty(filterLayer.cql)) {
              layerMatched = (layerMatched && (filterLayer.cql === wfsLayer.cql));
            }
            // geometry
            if (!M.utils.isNullOrEmpty(filterLayer.geometry)) {
              layerMatched = (layerMatched && (filterLayer.geometry === wfsLayer.geometry));
            }
            // ids
            if (!M.utils.isNullOrEmpty(filterLayer.ids)) {
              layerMatched = (layerMatched && (filterLayer.ids === wfsLayer.ids));
            }
            // version
            if (!M.utils.isNullOrEmpty(filterLayer.version)) {
              layerMatched = (layerMatched && (filterLayer.version === wfsLayer.version));
            }
          }
          else {
            layerMatched = false;
          }
          return layerMatched;
        });
        foundLayers = foundLayers.concat(filteredWFSLayers);
      }, this);
    }
    return foundLayers;
  };

  /**
   * This function adds the WFS layers to the map
   *
   * @function
   * @param {Array<M.layer.WFS>} layers
   * @returns {M.impl.Map}
   * @api stable
   */
  M.impl.Map.prototype.addWFS = function (layers) {
    layers.forEach(function (layer) {
      // checks if layer is WFS and was added to the map
      if (layer.type == M.layer.type.WFS) {
        if (!M.utils.includes(this.layers_, layer)) {
          layer.getImpl().addTo(this.facadeMap_);
          this.layers_.push(layer);
          var zIndex = this.layers_.length + M.impl.Map.Z_INDEX[M.layer.type.WFS];
          layer.getImpl().setZIndex(zIndex);
          this.featuresHandler_.addLayer(layer.getImpl());
        }
      }
    }, this);

    return this;
  };

  /**
   * This function removes the WFS layers to the map
   *
   * @function
   * @param {Array<M.layer.WFS>} layers
   * @returns {M.impl.Map}
   * @api stable
   */
  M.impl.Map.prototype.removeWFS = function (layers) {
    var wfsMapLayers = this.getWFS(layers);
    wfsMapLayers.forEach(function (wfsLayer) {
      this.layers_.remove(wfsLayer);
      wfsLayer.getImpl().destroy();
    }, this);

    return this;
  };

  /**
   * This function gets the WMTS layers added to the map
   *
   * @function
   * @param {Array<M.Layer>} filters to apply to the search
   * @returns {Array<M.layer.WMTS>} layers from the map
   * @api stable
   */
  M.impl.Map.prototype.getWMTS = function (filters) {
    var foundLayers = [];

    // get all kmlLayers
    var wmtsLayers = this.layers_.filter(function (layer) {
      return (layer.type === M.layer.type.WMTS);
    });

    // parse to Array
    if (M.utils.isNullOrEmpty(filters)) {
      filters = [];
    }
    if (!M.utils.isArray(filters)) {
      filters = [filters];
    }

    if (filters.length === 0) {
      foundLayers = wmtsLayers;
    }
    else {
      filters.forEach(function (filterLayer) {
        // TODO ERROR DE RECURSIVIDAD: var l = map.getLayers(); map.getWMS(l);
        var filteredWMTSLayers = wmtsLayers.filter(function (wmtsLayer) {
          var layerMatched = true;
          // checks if the layer is not in selected layers
          if (!foundLayers.includes(wmtsLayer)) {
            // type
            if (!M.utils.isNullOrEmpty(filterLayer.type)) {
              layerMatched = (layerMatched && (filterLayer.type === wmtsLayer.type));
            }
            // URL
            if (!M.utils.isNullOrEmpty(filterLayer.url)) {
              layerMatched = (layerMatched && (filterLayer.url === wmtsLayer.url));
            }
            // name
            if (!M.utils.isNullOrEmpty(filterLayer.name)) {
              layerMatched = (layerMatched && (filterLayer.name === wmtsLayer.name));
            }
            // matrixSet
            if (!M.utils.isNullOrEmpty(filterLayer.matrixSet)) {
              layerMatched = (layerMatched && (filterLayer.matrixSet === wmtsLayer.matrixSet));
            }
            // legend
            if (!M.utils.isNullOrEmpty(filterLayer.legend)) {
              layerMatched = (layerMatched && (filterLayer.legend === wmtsLayer.legend));
            }
          }
          else {
            layerMatched = false;
          }
          return layerMatched;
        });
        foundLayers = foundLayers.concat(filteredWMTSLayers);
      }, this);
    }
    return foundLayers;
  };

  /**
   * This function adds the WMTS layers to the map
   *
   * @function
   * @param {Array<M.layer.WMTS>} layers
   * @returns {M.impl.Map}
   * @api stable
   */
  M.impl.Map.prototype.addWMTS = function (layers) {
    layers.forEach(function (layer) {
      // checks if layer is WMTS and was added to the map
      if (layer.type == M.layer.type.WMTS) {
        if (!M.utils.includes(this.layers_, layer)) {
          layer.getImpl().addTo(this.facadeMap_);
          this.layers_.push(layer);
          var zIndex = this.layers_.length + M.impl.Map.Z_INDEX[M.layer.type.WMTS];
          layer.getImpl().setZIndex(zIndex);
        }
      }
    }, this);
    return this;
  };

  /**
   * This function removes the WMTS layers to the map
   *
   * @function
   * @param {Array<M.layer.WMTS>} layers
   * @returns {M.impl.Map}
   * @api stable
   */
  M.impl.Map.prototype.removeWMTS = function (layers) {
    var wmtsMapLayers = this.getWMTS(layers);
    wmtsMapLayers.forEach(function (wmtsLayer) {
      this.layers_.remove(wmtsLayer);
      wmtsLayer.getImpl().destroy();
    }, this);

    return this;
  };

  /**
   * This function gets the MBtiles layers added to the map
   *
   * @function
   * @param {Array<M.Layer>} filters to apply to the search
   * @returns {Array<M.layer.MBtiles>} layers from the map
   * @api stable
   */
  M.impl.Map.prototype.getMBtiles = function (filters) {
    var foundLayers = [];

    return foundLayers;
  };

  /**
   * This function adds the MBtiles layers to the map
   *
   * @function
   * @param {Array<M.layer.MBtiles>} layers
   * @returns {M.impl.Map}
   * @api stable
   */
  M.impl.Map.prototype.addMBtiles = function (layers) {
    layers.forEach(function (layer) {
      // checks if layer is MBtiles and was added to the map
      if ((layer.type == M.layer.type.MBtiles) &&
        !M.utils.includes(this.layers_, layer)) {
        // TODO creating and adding the MBtiles layer with ol3
        this.layers_.push(layer);
      }
    }, this);

    return this;
  };

  /**
   * This function removes the MBtiles layers to the map
   *
   * @function
   * @param {Array<M.layer.MBtiles>} layers
   * @returns {M.impl.Map}
   * @api stable
   */
  M.impl.Map.prototype.removeMBtiles = function (layers) {
    var mbtilesMapLayers = this.getMBtiles(layers);
    mbtilesMapLayers.forEach(function (mbtilesLayer) {
      // TODO removing the MBtiles layer with ol3
      this.layers_.remove(mbtilesLayer);
    }, this);

    return this;
  };

  /**
   * This function adds controls specified by the user
   *
   * @public
   * @function
   * @param {string|Array<String>} filters
   * @returns {Array<M.Control>}
   * @api stable
   */
  M.impl.Map.prototype.getControls = function (filters) {
    var foundControls = [];

    // parse to Array
    if (M.utils.isNullOrEmpty(filters)) {
      filters = [];
    }
    if (!M.utils.isArray(filters)) {
      filters = [filters];
    }
    if (filters.length === 0) {
      foundControls = this.controls_;
    }
    else {
      filters.forEach(function (filterControl) {
        foundControls = foundControls.concat(this.controls_.filter(function (control) {
          var controlMatched = false;

          if (!M.utils.includes(foundControls, control)) {
            if (M.utils.isString(filterControl)) {
              controlMatched = (filterControl === control.name);
            }
            else if (filterControl instanceof M.Control) {
              controlMatched = (filterControl === control);
            }
            else if (M.utils.isObject(filterControl)) {
              controlMatched = (filterControl.name === control.name);
            }
          }
          return controlMatched;
        }));
      }, this);
    }
    return foundControls;
  };

  /**
   * This function adds controls specified by the user
   *
   * @public
   * @function
   * @param {M.Control} controls
   * @returns {M.impl.Map}
   * @api stable
   */
  M.impl.Map.prototype.addControls = function (controls) {
    controls.forEach(function (control) {
      if (control instanceof M.control.Panzoombar) {
        this.facadeMap_.addControls('panzoom');
      }
      if (!M.utils.includes(this.controls_, control)) {
        this.controls_.push(control);
      }
    }, this);

    return this;
  };

  /**
   * This function removes the controls from the map
   *
   * @function
   * @param {String|Array<String>} layers
   * @returns {M.impl.Map}
   * @api stable
   */
  M.impl.Map.prototype.removeControls = function (controls) {
    var mapControls = this.getControls(controls);
    mapControls.forEach(function (control) {
      control.getImpl().destroy();
      this.controls_.remove(control);
    }, this);

    return this;
  };

  /**
   * This function sets the maximum extent for this
   * map instance
   *
   * @public
   * @function
   * @param {Mx.Extent} maxExtent the extent max
   * @param {Boolean} zoomToExtent - Set bbox
   * @returns {M.impl.Map}
   * @api stable
   */
  M.impl.Map.prototype.setMaxExtent = function (maxExtent, zoomToExtent) {
    // checks if the param is null or empty
    if (M.utils.isNullOrEmpty(maxExtent)) {
      M.exception('No ha especificado ningún maxExtent');
    }

    // set the extent by ol
    var olExtent = [maxExtent.x.min, maxExtent.y.min, maxExtent.x.max, maxExtent.y.max];
    var olMap = this.getMapImpl();
    //      var minZoom = olMap.getView().
    olMap.getView().set('extent', olExtent);
    this.updateResolutionsFromBaseLayer();

    if (zoomToExtent !== false) {
      this.setBbox(olExtent);
    }

    return this;
  };

  /**
   * This function gets the maximum extent for this
   * map instance
   *
   * @public
   * @function
   * @returns {Mx.Extent}
   * @api stable
   */
  M.impl.Map.prototype.getMaxExtent = function () {
    var extent;
    var olMap = this.getMapImpl();
    var olExtent = olMap.getView().get('extent');

    if (!M.utils.isNullOrEmpty(olExtent)) {
      extent = {
        'x': {
          'min': olExtent[0],
          'max': olExtent[2]
        },
        'y': {
          'min': olExtent[1],
          'max': olExtent[3]
        }
      };
    }
    else {
      extent = this.envolvedMaxExtent_;
    }

    return extent;
  };

  /**
   * This function sets current extent (bbox) for this
   * map instance
   *
   * @public
   * @function
   * @param {Mx.Extent} bbox the bbox
   * @returns {M.impl.Map}
   * @api stable
   */
  M.impl.Map.prototype.setBbox = function (bbox) {
    // checks if the param is null or empty
    if (M.utils.isNullOrEmpty(bbox)) {
      M.exception('No ha especificado ningún bbox');
    }

    this.userBbox_ = bbox;

    // set the extent by ol
    var extent;
    if (M.utils.isArray(bbox)) {
      extent = bbox;
    }
    else if (M.utils.isObject(bbox)) {
      extent = [bbox.x.min, bbox.y.min, bbox.x.max, bbox.y.max];
    }
    var olMap = this.getMapImpl();
    var size = olMap.getSize();
    olMap.getView().fit(extent, size);

    return this;
  };

  /**
   * This function gets the current extent (bbox) of this
   * map instance
   *
   * @public
   * @function
   * @returns {Mx.Extent}
   * @api stable
   */
  M.impl.Map.prototype.getBbox = function () {
    var bbox = null;

    var olMap = this.getMapImpl();
    var view = olMap.getView();
    if (!M.utils.isNullOrEmpty(view.getCenter())) {
      var olExtent = view.calculateExtent(olMap.getSize());

      if (!M.utils.isNullOrEmpty(olExtent)) {
        bbox = {
          x: {
            min: olExtent[0],
            max: olExtent[2]
          },
          y: {
            min: olExtent[1],
            max: olExtent[3]
          }
        };
      }
    }
    return bbox;
  };

  /**
   * This function sets current zoom for this
   * map instance
   *
   * @public
   * @function
   * @param {Number} zoom the new zoom
   * @returns {M.impl.Map}
   * @api stable
   */
  M.impl.Map.prototype.setZoom = function (zoom) {
    // checks if the param is null or empty
    if (M.utils.isNullOrEmpty(zoom)) {
      M.exception('No ha especificado ningún zoom');
    }

    // set the zoom by ol
    this.getMapImpl().getView().setUserZoom(zoom);

    return this;
  };

  /**
   * This function gets the current zoom of this
   * map instance
   *
   * @public
   * @function
   * @returns {Number}
   * @api stable
   */
  M.impl.Map.prototype.getZoom = function () {
    var zoom = this.getMapImpl().getView().getZoom();
    return zoom;
  };

  /**
   * This function sets current center for this
   * map instance
   *
   * @public
   * @function
   * @param {Object} center the new center
   * @returns {M.impl.Map}
   * @api stable
   */
  M.impl.Map.prototype.setCenter = function (center) {
    // checks if the param is null or empty
    if (M.utils.isNullOrEmpty(center)) {
      M.exception('No ha especificado ningún center');
    }

    // set the zoom by ol
    var olCenter = [center.x, center.y];
    var olView = this.getMapImpl().getView();
    var srcCenter = olView.getCenter();
    if (!M.utils.isNullOrEmpty(srcCenter)) {
      var panAnimation = ol.animation.pan({
        duration: 250,
        source: srcCenter
      });
      this.getMapImpl().beforeRender(panAnimation);
    }
    olView.setCenter(olCenter);

    if (center.draw === true) {
      this.drawPoints([{
        'x': center.x,
        'y': center.y,
        'click': goog.bind(function (evt) {
          var label = this.getLabel();
          if (!M.utils.isNullOrEmpty(label)) {
            label.show(this.facadeMap_);
          }
        }, this)
         }]);
    }
    return this;
  };

  /**
   * This function gets the current center of this
   * map instance
   *
   * @public
   * @function
   * @returns {Object}
   * @api stable
   */
  M.impl.Map.prototype.getCenter = function () {
    var center = null;
    var olCenter = this.getMapImpl().getView().getCenter();
    if (!M.utils.isNullOrEmpty(olCenter)) {
      center = {
        'x': olCenter[0],
        'y': olCenter[1]
      };
    }
    return center;
  };

  /**
   * This function gets the current resolutions of this
   * map instance
   *
   * @public
   * @function
   * @returns {Array<Number>}
   * @api stable
   */
  M.impl.Map.prototype.getResolutions = function () {
    var olMap = this.getMapImpl();
    var resolutions = olMap.getView().getResolutions();

    return resolutions;
  };

  /**
   * This function sets current resolutions for this
   * map instance
   *
   * @public
   * @function
   * @param {Array<Number>} resolutions the resolutions
   * @returns {M.impl.Map}
   * @api stable
   */
  M.impl.Map.prototype.setResolutions = function (resolutions, optional) {
    // checks if the param is null or empty
    if (M.utils.isNullOrEmpty(resolutions)) {
      M.exception('No ha especificado ninguna resolución');
    }

    if (M.utils.isNullOrEmpty(optional)) {
      this.userResolutions_ = resolutions;
    }

    // gets the projection
    var projection = ol.proj.get(this.getProjection().code);

    // sets the resolutions
    var olMap = this.getMapImpl();
    var oldViewProperties = olMap.getView().getProperties();
    var userZoom = olMap.getView().getUserZoom();

    var newView = new M.impl.View({
      'projection': projection
    });
    newView.setProperties(oldViewProperties);
    newView.setResolutions(resolutions);
    newView.setUserZoom(userZoom);

    olMap.setView(newView);

    // sets the resolutions for each layer
    var layers = this.getWMS();
    layers.forEach(function (layer) {
      layer.getImpl().setResolutions(resolutions);
    });

    if (!M.utils.isNullOrEmpty(this.userBbox_)) {
      this.facadeMap_.setBbox(this.userBbox_);
    }

    return this;
  };

  /**
   * This function gets current scale for this
   * map instance
   *
   * @public
   * @function
   * @returns {number}
   * @api stable
   */
  M.impl.Map.prototype.getScale = function () {
    var olMap = this.getMapImpl();

    var resolution = olMap.getView().getResolution();
    var units = this.getProjection().units;

    var scale = M.utils.getScaleFromResolution(resolution, units);

    if (!M.utils.isNullOrEmpty(scale)) {
      if (scale >= 1000 && scale <= 950000) {
        scale = Math.round(scale / 1000) * 1000;
      }
      else if (scale >= 950000) {
        scale = Math.round(scale / 1000000) * 1000000;
      }
      else {
        scale = Math.round(scale);
      }
    }

    return scale;
  };

  /**
   * This function sets current projection for this
   * map instance
   *
   * @public
   * @function
   * @param {Mx.Projection} bbox the bbox
   * @returns {M.impl.Map}
   * @api stable
   */
  M.impl.Map.prototype.setProjection = function (projection) {
    // checks if the param is null or empty
    if (M.utils.isNullOrEmpty(projection)) {
      M.exception('No ha especificado ninguna projection');
    }

    // gets the current view and modifies its projection
    var olProjection = ol.proj.get(projection.code);
    if (M.utils.isNullOrEmpty(olProjection)) {
      olProjection = new ol.proj.Projection(projection);
    }

    // gets previous data
    var olPrevProjection = ol.proj.get(this.getProjection().code);
    var prevBbox = this.facadeMap_.getBbox();
    var prevMaxExtent = this.facadeMap_.getMaxExtent();
    var prevCenter = this.facadeMap_.getCenter();
    var resolutions = this.facadeMap_.getResolutions();

    var olMap = this.getMapImpl();
    var oldViewProperties = olMap.getView().getProperties();
    var userZoom = olMap.getView().getUserZoom();
    var resolution = olMap.getView().getResolution();

    // sets the new view
    var newView = new M.impl.View({
      'projection': olProjection
    });
    newView.setProperties(oldViewProperties);
    newView.setUserZoom(userZoom);
    if (!M.utils.isNullOrEmpty(resolutions)) {
      newView.setResolutions(resolutions);
    }
    if (!M.utils.isNullOrEmpty(resolution)) {
      newView.setResolution(resolution);
    }
    olMap.setView(newView);

    // updates min, max resolutions of all WMS layers
    this.facadeMap_.getWMS().forEach(function (layer) {
      layer.updateMinMaxResolution(projection);
    });

    // recalculates maxExtent
    if (!M.utils.isNullOrEmpty(prevMaxExtent)) {
      if (!M.utils.isArray(prevMaxExtent)) {
        prevMaxExtent = [prevMaxExtent.x.min,
               prevMaxExtent.y.min,
               prevMaxExtent.x.max,
               prevMaxExtent.y.max
            ];
      }
      this.facadeMap_.setMaxExtent(ol.proj.transformExtent(prevMaxExtent, olPrevProjection, olProjection));
    }

    // recalculates bbox
    if (!M.utils.isNullOrEmpty(prevBbox)) {
      this.facadeMap_.setBbox(ol.proj.transformExtent([
            prevBbox.x.min,
            prevBbox.y.min,
            prevBbox.x.max,
            prevBbox.y.max,
         ], olPrevProjection, olProjection));
    }

    // recalculates center
    if (!M.utils.isNullOrEmpty(prevCenter)) {
      let draw = false;
      if (!M.utils.isNullOrEmpty(this.facadeMap_.getFeatureCenter())) {
        draw = true;
      }
      this.facadeMap_.setCenter(ol.proj.transform([
            prevCenter.x,
            prevCenter.y,
         ], olPrevProjection, olProjection) + "*" + draw);
    }

    // recalculates resolutions
    this.updateResolutionsFromBaseLayer();

    // reprojects popup
    let popup = this.facadeMap_.getPopup();
    if (!M.utils.isNullOrEmpty(popup)) {
      let coord = popup.getCoordinate();
      if (!M.utils.isNullOrEmpty(coord)) {
        coord = ol.proj.transform(coord, olPrevProjection, olProjection);
        popup.setCoordinate(coord);
      }
    }

    // reprojects label
    var label = this.facadeMap_.getLabel();
    if (!M.utils.isNullOrEmpty(label)) {
      let coord = label.getCoordinate();
      if (!M.utils.isNullOrEmpty(coord)) {
        coord = ol.proj.transform(coord, olPrevProjection, olProjection);
        label.setCoordinate(coord);
      }
    }

    this.fire(M.evt.CHANGE);

    return this;
  };

  /**
   * This function gets the current projection of this
   * map instance
   *
   * @public
   * @function
   * @returns {Mx.Projection}
   * @api stable
   */
  M.impl.Map.prototype.getProjection = function () {
    var olMap = this.getMapImpl();
    var olProjection = olMap.getView().getProjection();

    var projection = null;

    if (!M.utils.isNullOrEmpty(olProjection)) {
      projection = {
        code: olProjection.getCode(),
        units: olProjection.getUnits()
      };
    }
    return projection;
  };

  /**
   * This function provides ol3 map used by this instance
   *
   * @public
   * @returns {ol.Map}
   * @function
   * @api stable
   */
  M.impl.Map.prototype.getMapImpl = function () {
    return this.map_;
  };

  /**
   * This function adds a popup and removes the previous
   * showed
   *
   * @public
   * @param {M.impl.Popup} popup to add
   * @returns {ol.Map}
   * @function
   * @api stable
   */
  M.impl.Map.prototype.removePopup = function (popup) {
    if (!M.utils.isNullOrEmpty(popup)) {
      var olPopup = popup.getImpl();
      var olMap = this.getMapImpl();
      olMap.removeOverlay(olPopup);
    }
    return this;
  };

  /**
   * This function gets the envolved extent of this
   * map instance
   *
   * @public
   * @function
   * @returns {Promise}
   * @api stable
   */
  M.impl.Map.prototype.getEnvolvedExtent = function () {
    return M.impl.envolvedExtent.calculate(this).then(function (extent) {
      this.envolvedMaxExtent_ = extent;
      return this.envolvedMaxExtent_;
    }.bind(this));
  };

  /**
   * This function destroys this map, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.Map.prototype.destroy = function () {
    this.layers_.length = 0;
    this.controls_.length = 0;

    this.popup_ = null;
    this.options_ = null;

    this.map_.setTarget(null);
    this.map_ = null;
  };

  /**
   * Updates the resolutions for this map calculated
   * from base layers
   *
   * @public
   * @function
   * @returns {M.Map}
   * @api stable
   */
  M.impl.Map.prototype.updateResolutionsFromBaseLayer = function () {
    var resolutions = [];

    // zoom levels
    var zoomLevels = 16;

    // units
    var units = this.getProjection().units;

    // size
    var size = this.getMapImpl().getSize();

    var baseLayer = this.getBaseLayers().filter(function (bl) {
      return bl.isVisible();
    })[0];

    // gets min/max resolutions from base layer
    var maxResolution = null;
    var minResolution = null;
    if (!M.utils.isNullOrEmpty(baseLayer)) {
      minResolution = baseLayer.getImpl().getMinResolution();
      maxResolution = baseLayer.getImpl().getMaxResolution();
      zoomLevels = baseLayer.getImpl().getNumZoomLevels();
    }

    if (this.userResolutions_ === null) {
      if (!M.utils.isNullOrEmpty(minResolution) && !M.utils.isNullOrEmpty(maxResolution)) {
        resolutions = M.utils.fillResolutions(minResolution, maxResolution, zoomLevels);
        this.setResolutions(resolutions, true);

        this._resolutionsBaseLayer = true;

        // checks if it was the first time to
        // calculate resolutions in that case
        // fires the completed event
        if (this._calculatedResolutions === false) {
          this._calculatedResolutions = true;
          this.fire(M.evt.COMPLETED);
        }
      }
      else {
        M.impl.envolvedExtent.calculate(this).then(function (extent) {
          if (!this._resolutionsBaseLayer && (this.userResolutions_ === null)) {

            resolutions = M.utils.generateResolutionsFromExtent(extent, size, zoomLevels, units);
            this.setResolutions(resolutions, true);

            this._resolutionsEnvolvedExtent = true;

            // checks if it was the first time to
            // calculate resolutions in that case
            // fires the completed event
            if (this._calculatedResolutions === false) {
              this._calculatedResolutions = true;
              this.fire(M.evt.COMPLETED);
            }
          }
        }.bind(this));
      }
    }
  };

  /**
   * This function adds a popup and removes the previous
   * showed
   *
   * @public
   * @param {M.impl.Popup} popup to add
   * @returns {ol.Map}
   * @function
   * @api stable
   */
  M.impl.Map.prototype.addLabel = function (label) {
    this.label = label;
    label.show(this.facadeMap_);
    return this;
  };

  /**
   * This function adds a popup and removes the previous
   * showed
   *
   * @public
   * @param {M.impl.Popup} popup to add
   * @returns {ol.Map}
   * @function
   * @api stable
   */
  M.impl.Map.prototype.getLabel = function () {
    return this.label;

  };

  /**
   * This function provides ol3 map used by this instance
   *
   * @public
   * @returns {ol.Map}
   * @function
   * @api stable
   */
  M.impl.Map.prototype.removeLabel = function () {
    if (!M.utils.isNullOrEmpty(this.label)) {
      var popup = this.label.getPopup();
      this.removePopup(popup);
      this.label = null;
    }
  };

  /**
   * This function removes the WMC layers to the map
   *
   * @function
   * @param {Array<Mx.Point>|Mx.Point} points
   * @returns {M.Map}
   * @api stable
   */
  M.impl.Map.prototype.drawPoints = function (points) {
    this.getDrawLayer().drawPoints(points);

    return this;
  };

  /**
   * This function removes the WMC layers to the map
   *
   * @function
   * @param {Array<Mx.Point>|Mx.Point} points
   * @returns {M.Map}
   * @api stable
   */
  M.impl.Map.prototype.drawFeatures = function (features) {
    this.getDrawLayer().drawFeatures(features);

    return this;
  };

  /**
   * This function removes the WMC layers to the map
   *
   * @function
   * @returns {Array<Mx.Point>}
   * @api stable
   */
  M.impl.Map.prototype.getPoints = function (coordinate) {
    return this.getDrawLayer().getPoints(coordinate);
  };

  /**
   * This function removes the WMC layers to the map
   *
   * @function
   * @param {Array<Mx.Point>|Mx.Point} points
   * @returns {M.Map}
   * @api stable
   */
  M.impl.Map.prototype.removeFeatures = function (features) {
    this.getDrawLayer().removeFeatures(features);

    return this;
  };


  /**
   * This function gets the layer to draw
   *
   * @public
   * @function
   * @returns {M.impl.layer.Draw}
   * @api stable
   */
  M.impl.Map.prototype.getDrawLayer = function (coordinate) {
    if (M.utils.isNullOrEmpty(this.drawLayer_)) {
      this.drawLayer_ = new M.impl.layer.Draw();
      this.drawLayer_.addTo(this.facadeMap_);
      this.featuresHandler_.addLayer(this.drawLayer_);
    }
    return this.drawLayer_;
  };

  /**
   * This function provides the core map used by the
   * implementation
   *
   * @function
   * @api stable
   * @returns {Object} core map used by the implementation
   */
  M.impl.Map.prototype.getContainer = function () {
    return this.map_.overlayContainerStopEvent_;
  };

  /**
   * This function gets the layer to draw
   *
   * @public
   * @function
   * @returns {M.impl.layer.Draw}
   * @api stable
   */
  M.impl.Map.prototype.getFeaturesHandler = function () {
    return this.featuresHandler_;
  };

  /**
   * This function sets the facade map to implement
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.Map.prototype.setFacadeMap = function (facadeMap) {
    this.facadeMap_ = facadeMap;
  };

  /**
   * Z-INDEX for the layers
   * @const
   * @type {Object}
   * @public
   * @api stable
   */
  M.impl.Map.Z_INDEX = {};
  M.impl.Map.Z_INDEX[M.layer.type.WMC] = 1;
  M.impl.Map.Z_INDEX[M.layer.type.WMS] = 1000;
  M.impl.Map.Z_INDEX[M.layer.type.WMTS] = 2000;
  M.impl.Map.Z_INDEX[M.layer.type.Mapbox] = 2000;
  M.impl.Map.Z_INDEX[M.layer.type.OSM] = 2000;
  M.impl.Map.Z_INDEX[M.layer.type.KML] = 3000;
  M.impl.Map.Z_INDEX[M.layer.type.WFS] = 9999;
})();
