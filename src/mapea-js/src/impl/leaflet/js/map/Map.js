import MObject from "facade/js/Object";
import Utils from "facade/js/util/Utils";
import Config from "Configuration";
import Exception from "facade/js/exception/Exception";
import LayerType from "facade/js/layer/Type";
import WMS from "facade/js/layer/WMS";
import WFS from "facade/js/layer/WFS";
import WMC from "facade/js/layer/WMC";
import Panzoombar from "facade/js/control/Panzoombar";
import Control from "facade/js/control/Control";

export default class Map extends MObject {
  /**
   * @classdesc
   * Main constructor of the class. Creates a Map
   * with the specified div
   *
   * @constructor
   * @param {Object} div
   * @param {Mx.parameters.MapOptions} options
   * @api stable
   */
  constructor(div, options = {}) {
    super()
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
    this.options_ = options;

    /**
     * Implementation of this map
     * @private
     * @type {L.Map}
     */
    this.map_ = new L.Map(div.id, {
      zoomControl: false
    });
  }

  /**
   * This function gets the layers added to the map
   *
   * @public
   * @function
   * @param {Array<M.Layer>} filters to apply to the search
   * @returns {Array<M.Layer>} layers from the map
   * @api stable
   */
  getLayers(filters) {
    let wmcLayers = this.getWMC(filters);
    let kmlLayers = this.getKML(filters);
    let wmsLayers = this.getWMS(filters);
    let wfsLayers = this.getWFS(filters);
    let wmtsLayers = this.getWMTS(filters);
    let mbtilesLayers = this.getMBtiles(filters);

    let unknowLayers = this.layers_.filter(layer => {
      return !LayerType.know(layer.type);
    });

    return wmcLayers.concat(kmlLayers).concat(wmsLayers)
      .concat(wfsLayers).concat(wmtsLayers)
      .concat(mbtilesLayers).concat(unknowLayers);
  }

  /**
   * This function gets the layers added to the map
   *
   * @public
   * @function
   * @param {Array<M.Layer>} filters to apply to the search
   * @returns {Array<M.Layer>} layers from the map
   * @api stable
   */
  getBaseLayers() {
    let baseLayers = this.getLayers().filter(layer => {
      let isBaseLayer = false;
      if (Utils.isNullOrEmpty(layer.type) || (layer.type === LayerType.WMS)) {
        isBaseLayer = (layer.transparent !== true);
      }
      return isBaseLayer;
    });

    return baseLayers;
  }

  /**
   * This function adds layers specified by the user
   *
   * @public
   * @function
   * @param {Array<Object>} layers
   * @returns {M.impl.Map}
   */
  addLayers(layers) {
    // gets the layers with type defined and undefined
    let unknowLayers = layers.filter((layer) => {
      return !LayerType.know(layer.type);
    });
    let knowLayers = layers.filter((layer) => {
      return LayerType.know(layer.type);
    });

    this.addWMC(knowLayers);
    this.addMBtiles(knowLayers);
    this.addWMS(knowLayers);
    this.addWMTS(knowLayers);
    this.addKML(knowLayers);
    this.addWFS(knowLayers);

    // adds unknow layers
    unknowLayers.forEach((layer) => {
      if (!Utils.includes(this.layers_, layer)) {
        layer.getImpl().addTo(this.facadeMap_);
        this.layers_.push(layer);
      }
    });

    return this;
  }

  /**
   * This function removes the layers from the map
   *
   * @function
   * @param {Array<Object>} layers to remove
   * @returns {M.impl.Map}
   * @api stable
   */
  removeLayers(layers) {

    // gets the layers with type defined and undefined
    let unknowLayers = layers.filter((layer) => {
      return Utils.isNullOrEmpty(layer.type);
    });
    let knowLayers = layers.filter((layer) => {
      return !Utils.isNullOrEmpty(layer.type);
    });

    this.removeWMC(knowLayers);
    this.removeKML(knowLayers);
    this.removeWMS(knowLayers);
    this.removeWFS(knowLayers);
    this.removeWMTS(knowLayers);
    this.removeMBtiles(knowLayers);

    // removes unknow layers
    unknowLayers.forEach((layer) => {
      if (!Utils.includes(this.layers_, layer)) {
        this.layers_.remove(layer);
        layer.getImpl().destroy();
      }
    });

    return this;
  }

  /**
   * This function gets the WMC layers added to the map
   *
   * @function
   * @param {Array<M.Layer>} filters to apply to the search
   * @returns {Array<M.layer.WMC>} layers from the map
   * @api stable
   */
  getWMC(filters) {
    let foundLayers = [];

    // get all wmcLayers
    let wmcLayers = this.layers_.filter((layer) => {
      return (layer.type === LayerType.WMC);
    });

    // parse to Array
    if (Utils.isNullOrEmpty(filters)) {
      filters = [];
    }
    if (!Utils.isArray(filters)) {
      filters = [filters];
    }

    if (filters.length === 0) {
      foundLayers = wmcLayers;
    }
    else {
      filters.forEach(filterLayer => {
        foundLayers = foundLayers.concat(wmcLayers.filter((wmcLayer) => {
          let layerMatched = true;
          // checks if the layer is not in selected layers
          if (!foundLayers.includes(wmcLayer)) {
            // type
            if (!Utils.isNullOrEmpty(filterLayer.type)) {
              layerMatched = (layerMatched && (filterLayer.type === wmcLayer.type));
            }
            // URL
            if (!Utils.isNullOrEmpty(filterLayer.url)) {
              layerMatched = (layerMatched && (filterLayer.url === wmcLayer.url));
            }
            // name
            if (!Utils.isNullOrEmpty(filterLayer.name)) {
              layerMatched = (layerMatched && (filterLayer.name === wmcLayer.name));
            }
          }
          else {
            layerMatched = false;
          }
          return layerMatched;
        }));
      });
    }
    return foundLayers;
  }

  /**
   * This function adds the WMC layers to the map
   *
   * @function
   * @param {Array<M.impl.layer.WMC>} layers
   * @returns {M.impl.Map}
   * @api stable
   */
  addWMC(layers) {
    layers.forEach((layer, zIndex) => {
      // checks if layer is WMC and was added to the map
      if (layer.type == LayerType.WMC) {
        if (!Utils.includes(this.layers_, layer)) {
          layer.getImpl().setZIndex();
          layer.getImpl().addTo(this.facadeMap_);
          this.layers_.push(layer);
        }
      }
    });

    return this;
  }

  /**
   * This function removes the WMC layers to the map
   *
   * @function
   * @param {Array<M.layer.WMC>} layers
   * @returns {M.impl.Map}
   * @api stable
   */
  removeWMC(layers) {
    let wmcMapLayers = this.getWMC(layers);
    wmcMapLayers.forEach(wmcLayer => {
      this.layers_.remove(wmcLayer);
    });

    return this;
  }

  /**
   * This function gets the KML layers added to the map
   *
   * @function
   * @param {Array<M.Layer>} filters to apply to the search
   * @returns {Array<M.layer.KML>} layers from the map
   * @api stable
   */
  getKML(filters) {
    let foundLayers = [];

    // get all kmlLayers
    let kmlLayers = this.layers_.filter(layer => {
      return (layer.type === LayerType.KML);
    });

    // parse to Array
    if (Utils.isNullOrEmpty(filters)) {
      filters = [];
    }
    if (!Utils.isArray(filters)) {
      filters = [filters];
    }

    if (filters.length === 0) {
      foundLayers = kmlLayers;
    }
    else {
      filters.forEach(filterLayer => {
        let filteredKMLLayers = kmlLayers.filter(kmlLayer => {
          let layerMatched = true;
          // checks if the layer is not in selected layers
          if (!foundLayers.includes(kmlLayer)) {
            // type
            if (!Utils.isNullOrEmpty(filterLayer.type)) {
              layerMatched = (layerMatched && (filterLayer.type === kmlLayer.type));
            }
            // URL
            if (!Utils.isNullOrEmpty(filterLayer.url)) {
              layerMatched = (layerMatched && (filterLayer.url === kmlLayer.url));
            }
            // name
            if (!Utils.isNullOrEmpty(filterLayer.name)) {
              layerMatched = (layerMatched && (filterLayer.name === kmlLayer.name));
            }
            // extract
            if (!Utils.isNullOrEmpty(filterLayer.extract)) {
              layerMatched = (layerMatched && (filterLayer.extract === kmlLayer.extract));
            }
          }
          else {
            layerMatched = false;
          }
          return layerMatched;
        });
        foundLayers = foundLayers.concat(filteredKMLLayers);
      });
    }
    return foundLayers;
  }

  /**
   * This function adds the KML layers to the map
   *
   * @function
   * @param {Array<M.layer.KML>} layers
   * @returns {M.impl.Map}
   * @api stable
   */
  addKML(layers) {
    layers.forEach(layer => {
      // checks if layer is WMC and was added to the map
      if (layer.type == LayerType.KML) {
        if (!Utils.includes(this.layers_, layer)) {
          layer.getImpl().addTo(this.facadeMap_);
          this.layers_.push(layer);
          let zIndex = this.layers_.length + Map.Z_INDEX[LayerType.KML];
          layer.getImpl().setZIndex(zIndex);

          // adds to featurehandler
          if (layer.extract === true) {
            this.featuresHandler_.addLayer(layer.getImpl());
          }
        }
      }
    });

    return this;
  }

  /**
   * This function removes the KML layers to the map
   *
   * @function
   * @param {Array<M.layer.KML>} layers
   * @returns {M.impl.Map}
   * @api stable
   */
  removeKML(layers) {
    let kmlMapLayers = this.getKML(layers);
    kmlMapLayers.forEach(kmlLayer => {
      this.layers_.remove(kmlLayer);
      kmlLayer.getImpl().destroy();
    });

    return this;
  }

  /**
   * This function gets the WMS layers added to the map
   *
   * @function
   * @param {Array<M.Layer>} filters to apply to the search
   * @returns {Array<WMS>} layers from the map
   * @api stable
   */
  getWMS(filters) {
    let foundLayers = [];

    // get all wmsLayers
    let wmsLayers = this.layers_.filter(layer => {
      return (layer.type === LayerType.WMS);
    });

    // parse to Array
    if (Utils.isNullOrEmpty(filters)) {
      filters = [];
    }
    if (!Utils.isArray(filters)) {
      filters = [filters];
    }

    if (filters.length === 0) {
      foundLayers = wmsLayers;
    }
    else {
      filters.forEach(filterLayer => {
        let filteredWMSLayers = wmsLayers.filter(wmsLayer => {
          let layerMatched = true;
          // checks if the layer is not in selected layers
          if (!foundLayers.includes(wmsLayer)) {
            // if instanceof WMS check if it is the same
            if (filterLayer instanceof WMS) {
              layerMatched = (filterLayer === wmsLayer);
            }
            else {
              // type
              if (!Utils.isNullOrEmpty(filterLayer.type)) {
                layerMatched = (layerMatched && (filterLayer.type === wmsLayer.type));
              }
              // URL
              if (!Utils.isNullOrEmpty(filterLayer.url)) {
                layerMatched = (layerMatched && (filterLayer.url === wmsLayer.url));
              }
              // name
              if (!Utils.isNullOrEmpty(filterLayer.name)) {
                layerMatched = (layerMatched && (filterLayer.name === wmsLayer.name));
              }
              // legend
              if (!Utils.isNullOrEmpty(filterLayer.legend)) {
                layerMatched = (layerMatched && (filterLayer.legend === wmsLayer.legend));
              }
              // transparent
              if (!Utils.isNullOrEmpty(filterLayer.transparent)) {
                layerMatched = (layerMatched && (filterLayer.transparent === wmsLayer.transparent));
              }
              // tiled
              if (!Utils.isNullOrEmpty(filterLayer.tiled)) {
                layerMatched = (layerMatched && (filterLayer.tiled === wmsLayer.tiled));
              }
              // cql
              if (!Utils.isNullOrEmpty(filterLayer.cql)) {
                layerMatched = (layerMatched && (filterLayer.cql === wmsLayer.cql));
              }
              // version
              if (!Utils.isNullOrEmpty(filterLayer.version)) {
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
      });
    }
    return foundLayers;
  }

  /**
   * This function adds the WMS layers to the map
   *
   * @function
   * @param {Array<WMS>} layers
   * @returns {M.impl.Map}
   * @api stable
   */
  addWMS(layers) {
    // cehcks if exists a base layer
    let baseLayers = this.getWMS().filter(layer => layer.transparent !== true);
    let existsBaseLayer = (baseLayers.length > 0);

    layers.forEach(layer => {
      // checks if layer is WMC and was added to the map
      if (layer.type == LayerType.WMS) {
        if (!Utils.includes(this.layers_, layer)) {
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
            let zIndex = this.layers_.length + layer.getImpl().getZIndex();
            layer.getImpl().setZIndex(zIndex);
          }
        }
      }
    });
    return this;
  }

  /**
   * This function removes the WMS layers to the map
   *
   * @function
   * @param {Array<WMS>} layers
   * @returns {M.impl.Map}
   * @api stable
   */
  removeWMS(layers) {
    let wmsMapLayers = this.getWMS(layers);
    wmsMapLayers.forEach(wmsLayer => {
      this.layers_.remove(wmsLayer);
      wmsLayer.getImpl().destroy();
    });

    return this;
  }

  /**
   * This function gets the WFS layers added to the map
   *
   * @function
   * @param {Array<M.Layer>} filters to apply to the search
   * @returns {Array<M.layer.WFS>} layers from the map
   * @api stable
   */
  getWFS(filters) {
    let foundLayers = [];

    // get all wfsLayers
    let wfsLayers = this.layers_.filter(layer => layer.type === LayerType.WFS);

    // parse to Array
    if (Utils.isNullOrEmpty(filters)) {
      filters = [];
    }
    if (!Utils.isArray(filters)) {
      filters = [filters];
    }

    if (filters.length === 0) {
      foundLayers = wfsLayers;
    }
    else {
      filters.forEach(filterLayer => {
        let filteredWFSLayers = wfsLayers.filter(wfsLayer => {
          let layerMatched = true;
          // checks if the layer is not in selected layers
          if (!foundLayers.includes(wfsLayer)) {
            // type
            if (!Utils.isNullOrEmpty(filterLayer.type)) {
              layerMatched = (layerMatched && (filterLayer.type === wfsLayer.type));
            }
            // URL
            if (!Utils.isNullOrEmpty(filterLayer.url)) {
              layerMatched = (layerMatched && (filterLayer.url === wfsLayer.url));
            }
            // name
            if (!Utils.isNullOrEmpty(filterLayer.name)) {
              layerMatched = (layerMatched && (filterLayer.name === wfsLayer.name));
            }
            // namespace
            if (!Utils.isNullOrEmpty(filterLayer.namespace)) {
              layerMatched = (layerMatched && (filterLayer.namespace === wfsLayer.namespace));
            }
            // legend
            if (!Utils.isNullOrEmpty(filterLayer.legend)) {
              layerMatched = (layerMatched && (filterLayer.legend === wfsLayer.legend));
            }
            // cql
            if (!Utils.isNullOrEmpty(filterLayer.cql)) {
              layerMatched = (layerMatched && (filterLayer.cql === wfsLayer.cql));
            }
            // geometry
            if (!Utils.isNullOrEmpty(filterLayer.geometry)) {
              layerMatched = (layerMatched && (filterLayer.geometry === wfsLayer.geometry));
            }
            // ids
            if (!Utils.isNullOrEmpty(filterLayer.ids)) {
              layerMatched = (layerMatched && (filterLayer.ids === wfsLayer.ids));
            }
            // version
            if (!Utils.isNullOrEmpty(filterLayer.version)) {
              layerMatched = (layerMatched && (filterLayer.version === wfsLayer.version));
            }
          }
          else {
            layerMatched = false;
          }
          return layerMatched;
        });
        foundLayers = foundLayers.concat(filteredWFSLayers);
      });
    }
    return foundLayers;
  }

  /**
   * This function adds the WFS layers to the map
   *
   * @function
   * @param {Array<M.layer.WFS>} layers
   * @returns {M.impl.Map}
   * @api stable
   */
  addWFS(layers) {
    layers.forEach(layer => {
      // checks if layer is WFS and was added to the map
      if (layer.type == LayerType.WFS) {
        if (!Utils.includes(this.layers_, layer)) {
          layer.getImpl().addTo(this.facadeMap_);
          this.layers_.push(layer);
          let zIndex = this.layers_.length + Map.Z_INDEX[LayerType.WFS];
          layer.getImpl().setZIndex(zIndex);
          this.featuresHandler_.addLayer(layer.getImpl());
        }
      }
    });

    return this;
  }

  /**
   * This function removes the WFS layers to the map
   *
   * @function
   * @param {Array<M.layer.WFS>} layers
   * @returns {M.impl.Map}
   * @api stable
   */
  removeWFS(layers) {
    let wfsMapLayers = this.getWFS(layers);
    wfsMapLayers.forEach(wfsLayer => {
      wfsLayer.getImpl().destroy();
      this.layers_.remove(wfsLayer);
    });

    return this;
  }

  /**
   * This function gets the WMTS layers added to the map
   *
   * @function
   * @param {Array<M.Layer>} filters to apply to the search
   * @returns {Array<M.layer.WMTS>} layers from the map
   * @api stable
   */
  getWMTS(filters) {
    let foundLayers = [];

    // get all kmlLayers
    let wmtsLayers = this.layers_.filter(layer => layer.type === LayerType.WMTS);

    // parse to Array
    if (Utils.isNullOrEmpty(filters)) {
      filters = [];
    }
    if (!Utils.isArray(filters)) {
      filters = [filters];
    }

    if (filters.length === 0) {
      foundLayers = wmtsLayers;
    }
    else {
      filters.forEach(filterLayer => {
        // TODO ERROR DE RECURSIVIDAD: let l = map.getLayers(); map.getWMS(l);
        let filteredWMTSLayers = wmtsLayers.filter(wmtsLayer => {
          let layerMatched = true;
          // checks if the layer is not in selected layers
          if (!foundLayers.includes(wmtsLayer)) {
            // type
            if (!Utils.isNullOrEmpty(filterLayer.type)) {
              layerMatched = (layerMatched && (filterLayer.type === wmtsLayer.type));
            }
            // URL
            if (!Utils.isNullOrEmpty(filterLayer.url)) {
              layerMatched = (layerMatched && (filterLayer.url === wmtsLayer.url));
            }
            // name
            if (!Utils.isNullOrEmpty(filterLayer.name)) {
              layerMatched = (layerMatched && (filterLayer.name === wmtsLayer.name));
            }
            // matrixSet
            if (!Utils.isNullOrEmpty(filterLayer.matrixSet)) {
              layerMatched = (layerMatched && (filterLayer.matrixSet === wmtsLayer.matrixSet));
            }
            // legend
            if (!Utils.isNullOrEmpty(filterLayer.legend)) {
              layerMatched = (layerMatched && (filterLayer.legend === wmtsLayer.legend));
            }
          }
          else {
            layerMatched = false;
          }
          return layerMatched;
        });
        foundLayers = foundLayers.concat(filteredWMTSLayers);
      });
    }
    return foundLayers;
  }

  /**
   * This function adds the WMTS layers to the map
   *
   * @function
   * @param {Array<M.layer.WMTS>} layers
   * @returns {M.impl.Map}
   * @api stable
   */
  addWMTS(layers) {
    layers.forEach(layer => {
      // checks if layer is WMTS and was added to the map
      if (layer.type == LayerType.WMTS) {
        if (!Utils.includes(this.layers_, layer)) {
          layer.getImpl().addTo(this.facadeMap_);
          this.layers_.push(layer);
          let zIndex = this.layers_.length + Map.Z_INDEX[LayerType.WMTS];
          layer.getImpl().setZIndex(zIndex);
        }
      }
    });
    return this;
  }

  /**
   * This function removes the WMTS layers to the map
   *
   * @function
   * @param {Array<M.layer.WMTS>} layers
   * @returns {M.impl.Map}
   * @api stable
   */
  removeWMTS(layers) {
    let wmtsMapLayers = this.getWMTS(layers);
    wmtsMapLayers.forEach(wmtsLayer => {
      wmtsLayer.getImpl().destroy();
      this.layers_.remove(wmtsLayer);
    });

    return this;
  }

  /**
   * This function gets the MBtiles layers added to the map
   *
   * @function
   * @param {Array<M.Layer>} filters to apply to the search
   * @returns {Array<M.layer.MBtiles>} layers from the map
   * @api stable
   */
  getMBtiles(filters) {
    let foundLayers = [];

    return foundLayers;
  }

  /**
   * This function adds the MBtiles layers to the map
   *
   * @function
   * @param {Array<M.layer.MBtiles>} layers
   * @returns {M.impl.Map}
   * @api stable
   */
  addMBtiles(layers) {
    layers.forEach(layer => {
      // checks if layer is MBtiles and was added to the map
      if ((layer.type == LayerType.MBtiles) &&
        !Utils.includes(this.layers_, layer)) {
        // TODO creating and adding the MBtiles layer with ol3
        this.layers_.push(layer);
      }
    });
    return this;
  }

  /**
   * This function removes the MBtiles layers to the map
   *
   * @function
   * @param {Array<M.layer.MBtiles>} layers
   * @returns {M.impl.Map}
   * @api stable
   */
  removeMBtiles(layers) {
    let mbtilesMapLayers = this.getMBtiles(layers);
    mbtilesMapLayers.forEach(mbtilesLayer => {
      // TODO removing the MBtiles layer with ol3
      this.layers_.remove(mbtilesLayer);
    });

    return this;
  }

  /**
   * This function adds controls specified by the user
   *
   * @public
   * @function
   * @param {string|Array<String>} filters
   * @returns {Array<M.Control>}
   * @api stable
   */
  getControls(filters) {
    let foundControls = [];

    // parse to Array
    if (Utils.isNullOrEmpty(filters)) {
      filters = [];
    }
    if (!Utils.isArray(filters)) {
      filters = [filters];
    }
    if (filters.length === 0) {
      foundControls = this.controls_;
    }
    else {
      filters.forEach((filterControl) => {
        foundControls = foundControls.concat(this.controls_.filter((control) => {
          let controlMatched = false;

          if (!Utils.includes(foundControls, control)) {
            if (Utils.isString(filterControl)) {
              controlMatched = (filterControl === control.name);
            }
            else if (filterControl instanceof Control) {
              controlMatched = (filterControl === control);
            }
            else if (Utils.isObject(filterControl)) {
              controlMatched = (filterControl.name === control.name);
            }
          }
          return controlMatched;
        }));
      });
    }
    return foundControls;
  }

  /**
   * This function adds controls specified by the user
   *
   * @public
   * @function
   * @param {M.Control} controls
   * @returns {M.impl.Map}
   * @api stable
   */
  addControls(controls) {
    controls.forEach(control => {
      if (control instanceof Panzoombar) {
        this.facadeMap_.addControls('panzoom');
      }
      if (!Utils.includes(this.controls_, control)) {
        this.controls_.push(control);
      }
    });
    return this;
  }

  /**
   * This function removes the controls from the map
   *
   * @function
   * @param {String|Array<String>} layers
   * @returns {M.impl.Map}
   * @api stable
   */
  removeControls(controls) {
    let mapControls = this.getControls(controls);
    mapControls.forEach(control => {
      control.getImpl().destroy();
      this.controls_.remove(control);
    });

    return this;
  }

  /**
   * This function sets the maximum extent for this
   * map instance
   *
   * @public
   * @function
   * @param {Mx.Extent} maxExtent the extent max
   * @returns {M.impl.Map}
   * @api stable
   */
  setMaxExtent(maxExtent) {
    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(maxExtent)) {
      Exception('No ha especificado ningún maxExtent');
    }

    // set the extent by ol
    let lMap = this.getMapImpl();
    lMap.setMaxBounds([
         [maxExtent.x.min, maxExtent.y.min],
         [maxExtent.x.max, maxExtent.y.max]
      ]);

    return this;
  }

  /**
   * This function gets the maximum extent for this
   * map instance
   *
   * @public
   * @function
   * @returns {Mx.Extent}
   * @api stable
   */
  getMaxExtent() {
    let extent;
    let lMap = this.getMapImpl();
    let lExtent = lMap.maxBounds;

    if (!Utils.isNullOrEmpty(lExtent)) {
      extent = {
        'x': {
          'min': lExtent.getWest(),
          'max': lExtent.getEast()
        },
        'y': {
          'min': lExtent.getSouth(),
          'max': lExtent.getNorth()
        }
      };
    }

    return extent;
  }

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
  setBbox(bbox) {
    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(bbox)) {
      Exception('No ha especificado ningún bbox');
    }

    this.userBbox_ = bbox;

    // set the extent by ol
    let extent;
    if (Utils.isArray(bbox)) {
      extent = [
            [bbox[0], bbox[1]],
            [bbox[2], bbox[3]]
         ];
    }
    else if (Utils.isObject(bbox)) {
      extent = [
            [bbox.x.min, bbox.y.min],
            [bbox.x.max, bbox.y.max]
         ];
    }
    let lMap = this.getMapImpl();
    lMap.fitBounds(extent);

    return this;
  }

  /**
   * This function gets the current extent (bbox) of this
   * map instance
   *
   * @public
   * @function
   * @returns {Mx.Extent}
   * @api stable
   */
  getBbox() {
    let bbox = null;

    let lMap = this.getMapImpl();
    let lExtent = lMap.getBounds();

    if (!Utils.isNullOrEmpty(lExtent)) {
      bbox = {
        'x': {
          'min': lExtent.getWest(),
          'max': lExtent.getEast()
        },
        'y': {
          'min': lExtent.getSouth(),
          'max': lExtent.getNorth()
        }
      };
    }
    return bbox;
  }

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
  setZoom(zoom) {
    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(zoom)) {
      Exception('No ha especificado ningún zoom');
    }

    // set the zoom by ol
    this.getMapImpl().setZoom(zoom);

    return this;
  }

  /**
   * This function gets the current zoom of this
   * map instance
   *
   * @public
   * @function
   * @returns {Number}
   * @api stable
   */
  getZoom() {
    let zoom = this.getMapImpl().getZoom();
    return zoom;
  }

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
  setCenter(center) {
    // TODO
  }

  /**
   * This function gets the current center of this
   * map instance
   *
   * @public
   * @function
   * @returns {Object}
   * @api stable
   */
  getCenter() {
    let center = null;
    let lCenter;
    try {
      lCenter = this.getMapImpl().getCenter();
    }
    catch (err) {
      // if map is not loaded throw an error
    }
    if (!Utils.isNullOrEmpty(lCenter)) {
      center = {
        'x': lCenter.lat,
        'y': lCenter.lng
      };
    }
    return center;
  }

  /**
   * This function gets current scale for this
   * map instance
   *
   * @public
   * @function
   * @returns {number}
   * @api stable
   */
  getScale() {
    // TODO
  }

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
  setProjection(projection) {
    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(projection)) {
      Exception('No ha especificado ninguna projection');
    }

    // TODO
    return this;
  }

  /**
   * This function gets the current projection of this
   * map instance
   *
   * @public
   * @function
   * @returns {Mx.Projection}
   * @api stable
   */
  getProjection() {
    return {
      'code': L.CRS.EPSG3857.code,
      'units': 'm'
    };
  }

  /**
   * This function provides ol3 map used by this instance
   *
   * @public
   * @returns {ol.Map}
   * @function
   * @api stable
   */
  getMapImpl() {
    return this.map_;
  }

  /**
   * This function gets the envolved extent of this
   * map instance
   *
   * @public
   * @function
   * @returns {Promise}
   * @api stable
   */
  getEnvolvedExtent() {
    // TODO
  }

  /**
   * This function destroys this map, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    // TODO
  }

  /**
   * This function sets the facade map to implement
   *
   * @public
   * @function
   * @api stable
   */
  setFacadeMap(facadeMap) {
    this.facadeMap_ = facadeMap;
  }

  /**
   * This function provides the core map used by the
   * implementation
   *
   * @function
   * @api stable
   * @returns {Object} core map used by the implementation
   */
  getContainer() {
    return this.map_.getContainer();
  }

  /**
   * This function gets the envolved extent of this
   * map instance
   *
   * @public
   * @function
   * @returns {Promise}
   * @api stable
   */
  getEnvolvedExtent() {
    return new Promise((success, fail) => {
      success.call(this, {
        'x': {
          'min': -20037508.342789244,
          'max': 20037508.342789244
        },
        'y': {
          'min': -20037508.342789244,
          'max': 20037508.342789244
        }
      });
    });
  }
}
