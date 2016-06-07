/**
 * @fileoverview Custom exports file.
 * @suppress {checkVars}
 */

goog.require('M');
goog.require('M.Control');
goog.require('M.Label');
goog.require('M.Layer');
goog.require('M.Map');
goog.require('M.Object');
goog.require('M.Parameters');
goog.require('M.Plugin');
goog.require('M.Popup');
goog.require('M.control.GetFeatureInfo');
goog.require('M.control.LayerSwitcher');
goog.require('M.control.Location');
goog.require('M.control.Mouse');
goog.require('M.control.Navtoolbar');
goog.require('M.control.OverviewMap');
goog.require('M.control.Panzoom');
goog.require('M.control.Panzoombar');
goog.require('M.control.Scale');
goog.require('M.control.ScaleLine');
goog.require('M.control.WMCSelector');
goog.require('M.dialog');
goog.require('M.evt.EventsManager');
goog.require('M.evt.Listener');
goog.require('M.exception');
goog.require('M.facade.Base');
goog.require('M.geom');
goog.require('M.geom.wfs.type');
goog.require('M.geom.wkt.type');
goog.require('M.impl');
goog.require('M.impl.Layer');
goog.require('M.impl.Map');
goog.require('M.impl.control.Panzoom');
goog.require('M.impl.layer.OSM');
goog.require('M.layer');
goog.require('M.layer.GeoJSON');
goog.require('M.layer.KML');
goog.require('M.layer.OSM');
goog.require('M.layer.WFS');
goog.require('M.layer.WMC');
goog.require('M.layer.WMS');
goog.require('M.layer.WMTS');
goog.require('M.layer.type');
goog.require('M.parameter.center');
goog.require('M.parameter.kml');
goog.require('M.parameter.layer');
goog.require('M.parameter.maxExtent');
goog.require('M.parameter.osm');
goog.require('M.parameter.projection');
goog.require('M.parameter.resolutions');
goog.require('M.parameter.wfs');
goog.require('M.parameter.wmc');
goog.require('M.parameter.wms');
goog.require('M.parameter.wmts');
goog.require('M.parameter.zoom');
goog.require('M.plugin');
goog.require('M.polyfills');
goog.require('M.remote');
goog.require('M.remote.Response');
goog.require('M.remote.method');
goog.require('M.style.state');
goog.require('M.template');
goog.require('M.ui.Panel');
goog.require('M.ui.position');
goog.require('M.utils');
goog.require('M.window');


goog.exportSymbol(
    'M.dialog.show',
    M.dialog.show);

goog.exportSymbol(
    'M.dialog.remove',
    M.dialog.remove);

goog.exportSymbol(
    'M.dialog.info',
    M.dialog.info);

goog.exportSymbol(
    'M.dialog.error',
    M.dialog.error);

goog.exportSymbol(
    'M.dialog.success',
    M.dialog.success);

goog.exportSymbol(
    'M.evt.ADDED_TO_MAP',
    M.evt.ADDED_TO_MAP);

goog.exportSymbol(
    'M.evt.ADDED_TO_PANEL',
    M.evt.ADDED_TO_PANEL);

goog.exportSymbol(
    'M.evt.ADDED_LAYER',
    M.evt.ADDED_LAYER);

goog.exportSymbol(
    'M.evt.ADDED_WMC',
    M.evt.ADDED_WMC);

goog.exportSymbol(
    'M.evt.ADDED_KML',
    M.evt.ADDED_KML);

goog.exportSymbol(
    'M.evt.ADDED_WMS',
    M.evt.ADDED_WMS);

goog.exportSymbol(
    'M.evt.ADDED_WFS',
    M.evt.ADDED_WFS);

goog.exportSymbol(
    'M.evt.ADDED_WMTS',
    M.evt.ADDED_WMTS);

goog.exportSymbol(
    'M.evt.ACTIVATED',
    M.evt.ACTIVATED);

goog.exportSymbol(
    'M.evt.DEACTIVATED',
    M.evt.DEACTIVATED);

goog.exportSymbol(
    'M.evt.SHOW',
    M.evt.SHOW);

goog.exportSymbol(
    'M.evt.HIDE',
    M.evt.HIDE);

goog.exportSymbol(
    'M.evt.DESTROY',
    M.evt.DESTROY);

goog.exportSymbol(
    'M.evt.SELECT_FEATURES',
    M.evt.SELECT_FEATURES);

goog.exportSymbol(
    'M.evt.UNSELECT_FEATURES',
    M.evt.UNSELECT_FEATURES);

goog.exportSymbol(
    'M.evt.LOAD',
    M.evt.LOAD);

goog.exportSymbol(
    'M.evt.COMPLETED',
    M.evt.COMPLETED);

goog.exportSymbol(
    'M.evt.EventsManager',
    M.evt.EventsManager);

goog.exportProperty(
    M.evt.EventsManager.prototype,
    'add',
    M.evt.EventsManager.prototype.add);

goog.exportProperty(
    M.evt.EventsManager.prototype,
    'remove',
    M.evt.EventsManager.prototype.remove);

goog.exportProperty(
    M.evt.EventsManager.prototype,
    'fire',
    M.evt.EventsManager.prototype.fire);

goog.exportProperty(
    M.evt.EventsManager.prototype,
    'indexOf',
    M.evt.EventsManager.prototype.indexOf);

goog.exportSymbol(
    'M.evt.Listener',
    M.evt.Listener);

goog.exportProperty(
    M.evt.Listener.prototype,
    'fire',
    M.evt.Listener.prototype.fire);

goog.exportProperty(
    M.evt.Listener.prototype,
    'has',
    M.evt.Listener.prototype.has);

goog.exportSymbol(
    'M.facade.Base',
    M.facade.Base);

goog.exportProperty(
    M.facade.Base.prototype,
    'getImpl',
    M.facade.Base.prototype.getImpl);

goog.exportProperty(
    M.facade.Base.prototype,
    'setImpl',
    M.facade.Base.prototype.setImpl);

goog.exportSymbol(
    'M.geom.wfs.type.POINT',
    M.geom.wfs.type.POINT);

goog.exportSymbol(
    'M.geom.wfs.type.LINE',
    M.geom.wfs.type.LINE);

goog.exportSymbol(
    'M.geom.wfs.type.POLYGON',
    M.geom.wfs.type.POLYGON);

goog.exportSymbol(
    'M.geom.wfs.type.MPOINT',
    M.geom.wfs.type.MPOINT);

goog.exportSymbol(
    'M.geom.wfs.type.MLINE',
    M.geom.wfs.type.MLINE);

goog.exportSymbol(
    'M.geom.wfs.type.MPOLYGON',
    M.geom.wfs.type.MPOLYGON);

goog.exportSymbol(
    'M.geom.wkt.type.GEOMETRY',
    M.geom.wkt.type.GEOMETRY);

goog.exportSymbol(
    'M.geom.wkt.type.POINT',
    M.geom.wkt.type.POINT);

goog.exportSymbol(
    'M.geom.wkt.type.LINE_STRING',
    M.geom.wkt.type.LINE_STRING);

goog.exportSymbol(
    'M.geom.wkt.type.LINEAR_RING',
    M.geom.wkt.type.LINEAR_RING);

goog.exportSymbol(
    'M.geom.wkt.type.POLYGON',
    M.geom.wkt.type.POLYGON);

goog.exportSymbol(
    'M.geom.wkt.type.MULTI_POINT',
    M.geom.wkt.type.MULTI_POINT);

goog.exportSymbol(
    'M.geom.wkt.type.MULTI_LINE_STRING',
    M.geom.wkt.type.MULTI_LINE_STRING);

goog.exportSymbol(
    'M.geom.wkt.type.MULTI_POLYGON',
    M.geom.wkt.type.MULTI_POLYGON);

goog.exportSymbol(
    'M.geom.wkt.type.GEOMETRY_COLLECTION',
    M.geom.wkt.type.GEOMETRY_COLLECTION);

goog.exportSymbol(
    'M.geom.wkt.type.CIRCLE',
    M.geom.wkt.type.CIRCLE);

goog.exportSymbol(
    'M.geom.parse',
    M.geom.parse);

goog.exportSymbol(
    'M.geom.parseWFS',
    M.geom.parseWFS);

goog.exportSymbol(
    'M.Label',
    M.Label);

goog.exportProperty(
    M.Label.prototype,
    'hide',
    M.Label.prototype.hide);

goog.exportProperty(
    M.Label.prototype,
    'show',
    M.Label.prototype.show);

goog.exportProperty(
    M.Label.prototype,
    'getPopup',
    M.Label.prototype.getPopup);

goog.exportSymbol(
    'M.Label.POPUP_TEMPLATE',
    M.Label.POPUP_TEMPLATE);

goog.exportSymbol(
    'M.INCHES_PER_UNIT',
    M.INCHES_PER_UNIT);

goog.exportSymbol(
    'M.proxy',
    M.proxy);

goog.exportSymbol(
    'M.lang',
    M.lang);

goog.exportSymbol(
    'M.impl',
    M.impl);

goog.exportSymbol(
    'M.config',
    M.config);

goog.exportSymbol(
    'M.map',
    M.map);

goog.exportSymbol(
    'M.Object',
    M.Object);

goog.exportProperty(
    M.Object.prototype,
    'on',
    M.Object.prototype.on);

goog.exportProperty(
    M.Object.prototype,
    'un',
    M.Object.prototype.un);

goog.exportProperty(
    M.Object.prototype,
    'fire',
    M.Object.prototype.fire);

goog.exportSymbol(
    'M.plugin',
    M.plugin);

goog.exportSymbol(
    'M.Plugin',
    M.Plugin);

goog.exportProperty(
    M.Plugin.prototype,
    'addTo',
    M.Plugin.prototype.addTo);

goog.exportProperty(
    M.Plugin.prototype,
    'createView',
    M.Plugin.prototype.createView);

goog.exportSymbol(
    'M.Popup',
    M.Popup);

goog.exportProperty(
    M.Popup.prototype,
    'getTabs',
    M.Popup.prototype.getTabs);

goog.exportProperty(
    M.Popup.prototype,
    'removeTab',
    M.Popup.prototype.removeTab);

goog.exportProperty(
    M.Popup.prototype,
    'addTab',
    M.Popup.prototype.addTab);

goog.exportProperty(
    M.Popup.prototype,
    'addTo',
    M.Popup.prototype.addTo);

goog.exportProperty(
    M.Popup.prototype,
    'update',
    M.Popup.prototype.update);

goog.exportProperty(
    M.Popup.prototype,
    'show',
    M.Popup.prototype.show);

goog.exportProperty(
    M.Popup.prototype,
    'hide',
    M.Popup.prototype.hide);

goog.exportProperty(
    M.Popup.prototype,
    'switchTab',
    M.Popup.prototype.switchTab);

goog.exportProperty(
    M.Popup.prototype,
    'getCoordinate',
    M.Popup.prototype.getCoordinate);

goog.exportProperty(
    M.Popup.prototype,
    'setCoordinate',
    M.Popup.prototype.setCoordinate);

goog.exportProperty(
    M.Popup.prototype,
    'destroy',
    M.Popup.prototype.destroy);

goog.exportSymbol(
    'M.Popup.TEMPLATE',
    M.Popup.TEMPLATE);

goog.exportSymbol(
    'M.Popup.status',
    M.Popup.status);

goog.exportSymbol(
    'M.Popup.status.COLLAPSED',
    M.Popup.status.COLLAPSED);

goog.exportSymbol(
    'M.Popup.status.DEFAULT',
    M.Popup.status.DEFAULT);

goog.exportSymbol(
    'M.Popup.status.FULL',
    M.Popup.status.FULL);

goog.exportProperty(
    M.Popup.Tab.prototype,
    'icon',
    M.Popup.Tab.prototype.icon);

goog.exportProperty(
    M.Popup.Tab.prototype,
    'title',
    M.Popup.Tab.prototype.title);

goog.exportProperty(
    M.Popup.Tab.prototype,
    'content',
    M.Popup.Tab.prototype.content);

goog.exportSymbol(
    'M.impl.Map',
    M.impl.Map);

goog.exportProperty(
    M.impl.Map.prototype,
    'getLayers',
    M.impl.Map.prototype.getLayers);

goog.exportProperty(
    M.impl.Map.prototype,
    'getBaseLayers',
    M.impl.Map.prototype.getBaseLayers);

goog.exportProperty(
    M.impl.Map.prototype,
    'removeLayers',
    M.impl.Map.prototype.removeLayers);

goog.exportProperty(
    M.impl.Map.prototype,
    'getWMC',
    M.impl.Map.prototype.getWMC);

goog.exportProperty(
    M.impl.Map.prototype,
    'addWMC',
    M.impl.Map.prototype.addWMC);

goog.exportProperty(
    M.impl.Map.prototype,
    'removeWMC',
    M.impl.Map.prototype.removeWMC);

goog.exportProperty(
    M.impl.Map.prototype,
    'getKML',
    M.impl.Map.prototype.getKML);

goog.exportProperty(
    M.impl.Map.prototype,
    'addKML',
    M.impl.Map.prototype.addKML);

goog.exportProperty(
    M.impl.Map.prototype,
    'removeKML',
    M.impl.Map.prototype.removeKML);

goog.exportProperty(
    M.impl.Map.prototype,
    'getWMS',
    M.impl.Map.prototype.getWMS);

goog.exportProperty(
    M.impl.Map.prototype,
    'addWMS',
    M.impl.Map.prototype.addWMS);

goog.exportProperty(
    M.impl.Map.prototype,
    'removeWMS',
    M.impl.Map.prototype.removeWMS);

goog.exportProperty(
    M.impl.Map.prototype,
    'getWFS',
    M.impl.Map.prototype.getWFS);

goog.exportProperty(
    M.impl.Map.prototype,
    'addWFS',
    M.impl.Map.prototype.addWFS);

goog.exportProperty(
    M.impl.Map.prototype,
    'removeWFS',
    M.impl.Map.prototype.removeWFS);

goog.exportProperty(
    M.impl.Map.prototype,
    'getWMTS',
    M.impl.Map.prototype.getWMTS);

goog.exportProperty(
    M.impl.Map.prototype,
    'addWMTS',
    M.impl.Map.prototype.addWMTS);

goog.exportProperty(
    M.impl.Map.prototype,
    'removeWMTS',
    M.impl.Map.prototype.removeWMTS);

goog.exportProperty(
    M.impl.Map.prototype,
    'getMBtiles',
    M.impl.Map.prototype.getMBtiles);

goog.exportProperty(
    M.impl.Map.prototype,
    'addMBtiles',
    M.impl.Map.prototype.addMBtiles);

goog.exportProperty(
    M.impl.Map.prototype,
    'removeMBtiles',
    M.impl.Map.prototype.removeMBtiles);

goog.exportProperty(
    M.impl.Map.prototype,
    'getControls',
    M.impl.Map.prototype.getControls);

goog.exportProperty(
    M.impl.Map.prototype,
    'addControls',
    M.impl.Map.prototype.addControls);

goog.exportProperty(
    M.impl.Map.prototype,
    'removeControls',
    M.impl.Map.prototype.removeControls);

goog.exportProperty(
    M.impl.Map.prototype,
    'setMaxExtent',
    M.impl.Map.prototype.setMaxExtent);

goog.exportProperty(
    M.impl.Map.prototype,
    'getMaxExtent',
    M.impl.Map.prototype.getMaxExtent);

goog.exportProperty(
    M.impl.Map.prototype,
    'setBbox',
    M.impl.Map.prototype.setBbox);

goog.exportProperty(
    M.impl.Map.prototype,
    'getBbox',
    M.impl.Map.prototype.getBbox);

goog.exportProperty(
    M.impl.Map.prototype,
    'setZoom',
    M.impl.Map.prototype.setZoom);

goog.exportProperty(
    M.impl.Map.prototype,
    'getZoom',
    M.impl.Map.prototype.getZoom);

goog.exportProperty(
    M.impl.Map.prototype,
    'setCenter',
    M.impl.Map.prototype.setCenter);

goog.exportProperty(
    M.impl.Map.prototype,
    'getCenter',
    M.impl.Map.prototype.getCenter);

goog.exportProperty(
    M.impl.Map.prototype,
    'getScale',
    M.impl.Map.prototype.getScale);

goog.exportProperty(
    M.impl.Map.prototype,
    'setProjection',
    M.impl.Map.prototype.setProjection);

goog.exportProperty(
    M.impl.Map.prototype,
    'getProjection',
    M.impl.Map.prototype.getProjection);

goog.exportProperty(
    M.impl.Map.prototype,
    'getMapImpl',
    M.impl.Map.prototype.getMapImpl);

goog.exportProperty(
    M.impl.Map.prototype,
    'getEnvolvedExtent',
    M.impl.Map.prototype.getEnvolvedExtent);

goog.exportProperty(
    M.impl.Map.prototype,
    'destroy',
    M.impl.Map.prototype.destroy);

goog.exportProperty(
    M.impl.Map.prototype,
    'setFacadeMap',
    M.impl.Map.prototype.setFacadeMap);

goog.exportProperty(
    M.impl.Map.prototype,
    'getContainer',
    M.impl.Map.prototype.getContainer);

goog.exportProperty(
    M.impl.Map.prototype,
    'getEnvolvedExtent',
    M.impl.Map.prototype.getEnvolvedExtent);

goog.exportProperty(
    Array.prototype,
    'forEach',
    Array.prototype.forEach);

goog.exportProperty(
    Array.prototype,
    'filter',
    Array.prototype.filter);

goog.exportProperty(
    Array.prototype,
    'includes',
    Array.prototype.includes);

goog.exportProperty(
    Array.prototype,
    'remove',
    Array.prototype.remove);

goog.exportProperty(
    Array.prototype,
    'map',
    Array.prototype.map);

goog.exportSymbol(
    'Object.equals',
    Object.equals);

goog.exportSymbol(
    'M.remote.get',
    M.remote.get);

goog.exportSymbol(
    'M.remote.post',
    M.remote.post);

goog.exportSymbol(
    'M.remote.Response',
    M.remote.Response);

goog.exportProperty(
    M.remote.Response.prototype,
    'text',
    M.remote.Response.prototype.text);

goog.exportProperty(
    M.remote.Response.prototype,
    'xml',
    M.remote.Response.prototype.xml);

goog.exportProperty(
    M.remote.Response.prototype,
    'headers',
    M.remote.Response.prototype.headers);

goog.exportProperty(
    M.remote.Response.prototype,
    'error',
    M.remote.Response.prototype.error);

goog.exportProperty(
    M.remote.Response.prototype,
    'code',
    M.remote.Response.prototype.code);

goog.exportProperty(
    M.remote.Response.prototype,
    'parseXmlHttp',
    M.remote.Response.prototype.parseXmlHttp);

goog.exportProperty(
    M.remote.Response.prototype,
    'parseProxy',
    M.remote.Response.prototype.parseProxy);

goog.exportSymbol(
    'M.remote.method.GET',
    M.remote.method.GET);

goog.exportSymbol(
    'M.remote.method.POST',
    M.remote.method.POST);

goog.exportSymbol(
    'M.template.compile',
    M.template.compile);

goog.exportSymbol(
    'M.template.get',
    M.template.get);

goog.exportSymbol(
    'M.utils.isNullOrEmpty',
    M.utils.isNullOrEmpty);

goog.exportSymbol(
    'M.utils.isNull',
    M.utils.isNull);

goog.exportSymbol(
    'M.utils.isArray',
    M.utils.isArray);

goog.exportSymbol(
    'M.utils.isFunction',
    M.utils.isFunction);

goog.exportSymbol(
    'M.utils.isObject',
    M.utils.isObject);

goog.exportSymbol(
    'M.utils.isString',
    M.utils.isString);

goog.exportSymbol(
    'M.utils.isBoolean',
    M.utils.isBoolean);

goog.exportSymbol(
    'M.utils.isUrl',
    M.utils.isUrl);

goog.exportSymbol(
    'M.utils.isUndefined',
    M.utils.isUndefined);

goog.exportSymbol(
    'M.utils.normalize',
    M.utils.normalize);

goog.exportSymbol(
    'M.utils.getParameterValue',
    M.utils.getParameterValue);

goog.exportSymbol(
    'M.utils.addParameters',
    M.utils.addParameters);

goog.exportSymbol(
    'M.utils.generateRandom',
    M.utils.generateRandom);

goog.exportSymbol(
    'M.utils.getWMSGetCapabilitiesUrl',
    M.utils.getWMSGetCapabilitiesUrl);

goog.exportSymbol(
    'M.utils.getWMTSGetCapabilitiesUrl',
    M.utils.getWMTSGetCapabilitiesUrl);

goog.exportSymbol(
    'M.utils.generateResolutionsFromScales',
    M.utils.generateResolutionsFromScales);

goog.exportSymbol(
    'M.utils.generateResolutionsFromExtent',
    M.utils.generateResolutionsFromExtent);

goog.exportSymbol(
    'M.utils.fillResolutions',
    M.utils.fillResolutions);

goog.exportSymbol(
    'M.utils.getResolutionFromScale',
    M.utils.getResolutionFromScale);

goog.exportSymbol(
    'M.utils.getScaleFromResolution',
    M.utils.getScaleFromResolution);

goog.exportSymbol(
    'M.utils.stringToHtml',
    M.utils.stringToHtml);

goog.exportSymbol(
    'M.utils.htmlToString',
    M.utils.htmlToString);

goog.exportSymbol(
    'M.utils.beautifyString',
    M.utils.beautifyString);

goog.exportSymbol(
    'M.utils.beautifyAttribute',
    M.utils.beautifyAttribute);

goog.exportSymbol(
    'M.utils.beautifyAttributeName',
    M.utils.beautifyAttributeName);

goog.exportSymbol(
    'M.utils.concatUrlPaths',
    M.utils.concatUrlPaths);

goog.exportSymbol(
    'M.utils.includes',
    M.utils.includes);

goog.exportSymbol(
    'M.utils.extend',
    M.utils.extend);

goog.exportSymbol(
    'M.utils.escapeXSS',
    M.utils.escapeXSS);

goog.exportSymbol(
    'M.utils.escapeJSCode',
    M.utils.escapeJSCode);

goog.exportSymbol(
    'M.utils.enableTouchScroll',
    M.utils.enableTouchScroll);

goog.exportSymbol(
    'M.utils.rgbToHex',
    M.utils.rgbToHex);

goog.exportSymbol(
    'M.utils.getOpacityFromRgba',
    M.utils.getOpacityFromRgba);

goog.exportSymbol(
    'M.utils.sameUrl',
    M.utils.sameUrl);

goog.exportSymbol(
    'M.utils.isGeometryType',
    M.utils.isGeometryType);

goog.exportSymbol(
    'M.window.WIDTH',
    M.window.WIDTH);

goog.exportSymbol(
    'M.window.HEIGHT',
    M.window.HEIGHT);

goog.exportSymbol(
    'M.ui.Panel',
    M.ui.Panel);

goog.exportProperty(
    M.ui.Panel.prototype,
    'name',
    M.ui.Panel.prototype.name);

goog.exportProperty(
    M.ui.Panel.prototype,
    'position',
    M.ui.Panel.prototype.position);

goog.exportProperty(
    M.ui.Panel.prototype,
    'destroy',
    M.ui.Panel.prototype.destroy);

goog.exportProperty(
    M.ui.Panel.prototype,
    'addTo',
    M.ui.Panel.prototype.addTo);

goog.exportProperty(
    M.ui.Panel.prototype,
    'getControls',
    M.ui.Panel.prototype.getControls);

goog.exportProperty(
    M.ui.Panel.prototype,
    'addControls',
    M.ui.Panel.prototype.addControls);

goog.exportProperty(
    M.ui.Panel.prototype,
    'hasControl',
    M.ui.Panel.prototype.hasControl);

goog.exportProperty(
    M.ui.Panel.prototype,
    'removeControls',
    M.ui.Panel.prototype.removeControls);

goog.exportProperty(
    M.ui.Panel.prototype,
    '_removeControl',
    M.ui.Panel.prototype._removeControl);

goog.exportProperty(
    M.ui.Panel.prototype,
    'removeClassName',
    M.ui.Panel.prototype.removeClassName);

goog.exportProperty(
    M.ui.Panel.prototype,
    'addClassName',
    M.ui.Panel.prototype.addClassName);

goog.exportProperty(
    M.ui.Panel.prototype,
    '_moveControlView',
    M.ui.Panel.prototype._moveControlView);

goog.exportProperty(
    M.ui.Panel.prototype,
    '_manageActivation',
    M.ui.Panel.prototype._manageActivation);

goog.exportProperty(
    M.ui.Panel.prototype,
    'equals',
    M.ui.Panel.prototype.equals);

goog.exportSymbol(
    'M.ui.Panel.TEMPLATE',
    M.ui.Panel.TEMPLATE);

goog.exportSymbol(
    'M.impl.Layer',
    M.impl.Layer);

goog.exportProperty(
    M.impl.Layer.prototype,
    'isVisible',
    M.impl.Layer.prototype.isVisible);

goog.exportProperty(
    M.impl.Layer.prototype,
    'isQueryable',
    M.impl.Layer.prototype.isQueryable);

goog.exportProperty(
    M.impl.Layer.prototype,
    'inRange',
    M.impl.Layer.prototype.inRange);

goog.exportProperty(
    M.impl.Layer.prototype,
    'setVisible',
    M.impl.Layer.prototype.setVisible);

goog.exportProperty(
    M.impl.Layer.prototype,
    'getZIndex',
    M.impl.Layer.prototype.getZIndex);

goog.exportProperty(
    M.impl.Layer.prototype,
    'setZIndex',
    M.impl.Layer.prototype.setZIndex);

goog.exportProperty(
    M.impl.Layer.prototype,
    'getOpacity',
    M.impl.Layer.prototype.getOpacity);

goog.exportProperty(
    M.impl.Layer.prototype,
    'setOpacity',
    M.impl.Layer.prototype.setOpacity);

goog.exportProperty(
    M.impl.Layer.prototype,
    'getLegendURL',
    M.impl.Layer.prototype.getLegendURL);

goog.exportProperty(
    M.impl.Layer.prototype,
    'setLegendURL',
    M.impl.Layer.prototype.setLegendURL);

goog.exportProperty(
    M.impl.Layer.prototype,
    'getNumZoomLevels',
    M.impl.Layer.prototype.getNumZoomLevels);

goog.exportProperty(
    M.impl.Layer.prototype,
    'unselectFeatures',
    M.impl.Layer.prototype.unselectFeatures);

goog.exportProperty(
    M.impl.Layer.prototype,
    'selectFeatures',
    M.impl.Layer.prototype.selectFeatures);

goog.exportSymbol(
    'M.ui.position.TL',
    M.ui.position.TL);

goog.exportSymbol(
    'M.ui.position.TR',
    M.ui.position.TR);

goog.exportSymbol(
    'M.ui.position.BL',
    M.ui.position.BL);

goog.exportSymbol(
    'M.ui.position.BR',
    M.ui.position.BR);

goog.exportSymbol(
    'M.impl.layer.OSM',
    M.impl.layer.OSM);

goog.exportProperty(
    M.impl.layer.OSM.prototype,
    'addTo',
    M.impl.layer.OSM.prototype.addTo);

goog.exportProperty(
    M.impl.layer.OSM.prototype,
    'setResolutions',
    M.impl.layer.OSM.prototype.setResolutions);

goog.exportProperty(
    M.impl.layer.OSM.prototype,
    'getExtent',
    M.impl.layer.OSM.prototype.getExtent);

goog.exportProperty(
    M.impl.layer.OSM.prototype,
    'destroy',
    M.impl.layer.OSM.prototype.destroy);

goog.exportProperty(
    M.impl.layer.OSM.prototype,
    'equals',
    M.impl.layer.OSM.prototype.equals);

goog.exportSymbol(
    'M.style.state.DEFAULT',
    M.style.state.DEFAULT);

goog.exportSymbol(
    'M.style.state.NEW',
    M.style.state.NEW);

goog.exportSymbol(
    'M.style.state.SELECTED',
    M.style.state.SELECTED);

goog.exportSymbol(
    'M.impl.control.Panzoom',
    M.impl.control.Panzoom);

goog.exportProperty(
    M.impl.control.Panzoom.prototype,
    'addTo',
    M.impl.control.Panzoom.prototype.addTo);

goog.exportProperty(
    M.impl.control.Panzoom.prototype,
    'getElement',
    M.impl.control.Panzoom.prototype.getElement);

goog.exportProperty(
    M.impl.control.Panzoom.prototype,
    'destroy',
    M.impl.control.Panzoom.prototype.destroy);

goog.exportSymbol(
    'M.parameter.center',
    M.parameter.center);

goog.exportSymbol(
    'M.parameter.layer',
    M.parameter.layer);

goog.exportSymbol(
    'M.parameter.maxExtent',
    M.parameter.maxExtent);

goog.exportSymbol(
    'M.Parameters',
    M.Parameters);

goog.exportProperty(
    M.Parameters.prototype,
    'container',
    M.Parameters.prototype.container);

goog.exportProperty(
    M.Parameters.prototype,
    'layers',
    M.Parameters.prototype.layers);

goog.exportProperty(
    M.Parameters.prototype,
    'wmc',
    M.Parameters.prototype.wmc);

goog.exportProperty(
    M.Parameters.prototype,
    'wms',
    M.Parameters.prototype.wms);

goog.exportProperty(
    M.Parameters.prototype,
    'wmts',
    M.Parameters.prototype.wmts);

goog.exportProperty(
    M.Parameters.prototype,
    'kml',
    M.Parameters.prototype.kml);

goog.exportProperty(
    M.Parameters.prototype,
    'controls',
    M.Parameters.prototype.controls);

goog.exportProperty(
    M.Parameters.prototype,
    'getfeatureinfo',
    M.Parameters.prototype.getfeatureinfo);

goog.exportProperty(
    M.Parameters.prototype,
    'maxExtent',
    M.Parameters.prototype.maxExtent);

goog.exportProperty(
    M.Parameters.prototype,
    'bbox',
    M.Parameters.prototype.bbox);

goog.exportProperty(
    M.Parameters.prototype,
    'zoom',
    M.Parameters.prototype.zoom);

goog.exportProperty(
    M.Parameters.prototype,
    'center',
    M.Parameters.prototype.center);

goog.exportProperty(
    M.Parameters.prototype,
    'resolutions',
    M.Parameters.prototype.resolutions);

goog.exportProperty(
    M.Parameters.prototype,
    'projection',
    M.Parameters.prototype.projection);

goog.exportProperty(
    M.Parameters.prototype,
    'label',
    M.Parameters.prototype.label);

goog.exportProperty(
    M.Parameters.prototype,
    'ticket',
    M.Parameters.prototype.ticket);

goog.exportSymbol(
    'M.parameter.projection',
    M.parameter.projection);

goog.exportSymbol(
    'M.parameter.resolutions',
    M.parameter.resolutions);

goog.exportSymbol(
    'M.parameter.zoom',
    M.parameter.zoom);

goog.exportSymbol(
    'M.parameter.kml',
    M.parameter.kml);

goog.exportSymbol(
    'M.parameter.osm',
    M.parameter.osm);

goog.exportSymbol(
    'M.parameter.wfs',
    M.parameter.wfs);

goog.exportSymbol(
    'M.parameter.wmc',
    M.parameter.wmc);

goog.exportSymbol(
    'M.parameter.wms',
    M.parameter.wms);

goog.exportSymbol(
    'M.parameter.wmts',
    M.parameter.wmts);

goog.exportSymbol(
    'M.Map',
    M.Map);

goog.exportProperty(
    M.Map.prototype,
    '_defaultProj',
    M.Map.prototype._defaultProj);

goog.exportProperty(
    M.Map.prototype,
    'panel',
    M.Map.prototype.panel);

goog.exportProperty(
    M.Map.prototype,
    'getLayers',
    M.Map.prototype.getLayers);

goog.exportProperty(
    M.Map.prototype,
    'getBaseLayers',
    M.Map.prototype.getBaseLayers);

goog.exportProperty(
    M.Map.prototype,
    'addLayers',
    M.Map.prototype.addLayers);

goog.exportProperty(
    M.Map.prototype,
    'removeLayers',
    M.Map.prototype.removeLayers);

goog.exportProperty(
    M.Map.prototype,
    'getWMC',
    M.Map.prototype.getWMC);

goog.exportProperty(
    M.Map.prototype,
    'addWMC',
    M.Map.prototype.addWMC);

goog.exportProperty(
    M.Map.prototype,
    'removeWMC',
    M.Map.prototype.removeWMC);

goog.exportProperty(
    M.Map.prototype,
    'getKML',
    M.Map.prototype.getKML);

goog.exportProperty(
    M.Map.prototype,
    'addKML',
    M.Map.prototype.addKML);

goog.exportProperty(
    M.Map.prototype,
    'removeKML',
    M.Map.prototype.removeKML);

goog.exportProperty(
    M.Map.prototype,
    'getWMS',
    M.Map.prototype.getWMS);

goog.exportProperty(
    M.Map.prototype,
    'addWMS',
    M.Map.prototype.addWMS);

goog.exportProperty(
    M.Map.prototype,
    'removeWMS',
    M.Map.prototype.removeWMS);

goog.exportProperty(
    M.Map.prototype,
    'getWFS',
    M.Map.prototype.getWFS);

goog.exportProperty(
    M.Map.prototype,
    'addWFS',
    M.Map.prototype.addWFS);

goog.exportProperty(
    M.Map.prototype,
    'removeWFS',
    M.Map.prototype.removeWFS);

goog.exportProperty(
    M.Map.prototype,
    'getWMTS',
    M.Map.prototype.getWMTS);

goog.exportProperty(
    M.Map.prototype,
    'addWMTS',
    M.Map.prototype.addWMTS);

goog.exportProperty(
    M.Map.prototype,
    'removeWMTS',
    M.Map.prototype.removeWMTS);

goog.exportProperty(
    M.Map.prototype,
    'getMBtiles',
    M.Map.prototype.getMBtiles);

goog.exportProperty(
    M.Map.prototype,
    'addMBtiles',
    M.Map.prototype.addMBtiles);

goog.exportProperty(
    M.Map.prototype,
    'removeMBtiles',
    M.Map.prototype.removeMBtiles);

goog.exportProperty(
    M.Map.prototype,
    'getControls',
    M.Map.prototype.getControls);

goog.exportProperty(
    M.Map.prototype,
    'removeControls',
    M.Map.prototype.removeControls);

goog.exportProperty(
    M.Map.prototype,
    'getMaxExtent',
    M.Map.prototype.getMaxExtent);

goog.exportProperty(
    M.Map.prototype,
    'setMaxExtent',
    M.Map.prototype.setMaxExtent);

goog.exportProperty(
    M.Map.prototype,
    'getBbox',
    M.Map.prototype.getBbox);

goog.exportProperty(
    M.Map.prototype,
    'setBbox',
    M.Map.prototype.setBbox);

goog.exportProperty(
    M.Map.prototype,
    'getZoom',
    M.Map.prototype.getZoom);

goog.exportProperty(
    M.Map.prototype,
    'setZoom',
    M.Map.prototype.setZoom);

goog.exportProperty(
    M.Map.prototype,
    'getCenter',
    M.Map.prototype.getCenter);

goog.exportProperty(
    M.Map.prototype,
    'setCenter',
    M.Map.prototype.setCenter);

goog.exportProperty(
    M.Map.prototype,
    'getResolutions',
    M.Map.prototype.getResolutions);

goog.exportProperty(
    M.Map.prototype,
    'setResolutions',
    M.Map.prototype.setResolutions);

goog.exportProperty(
    M.Map.prototype,
    'getScale',
    M.Map.prototype.getScale);

goog.exportProperty(
    M.Map.prototype,
    'getProjection',
    M.Map.prototype.getProjection);

goog.exportProperty(
    M.Map.prototype,
    'setProjection',
    M.Map.prototype.setProjection);

goog.exportProperty(
    M.Map.prototype,
    'getPlugins',
    M.Map.prototype.getPlugins);

goog.exportProperty(
    M.Map.prototype,
    'addPlugin',
    M.Map.prototype.addPlugin);

goog.exportProperty(
    M.Map.prototype,
    'removePlugins',
    M.Map.prototype.removePlugins);

goog.exportProperty(
    M.Map.prototype,
    'getEnvolvedExtent',
    M.Map.prototype.getEnvolvedExtent);

goog.exportProperty(
    M.Map.prototype,
    'zoomToMaxExtent',
    M.Map.prototype.zoomToMaxExtent);

goog.exportProperty(
    M.Map.prototype,
    'setTicket',
    M.Map.prototype.setTicket);

goog.exportProperty(
    M.Map.prototype,
    'destroy',
    M.Map.prototype.destroy);

goog.exportProperty(
    M.Map.prototype,
    'addLabel',
    M.Map.prototype.addLabel);

goog.exportProperty(
    M.Map.prototype,
    'getLabel',
    M.Map.prototype.getLabel);

goog.exportProperty(
    M.Map.prototype,
    'removeLabel',
    M.Map.prototype.removeLabel);

goog.exportProperty(
    M.Map.prototype,
    'drawPoints',
    M.Map.prototype.drawPoints);

goog.exportProperty(
    M.Map.prototype,
    'addPanels',
    M.Map.prototype.addPanels);

goog.exportProperty(
    M.Map.prototype,
    'removePanel',
    M.Map.prototype.removePanel);

goog.exportProperty(
    M.Map.prototype,
    'getPanels',
    M.Map.prototype.getPanels);

goog.exportProperty(
    M.Map.prototype,
    'getContainer',
    M.Map.prototype.getContainer);

goog.exportProperty(
    M.Map.prototype,
    'getPoints',
    M.Map.prototype.getPoints);

goog.exportProperty(
    M.Map.prototype,
    'getMapImpl',
    M.Map.prototype.getMapImpl);

goog.exportProperty(
    M.Map.prototype,
    'getPopup',
    M.Map.prototype.getPopup);

goog.exportProperty(
    M.Map.prototype,
    'removePopup',
    M.Map.prototype.removePopup);

goog.exportProperty(
    M.Map.prototype,
    'addPopup',
    M.Map.prototype.addPopup);

goog.exportSymbol(
    'M.Map.LAYER_SORT',
    M.Map.LAYER_SORT);

goog.exportSymbol(
    'M.layer.GeoJSON',
    M.layer.GeoJSON);

goog.exportProperty(
    M.layer.GeoJSON.prototype,
    'equals',
    M.layer.GeoJSON.prototype.equals);

goog.exportSymbol(
    'M.layer.GeoJSON.POPUP_TEMPLATE',
    M.layer.GeoJSON.POPUP_TEMPLATE);

goog.exportSymbol(
    'M.layer.KML',
    M.layer.KML);

goog.exportProperty(
    M.layer.KML.prototype,
    'equals',
    M.layer.KML.prototype.equals);

goog.exportSymbol(
    'M.layer.KML.POPUP_TEMPLATE',
    M.layer.KML.POPUP_TEMPLATE);

goog.exportSymbol(
    'M.Layer',
    M.Layer);

goog.exportProperty(
    M.Layer.prototype,
    'isVisible',
    M.Layer.prototype.isVisible);

goog.exportProperty(
    M.Layer.prototype,
    'isQueryable',
    M.Layer.prototype.isQueryable);

goog.exportProperty(
    M.Layer.prototype,
    'setVisible',
    M.Layer.prototype.setVisible);

goog.exportProperty(
    M.Layer.prototype,
    'inRange',
    M.Layer.prototype.inRange);

goog.exportProperty(
    M.Layer.prototype,
    'getLegendURL',
    M.Layer.prototype.getLegendURL);

goog.exportProperty(
    M.Layer.prototype,
    'setLegendURL',
    M.Layer.prototype.setLegendURL);

goog.exportProperty(
    M.Layer.prototype,
    'getZIndex',
    M.Layer.prototype.getZIndex);

goog.exportProperty(
    M.Layer.prototype,
    'setZIndex',
    M.Layer.prototype.setZIndex);

goog.exportProperty(
    M.Layer.prototype,
    'getOpacity',
    M.Layer.prototype.getOpacity);

goog.exportProperty(
    M.Layer.prototype,
    'setOpacity',
    M.Layer.prototype.setOpacity);

goog.exportSymbol(
    'M.Layer.LEGEND_DEFAULT',
    M.Layer.LEGEND_DEFAULT);

goog.exportSymbol(
    'M.Layer.LEGEND_ERROR',
    M.Layer.LEGEND_ERROR);

goog.exportSymbol(
    'M.layer.type.WMC',
    M.layer.type.WMC);

goog.exportSymbol(
    'M.layer.type.KML',
    M.layer.type.KML);

goog.exportSymbol(
    'M.layer.type.WMS',
    M.layer.type.WMS);

goog.exportSymbol(
    'M.layer.type.WFS',
    M.layer.type.WFS);

goog.exportSymbol(
    'M.layer.type.WMTS',
    M.layer.type.WMTS);

goog.exportSymbol(
    'M.layer.type.MBtiles',
    M.layer.type.MBtiles);

goog.exportSymbol(
    'M.layer.type.OSM',
    M.layer.type.OSM);

goog.exportSymbol(
    'M.layer.type.GeoJSON',
    M.layer.type.GeoJSON);

goog.exportSymbol(
    'M.layer.OSM',
    M.layer.OSM);

goog.exportProperty(
    M.layer.OSM.prototype,
    'equals',
    M.layer.OSM.prototype.equals);

goog.exportSymbol(
    'M.layer.WFS',
    M.layer.WFS);

goog.exportProperty(
    M.layer.WFS.prototype,
    'equals',
    M.layer.WFS.prototype.equals);

goog.exportSymbol(
    'M.layer.WMC',
    M.layer.WMC);

goog.exportProperty(
    M.layer.WMC.prototype,
    'select',
    M.layer.WMC.prototype.select);

goog.exportProperty(
    M.layer.WMC.prototype,
    'unselect',
    M.layer.WMC.prototype.unselect);

goog.exportProperty(
    M.layer.WMC.prototype,
    'equals',
    M.layer.WMC.prototype.equals);

goog.exportSymbol(
    'M.layer.WMS',
    M.layer.WMS);

goog.exportProperty(
    M.layer.WMS.prototype,
    'getNoChacheUrl',
    M.layer.WMS.prototype.getNoChacheUrl);

goog.exportProperty(
    M.layer.WMS.prototype,
    'getNoChacheName',
    M.layer.WMS.prototype.getNoChacheName);

goog.exportProperty(
    M.layer.WMS.prototype,
    'equals',
    M.layer.WMS.prototype.equals);

goog.exportSymbol(
    'M.layer.WMTS',
    M.layer.WMTS);

goog.exportProperty(
    M.layer.WMTS.prototype,
    'equals',
    M.layer.WMTS.prototype.equals);

goog.exportSymbol(
    'M.exception',
    M.exception);

goog.exportSymbol(
    'M.Control',
    M.Control);

goog.exportProperty(
    M.Control.prototype,
    'name',
    M.Control.prototype.name);

goog.exportProperty(
    M.Control.prototype,
    'activated',
    M.Control.prototype.activated);

goog.exportProperty(
    M.Control.prototype,
    'setImpl',
    M.Control.prototype.setImpl);

goog.exportProperty(
    M.Control.prototype,
    'addTo',
    M.Control.prototype.addTo);

goog.exportProperty(
    M.Control.prototype,
    'createView',
    M.Control.prototype.createView);

goog.exportProperty(
    M.Control.prototype,
    'manageActivation',
    M.Control.prototype.manageActivation);

goog.exportProperty(
    M.Control.prototype,
    'getActivationButton',
    M.Control.prototype.getActivationButton);

goog.exportProperty(
    M.Control.prototype,
    'activate',
    M.Control.prototype.activate);

goog.exportProperty(
    M.Control.prototype,
    'deactivate',
    M.Control.prototype.deactivate);

goog.exportProperty(
    M.Control.prototype,
    'getElement',
    M.Control.prototype.getElement);

goog.exportProperty(
    M.Control.prototype,
    'setPanel',
    M.Control.prototype.setPanel);

goog.exportProperty(
    M.Control.prototype,
    'getPanel',
    M.Control.prototype.getPanel);

goog.exportSymbol(
    'M.control.GetFeatureInfo',
    M.control.GetFeatureInfo);

goog.exportProperty(
    M.control.GetFeatureInfo.prototype,
    'createView',
    M.control.GetFeatureInfo.prototype.createView);

goog.exportProperty(
    M.control.GetFeatureInfo.prototype,
    'getActivationButton',
    M.control.GetFeatureInfo.prototype.getActivationButton);

goog.exportProperty(
    M.control.GetFeatureInfo.prototype,
    'equals',
    M.control.GetFeatureInfo.prototype.equals);

goog.exportSymbol(
    'M.control.GetFeatureInfo.NAME',
    M.control.GetFeatureInfo.NAME);

goog.exportSymbol(
    'M.control.GetFeatureInfo.POPUP_TITLE',
    M.control.GetFeatureInfo.POPUP_TITLE);

goog.exportSymbol(
    'M.control.GetFeatureInfo.TEMPLATE',
    M.control.GetFeatureInfo.TEMPLATE);

goog.exportSymbol(
    'M.control.GetFeatureInfo.POPUP_TEMPLATE',
    M.control.GetFeatureInfo.POPUP_TEMPLATE);

goog.exportSymbol(
    'M.control.LayerSwitcher',
    M.control.LayerSwitcher);

goog.exportProperty(
    M.control.LayerSwitcher.prototype,
    'createView',
    M.control.LayerSwitcher.prototype.createView);

goog.exportProperty(
    M.control.LayerSwitcher.prototype,
    'equals',
    M.control.LayerSwitcher.prototype.equals);

goog.exportProperty(
    M.control.LayerSwitcher.prototype,
    'render',
    M.control.LayerSwitcher.prototype.render);

goog.exportProperty(
    M.control.LayerSwitcher.prototype,
    'registerEvents',
    M.control.LayerSwitcher.prototype.registerEvents);

goog.exportProperty(
    M.control.LayerSwitcher.prototype,
    'unregisterEvents',
    M.control.LayerSwitcher.prototype.unregisterEvents);

goog.exportSymbol(
    'M.control.LayerSwitcher.NAME',
    M.control.LayerSwitcher.NAME);

goog.exportSymbol(
    'M.control.LayerSwitcher.TEMPLATE',
    M.control.LayerSwitcher.TEMPLATE);

goog.exportSymbol(
    'M.control.Location',
    M.control.Location);

goog.exportProperty(
    M.control.Location.prototype,
    'createView',
    M.control.Location.prototype.createView);

goog.exportProperty(
    M.control.Location.prototype,
    'getActivationButton',
    M.control.Location.prototype.getActivationButton);

goog.exportProperty(
    M.control.Location.prototype,
    'equals',
    M.control.Location.prototype.equals);

goog.exportSymbol(
    'M.control.Location.NAME',
    M.control.Location.NAME);

goog.exportSymbol(
    'M.control.Location.TEMPLATE',
    M.control.Location.TEMPLATE);

goog.exportSymbol(
    'M.control.Mouse',
    M.control.Mouse);

goog.exportProperty(
    M.control.Mouse.prototype,
    'createView',
    M.control.Mouse.prototype.createView);

goog.exportProperty(
    M.control.Mouse.prototype,
    'equals',
    M.control.Mouse.prototype.equals);

goog.exportSymbol(
    'M.control.Mouse.NAME',
    M.control.Mouse.NAME);

goog.exportSymbol(
    'M.control.Mouse.TEMPLATE',
    M.control.Mouse.TEMPLATE);

goog.exportSymbol(
    'M.control.Navtoolbar',
    M.control.Navtoolbar);

goog.exportProperty(
    M.control.Navtoolbar.prototype,
    'createView',
    M.control.Navtoolbar.prototype.createView);

goog.exportProperty(
    M.control.Navtoolbar.prototype,
    'equals',
    M.control.Navtoolbar.prototype.equals);

goog.exportSymbol(
    'M.control.Navtoolbar.NAME',
    M.control.Navtoolbar.NAME);

goog.exportSymbol(
    'M.control.Navtoolbar.TEMPLATE',
    M.control.Navtoolbar.TEMPLATE);

goog.exportSymbol(
    'M.control.OverviewMap',
    M.control.OverviewMap);

goog.exportProperty(
    M.control.OverviewMap.prototype,
    'createView',
    M.control.OverviewMap.prototype.createView);

goog.exportProperty(
    M.control.OverviewMap.prototype,
    'equals',
    M.control.OverviewMap.prototype.equals);

goog.exportSymbol(
    'M.control.OverviewMap.NAME',
    M.control.OverviewMap.NAME);

goog.exportSymbol(
    'M.control.OverviewMap.TEMPLATE',
    M.control.OverviewMap.TEMPLATE);

goog.exportSymbol(
    'M.control.Panzoom',
    M.control.Panzoom);

goog.exportProperty(
    M.control.Panzoom.prototype,
    'createView',
    M.control.Panzoom.prototype.createView);

goog.exportProperty(
    M.control.Panzoom.prototype,
    'equals',
    M.control.Panzoom.prototype.equals);

goog.exportSymbol(
    'M.control.Panzoom.NAME',
    M.control.Panzoom.NAME);

goog.exportSymbol(
    'M.control.Panzoom.TEMPLATE',
    M.control.Panzoom.TEMPLATE);

goog.exportSymbol(
    'M.control.Panzoombar',
    M.control.Panzoombar);

goog.exportProperty(
    M.control.Panzoombar.prototype,
    'createView',
    M.control.Panzoombar.prototype.createView);

goog.exportProperty(
    M.control.Panzoombar.prototype,
    'equals',
    M.control.Panzoombar.prototype.equals);

goog.exportSymbol(
    'M.control.Panzoombar.NAME',
    M.control.Panzoombar.NAME);

goog.exportSymbol(
    'M.control.Panzoombar.TEMPLATE',
    M.control.Panzoombar.TEMPLATE);

goog.exportSymbol(
    'M.control.Scale',
    M.control.Scale);

goog.exportProperty(
    M.control.Scale.prototype,
    'createView',
    M.control.Scale.prototype.createView);

goog.exportProperty(
    M.control.Scale.prototype,
    'equals',
    M.control.Scale.prototype.equals);

goog.exportSymbol(
    'M.control.Scale.NAME',
    M.control.Scale.NAME);

goog.exportSymbol(
    'M.control.Scale.TEMPLATE',
    M.control.Scale.TEMPLATE);

goog.exportSymbol(
    'M.control.ScaleLine',
    M.control.ScaleLine);

goog.exportProperty(
    M.control.ScaleLine.prototype,
    'createView',
    M.control.ScaleLine.prototype.createView);

goog.exportProperty(
    M.control.ScaleLine.prototype,
    'equals',
    M.control.ScaleLine.prototype.equals);

goog.exportSymbol(
    'M.control.ScaleLine.NAME',
    M.control.ScaleLine.NAME);

goog.exportSymbol(
    'M.control.ScaleLine.TEMPLATE',
    M.control.ScaleLine.TEMPLATE);

goog.exportSymbol(
    'M.control.WMCSelector',
    M.control.WMCSelector);

goog.exportProperty(
    M.control.WMCSelector.prototype,
    'createView',
    M.control.WMCSelector.prototype.createView);

goog.exportProperty(
    M.control.WMCSelector.prototype,
    'equals',
    M.control.WMCSelector.prototype.equals);

goog.exportSymbol(
    'M.control.WMCSelector.TEMPLATE',
    M.control.WMCSelector.TEMPLATE);

goog.exportProperty(
    M.facade.Base.prototype,
    'on',
    M.facade.Base.prototype.on);

goog.exportProperty(
    M.facade.Base.prototype,
    'un',
    M.facade.Base.prototype.un);

goog.exportProperty(
    M.facade.Base.prototype,
    'fire',
    M.facade.Base.prototype.fire);

goog.exportProperty(
    M.Label.prototype,
    'getImpl',
    M.Label.prototype.getImpl);

goog.exportProperty(
    M.Label.prototype,
    'setImpl',
    M.Label.prototype.setImpl);

goog.exportProperty(
    M.Label.prototype,
    'on',
    M.Label.prototype.on);

goog.exportProperty(
    M.Label.prototype,
    'un',
    M.Label.prototype.un);

goog.exportProperty(
    M.Label.prototype,
    'fire',
    M.Label.prototype.fire);

goog.exportProperty(
    M.Plugin.prototype,
    'getImpl',
    M.Plugin.prototype.getImpl);

goog.exportProperty(
    M.Plugin.prototype,
    'setImpl',
    M.Plugin.prototype.setImpl);

goog.exportProperty(
    M.Plugin.prototype,
    'on',
    M.Plugin.prototype.on);

goog.exportProperty(
    M.Plugin.prototype,
    'un',
    M.Plugin.prototype.un);

goog.exportProperty(
    M.Plugin.prototype,
    'fire',
    M.Plugin.prototype.fire);

goog.exportProperty(
    M.Popup.prototype,
    'getImpl',
    M.Popup.prototype.getImpl);

goog.exportProperty(
    M.Popup.prototype,
    'setImpl',
    M.Popup.prototype.setImpl);

goog.exportProperty(
    M.Popup.prototype,
    'on',
    M.Popup.prototype.on);

goog.exportProperty(
    M.Popup.prototype,
    'un',
    M.Popup.prototype.un);

goog.exportProperty(
    M.Popup.prototype,
    'fire',
    M.Popup.prototype.fire);

goog.exportProperty(
    M.remote.Response.prototype,
    'on',
    M.remote.Response.prototype.on);

goog.exportProperty(
    M.remote.Response.prototype,
    'un',
    M.remote.Response.prototype.un);

goog.exportProperty(
    M.remote.Response.prototype,
    'fire',
    M.remote.Response.prototype.fire);

goog.exportProperty(
    M.ui.Panel.prototype,
    'on',
    M.ui.Panel.prototype.on);

goog.exportProperty(
    M.ui.Panel.prototype,
    'un',
    M.ui.Panel.prototype.un);

goog.exportProperty(
    M.ui.Panel.prototype,
    'fire',
    M.ui.Panel.prototype.fire);

goog.exportProperty(
    M.impl.Layer.prototype,
    'getImpl',
    M.impl.Layer.prototype.getImpl);

goog.exportProperty(
    M.impl.Layer.prototype,
    'setImpl',
    M.impl.Layer.prototype.setImpl);

goog.exportProperty(
    M.impl.Layer.prototype,
    'on',
    M.impl.Layer.prototype.on);

goog.exportProperty(
    M.impl.Layer.prototype,
    'un',
    M.impl.Layer.prototype.un);

goog.exportProperty(
    M.impl.Layer.prototype,
    'fire',
    M.impl.Layer.prototype.fire);

goog.exportProperty(
    M.Map.prototype,
    'getImpl',
    M.Map.prototype.getImpl);

goog.exportProperty(
    M.Map.prototype,
    'setImpl',
    M.Map.prototype.setImpl);

goog.exportProperty(
    M.Map.prototype,
    'on',
    M.Map.prototype.on);

goog.exportProperty(
    M.Map.prototype,
    'un',
    M.Map.prototype.un);

goog.exportProperty(
    M.Map.prototype,
    'fire',
    M.Map.prototype.fire);

goog.exportProperty(
    M.Layer.prototype,
    'getImpl',
    M.Layer.prototype.getImpl);

goog.exportProperty(
    M.Layer.prototype,
    'setImpl',
    M.Layer.prototype.setImpl);

goog.exportProperty(
    M.Layer.prototype,
    'on',
    M.Layer.prototype.on);

goog.exportProperty(
    M.Layer.prototype,
    'un',
    M.Layer.prototype.un);

goog.exportProperty(
    M.Layer.prototype,
    'fire',
    M.Layer.prototype.fire);

goog.exportProperty(
    M.layer.GeoJSON.prototype,
    'isVisible',
    M.layer.GeoJSON.prototype.isVisible);

goog.exportProperty(
    M.layer.GeoJSON.prototype,
    'isQueryable',
    M.layer.GeoJSON.prototype.isQueryable);

goog.exportProperty(
    M.layer.GeoJSON.prototype,
    'setVisible',
    M.layer.GeoJSON.prototype.setVisible);

goog.exportProperty(
    M.layer.GeoJSON.prototype,
    'inRange',
    M.layer.GeoJSON.prototype.inRange);

goog.exportProperty(
    M.layer.GeoJSON.prototype,
    'getLegendURL',
    M.layer.GeoJSON.prototype.getLegendURL);

goog.exportProperty(
    M.layer.GeoJSON.prototype,
    'setLegendURL',
    M.layer.GeoJSON.prototype.setLegendURL);

goog.exportProperty(
    M.layer.GeoJSON.prototype,
    'getZIndex',
    M.layer.GeoJSON.prototype.getZIndex);

goog.exportProperty(
    M.layer.GeoJSON.prototype,
    'setZIndex',
    M.layer.GeoJSON.prototype.setZIndex);

goog.exportProperty(
    M.layer.GeoJSON.prototype,
    'getOpacity',
    M.layer.GeoJSON.prototype.getOpacity);

goog.exportProperty(
    M.layer.GeoJSON.prototype,
    'setOpacity',
    M.layer.GeoJSON.prototype.setOpacity);

goog.exportProperty(
    M.layer.GeoJSON.prototype,
    'getImpl',
    M.layer.GeoJSON.prototype.getImpl);

goog.exportProperty(
    M.layer.GeoJSON.prototype,
    'setImpl',
    M.layer.GeoJSON.prototype.setImpl);

goog.exportProperty(
    M.layer.GeoJSON.prototype,
    'on',
    M.layer.GeoJSON.prototype.on);

goog.exportProperty(
    M.layer.GeoJSON.prototype,
    'un',
    M.layer.GeoJSON.prototype.un);

goog.exportProperty(
    M.layer.GeoJSON.prototype,
    'fire',
    M.layer.GeoJSON.prototype.fire);

goog.exportProperty(
    M.layer.KML.prototype,
    'isVisible',
    M.layer.KML.prototype.isVisible);

goog.exportProperty(
    M.layer.KML.prototype,
    'isQueryable',
    M.layer.KML.prototype.isQueryable);

goog.exportProperty(
    M.layer.KML.prototype,
    'setVisible',
    M.layer.KML.prototype.setVisible);

goog.exportProperty(
    M.layer.KML.prototype,
    'inRange',
    M.layer.KML.prototype.inRange);

goog.exportProperty(
    M.layer.KML.prototype,
    'getLegendURL',
    M.layer.KML.prototype.getLegendURL);

goog.exportProperty(
    M.layer.KML.prototype,
    'setLegendURL',
    M.layer.KML.prototype.setLegendURL);

goog.exportProperty(
    M.layer.KML.prototype,
    'getZIndex',
    M.layer.KML.prototype.getZIndex);

goog.exportProperty(
    M.layer.KML.prototype,
    'setZIndex',
    M.layer.KML.prototype.setZIndex);

goog.exportProperty(
    M.layer.KML.prototype,
    'getOpacity',
    M.layer.KML.prototype.getOpacity);

goog.exportProperty(
    M.layer.KML.prototype,
    'setOpacity',
    M.layer.KML.prototype.setOpacity);

goog.exportProperty(
    M.layer.KML.prototype,
    'getImpl',
    M.layer.KML.prototype.getImpl);

goog.exportProperty(
    M.layer.KML.prototype,
    'setImpl',
    M.layer.KML.prototype.setImpl);

goog.exportProperty(
    M.layer.KML.prototype,
    'on',
    M.layer.KML.prototype.on);

goog.exportProperty(
    M.layer.KML.prototype,
    'un',
    M.layer.KML.prototype.un);

goog.exportProperty(
    M.layer.KML.prototype,
    'fire',
    M.layer.KML.prototype.fire);

goog.exportProperty(
    M.layer.OSM.prototype,
    'isVisible',
    M.layer.OSM.prototype.isVisible);

goog.exportProperty(
    M.layer.OSM.prototype,
    'isQueryable',
    M.layer.OSM.prototype.isQueryable);

goog.exportProperty(
    M.layer.OSM.prototype,
    'setVisible',
    M.layer.OSM.prototype.setVisible);

goog.exportProperty(
    M.layer.OSM.prototype,
    'inRange',
    M.layer.OSM.prototype.inRange);

goog.exportProperty(
    M.layer.OSM.prototype,
    'getLegendURL',
    M.layer.OSM.prototype.getLegendURL);

goog.exportProperty(
    M.layer.OSM.prototype,
    'setLegendURL',
    M.layer.OSM.prototype.setLegendURL);

goog.exportProperty(
    M.layer.OSM.prototype,
    'getZIndex',
    M.layer.OSM.prototype.getZIndex);

goog.exportProperty(
    M.layer.OSM.prototype,
    'setZIndex',
    M.layer.OSM.prototype.setZIndex);

goog.exportProperty(
    M.layer.OSM.prototype,
    'getOpacity',
    M.layer.OSM.prototype.getOpacity);

goog.exportProperty(
    M.layer.OSM.prototype,
    'setOpacity',
    M.layer.OSM.prototype.setOpacity);

goog.exportProperty(
    M.layer.OSM.prototype,
    'getImpl',
    M.layer.OSM.prototype.getImpl);

goog.exportProperty(
    M.layer.OSM.prototype,
    'setImpl',
    M.layer.OSM.prototype.setImpl);

goog.exportProperty(
    M.layer.OSM.prototype,
    'on',
    M.layer.OSM.prototype.on);

goog.exportProperty(
    M.layer.OSM.prototype,
    'un',
    M.layer.OSM.prototype.un);

goog.exportProperty(
    M.layer.OSM.prototype,
    'fire',
    M.layer.OSM.prototype.fire);

goog.exportProperty(
    M.layer.WFS.prototype,
    'isVisible',
    M.layer.WFS.prototype.isVisible);

goog.exportProperty(
    M.layer.WFS.prototype,
    'isQueryable',
    M.layer.WFS.prototype.isQueryable);

goog.exportProperty(
    M.layer.WFS.prototype,
    'setVisible',
    M.layer.WFS.prototype.setVisible);

goog.exportProperty(
    M.layer.WFS.prototype,
    'inRange',
    M.layer.WFS.prototype.inRange);

goog.exportProperty(
    M.layer.WFS.prototype,
    'getLegendURL',
    M.layer.WFS.prototype.getLegendURL);

goog.exportProperty(
    M.layer.WFS.prototype,
    'setLegendURL',
    M.layer.WFS.prototype.setLegendURL);

goog.exportProperty(
    M.layer.WFS.prototype,
    'getZIndex',
    M.layer.WFS.prototype.getZIndex);

goog.exportProperty(
    M.layer.WFS.prototype,
    'setZIndex',
    M.layer.WFS.prototype.setZIndex);

goog.exportProperty(
    M.layer.WFS.prototype,
    'getOpacity',
    M.layer.WFS.prototype.getOpacity);

goog.exportProperty(
    M.layer.WFS.prototype,
    'setOpacity',
    M.layer.WFS.prototype.setOpacity);

goog.exportProperty(
    M.layer.WFS.prototype,
    'getImpl',
    M.layer.WFS.prototype.getImpl);

goog.exportProperty(
    M.layer.WFS.prototype,
    'setImpl',
    M.layer.WFS.prototype.setImpl);

goog.exportProperty(
    M.layer.WFS.prototype,
    'on',
    M.layer.WFS.prototype.on);

goog.exportProperty(
    M.layer.WFS.prototype,
    'un',
    M.layer.WFS.prototype.un);

goog.exportProperty(
    M.layer.WFS.prototype,
    'fire',
    M.layer.WFS.prototype.fire);

goog.exportProperty(
    M.layer.WMC.prototype,
    'isVisible',
    M.layer.WMC.prototype.isVisible);

goog.exportProperty(
    M.layer.WMC.prototype,
    'isQueryable',
    M.layer.WMC.prototype.isQueryable);

goog.exportProperty(
    M.layer.WMC.prototype,
    'setVisible',
    M.layer.WMC.prototype.setVisible);

goog.exportProperty(
    M.layer.WMC.prototype,
    'inRange',
    M.layer.WMC.prototype.inRange);

goog.exportProperty(
    M.layer.WMC.prototype,
    'getLegendURL',
    M.layer.WMC.prototype.getLegendURL);

goog.exportProperty(
    M.layer.WMC.prototype,
    'setLegendURL',
    M.layer.WMC.prototype.setLegendURL);

goog.exportProperty(
    M.layer.WMC.prototype,
    'getZIndex',
    M.layer.WMC.prototype.getZIndex);

goog.exportProperty(
    M.layer.WMC.prototype,
    'setZIndex',
    M.layer.WMC.prototype.setZIndex);

goog.exportProperty(
    M.layer.WMC.prototype,
    'getOpacity',
    M.layer.WMC.prototype.getOpacity);

goog.exportProperty(
    M.layer.WMC.prototype,
    'setOpacity',
    M.layer.WMC.prototype.setOpacity);

goog.exportProperty(
    M.layer.WMC.prototype,
    'getImpl',
    M.layer.WMC.prototype.getImpl);

goog.exportProperty(
    M.layer.WMC.prototype,
    'setImpl',
    M.layer.WMC.prototype.setImpl);

goog.exportProperty(
    M.layer.WMC.prototype,
    'on',
    M.layer.WMC.prototype.on);

goog.exportProperty(
    M.layer.WMC.prototype,
    'un',
    M.layer.WMC.prototype.un);

goog.exportProperty(
    M.layer.WMC.prototype,
    'fire',
    M.layer.WMC.prototype.fire);

goog.exportProperty(
    M.layer.WMS.prototype,
    'isVisible',
    M.layer.WMS.prototype.isVisible);

goog.exportProperty(
    M.layer.WMS.prototype,
    'isQueryable',
    M.layer.WMS.prototype.isQueryable);

goog.exportProperty(
    M.layer.WMS.prototype,
    'setVisible',
    M.layer.WMS.prototype.setVisible);

goog.exportProperty(
    M.layer.WMS.prototype,
    'inRange',
    M.layer.WMS.prototype.inRange);

goog.exportProperty(
    M.layer.WMS.prototype,
    'getLegendURL',
    M.layer.WMS.prototype.getLegendURL);

goog.exportProperty(
    M.layer.WMS.prototype,
    'setLegendURL',
    M.layer.WMS.prototype.setLegendURL);

goog.exportProperty(
    M.layer.WMS.prototype,
    'getZIndex',
    M.layer.WMS.prototype.getZIndex);

goog.exportProperty(
    M.layer.WMS.prototype,
    'setZIndex',
    M.layer.WMS.prototype.setZIndex);

goog.exportProperty(
    M.layer.WMS.prototype,
    'getOpacity',
    M.layer.WMS.prototype.getOpacity);

goog.exportProperty(
    M.layer.WMS.prototype,
    'setOpacity',
    M.layer.WMS.prototype.setOpacity);

goog.exportProperty(
    M.layer.WMS.prototype,
    'getImpl',
    M.layer.WMS.prototype.getImpl);

goog.exportProperty(
    M.layer.WMS.prototype,
    'setImpl',
    M.layer.WMS.prototype.setImpl);

goog.exportProperty(
    M.layer.WMS.prototype,
    'on',
    M.layer.WMS.prototype.on);

goog.exportProperty(
    M.layer.WMS.prototype,
    'un',
    M.layer.WMS.prototype.un);

goog.exportProperty(
    M.layer.WMS.prototype,
    'fire',
    M.layer.WMS.prototype.fire);

goog.exportProperty(
    M.layer.WMTS.prototype,
    'isVisible',
    M.layer.WMTS.prototype.isVisible);

goog.exportProperty(
    M.layer.WMTS.prototype,
    'isQueryable',
    M.layer.WMTS.prototype.isQueryable);

goog.exportProperty(
    M.layer.WMTS.prototype,
    'setVisible',
    M.layer.WMTS.prototype.setVisible);

goog.exportProperty(
    M.layer.WMTS.prototype,
    'inRange',
    M.layer.WMTS.prototype.inRange);

goog.exportProperty(
    M.layer.WMTS.prototype,
    'getLegendURL',
    M.layer.WMTS.prototype.getLegendURL);

goog.exportProperty(
    M.layer.WMTS.prototype,
    'setLegendURL',
    M.layer.WMTS.prototype.setLegendURL);

goog.exportProperty(
    M.layer.WMTS.prototype,
    'getZIndex',
    M.layer.WMTS.prototype.getZIndex);

goog.exportProperty(
    M.layer.WMTS.prototype,
    'setZIndex',
    M.layer.WMTS.prototype.setZIndex);

goog.exportProperty(
    M.layer.WMTS.prototype,
    'getOpacity',
    M.layer.WMTS.prototype.getOpacity);

goog.exportProperty(
    M.layer.WMTS.prototype,
    'setOpacity',
    M.layer.WMTS.prototype.setOpacity);

goog.exportProperty(
    M.layer.WMTS.prototype,
    'getImpl',
    M.layer.WMTS.prototype.getImpl);

goog.exportProperty(
    M.layer.WMTS.prototype,
    'setImpl',
    M.layer.WMTS.prototype.setImpl);

goog.exportProperty(
    M.layer.WMTS.prototype,
    'on',
    M.layer.WMTS.prototype.on);

goog.exportProperty(
    M.layer.WMTS.prototype,
    'un',
    M.layer.WMTS.prototype.un);

goog.exportProperty(
    M.layer.WMTS.prototype,
    'fire',
    M.layer.WMTS.prototype.fire);

goog.exportProperty(
    M.Control.prototype,
    'getImpl',
    M.Control.prototype.getImpl);

goog.exportProperty(
    M.Control.prototype,
    'on',
    M.Control.prototype.on);

goog.exportProperty(
    M.Control.prototype,
    'un',
    M.Control.prototype.un);

goog.exportProperty(
    M.Control.prototype,
    'fire',
    M.Control.prototype.fire);

goog.exportProperty(
    M.control.GetFeatureInfo.prototype,
    'name',
    M.control.GetFeatureInfo.prototype.name);

goog.exportProperty(
    M.control.GetFeatureInfo.prototype,
    'activated',
    M.control.GetFeatureInfo.prototype.activated);

goog.exportProperty(
    M.control.GetFeatureInfo.prototype,
    'setImpl',
    M.control.GetFeatureInfo.prototype.setImpl);

goog.exportProperty(
    M.control.GetFeatureInfo.prototype,
    'addTo',
    M.control.GetFeatureInfo.prototype.addTo);

goog.exportProperty(
    M.control.GetFeatureInfo.prototype,
    'manageActivation',
    M.control.GetFeatureInfo.prototype.manageActivation);

goog.exportProperty(
    M.control.GetFeatureInfo.prototype,
    'activate',
    M.control.GetFeatureInfo.prototype.activate);

goog.exportProperty(
    M.control.GetFeatureInfo.prototype,
    'deactivate',
    M.control.GetFeatureInfo.prototype.deactivate);

goog.exportProperty(
    M.control.GetFeatureInfo.prototype,
    'getElement',
    M.control.GetFeatureInfo.prototype.getElement);

goog.exportProperty(
    M.control.GetFeatureInfo.prototype,
    'setPanel',
    M.control.GetFeatureInfo.prototype.setPanel);

goog.exportProperty(
    M.control.GetFeatureInfo.prototype,
    'getPanel',
    M.control.GetFeatureInfo.prototype.getPanel);

goog.exportProperty(
    M.control.GetFeatureInfo.prototype,
    'getImpl',
    M.control.GetFeatureInfo.prototype.getImpl);

goog.exportProperty(
    M.control.GetFeatureInfo.prototype,
    'on',
    M.control.GetFeatureInfo.prototype.on);

goog.exportProperty(
    M.control.GetFeatureInfo.prototype,
    'un',
    M.control.GetFeatureInfo.prototype.un);

goog.exportProperty(
    M.control.GetFeatureInfo.prototype,
    'fire',
    M.control.GetFeatureInfo.prototype.fire);

goog.exportProperty(
    M.control.LayerSwitcher.prototype,
    'name',
    M.control.LayerSwitcher.prototype.name);

goog.exportProperty(
    M.control.LayerSwitcher.prototype,
    'activated',
    M.control.LayerSwitcher.prototype.activated);

goog.exportProperty(
    M.control.LayerSwitcher.prototype,
    'setImpl',
    M.control.LayerSwitcher.prototype.setImpl);

goog.exportProperty(
    M.control.LayerSwitcher.prototype,
    'addTo',
    M.control.LayerSwitcher.prototype.addTo);

goog.exportProperty(
    M.control.LayerSwitcher.prototype,
    'manageActivation',
    M.control.LayerSwitcher.prototype.manageActivation);

goog.exportProperty(
    M.control.LayerSwitcher.prototype,
    'getActivationButton',
    M.control.LayerSwitcher.prototype.getActivationButton);

goog.exportProperty(
    M.control.LayerSwitcher.prototype,
    'activate',
    M.control.LayerSwitcher.prototype.activate);

goog.exportProperty(
    M.control.LayerSwitcher.prototype,
    'deactivate',
    M.control.LayerSwitcher.prototype.deactivate);

goog.exportProperty(
    M.control.LayerSwitcher.prototype,
    'getElement',
    M.control.LayerSwitcher.prototype.getElement);

goog.exportProperty(
    M.control.LayerSwitcher.prototype,
    'setPanel',
    M.control.LayerSwitcher.prototype.setPanel);

goog.exportProperty(
    M.control.LayerSwitcher.prototype,
    'getPanel',
    M.control.LayerSwitcher.prototype.getPanel);

goog.exportProperty(
    M.control.LayerSwitcher.prototype,
    'getImpl',
    M.control.LayerSwitcher.prototype.getImpl);

goog.exportProperty(
    M.control.LayerSwitcher.prototype,
    'on',
    M.control.LayerSwitcher.prototype.on);

goog.exportProperty(
    M.control.LayerSwitcher.prototype,
    'un',
    M.control.LayerSwitcher.prototype.un);

goog.exportProperty(
    M.control.LayerSwitcher.prototype,
    'fire',
    M.control.LayerSwitcher.prototype.fire);

goog.exportProperty(
    M.control.Location.prototype,
    'name',
    M.control.Location.prototype.name);

goog.exportProperty(
    M.control.Location.prototype,
    'activated',
    M.control.Location.prototype.activated);

goog.exportProperty(
    M.control.Location.prototype,
    'setImpl',
    M.control.Location.prototype.setImpl);

goog.exportProperty(
    M.control.Location.prototype,
    'addTo',
    M.control.Location.prototype.addTo);

goog.exportProperty(
    M.control.Location.prototype,
    'manageActivation',
    M.control.Location.prototype.manageActivation);

goog.exportProperty(
    M.control.Location.prototype,
    'activate',
    M.control.Location.prototype.activate);

goog.exportProperty(
    M.control.Location.prototype,
    'deactivate',
    M.control.Location.prototype.deactivate);

goog.exportProperty(
    M.control.Location.prototype,
    'getElement',
    M.control.Location.prototype.getElement);

goog.exportProperty(
    M.control.Location.prototype,
    'setPanel',
    M.control.Location.prototype.setPanel);

goog.exportProperty(
    M.control.Location.prototype,
    'getPanel',
    M.control.Location.prototype.getPanel);

goog.exportProperty(
    M.control.Location.prototype,
    'getImpl',
    M.control.Location.prototype.getImpl);

goog.exportProperty(
    M.control.Location.prototype,
    'on',
    M.control.Location.prototype.on);

goog.exportProperty(
    M.control.Location.prototype,
    'un',
    M.control.Location.prototype.un);

goog.exportProperty(
    M.control.Location.prototype,
    'fire',
    M.control.Location.prototype.fire);

goog.exportProperty(
    M.control.Mouse.prototype,
    'name',
    M.control.Mouse.prototype.name);

goog.exportProperty(
    M.control.Mouse.prototype,
    'activated',
    M.control.Mouse.prototype.activated);

goog.exportProperty(
    M.control.Mouse.prototype,
    'setImpl',
    M.control.Mouse.prototype.setImpl);

goog.exportProperty(
    M.control.Mouse.prototype,
    'addTo',
    M.control.Mouse.prototype.addTo);

goog.exportProperty(
    M.control.Mouse.prototype,
    'manageActivation',
    M.control.Mouse.prototype.manageActivation);

goog.exportProperty(
    M.control.Mouse.prototype,
    'getActivationButton',
    M.control.Mouse.prototype.getActivationButton);

goog.exportProperty(
    M.control.Mouse.prototype,
    'activate',
    M.control.Mouse.prototype.activate);

goog.exportProperty(
    M.control.Mouse.prototype,
    'deactivate',
    M.control.Mouse.prototype.deactivate);

goog.exportProperty(
    M.control.Mouse.prototype,
    'getElement',
    M.control.Mouse.prototype.getElement);

goog.exportProperty(
    M.control.Mouse.prototype,
    'setPanel',
    M.control.Mouse.prototype.setPanel);

goog.exportProperty(
    M.control.Mouse.prototype,
    'getPanel',
    M.control.Mouse.prototype.getPanel);

goog.exportProperty(
    M.control.Mouse.prototype,
    'getImpl',
    M.control.Mouse.prototype.getImpl);

goog.exportProperty(
    M.control.Mouse.prototype,
    'on',
    M.control.Mouse.prototype.on);

goog.exportProperty(
    M.control.Mouse.prototype,
    'un',
    M.control.Mouse.prototype.un);

goog.exportProperty(
    M.control.Mouse.prototype,
    'fire',
    M.control.Mouse.prototype.fire);

goog.exportProperty(
    M.control.Navtoolbar.prototype,
    'name',
    M.control.Navtoolbar.prototype.name);

goog.exportProperty(
    M.control.Navtoolbar.prototype,
    'activated',
    M.control.Navtoolbar.prototype.activated);

goog.exportProperty(
    M.control.Navtoolbar.prototype,
    'setImpl',
    M.control.Navtoolbar.prototype.setImpl);

goog.exportProperty(
    M.control.Navtoolbar.prototype,
    'addTo',
    M.control.Navtoolbar.prototype.addTo);

goog.exportProperty(
    M.control.Navtoolbar.prototype,
    'manageActivation',
    M.control.Navtoolbar.prototype.manageActivation);

goog.exportProperty(
    M.control.Navtoolbar.prototype,
    'getActivationButton',
    M.control.Navtoolbar.prototype.getActivationButton);

goog.exportProperty(
    M.control.Navtoolbar.prototype,
    'activate',
    M.control.Navtoolbar.prototype.activate);

goog.exportProperty(
    M.control.Navtoolbar.prototype,
    'deactivate',
    M.control.Navtoolbar.prototype.deactivate);

goog.exportProperty(
    M.control.Navtoolbar.prototype,
    'getElement',
    M.control.Navtoolbar.prototype.getElement);

goog.exportProperty(
    M.control.Navtoolbar.prototype,
    'setPanel',
    M.control.Navtoolbar.prototype.setPanel);

goog.exportProperty(
    M.control.Navtoolbar.prototype,
    'getPanel',
    M.control.Navtoolbar.prototype.getPanel);

goog.exportProperty(
    M.control.Navtoolbar.prototype,
    'getImpl',
    M.control.Navtoolbar.prototype.getImpl);

goog.exportProperty(
    M.control.Navtoolbar.prototype,
    'on',
    M.control.Navtoolbar.prototype.on);

goog.exportProperty(
    M.control.Navtoolbar.prototype,
    'un',
    M.control.Navtoolbar.prototype.un);

goog.exportProperty(
    M.control.Navtoolbar.prototype,
    'fire',
    M.control.Navtoolbar.prototype.fire);

goog.exportProperty(
    M.control.OverviewMap.prototype,
    'name',
    M.control.OverviewMap.prototype.name);

goog.exportProperty(
    M.control.OverviewMap.prototype,
    'activated',
    M.control.OverviewMap.prototype.activated);

goog.exportProperty(
    M.control.OverviewMap.prototype,
    'setImpl',
    M.control.OverviewMap.prototype.setImpl);

goog.exportProperty(
    M.control.OverviewMap.prototype,
    'addTo',
    M.control.OverviewMap.prototype.addTo);

goog.exportProperty(
    M.control.OverviewMap.prototype,
    'manageActivation',
    M.control.OverviewMap.prototype.manageActivation);

goog.exportProperty(
    M.control.OverviewMap.prototype,
    'getActivationButton',
    M.control.OverviewMap.prototype.getActivationButton);

goog.exportProperty(
    M.control.OverviewMap.prototype,
    'activate',
    M.control.OverviewMap.prototype.activate);

goog.exportProperty(
    M.control.OverviewMap.prototype,
    'deactivate',
    M.control.OverviewMap.prototype.deactivate);

goog.exportProperty(
    M.control.OverviewMap.prototype,
    'getElement',
    M.control.OverviewMap.prototype.getElement);

goog.exportProperty(
    M.control.OverviewMap.prototype,
    'setPanel',
    M.control.OverviewMap.prototype.setPanel);

goog.exportProperty(
    M.control.OverviewMap.prototype,
    'getPanel',
    M.control.OverviewMap.prototype.getPanel);

goog.exportProperty(
    M.control.OverviewMap.prototype,
    'getImpl',
    M.control.OverviewMap.prototype.getImpl);

goog.exportProperty(
    M.control.OverviewMap.prototype,
    'on',
    M.control.OverviewMap.prototype.on);

goog.exportProperty(
    M.control.OverviewMap.prototype,
    'un',
    M.control.OverviewMap.prototype.un);

goog.exportProperty(
    M.control.OverviewMap.prototype,
    'fire',
    M.control.OverviewMap.prototype.fire);

goog.exportProperty(
    M.control.Panzoom.prototype,
    'name',
    M.control.Panzoom.prototype.name);

goog.exportProperty(
    M.control.Panzoom.prototype,
    'activated',
    M.control.Panzoom.prototype.activated);

goog.exportProperty(
    M.control.Panzoom.prototype,
    'setImpl',
    M.control.Panzoom.prototype.setImpl);

goog.exportProperty(
    M.control.Panzoom.prototype,
    'addTo',
    M.control.Panzoom.prototype.addTo);

goog.exportProperty(
    M.control.Panzoom.prototype,
    'manageActivation',
    M.control.Panzoom.prototype.manageActivation);

goog.exportProperty(
    M.control.Panzoom.prototype,
    'getActivationButton',
    M.control.Panzoom.prototype.getActivationButton);

goog.exportProperty(
    M.control.Panzoom.prototype,
    'activate',
    M.control.Panzoom.prototype.activate);

goog.exportProperty(
    M.control.Panzoom.prototype,
    'deactivate',
    M.control.Panzoom.prototype.deactivate);

goog.exportProperty(
    M.control.Panzoom.prototype,
    'getElement',
    M.control.Panzoom.prototype.getElement);

goog.exportProperty(
    M.control.Panzoom.prototype,
    'setPanel',
    M.control.Panzoom.prototype.setPanel);

goog.exportProperty(
    M.control.Panzoom.prototype,
    'getPanel',
    M.control.Panzoom.prototype.getPanel);

goog.exportProperty(
    M.control.Panzoom.prototype,
    'getImpl',
    M.control.Panzoom.prototype.getImpl);

goog.exportProperty(
    M.control.Panzoom.prototype,
    'on',
    M.control.Panzoom.prototype.on);

goog.exportProperty(
    M.control.Panzoom.prototype,
    'un',
    M.control.Panzoom.prototype.un);

goog.exportProperty(
    M.control.Panzoom.prototype,
    'fire',
    M.control.Panzoom.prototype.fire);

goog.exportProperty(
    M.control.Panzoombar.prototype,
    'name',
    M.control.Panzoombar.prototype.name);

goog.exportProperty(
    M.control.Panzoombar.prototype,
    'activated',
    M.control.Panzoombar.prototype.activated);

goog.exportProperty(
    M.control.Panzoombar.prototype,
    'setImpl',
    M.control.Panzoombar.prototype.setImpl);

goog.exportProperty(
    M.control.Panzoombar.prototype,
    'addTo',
    M.control.Panzoombar.prototype.addTo);

goog.exportProperty(
    M.control.Panzoombar.prototype,
    'manageActivation',
    M.control.Panzoombar.prototype.manageActivation);

goog.exportProperty(
    M.control.Panzoombar.prototype,
    'getActivationButton',
    M.control.Panzoombar.prototype.getActivationButton);

goog.exportProperty(
    M.control.Panzoombar.prototype,
    'activate',
    M.control.Panzoombar.prototype.activate);

goog.exportProperty(
    M.control.Panzoombar.prototype,
    'deactivate',
    M.control.Panzoombar.prototype.deactivate);

goog.exportProperty(
    M.control.Panzoombar.prototype,
    'getElement',
    M.control.Panzoombar.prototype.getElement);

goog.exportProperty(
    M.control.Panzoombar.prototype,
    'setPanel',
    M.control.Panzoombar.prototype.setPanel);

goog.exportProperty(
    M.control.Panzoombar.prototype,
    'getPanel',
    M.control.Panzoombar.prototype.getPanel);

goog.exportProperty(
    M.control.Panzoombar.prototype,
    'getImpl',
    M.control.Panzoombar.prototype.getImpl);

goog.exportProperty(
    M.control.Panzoombar.prototype,
    'on',
    M.control.Panzoombar.prototype.on);

goog.exportProperty(
    M.control.Panzoombar.prototype,
    'un',
    M.control.Panzoombar.prototype.un);

goog.exportProperty(
    M.control.Panzoombar.prototype,
    'fire',
    M.control.Panzoombar.prototype.fire);

goog.exportProperty(
    M.control.Scale.prototype,
    'name',
    M.control.Scale.prototype.name);

goog.exportProperty(
    M.control.Scale.prototype,
    'activated',
    M.control.Scale.prototype.activated);

goog.exportProperty(
    M.control.Scale.prototype,
    'setImpl',
    M.control.Scale.prototype.setImpl);

goog.exportProperty(
    M.control.Scale.prototype,
    'addTo',
    M.control.Scale.prototype.addTo);

goog.exportProperty(
    M.control.Scale.prototype,
    'manageActivation',
    M.control.Scale.prototype.manageActivation);

goog.exportProperty(
    M.control.Scale.prototype,
    'getActivationButton',
    M.control.Scale.prototype.getActivationButton);

goog.exportProperty(
    M.control.Scale.prototype,
    'activate',
    M.control.Scale.prototype.activate);

goog.exportProperty(
    M.control.Scale.prototype,
    'deactivate',
    M.control.Scale.prototype.deactivate);

goog.exportProperty(
    M.control.Scale.prototype,
    'getElement',
    M.control.Scale.prototype.getElement);

goog.exportProperty(
    M.control.Scale.prototype,
    'setPanel',
    M.control.Scale.prototype.setPanel);

goog.exportProperty(
    M.control.Scale.prototype,
    'getPanel',
    M.control.Scale.prototype.getPanel);

goog.exportProperty(
    M.control.Scale.prototype,
    'getImpl',
    M.control.Scale.prototype.getImpl);

goog.exportProperty(
    M.control.Scale.prototype,
    'on',
    M.control.Scale.prototype.on);

goog.exportProperty(
    M.control.Scale.prototype,
    'un',
    M.control.Scale.prototype.un);

goog.exportProperty(
    M.control.Scale.prototype,
    'fire',
    M.control.Scale.prototype.fire);

goog.exportProperty(
    M.control.ScaleLine.prototype,
    'name',
    M.control.ScaleLine.prototype.name);

goog.exportProperty(
    M.control.ScaleLine.prototype,
    'activated',
    M.control.ScaleLine.prototype.activated);

goog.exportProperty(
    M.control.ScaleLine.prototype,
    'setImpl',
    M.control.ScaleLine.prototype.setImpl);

goog.exportProperty(
    M.control.ScaleLine.prototype,
    'addTo',
    M.control.ScaleLine.prototype.addTo);

goog.exportProperty(
    M.control.ScaleLine.prototype,
    'manageActivation',
    M.control.ScaleLine.prototype.manageActivation);

goog.exportProperty(
    M.control.ScaleLine.prototype,
    'getActivationButton',
    M.control.ScaleLine.prototype.getActivationButton);

goog.exportProperty(
    M.control.ScaleLine.prototype,
    'activate',
    M.control.ScaleLine.prototype.activate);

goog.exportProperty(
    M.control.ScaleLine.prototype,
    'deactivate',
    M.control.ScaleLine.prototype.deactivate);

goog.exportProperty(
    M.control.ScaleLine.prototype,
    'getElement',
    M.control.ScaleLine.prototype.getElement);

goog.exportProperty(
    M.control.ScaleLine.prototype,
    'setPanel',
    M.control.ScaleLine.prototype.setPanel);

goog.exportProperty(
    M.control.ScaleLine.prototype,
    'getPanel',
    M.control.ScaleLine.prototype.getPanel);

goog.exportProperty(
    M.control.ScaleLine.prototype,
    'getImpl',
    M.control.ScaleLine.prototype.getImpl);

goog.exportProperty(
    M.control.ScaleLine.prototype,
    'on',
    M.control.ScaleLine.prototype.on);

goog.exportProperty(
    M.control.ScaleLine.prototype,
    'un',
    M.control.ScaleLine.prototype.un);

goog.exportProperty(
    M.control.ScaleLine.prototype,
    'fire',
    M.control.ScaleLine.prototype.fire);

goog.exportProperty(
    M.control.WMCSelector.prototype,
    'name',
    M.control.WMCSelector.prototype.name);

goog.exportProperty(
    M.control.WMCSelector.prototype,
    'activated',
    M.control.WMCSelector.prototype.activated);

goog.exportProperty(
    M.control.WMCSelector.prototype,
    'setImpl',
    M.control.WMCSelector.prototype.setImpl);

goog.exportProperty(
    M.control.WMCSelector.prototype,
    'addTo',
    M.control.WMCSelector.prototype.addTo);

goog.exportProperty(
    M.control.WMCSelector.prototype,
    'manageActivation',
    M.control.WMCSelector.prototype.manageActivation);

goog.exportProperty(
    M.control.WMCSelector.prototype,
    'getActivationButton',
    M.control.WMCSelector.prototype.getActivationButton);

goog.exportProperty(
    M.control.WMCSelector.prototype,
    'activate',
    M.control.WMCSelector.prototype.activate);

goog.exportProperty(
    M.control.WMCSelector.prototype,
    'deactivate',
    M.control.WMCSelector.prototype.deactivate);

goog.exportProperty(
    M.control.WMCSelector.prototype,
    'getElement',
    M.control.WMCSelector.prototype.getElement);

goog.exportProperty(
    M.control.WMCSelector.prototype,
    'setPanel',
    M.control.WMCSelector.prototype.setPanel);

goog.exportProperty(
    M.control.WMCSelector.prototype,
    'getPanel',
    M.control.WMCSelector.prototype.getPanel);

goog.exportProperty(
    M.control.WMCSelector.prototype,
    'getImpl',
    M.control.WMCSelector.prototype.getImpl);

goog.exportProperty(
    M.control.WMCSelector.prototype,
    'on',
    M.control.WMCSelector.prototype.on);

goog.exportProperty(
    M.control.WMCSelector.prototype,
    'un',
    M.control.WMCSelector.prototype.un);

goog.exportProperty(
    M.control.WMCSelector.prototype,
    'fire',
    M.control.WMCSelector.prototype.fire);
