/**
 * @namespace M.impl.control
 */
export deafult class PrinterControl extends M.impl.Control {
  /**
   * @classdesc
   * Main constructor of the measure conrol.
   *
   * @constructor
   * @extends {ol.control.Control}
   * @api stable
   */
  constructor() {
    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.facadeMap_ = null;
  }

  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {function} template template of this control
   * @api stable
   */
  addTo(map, element) {
    this.facadeMap_ = map;

    ol.control.Control.call(this, {
      'element': element,
      'target': null
    });
    map.getMapImpl().addControl(this);
  }

  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {function} template template of this control
   * @api stable
   */
  encodeLayer(layer) {
    return (new Promise((success, fail) => {
      if (layer.type === M.layer.type.WMC) {
        // none
      }
      else if (layer.type === M.layer.type.KML) {
        success(this.encodeKML(layer));
      }
      else if (layer.type === M.layer.type.WMS) {
        success(this.encodeWMS(layer));
      }
      else if (layer.type === M.layer.type.WFS) {
        success(this.encodeWFS(layer));
      }
      else if (layer.type === M.layer.type.GeoJSON) {
        /*se reutiliza el codificador WFS ya, aunque ya está en geojson,
          el proceso a realizar es el mismo y recodificar en geojson no
          penaliza*/
        success(this.encodeWFS(layer));
      }
      else if (layer.type === M.layer.type.WMTS) {
        this.encodeWMTS(layer).then(encodedLayer => {
          success(encodedLayer);
        });
      }
      else if (layer.type === M.layer.type.MBtiles) {
        // none
      }
      else if (layer.type === M.layer.type.OSM) {
        success(this.encodeOSM(layer));
      }
      else if (layer.type === M.layer.type.Mapbox) {
        success(this.encodeMapbox(layer));
      }
      else if (M.utils.isNullOrEmpty(layer.type) && layer instanceof M.layer.Vector) {
        success(this.encodeWFS(layer));
      }
      else {
        success(this.encodeWFS(layer));
      }
    }));
  }

  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {function} template template of this control
   * @api stable
   */
  encodeLegend(layer) {
    let encodedLegend = null;

    if (layer.displayInLayerSwitcher) {
      encodedLegend = {
        "name": layer.name,
        "classes": []
      };

      let regExpImgDefault = new RegExp('.*' + M.layer.LEGEND_DEFAULT + '$');
      var regExpImgError = new RegExp('.*' + M.layer.LEGEND_ERROR + '$');
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
  }

  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {function} template template of this control
   * @api stable
   */
  encodeKML(layer) {
    let encodedLayer = null;

    let olLayer = layer.getImpl().getOL3Layer();
    let features = olLayer.getSource().getFeatures();
    let layerName = layer.name;
    let layerOpacity = olLayer.getOpacity();
    let geoJSONFormat = new ol.format.GeoJSON();
    let bbox = this.facadeMap_.getBbox();
    bbox = [bbox.x.min, bbox.y.min, bbox.x.max, bbox.y.max];
    let resolution = this.facadeMap_.getMapImpl().getView().getResolution();

    let encodedFeatures = [];
    let encodedStyles = {};
    let stylesNames = {};
    let index = 1;
    features.forEach(feature => {
      let geometry = feature.getGeometry();
      let styleId = feature.get("styleUrl");
      if (!M.utils.isNullOrEmpty(styleId)) {
        styleId = styleId.replace('\#', '');
      }
      let styleFn = feature.getStyle();
      if (!M.utils.isNullOrEmpty(styleFn)) {
        let featureStyle = styleFn.call(feature, resolution)[0];
        if (!M.utils.isNullOrEmpty(featureStyle)) {

          let img = featureStyle.getImage();
          let imgSize = img.getImageSize();
          if (M.utils.isNullOrEmpty(imgSize)) {
            imgSize = [64, 64];
          }
          let stroke = featureStyle.getStroke();
          let style = {
            "id": styleId,
            "externalGraphic": img.getSrc(),
            "graphicHeight": imgSize[0],
            "graphicWidth": imgSize[1],
            "graphicOpacity": img.getOpacity(),
            "strokeWidth": stroke.getWidth()
          };
          let text = (featureStyle.getText && featureStyle.getText());
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
            let styleStr = JSON.stringify(style);
            let styleName = stylesNames[styleStr];
            if (M.utils.isUndefined(styleName)) {
              styleName = index;
              stylesNames[styleStr] = styleName;
              encodedStyles[styleName] = style;
              index++;
            }
            let geoJSONFeature = geoJSONFormat.writeFeatureObject(feature);
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
  }

  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {function} template template of this control
   * @api stable
   */
  encodeWMS(layer) {
    let encodedLayer = null;
    let olLayer = layer.getImpl().getOL3Layer();
    let layerUrl = layer.url;
    let layerOpacity = olLayer.getOpacity();
    let tiled = layer.getImpl().tiled;
    let params = olLayer.getSource().getParams();
    let paramsLayers = [params['LAYERS']];
    let paramsFormat = params['FORMAT'];
    let paramsStyles = [params['STYLES']];
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
    let noChacheName = layer.getNoChacheName();
    let noChacheUrl = layer.getNoChacheUrl();
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
  }

  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {function} template template of this control
   * @api stable
   */
  encodeWFS(layer) {
    let encodedLayer = null;
    let continuePrint = true;
    if (layer.getStyle() instanceof M.style.Chart) {
      continuePrint = false;
    }
    else if (layer.getStyle() instanceof M.style.Cluster && layer.getStyle().getOldStyle() instanceof M.style.Chart) {
      continuePrint = false;
    }
    if (continuePrint) {
      let projection = this.facadeMap_.getProjection();
      let olLayer = layer.getImpl().getOL3Layer();
      let features = olLayer.getSource().getFeatures();
      let layerName = layer.name;
      let layerOpacity = olLayer.getOpacity();
      let layerStyle = olLayer.getStyle();
      let geoJSONFormat = new ol.format.GeoJSON();
      let bbox = this.facadeMap_.getBbox();
      bbox = [bbox.x.min, bbox.y.min, bbox.x.max, bbox.y.max];
      let resolution = this.facadeMap_.getMapImpl().getView().getResolution();

      let encodedFeatures = [];
      let encodedStyles = {};
      let stylesNames = {};
      let index = 1;
      features.forEach(feature => {
        let geometry = feature.getGeometry();
        let featureStyle;
        let fStyle = feature.getStyle();

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
          //JGL20180118: prioridad al estilo que tiene SRC
          if (featureStyle.length > 1) {
            featureStyle = (!M.utils.isNullOrEmpty(featureStyle[1].getImage()) && featureStyle[1].getImage().getSrc) ?
              featureStyle[1] : featureStyle[0];
          }
          else {
            featureStyle = featureStyle[0];
          }

        }

        if (!M.utils.isNullOrEmpty(featureStyle)) {
          //console.log(featureStyle);
          var image = featureStyle.getImage();
          var imgSize = M.utils.isNullOrEmpty(image) ? [0, 0] : (image.getImageSize() || [24, 24]);
          var text = featureStyle.getText();
          if (M.utils.isNullOrEmpty(text) && !M.utils.isNullOrEmpty(featureStyle.textPath)) {
            text = featureStyle.textPath;
          }
          var stroke = M.utils.isNullOrEmpty(image) ? featureStyle.getStroke() : (image.getStroke && image.getStroke());
          var fill = M.utils.isNullOrEmpty(image) ? featureStyle.getFill() : (image.getFill && image.getFill());

          //JGL20180118: fillOpacity=1 por defecto
          var style = {
            "fillColor": M.utils.isNullOrEmpty(fill) ? "#000000" : M.utils.rgbaToHex(fill.getColor()),
            "fillOpacity": M.utils.isNullOrEmpty(fill) ? 1 : M.utils.getOpacityFromRgba(fill.getColor()),
            "strokeColor": M.utils.isNullOrEmpty(stroke) ? "#000000" : M.utils.rgbaToHex(stroke.getColor()),
            "strokeOpacity": M.utils.isNullOrEmpty(stroke) ? 0 : M.utils.getOpacityFromRgba(stroke.getColor()),
            "strokeWidth": M.utils.isNullOrEmpty(stroke) ? 0 : (stroke.getWidth && stroke.getWidth()),
            "pointRadius": M.utils.isNullOrEmpty(image) ? "" : (image.getRadius && image.getRadius()),
            "externalGraphic": M.utils.isNullOrEmpty(image) ? "" : (image.getSrc && image.getSrc()),
            "graphicHeight": imgSize[0],
            "graphicWidth": imgSize[1],
          };
          //console.log(style);
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
              "fontColor": M.utils.isNullOrEmpty(text.getFill()) ? "#000000" : M.utils.rgbToHex(text.getFill().getColor()),
              "fontSize": fontSize,
              "fontFamily": "Helvetica, sans-serif",
              "fontStyle": "normal",
              "fontWeight": fontWeight,
              "labelXOffset": text.getOffsetX(),
              "labelYOffset": text.getOffsetY(),
              "fillColor": style.fillColor || "#FF0000",
              "fillOpacity": style.fillOpacity || 1, //JGL20180118: fillOpacity=1 por defecto
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
  }

  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {function} template template of this control
   * @api stable
   */
  encodeWMTS(layer) {
    let zoom = this.facadeMap_.getZoom();
    // var units = this.facadeMap_.getProjection().units;
    let layerImpl = layer.getImpl();
    let olLayer = layerImpl.getOL3Layer();
    let layerSource = olLayer.getSource();
    let tileGrid = layerSource.getTileGrid();

    let layerUrl = layer.url;
    let layerName = layer.name;
    // var layerVersion = layer.version;
    let layerOpacity = olLayer.getOpacity();
    let layerReqEncoding = layerSource.getRequestEncoding();
    let tiled = layerImpl.tiled;
    // var style = layerSource.getStyle();
    let layerExtent = olLayer.getExtent();
    let params = {};
    let matrixSet = layerSource.getMatrixSet();
    // var tileOrigin = tileGrid.getOrigin(zoom);
    let tileSize = tileGrid.getTileSize(zoom);
    let resolutions = tileGrid.getResolutions();
    // var matrixIds = tileGrid.getMatrixIds();

    /**
     * @see http: //www.mapfish.org/doc/print/protocol.html#layers-params
     */
    return layer.getImpl().getCapabilities().then(capabilities => {
      let matrixIdsObj = capabilities["Contents"]["TileMatrixSet"].filter(tileMatrixSet => {
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
        'matrixIds': matrixIdsObj.TileMatrix.map((tileMatrix, i) => {
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
  }

  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {function} template template of this control
   * @api stable
   */
  encodeOSM(layer) {
    let encodedLayer = null;

    let layerImpl = layer.getImpl();
    let olLayer = layerImpl.getOL3Layer();
    let layerSource = olLayer.getSource();
    let tileGrid = layerSource.getTileGrid();

    let layerUrl = layer.url || 'http://tile.openstreetmap.org/';
    let layerName = layer.name;
    let layerOpacity = olLayer.getOpacity();
    let tiled = layerImpl.tiled;
    let layerExtent = tileGrid.getExtent();
    let tileSize = tileGrid.getTileSize();
    let resolutions = tileGrid.getResolutions();
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

  }

  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {function} template template of this control
   * @api stable
   */
  encodeMapbox(layer) {
    let encodedLayer = null;

    let layerImpl = layer.getImpl();
    let olLayer = layerImpl.getOL3Layer();
    let layerSource = olLayer.getSource();
    let tileGrid = layerSource.getTileGrid();

    let layerUrl = M.utils.concatUrlPaths([M.config.MAPBOX_URL, layer.name]);
    let layerOpacity = olLayer.getOpacity();
    let layerExtent = tileGrid.getExtent();

    let tileSize = tileGrid.getTileSize();
    let resolutions = tileGrid.getResolutions();

    let customParams = {};
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
  }

  /**
   * This function destroys this control, clearing the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.facadeMap_.getMapImpl().removeControl(this);
    this.facadeMap_ = null;
  }
}
