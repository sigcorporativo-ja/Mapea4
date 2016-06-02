goog.provide('M.impl');
goog.provide('M.impl.Map');

goog.require('M');
goog.require('M.layer.type');
goog.require('M.impl.Layer');
goog.require('M.impl.layer.OSM');
goog.require('M.impl.control.Panzoom');

goog.require('M.Leaflet');

(function() {
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
   M.impl.Map = function(div, options) {
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
       * Implementation of this map
       * @private
       * @type {L.Map}
       */
      this.map_ = new L.Map(div.id, {
         zoomControl: false
      });
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
   M.impl.Map.prototype.getLayers = function(filters) {
      var wmcLayers = this.getWMC(filters);
      var kmlLayers = this.getKML(filters);
      var wmsLayers = this.getWMS(filters);
      var wfsLayers = this.getWFS(filters);
      var wmtsLayers = this.getWMTS(filters);
      var mbtilesLayers = this.getMBtiles(filters);

      var unknowLayers = this.layers_.filter(function(layer) {
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
   M.impl.Map.prototype.getBaseLayers = function() {
      var baseLayers = this.getLayers().filter(function(layer) {
         var isBaseLayer = false;
         if (M.utils.isNullOrEmpty(layer.type) || (layer.type === M.layer.type.WMS)) {
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
   M.impl.Map.prototype.addLayers = function(layers) {
      // gets the layers with type defined and undefined
      var unknowLayers = layers.filter(function(layer) {
         return !M.layer.type.know(layer.type);
      });
      var knowLayers = layers.filter(function(layer) {
         return M.layer.type.know(layer.type);
      });

      this.addWMC(knowLayers);
      this.addMBtiles(knowLayers);
      this.addWMS(knowLayers);
      this.addWMTS(knowLayers);
      this.addKML(knowLayers);
      this.addWFS(knowLayers);

      // adds unknow layers
      unknowLayers.forEach(function(layer) {
         if (!M.utils.includes(this.layers_, layer)) {
            layer.getImpl().addTo(this.facadeMap_);
            this.layers_.push(layer);
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
   M.impl.Map.prototype.removeLayers = function(layers) {

      // gets the layers with type defined and undefined
      var unknowLayers = layers.filter(function(layer) {
         return M.utils.isNullOrEmpty(layer.type);
      });
      var knowLayers = layers.filter(function(layer) {
         return !M.utils.isNullOrEmpty(layer.type);
      });

      this.removeWMC(knowLayers);
      this.removeKML(knowLayers);
      this.removeWMS(knowLayers);
      this.removeWFS(knowLayers);
      this.removeWMTS(knowLayers);
      this.removeMBtiles(knowLayers);

      // removes unknow layers
      unknowLayers.forEach(function(layer) {
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
   M.impl.Map.prototype.getWMC = function(filters) {
      var foundLayers = [];

      // get all wmcLayers
      var wmcLayers = this.layers_.filter(function(layer) {
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
         filters.forEach(function(filterLayer) {
            foundLayers = foundLayers.concat(wmcLayers.filter(function(wmcLayer) {
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
   M.impl.Map.prototype.addWMC = function(layers) {
      layers.forEach(function(layer, zIndex) {
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
   M.impl.Map.prototype.removeWMC = function(layers) {
      var wmcMapLayers = this.getWMC(layers);
      wmcMapLayers.forEach(function(wmcLayer) {
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
   M.impl.Map.prototype.getKML = function(filters) {
      var foundLayers = [];

      // get all kmlLayers
      var kmlLayers = this.layers_.filter(function(layer) {
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
         filters.forEach(function(filterLayer) {
            var filteredKMLLayers = kmlLayers.filter(function(kmlLayer) {
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
   M.impl.Map.prototype.addKML = function(layers) {
      layers.forEach(function(layer) {
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
   M.impl.Map.prototype.removeKML = function(layers) {
      var kmlMapLayers = this.getKML(layers);
      kmlMapLayers.forEach(function(kmlLayer) {
         this.layers_.remove(kmlLayer);
         kmlLayer.getImpl().destroy();
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
   M.impl.Map.prototype.getWMS = function(filters) {
      var foundLayers = [];

      // get all wmsLayers
      var wmsLayers = this.layers_.filter(function(layer) {
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
         filters.forEach(function(filterLayer) {
            var filteredWMSLayers = wmsLayers.filter(function(wmsLayer) {
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
   M.impl.Map.prototype.addWMS = function(layers) {
      // cehcks if exists a base layer
      var baseLayers = this.getWMS().filter(function(layer) {
         return (layer.transparent !== true);
      });
      var existsBaseLayer = (baseLayers.length > 0);

      layers.forEach(function(layer) {
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
   M.impl.Map.prototype.removeWMS = function(layers) {
      var wmsMapLayers = this.getWMS(layers);
      wmsMapLayers.forEach(function(wmsLayer) {
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
   M.impl.Map.prototype.getWFS = function(filters) {
      var foundLayers = [];

      // get all wfsLayers
      var wfsLayers = this.layers_.filter(function(layer) {
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
         filters.forEach(function(filterLayer) {
            var filteredWFSLayers = wfsLayers.filter(function(wfsLayer) {
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
   M.impl.Map.prototype.addWFS = function(layers) {
      layers.forEach(function(layer) {
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
   M.impl.Map.prototype.removeWFS = function(layers) {
      var wfsMapLayers = this.getWFS(layers);
      wfsMapLayers.forEach(function(wfsLayer) {
         wfsLayer.getImpl().destroy();
         this.layers_.remove(wfsLayer);
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
   M.impl.Map.prototype.getWMTS = function(filters) {
      var foundLayers = [];

      // get all kmlLayers
      var wmtsLayers = this.layers_.filter(function(layer) {
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
         filters.forEach(function(filterLayer) {
            // TODO ERROR DE RECURSIVIDAD: var l = map.getLayers(); map.getWMS(l);
            var filteredWMTSLayers = wmtsLayers.filter(function(wmtsLayer) {
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
   M.impl.Map.prototype.addWMTS = function(layers) {
      layers.forEach(function(layer) {
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
   M.impl.Map.prototype.removeWMTS = function(layers) {
      var wmtsMapLayers = this.getWMTS(layers);
      wmtsMapLayers.forEach(function(wmtsLayer) {
         wmtsLayer.getImpl().destroy();
         this.layers_.remove(wmtsLayer);
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
   M.impl.Map.prototype.getMBtiles = function(filters) {
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
   M.impl.Map.prototype.addMBtiles = function(layers) {
      layers.forEach(function(layer) {
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
   M.impl.Map.prototype.removeMBtiles = function(layers) {
      var mbtilesMapLayers = this.getMBtiles(layers);
      mbtilesMapLayers.forEach(function(mbtilesLayer) {
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
   M.impl.Map.prototype.getControls = function(filters) {
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
         filters.forEach(function(filterControl) {
            foundControls = foundControls.concat(this.controls_.filter(function(control) {
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
   M.impl.Map.prototype.addControls = function(controls) {
      controls.forEach(function(control) {
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
   M.impl.Map.prototype.removeControls = function(controls) {
      var mapControls = this.getControls(controls);
      mapControls.forEach(function(control) {
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
    * @returns {M.impl.Map}
    * @api stable
    */
   M.impl.Map.prototype.setMaxExtent = function(maxExtent) {
      // checks if the param is null or empty
      if (M.utils.isNullOrEmpty(maxExtent)) {
         M.exception('No ha especificado ningún maxExtent');
      }

      // set the extent by ol
      var lMap = this.getMapImpl();
      lMap.setMaxBounds([
         [maxExtent.x.min, maxExtent.y.min],
         [maxExtent.x.max, maxExtent.y.max]
      ]);

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
   M.impl.Map.prototype.getMaxExtent = function() {
      var extent;
      var lMap = this.getMapImpl();
      var lExtent = lMap.maxBounds;

      if (!M.utils.isNullOrEmpty(lExtent)) {
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
   M.impl.Map.prototype.setBbox = function(bbox) {
      // checks if the param is null or empty
      if (M.utils.isNullOrEmpty(bbox)) {
         M.exception('No ha especificado ningún bbox');
      }

      this.userBbox_ = bbox;

      // set the extent by ol
      var extent;
      if (M.utils.isArray(bbox)) {
         extent = [
            [bbox[0], bbox[1]],
            [bbox[2], bbox[3]]
         ];
      }
      else if (M.utils.isObject(bbox)) {
         extent = [
            [bbox.x.min, bbox.y.min],
            [bbox.x.max, bbox.y.max]
         ];
      }
      var lMap = this.getMapImpl();
      lMap.fitBounds(extent);

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
   M.impl.Map.prototype.getBbox = function() {
      var bbox = null;

      var lMap = this.getMapImpl();
      var lExtent = lMap.getBounds();

      if (!M.utils.isNullOrEmpty(lExtent)) {
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
   M.impl.Map.prototype.setZoom = function(zoom) {
      // checks if the param is null or empty
      if (M.utils.isNullOrEmpty(zoom)) {
         M.exception('No ha especificado ningún zoom');
      }

      // set the zoom by ol
      this.getMapImpl().setZoom(zoom);

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
   M.impl.Map.prototype.getZoom = function() {
      var zoom = this.getMapImpl().getZoom();
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
   M.impl.Map.prototype.setCenter = function(center) {
      // TODO
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
   M.impl.Map.prototype.getCenter = function() {
      var center = null;
      var lCenter;
      try {
         lCenter = this.getMapImpl().getCenter();
      }
      catch (err) {
         // if map is not loaded throw an error
      }
      if (!M.utils.isNullOrEmpty(lCenter)) {
         center = {
            'x': lCenter.lat,
            'y': lCenter.lng
         };
      }
      return center;
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
   M.impl.Map.prototype.getScale = function() {
      // TODO
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
   M.impl.Map.prototype.setProjection = function(projection) {
      // checks if the param is null or empty
      if (M.utils.isNullOrEmpty(projection)) {
         M.exception('No ha especificado ninguna projection');
      }

      // TODO
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
   M.impl.Map.prototype.getProjection = function() {
      return {
         'code': L.CRS.EPSG3857.code,
         'units': 'm'
      };
   };

   /**
    * This function provides ol3 map used by this instance
    *
    * @public
    * @returns {ol.Map}
    * @function
    * @api stable
    */
   M.impl.Map.prototype.getMapImpl = function() {
      return this.map_;
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
   M.impl.Map.prototype.getEnvolvedExtent = function() {
      // TODO
   };

   /**
    * This function destroys this map, cleaning the HTML
    * and unregistering all events
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.Map.prototype.destroy = function() {
      // TODO
   };

   /**
    * This function sets the facade map to implement
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.Map.prototype.setFacadeMap = function(facadeMap) {
      this.facadeMap_ = facadeMap;
   };

   /**
    * This function provides the core map used by the
    * implementation
    *
    * @function
    * @api stable
    * @returns {Object} core map used by the implementation
    */
   M.impl.Map.prototype.getContainer = function() {
      return this.map_.getContainer();
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
   M.impl.Map.prototype.getEnvolvedExtent = function() {
      var this_ = this;
      return new Promise(function(success, fail) {
         success.call(this_, {
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
   };
})();