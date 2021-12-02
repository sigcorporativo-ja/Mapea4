/**
 * @namespace M.impl.control
 */
export default class PrinterControl extends M.impl.Control {
  /**
   * @classdesc
   * Main constructor of the measure conrol.
   *
   * @constructor
   * @extends {ol.control.Control}
   * @api stable
   */
  constructor(options = {}) {
    super();
    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.facadeMap_ = null;

    this.additionalOptsLabel_ = {};
    this.labeling_ = options.labeling;
    if (!M.utils.isNullOrEmpty(this.labeling_)) {
      if (!M.utils.isNullOrEmpty(this.labeling_.allowOverruns)) {
        this.additionalOptsLabel_.allowOverruns = this.labeling_.allowOverruns;
      }
      if (!M.utils.isNullOrEmpty(this.labeling_.autoWrap)) {
        this.additionalOptsLabel_.autoWrap = this.labeling_.autoWrap;
      }
      if (!M.utils.isNullOrEmpty(this.labeling_.conflictResolution)) {
        this.additionalOptsLabel_.conflictResolution = this.labeling_.conflictResolution;
      } else {
        this.additionalOptsLabel_.conflictResolution = 'false';
      }
      if (!M.utils.isNullOrEmpty(this.labeling_.followLine)) {
        this.additionalOptsLabel_.followLine = this.labeling_.followLine;
      }
      if (!M.utils.isNullOrEmpty(this.labeling_.goodnessOfFit)) {
        this.additionalOptsLabel_.goodnessOfFit = this.labeling_.goodnessOfFit;
      } else {
        this.additionalOptsLabel_.goodnessOfFit = 0.9;
      }
      if (!M.utils.isNullOrEmpty(this.labeling_.group)) {
        this.additionalOptsLabel_.group = this.labeling_.group;
      }
      if (!M.utils.isNullOrEmpty(this.labeling_.maxDisplacement)) {
        this.additionalOptsLabel_.maxDisplacement = this.labeling_.maxDisplacement;
      }
      if (!M.utils.isNullOrEmpty(this.labeling_.spaceAround)) {
        this.additionalOptsLabel_.spaceAround = this.labeling_.spaceAround;
      }
    } else {
      this.additionalOptsLabel_.conflictResolution = 'false';
      this.additionalOptsLabel_.goodnessOfFit = 0.9;
    }
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
      element,
      target: null,
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
      } else if (layer.type === M.layer.type.KML) {
        success(this.encodeKML(layer));
      } else if (layer.type === M.layer.type.WMS) {
        success(this.encodeWMS(layer));
      } else if (layer.type === M.layer.type.WFS) {
        success(this.encodeWFS(layer));
      } else if (layer.type === M.layer.type.GeoJSON) {
        /* se reutiliza el codificador WFS ya, aunque ya está en geojson,
          el proceso a realizar es el mismo y recodificar en geojson no
          penaliza */

        success(this.encodeWFS(layer));
      } else if (layer.type === M.layer.type.WMTS) {
        this.encodeWMTS(layer).then((encodedLayer) => {
          success(encodedLayer);
        });
      } else if (layer.type === M.layer.type.MBtiles) {
        // none
      } else if (layer.type === M.layer.type.OSM) {
        success(this.encodeOSM(layer));
      } else if (layer.type === M.layer.type.Mapbox) {
        success(this.encodeMapbox(layer));
      } else if (M.utils.isNullOrEmpty(layer.type) && layer instanceof M.layer.Vector) {
        success(this.encodeWFS(layer));
      } else {
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
        classes: [],
      };

      const regExpImgDefault = new RegExp(`.*${M.Layer.LEGEND_DEFAULT}$`);
      const regExpImgError = new RegExp(`.*${M.Layer.LEGEND_ERROR}$`);
      const legendURL = layer.getLegendURL();
      if (!M.utils.isNullOrEmpty(legendURL) && !regExpImgDefault.test(legendURL) &&
        !regExpImgError.test(legendURL)) {
        encodedLegend.classes[0] = {
          name: layer.name,
          icons: [layer.getLegendURL()],
        };
        if (layer instanceof M.layer.Vector) {
          delete encodedLegend.classes[0].icons;
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

    const olLayer = layer.getImpl().getOLLayer();
    const features = olLayer.getSource().getFeatures();
    const layerName = layer.name;
    const layerOpacity = olLayer.getOpacity();
    const geoJSONFormat = new ol.format.GeoJSON();
    let bbox = this.facadeMap_.getBbox();
    bbox = [bbox.x.min, bbox.y.min, bbox.x.max, bbox.y.max];
    const resolution = this.facadeMap_.getMapImpl().getView().getResolution();

    const encodedFeatures = [];
    let indexText = 1;
    let indexGeom = 1;
    let style = '';
    const stylesNames = {};
    const stylesNamesText = {};
    let index = 1;
    let nameFeature;
    let filter;
    features.forEach((feature) => {
      const geometry = feature.getGeometry();
      let styleId = feature.get('styleUrl');
      if (!M.utils.isNullOrEmpty(styleId)) {
        styleId = styleId.replace('#', '');
      }
      const styleFn = feature.getStyle();
      if (!M.utils.isNullOrEmpty(styleFn)) {
        let featureStyle;
        try {
          featureStyle = styleFn(feature, resolution);
          if (Array.isArray(featureStyle)) {
            featureStyle = featureStyle[0];
          }
        } catch (e) {
          featureStyle = styleFn.call(feature, resolution)[0];
        }
        if (!M.utils.isNullOrEmpty(featureStyle)) {
          const img = featureStyle.getImage();
          let imgSize = img.getImageSize();
          if (M.utils.isNullOrEmpty(imgSize)) {
            imgSize = [64, 64];
          }
          // MapFish Print 3 solo acepta los tipos polygon, text, line y point
          let parseType;
          if (feature.getGeometry().getType().toLowerCase() === 'multipolygon') {
            parseType = 'polygon';
          } else if (feature.getGeometry().getType().toLowerCase() === 'multipoint') {
            parseType = 'point';
          } else {
            parseType = feature.getGeometry().getType().toLowerCase();
          }
          const stroke = featureStyle.getStroke();
          let styleText;
          const styleGeom = {
            type: parseType,
            id: styleId,
            externalGraphic: img.getSrc(),
            graphicHeight: imgSize[0],
            graphicWidth: imgSize[1],
            graphicOpacity: img.getOpacity(),
            strokeWidth: stroke ? stroke.getWidth() : 1,
          };
          const text = (featureStyle.getText && featureStyle.getText());
          if (!M.utils.isNullOrEmpty(text)) {
            styleText = {
              type: 'text',
              label: M.utils.isNullOrEmpty(text.getText()) ? feature.get('name') : text.getText(),
              fontColor: M.utils.isNullOrEmpty(text.getFill()) ? '' : M.utils.rgbToHex(M.utils.isArray(text.getFill().getColor()) ?
                `rgba(${text.getFill().getColor().toString()})` :
                text.getFill().getColor()),
              fontSize: '11px',
              fontFamily: 'Helvetica, sans-serif',
              fontWeight: 'bold',
              conflictResolution: this.additionalOptsLabel_.conflictResolution,
              labelAlign: text.getTextAlign(),
              labelXOffset: text.getOffsetX(),
              labelYOffset: text.getOffsetY(),
              labelOutlineColor: M.utils.isNullOrEmpty(text.getStroke()) ? '' : M.utils.rgbToHex(M.utils.isArray(text.getStroke().getColor()) ?
                `rgba(${text.getStroke().getColor().toString()})` :
                text.getStroke().getColor()),
              labelOutlineWidth: M.utils.isNullOrEmpty(text.getStroke()) ? '' : text.getStroke().getWidth(),
            };
            // Se deja la cifra hexadecimal en 6 dígitos para la integración con Mapea 4
            styleText.fontColor = styleText.fontColor.slice(0, 7);
            styleText.labelOutlineColor = styleText.labelOutlineColor.slice(0, 7);
            styleText = this.addAdditionalLabelOptions(styleText);
          }
          nameFeature = `draw${index}`;
          if ((!M.utils.isNullOrEmpty(geometry) && geometry.intersectsExtent(bbox)) ||
            !M.utils.isNullOrEmpty(text)) {
            const styleStr = JSON.stringify(styleGeom);
            const styleTextStr = JSON.stringify(styleText);
            let styleName = stylesNames[styleStr];
            let styleNameText = stylesNamesText[styleTextStr];
            if (M.utils.isUndefined(styleName) || M.utils.isUndefined(styleNameText)) {
              const symbolizers = [];
              let flag = 0;
              if (!M.utils.isNullOrEmpty(geometry) && geometry.intersectsExtent(bbox) &&
                M.utils.isUndefined(styleName)) {
                styleName = indexGeom;
                stylesNames[styleStr] = styleName;
                flag = 1;
                symbolizers.push(styleStr);
                indexGeom += 1;
                index += 1;
              }
              if (!M.utils.isNullOrEmpty(text) && M.utils.isUndefined(styleNameText)) {
                styleNameText = indexText;
                stylesNamesText[styleTextStr] = styleNameText;
                symbolizers.push(styleTextStr);
                indexText += 1;
                if (flag === 0) {
                  index += 1;
                  symbolizers.push(styleStr);
                }
              }
              if (styleName === undefined) {
                styleName = 0;
              }
              if (styleNameText === undefined) {
                styleNameText = 0;
              }
              // Se añaden los estilos con el formato adecuado para MapFish Print 3
              filter = `"[_gx_style ='${styleName + styleNameText}']"`;
              if (!M.utils.isNullOrEmpty(symbolizers)) {
                const a = ` ${filter}:{"symbolizers": [${symbolizers}]}`;
                if (style !== '') {
                  style += `,${a}`;
                } else {
                  style += `{${a},"version":"2"`;
                }
              }
            }

            const geoJSONFeature = geoJSONFormat.writeFeatureObject(feature);
            geoJSONFeature.properties = {
              // gx_style es la propiedad que se usa para referenciar a la feature en los estilos
              _gx_style: styleName + styleNameText,
              name: nameFeature,
            };
            encodedFeatures.push(geoJSONFeature);
          }
        }
      }
    }, this);

    if (style !== '') {
      style = JSON.parse(style.concat('}'));
    } else {
      style = {
        '*': {
          symbolizers: [],
        },
        version: '2',
      };
    }

    encodedLayer = {
      type: 'Vector',
      style,
      styleProperty: '_gx_style',
      geoJson: {
        type: 'FeatureCollection',
        features: encodedFeatures,
      },
      name: layerName,
      opacity: layerOpacity,
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
    const olLayer = layer.getImpl().getOLLayer();
    const layerUrl = layer.url;
    const layerOpacity = olLayer.getOpacity();
    // const tiled = layer.getImpl().tiled;
    const params = olLayer.getSource().getParams();
    const paramsLayers = [params.LAYERS];
    const paramsFormat = params.FORMAT;
    const paramsStyles = [params.STYLES];
    encodedLayer = {
      baseURL: layerUrl,
      opacity: layerOpacity,
      // singleTile: !tiled,
      type: 'WMS',
      layers: paramsLayers.join(',').split(','),
      format: paramsFormat || 'image/jpeg',
      styles: paramsStyles.join(',').split(','),
    };

    /** ***********************************
     MAPEA DE CAPAS TILEADA.
    ************************************ */
    // Se adapta el código para llamar al método noCache o noChache
    // dependiendo si usamos Mapea 5 o 4
    // eslint-disable-next-line no-underscore-dangle
    if (layer._updateNoCache) {
      // eslint-disable-next-line no-underscore-dangle
      layer._updateNoCache();
      const noCacheName = layer.getNoCacheName();
      const noChacheUrl = layer.getNoCacheUrl();
      if (!M.utils.isNullOrEmpty(noCacheName) && !M.utils.isNullOrEmpty(noChacheUrl)) {
        encodedLayer.layers = [noCacheName];
        encodedLayer.baseURL = noChacheUrl;
      }
    } else {
      const noCacheName = layer.getNoChacheName();
      const noCacheUrl = layer.getNoChacheUrl();
      if (!M.utils.isNullOrEmpty(noCacheName) && !M.utils.isNullOrEmpty(noCacheUrl)) {
        encodedLayer.layers = [noCacheName];
        encodedLayer.baseURL = noCacheUrl;
      }
    }

    /** *********************************  */

    // defaults
    encodedLayer.customParams = {
      // service: 'WMS',
      // version: '1.1.1',
      // request: 'GetMap',
      // styles: '',
      // format: 'image/jpeg',
    };

    const propKeys = Object.keys(params);
    propKeys.forEach((key) => {
      if ('iswmc,transparent'.indexOf(key.toLowerCase()) !== -1) {
        encodedLayer.customParams[key] = params[key];
      }
    });
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
    } else if (layer.getStyle() instanceof M.style.Cluster &&
      layer.getStyle().getOldStyle() instanceof M.style.Chart) {
      continuePrint = false;
    }
    if (continuePrint) {
      const projection = this.facadeMap_.getProjection();
      const olLayer = layer.getImpl().getOLLayer();
      let features = null;
      // Esta condición sirve para que las capas MVT no provoquen un error.
      // Te devuelve la capa sin estilos.
      if (layer.type === M.layer.type.MVT) {
        features = layer.getFeatures();
      } else {
        features = olLayer.getSource().getFeatures();
      }
      const layerName = layer.name;
      const layerOpacity = olLayer.getOpacity();
      const layerStyle = olLayer.getStyle();
      const geoJSONFormat = new ol.format.GeoJSON();
      let bbox = this.facadeMap_.getBbox();
      bbox = [bbox.x.min, bbox.y.min, bbox.x.max, bbox.y.max];
      const resolution = this.facadeMap_.getMapImpl().getView().getResolution();

      const encodedFeatures = [];
      let nameFeature;
      let filter;
      let index = 1;
      let indexText = 1;
      let indexGeom = 1;
      let style = '';
      const stylesNames = {};
      const stylesNamesText = {};
      features.forEach((feature) => {
        const geometry = feature.getGeometry();
        let featureStyle;
        const fStyle = feature.getStyle();

        if (!M.utils.isNullOrEmpty(fStyle)) {
          featureStyle = fStyle;
        } else if (!M.utils.isNullOrEmpty(layerStyle)) {
          featureStyle = layerStyle;
        }

        if (featureStyle instanceof Function) {
          featureStyle = featureStyle.call(featureStyle, feature, resolution);
        }

        let styleIcon = null;
        if (featureStyle instanceof Array) {
          // JGL20180118: prioridad al estilo que tiene SRC
          if (featureStyle.length > 1) {
            styleIcon = !M.utils.isNullOrEmpty(featureStyle[1]) &&
              !M.utils.isNullOrEmpty(featureStyle[1].getImage()) &&
              featureStyle[1].getImage().getGlyph ?
              featureStyle[1].getImage() : null;
            featureStyle = (!M.utils.isNullOrEmpty(featureStyle[1].getImage()) &&
                featureStyle[1].getImage().getSrc) ?
              featureStyle[1] : featureStyle[0];
          } else {
            featureStyle = featureStyle[0];
          }
        }

        if (!M.utils.isNullOrEmpty(featureStyle)) {
          const image = featureStyle.getImage();
          const imgSize = M.utils
            .isNullOrEmpty(image) ? [0, 0] : (image.getImageSize() || [24, 24]);
          let text = featureStyle.getText();
          if (M.utils.isNullOrEmpty(text) && !M.utils.isNullOrEmpty(featureStyle.textPath)) {
            text = featureStyle.textPath;
          }
          let parseType;
          if (feature.getGeometry().getType().toLowerCase() === 'multipolygon') {
            parseType = 'polygon';
          } else if (feature.getGeometry().getType().toLowerCase() === 'multipoint') {
            parseType = 'point';
          } else if (feature.getGeometry().getType().toLowerCase() === 'multilinestring') {
            parseType = 'line';
          } else {
            parseType = feature.getGeometry().getType().toLowerCase();
          }
          const stroke = M.utils.isNullOrEmpty(image) ?
            featureStyle.getStroke() : (image.getStroke && image.getStroke());
          const fill = M.utils.isNullOrEmpty(image) ?
            featureStyle.getFill() : (image.getFill && image.getFill());

          let styleText;
          const pointRadius = M.utils.isNullOrEmpty(image) ? '' : (image.getRadius && image.getRadius());

          const styleGeom = {
            type: parseType,
            fillColor: M.utils.isNullOrEmpty(fill) ? '#000000' : M.utils.rgbaToHex(fill.getColor()).slice(0, 7),
            fillOpacity: M.utils.isNullOrEmpty(fill) ?
              0 : M.utils.getOpacityFromRgba(fill.getColor()),
            strokeColor: M.utils.isNullOrEmpty(stroke) ? '#000000' : M.utils.rgbaToHex(stroke.getColor()),
            strokeOpacity: M.utils.isNullOrEmpty(stroke) ?
              0 : M.utils.getOpacityFromRgba(stroke.getColor()),
            strokeWidth: M.utils.isNullOrEmpty(stroke) ? 0 : (stroke.getWidth && stroke.getWidth()),
            pointRadius: M.utils.isNullOrEmpty(image) ? '' : (image.getRadius && image.getRadius()),
            externalGraphic: M.utils.isNullOrEmpty(image) ? '' : (image.getSrc && image.getSrc()),
            graphicHeight: imgSize[0],
            graphicWidth: imgSize[1],
          };

          if (Number.isNaN(pointRadius)) {
            styleGeom.fillOpacity = 0;
            styleGeom.strokeOpacity = 0;
            styleGeom.pointRadius = 0;
          }
          const imageIcon = !M.utils.isNullOrEmpty(styleIcon) &&
            styleIcon.getImage ? styleIcon.getImage() : null;
          if (!M.utils.isNullOrEmpty(imageIcon)) {
            if (styleIcon.getRadius && styleIcon.getRadius()) {
              styleGeom.pointRadius = styleIcon.getRadius && styleIcon.getRadius();
            }
            if (styleIcon.getOpacity && styleIcon.getOpacity()) {
              styleGeom.graphicOpacity = styleIcon.getOpacity();
            }
            styleGeom.externalGraphic = imageIcon.toDataURL();
          }


          if (!M.utils.isNullOrEmpty(text)) {
            let tAlign = text.getTextAlign();
            let tBLine = text.getTextBaseline();
            let align = '';
            if (!M.utils.isNullOrEmpty(tAlign)) {
              if (tAlign === M.style.align.LEFT) {
                tAlign = 'l';
              } else if (tAlign === M.style.align.RIGHT) {
                tAlign = 'r';
              } else if (tAlign === M.style.align.CENTER) {
                tAlign = 'c';
              } else {
                tAlign = '';
              }
            }
            if (!M.utils.isNullOrEmpty(tBLine)) {
              if (tBLine === M.style.baseline.BOTTOM) {
                tBLine = 'b';
              } else if (tBLine === M.style.baseline.MIDDLE) {
                tBLine = 'm';
              } else if (tBLine === M.style.baseline.TOP) {
                tBLine = 't';
              } else {
                tBLine = '';
              }
            }
            if (!M.utils.isNullOrEmpty(tAlign) && !M.utils.isNullOrEmpty(tBLine)) {
              align = tAlign.concat(tBLine);
            }
            const font = text.getFont();
            const fontWeight = !M.utils.isNullOrEmpty(font) && font.indexOf('bold') > -1 ? 'bold' : 'normal';
            let fontSize = '11px';
            if (!M.utils.isNullOrEmpty(font)) {
              const px = font.substr(0, font.indexOf('px'));
              if (!M.utils.isNullOrEmpty(px)) {
                const space = px.lastIndexOf(' ');
                if (space > -1) {
                  fontSize = px.substr(space, px.length).trim().concat('px');
                } else {
                  fontSize = px.concat('px');
                }
              }
            }
            styleText = {
              type: 'text',
              label: text.getText() || '',
              fontColor: M.utils.isNullOrEmpty(text.getFill()) ? '#000000' : M.utils.rgbToHex(text.getFill().getColor()),
              fontSize,
              fontFamily: 'Helvetica, sans-serif',
              fontStyle: 'normal',
              fontWeight,
              conflictResolution: this.additionalOptsLabel_.conflictResolution,
              labelXOffset: text.getOffsetX(),
              labelYOffset: text.getOffsetY(),
              fillColor: styleGeom.fillColor || '#FF0000',
              fillOpacity: styleGeom.fillOpacity || 1,
              labelOutlineColor: M.utils.isNullOrEmpty(text.getStroke()) ? '' : M.utils.rgbToHex(text.getStroke().getColor() || '#FF0000'),
              labelOutlineWidth: M.utils.isNullOrEmpty(text.getStroke()) ? '' : text.getStroke().getWidth(),
              labelAlign: align,
            };
            styleText = this.addAdditionalLabelOptions(styleText);
          }
          nameFeature = `draw${index}`;

          if ((!M.utils.isNullOrEmpty(geometry) && geometry.intersectsExtent(bbox)) ||
            !M.utils.isNullOrEmpty(text)) {
            const styleStr = JSON.stringify(styleGeom);
            const styleTextStr = JSON.stringify(styleText);
            let styleName = stylesNames[styleStr];
            let styleNameText = stylesNamesText[styleTextStr];
            if (M.utils.isUndefined(styleName) || M.utils.isUndefined(styleNameText)) {
              const symbolizers = [];
              let flag = 0;
              if (!M.utils.isNullOrEmpty(geometry) && geometry.intersectsExtent(bbox) &&
                M.utils.isUndefined(styleName)) {
                styleName = indexGeom;
                stylesNames[styleStr] = styleName;
                flag = 1;
                symbolizers.push(styleStr);
                indexGeom += 1;
                index += 1;
              }
              if (!M.utils.isNullOrEmpty(text) && M.utils.isUndefined(styleNameText)) {
                styleNameText = indexText;
                stylesNamesText[styleTextStr] = styleNameText;
                symbolizers.push(styleTextStr);
                indexText += 1;
                if (flag === 0) {
                  index += 1;
                  symbolizers.push(styleStr);
                }
              }

              if (styleName === undefined) {
                styleName = 0;
              }
              if (styleNameText === undefined) {
                styleNameText = 0;
              }
              filter = `"[_gx_style ='${styleName + styleNameText}']"`;
              if (!M.utils.isNullOrEmpty(symbolizers)) {
                let a = ` ${filter}:{"symbolizers": [${symbolizers}]}`;
                if (layer.getStyle() instanceof M.style.Proportional) {
                  const typeFeature = feature.getGeometry().getType().toLocaleLowerCase();
                  if (typeFeature.indexOf('polygon') >= 0) {
                    a = a.replace('polygon', 'point');
                  } else if (typeFeature.indexOf('line') >= 0) {
                    a = a.replace('line', 'point');
                  }
                }
                if (style !== '') {
                  style += `,${a}`;
                } else {
                  style += `{${a},"version":"2"`;
                }
              }
            }

            let geoJSONFeature;
            if (projection.code !== 'EPSG:3857' && this.facadeMap_.getLayers().some(layerParam => (layerParam.type === M.layer.type.OSM || layerParam.type === M.layer.type.Mapbox))) {
              geoJSONFeature = geoJSONFormat.writeFeatureObject(feature, {
                featureProjection: projection.code,
                dataProjection: 'EPSG:3857',
              });
            } else {
              geoJSONFeature = geoJSONFormat.writeFeatureObject(feature);
            }
            geoJSONFeature.properties = {
              _gx_style: styleName + styleNameText,
              name: nameFeature,
            };
            encodedFeatures.push(geoJSONFeature);
          }
        }
      }, this);

      if (style !== '') {
        style = JSON.parse(style.concat('}'));
      } else {
        style = {
          '*': {
            symbolizers: [],
          },
          version: '2',
        };
      }

      encodedLayer = {
        type: 'Vector',
        style,
        styleProperty: '_gx_style',
        geoJson: {
          type: 'FeatureCollection',
          features: encodedFeatures,
        },
        name: layerName,
        opacity: layerOpacity,
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
  encodeMVT(layer) {
    let encodedLayer = null;
    let continuePrint = true;
    if (layer.getStyle() instanceof M.style.Chart) {
      continuePrint = false;
    } else if (layer.getStyle() instanceof M.style.Cluster &&
      layer.getStyle().getOldStyle() instanceof M.style.Chart) {
      continuePrint = false;
    }
    if (continuePrint) {
      const projection = this.facadeMap_.getProjection();
      const olLayer = layer.getImpl().getOLLayer();
      const features = layer.getFeatures();
      const layerName = layer.name;
      const layerOpacity = olLayer.getOpacity();
      const layerStyle = olLayer.getStyle();
      const geoJSONFormat = new ol.format.GeoJSON();
      let bbox = this.facadeMap_.getBbox();
      bbox = [bbox.x.min, bbox.y.min, bbox.x.max, bbox.y.max];
      const resolution = this.facadeMap_.getMapImpl().getView().getResolution();

      const encodedFeatures = [];
      let nameFeature;
      let filter;
      let index = 1;
      let indexText = 1;
      let indexGeom = 1;
      let style = '';
      const stylesNames = {};
      const stylesNamesText = {};
      features.forEach((feature) => {
        const geometry = feature.getGeometry();
        let featureStyle;
        const fStyle = feature.getStyle();

        if (!M.utils.isNullOrEmpty(fStyle)) {
          featureStyle = fStyle;
        } else if (!M.utils.isNullOrEmpty(layerStyle)) {
          featureStyle = layerStyle;
        }

        if (featureStyle instanceof Function) {
          featureStyle = featureStyle.call(featureStyle, feature, resolution);
        }

        if (featureStyle instanceof Array) {
          // JGL20180118: prioridad al estilo que tiene SRC
          if (featureStyle.length > 1) {
            featureStyle = (!M.utils.isNullOrEmpty(featureStyle[1].getImage()) &&
                featureStyle[1].getImage().getSrc) ?
              featureStyle[1] : featureStyle[0];
          } else {
            featureStyle = featureStyle[0];
          }
        }

        if (!M.utils.isNullOrEmpty(featureStyle)) {
          const image = featureStyle.getImage();
          const imgSize = M.utils
            .isNullOrEmpty(image) ? [0, 0] : (image.getImageSize() || [24, 24]);
          let text = featureStyle.getText();
          if (M.utils.isNullOrEmpty(text) && !M.utils.isNullOrEmpty(featureStyle.textPath)) {
            text = featureStyle.textPath;
          }
          let parseType;
          if (feature.getGeometry().getType().toLowerCase() === 'multipolygon') {
            parseType = 'polygon';
          } else if (feature.getGeometry().getType().toLowerCase() === 'multipoint') {
            parseType = 'point';
          } else if (feature.getGeometry().getType().toLowerCase() === 'multilinestring') {
            parseType = 'line';
          } else {
            parseType = feature.getGeometry().getType().toLowerCase();
          }
          const stroke = M.utils.isNullOrEmpty(image) ?
            featureStyle.getStroke() : (image.getStroke && image.getStroke());
          const fill = M.utils.isNullOrEmpty(image) ?
            featureStyle.getFill() : (image.getFill && image.getFill());

          let styleText;
          const styleGeom = {
            type: parseType,
            fillColor: M.utils.isNullOrEmpty(fill) ? '#000000' : M.utils.rgbaToHex(fill.getColor()).slice(0, 7),
            fillOpacity: M.utils.isNullOrEmpty(fill) ?
              0 : M.utils.getOpacityFromRgba(fill.getColor()),
            strokeColor: M.utils.isNullOrEmpty(stroke) ? '#000000' : M.utils.rgbaToHex(stroke.getColor()),
            strokeOpacity: M.utils.isNullOrEmpty(stroke) ?
              0 : M.utils.getOpacityFromRgba(stroke.getColor()),
            strokeWidth: M.utils.isNullOrEmpty(stroke) ? 0 : (stroke.getWidth && stroke.getWidth()),
            pointRadius: M.utils.isNullOrEmpty(image) ? '' : (image.getRadius && image.getRadius()),
            externalGraphic: M.utils.isNullOrEmpty(image) ? '' : (image.getSrc && image.getSrc()),
            graphicHeight: imgSize[0],
            graphicWidth: imgSize[1],
          };
          if (!M.utils.isNullOrEmpty(text)) {
            let tAlign = text.getTextAlign();
            let tBLine = text.getTextBaseline();
            let align = '';
            if (!M.utils.isNullOrEmpty(tAlign)) {
              if (tAlign === M.style.align.LEFT) {
                tAlign = 'l';
              } else if (tAlign === M.style.align.RIGHT) {
                tAlign = 'r';
              } else if (tAlign === M.style.align.CENTER) {
                tAlign = 'c';
              } else {
                tAlign = '';
              }
            }
            if (!M.utils.isNullOrEmpty(tBLine)) {
              if (tBLine === M.style.baseline.BOTTOM) {
                tBLine = 'b';
              } else if (tBLine === M.style.baseline.MIDDLE) {
                tBLine = 'm';
              } else if (tBLine === M.style.baseline.TOP) {
                tBLine = 't';
              } else {
                tBLine = '';
              }
            }
            if (!M.utils.isNullOrEmpty(tAlign) && !M.utils.isNullOrEmpty(tBLine)) {
              align = tAlign.concat(tBLine);
            }
            const font = text.getFont();
            const fontWeight = !M.utils.isNullOrEmpty(font) && font.indexOf('bold') > -1 ? 'bold' : 'normal';
            let fontSize = '11px';
            if (!M.utils.isNullOrEmpty(font)) {
              const px = font.substr(0, font.indexOf('px'));
              if (!M.utils.isNullOrEmpty(px)) {
                const space = px.lastIndexOf(' ');
                if (space > -1) {
                  fontSize = px.substr(space, px.length).trim().concat('px');
                } else {
                  fontSize = px.concat('px');
                }
              }
            }
            styleText = {
              type: 'text',
              label: text.getText() || '',
              fontColor: M.utils.isNullOrEmpty(text.getFill()) ? '#000000' : M.utils.rgbToHex(text.getFill().getColor()),
              fontSize,
              fontFamily: 'Helvetica, sans-serif',
              fontStyle: 'normal',
              fontWeight,
              conflictResolution: this.additionalOptsLabel_.conflictResolution,
              labelXOffset: text.getOffsetX(),
              labelYOffset: text.getOffsetY(),
              fillColor: styleGeom.fillColor || '#FF0000',
              fillOpacity: styleGeom.fillOpacity || 1,
              labelOutlineColor: M.utils.isNullOrEmpty(text.getStroke()) ? '' : M.utils.rgbToHex(text.getStroke().getColor() || '#FF0000'),
              labelOutlineWidth: M.utils.isNullOrEmpty(text.getStroke()) ? '' : text.getStroke().getWidth(),
              labelAlign: align,
            };
            styleText = this.addAdditionalLabelOptions(styleText);
          }
          nameFeature = `draw${index}`;

          if ((!M.utils.isNullOrEmpty(geometry) && geometry.intersectsExtent(bbox)) ||
            !M.utils.isNullOrEmpty(text)) {
            const styleStr = JSON.stringify(styleGeom);
            const styleTextStr = JSON.stringify(styleText);
            let styleName = stylesNames[styleStr];
            let styleNameText = stylesNamesText[styleTextStr];
            if (M.utils.isUndefined(styleName) || M.utils.isUndefined(styleNameText)) {
              const symbolizers = [];
              let flag = 0;
              if (!M.utils.isNullOrEmpty(geometry) && geometry.intersectsExtent(bbox) &&
                M.utils.isUndefined(styleName)) {
                styleName = indexGeom;
                stylesNames[styleStr] = styleName;
                flag = 1;
                symbolizers.push(styleStr);
                indexGeom += 1;
                index += 1;
              }
              if (!M.utils.isNullOrEmpty(text) && M.utils.isUndefined(styleNameText)) {
                styleNameText = indexText;
                stylesNamesText[styleTextStr] = styleNameText;
                symbolizers.push(styleTextStr);
                indexText += 1;
                if (flag === 0) {
                  index += 1;
                  symbolizers.push(styleStr);
                }
              }
              if (styleName === undefined) {
                styleName = 0;
              }
              if (styleNameText === undefined) {
                styleNameText = 0;
              }
              filter = `"[_gx_style ='${styleName + styleNameText}']"`;
              if (!M.utils.isNullOrEmpty(symbolizers)) {
                const a = ` ${filter}:{"symbolizers": [${symbolizers}]}`;
                if (style !== '') {
                  style += `,${a}`;
                } else {
                  style += `{${a},"version":"2"`;
                }
              }
            }

            let geoJSONFeature;
            if (projection.code !== 'EPSG:3857' && this.facadeMap_.getLayers().some(layerParam => (layerParam.type === M.layer.type.OSM || layerParam.type === M.layer.type.Mapbox))) {
              geoJSONFeature = geoJSONFormat.writeFeatureObject(feature, {
                featureProjection: projection.code,
                dataProjection: 'EPSG:3857',
              });
            } else {
              geoJSONFeature = geoJSONFormat.writeFeatureObject(feature);
            }
            geoJSONFeature.properties = {
              _gx_style: styleName + styleNameText,
              name: nameFeature,
            };
            encodedFeatures.push(geoJSONFeature);
          }
        }
      }, this);

      if (style !== '') {
        style = JSON.parse(style.concat('}'));
      } else {
        style = {
          '*': {
            symbolizers: [],
          },
          version: '2',
        };
      }

      encodedLayer = {
        type: 'Vector',
        style,
        styleProperty: '_gx_style',
        geoJson: {
          type: 'FeatureCollection',
          features: encodedFeatures,
        },
        name: layerName,
        opacity: layerOpacity,
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
    const zoom = this.facadeMap_.getZoom();
    const layerImpl = layer.getImpl();
    const olLayer = layerImpl.getOLLayer();
    const layerSource = olLayer.getSource();
    const tileGrid = layerSource.getTileGrid();
    const style = !M.utils.isNullOrEmpty(layerSource.getStyle) ? layerSource.getStyle() : 'default';


    const layerUrl = layer.url;
    const layerName = layer.name;
    const layerOpacity = olLayer.getOpacity();
    const layerReqEncoding = layerSource.getRequestEncoding();
    const tiled = layerImpl.tiled;
    const layerExtent = olLayer.getExtent();
    const params = {};
    const matrixSet = layerSource.getMatrixSet();
    const tileSize = tileGrid.getTileSize(zoom);
    const resolutions = tileGrid.getResolutions();

    /**
     * @see http: //www.mapfish.org/doc/print/protocol.html#layers-params
     */
    return layer.getImpl().getCapabilities().then((capabilities) => {
      const matrixIdsObj = capabilities.Contents.TileMatrixSet.filter((tileMatrixSet) => {
        return (tileMatrixSet.Identifier === matrixSet);
      })[0];
      return {
        baseURL: layerUrl,
        opacity: layerOpacity,
        singleTile: !tiled,
        type: 'WMTS',
        layer: layerName,
        requestEncoding: layerReqEncoding,
        tileSize,
        style: !M.utils.isNullOrEmpty(style) ? style : 'default',
        rotation: 0,
        imageFormat: 'image/png',
        dimensionParams: {},
        dimensions: [],
        params,
        version: '1.0.0',
        maxExtent: layerExtent,
        matrixSet,
        matrices: matrixIdsObj.TileMatrix.map((tileMatrix, i) => {
          return {
            identifier: tileMatrix.Identifier,
            matrixSize: [tileMatrix.MatrixHeight, tileMatrix.MatrixWidth],
            scaleDenominator: tileMatrix.ScaleDenominator,
            tileSize: [tileMatrix.TileWidth, tileMatrix.TileHeight],
            topLeftCorner: tileMatrix.TopLeftCorner,
          };
        }),
        resolutions,
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

    const layerImpl = layer.getImpl();
    const olLayer = layerImpl.getOLLayer();
    const layerSource = olLayer.getSource();
    const tileGrid = layerSource.getTileGrid();

    const layerUrl = layer.url || 'http://tile.openstreetmap.org/';
    const layerName = layer.name;
    const layerOpacity = olLayer.getOpacity();
    const tiled = layerImpl.tiled;
    const layerExtent = tileGrid.getExtent();
    const tileSize = tileGrid.getTileSize();
    const resolutions = tileGrid.getResolutions();
    encodedLayer = {
      baseURL: layerUrl,
      opacity: layerOpacity,
      singleTile: !tiled,
      layer: layerName,
      maxExtent: layerExtent,
      tileSize: [tileSize, tileSize],
      resolutions,
      type: 'OSM',
      imageExtension: 'png',
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

    const layerImpl = layer.getImpl();
    const olLayer = layerImpl.getOLLayer();
    const layerSource = olLayer.getSource();
    const tileGrid = layerSource.getTileGrid();

    const layerUrl = M.utils.concatUrlPaths([M.config.MAPBOX_URL, layer.name]);
    const layerOpacity = olLayer.getOpacity();
    const layerExtent = tileGrid.getExtent();

    const tileSize = tileGrid.getTileSize();
    const resolutions = tileGrid.getResolutions();


    const customParams = {};
    customParams[M.config.MAPBOX_TOKEN_NAME] = M.config.MAPBOX_TOKEN_VALUE;
    encodedLayer = {
      opacity: layerOpacity,
      baseURL: layerUrl,
      customParams,
      maxExtent: layerExtent,
      tileSize: [tileSize, tileSize],
      resolutions,
      extension: M.config.MAPBOX_EXTENSION,
      type: 'osm',
      path_format: '/${z}/${x}/${y}.png',
    };

    return encodedLayer;
  }

  transformExt(box, code, currProj) {
    return ol.proj.transformExtent(box, code, currProj);
  }

  /**
   * This function adds new parameters
   * for labels
   *
   * @public
   * @function
   * @param { Object } styleText style defined
   * for the label
   * @api stable
   */
  addAdditionalLabelOptions(styleText) {
    const auxStyleText = styleText;

    if (!M.utils.isNullOrEmpty(this.additionalOptsLabel_.allowOverruns)) {
      auxStyleText.allowOverruns = this.additionalOptsLabel_.allowOverruns;
    }
    if (!M.utils.isNullOrEmpty(this.additionalOptsLabel_.autoWrap)) {
      auxStyleText.autoWrap = this.additionalOptsLabel_.autoWrap;
    }
    if (!M.utils.isNullOrEmpty(this.additionalOptsLabel_.followLine)) {
      auxStyleText.followLine = this.additionalOptsLabel_.followLine;
    }
    if (!M.utils.isNullOrEmpty(this.additionalOptsLabel_.goodnessOfFit)) {
      auxStyleText.goodnessOfFit = this.additionalOptsLabel_.goodnessOfFit;
    }
    if (!M.utils.isNullOrEmpty(this.additionalOptsLabel_.group)) {
      auxStyleText.group = this.additionalOptsLabel_.group;
    }
    if (!M.utils.isNullOrEmpty(this.additionalOptsLabel_.maxDisplacement)) {
      auxStyleText.maxDisplacement = this.additionalOptsLabel_.maxDisplacement;
    }
    if (!M.utils.isNullOrEmpty(this.additionalOptsLabel_.spaceAround)) {
      auxStyleText.spaceAround = this.additionalOptsLabel_.spaceAround;
    }

    return auxStyleText;
  }

  /**
   * This function assigns value to goodnessOfFit
   *
   * @public
   * @function
   * @param { Decimal } value value to goodnessOfFit param for label
   * for the label
   * @api stable
   */
  setGoodnessOfFit(value) {
    this.additionalOptsLabel_.goodnessOfFit = value;
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
