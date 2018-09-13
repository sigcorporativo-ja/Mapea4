import MObject from 'M/Object';
import { isNullOrEmpty, isArray, isString, isObject, includes } from 'M/util/Utils';
import Exception from 'M/exception/Exception';
import * as LayerType from 'M/layer/Type';
import WMS from 'M/layer/WMS';
import Panzoombar from 'M/control/Panzoombar';
import Control from 'M/control/Control';

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
    super();
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
      zoomControl: false,
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
    const wmcLayers = this.getWMC(filters);
    const kmlLayers = this.getKML(filters);
    const wmsLayers = this.getWMS(filters);
    const wfsLayers = this.getWFS(filters);
    const wmtsLayers = this.getWMTS(filters);
    const mbtilesLayers = this.getMBtiles(filters);

    const unknowLayers = this.layers_.filter((layer) => {
      return !LayerType.know(layer.type);
    });

    return wmcLayers
      .concat(kmlLayers)
      .concat(wmsLayers)
      .concat(wfsLayers)
      .concat(wmtsLayers)
      .concat(mbtilesLayers)
      .concat(unknowLayers);
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
    const baseLayers = this.getLayers().filter((layer) => {
      let isBaseLayer = false;
      if (isNullOrEmpty(layer.type) || (layer.type === LayerType.WMS)) {
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
    const unknowLayers = layers.filter((layer) => {
      return !LayerType.know(layer.type);
    });
    const knowLayers = layers.filter((layer) => {
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
      if (!includes(this.layers_, layer)) {
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
    const unknowLayers = layers.filter((layer) => {
      return isNullOrEmpty(layer.type);
    });
    const knowLayers = layers.filter((layer) => {
      return !isNullOrEmpty(layer.type);
    });

    this.removeWMC(knowLayers);
    this.removeKML(knowLayers);
    this.removeWMS(knowLayers);
    this.removeWFS(knowLayers);
    this.removeWMTS(knowLayers);
    this.removeMBtiles(knowLayers);

    // removes unknow layers
    unknowLayers.forEach((layer) => {
      if (!includes(this.layers_, layer)) {
        this.layers_ = this.layers_.filter(layer2 => !layer.equals(layer2));
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
  getWMC(filtersParam) {
    let foundLayers = [];
    let filters = filtersParam;
    // get all wmcLayers
    const wmcLayers = this.layers_.filter((layer) => {
      return (layer.type === LayerType.WMC);
    });

    // parse to Array
    if (isNullOrEmpty(filters)) {
      filters = [];
    }
    if (!isArray(filters)) {
      filters = [filters];
    }

    if (filters.length === 0) {
      foundLayers = wmcLayers;
    } else {
      filters.forEach((filterLayer) => {
        foundLayers = foundLayers.concat(wmcLayers.filter((wmcLayer) => {
          let layerMatched = true;
          // checks if the layer is not in selected layers
          if (!foundLayers.includes(wmcLayer)) {
            // type
            if (!isNullOrEmpty(filterLayer.type)) {
              layerMatched = (layerMatched && (filterLayer.type === wmcLayer.type));
            }
            // URL
            if (!isNullOrEmpty(filterLayer.url)) {
              layerMatched = (layerMatched && (filterLayer.url === wmcLayer.url));
            }
            // name
            if (!isNullOrEmpty(filterLayer.name)) {
              layerMatched = (layerMatched && (filterLayer.name === wmcLayer.name));
            }
          } else {
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
      if (layer.type === LayerType.WMC) {
        if (!includes(this.layers_, layer)) {
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
    const wmcMapLayers = this.getWMC(layers);
    wmcMapLayers.forEach((wmcLayer) => {
      this.layers_ = this.layers_.filter(layer => !layer.equals(wmcLayer));
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
  getKML(filtersParam) {
    let foundLayers = [];
    let filters = filtersParam;
    // get all kmlLayers
    const kmlLayers = this.layers_.filter((layer) => {
      return (layer.type === LayerType.KML);
    });

    // parse to Array
    if (isNullOrEmpty(filters)) {
      filters = [];
    }
    if (!isArray(filters)) {
      filters = [filters];
    }

    if (filters.length === 0) {
      foundLayers = kmlLayers;
    } else {
      filters.forEach((filterLayer) => {
        const filteredKMLLayers = kmlLayers.filter((kmlLayer) => {
          let layerMatched = true;
          // checks if the layer is not in selected layers
          if (!foundLayers.includes(kmlLayer)) {
            // type
            if (!isNullOrEmpty(filterLayer.type)) {
              layerMatched = (layerMatched && (filterLayer.type === kmlLayer.type));
            }
            // URL
            if (!isNullOrEmpty(filterLayer.url)) {
              layerMatched = (layerMatched && (filterLayer.url === kmlLayer.url));
            }
            // name
            if (!isNullOrEmpty(filterLayer.name)) {
              layerMatched = (layerMatched && (filterLayer.name === kmlLayer.name));
            }
            // extract
            if (!isNullOrEmpty(filterLayer.extract)) {
              layerMatched = (layerMatched && (filterLayer.extract === kmlLayer.extract));
            }
          } else {
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
    layers.forEach((layer) => {
      // checks if layer is WMC and was added to the map
      if (layer.type === LayerType.KML) {
        if (!includes(this.layers_, layer)) {
          layer.getImpl().addTo(this.facadeMap_);
          this.layers_.push(layer);
          const zIndex = this.layers_.length + Map.Z_INDEX[LayerType.KML];
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
    const kmlMapLayers = this.getKML(layers);
    kmlMapLayers.forEach((kmlLayer) => {
      this.layers_ = this.layers_.filter(layer => !layer.equals(kmlLayer));
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
  getWMS(filtersParam) {
    let foundLayers = [];
    let filters = filtersParam;
    // get all wmsLayers
    const wmsLayers = this.layers_.filter((layer) => {
      return (layer.type === LayerType.WMS);
    });

    // parse to Array
    if (isNullOrEmpty(filters)) {
      filters = [];
    }
    if (!isArray(filters)) {
      filters = [filters];
    }

    if (filters.length === 0) {
      foundLayers = wmsLayers;
    } else {
      filters.forEach((filterLayer) => {
        const filteredWMSLayers = wmsLayers.filter((wmsLayer) => {
          let layerMatched = true;
          // checks if the layer is not in selected layers
          if (!foundLayers.includes(wmsLayer)) {
            // if instanceof WMS check if it is the same
            if (filterLayer instanceof WMS) {
              layerMatched = (filterLayer === wmsLayer);
            } else {
              // type
              if (!isNullOrEmpty(filterLayer.type)) {
                layerMatched = (layerMatched && (filterLayer.type === wmsLayer.type));
              }
              // URL
              if (!isNullOrEmpty(filterLayer.url)) {
                layerMatched = (layerMatched && (filterLayer.url === wmsLayer.url));
              }
              // name
              if (!isNullOrEmpty(filterLayer.name)) {
                layerMatched = (layerMatched && (filterLayer.name === wmsLayer.name));
              }
              // legend
              if (!isNullOrEmpty(filterLayer.legend)) {
                layerMatched = (layerMatched && (filterLayer.legend === wmsLayer.legend));
              }
              // transparent
              if (!isNullOrEmpty(filterLayer.transparent)) {
                layerMatched = (layerMatched && (filterLayer.transparent === wmsLayer.transparent));
              }
              // tiled
              if (!isNullOrEmpty(filterLayer.tiled)) {
                layerMatched = (layerMatched && (filterLayer.tiled === wmsLayer.tiled));
              }
              // cql
              if (!isNullOrEmpty(filterLayer.cql)) {
                layerMatched = (layerMatched && (filterLayer.cql === wmsLayer.cql));
              }
              // version
              if (!isNullOrEmpty(filterLayer.version)) {
                layerMatched = (layerMatched && (filterLayer.version === wmsLayer.version));
              }
            }
          } else {
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
    const baseLayers = this.getWMS().filter(layer => layer.transparent !== true);
    let existsBaseLayer = (baseLayers.length > 0);

    layers.forEach((layer) => {
      // checks if layer is WMC and was added to the map
      if (layer.type === LayerType.WMS) {
        if (!includes(this.layers_, layer)) {
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
          } else {
            const zIndex = this.layers_.length + layer.getImpl().getZIndex();
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
    const wmsMapLayers = this.getWMS(layers);
    wmsMapLayers.forEach((wmsLayer) => {
      this.layers_ = this.layers_.filter(layer => !layer.equals(wmsLayer));
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
  getWFS(filtersParam) {
    let foundLayers = [];
    let filters = filtersParam;
    // get all wfsLayers
    const wfsLayers = this.layers_.filter(layer => layer.type === LayerType.WFS);

    // parse to Array
    if (isNullOrEmpty(filters)) {
      filters = [];
    }
    if (!isArray(filters)) {
      filters = [filters];
    }

    if (filters.length === 0) {
      foundLayers = wfsLayers;
    } else {
      filters.forEach((filterLayer) => {
        const filteredWFSLayers = wfsLayers.filter((wfsLayer) => {
          let layerMatched = true;
          // checks if the layer is not in selected layers
          if (!foundLayers.includes(wfsLayer)) {
            // type
            if (!isNullOrEmpty(filterLayer.type)) {
              layerMatched = (layerMatched && (filterLayer.type === wfsLayer.type));
            }
            // URL
            if (!isNullOrEmpty(filterLayer.url)) {
              layerMatched = (layerMatched && (filterLayer.url === wfsLayer.url));
            }
            // name
            if (!isNullOrEmpty(filterLayer.name)) {
              layerMatched = (layerMatched && (filterLayer.name === wfsLayer.name));
            }
            // namespace
            if (!isNullOrEmpty(filterLayer.namespace)) {
              layerMatched = (layerMatched && (filterLayer.namespace === wfsLayer.namespace));
            }
            // legend
            if (!isNullOrEmpty(filterLayer.legend)) {
              layerMatched = (layerMatched && (filterLayer.legend === wfsLayer.legend));
            }
            // cql
            if (!isNullOrEmpty(filterLayer.cql)) {
              layerMatched = (layerMatched && (filterLayer.cql === wfsLayer.cql));
            }
            // geometry
            if (!isNullOrEmpty(filterLayer.geometry)) {
              layerMatched = (layerMatched && (filterLayer.geometry === wfsLayer.geometry));
            }
            // ids
            if (!isNullOrEmpty(filterLayer.ids)) {
              layerMatched = (layerMatched && (filterLayer.ids === wfsLayer.ids));
            }
            // version
            if (!isNullOrEmpty(filterLayer.version)) {
              layerMatched = (layerMatched && (filterLayer.version === wfsLayer.version));
            }
          } else {
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
    layers.forEach((layer) => {
      // checks if layer is WFS and was added to the map
      if (layer.type === LayerType.WFS) {
        if (!includes(this.layers_, layer)) {
          layer.getImpl().addTo(this.facadeMap_);
          this.layers_.push(layer);
          const zIndex = this.layers_.length + Map.Z_INDEX[LayerType.WFS];
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
    const wfsMapLayers = this.getWFS(layers);
    wfsMapLayers.forEach((wfsLayer) => {
      wfsLayer.getImpl().destroy();
      this.layers_ = this.layers_.filter(layer => layer.equals(wfsLayer));
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
  getWMTS(filtersParam) {
    let foundLayers = [];
    let filters = filtersParam;
    // get all kmlLayers
    const wmtsLayers = this.layers_.filter(layer => layer.type === LayerType.WMTS);

    // parse to Array
    if (isNullOrEmpty(filters)) {
      filters = [];
    }
    if (!isArray(filters)) {
      filters = [filters];
    }

    if (filters.length === 0) {
      foundLayers = wmtsLayers;
    } else {
      filters.forEach((filterLayer) => {
        // TODO ERROR DE RECURSIVIDAD: let l = map.getLayers(); map.getWMS(l);
        const filteredWMTSLayers = wmtsLayers.filter((wmtsLayer) => {
          let layerMatched = true;
          // checks if the layer is not in selected layers
          if (!foundLayers.includes(wmtsLayer)) {
            // type
            if (!isNullOrEmpty(filterLayer.type)) {
              layerMatched = (layerMatched && (filterLayer.type === wmtsLayer.type));
            }
            // URL
            if (!isNullOrEmpty(filterLayer.url)) {
              layerMatched = (layerMatched && (filterLayer.url === wmtsLayer.url));
            }
            // name
            if (!isNullOrEmpty(filterLayer.name)) {
              layerMatched = (layerMatched && (filterLayer.name === wmtsLayer.name));
            }
            // matrixSet
            if (!isNullOrEmpty(filterLayer.matrixSet)) {
              layerMatched = (layerMatched && (filterLayer.matrixSet === wmtsLayer.matrixSet));
            }
            // legend
            if (!isNullOrEmpty(filterLayer.legend)) {
              layerMatched = (layerMatched && (filterLayer.legend === wmtsLayer.legend));
            }
          } else {
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
    layers.forEach((layer) => {
      // checks if layer is WMTS and was added to the map
      if (layer.type === LayerType.WMTS) {
        if (!includes(this.layers_, layer)) {
          layer.getImpl().addTo(this.facadeMap_);
          this.layers_.push(layer);
          const zIndex = this.layers_.length + Map.Z_INDEX[LayerType.WMTS];
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
    const wmtsMapLayers = this.getWMTS(layers);
    wmtsMapLayers.forEach((wmtsLayer) => {
      wmtsLayer.getImpl().destroy();
      this.layers_ = this.layers_.filter(layer => !layer.equals(wmtsLayer));
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
    const foundLayers = [];

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
    layers.forEach((layer) => {
      // checks if layer is MBtiles and was added to the map
      if ((layer.type === LayerType.MBtiles) &&
        !includes(this.layers_, layer)) {
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
    const mbtilesMapLayers = this.getMBtiles(layers);
    mbtilesMapLayers.forEach((mbtilesLayer) => {
      // TODO removing the MBtiles layer with ol3
      this.layers_ = this.layers_.filter(layer => !layer.equals(mbtilesLayer));
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
  getControls(filtersParam) {
    let foundControls = [];
    let filters = filtersParam;
    // parse to Array
    if (isNullOrEmpty(filters)) {
      filters = [];
    }
    if (!isArray(filters)) {
      filters = [filters];
    }
    if (filters.length === 0) {
      foundControls = this.controls_;
    } else {
      filters.forEach((filterControl) => {
        foundControls = foundControls.concat(this.controls_.filter((control) => {
          let controlMatched = false;

          if (!includes(foundControls, control)) {
            if (isString(filterControl)) {
              controlMatched = (filterControl === control.name);
            } else if (filterControl instanceof Control) {
              controlMatched = (filterControl === control);
            } else if (isObject(filterControl)) {
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
    controls.forEach((control) => {
      if (control instanceof Panzoombar) {
        this.facadeMap_.addControls('panzoom');
      }
      if (!includes(this.controls_, control)) {
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
    const mapControls = this.getControls(controls);
    mapControls.forEach((control) => {
      control.getImpl().destroy();
      this.controls_ = this.controls_.filter(control2 => control.equals(control));
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
    if (isNullOrEmpty(maxExtent)) {
      Exception('No ha especificado ningún maxExtent');
    }

    // set the extent by ol
    const lMap = this.getMapImpl();
    lMap.setMaxBounds([
      [maxExtent.x.min, maxExtent.y.min],
      [maxExtent.x.max, maxExtent.y.max],
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
    const lMap = this.getMapImpl();
    const lExtent = lMap.maxBounds;

    if (!isNullOrEmpty(lExtent)) {
      extent = {
        x: {
          min: lExtent.getWest(),
          max: lExtent.getEast(),
        },
        y: {
          min: lExtent.getSouth(),
          max: lExtent.getNorth(),
        },
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
    if (isNullOrEmpty(bbox)) {
      Exception('No ha especificado ningún bbox');
    }

    this.userBbox_ = bbox;

    // set the extent by ol
    let extent;
    if (isArray(bbox)) {
      extent = [
        [bbox[0], bbox[1]],
        [bbox[2], bbox[3]],
      ];
    } else if (isObject(bbox)) {
      extent = [
        [bbox.x.min, bbox.y.min],
        [bbox.x.max, bbox.y.max],
      ];
    }
    const lMap = this.getMapImpl();
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

    const lMap = this.getMapImpl();
    const lExtent = lMap.getBounds();

    if (!isNullOrEmpty(lExtent)) {
      bbox = {
        x: {
          min: lExtent.getWest(),
          max: lExtent.getEast(),
        },
        y: {
          min: lExtent.getSouth(),
          max: lExtent.getNorth(),
        },
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
    if (isNullOrEmpty(zoom)) {
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
    const zoom = this.getMapImpl().getZoom();
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
    } catch (err) {
      // if map is not loaded throw an error
    }
    if (!isNullOrEmpty(lCenter)) {
      center = {
        x: lCenter.lat,
        y: lCenter.lng,
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
    if (isNullOrEmpty(projection)) {
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
      code: L.CRS.EPSG3857.code,
      units: 'm',
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
        x: {
          min: -20037508.342789244,
          max: 20037508.342789244,
        },
        y: {
          min: -20037508.342789244,
          max: 20037508.342789244,
        },
      });
    });
  }
}
