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
    var this_ = this;
    return (new Promise(function(success, fail) {
      if (layer.type === M.layer.type.WMC) {
        // none
      }
      else if (layer.type === M.layer.type.KML) {
        success(this_.encodeKML(layer));
      }
      else if (layer.type === M.layer.type.WMS) {
        success(this_.encodeWMS(layer));
      }
      else if (layer.type === M.layer.type.WFS) {
        success(this_.encodeWFS(layer));
      }
      else if (layer.type === M.layer.type.GeoJSON) {
        /*se reutiliza el codificador WFS ya, aunque ya está en geojson,
          el proceso a realizar es el mismo y recodificar en geojson no
          penaliza*/
        success(this_.encodeWFS(layer));
      }
      else if (layer.type === M.layer.type.WMTS) {
        this_.encodeWMTS(layer).then(function(encodedLayer) {
          success(encodedLayer);
        });
      }
      else if (layer.type === M.layer.type.MBtiles) {
        // none
      }
      else if (layer.type === M.layer.type.OSM) {
        success(this_.encodeOSM(layer));
      }
      else if (layer.type === M.layer.type.Mapbox) {
        success(this_.encodeMapbox(layer));
      }
      else if (M.utils.isNullOrEmpty(layer.type) && layer instanceof M.layer.Vector) {
        success(this_.encodeWFS(layer));
      }
      else {
        success(this_.encodeWFS(layer));
      }
    }));
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
        if (layer instanceof M.layer.Vector) {
          delete encodedLegend["classes"][0].icons;
        }
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
          var text = (featureStyle.getText && featureStyle.getText());
          if (!M.utils.isNullOrEmpty(text)) {
            style = Object.assign(style, {
              "label": M.utils.isNullOrEmpty(text.getText()) ? feature.get("name") : text.getText(),
              "fontColor": M.utils.isNullOrEmpty(text.getFill()) ? "" : M.utils.rgbToHex(M.utils.isArray(text.getFill().getColor()) ?
                "rgba(" + text.getFill().getColor().toString() + ")" :
                text.getFill().getColor()),
              //text.getFont() -->"bold 13px Helvetica, sans-serif"
              "fontSize": "11px",
              "fontFamily": "Helvetica, sans-serif",
              "fontWeight": "bold",
              //
              "labelAlign": text.getTextAlign(),
              "labelXOffset": text.getOffsetX(),
              "labelYOffset": text.getOffsetY(),
              //no pinta la línea
              "labelOutlineColor": M.utils.isNullOrEmpty(text.getStroke()) ? "" : M.utils.rgbToHex(M.utils.isArray(text.getStroke().getColor()) ?
                "rgba(" + text.getStroke().getColor().toString() + ")" :
                text.getStroke().getColor()),
              "labelOutlineWidth": M.utils.isNullOrEmpty(text.getStroke()) ? "" : text.getStroke().getWidth()
            });
          }


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
    let continuePrint = true;
    if (layer.getStyle() instanceof M.style.Chart) {
      continuePrint = false;
    }
    else if (layer.getStyle() instanceof M.style.Cluster && layer.getStyle().getOldStyle() instanceof M.style.Chart) {
      continuePrint = false;
    }
    if (continuePrint) {
      var projection = this.facadeMap_.getProjection();
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
        var fStyle = feature.getStyle();

        if (!M.utils.isNullOrEmpty(fStyle)) {
          featureStyle = fStyle;
        }
        else if (!M.utils.isNullOrEmpty(layerStyle)) {
          featureStyle = layerStyle;
        }

        if (featureStyle instanceof Function) {
          featureStyle = featureStyle.call(featureStyle, feature, resolution);
        }

        if (featureStyle instanceof Array) {
          featureStyle = featureStyle[0];
        }

        if (!M.utils.isNullOrEmpty(featureStyle)) {
          var image = featureStyle.getImage();
          var imgSize = M.utils.isNullOrEmpty(image) ? [0, 0] : (image.getImageSize() || [24, 24]);
          var text = featureStyle.getText();
          if (M.utils.isNullOrEmpty(text) && !M.utils.isNullOrEmpty(featureStyle.textPath)) {
            text = featureStyle.textPath;
          }
          var stroke = M.utils.isNullOrEmpty(image) ? featureStyle.getStroke() : (image.getStroke && image.getStroke());
          var fill = M.utils.isNullOrEmpty(image) ? featureStyle.getFill() : (image.getFill && image.getFill());

          var style = {
            "fillColor": M.utils.isNullOrEmpty(fill) ? "#000000" : M.utils.rgbaToHex(fill.getColor()),
            "fillOpacity": M.utils.isNullOrEmpty(fill) ? 0 : M.utils.getOpacityFromRgba(fill.getColor()),
            "strokeColor": M.utils.isNullOrEmpty(stroke) ? "#000000" : M.utils.rgbaToHex(stroke.getColor()),
            "strokeOpacity": M.utils.isNullOrEmpty(stroke) ? 0 : M.utils.getOpacityFromRgba(stroke.getColor()),
            "strokeWidth": M.utils.isNullOrEmpty(stroke) ? 0 : (stroke.getWidth && stroke.getWidth()),
            "pointRadius": M.utils.isNullOrEmpty(image) ? "" : (image.getRadius && image.getRadius()),
            "externalGraphic": M.utils.isNullOrEmpty(image) ? "" : (image.getSrc && image.getSrc()),
            "graphicHeight": imgSize[0],
            "graphicWidth": imgSize[1],
          };
          if (!M.utils.isNullOrEmpty(text)) {
            let tAlign = text.getTextAlign();
            let tBLine = text.getTextBaseline();
            let align = "";
            if (!M.utils.isNullOrEmpty(tAlign)) {
              if (tAlign === M.style.align.LEFT) {
                tAlign = 'l';
              }
              else if (tAlign === M.style.align.RIGHT) {
                tAlign = 'r';
              }
              else if (tAlign === M.style.align.CENTER) {
                tAlign = 'c';
              }
              else {
                tAlign = '';
              }
            }
            if (!M.utils.isNullOrEmpty(tBLine)) {
              if (tBLine === M.style.baseline.BOTTOM) {
                tBLine = 'b';
              }
              else if (tBLine === M.style.baseline.MIDDLE) {
                tBLine = 'm';
              }
              else if (tBLine === M.style.baseline.TOP) {
                tBLine = 't';
              }
              else {
                tBLine = '';
              }
            }
            if (!M.utils.isNullOrEmpty(tAlign) && !M.utils.isNullOrEmpty(tBLine)) {
              align = tAlign.concat(tBLine);
            }
            let font = text.getFont();
            let fontWeight = !M.utils.isNullOrEmpty(font) && font.indexOf("bold") > -1 ? "bold" : "normal";
            let fontSize = "11px";
            if (!M.utils.isNullOrEmpty(font)) {
              let px = font.substr(0, font.indexOf("px"));
              if (!M.utils.isNullOrEmpty(px)) {
                let space = px.lastIndexOf(" ");
                if (space > -1) {
                  fontSize = px.substr(space, px.length).trim().concat("px");
                }
                else {
                  fontSize = px.concat("px");
                }
              }
            }
            style = Object.assign(style, {
              "label": text.getText(),
              "fontColor": M.utils.isNullOrEmpty(text.getFill()) ? "" : M.utils.rgbToHex(text.getFill().getColor()),
              "fontSize": fontSize,
              "fontFamily": "Helvetica, sans-serif",
              "fontStyle": "normal",
              "fontWeight": fontWeight,
              "labelXOffset": text.getOffsetX(),
              "labelYOffset": text.getOffsetY(),
              "fillColor": style.fillColor || "#FF0000",
              "fillOpacity": style.fillOpacity || 0,
              "labelOutlineColor ": M.utils.isNullOrEmpty(text.getStroke()) ? "" : M.utils.rgbToHex(text.getStroke().getColor() || "#FF0000"),
              "labelOutlineWidth": M.utils.isNullOrEmpty(text.getStroke()) ? "" : text.getStroke().getWidth(),
              "labelAlign": align,
            });
          }

          if (!M.utils.isNullOrEmpty(geometry) && geometry.intersectsExtent(bbox)) {
            var styleStr = JSON.stringify(style);
            var styleName = stylesNames[styleStr];
            if (M.utils.isUndefined(styleName)) {
              styleName = index;
              stylesNames[styleStr] = styleName;
              encodedStyles[styleName] = style;
              index++;
            }
            var geoJSONFeature;
            if (projection.code !== "EPSG:3857" && this.facadeMap_.getLayers().some(layer => (layer.type === M.layer.type.OSM || layer.type === M.layer.type.Mapbox))) {
              geoJSONFeature = geoJSONFormat.writeFeatureObject(feature, {
                'featureProjection': projection.code,
                'dataProjection': 'EPSG:3857',
              });
            }
            else {
              geoJSONFeature = geoJSONFormat.writeFeatureObject(feature);
            }
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
  M.impl.control.Printer.prototype.encodeWMTS = function(layer) {
    var zoom = this.facadeMap_.getZoom();
    // var units = this.facadeMap_.getProjection().units;
    var layerImpl = layer.getImpl();
    var olLayer = layerImpl.getOL3Layer();
    var layerSource = olLayer.getSource();
    var tileGrid = layerSource.getTileGrid();

    var layerUrl = layer.url;
    var layerName = layer.name;
    // var layerVersion = layer.version;
    var layerOpacity = olLayer.getOpacity();
    var layerReqEncoding = layerSource.getRequestEncoding();
    var tiled = layerImpl.tiled;
    // var style = layerSource.getStyle();
    var layerExtent = olLayer.getExtent();
    var params = {};
    var matrixSet = layerSource.getMatrixSet();
    // var tileOrigin = tileGrid.getOrigin(zoom);
    var tileSize = tileGrid.getTileSize(zoom);
    var resolutions = tileGrid.getResolutions();
    // var matrixIds = tileGrid.getMatrixIds();

    /**
     * @see http: //www.mapfish.org/doc/print/protocol.html#layers-params
     */
    return layer.getImpl().getCapabilities().then(function(capabilities) {
      var matrixIdsObj = capabilities["Contents"]["TileMatrixSet"].filter(function(tileMatrixSet) {
        return (tileMatrixSet["Identifier"] === matrixSet);
      })[0];
      return {
        'baseURL': layerUrl,
        'opacity': layerOpacity,
        'singleTile': !tiled,
        'type': 'WMTS',
        'layer': layerName,
        'requestEncoding': layerReqEncoding,
        'tileSize': tileSize,
        // 'style': style,
        'style': "deafult",
        // 'tileOrigin': tileOrigin,
        // 'zoomOffset': 0,
        "rotation": 0,
        "imageFormat": "image/png",
        "dimensionParams": {},
        "dimensions": [],
        'params': params,
        // 'version': layerVersion,
        "version": "1.0.0",
        'maxExtent': layerExtent,
        'matrixSet': matrixSet,
        'matrixIds': matrixIdsObj.TileMatrix.map(function(tileMatrix, i) {
          return {
            "identifier": tileMatrix["Identifier"],
            "matrixSize": [tileMatrix["MatrixHeight"], tileMatrix["MatrixWidth"]],
            // "resolution": resolutions[resolutions.length - (i + 1)],
            "scaleDenominator": tileMatrix["ScaleDenominator"],
            "tileSize": [tileMatrix["TileWidth"], tileMatrix["TileHeight"]],
            "topLeftCorner": tileMatrix["TopLeftCorner"]
          };
        }),
        'resolutions': resolutions
      };
    });
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

    var layerUrl = layer.url || 'http://tile.openstreetmap.org/';
    var layerName = layer.name;
    var layerOpacity = olLayer.getOpacity();
    var tiled = layerImpl.tiled;
    var layerExtent = tileGrid.getExtent();
    var tileSize = tileGrid.getTileSize();
    var resolutions = tileGrid.getResolutions();
    encodedLayer = {
      'baseURL': layerUrl,
      'opacity': layerOpacity,
      'singleTile': !tiled,
      'layer': layerName,
      'maxExtent': layerExtent,
      'tileSize': [tileSize, tileSize],
      "resolutions": resolutions,
      'type': 'OSM',
      'extension': "png"
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
  M.impl.control.Printer.prototype.encodeMapbox = function(layer) {
    var encodedLayer = null;

    var layerImpl = layer.getImpl();
    var olLayer = layerImpl.getOL3Layer();
    var layerSource = olLayer.getSource();
    var tileGrid = layerSource.getTileGrid();

    var layerUrl = M.utils.concatUrlPaths([M.config.MAPBOX_URL, layer.name]);
    var layerOpacity = olLayer.getOpacity();
    var layerExtent = tileGrid.getExtent();

    var tileSize = tileGrid.getTileSize();
    var resolutions = tileGrid.getResolutions();

    var customParams = {};
    customParams[M.config.MAPBOX_TOKEN_NAME] = M.config.MAPBOX_TOKEN_VALUE;
    encodedLayer = {
      'opacity': layerOpacity,
      'baseURL': layerUrl,
      'customParams': customParams,
      'maxExtent': layerExtent,
      'tileSize': [tileSize, tileSize],
      'resolutions': resolutions,
      'extension': M.config.MAPBOX_EXTENSION,
      'type': 'xyz',
      'path_format': '/${z}/${x}/${y}.png'
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
    this.facadeMap_.getMapImpl().removeControl(this);
    this.facadeMap_ = null;
  };
})();
