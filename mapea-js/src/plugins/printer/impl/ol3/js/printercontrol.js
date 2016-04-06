goog.provide('P.impl.control.Printer');

/**
 * @namespace M.impl.control
 */
(function() {
   /**
    * @classdesc
    * Main constructor of the measure conrol.
    *
    * @constructor
    * @extends {ol.control.Control}
    * @api stable
    */
   M.impl.control.Printer = function() {
      /**
       * Facade of the map
       * @private
       * @type {M.Map}
       */
      this.facadeMap_ = null;
   };
   goog.inherits(M.impl.control.Printer, M.impl.Control);

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the plugin
    * @param {function} template template of this control
    * @api stable
    */
   M.impl.control.Printer.prototype.addTo = function(map, element) {
      this.facadeMap_ = map;

      ol.control.Control.call(this, {
         'element': element,
         'target': null
      });
      map.getMapImpl().addControl(this);
   };

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the plugin
    * @param {function} template template of this control
    * @api stable
    */
   M.impl.control.Printer.prototype.encodeLayer = function(layer) {
      var encodedLayer = null;

      if (layer.type === M.layer.type.WMC) {
         // none
      }
      else if (layer.type === M.layer.type.KML) {
         encodedLayer = this.encodeKML(layer);
      }
      else if (layer.type === M.layer.type.WMS) {
         encodedLayer = this.encodeWMS(layer);
      }
      else if (layer.type === M.layer.type.WFS) {
         encodedLayer = this.encodeWFS(layer);
      }
      else if (layer.type === M.layer.type.WMTS) {
         encodedLayer = this.encodeWMTS(layer);
      }
      else if (layer.type === M.layer.type.MBtiles) {
         // none
      }
      else if (layer.type === M.layer.type.OSM) {
         encodedLayer = this.encodeOSM(layer);
      }

      return encodedLayer;
   };

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the plugin
    * @param {function} template template of this control
    * @api stable
    */
   M.impl.control.Printer.prototype.encodeLegend = function(layer) {
      var encodedLegend = null;

      if (layer.displayInLayerSwitcher) {
         encodedLegend = {
            "name": layer.name,
            "classes": []
         };

         var regExpImgDefault = new RegExp('.*' + M.Layer.LEGEND_DEFAULT + '$');
         var regExpImgError = new RegExp('.*' + M.Layer.LEGEND_ERROR + '$');
         var legendURL = layer.getLegendURL();
         if (!M.utils.isNullOrEmpty(legendURL) && !regExpImgDefault.test(legendURL) && !regExpImgDefault.test(regExpImgError)) {
            encodedLegend["classes"][0] = {
               "name": "",
               "icons": [layer.getLegendURL()]
            };
         }
      }

      return encodedLegend;
   };

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the plugin
    * @param {function} template template of this control
    * @api stable
    */
   M.impl.control.Printer.prototype.encodeKML = function(layer) {
      var encodedLayer = null;

      var olLayer = layer.getImpl().getOL3Layer();
      var features = olLayer.getSource().getFeatures();
      var layerName = layer.name;
      var layerOpacity = olLayer.getOpacity();
      var geoJSONFormat = new ol.format.GeoJSON();
      var bbox = this.facadeMap_.getBbox();
      bbox = [bbox.x.min, bbox.y.min, bbox.x.max, bbox.y.max];
      var resolution = this.facadeMap_.getMapImpl().getView().getResolution();

      var encodedFeatures = [];
      var encodedStyles = {};
      var stylesNames = {};
      var index = 1;
      features.forEach(function(feature) {
         var geometry = feature.getGeometry();
         var styleId = feature.get("styleUrl");
         if (!M.utils.isNullOrEmpty(styleId)) {
            styleId = styleId.replace('\#', '');
         }
         var styleFn = feature.getStyle();
         if (!M.utils.isNullOrEmpty(styleFn)) {
            var featureStyle = styleFn.call(feature, resolution)[0];
            if (!M.utils.isNullOrEmpty(featureStyle)) {
               var img = featureStyle.getImage();
               var imgSize = img.getImageSize();
               if (M.utils.isNullOrEmpty(imgSize)) {
                  imgSize = [64, 64];
               }
               var stroke = featureStyle.getStroke();
               var style = {
                  "id": styleId,
                  "externalGraphic": img.getSrc(),
                  "graphicHeight": imgSize[0],
                  "graphicWidth": imgSize[1],
                  "graphicOpacity": img.getOpacity(),
                  "strokeWidth": stroke.getWidth()
               };

               if (!M.utils.isNullOrEmpty(geometry) && geometry.intersectsExtent(bbox)) {
                  var styleStr = JSON.stringify(style);
                  var styleName = stylesNames[styleStr];
                  if (M.utils.isUndefined(styleName)) {
                     styleName = index;
                     stylesNames[styleStr] = styleName;
                     encodedStyles[styleName] = style;
                     index++;
                  }
                  var geoJSONFeature = geoJSONFormat.writeFeatureObject(feature);
                  geoJSONFeature.properties = {
                     "_gx_style": styleName
                  };
                  encodedFeatures.push(geoJSONFeature);
               }
            }
         }
      }, this);

      encodedLayer = {
         type: 'Vector',
         styles: encodedStyles,
         styleProperty: '_gx_style',
         geoJson: {
            type: "FeatureCollection",
            features: encodedFeatures
         },
         name: layerName,
         opacity: layerOpacity
      };

      return encodedLayer;
   };

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the plugin
    * @param {function} template template of this control
    * @api stable
    */
   M.impl.control.Printer.prototype.encodeWMS = function(layer) {
      var encodedLayer = null;
      var olLayer = layer.getImpl().getOL3Layer();
      var layerUrl = layer.url;
      var layerOpacity = olLayer.getOpacity();
      var tiled = layer.getImpl().tiled;
      var params = olLayer.getSource().getParams();
      var paramsLayers = [params['LAYERS']];
      var paramsFormat = params['FORMAT'];
      var paramsStyles = [params['STYLES']];
      encodedLayer = {
         'baseURL': layerUrl,
         'opacity': layerOpacity,
         'singleTile': !tiled,
         'type': 'WMS',
         'layers': paramsLayers.join(",").split(","),
         'format': paramsFormat || "image/jpeg",
         'styles': paramsStyles.join(",").split(",")
      };

      /*************************************
       MAPEA DE CAPAS TILEADAS
      *************************************/
      var noChacheName = layer.getNoChacheName();
      var noChacheUrl = layer.getNoChacheUrl();
      if (!M.utils.isNullOrEmpty(noChacheName) && !M.utils.isNullOrEmpty(noChacheUrl)) {
         encodedLayer['layers'] = [noChacheName];
         encodedLayer['baseURL'] = noChacheUrl;
      }
      /*************************************/

      // defaults
      encodedLayer.customParams = {
         //         'service': "WMS",
         //         'version': "1.1.1",
         //         'request': "GetMap",
         //         'styles': "",
         //         'format': "image/jpeg"
      };
      for (var p in params) {
         //         if ("layers,styles,width,height,srs".indexOf(p.toLowerCase()) === -1) {
         if ("iswmc,transparent".indexOf(p.toLowerCase()) !== -1) {
            encodedLayer.customParams[p] = params[p];
         }
      }
      return encodedLayer;
   };

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the plugin
    * @param {function} template template of this control
    * @api stable
    */
   M.impl.control.Printer.prototype.encodeWFS = function(layer) {
      var encodedLayer = null;

      var olLayer = layer.getImpl().getOL3Layer();
      var features = olLayer.getSource().getFeatures();
      var layerName = layer.name;
      var layerOpacity = olLayer.getOpacity();
      var layerStyle = olLayer.getStyle();
      var geoJSONFormat = new ol.format.GeoJSON();
      var bbox = this.facadeMap_.getBbox();
      bbox = [bbox.x.min, bbox.y.min, bbox.x.max, bbox.y.max];
      var resolution = this.facadeMap_.getMapImpl().getView().getResolution();

      var encodedFeatures = [];
      var encodedStyles = {};
      var stylesNames = {};
      var index = 1;
      features.forEach(function(feature) {
         var geometry = feature.getGeometry();
         var featureStyle;

         var styleFn = feature.getStyle();
         if (!M.utils.isNullOrEmpty(styleFn)) {
            featureStyle = styleFn.call(feature, resolution)[0];
         }
         else if (!M.utils.isNullOrEmpty(layerStyle)) {
            featureStyle = layerStyle;
         }

         if (!M.utils.isNullOrEmpty(featureStyle)) {
            var stroke = featureStyle.getStroke();
            var fill = featureStyle.getFill();
            var image = featureStyle.getImage();
            var style = {
               "fillColor": M.utils.rgbToHex(fill.getColor()),
               "fillOpacity": M.utils.getOpacityFromRgba(fill.getColor()),
               "strokeColor": M.utils.rgbToHex(stroke.getColor()),
               "strokeOpacity": M.utils.getOpacityFromRgba(stroke.getColor()),
               "strokeWidth": stroke.getWidth(),
               "pointRadius": image.getRadius()
            };

            if (!M.utils.isNullOrEmpty(geometry) && geometry.intersectsExtent(bbox)) {
               var styleStr = JSON.stringify(style);
               var styleName = stylesNames[styleStr];
               if (M.utils.isUndefined(styleName)) {
                  styleName = index;
                  stylesNames[styleStr] = styleName;
                  encodedStyles[styleName] = style;
                  index++;
               }
               var geoJSONFeature = geoJSONFormat.writeFeatureObject(feature);
               geoJSONFeature.properties = {
                  "_gx_style": styleName
               };
               encodedFeatures.push(geoJSONFeature);
            }
         }
      }, this);

      encodedLayer = {
         type: 'Vector',
         styles: encodedStyles,
         styleProperty: '_gx_style',
         geoJson: {
            type: "FeatureCollection",
            features: encodedFeatures
         },
         name: layerName,
         opacity: layerOpacity
      };

      return encodedLayer;
   };

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the plugin
    * @param {function} template template of this control
    * @api stable
    */
   M.impl.control.Printer.prototype.encodeWMTS = function(layer) {
      var encodedLayer = null;

      var layerImpl = layer.getImpl();
      var olLayer = layerImpl.getOL3Layer();
      var layerSource = olLayer.getSource();
      var tileGrid = layerSource.getTileGrid();

      var layerUrl = layer.url;
      var layerName = layer.name;
      var layerVersion = layer.version;
      var layerOpacity = olLayer.getOpacity();
      var layerReqEncoding = layerSource.getRequestEncoding();
      var tiled = layerImpl.tiled;
      var style = layerSource.getStyle();
      var layerExtent = olLayer.getExtent();
      var params = {};
      var matrixSet = layerSource.getMatrixSet();
      var tileOrigin = tileGrid.getOrigin();
      var tileSize = tileGrid.getTileSize();
      var resolutions = tileGrid.getResolutions();

      encodedLayer = {
         'baseURL': layerUrl,
         'opacity': layerOpacity,
         'singleTile': !tiled,
         'type': 'WMTS',
         'layer': layerName,
         'version': layerVersion,
         'requestEncoding': layerReqEncoding,
         'tileOrigin': tileOrigin,
         'tileSize': tileSize,
         'style': style,

         //         'formatSuffix': layer.formatSuffix,
         //         'dimensions': layer.dimensions,
         'params': params,
         'maxExtent': layerExtent,
         'matrixSet': matrixSet,
         //         'zoomOffset': layer.zoomOffset,
         'resolutions': resolutions
      };

      return encodedLayer;
   };

   /**
    * This function adds the control to the specified map
    *
    * @public
    * @function
    * @param {M.Map} map to add the plugin
    * @param {function} template template of this control
    * @api stable
    */
   M.impl.control.Printer.prototype.encodeOSM = function(layer) {
      var encodedLayer = null;

      var layerImpl = layer.getImpl();
      var olLayer = layerImpl.getOL3Layer();
      var layerSource = olLayer.getSource();
      var tileGrid = layerSource.getTileGrid();

      var layerUrl = layer.url;
      var layerName = layer.name;
      var layerOpacity = olLayer.getOpacity();
      var tiled = layerImpl.tiled;
      var layerExtent = olLayer.getExtent();
      var tileSize = tileGrid.getTileSize();
      var resolutions = tileGrid.getResolutions();

      encodedLayer = {
         'baseURL': layerUrl.substr(0, layerUrl.indexOf("$")),
         'opacity': layerOpacity,
         'singleTile': !tiled,
         'layer': layerName,
         'maxExtent': layerExtent,
         'tileSize': tileSize,
         'resolutions': resolutions,
         'type': 'OSM',
         'extension': "png"
      };

      return encodedLayer;
   };

   /**
    * This function destroys this control, clearing the HTML
    * and unregistering all events
    *
    * @public
    * @function
    * @api stable
    */
   M.impl.control.Printer.prototype.destroy = function() {
      this.facadeMap_.removeControl(this);
      this.facadeMap_ = null;
   };
})();