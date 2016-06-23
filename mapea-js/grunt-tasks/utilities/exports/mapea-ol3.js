/**
 * @fileoverview Custom exports file.
 * @suppress {checkVars}
 */

goog.require('M');
goog.require('M.Control');
goog.require('M.Label');
goog.require('M.Layer');
goog.require('M.Map');
goog.require('M.Parameters');
goog.require('M.Plugin');
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
goog.require('M.exception');
goog.require('M.facade.Base');
goog.require('M.geom');
goog.require('M.geom.wfs.type');
goog.require('M.geom.wkt.type');
goog.require('M.impl');
goog.require('M.impl.Control');
goog.require('M.impl.FeatureLoaderJsonp');
goog.require('M.impl.GetCapabilities');
goog.require('M.impl.Label');
goog.require('M.impl.Layer');
goog.require('M.impl.Map');
goog.require('M.impl.Popup');
goog.require('M.impl.View');
goog.require('M.impl.control.GetFeatureInfo');
goog.require('M.impl.control.LayerSwitcher');
goog.require('M.impl.control.Location');
goog.require('M.impl.control.Mouse');
goog.require('M.impl.control.Navtoolbar');
goog.require('M.impl.control.OverviewMap');
goog.require('M.impl.control.Panzoom');
goog.require('M.impl.control.Panzoombar');
goog.require('M.impl.control.Scale');
goog.require('M.impl.control.ScaleLine');
goog.require('M.impl.control.WMCSelector');
goog.require('M.impl.envolvedExtent');
goog.require('M.impl.format.GeoJSON');
goog.require('M.impl.format.KML');
goog.require('M.impl.format.WMC');
goog.require('M.impl.format.WMC.v110');
goog.require('M.impl.format.WMSCapabilities');
goog.require('M.impl.format.WMTSCapabilities');
goog.require('M.impl.handler.Features');
goog.require('M.impl.layer.Draw');
goog.require('M.impl.layer.KML');
goog.require('M.impl.layer.OSM');
goog.require('M.impl.layer.WFS');
goog.require('M.impl.layer.WMC');
goog.require('M.impl.layer.WMS');
goog.require('M.impl.layer.WMTS');
goog.require('M.impl.style');
goog.require('M.impl.utils');
goog.require('M.layer');
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
goog.require('M.template');
goog.require('M.utils');
goog.require('ol');
goog.require('ol.Attribution');
goog.require('ol.Collection');
goog.require('ol.CollectionEvent');
goog.require('ol.CollectionEventType');
goog.require('ol.Color');
goog.require('ol.Coordinate');
goog.require('ol.CoordinateFormatType');
goog.require('ol.DeviceOrientation');
goog.require('ol.DeviceOrientationProperty');
goog.require('ol.DragBoxEvent');
goog.require('ol.Extent');
goog.require('ol.Feature');
goog.require('ol.FeatureLoader');
goog.require('ol.FeatureStyleFunction');
goog.require('ol.FeatureUrlFunction');
goog.require('ol.Geolocation');
goog.require('ol.GeolocationProperty');
goog.require('ol.Graticule');
goog.require('ol.Image');
goog.require('ol.ImageTile');
goog.require('ol.Kinetic');
goog.require('ol.LoadingStrategy');
goog.require('ol.Map');
goog.require('ol.MapBrowserEvent');
goog.require('ol.MapBrowserEvent.EventType');
goog.require('ol.MapBrowserEventHandler');
goog.require('ol.MapBrowserPointerEvent');
goog.require('ol.MapEvent');
goog.require('ol.MapEventType');
goog.require('ol.MapProperty');
goog.require('ol.Object');
goog.require('ol.ObjectEvent');
goog.require('ol.ObjectEventType');
goog.require('ol.Observable');
goog.require('ol.Overlay');
goog.require('ol.OverlayPositioning');
goog.require('ol.OverlayProperty');
goog.require('ol.Size');
goog.require('ol.Sphere');
goog.require('ol.Tile');
goog.require('ol.TileState');
goog.require('ol.VectorTile');
goog.require('ol.View');
goog.require('ol.ViewHint');
goog.require('ol.ViewProperty');
goog.require('ol.animation');
goog.require('ol.color');
goog.require('ol.control');
goog.require('ol.control.Attribution');
goog.require('ol.control.Control');
goog.require('ol.control.FullScreen');
goog.require('ol.control.MousePosition');
goog.require('ol.control.OverviewMap');
goog.require('ol.control.Rotate');
goog.require('ol.control.ScaleLine');
goog.require('ol.control.ScaleLineProperty');
goog.require('ol.control.ScaleLineUnits');
goog.require('ol.control.Zoom');
goog.require('ol.control.ZoomSlider');
goog.require('ol.control.ZoomToExtent');
goog.require('ol.coordinate');
goog.require('ol.easing');
goog.require('ol.events.ConditionType');
goog.require('ol.events.condition');
goog.require('ol.extent');
goog.require('ol.extent.Corner');
goog.require('ol.extent.Relationship');
goog.require('ol.featureloader');
goog.require('ol.format.EsriJSON');
goog.require('ol.format.Feature');
goog.require('ol.format.GML');
goog.require('ol.format.GML2');
goog.require('ol.format.GML3');
goog.require('ol.format.GMLBase');
goog.require('ol.format.GPX');
goog.require('ol.format.GeoJSON');
goog.require('ol.format.IGC');
goog.require('ol.format.IGCZ');
goog.require('ol.format.KML');
goog.require('ol.format.MVT');
goog.require('ol.format.OSMXML');
goog.require('ol.format.Polyline');
goog.require('ol.format.TopoJSON');
goog.require('ol.format.WFS');
goog.require('ol.format.WKT');
goog.require('ol.format.WMSCapabilities');
goog.require('ol.format.WMSGetFeatureInfo');
goog.require('ol.format.WMTSCapabilities');
goog.require('ol.geom.Circle');
goog.require('ol.geom.Geometry');
goog.require('ol.geom.GeometryCollection');
goog.require('ol.geom.GeometryLayout');
goog.require('ol.geom.GeometryType');
goog.require('ol.geom.LineString');
goog.require('ol.geom.LinearRing');
goog.require('ol.geom.MultiLineString');
goog.require('ol.geom.MultiPoint');
goog.require('ol.geom.MultiPolygon');
goog.require('ol.geom.Point');
goog.require('ol.geom.Polygon');
goog.require('ol.geom.SimpleGeometry');
goog.require('ol.has');
goog.require('ol.interaction');
goog.require('ol.interaction.DoubleClickZoom');
goog.require('ol.interaction.DragAndDrop');
goog.require('ol.interaction.DragAndDropEvent');
goog.require('ol.interaction.DragBox');
goog.require('ol.interaction.DragPan');
goog.require('ol.interaction.DragRotate');
goog.require('ol.interaction.DragRotateAndZoom');
goog.require('ol.interaction.DragZoom');
goog.require('ol.interaction.Draw');
goog.require('ol.interaction.DrawEvent');
goog.require('ol.interaction.DrawEventType');
goog.require('ol.interaction.DrawGeometryFunctionType');
goog.require('ol.interaction.DrawMode');
goog.require('ol.interaction.Interaction');
goog.require('ol.interaction.InteractionProperty');
goog.require('ol.interaction.KeyboardPan');
goog.require('ol.interaction.KeyboardZoom');
goog.require('ol.interaction.Modify');
goog.require('ol.interaction.ModifyEvent');
goog.require('ol.interaction.MouseWheelZoom');
goog.require('ol.interaction.PinchRotate');
goog.require('ol.interaction.PinchZoom');
goog.require('ol.interaction.Pointer');
goog.require('ol.interaction.Select');
goog.require('ol.interaction.SelectEvent');
goog.require('ol.interaction.SelectEventType');
goog.require('ol.interaction.SelectFilterFunction');
goog.require('ol.interaction.Snap');
goog.require('ol.interaction.SnapProperty');
goog.require('ol.interaction.Translate');
goog.require('ol.interaction.TranslateEvent');
goog.require('ol.layer.Base');
goog.require('ol.layer.Group');
goog.require('ol.layer.Heatmap');
goog.require('ol.layer.Image');
goog.require('ol.layer.Layer');
goog.require('ol.layer.LayerProperty');
goog.require('ol.layer.LayerState');
goog.require('ol.layer.Tile');
goog.require('ol.layer.Vector');
goog.require('ol.layer.VectorTile');
goog.require('ol.loadingstrategy');
goog.require('ol.proj');
goog.require('ol.proj.METERS_PER_UNIT');
goog.require('ol.proj.Projection');
goog.require('ol.proj.ProjectionLike');
goog.require('ol.proj.Units');
goog.require('ol.proj.common');
goog.require('ol.render.Event');
goog.require('ol.render.EventType');
goog.require('ol.render.Feature');
goog.require('ol.render.VectorContext');
goog.require('ol.render.canvas.Immediate');
goog.require('ol.render.webgl.Immediate');
goog.require('ol.size');
goog.require('ol.source.BingMaps');
goog.require('ol.source.Cluster');
goog.require('ol.source.Image');
goog.require('ol.source.ImageCanvas');
goog.require('ol.source.ImageEvent');
goog.require('ol.source.ImageMapGuide');
goog.require('ol.source.ImageStatic');
goog.require('ol.source.ImageVector');
goog.require('ol.source.ImageWMS');
goog.require('ol.source.MapQuest');
goog.require('ol.source.OSM');
goog.require('ol.source.Raster');
goog.require('ol.source.RasterEvent');
goog.require('ol.source.RasterEventType');
goog.require('ol.source.Source');
goog.require('ol.source.Stamen');
goog.require('ol.source.State');
goog.require('ol.source.Tile');
goog.require('ol.source.TileArcGISRest');
goog.require('ol.source.TileDebug');
goog.require('ol.source.TileEvent');
goog.require('ol.source.TileImage');
goog.require('ol.source.TileJSON');
goog.require('ol.source.TileOptions');
goog.require('ol.source.TileUTFGrid');
goog.require('ol.source.TileWMS');
goog.require('ol.source.UrlTile');
goog.require('ol.source.Vector');
goog.require('ol.source.VectorEvent');
goog.require('ol.source.VectorEventType');
goog.require('ol.source.VectorTile');
goog.require('ol.source.WMTS');
goog.require('ol.source.WMTSRequestEncoding');
goog.require('ol.source.XYZ');
goog.require('ol.source.Zoomify');
goog.require('ol.style.Atlas');
goog.require('ol.style.AtlasManager');
goog.require('ol.style.Circle');
goog.require('ol.style.Fill');
goog.require('ol.style.GeometryFunction');
goog.require('ol.style.Icon');
goog.require('ol.style.IconAnchorUnits');
goog.require('ol.style.IconImageCache');
goog.require('ol.style.IconOrigin');
goog.require('ol.style.Image');
goog.require('ol.style.ImageState');
goog.require('ol.style.RegularShape');
goog.require('ol.style.Stroke');
goog.require('ol.style.Style');
goog.require('ol.style.StyleFunction');
goog.require('ol.style.Text');
goog.require('ol.style.defaultGeometryFunction');
goog.require('ol.tilegrid.TileGrid');
goog.require('ol.tilegrid.WMTS');
goog.require('ol.tilejson');
goog.require('ol.webgl.Context');
goog.require('ol.xml');


goog.exportSymbol(
    'ol.featureloader.jsonp',
    ol.featureloader.jsonp);

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

goog.exportProperty(
    M.facade.Base.prototype,
    'onLoad',
    M.facade.Base.prototype.onLoad);

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
    'M.Label',
    M.Label);

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
    'M.impl.Label',
    M.impl.Label);

goog.exportProperty(
    M.impl.Label.prototype,
    'show',
    M.impl.Label.prototype.show);

goog.exportProperty(
    M.impl.Label.prototype,
    'getPopup',
    M.impl.Label.prototype.getPopup);

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
    'ol.animation.bounce',
    ol.animation.bounce);

goog.exportSymbol(
    'ol.animation.pan',
    ol.animation.pan);

goog.exportSymbol(
    'ol.animation.rotate',
    ol.animation.rotate);

goog.exportSymbol(
    'ol.animation.zoom',
    ol.animation.zoom);

goog.exportSymbol(
    'M.impl.View',
    M.impl.View);

goog.exportProperty(
    M.impl.View.prototype,
    'setUserZoom',
    M.impl.View.prototype.setUserZoom);

goog.exportProperty(
    M.impl.View.prototype,
    'getUserZoom',
    M.impl.View.prototype.getUserZoom);

goog.exportProperty(
    M.impl.View.prototype,
    'setProjection',
    M.impl.View.prototype.setProjection);

goog.exportProperty(
    M.impl.View.prototype,
    'getResolutions',
    M.impl.View.prototype.getResolutions);

goog.exportProperty(
    M.impl.View.prototype,
    'setResolutions',
    M.impl.View.prototype.setResolutions);

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
    'M.remote.proxerize',
    M.remote.proxerize);

goog.exportSymbol(
    'ol.Attribution',
    ol.Attribution);

goog.exportProperty(
    ol.Attribution.prototype,
    'getHTML',
    ol.Attribution.prototype.getHTML);

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
    'M.utils.beautifyString',
    M.utils.beautifyString);

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

goog.exportProperty(
    ol.CollectionEvent.prototype,
    'element',
    ol.CollectionEvent.prototype.element);

goog.exportSymbol(
    'ol.Collection',
    ol.Collection);

goog.exportProperty(
    ol.Collection.prototype,
    'clear',
    ol.Collection.prototype.clear);

goog.exportProperty(
    ol.Collection.prototype,
    'extend',
    ol.Collection.prototype.extend);

goog.exportProperty(
    ol.Collection.prototype,
    'forEach',
    ol.Collection.prototype.forEach);

goog.exportProperty(
    ol.Collection.prototype,
    'getArray',
    ol.Collection.prototype.getArray);

goog.exportProperty(
    ol.Collection.prototype,
    'item',
    ol.Collection.prototype.item);

goog.exportProperty(
    ol.Collection.prototype,
    'getLength',
    ol.Collection.prototype.getLength);

goog.exportProperty(
    ol.Collection.prototype,
    'insertAt',
    ol.Collection.prototype.insertAt);

goog.exportProperty(
    ol.Collection.prototype,
    'pop',
    ol.Collection.prototype.pop);

goog.exportProperty(
    ol.Collection.prototype,
    'push',
    ol.Collection.prototype.push);

goog.exportProperty(
    ol.Collection.prototype,
    'remove',
    ol.Collection.prototype.remove);

goog.exportProperty(
    ol.Collection.prototype,
    'removeAt',
    ol.Collection.prototype.removeAt);

goog.exportProperty(
    ol.Collection.prototype,
    'setAt',
    ol.Collection.prototype.setAt);

goog.exportSymbol(
    'ol.coordinate.add',
    ol.coordinate.add);

goog.exportSymbol(
    'ol.coordinate.createStringXY',
    ol.coordinate.createStringXY);

goog.exportSymbol(
    'ol.coordinate.format',
    ol.coordinate.format);

goog.exportSymbol(
    'ol.coordinate.rotate',
    ol.coordinate.rotate);

goog.exportSymbol(
    'ol.coordinate.toStringHDMS',
    ol.coordinate.toStringHDMS);

goog.exportSymbol(
    'ol.coordinate.toStringXY',
    ol.coordinate.toStringXY);

goog.exportSymbol(
    'ol.DeviceOrientation',
    ol.DeviceOrientation);

goog.exportProperty(
    ol.DeviceOrientation.prototype,
    'getAlpha',
    ol.DeviceOrientation.prototype.getAlpha);

goog.exportProperty(
    ol.DeviceOrientation.prototype,
    'getBeta',
    ol.DeviceOrientation.prototype.getBeta);

goog.exportProperty(
    ol.DeviceOrientation.prototype,
    'getGamma',
    ol.DeviceOrientation.prototype.getGamma);

goog.exportProperty(
    ol.DeviceOrientation.prototype,
    'getHeading',
    ol.DeviceOrientation.prototype.getHeading);

goog.exportProperty(
    ol.DeviceOrientation.prototype,
    'getTracking',
    ol.DeviceOrientation.prototype.getTracking);

goog.exportProperty(
    ol.DeviceOrientation.prototype,
    'setTracking',
    ol.DeviceOrientation.prototype.setTracking);

goog.exportSymbol(
    'ol.easing.easeIn',
    ol.easing.easeIn);

goog.exportSymbol(
    'ol.easing.easeOut',
    ol.easing.easeOut);

goog.exportSymbol(
    'ol.easing.inAndOut',
    ol.easing.inAndOut);

goog.exportSymbol(
    'ol.easing.linear',
    ol.easing.linear);

goog.exportSymbol(
    'ol.easing.upAndDown',
    ol.easing.upAndDown);

goog.exportSymbol(
    'ol.extent.boundingExtent',
    ol.extent.boundingExtent);

goog.exportSymbol(
    'ol.extent.buffer',
    ol.extent.buffer);

goog.exportSymbol(
    'ol.extent.containsCoordinate',
    ol.extent.containsCoordinate);

goog.exportSymbol(
    'ol.extent.containsExtent',
    ol.extent.containsExtent);

goog.exportSymbol(
    'ol.extent.containsXY',
    ol.extent.containsXY);

goog.exportSymbol(
    'ol.extent.createEmpty',
    ol.extent.createEmpty);

goog.exportSymbol(
    'ol.extent.equals',
    ol.extent.equals);

goog.exportSymbol(
    'ol.extent.extend',
    ol.extent.extend);

goog.exportSymbol(
    'ol.extent.getBottomLeft',
    ol.extent.getBottomLeft);

goog.exportSymbol(
    'ol.extent.getBottomRight',
    ol.extent.getBottomRight);

goog.exportSymbol(
    'ol.extent.getCenter',
    ol.extent.getCenter);

goog.exportSymbol(
    'ol.extent.getHeight',
    ol.extent.getHeight);

goog.exportSymbol(
    'ol.extent.getIntersection',
    ol.extent.getIntersection);

goog.exportSymbol(
    'ol.extent.getSize',
    ol.extent.getSize);

goog.exportSymbol(
    'ol.extent.getTopLeft',
    ol.extent.getTopLeft);

goog.exportSymbol(
    'ol.extent.getTopRight',
    ol.extent.getTopRight);

goog.exportSymbol(
    'ol.extent.getWidth',
    ol.extent.getWidth);

goog.exportSymbol(
    'ol.extent.intersects',
    ol.extent.intersects);

goog.exportSymbol(
    'ol.extent.isEmpty',
    ol.extent.isEmpty);

goog.exportSymbol(
    'ol.extent.applyTransform',
    ol.extent.applyTransform);

goog.exportSymbol(
    'ol.Feature',
    ol.Feature);

goog.exportProperty(
    ol.Feature.prototype,
    'clone',
    ol.Feature.prototype.clone);

goog.exportProperty(
    ol.Feature.prototype,
    'getGeometry',
    ol.Feature.prototype.getGeometry);

goog.exportProperty(
    ol.Feature.prototype,
    'getId',
    ol.Feature.prototype.getId);

goog.exportProperty(
    ol.Feature.prototype,
    'getGeometryName',
    ol.Feature.prototype.getGeometryName);

goog.exportProperty(
    ol.Feature.prototype,
    'getStyle',
    ol.Feature.prototype.getStyle);

goog.exportProperty(
    ol.Feature.prototype,
    'getStyleFunction',
    ol.Feature.prototype.getStyleFunction);

goog.exportProperty(
    ol.Feature.prototype,
    'setGeometry',
    ol.Feature.prototype.setGeometry);

goog.exportProperty(
    ol.Feature.prototype,
    'setStyle',
    ol.Feature.prototype.setStyle);

goog.exportProperty(
    ol.Feature.prototype,
    'setId',
    ol.Feature.prototype.setId);

goog.exportProperty(
    ol.Feature.prototype,
    'setGeometryName',
    ol.Feature.prototype.setGeometryName);

goog.exportSymbol(
    'ol.featureloader.tile',
    ol.featureloader.tile);

goog.exportSymbol(
    'ol.featureloader.xhr',
    ol.featureloader.xhr);

goog.exportSymbol(
    'ol.Geolocation',
    ol.Geolocation);

goog.exportProperty(
    ol.Geolocation.prototype,
    'getAccuracy',
    ol.Geolocation.prototype.getAccuracy);

goog.exportProperty(
    ol.Geolocation.prototype,
    'getAccuracyGeometry',
    ol.Geolocation.prototype.getAccuracyGeometry);

goog.exportProperty(
    ol.Geolocation.prototype,
    'getAltitude',
    ol.Geolocation.prototype.getAltitude);

goog.exportProperty(
    ol.Geolocation.prototype,
    'getAltitudeAccuracy',
    ol.Geolocation.prototype.getAltitudeAccuracy);

goog.exportProperty(
    ol.Geolocation.prototype,
    'getHeading',
    ol.Geolocation.prototype.getHeading);

goog.exportProperty(
    ol.Geolocation.prototype,
    'getPosition',
    ol.Geolocation.prototype.getPosition);

goog.exportProperty(
    ol.Geolocation.prototype,
    'getProjection',
    ol.Geolocation.prototype.getProjection);

goog.exportProperty(
    ol.Geolocation.prototype,
    'getSpeed',
    ol.Geolocation.prototype.getSpeed);

goog.exportProperty(
    ol.Geolocation.prototype,
    'getTracking',
    ol.Geolocation.prototype.getTracking);

goog.exportProperty(
    ol.Geolocation.prototype,
    'getTrackingOptions',
    ol.Geolocation.prototype.getTrackingOptions);

goog.exportProperty(
    ol.Geolocation.prototype,
    'setProjection',
    ol.Geolocation.prototype.setProjection);

goog.exportProperty(
    ol.Geolocation.prototype,
    'setTracking',
    ol.Geolocation.prototype.setTracking);

goog.exportProperty(
    ol.Geolocation.prototype,
    'setTrackingOptions',
    ol.Geolocation.prototype.setTrackingOptions);

goog.exportSymbol(
    'ol.Graticule',
    ol.Graticule);

goog.exportProperty(
    ol.Graticule.prototype,
    'getMap',
    ol.Graticule.prototype.getMap);

goog.exportProperty(
    ol.Graticule.prototype,
    'getMeridians',
    ol.Graticule.prototype.getMeridians);

goog.exportProperty(
    ol.Graticule.prototype,
    'getParallels',
    ol.Graticule.prototype.getParallels);

goog.exportProperty(
    ol.Graticule.prototype,
    'setMap',
    ol.Graticule.prototype.setMap);

goog.exportSymbol(
    'ol.has.DEVICE_PIXEL_RATIO',
    ol.has.DEVICE_PIXEL_RATIO);

goog.exportSymbol(
    'ol.has.CANVAS',
    ol.has.CANVAS);

goog.exportSymbol(
    'ol.has.DEVICE_ORIENTATION',
    ol.has.DEVICE_ORIENTATION);

goog.exportSymbol(
    'ol.has.GEOLOCATION',
    ol.has.GEOLOCATION);

goog.exportSymbol(
    'ol.has.TOUCH',
    ol.has.TOUCH);

goog.exportSymbol(
    'ol.has.WEBGL',
    ol.has.WEBGL);

goog.exportProperty(
    ol.Image.prototype,
    'getImage',
    ol.Image.prototype.getImage);

goog.exportProperty(
    ol.ImageTile.prototype,
    'getImage',
    ol.ImageTile.prototype.getImage);

goog.exportSymbol(
    'ol.Kinetic',
    ol.Kinetic);

goog.exportSymbol(
    'ol.loadingstrategy.all',
    ol.loadingstrategy.all);

goog.exportSymbol(
    'ol.loadingstrategy.bbox',
    ol.loadingstrategy.bbox);

goog.exportSymbol(
    'ol.loadingstrategy.tile',
    ol.loadingstrategy.tile);

goog.exportSymbol(
    'ol.Map',
    ol.Map);

goog.exportProperty(
    ol.Map.prototype,
    'addControl',
    ol.Map.prototype.addControl);

goog.exportProperty(
    ol.Map.prototype,
    'addInteraction',
    ol.Map.prototype.addInteraction);

goog.exportProperty(
    ol.Map.prototype,
    'addLayer',
    ol.Map.prototype.addLayer);

goog.exportProperty(
    ol.Map.prototype,
    'addOverlay',
    ol.Map.prototype.addOverlay);

goog.exportProperty(
    ol.Map.prototype,
    'beforeRender',
    ol.Map.prototype.beforeRender);

goog.exportProperty(
    ol.Map.prototype,
    'forEachFeatureAtPixel',
    ol.Map.prototype.forEachFeatureAtPixel);

goog.exportProperty(
    ol.Map.prototype,
    'forEachLayerAtPixel',
    ol.Map.prototype.forEachLayerAtPixel);

goog.exportProperty(
    ol.Map.prototype,
    'hasFeatureAtPixel',
    ol.Map.prototype.hasFeatureAtPixel);

goog.exportProperty(
    ol.Map.prototype,
    'getEventCoordinate',
    ol.Map.prototype.getEventCoordinate);

goog.exportProperty(
    ol.Map.prototype,
    'getEventPixel',
    ol.Map.prototype.getEventPixel);

goog.exportProperty(
    ol.Map.prototype,
    'getTarget',
    ol.Map.prototype.getTarget);

goog.exportProperty(
    ol.Map.prototype,
    'getTargetElement',
    ol.Map.prototype.getTargetElement);

goog.exportProperty(
    ol.Map.prototype,
    'getCoordinateFromPixel',
    ol.Map.prototype.getCoordinateFromPixel);

goog.exportProperty(
    ol.Map.prototype,
    'getControls',
    ol.Map.prototype.getControls);

goog.exportProperty(
    ol.Map.prototype,
    'getOverlays',
    ol.Map.prototype.getOverlays);

goog.exportProperty(
    ol.Map.prototype,
    'getOverlayById',
    ol.Map.prototype.getOverlayById);

goog.exportProperty(
    ol.Map.prototype,
    'getInteractions',
    ol.Map.prototype.getInteractions);

goog.exportProperty(
    ol.Map.prototype,
    'getLayerGroup',
    ol.Map.prototype.getLayerGroup);

goog.exportProperty(
    ol.Map.prototype,
    'getLayers',
    ol.Map.prototype.getLayers);

goog.exportProperty(
    ol.Map.prototype,
    'getPixelFromCoordinate',
    ol.Map.prototype.getPixelFromCoordinate);

goog.exportProperty(
    ol.Map.prototype,
    'getSize',
    ol.Map.prototype.getSize);

goog.exportProperty(
    ol.Map.prototype,
    'getView',
    ol.Map.prototype.getView);

goog.exportProperty(
    ol.Map.prototype,
    'getViewport',
    ol.Map.prototype.getViewport);

goog.exportProperty(
    ol.Map.prototype,
    'renderSync',
    ol.Map.prototype.renderSync);

goog.exportProperty(
    ol.Map.prototype,
    'render',
    ol.Map.prototype.render);

goog.exportProperty(
    ol.Map.prototype,
    'removeControl',
    ol.Map.prototype.removeControl);

goog.exportProperty(
    ol.Map.prototype,
    'removeInteraction',
    ol.Map.prototype.removeInteraction);

goog.exportProperty(
    ol.Map.prototype,
    'removeLayer',
    ol.Map.prototype.removeLayer);

goog.exportProperty(
    ol.Map.prototype,
    'removeOverlay',
    ol.Map.prototype.removeOverlay);

goog.exportProperty(
    ol.Map.prototype,
    'setLayerGroup',
    ol.Map.prototype.setLayerGroup);

goog.exportProperty(
    ol.Map.prototype,
    'setSize',
    ol.Map.prototype.setSize);

goog.exportProperty(
    ol.Map.prototype,
    'setTarget',
    ol.Map.prototype.setTarget);

goog.exportProperty(
    ol.Map.prototype,
    'setView',
    ol.Map.prototype.setView);

goog.exportProperty(
    ol.Map.prototype,
    'updateSize',
    ol.Map.prototype.updateSize);

goog.exportProperty(
    ol.MapBrowserEvent.prototype,
    'originalEvent',
    ol.MapBrowserEvent.prototype.originalEvent);

goog.exportProperty(
    ol.MapBrowserEvent.prototype,
    'pixel',
    ol.MapBrowserEvent.prototype.pixel);

goog.exportProperty(
    ol.MapBrowserEvent.prototype,
    'coordinate',
    ol.MapBrowserEvent.prototype.coordinate);

goog.exportProperty(
    ol.MapBrowserEvent.prototype,
    'dragging',
    ol.MapBrowserEvent.prototype.dragging);

goog.exportProperty(
    ol.MapBrowserEvent.prototype,
    'preventDefault',
    ol.MapBrowserEvent.prototype.preventDefault);

goog.exportProperty(
    ol.MapBrowserEvent.prototype,
    'stopPropagation',
    ol.MapBrowserEvent.prototype.stopPropagation);

goog.exportProperty(
    ol.MapEvent.prototype,
    'map',
    ol.MapEvent.prototype.map);

goog.exportProperty(
    ol.MapEvent.prototype,
    'frameState',
    ol.MapEvent.prototype.frameState);

goog.exportProperty(
    ol.ObjectEvent.prototype,
    'key',
    ol.ObjectEvent.prototype.key);

goog.exportProperty(
    ol.ObjectEvent.prototype,
    'oldValue',
    ol.ObjectEvent.prototype.oldValue);

goog.exportSymbol(
    'ol.Object',
    ol.Object);

goog.exportProperty(
    ol.Object.prototype,
    'get',
    ol.Object.prototype.get);

goog.exportProperty(
    ol.Object.prototype,
    'getKeys',
    ol.Object.prototype.getKeys);

goog.exportProperty(
    ol.Object.prototype,
    'getProperties',
    ol.Object.prototype.getProperties);

goog.exportProperty(
    ol.Object.prototype,
    'set',
    ol.Object.prototype.set);

goog.exportProperty(
    ol.Object.prototype,
    'setProperties',
    ol.Object.prototype.setProperties);

goog.exportProperty(
    ol.Object.prototype,
    'unset',
    ol.Object.prototype.unset);

goog.exportSymbol(
    'ol.Observable',
    ol.Observable);

goog.exportSymbol(
    'ol.Observable.unByKey',
    ol.Observable.unByKey);

goog.exportProperty(
    ol.Observable.prototype,
    'changed',
    ol.Observable.prototype.changed);

goog.exportProperty(
    ol.Observable.prototype,
    'dispatchEvent',
    ol.Observable.prototype.dispatchEvent);

goog.exportProperty(
    ol.Observable.prototype,
    'getRevision',
    ol.Observable.prototype.getRevision);

goog.exportProperty(
    ol.Observable.prototype,
    'on',
    ol.Observable.prototype.on);

goog.exportProperty(
    ol.Observable.prototype,
    'once',
    ol.Observable.prototype.once);

goog.exportProperty(
    ol.Observable.prototype,
    'un',
    ol.Observable.prototype.un);

goog.exportProperty(
    ol.Observable.prototype,
    'unByKey',
    ol.Observable.prototype.unByKey);

goog.exportSymbol(
    'ol.inherits',
    ol.inherits);

goog.exportSymbol(
    'ol.Overlay',
    ol.Overlay);

goog.exportProperty(
    ol.Overlay.prototype,
    'getElement',
    ol.Overlay.prototype.getElement);

goog.exportProperty(
    ol.Overlay.prototype,
    'getId',
    ol.Overlay.prototype.getId);

goog.exportProperty(
    ol.Overlay.prototype,
    'getMap',
    ol.Overlay.prototype.getMap);

goog.exportProperty(
    ol.Overlay.prototype,
    'getOffset',
    ol.Overlay.prototype.getOffset);

goog.exportProperty(
    ol.Overlay.prototype,
    'getPosition',
    ol.Overlay.prototype.getPosition);

goog.exportProperty(
    ol.Overlay.prototype,
    'getPositioning',
    ol.Overlay.prototype.getPositioning);

goog.exportProperty(
    ol.Overlay.prototype,
    'setElement',
    ol.Overlay.prototype.setElement);

goog.exportProperty(
    ol.Overlay.prototype,
    'setMap',
    ol.Overlay.prototype.setMap);

goog.exportProperty(
    ol.Overlay.prototype,
    'setOffset',
    ol.Overlay.prototype.setOffset);

goog.exportProperty(
    ol.Overlay.prototype,
    'setPosition',
    ol.Overlay.prototype.setPosition);

goog.exportProperty(
    ol.Overlay.prototype,
    'setPositioning',
    ol.Overlay.prototype.setPositioning);

goog.exportSymbol(
    'ol.size.toSize',
    ol.size.toSize);

goog.exportProperty(
    ol.Tile.prototype,
    'getTileCoord',
    ol.Tile.prototype.getTileCoord);

goog.exportProperty(
    ol.VectorTile.prototype,
    'getFormat',
    ol.VectorTile.prototype.getFormat);

goog.exportProperty(
    ol.VectorTile.prototype,
    'setLoader',
    ol.VectorTile.prototype.setLoader);

goog.exportSymbol(
    'ol.View',
    ol.View);

goog.exportProperty(
    ol.View.prototype,
    'constrainCenter',
    ol.View.prototype.constrainCenter);

goog.exportProperty(
    ol.View.prototype,
    'constrainResolution',
    ol.View.prototype.constrainResolution);

goog.exportProperty(
    ol.View.prototype,
    'constrainRotation',
    ol.View.prototype.constrainRotation);

goog.exportProperty(
    ol.View.prototype,
    'getCenter',
    ol.View.prototype.getCenter);

goog.exportProperty(
    ol.View.prototype,
    'calculateExtent',
    ol.View.prototype.calculateExtent);

goog.exportProperty(
    ol.View.prototype,
    'getProjection',
    ol.View.prototype.getProjection);

goog.exportProperty(
    ol.View.prototype,
    'getResolution',
    ol.View.prototype.getResolution);

goog.exportProperty(
    ol.View.prototype,
    'getRotation',
    ol.View.prototype.getRotation);

goog.exportProperty(
    ol.View.prototype,
    'getZoom',
    ol.View.prototype.getZoom);

goog.exportProperty(
    ol.View.prototype,
    'fit',
    ol.View.prototype.fit);

goog.exportProperty(
    ol.View.prototype,
    'centerOn',
    ol.View.prototype.centerOn);

goog.exportProperty(
    ol.View.prototype,
    'rotate',
    ol.View.prototype.rotate);

goog.exportProperty(
    ol.View.prototype,
    'setCenter',
    ol.View.prototype.setCenter);

goog.exportProperty(
    ol.View.prototype,
    'setResolution',
    ol.View.prototype.setResolution);

goog.exportProperty(
    ol.View.prototype,
    'setRotation',
    ol.View.prototype.setRotation);

goog.exportProperty(
    ol.View.prototype,
    'setZoom',
    ol.View.prototype.setZoom);

goog.exportSymbol(
    'ol.xml.getAllTextContent',
    ol.xml.getAllTextContent);

goog.exportSymbol(
    'ol.xml.parse',
    ol.xml.parse);

goog.exportSymbol(
    'M.impl.envolvedExtent.calculate',
    M.impl.envolvedExtent.calculate);

goog.exportSymbol(
    'M.impl.envolvedExtent.calculateFromWMS',
    M.impl.envolvedExtent.calculateFromWMS);

goog.exportSymbol(
    'M.parameter.center',
    M.parameter.center);

goog.exportSymbol(
    'M.impl.utils.generateResolutions',
    M.impl.utils.generateResolutions);

goog.exportSymbol(
    'M.impl.utils.addOverlayImage',
    M.impl.utils.addOverlayImage);

goog.exportSymbol(
    'M.impl.utils.getExtentHeight',
    M.impl.utils.getExtentHeight);

goog.exportSymbol(
    'M.impl.utils.getExtentWidth',
    M.impl.utils.getExtentWidth);

goog.exportSymbol(
    'M.impl.GetCapabilities',
    M.impl.GetCapabilities);

goog.exportProperty(
    M.impl.GetCapabilities.prototype,
    'getLayerExtent',
    M.impl.GetCapabilities.prototype.getLayerExtent);

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

goog.exportSymbol(
    'M.parameter.projection',
    M.parameter.projection);

goog.exportSymbol(
    'M.parameter.resolutions',
    M.parameter.resolutions);

goog.exportSymbol(
    'M.parameter.zoom',
    M.parameter.zoom);

goog.exportProperty(
    ol.webgl.Context.prototype,
    'getGL',
    ol.webgl.Context.prototype.getGL);

goog.exportProperty(
    ol.webgl.Context.prototype,
    'useProgram',
    ol.webgl.Context.prototype.useProgram);

goog.exportSymbol(
    'M.impl.style.STATE',
    M.impl.style.STATE);

goog.exportSymbol(
    'M.impl.style.STATE.DEFAULT',
    M.impl.style.STATE.DEFAULT);

goog.exportSymbol(
    'M.impl.style.STATE.NEW',
    M.impl.style.STATE.NEW);

goog.exportSymbol(
    'M.impl.style.STATE.SELECTED',
    M.impl.style.STATE.SELECTED);

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
    'addControls',
    M.Map.prototype.addControls);

goog.exportProperty(
    M.Map.prototype,
    'removeControls',
    M.Map.prototype.removeControls);

goog.exportProperty(
    M.Map.prototype,
    'removePlugins',
    M.Map.prototype.removePlugins);

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
    'getProjection',
    M.Map.prototype.getProjection);

goog.exportProperty(
    M.Map.prototype,
    'setProjection',
    M.Map.prototype.setProjection);

goog.exportProperty(
    M.Map.prototype,
    'addPlugin',
    M.Map.prototype.addPlugin);

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
    'getPoints',
    M.Map.prototype.getPoints);

goog.exportProperty(
    M.Map.prototype,
    'getMapImpl',
    M.Map.prototype.getMapImpl);

goog.exportSymbol(
    'ol.tilegrid.TileGrid',
    ol.tilegrid.TileGrid);

goog.exportProperty(
    ol.tilegrid.TileGrid.prototype,
    'getMaxZoom',
    ol.tilegrid.TileGrid.prototype.getMaxZoom);

goog.exportProperty(
    ol.tilegrid.TileGrid.prototype,
    'getMinZoom',
    ol.tilegrid.TileGrid.prototype.getMinZoom);

goog.exportProperty(
    ol.tilegrid.TileGrid.prototype,
    'getOrigin',
    ol.tilegrid.TileGrid.prototype.getOrigin);

goog.exportProperty(
    ol.tilegrid.TileGrid.prototype,
    'getResolution',
    ol.tilegrid.TileGrid.prototype.getResolution);

goog.exportProperty(
    ol.tilegrid.TileGrid.prototype,
    'getResolutions',
    ol.tilegrid.TileGrid.prototype.getResolutions);

goog.exportProperty(
    ol.tilegrid.TileGrid.prototype,
    'getTileCoordExtent',
    ol.tilegrid.TileGrid.prototype.getTileCoordExtent);

goog.exportProperty(
    ol.tilegrid.TileGrid.prototype,
    'getTileCoordForCoordAndResolution',
    ol.tilegrid.TileGrid.prototype.getTileCoordForCoordAndResolution);

goog.exportProperty(
    ol.tilegrid.TileGrid.prototype,
    'getTileCoordForCoordAndZ',
    ol.tilegrid.TileGrid.prototype.getTileCoordForCoordAndZ);

goog.exportProperty(
    ol.tilegrid.TileGrid.prototype,
    'getTileSize',
    ol.tilegrid.TileGrid.prototype.getTileSize);

goog.exportSymbol(
    'ol.tilegrid.createXYZ',
    ol.tilegrid.createXYZ);

goog.exportSymbol(
    'ol.tilegrid.WMTS',
    ol.tilegrid.WMTS);

goog.exportProperty(
    ol.tilegrid.WMTS.prototype,
    'getMatrixIds',
    ol.tilegrid.WMTS.prototype.getMatrixIds);

goog.exportSymbol(
    'ol.tilegrid.WMTS.createFromCapabilitiesMatrixSet',
    ol.tilegrid.WMTS.createFromCapabilitiesMatrixSet);

goog.exportSymbol(
    'M.impl.Popup',
    M.impl.Popup);

goog.exportProperty(
    M.impl.Popup.prototype,
    'panMapIfOutOfView',
    M.impl.Popup.prototype.panMapIfOutOfView);

goog.exportProperty(
    M.impl.Popup.prototype,
    'ani',
    M.impl.Popup.prototype.ani);

goog.exportProperty(
    M.impl.Popup.prototype,
    'ani_opts',
    M.impl.Popup.prototype.ani_opts);

goog.exportProperty(
    M.impl.Popup.prototype,
    'show',
    M.impl.Popup.prototype.show);

goog.exportProperty(
    M.impl.Popup.prototype,
    'hide',
    M.impl.Popup.prototype.hide);

goog.exportProperty(
    M.impl.Popup.prototype,
    'setContent',
    M.impl.Popup.prototype.setContent);

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
    'setVisible',
    M.Layer.prototype.setVisible);

goog.exportProperty(
    M.Layer.prototype,
    'inRange',
    M.Layer.prototype.inRange);

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
    'ol.style.AtlasManager',
    ol.style.AtlasManager);

goog.exportSymbol(
    'ol.style.Circle',
    ol.style.Circle);

goog.exportProperty(
    ol.style.Circle.prototype,
    'getFill',
    ol.style.Circle.prototype.getFill);

goog.exportProperty(
    ol.style.Circle.prototype,
    'getImage',
    ol.style.Circle.prototype.getImage);

goog.exportProperty(
    ol.style.Circle.prototype,
    'getRadius',
    ol.style.Circle.prototype.getRadius);

goog.exportProperty(
    ol.style.Circle.prototype,
    'getStroke',
    ol.style.Circle.prototype.getStroke);

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
    'getResolutions',
    M.impl.Map.prototype.getResolutions);

goog.exportProperty(
    M.impl.Map.prototype,
    'setResolutions',
    M.impl.Map.prototype.setResolutions);

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
    'addPopup',
    M.impl.Map.prototype.addPopup);

goog.exportProperty(
    M.impl.Map.prototype,
    'removePopup',
    M.impl.Map.prototype.removePopup);

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
    'updateResolutionsFromBaseLayer',
    M.impl.Map.prototype.updateResolutionsFromBaseLayer);

goog.exportProperty(
    M.impl.Map.prototype,
    'addLabel',
    M.impl.Map.prototype.addLabel);

goog.exportProperty(
    M.impl.Map.prototype,
    'getLabel',
    M.impl.Map.prototype.getLabel);

goog.exportProperty(
    M.impl.Map.prototype,
    'removeLabel',
    M.impl.Map.prototype.removeLabel);

goog.exportProperty(
    M.impl.Map.prototype,
    'drawPoints',
    M.impl.Map.prototype.drawPoints);

goog.exportProperty(
    M.impl.Map.prototype,
    'drawFeatures',
    M.impl.Map.prototype.drawFeatures);

goog.exportProperty(
    M.impl.Map.prototype,
    'getPoints',
    M.impl.Map.prototype.getPoints);

goog.exportProperty(
    M.impl.Map.prototype,
    'removeFeatures',
    M.impl.Map.prototype.removeFeatures);

goog.exportProperty(
    M.impl.Map.prototype,
    'getDrawLayer',
    M.impl.Map.prototype.getDrawLayer);

goog.exportProperty(
    M.impl.Map.prototype,
    'getFeaturesHandler',
    M.impl.Map.prototype.getFeaturesHandler);

goog.exportProperty(
    M.impl.Map.prototype,
    'setFacadeMap',
    M.impl.Map.prototype.setFacadeMap);

goog.exportSymbol(
    'M.impl.Map.Z_INDEX',
    M.impl.Map.Z_INDEX);

goog.exportSymbol(
    'ol.style.Fill',
    ol.style.Fill);

goog.exportProperty(
    ol.style.Fill.prototype,
    'getColor',
    ol.style.Fill.prototype.getColor);

goog.exportProperty(
    ol.style.Fill.prototype,
    'setColor',
    ol.style.Fill.prototype.setColor);

goog.exportSymbol(
    'ol.style.Icon',
    ol.style.Icon);

goog.exportProperty(
    ol.style.Icon.prototype,
    'getAnchor',
    ol.style.Icon.prototype.getAnchor);

goog.exportProperty(
    ol.style.Icon.prototype,
    'getImage',
    ol.style.Icon.prototype.getImage);

goog.exportProperty(
    ol.style.Icon.prototype,
    'getOrigin',
    ol.style.Icon.prototype.getOrigin);

goog.exportProperty(
    ol.style.Icon.prototype,
    'getSrc',
    ol.style.Icon.prototype.getSrc);

goog.exportProperty(
    ol.style.Icon.prototype,
    'getSize',
    ol.style.Icon.prototype.getSize);

goog.exportProperty(
    ol.style.Icon.prototype,
    'load',
    ol.style.Icon.prototype.load);

goog.exportSymbol(
    'ol.style.Image',
    ol.style.Image);

goog.exportProperty(
    ol.style.Image.prototype,
    'getOpacity',
    ol.style.Image.prototype.getOpacity);

goog.exportProperty(
    ol.style.Image.prototype,
    'getRotateWithView',
    ol.style.Image.prototype.getRotateWithView);

goog.exportProperty(
    ol.style.Image.prototype,
    'getRotation',
    ol.style.Image.prototype.getRotation);

goog.exportProperty(
    ol.style.Image.prototype,
    'getScale',
    ol.style.Image.prototype.getScale);

goog.exportProperty(
    ol.style.Image.prototype,
    'getSnapToPixel',
    ol.style.Image.prototype.getSnapToPixel);

goog.exportProperty(
    ol.style.Image.prototype,
    'setOpacity',
    ol.style.Image.prototype.setOpacity);

goog.exportProperty(
    ol.style.Image.prototype,
    'setRotation',
    ol.style.Image.prototype.setRotation);

goog.exportProperty(
    ol.style.Image.prototype,
    'setScale',
    ol.style.Image.prototype.setScale);

goog.exportSymbol(
    'ol.style.RegularShape',
    ol.style.RegularShape);

goog.exportProperty(
    ol.style.RegularShape.prototype,
    'getAnchor',
    ol.style.RegularShape.prototype.getAnchor);

goog.exportProperty(
    ol.style.RegularShape.prototype,
    'getAngle',
    ol.style.RegularShape.prototype.getAngle);

goog.exportProperty(
    ol.style.RegularShape.prototype,
    'getFill',
    ol.style.RegularShape.prototype.getFill);

goog.exportProperty(
    ol.style.RegularShape.prototype,
    'getImage',
    ol.style.RegularShape.prototype.getImage);

goog.exportProperty(
    ol.style.RegularShape.prototype,
    'getOrigin',
    ol.style.RegularShape.prototype.getOrigin);

goog.exportProperty(
    ol.style.RegularShape.prototype,
    'getPoints',
    ol.style.RegularShape.prototype.getPoints);

goog.exportProperty(
    ol.style.RegularShape.prototype,
    'getRadius',
    ol.style.RegularShape.prototype.getRadius);

goog.exportProperty(
    ol.style.RegularShape.prototype,
    'getRadius2',
    ol.style.RegularShape.prototype.getRadius2);

goog.exportProperty(
    ol.style.RegularShape.prototype,
    'getSize',
    ol.style.RegularShape.prototype.getSize);

goog.exportProperty(
    ol.style.RegularShape.prototype,
    'getStroke',
    ol.style.RegularShape.prototype.getStroke);

goog.exportSymbol(
    'ol.style.Stroke',
    ol.style.Stroke);

goog.exportProperty(
    ol.style.Stroke.prototype,
    'getColor',
    ol.style.Stroke.prototype.getColor);

goog.exportProperty(
    ol.style.Stroke.prototype,
    'getLineCap',
    ol.style.Stroke.prototype.getLineCap);

goog.exportProperty(
    ol.style.Stroke.prototype,
    'getLineDash',
    ol.style.Stroke.prototype.getLineDash);

goog.exportProperty(
    ol.style.Stroke.prototype,
    'getLineJoin',
    ol.style.Stroke.prototype.getLineJoin);

goog.exportProperty(
    ol.style.Stroke.prototype,
    'getMiterLimit',
    ol.style.Stroke.prototype.getMiterLimit);

goog.exportProperty(
    ol.style.Stroke.prototype,
    'getWidth',
    ol.style.Stroke.prototype.getWidth);

goog.exportProperty(
    ol.style.Stroke.prototype,
    'setColor',
    ol.style.Stroke.prototype.setColor);

goog.exportProperty(
    ol.style.Stroke.prototype,
    'setLineCap',
    ol.style.Stroke.prototype.setLineCap);

goog.exportProperty(
    ol.style.Stroke.prototype,
    'setLineDash',
    ol.style.Stroke.prototype.setLineDash);

goog.exportProperty(
    ol.style.Stroke.prototype,
    'setLineJoin',
    ol.style.Stroke.prototype.setLineJoin);

goog.exportProperty(
    ol.style.Stroke.prototype,
    'setMiterLimit',
    ol.style.Stroke.prototype.setMiterLimit);

goog.exportProperty(
    ol.style.Stroke.prototype,
    'setWidth',
    ol.style.Stroke.prototype.setWidth);

goog.exportSymbol(
    'ol.style.Style',
    ol.style.Style);

goog.exportProperty(
    ol.style.Style.prototype,
    'getGeometry',
    ol.style.Style.prototype.getGeometry);

goog.exportProperty(
    ol.style.Style.prototype,
    'getGeometryFunction',
    ol.style.Style.prototype.getGeometryFunction);

goog.exportProperty(
    ol.style.Style.prototype,
    'getFill',
    ol.style.Style.prototype.getFill);

goog.exportProperty(
    ol.style.Style.prototype,
    'getImage',
    ol.style.Style.prototype.getImage);

goog.exportProperty(
    ol.style.Style.prototype,
    'getStroke',
    ol.style.Style.prototype.getStroke);

goog.exportProperty(
    ol.style.Style.prototype,
    'getText',
    ol.style.Style.prototype.getText);

goog.exportProperty(
    ol.style.Style.prototype,
    'getZIndex',
    ol.style.Style.prototype.getZIndex);

goog.exportProperty(
    ol.style.Style.prototype,
    'setGeometry',
    ol.style.Style.prototype.setGeometry);

goog.exportProperty(
    ol.style.Style.prototype,
    'setZIndex',
    ol.style.Style.prototype.setZIndex);

goog.exportSymbol(
    'ol.style.Text',
    ol.style.Text);

goog.exportProperty(
    ol.style.Text.prototype,
    'getFont',
    ol.style.Text.prototype.getFont);

goog.exportProperty(
    ol.style.Text.prototype,
    'getOffsetX',
    ol.style.Text.prototype.getOffsetX);

goog.exportProperty(
    ol.style.Text.prototype,
    'getOffsetY',
    ol.style.Text.prototype.getOffsetY);

goog.exportProperty(
    ol.style.Text.prototype,
    'getFill',
    ol.style.Text.prototype.getFill);

goog.exportProperty(
    ol.style.Text.prototype,
    'getRotation',
    ol.style.Text.prototype.getRotation);

goog.exportProperty(
    ol.style.Text.prototype,
    'getScale',
    ol.style.Text.prototype.getScale);

goog.exportProperty(
    ol.style.Text.prototype,
    'getStroke',
    ol.style.Text.prototype.getStroke);

goog.exportProperty(
    ol.style.Text.prototype,
    'getText',
    ol.style.Text.prototype.getText);

goog.exportProperty(
    ol.style.Text.prototype,
    'getTextAlign',
    ol.style.Text.prototype.getTextAlign);

goog.exportProperty(
    ol.style.Text.prototype,
    'getTextBaseline',
    ol.style.Text.prototype.getTextBaseline);

goog.exportProperty(
    ol.style.Text.prototype,
    'setFont',
    ol.style.Text.prototype.setFont);

goog.exportProperty(
    ol.style.Text.prototype,
    'setOffsetX',
    ol.style.Text.prototype.setOffsetX);

goog.exportProperty(
    ol.style.Text.prototype,
    'setOffsetY',
    ol.style.Text.prototype.setOffsetY);

goog.exportProperty(
    ol.style.Text.prototype,
    'setFill',
    ol.style.Text.prototype.setFill);

goog.exportProperty(
    ol.style.Text.prototype,
    'setRotation',
    ol.style.Text.prototype.setRotation);

goog.exportProperty(
    ol.style.Text.prototype,
    'setScale',
    ol.style.Text.prototype.setScale);

goog.exportProperty(
    ol.style.Text.prototype,
    'setStroke',
    ol.style.Text.prototype.setStroke);

goog.exportProperty(
    ol.style.Text.prototype,
    'setText',
    ol.style.Text.prototype.setText);

goog.exportProperty(
    ol.style.Text.prototype,
    'setTextAlign',
    ol.style.Text.prototype.setTextAlign);

goog.exportProperty(
    ol.style.Text.prototype,
    'setTextBaseline',
    ol.style.Text.prototype.setTextBaseline);

goog.exportSymbol(
    'M.exception',
    M.exception);

goog.exportSymbol(
    'M.impl.layer.Draw',
    M.impl.layer.Draw);

goog.exportProperty(
    M.impl.layer.Draw.prototype,
    'addTo',
    M.impl.layer.Draw.prototype.addTo);

goog.exportProperty(
    M.impl.layer.Draw.prototype,
    'selectFeatures',
    M.impl.layer.Draw.prototype.selectFeatures);

goog.exportProperty(
    M.impl.layer.Draw.prototype,
    'unselectFeatures',
    M.impl.layer.Draw.prototype.unselectFeatures);

goog.exportProperty(
    M.impl.layer.Draw.prototype,
    'drawPoints',
    M.impl.layer.Draw.prototype.drawPoints);

goog.exportProperty(
    M.impl.layer.Draw.prototype,
    'drawGeoJSON',
    M.impl.layer.Draw.prototype.drawGeoJSON);

goog.exportProperty(
    M.impl.layer.Draw.prototype,
    'drawFeatures',
    M.impl.layer.Draw.prototype.drawFeatures);

goog.exportProperty(
    M.impl.layer.Draw.prototype,
    'removeFeatures',
    M.impl.layer.Draw.prototype.removeFeatures);

goog.exportProperty(
    M.impl.layer.Draw.prototype,
    'getPoints',
    M.impl.layer.Draw.prototype.getPoints);

goog.exportProperty(
    M.impl.layer.Draw.prototype,
    'destroy',
    M.impl.layer.Draw.prototype.destroy);

goog.exportProperty(
    M.impl.layer.Draw.prototype,
    'equals',
    M.impl.layer.Draw.prototype.equals);

goog.exportSymbol(
    'M.impl.layer.KML',
    M.impl.layer.KML);

goog.exportProperty(
    M.impl.layer.KML.prototype,
    'setVisible',
    M.impl.layer.KML.prototype.setVisible);

goog.exportProperty(
    M.impl.layer.KML.prototype,
    'addTo',
    M.impl.layer.KML.prototype.addTo);

goog.exportProperty(
    M.impl.layer.KML.prototype,
    'selectFeatures',
    M.impl.layer.KML.prototype.selectFeatures);

goog.exportProperty(
    M.impl.layer.KML.prototype,
    'unselectFeatures',
    M.impl.layer.KML.prototype.unselectFeatures);

goog.exportProperty(
    M.impl.layer.KML.prototype,
    'setScreenOverlayImg',
    M.impl.layer.KML.prototype.setScreenOverlayImg);

goog.exportProperty(
    M.impl.layer.KML.prototype,
    'destroy',
    M.impl.layer.KML.prototype.destroy);

goog.exportProperty(
    M.impl.layer.KML.prototype,
    'equals',
    M.impl.layer.KML.prototype.equals);

goog.exportSymbol(
    'M.Control',
    M.Control);

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
    'activate',
    M.Control.prototype.activate);

goog.exportProperty(
    M.Control.prototype,
    'deactivate',
    M.Control.prototype.deactivate);

goog.exportSymbol(
    'M.impl.Layer',
    M.impl.Layer);

goog.exportProperty(
    M.impl.Layer.prototype,
    'isVisible',
    M.impl.Layer.prototype.isVisible);

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
    'setZIndex',
    M.impl.Layer.prototype.setZIndex);

goog.exportProperty(
    M.impl.Layer.prototype,
    'getOL3Layer',
    M.impl.Layer.prototype.getOL3Layer);

goog.exportProperty(
    M.impl.Layer.prototype,
    'unselectFeatures',
    M.impl.Layer.prototype.unselectFeatures);

goog.exportProperty(
    M.impl.Layer.prototype,
    'selectFeatures',
    M.impl.Layer.prototype.selectFeatures);

goog.exportSymbol(
    'M.control.GetFeatureInfo',
    M.control.GetFeatureInfo);

goog.exportProperty(
    M.control.GetFeatureInfo.prototype,
    'createView',
    M.control.GetFeatureInfo.prototype.createView);

goog.exportProperty(
    M.control.GetFeatureInfo.prototype,
    'equals',
    M.control.GetFeatureInfo.prototype.equals);

goog.exportSymbol(
    'M.control.GetFeatureInfo.TEMPLATE',
    M.control.GetFeatureInfo.TEMPLATE);

goog.exportSymbol(
    'M.control.GetFeatureInfo.POPUP_TEMPLATE',
    M.control.GetFeatureInfo.POPUP_TEMPLATE);

goog.exportSymbol(
    'M.impl.layer.OSM',
    M.impl.layer.OSM);

goog.exportProperty(
    M.impl.layer.OSM.prototype,
    'setVisible',
    M.impl.layer.OSM.prototype.setVisible);

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

goog.exportSymbol(
    'M.control.LayerSwitcher.NAME',
    M.control.LayerSwitcher.NAME);

goog.exportSymbol(
    'M.control.LayerSwitcher.TEMPLATE',
    M.control.LayerSwitcher.TEMPLATE);

goog.exportSymbol(
    'M.impl.layer.WFS',
    M.impl.layer.WFS);

goog.exportProperty(
    M.impl.layer.WFS.prototype,
    'addTo',
    M.impl.layer.WFS.prototype.addTo);

goog.exportProperty(
    M.impl.layer.WFS.prototype,
    'getFeatureURL_',
    M.impl.layer.WFS.prototype.getFeatureURL_);

goog.exportProperty(
    M.impl.layer.WFS.prototype,
    'destroy',
    M.impl.layer.WFS.prototype.destroy);

goog.exportProperty(
    M.impl.layer.WFS.prototype,
    'equals',
    M.impl.layer.WFS.prototype.equals);

goog.exportSymbol(
    'M.control.Location',
    M.control.Location);

goog.exportProperty(
    M.control.Location.prototype,
    'createView',
    M.control.Location.prototype.createView);

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
    'M.impl.layer.WMC',
    M.impl.layer.WMC);

goog.exportProperty(
    M.impl.layer.WMC.prototype,
    'addTo',
    M.impl.layer.WMC.prototype.addTo);

goog.exportProperty(
    M.impl.layer.WMC.prototype,
    'select',
    M.impl.layer.WMC.prototype.select);

goog.exportProperty(
    M.impl.layer.WMC.prototype,
    'unselect',
    M.impl.layer.WMC.prototype.unselect);

goog.exportProperty(
    M.impl.layer.WMC.prototype,
    'loadLayers',
    M.impl.layer.WMC.prototype.loadLayers);

goog.exportProperty(
    M.impl.layer.WMC.prototype,
    'getMaxExtent',
    M.impl.layer.WMC.prototype.getMaxExtent);

goog.exportProperty(
    M.impl.layer.WMC.prototype,
    'getLayers',
    M.impl.layer.WMC.prototype.getLayers);

goog.exportProperty(
    M.impl.layer.WMC.prototype,
    'destroy',
    M.impl.layer.WMC.prototype.destroy);

goog.exportProperty(
    M.impl.layer.WMC.prototype,
    'equals',
    M.impl.layer.WMC.prototype.equals);

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
    'M.impl.layer.WMS',
    M.impl.layer.WMS);

goog.exportProperty(
    M.impl.layer.WMS.prototype,
    'setVisible',
    M.impl.layer.WMS.prototype.setVisible);

goog.exportProperty(
    M.impl.layer.WMS.prototype,
    'addTo',
    M.impl.layer.WMS.prototype.addTo);

goog.exportProperty(
    M.impl.layer.WMS.prototype,
    'setResolutions',
    M.impl.layer.WMS.prototype.setResolutions);

goog.exportProperty(
    M.impl.layer.WMS.prototype,
    'getExtent',
    M.impl.layer.WMS.prototype.getExtent);

goog.exportProperty(
    M.impl.layer.WMS.prototype,
    'getMinResolution',
    M.impl.layer.WMS.prototype.getMinResolution);

goog.exportProperty(
    M.impl.layer.WMS.prototype,
    'getMaxResolution',
    M.impl.layer.WMS.prototype.getMaxResolution);

goog.exportProperty(
    M.impl.layer.WMS.prototype,
    'getLayers',
    M.impl.layer.WMS.prototype.getLayers);

goog.exportProperty(
    M.impl.layer.WMS.prototype,
    'getCapabilities',
    M.impl.layer.WMS.prototype.getCapabilities);

goog.exportProperty(
    M.impl.layer.WMS.prototype,
    'destroy',
    M.impl.layer.WMS.prototype.destroy);

goog.exportProperty(
    M.impl.layer.WMS.prototype,
    'equals',
    M.impl.layer.WMS.prototype.equals);

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
    'M.impl.layer.WMTS',
    M.impl.layer.WMTS);

goog.exportProperty(
    M.impl.layer.WMTS.prototype,
    'addTo',
    M.impl.layer.WMTS.prototype.addTo);

goog.exportProperty(
    M.impl.layer.WMTS.prototype,
    'setResolutions',
    M.impl.layer.WMTS.prototype.setResolutions);

goog.exportProperty(
    M.impl.layer.WMTS.prototype,
    'destroy',
    M.impl.layer.WMTS.prototype.destroy);

goog.exportProperty(
    M.impl.layer.WMTS.prototype,
    'equals',
    M.impl.layer.WMTS.prototype.equals);

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

goog.exportSymbol(
    'M.impl.handler.Features',
    M.impl.handler.Features);

goog.exportProperty(
    M.impl.handler.Features.prototype,
    'addLayer',
    M.impl.handler.Features.prototype.addLayer);

goog.exportProperty(
    M.impl.handler.Features.prototype,
    'removeLayer',
    M.impl.handler.Features.prototype.removeLayer);

goog.exportProperty(
    M.impl.handler.Features.prototype,
    'destroy',
    M.impl.handler.Features.prototype.destroy);

goog.exportSymbol(
    'ol.Sphere',
    ol.Sphere);

goog.exportProperty(
    ol.Sphere.prototype,
    'geodesicArea',
    ol.Sphere.prototype.geodesicArea);

goog.exportProperty(
    ol.Sphere.prototype,
    'haversineDistance',
    ol.Sphere.prototype.haversineDistance);

goog.exportSymbol(
    'M.impl.format.GeoJSON',
    M.impl.format.GeoJSON);

goog.exportSymbol(
    'ol.source.BingMaps',
    ol.source.BingMaps);

goog.exportSymbol(
    'ol.source.BingMaps.TOS_ATTRIBUTION',
    ol.source.BingMaps.TOS_ATTRIBUTION);

goog.exportSymbol(
    'ol.source.Cluster',
    ol.source.Cluster);

goog.exportProperty(
    ol.source.Cluster.prototype,
    'getSource',
    ol.source.Cluster.prototype.getSource);

goog.exportSymbol(
    'ol.source.ImageCanvas',
    ol.source.ImageCanvas);

goog.exportSymbol(
    'ol.source.ImageMapGuide',
    ol.source.ImageMapGuide);

goog.exportProperty(
    ol.source.ImageMapGuide.prototype,
    'getParams',
    ol.source.ImageMapGuide.prototype.getParams);

goog.exportProperty(
    ol.source.ImageMapGuide.prototype,
    'getImageLoadFunction',
    ol.source.ImageMapGuide.prototype.getImageLoadFunction);

goog.exportProperty(
    ol.source.ImageMapGuide.prototype,
    'updateParams',
    ol.source.ImageMapGuide.prototype.updateParams);

goog.exportProperty(
    ol.source.ImageMapGuide.prototype,
    'setImageLoadFunction',
    ol.source.ImageMapGuide.prototype.setImageLoadFunction);

goog.exportSymbol(
    'ol.source.Image',
    ol.source.Image);

goog.exportProperty(
    ol.source.ImageEvent.prototype,
    'image',
    ol.source.ImageEvent.prototype.image);

goog.exportSymbol(
    'ol.source.ImageStatic',
    ol.source.ImageStatic);

goog.exportSymbol(
    'ol.source.ImageVector',
    ol.source.ImageVector);

goog.exportProperty(
    ol.source.ImageVector.prototype,
    'getSource',
    ol.source.ImageVector.prototype.getSource);

goog.exportProperty(
    ol.source.ImageVector.prototype,
    'getStyle',
    ol.source.ImageVector.prototype.getStyle);

goog.exportProperty(
    ol.source.ImageVector.prototype,
    'getStyleFunction',
    ol.source.ImageVector.prototype.getStyleFunction);

goog.exportProperty(
    ol.source.ImageVector.prototype,
    'setStyle',
    ol.source.ImageVector.prototype.setStyle);

goog.exportSymbol(
    'ol.source.ImageWMS',
    ol.source.ImageWMS);

goog.exportProperty(
    ol.source.ImageWMS.prototype,
    'getGetFeatureInfoUrl',
    ol.source.ImageWMS.prototype.getGetFeatureInfoUrl);

goog.exportProperty(
    ol.source.ImageWMS.prototype,
    'getParams',
    ol.source.ImageWMS.prototype.getParams);

goog.exportProperty(
    ol.source.ImageWMS.prototype,
    'getImageLoadFunction',
    ol.source.ImageWMS.prototype.getImageLoadFunction);

goog.exportProperty(
    ol.source.ImageWMS.prototype,
    'getUrl',
    ol.source.ImageWMS.prototype.getUrl);

goog.exportProperty(
    ol.source.ImageWMS.prototype,
    'setImageLoadFunction',
    ol.source.ImageWMS.prototype.setImageLoadFunction);

goog.exportProperty(
    ol.source.ImageWMS.prototype,
    'setUrl',
    ol.source.ImageWMS.prototype.setUrl);

goog.exportProperty(
    ol.source.ImageWMS.prototype,
    'updateParams',
    ol.source.ImageWMS.prototype.updateParams);

goog.exportSymbol(
    'ol.source.MapQuest',
    ol.source.MapQuest);

goog.exportProperty(
    ol.source.MapQuest.prototype,
    'getLayer',
    ol.source.MapQuest.prototype.getLayer);

goog.exportSymbol(
    'ol.source.OSM',
    ol.source.OSM);

goog.exportSymbol(
    'ol.source.OSM.ATTRIBUTION',
    ol.source.OSM.ATTRIBUTION);

goog.exportSymbol(
    'ol.source.Raster',
    ol.source.Raster);

goog.exportProperty(
    ol.source.Raster.prototype,
    'setOperation',
    ol.source.Raster.prototype.setOperation);

goog.exportProperty(
    ol.source.RasterEvent.prototype,
    'extent',
    ol.source.RasterEvent.prototype.extent);

goog.exportProperty(
    ol.source.RasterEvent.prototype,
    'resolution',
    ol.source.RasterEvent.prototype.resolution);

goog.exportProperty(
    ol.source.RasterEvent.prototype,
    'data',
    ol.source.RasterEvent.prototype.data);

goog.exportSymbol(
    'ol.source.Source',
    ol.source.Source);

goog.exportProperty(
    ol.source.Source.prototype,
    'getAttributions',
    ol.source.Source.prototype.getAttributions);

goog.exportProperty(
    ol.source.Source.prototype,
    'getLogo',
    ol.source.Source.prototype.getLogo);

goog.exportProperty(
    ol.source.Source.prototype,
    'getProjection',
    ol.source.Source.prototype.getProjection);

goog.exportProperty(
    ol.source.Source.prototype,
    'getState',
    ol.source.Source.prototype.getState);

goog.exportProperty(
    ol.source.Source.prototype,
    'setAttributions',
    ol.source.Source.prototype.setAttributions);

goog.exportSymbol(
    'ol.source.Stamen',
    ol.source.Stamen);

goog.exportSymbol(
    'ol.source.TileArcGISRest',
    ol.source.TileArcGISRest);

goog.exportProperty(
    ol.source.TileArcGISRest.prototype,
    'getParams',
    ol.source.TileArcGISRest.prototype.getParams);

goog.exportProperty(
    ol.source.TileArcGISRest.prototype,
    'updateParams',
    ol.source.TileArcGISRest.prototype.updateParams);

goog.exportSymbol(
    'ol.source.TileDebug',
    ol.source.TileDebug);

goog.exportSymbol(
    'ol.source.TileImage',
    ol.source.TileImage);

goog.exportProperty(
    ol.source.TileImage.prototype,
    'setRenderReprojectionEdges',
    ol.source.TileImage.prototype.setRenderReprojectionEdges);

goog.exportProperty(
    ol.source.TileImage.prototype,
    'setTileGridForProjection',
    ol.source.TileImage.prototype.setTileGridForProjection);

goog.exportSymbol(
    'ol.source.TileJSON',
    ol.source.TileJSON);

goog.exportSymbol(
    'ol.source.Tile',
    ol.source.Tile);

goog.exportProperty(
    ol.source.Tile.prototype,
    'getTileGrid',
    ol.source.Tile.prototype.getTileGrid);

goog.exportProperty(
    ol.source.TileEvent.prototype,
    'tile',
    ol.source.TileEvent.prototype.tile);

goog.exportSymbol(
    'ol.source.TileUTFGrid',
    ol.source.TileUTFGrid);

goog.exportProperty(
    ol.source.TileUTFGrid.prototype,
    'getTemplate',
    ol.source.TileUTFGrid.prototype.getTemplate);

goog.exportProperty(
    ol.source.TileUTFGrid.prototype,
    'forDataAtCoordinateAndResolution',
    ol.source.TileUTFGrid.prototype.forDataAtCoordinateAndResolution);

goog.exportSymbol(
    'ol.source.TileWMS',
    ol.source.TileWMS);

goog.exportProperty(
    ol.source.TileWMS.prototype,
    'getGetFeatureInfoUrl',
    ol.source.TileWMS.prototype.getGetFeatureInfoUrl);

goog.exportProperty(
    ol.source.TileWMS.prototype,
    'getParams',
    ol.source.TileWMS.prototype.getParams);

goog.exportProperty(
    ol.source.TileWMS.prototype,
    'updateParams',
    ol.source.TileWMS.prototype.updateParams);

goog.exportProperty(
    ol.source.UrlTile.prototype,
    'getTileLoadFunction',
    ol.source.UrlTile.prototype.getTileLoadFunction);

goog.exportProperty(
    ol.source.UrlTile.prototype,
    'getTileUrlFunction',
    ol.source.UrlTile.prototype.getTileUrlFunction);

goog.exportProperty(
    ol.source.UrlTile.prototype,
    'getUrls',
    ol.source.UrlTile.prototype.getUrls);

goog.exportProperty(
    ol.source.UrlTile.prototype,
    'setTileLoadFunction',
    ol.source.UrlTile.prototype.setTileLoadFunction);

goog.exportProperty(
    ol.source.UrlTile.prototype,
    'setTileUrlFunction',
    ol.source.UrlTile.prototype.setTileUrlFunction);

goog.exportProperty(
    ol.source.UrlTile.prototype,
    'setUrl',
    ol.source.UrlTile.prototype.setUrl);

goog.exportProperty(
    ol.source.UrlTile.prototype,
    'setUrls',
    ol.source.UrlTile.prototype.setUrls);

goog.exportSymbol(
    'ol.source.Vector',
    ol.source.Vector);

goog.exportProperty(
    ol.source.Vector.prototype,
    'addFeature',
    ol.source.Vector.prototype.addFeature);

goog.exportProperty(
    ol.source.Vector.prototype,
    'addFeatures',
    ol.source.Vector.prototype.addFeatures);

goog.exportProperty(
    ol.source.Vector.prototype,
    'clear',
    ol.source.Vector.prototype.clear);

goog.exportProperty(
    ol.source.Vector.prototype,
    'forEachFeature',
    ol.source.Vector.prototype.forEachFeature);

goog.exportProperty(
    ol.source.Vector.prototype,
    'forEachFeatureInExtent',
    ol.source.Vector.prototype.forEachFeatureInExtent);

goog.exportProperty(
    ol.source.Vector.prototype,
    'forEachFeatureIntersectingExtent',
    ol.source.Vector.prototype.forEachFeatureIntersectingExtent);

goog.exportProperty(
    ol.source.Vector.prototype,
    'getFeaturesCollection',
    ol.source.Vector.prototype.getFeaturesCollection);

goog.exportProperty(
    ol.source.Vector.prototype,
    'getFeatures',
    ol.source.Vector.prototype.getFeatures);

goog.exportProperty(
    ol.source.Vector.prototype,
    'getFeaturesAtCoordinate',
    ol.source.Vector.prototype.getFeaturesAtCoordinate);

goog.exportProperty(
    ol.source.Vector.prototype,
    'getFeaturesInExtent',
    ol.source.Vector.prototype.getFeaturesInExtent);

goog.exportProperty(
    ol.source.Vector.prototype,
    'getClosestFeatureToCoordinate',
    ol.source.Vector.prototype.getClosestFeatureToCoordinate);

goog.exportProperty(
    ol.source.Vector.prototype,
    'getExtent',
    ol.source.Vector.prototype.getExtent);

goog.exportProperty(
    ol.source.Vector.prototype,
    'getFeatureById',
    ol.source.Vector.prototype.getFeatureById);

goog.exportProperty(
    ol.source.Vector.prototype,
    'removeFeature',
    ol.source.Vector.prototype.removeFeature);

goog.exportProperty(
    ol.source.VectorEvent.prototype,
    'feature',
    ol.source.VectorEvent.prototype.feature);

goog.exportSymbol(
    'ol.source.VectorTile',
    ol.source.VectorTile);

goog.exportSymbol(
    'ol.source.WMTS',
    ol.source.WMTS);

goog.exportProperty(
    ol.source.WMTS.prototype,
    'getDimensions',
    ol.source.WMTS.prototype.getDimensions);

goog.exportProperty(
    ol.source.WMTS.prototype,
    'getFormat',
    ol.source.WMTS.prototype.getFormat);

goog.exportProperty(
    ol.source.WMTS.prototype,
    'getLayer',
    ol.source.WMTS.prototype.getLayer);

goog.exportProperty(
    ol.source.WMTS.prototype,
    'getMatrixSet',
    ol.source.WMTS.prototype.getMatrixSet);

goog.exportProperty(
    ol.source.WMTS.prototype,
    'getRequestEncoding',
    ol.source.WMTS.prototype.getRequestEncoding);

goog.exportProperty(
    ol.source.WMTS.prototype,
    'getStyle',
    ol.source.WMTS.prototype.getStyle);

goog.exportProperty(
    ol.source.WMTS.prototype,
    'getVersion',
    ol.source.WMTS.prototype.getVersion);

goog.exportProperty(
    ol.source.WMTS.prototype,
    'updateDimensions',
    ol.source.WMTS.prototype.updateDimensions);

goog.exportSymbol(
    'ol.source.WMTS.optionsFromCapabilities',
    ol.source.WMTS.optionsFromCapabilities);

goog.exportSymbol(
    'ol.source.XYZ',
    ol.source.XYZ);

goog.exportSymbol(
    'ol.source.Zoomify',
    ol.source.Zoomify);

goog.exportSymbol(
    'M.impl.format.WMTSCapabilities',
    M.impl.format.WMTSCapabilities);

goog.exportProperty(
    M.impl.format.WMTSCapabilities.prototype,
    'read',
    M.impl.format.WMTSCapabilities.prototype.read);

goog.exportProperty(
    M.impl.format.WMTSCapabilities.prototype,
    'getMatrixSet',
    M.impl.format.WMTSCapabilities.prototype.getMatrixSet);

goog.exportProperty(
    M.impl.format.WMTSCapabilities.prototype,
    'getMatrixIds',
    M.impl.format.WMTSCapabilities.prototype.getMatrixIds);

goog.exportProperty(
    M.impl.format.WMTSCapabilities.prototype,
    'getFormat',
    M.impl.format.WMTSCapabilities.prototype.getFormat);

goog.exportProperty(
    M.impl.format.WMTSCapabilities.prototype,
    'getOptionsFromCapabilities',
    M.impl.format.WMTSCapabilities.prototype.getOptionsFromCapabilities);

goog.exportSymbol(
    'M.impl.format.WMSCapabilities',
    M.impl.format.WMSCapabilities);

goog.exportSymbol(
    'M.impl.format.WMC',
    M.impl.format.WMC);

goog.exportProperty(
    M.impl.format.WMC.prototype,
    'readFromDocument',
    M.impl.format.WMC.prototype.readFromDocument);

goog.exportSymbol(
    'M.impl.format.WMC.v110',
    M.impl.format.WMC.v110);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read',
    M.impl.format.WMC.v110.prototype.read);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'runChildNodes',
    M.impl.format.WMC.v110.prototype.runChildNodes);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'getNamespacePrefix',
    M.impl.format.WMC.v110.prototype.getNamespacePrefix);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_sld_MinScaleDenominator',
    M.impl.format.WMC.v110.prototype.read_sld_MinScaleDenominator);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_Layer',
    M.impl.format.WMC.v110.prototype.read_wmc_Layer);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'getLayerFromInfo',
    M.impl.format.WMC.v110.prototype.getLayerFromInfo);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_ol_units',
    M.impl.format.WMC.v110.prototype.read_ol_units);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_ol_tileSize',
    M.impl.format.WMC.v110.prototype.read_ol_tileSize);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_ol_groupDisplayLayerSwitcher',
    M.impl.format.WMC.v110.prototype.read_ol_groupDisplayLayerSwitcher);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_ol_orderInsideGroupDisplayLayerSwitcher',
    M.impl.format.WMC.v110.prototype.read_ol_orderInsideGroupDisplayLayerSwitcher);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_sld_MaxScaleDenominator',
    M.impl.format.WMC.v110.prototype.read_sld_MaxScaleDenominator);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_Style',
    M.impl.format.WMC.v110.prototype.read_wmc_Style);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_General',
    M.impl.format.WMC.v110.prototype.read_wmc_General);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_BoundingBox',
    M.impl.format.WMC.v110.prototype.read_wmc_BoundingBox);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_LayerList',
    M.impl.format.WMC.v110.prototype.read_wmc_LayerList);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_Extension',
    M.impl.format.WMC.v110.prototype.read_wmc_Extension);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_ol_maxExtent',
    M.impl.format.WMC.v110.prototype.read_ol_maxExtent);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_ol_transparent',
    M.impl.format.WMC.v110.prototype.read_ol_transparent);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_ol_numZoomLevels',
    M.impl.format.WMC.v110.prototype.read_ol_numZoomLevels);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_ol_opacity',
    M.impl.format.WMC.v110.prototype.read_ol_opacity);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_ol_singleTile',
    M.impl.format.WMC.v110.prototype.read_ol_singleTile);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_ol_isBaseLayer',
    M.impl.format.WMC.v110.prototype.read_ol_isBaseLayer);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_ol_displayInLayerSwitcher',
    M.impl.format.WMC.v110.prototype.read_ol_displayInLayerSwitcher);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_Server',
    M.impl.format.WMC.v110.prototype.read_wmc_Server);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_FormatList',
    M.impl.format.WMC.v110.prototype.read_wmc_FormatList);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_Format',
    M.impl.format.WMC.v110.prototype.read_wmc_Format);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_StyleList',
    M.impl.format.WMC.v110.prototype.read_wmc_StyleList);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_SLD',
    M.impl.format.WMC.v110.prototype.read_wmc_SLD);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_sld_StyledLayerDescriptor',
    M.impl.format.WMC.v110.prototype.read_sld_StyledLayerDescriptor);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_OnlineResource',
    M.impl.format.WMC.v110.prototype.read_wmc_OnlineResource);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_Name',
    M.impl.format.WMC.v110.prototype.read_wmc_Name);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_Title',
    M.impl.format.WMC.v110.prototype.read_wmc_Title);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_MetadataURL',
    M.impl.format.WMC.v110.prototype.read_wmc_MetadataURL);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_Abstract',
    M.impl.format.WMC.v110.prototype.read_wmc_Abstract);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_LatLonBoundingBox',
    M.impl.format.WMC.v110.prototype.read_wmc_LatLonBoundingBox);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_LegendURL',
    M.impl.format.WMC.v110.prototype.read_wmc_LegendURL);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_sld_FeatureTypeStyle',
    M.impl.format.WMC.v110.prototype.read_sld_FeatureTypeStyle);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_KeywordList',
    M.impl.format.WMC.v110.prototype.read_wmc_KeywordList);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_Keyword',
    M.impl.format.WMC.v110.prototype.read_wmc_Keyword);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_LogoURL',
    M.impl.format.WMC.v110.prototype.read_wmc_LogoURL);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_DescriptionURL',
    M.impl.format.WMC.v110.prototype.read_wmc_DescriptionURL);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_ContactInformation',
    M.impl.format.WMC.v110.prototype.read_wmc_ContactInformation);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_ContactPersonPrimary',
    M.impl.format.WMC.v110.prototype.read_wmc_ContactPersonPrimary);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_ContactPerson',
    M.impl.format.WMC.v110.prototype.read_wmc_ContactPerson);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_ContactOrganization',
    M.impl.format.WMC.v110.prototype.read_wmc_ContactOrganization);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_ContactPosition',
    M.impl.format.WMC.v110.prototype.read_wmc_ContactPosition);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_ContactAddress',
    M.impl.format.WMC.v110.prototype.read_wmc_ContactAddress);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_AddressType',
    M.impl.format.WMC.v110.prototype.read_wmc_AddressType);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_Address',
    M.impl.format.WMC.v110.prototype.read_wmc_Address);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_City',
    M.impl.format.WMC.v110.prototype.read_wmc_City);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_StateOrProvince',
    M.impl.format.WMC.v110.prototype.read_wmc_StateOrProvince);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_PostCode',
    M.impl.format.WMC.v110.prototype.read_wmc_PostCode);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_Country',
    M.impl.format.WMC.v110.prototype.read_wmc_Country);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_ContactVoiceTelephone',
    M.impl.format.WMC.v110.prototype.read_wmc_ContactVoiceTelephone);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_ContactFacsimileTelephone',
    M.impl.format.WMC.v110.prototype.read_wmc_ContactFacsimileTelephone);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_ContactElectronicMailAddress',
    M.impl.format.WMC.v110.prototype.read_wmc_ContactElectronicMailAddress);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_DataURL',
    M.impl.format.WMC.v110.prototype.read_wmc_DataURL);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_DimensionList',
    M.impl.format.WMC.v110.prototype.read_wmc_DimensionList);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'read_wmc_Dimension',
    M.impl.format.WMC.v110.prototype.read_wmc_Dimension);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'getChildValue',
    M.impl.format.WMC.v110.prototype.getChildValue);

goog.exportProperty(
    M.impl.format.WMC.v110.prototype,
    'getAttributeNS',
    M.impl.format.WMC.v110.prototype.getAttributeNS);

goog.exportSymbol(
    'M.impl.format.KML',
    M.impl.format.KML);

goog.exportProperty(
    M.impl.format.KML.prototype,
    'getScreenOverlay',
    M.impl.format.KML.prototype.getScreenOverlay);

goog.exportSymbol(
    'M.impl.Control',
    M.impl.Control);

goog.exportProperty(
    M.impl.Control.prototype,
    'addTo',
    M.impl.Control.prototype.addTo);

goog.exportProperty(
    M.impl.Control.prototype,
    'destroy',
    M.impl.Control.prototype.destroy);

goog.exportSymbol(
    'M.impl.control.GetFeatureInfo',
    M.impl.control.GetFeatureInfo);

goog.exportProperty(
    M.impl.control.GetFeatureInfo.prototype,
    'addTo',
    M.impl.control.GetFeatureInfo.prototype.addTo);

goog.exportProperty(
    M.impl.control.GetFeatureInfo.prototype,
    'activate',
    M.impl.control.GetFeatureInfo.prototype.activate);

goog.exportProperty(
    M.impl.control.GetFeatureInfo.prototype,
    'desactivate',
    M.impl.control.GetFeatureInfo.prototype.desactivate);

goog.exportProperty(
    M.impl.control.GetFeatureInfo.prototype,
    'destroy',
    M.impl.control.GetFeatureInfo.prototype.destroy);

goog.exportSymbol(
    'M.impl.control.LayerSwitcher',
    M.impl.control.LayerSwitcher);

goog.exportProperty(
    M.impl.control.LayerSwitcher.prototype,
    'addTo',
    M.impl.control.LayerSwitcher.prototype.addTo);

goog.exportProperty(
    M.impl.control.LayerSwitcher.prototype,
    'showPanel',
    M.impl.control.LayerSwitcher.prototype.showPanel);

goog.exportProperty(
    M.impl.control.LayerSwitcher.prototype,
    'hidePanel',
    M.impl.control.LayerSwitcher.prototype.hidePanel);

goog.exportProperty(
    M.impl.control.LayerSwitcher.prototype,
    'clickLayer',
    M.impl.control.LayerSwitcher.prototype.clickLayer);

goog.exportProperty(
    M.impl.control.LayerSwitcher.prototype,
    'destroy',
    M.impl.control.LayerSwitcher.prototype.destroy);

goog.exportSymbol(
    'M.impl.control.LayerSwitcher.SHOWN_CLASS',
    M.impl.control.LayerSwitcher.SHOWN_CLASS);

goog.exportSymbol(
    'M.impl.control.LayerSwitcher.BUTTON_ID',
    M.impl.control.LayerSwitcher.BUTTON_ID);

goog.exportSymbol(
    'M.impl.control.LayerSwitcher.PANEL_ID',
    M.impl.control.LayerSwitcher.PANEL_ID);

goog.exportSymbol(
    'M.impl.control.Location',
    M.impl.control.Location);

goog.exportProperty(
    M.impl.control.Location.prototype,
    'addTo',
    M.impl.control.Location.prototype.addTo);

goog.exportProperty(
    M.impl.control.Location.prototype,
    'destroy',
    M.impl.control.Location.prototype.destroy);

goog.exportProperty(
    M.impl.control.Location.prototype,
    'locate',
    M.impl.control.Location.prototype.locate);

goog.exportSymbol(
    'M.impl.control.Mouse',
    M.impl.control.Mouse);

goog.exportProperty(
    M.impl.control.Mouse.prototype,
    'addTo',
    M.impl.control.Mouse.prototype.addTo);

goog.exportProperty(
    M.impl.control.Mouse.prototype,
    'destroy',
    M.impl.control.Mouse.prototype.destroy);

goog.exportSymbol(
    'M.impl.control.Navtoolbar',
    M.impl.control.Navtoolbar);

goog.exportProperty(
    M.impl.control.Navtoolbar.prototype,
    'addTo',
    M.impl.control.Navtoolbar.prototype.addTo);

goog.exportProperty(
    M.impl.control.Navtoolbar.prototype,
    'destroy',
    M.impl.control.Navtoolbar.prototype.destroy);

goog.exportSymbol(
    'M.impl.control.OverviewMap',
    M.impl.control.OverviewMap);

goog.exportProperty(
    M.impl.control.OverviewMap.prototype,
    'addTo',
    M.impl.control.OverviewMap.prototype.addTo);

goog.exportProperty(
    M.impl.control.OverviewMap.prototype,
    'destroy',
    M.impl.control.OverviewMap.prototype.destroy);

goog.exportSymbol(
    'M.impl.control.Panzoom',
    M.impl.control.Panzoom);

goog.exportProperty(
    M.impl.control.Panzoom.prototype,
    'addTo',
    M.impl.control.Panzoom.prototype.addTo);

goog.exportProperty(
    M.impl.control.Panzoom.prototype,
    'destroy',
    M.impl.control.Panzoom.prototype.destroy);

goog.exportSymbol(
    'M.impl.control.Panzoombar',
    M.impl.control.Panzoombar);

goog.exportProperty(
    M.impl.control.Panzoombar.prototype,
    'addTo',
    M.impl.control.Panzoombar.prototype.addTo);

goog.exportProperty(
    M.impl.control.Panzoombar.prototype,
    'destroy',
    M.impl.control.Panzoombar.prototype.destroy);

goog.exportSymbol(
    'M.impl.control.Scale',
    M.impl.control.Scale);

goog.exportProperty(
    M.impl.control.Scale.prototype,
    'addTo',
    M.impl.control.Scale.prototype.addTo);

goog.exportProperty(
    M.impl.control.Scale.prototype,
    'render',
    M.impl.control.Scale.prototype.render);

goog.exportProperty(
    M.impl.control.Scale.prototype,
    'destroy',
    M.impl.control.Scale.prototype.destroy);

goog.exportSymbol(
    'M.impl.control.ScaleLine',
    M.impl.control.ScaleLine);

goog.exportProperty(
    M.impl.control.ScaleLine.prototype,
    'addTo',
    M.impl.control.ScaleLine.prototype.addTo);

goog.exportProperty(
    M.impl.control.ScaleLine.prototype,
    'destroy',
    M.impl.control.ScaleLine.prototype.destroy);

goog.exportSymbol(
    'M.impl.control.WMCSelector',
    M.impl.control.WMCSelector);

goog.exportProperty(
    M.impl.control.WMCSelector.prototype,
    'addTo',
    M.impl.control.WMCSelector.prototype.addTo);

goog.exportProperty(
    ol.render.Event.prototype,
    'vectorContext',
    ol.render.Event.prototype.vectorContext);

goog.exportProperty(
    ol.render.Event.prototype,
    'frameState',
    ol.render.Event.prototype.frameState);

goog.exportProperty(
    ol.render.Event.prototype,
    'context',
    ol.render.Event.prototype.context);

goog.exportProperty(
    ol.render.Event.prototype,
    'glContext',
    ol.render.Event.prototype.glContext);

goog.exportProperty(
    ol.render.Feature.prototype,
    'get',
    ol.render.Feature.prototype.get);

goog.exportProperty(
    ol.render.Feature.prototype,
    'getExtent',
    ol.render.Feature.prototype.getExtent);

goog.exportProperty(
    ol.render.Feature.prototype,
    'getGeometry',
    ol.render.Feature.prototype.getGeometry);

goog.exportProperty(
    ol.render.Feature.prototype,
    'getProperties',
    ol.render.Feature.prototype.getProperties);

goog.exportProperty(
    ol.render.Feature.prototype,
    'getType',
    ol.render.Feature.prototype.getType);

goog.exportSymbol(
    'ol.render.VectorContext',
    ol.render.VectorContext);

goog.exportProperty(
    ol.render.webgl.Immediate.prototype,
    'drawAsync',
    ol.render.webgl.Immediate.prototype.drawAsync);

goog.exportProperty(
    ol.render.webgl.Immediate.prototype,
    'drawCircleGeometry',
    ol.render.webgl.Immediate.prototype.drawCircleGeometry);

goog.exportProperty(
    ol.render.webgl.Immediate.prototype,
    'drawFeature',
    ol.render.webgl.Immediate.prototype.drawFeature);

goog.exportProperty(
    ol.render.webgl.Immediate.prototype,
    'drawGeometryCollectionGeometry',
    ol.render.webgl.Immediate.prototype.drawGeometryCollectionGeometry);

goog.exportProperty(
    ol.render.webgl.Immediate.prototype,
    'drawPointGeometry',
    ol.render.webgl.Immediate.prototype.drawPointGeometry);

goog.exportProperty(
    ol.render.webgl.Immediate.prototype,
    'drawLineStringGeometry',
    ol.render.webgl.Immediate.prototype.drawLineStringGeometry);

goog.exportProperty(
    ol.render.webgl.Immediate.prototype,
    'drawMultiLineStringGeometry',
    ol.render.webgl.Immediate.prototype.drawMultiLineStringGeometry);

goog.exportProperty(
    ol.render.webgl.Immediate.prototype,
    'drawMultiPointGeometry',
    ol.render.webgl.Immediate.prototype.drawMultiPointGeometry);

goog.exportProperty(
    ol.render.webgl.Immediate.prototype,
    'drawMultiPolygonGeometry',
    ol.render.webgl.Immediate.prototype.drawMultiPolygonGeometry);

goog.exportProperty(
    ol.render.webgl.Immediate.prototype,
    'drawPolygonGeometry',
    ol.render.webgl.Immediate.prototype.drawPolygonGeometry);

goog.exportProperty(
    ol.render.webgl.Immediate.prototype,
    'drawText',
    ol.render.webgl.Immediate.prototype.drawText);

goog.exportProperty(
    ol.render.webgl.Immediate.prototype,
    'setFillStrokeStyle',
    ol.render.webgl.Immediate.prototype.setFillStrokeStyle);

goog.exportProperty(
    ol.render.webgl.Immediate.prototype,
    'setImageStyle',
    ol.render.webgl.Immediate.prototype.setImageStyle);

goog.exportProperty(
    ol.render.webgl.Immediate.prototype,
    'setTextStyle',
    ol.render.webgl.Immediate.prototype.setTextStyle);

goog.exportProperty(
    ol.render.canvas.Immediate.prototype,
    'drawAsync',
    ol.render.canvas.Immediate.prototype.drawAsync);

goog.exportProperty(
    ol.render.canvas.Immediate.prototype,
    'drawCircleGeometry',
    ol.render.canvas.Immediate.prototype.drawCircleGeometry);

goog.exportProperty(
    ol.render.canvas.Immediate.prototype,
    'drawFeature',
    ol.render.canvas.Immediate.prototype.drawFeature);

goog.exportProperty(
    ol.render.canvas.Immediate.prototype,
    'drawPointGeometry',
    ol.render.canvas.Immediate.prototype.drawPointGeometry);

goog.exportProperty(
    ol.render.canvas.Immediate.prototype,
    'drawMultiPointGeometry',
    ol.render.canvas.Immediate.prototype.drawMultiPointGeometry);

goog.exportProperty(
    ol.render.canvas.Immediate.prototype,
    'drawLineStringGeometry',
    ol.render.canvas.Immediate.prototype.drawLineStringGeometry);

goog.exportProperty(
    ol.render.canvas.Immediate.prototype,
    'drawMultiLineStringGeometry',
    ol.render.canvas.Immediate.prototype.drawMultiLineStringGeometry);

goog.exportProperty(
    ol.render.canvas.Immediate.prototype,
    'drawPolygonGeometry',
    ol.render.canvas.Immediate.prototype.drawPolygonGeometry);

goog.exportProperty(
    ol.render.canvas.Immediate.prototype,
    'drawMultiPolygonGeometry',
    ol.render.canvas.Immediate.prototype.drawMultiPolygonGeometry);

goog.exportProperty(
    ol.render.canvas.Immediate.prototype,
    'setFillStrokeStyle',
    ol.render.canvas.Immediate.prototype.setFillStrokeStyle);

goog.exportProperty(
    ol.render.canvas.Immediate.prototype,
    'setImageStyle',
    ol.render.canvas.Immediate.prototype.setImageStyle);

goog.exportProperty(
    ol.render.canvas.Immediate.prototype,
    'setTextStyle',
    ol.render.canvas.Immediate.prototype.setTextStyle);

goog.exportSymbol(
    'ol.proj.common.add',
    ol.proj.common.add);

goog.exportSymbol(
    'ol.proj.METERS_PER_UNIT',
    ol.proj.METERS_PER_UNIT);

goog.exportSymbol(
    'ol.proj.Projection',
    ol.proj.Projection);

goog.exportProperty(
    ol.proj.Projection.prototype,
    'getCode',
    ol.proj.Projection.prototype.getCode);

goog.exportProperty(
    ol.proj.Projection.prototype,
    'getExtent',
    ol.proj.Projection.prototype.getExtent);

goog.exportProperty(
    ol.proj.Projection.prototype,
    'getUnits',
    ol.proj.Projection.prototype.getUnits);

goog.exportProperty(
    ol.proj.Projection.prototype,
    'getMetersPerUnit',
    ol.proj.Projection.prototype.getMetersPerUnit);

goog.exportProperty(
    ol.proj.Projection.prototype,
    'getWorldExtent',
    ol.proj.Projection.prototype.getWorldExtent);

goog.exportProperty(
    ol.proj.Projection.prototype,
    'isGlobal',
    ol.proj.Projection.prototype.isGlobal);

goog.exportProperty(
    ol.proj.Projection.prototype,
    'setGlobal',
    ol.proj.Projection.prototype.setGlobal);

goog.exportProperty(
    ol.proj.Projection.prototype,
    'setExtent',
    ol.proj.Projection.prototype.setExtent);

goog.exportProperty(
    ol.proj.Projection.prototype,
    'setWorldExtent',
    ol.proj.Projection.prototype.setWorldExtent);

goog.exportProperty(
    ol.proj.Projection.prototype,
    'setGetPointResolution',
    ol.proj.Projection.prototype.setGetPointResolution);

goog.exportProperty(
    ol.proj.Projection.prototype,
    'getPointResolution',
    ol.proj.Projection.prototype.getPointResolution);

goog.exportSymbol(
    'ol.proj.addEquivalentProjections',
    ol.proj.addEquivalentProjections);

goog.exportSymbol(
    'ol.proj.addProjection',
    ol.proj.addProjection);

goog.exportSymbol(
    'ol.proj.addCoordinateTransforms',
    ol.proj.addCoordinateTransforms);

goog.exportSymbol(
    'ol.proj.fromLonLat',
    ol.proj.fromLonLat);

goog.exportSymbol(
    'ol.proj.toLonLat',
    ol.proj.toLonLat);

goog.exportSymbol(
    'ol.proj.get',
    ol.proj.get);

goog.exportSymbol(
    'ol.proj.getTransform',
    ol.proj.getTransform);

goog.exportSymbol(
    'ol.proj.transform',
    ol.proj.transform);

goog.exportSymbol(
    'ol.proj.transformExtent',
    ol.proj.transformExtent);

goog.exportSymbol(
    'ol.layer.Heatmap',
    ol.layer.Heatmap);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'getBlur',
    ol.layer.Heatmap.prototype.getBlur);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'getGradient',
    ol.layer.Heatmap.prototype.getGradient);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'getRadius',
    ol.layer.Heatmap.prototype.getRadius);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'setBlur',
    ol.layer.Heatmap.prototype.setBlur);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'setGradient',
    ol.layer.Heatmap.prototype.setGradient);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'setRadius',
    ol.layer.Heatmap.prototype.setRadius);

goog.exportSymbol(
    'ol.layer.Image',
    ol.layer.Image);

goog.exportProperty(
    ol.layer.Image.prototype,
    'getSource',
    ol.layer.Image.prototype.getSource);

goog.exportSymbol(
    'ol.layer.Layer',
    ol.layer.Layer);

goog.exportProperty(
    ol.layer.Layer.prototype,
    'getSource',
    ol.layer.Layer.prototype.getSource);

goog.exportProperty(
    ol.layer.Layer.prototype,
    'setMap',
    ol.layer.Layer.prototype.setMap);

goog.exportProperty(
    ol.layer.Layer.prototype,
    'setSource',
    ol.layer.Layer.prototype.setSource);

goog.exportSymbol(
    'ol.layer.Base',
    ol.layer.Base);

goog.exportProperty(
    ol.layer.Base.prototype,
    'getExtent',
    ol.layer.Base.prototype.getExtent);

goog.exportProperty(
    ol.layer.Base.prototype,
    'getMaxResolution',
    ol.layer.Base.prototype.getMaxResolution);

goog.exportProperty(
    ol.layer.Base.prototype,
    'getMinResolution',
    ol.layer.Base.prototype.getMinResolution);

goog.exportProperty(
    ol.layer.Base.prototype,
    'getOpacity',
    ol.layer.Base.prototype.getOpacity);

goog.exportProperty(
    ol.layer.Base.prototype,
    'getVisible',
    ol.layer.Base.prototype.getVisible);

goog.exportProperty(
    ol.layer.Base.prototype,
    'getZIndex',
    ol.layer.Base.prototype.getZIndex);

goog.exportProperty(
    ol.layer.Base.prototype,
    'setExtent',
    ol.layer.Base.prototype.setExtent);

goog.exportProperty(
    ol.layer.Base.prototype,
    'setMaxResolution',
    ol.layer.Base.prototype.setMaxResolution);

goog.exportProperty(
    ol.layer.Base.prototype,
    'setMinResolution',
    ol.layer.Base.prototype.setMinResolution);

goog.exportProperty(
    ol.layer.Base.prototype,
    'setOpacity',
    ol.layer.Base.prototype.setOpacity);

goog.exportProperty(
    ol.layer.Base.prototype,
    'setVisible',
    ol.layer.Base.prototype.setVisible);

goog.exportProperty(
    ol.layer.Base.prototype,
    'setZIndex',
    ol.layer.Base.prototype.setZIndex);

goog.exportSymbol(
    'ol.layer.Group',
    ol.layer.Group);

goog.exportProperty(
    ol.layer.Group.prototype,
    'getLayers',
    ol.layer.Group.prototype.getLayers);

goog.exportProperty(
    ol.layer.Group.prototype,
    'setLayers',
    ol.layer.Group.prototype.setLayers);

goog.exportSymbol(
    'ol.layer.Tile',
    ol.layer.Tile);

goog.exportProperty(
    ol.layer.Tile.prototype,
    'getPreload',
    ol.layer.Tile.prototype.getPreload);

goog.exportProperty(
    ol.layer.Tile.prototype,
    'getSource',
    ol.layer.Tile.prototype.getSource);

goog.exportProperty(
    ol.layer.Tile.prototype,
    'setPreload',
    ol.layer.Tile.prototype.setPreload);

goog.exportProperty(
    ol.layer.Tile.prototype,
    'getUseInterimTilesOnError',
    ol.layer.Tile.prototype.getUseInterimTilesOnError);

goog.exportProperty(
    ol.layer.Tile.prototype,
    'setUseInterimTilesOnError',
    ol.layer.Tile.prototype.setUseInterimTilesOnError);

goog.exportSymbol(
    'ol.layer.Vector',
    ol.layer.Vector);

goog.exportProperty(
    ol.layer.Vector.prototype,
    'getSource',
    ol.layer.Vector.prototype.getSource);

goog.exportProperty(
    ol.layer.Vector.prototype,
    'getStyle',
    ol.layer.Vector.prototype.getStyle);

goog.exportProperty(
    ol.layer.Vector.prototype,
    'getStyleFunction',
    ol.layer.Vector.prototype.getStyleFunction);

goog.exportProperty(
    ol.layer.Vector.prototype,
    'setStyle',
    ol.layer.Vector.prototype.setStyle);

goog.exportSymbol(
    'ol.layer.VectorTile',
    ol.layer.VectorTile);

goog.exportProperty(
    ol.layer.VectorTile.prototype,
    'getPreload',
    ol.layer.VectorTile.prototype.getPreload);

goog.exportProperty(
    ol.layer.VectorTile.prototype,
    'getSource',
    ol.layer.VectorTile.prototype.getSource);

goog.exportProperty(
    ol.layer.VectorTile.prototype,
    'getUseInterimTilesOnError',
    ol.layer.VectorTile.prototype.getUseInterimTilesOnError);

goog.exportProperty(
    ol.layer.VectorTile.prototype,
    'setPreload',
    ol.layer.VectorTile.prototype.setPreload);

goog.exportProperty(
    ol.layer.VectorTile.prototype,
    'setUseInterimTilesOnError',
    ol.layer.VectorTile.prototype.setUseInterimTilesOnError);

goog.exportSymbol(
    'ol.interaction.DoubleClickZoom',
    ol.interaction.DoubleClickZoom);

goog.exportSymbol(
    'ol.interaction.DoubleClickZoom.handleEvent',
    ol.interaction.DoubleClickZoom.handleEvent);

goog.exportSymbol(
    'ol.interaction.DragAndDrop',
    ol.interaction.DragAndDrop);

goog.exportSymbol(
    'ol.interaction.DragAndDrop.handleEvent',
    ol.interaction.DragAndDrop.handleEvent);

goog.exportProperty(
    ol.interaction.DragAndDropEvent.prototype,
    'features',
    ol.interaction.DragAndDropEvent.prototype.features);

goog.exportProperty(
    ol.interaction.DragAndDropEvent.prototype,
    'file',
    ol.interaction.DragAndDropEvent.prototype.file);

goog.exportProperty(
    ol.interaction.DragAndDropEvent.prototype,
    'projection',
    ol.interaction.DragAndDropEvent.prototype.projection);

goog.exportProperty(
    ol.DragBoxEvent.prototype,
    'coordinate',
    ol.DragBoxEvent.prototype.coordinate);

goog.exportSymbol(
    'ol.interaction.DragBox',
    ol.interaction.DragBox);

goog.exportProperty(
    ol.interaction.DragBox.prototype,
    'getGeometry',
    ol.interaction.DragBox.prototype.getGeometry);

goog.exportSymbol(
    'ol.interaction.DragPan',
    ol.interaction.DragPan);

goog.exportSymbol(
    'ol.interaction.DragRotateAndZoom',
    ol.interaction.DragRotateAndZoom);

goog.exportSymbol(
    'ol.interaction.DragRotate',
    ol.interaction.DragRotate);

goog.exportSymbol(
    'ol.interaction.DragZoom',
    ol.interaction.DragZoom);

goog.exportProperty(
    ol.interaction.DrawEvent.prototype,
    'feature',
    ol.interaction.DrawEvent.prototype.feature);

goog.exportSymbol(
    'ol.interaction.Draw',
    ol.interaction.Draw);

goog.exportSymbol(
    'ol.interaction.Draw.handleEvent',
    ol.interaction.Draw.handleEvent);

goog.exportProperty(
    ol.interaction.Draw.prototype,
    'removeLastPoint',
    ol.interaction.Draw.prototype.removeLastPoint);

goog.exportProperty(
    ol.interaction.Draw.prototype,
    'finishDrawing',
    ol.interaction.Draw.prototype.finishDrawing);

goog.exportProperty(
    ol.interaction.Draw.prototype,
    'extend',
    ol.interaction.Draw.prototype.extend);

goog.exportSymbol(
    'ol.interaction.Draw.createRegularPolygon',
    ol.interaction.Draw.createRegularPolygon);

goog.exportSymbol(
    'ol.interaction.Interaction',
    ol.interaction.Interaction);

goog.exportProperty(
    ol.interaction.Interaction.prototype,
    'getActive',
    ol.interaction.Interaction.prototype.getActive);

goog.exportProperty(
    ol.interaction.Interaction.prototype,
    'setActive',
    ol.interaction.Interaction.prototype.setActive);

goog.exportSymbol(
    'ol.interaction.defaults',
    ol.interaction.defaults);

goog.exportSymbol(
    'ol.interaction.KeyboardPan',
    ol.interaction.KeyboardPan);

goog.exportSymbol(
    'ol.interaction.KeyboardPan.handleEvent',
    ol.interaction.KeyboardPan.handleEvent);

goog.exportSymbol(
    'ol.interaction.KeyboardZoom',
    ol.interaction.KeyboardZoom);

goog.exportSymbol(
    'ol.interaction.KeyboardZoom.handleEvent',
    ol.interaction.KeyboardZoom.handleEvent);

goog.exportProperty(
    ol.interaction.ModifyEvent.prototype,
    'features',
    ol.interaction.ModifyEvent.prototype.features);

goog.exportProperty(
    ol.interaction.ModifyEvent.prototype,
    'mapBrowserPointerEvent',
    ol.interaction.ModifyEvent.prototype.mapBrowserPointerEvent);

goog.exportSymbol(
    'ol.interaction.Modify',
    ol.interaction.Modify);

goog.exportSymbol(
    'ol.interaction.Modify.handleEvent',
    ol.interaction.Modify.handleEvent);

goog.exportSymbol(
    'ol.interaction.MouseWheelZoom',
    ol.interaction.MouseWheelZoom);

goog.exportSymbol(
    'ol.interaction.MouseWheelZoom.handleEvent',
    ol.interaction.MouseWheelZoom.handleEvent);

goog.exportProperty(
    ol.interaction.MouseWheelZoom.prototype,
    'setMouseAnchor',
    ol.interaction.MouseWheelZoom.prototype.setMouseAnchor);

goog.exportSymbol(
    'ol.interaction.PinchRotate',
    ol.interaction.PinchRotate);

goog.exportSymbol(
    'ol.interaction.PinchZoom',
    ol.interaction.PinchZoom);

goog.exportSymbol(
    'ol.interaction.Pointer',
    ol.interaction.Pointer);

goog.exportSymbol(
    'ol.interaction.Pointer.handleEvent',
    ol.interaction.Pointer.handleEvent);

goog.exportProperty(
    ol.interaction.SelectEvent.prototype,
    'selected',
    ol.interaction.SelectEvent.prototype.selected);

goog.exportProperty(
    ol.interaction.SelectEvent.prototype,
    'deselected',
    ol.interaction.SelectEvent.prototype.deselected);

goog.exportProperty(
    ol.interaction.SelectEvent.prototype,
    'mapBrowserEvent',
    ol.interaction.SelectEvent.prototype.mapBrowserEvent);

goog.exportSymbol(
    'ol.interaction.Select',
    ol.interaction.Select);

goog.exportProperty(
    ol.interaction.Select.prototype,
    'getFeatures',
    ol.interaction.Select.prototype.getFeatures);

goog.exportProperty(
    ol.interaction.Select.prototype,
    'getLayer',
    ol.interaction.Select.prototype.getLayer);

goog.exportSymbol(
    'ol.interaction.Select.handleEvent',
    ol.interaction.Select.handleEvent);

goog.exportProperty(
    ol.interaction.Select.prototype,
    'setMap',
    ol.interaction.Select.prototype.setMap);

goog.exportSymbol(
    'ol.interaction.Snap',
    ol.interaction.Snap);

goog.exportProperty(
    ol.interaction.Snap.prototype,
    'addFeature',
    ol.interaction.Snap.prototype.addFeature);

goog.exportProperty(
    ol.interaction.Snap.prototype,
    'removeFeature',
    ol.interaction.Snap.prototype.removeFeature);

goog.exportProperty(
    ol.interaction.TranslateEvent.prototype,
    'features',
    ol.interaction.TranslateEvent.prototype.features);

goog.exportProperty(
    ol.interaction.TranslateEvent.prototype,
    'coordinate',
    ol.interaction.TranslateEvent.prototype.coordinate);

goog.exportSymbol(
    'ol.interaction.Translate',
    ol.interaction.Translate);

goog.exportSymbol(
    'ol.geom.Circle',
    ol.geom.Circle);

goog.exportProperty(
    ol.geom.Circle.prototype,
    'clone',
    ol.geom.Circle.prototype.clone);

goog.exportProperty(
    ol.geom.Circle.prototype,
    'getCenter',
    ol.geom.Circle.prototype.getCenter);

goog.exportProperty(
    ol.geom.Circle.prototype,
    'getRadius',
    ol.geom.Circle.prototype.getRadius);

goog.exportProperty(
    ol.geom.Circle.prototype,
    'getType',
    ol.geom.Circle.prototype.getType);

goog.exportProperty(
    ol.geom.Circle.prototype,
    'intersectsExtent',
    ol.geom.Circle.prototype.intersectsExtent);

goog.exportProperty(
    ol.geom.Circle.prototype,
    'setCenter',
    ol.geom.Circle.prototype.setCenter);

goog.exportProperty(
    ol.geom.Circle.prototype,
    'setCenterAndRadius',
    ol.geom.Circle.prototype.setCenterAndRadius);

goog.exportProperty(
    ol.geom.Circle.prototype,
    'setRadius',
    ol.geom.Circle.prototype.setRadius);

goog.exportProperty(
    ol.geom.Circle.prototype,
    'transform',
    ol.geom.Circle.prototype.transform);

goog.exportSymbol(
    'ol.geom.Geometry',
    ol.geom.Geometry);

goog.exportProperty(
    ol.geom.Geometry.prototype,
    'getClosestPoint',
    ol.geom.Geometry.prototype.getClosestPoint);

goog.exportProperty(
    ol.geom.Geometry.prototype,
    'getExtent',
    ol.geom.Geometry.prototype.getExtent);

goog.exportProperty(
    ol.geom.Geometry.prototype,
    'simplify',
    ol.geom.Geometry.prototype.simplify);

goog.exportProperty(
    ol.geom.Geometry.prototype,
    'transform',
    ol.geom.Geometry.prototype.transform);

goog.exportSymbol(
    'ol.geom.GeometryCollection',
    ol.geom.GeometryCollection);

goog.exportProperty(
    ol.geom.GeometryCollection.prototype,
    'clone',
    ol.geom.GeometryCollection.prototype.clone);

goog.exportProperty(
    ol.geom.GeometryCollection.prototype,
    'getGeometries',
    ol.geom.GeometryCollection.prototype.getGeometries);

goog.exportProperty(
    ol.geom.GeometryCollection.prototype,
    'getType',
    ol.geom.GeometryCollection.prototype.getType);

goog.exportProperty(
    ol.geom.GeometryCollection.prototype,
    'intersectsExtent',
    ol.geom.GeometryCollection.prototype.intersectsExtent);

goog.exportProperty(
    ol.geom.GeometryCollection.prototype,
    'setGeometries',
    ol.geom.GeometryCollection.prototype.setGeometries);

goog.exportProperty(
    ol.geom.GeometryCollection.prototype,
    'applyTransform',
    ol.geom.GeometryCollection.prototype.applyTransform);

goog.exportProperty(
    ol.geom.GeometryCollection.prototype,
    'translate',
    ol.geom.GeometryCollection.prototype.translate);

goog.exportSymbol(
    'ol.geom.LinearRing',
    ol.geom.LinearRing);

goog.exportProperty(
    ol.geom.LinearRing.prototype,
    'clone',
    ol.geom.LinearRing.prototype.clone);

goog.exportProperty(
    ol.geom.LinearRing.prototype,
    'getArea',
    ol.geom.LinearRing.prototype.getArea);

goog.exportProperty(
    ol.geom.LinearRing.prototype,
    'getCoordinates',
    ol.geom.LinearRing.prototype.getCoordinates);

goog.exportProperty(
    ol.geom.LinearRing.prototype,
    'getType',
    ol.geom.LinearRing.prototype.getType);

goog.exportProperty(
    ol.geom.LinearRing.prototype,
    'setCoordinates',
    ol.geom.LinearRing.prototype.setCoordinates);

goog.exportSymbol(
    'ol.geom.LineString',
    ol.geom.LineString);

goog.exportProperty(
    ol.geom.LineString.prototype,
    'appendCoordinate',
    ol.geom.LineString.prototype.appendCoordinate);

goog.exportProperty(
    ol.geom.LineString.prototype,
    'clone',
    ol.geom.LineString.prototype.clone);

goog.exportProperty(
    ol.geom.LineString.prototype,
    'forEachSegment',
    ol.geom.LineString.prototype.forEachSegment);

goog.exportProperty(
    ol.geom.LineString.prototype,
    'getCoordinateAtM',
    ol.geom.LineString.prototype.getCoordinateAtM);

goog.exportProperty(
    ol.geom.LineString.prototype,
    'getCoordinates',
    ol.geom.LineString.prototype.getCoordinates);

goog.exportProperty(
    ol.geom.LineString.prototype,
    'getLength',
    ol.geom.LineString.prototype.getLength);

goog.exportProperty(
    ol.geom.LineString.prototype,
    'getType',
    ol.geom.LineString.prototype.getType);

goog.exportProperty(
    ol.geom.LineString.prototype,
    'intersectsExtent',
    ol.geom.LineString.prototype.intersectsExtent);

goog.exportProperty(
    ol.geom.LineString.prototype,
    'setCoordinates',
    ol.geom.LineString.prototype.setCoordinates);

goog.exportSymbol(
    'ol.geom.MultiLineString',
    ol.geom.MultiLineString);

goog.exportProperty(
    ol.geom.MultiLineString.prototype,
    'appendLineString',
    ol.geom.MultiLineString.prototype.appendLineString);

goog.exportProperty(
    ol.geom.MultiLineString.prototype,
    'clone',
    ol.geom.MultiLineString.prototype.clone);

goog.exportProperty(
    ol.geom.MultiLineString.prototype,
    'getCoordinateAtM',
    ol.geom.MultiLineString.prototype.getCoordinateAtM);

goog.exportProperty(
    ol.geom.MultiLineString.prototype,
    'getCoordinates',
    ol.geom.MultiLineString.prototype.getCoordinates);

goog.exportProperty(
    ol.geom.MultiLineString.prototype,
    'getLineString',
    ol.geom.MultiLineString.prototype.getLineString);

goog.exportProperty(
    ol.geom.MultiLineString.prototype,
    'getLineStrings',
    ol.geom.MultiLineString.prototype.getLineStrings);

goog.exportProperty(
    ol.geom.MultiLineString.prototype,
    'getType',
    ol.geom.MultiLineString.prototype.getType);

goog.exportProperty(
    ol.geom.MultiLineString.prototype,
    'intersectsExtent',
    ol.geom.MultiLineString.prototype.intersectsExtent);

goog.exportProperty(
    ol.geom.MultiLineString.prototype,
    'setCoordinates',
    ol.geom.MultiLineString.prototype.setCoordinates);

goog.exportSymbol(
    'ol.geom.MultiPoint',
    ol.geom.MultiPoint);

goog.exportProperty(
    ol.geom.MultiPoint.prototype,
    'appendPoint',
    ol.geom.MultiPoint.prototype.appendPoint);

goog.exportProperty(
    ol.geom.MultiPoint.prototype,
    'clone',
    ol.geom.MultiPoint.prototype.clone);

goog.exportProperty(
    ol.geom.MultiPoint.prototype,
    'getCoordinates',
    ol.geom.MultiPoint.prototype.getCoordinates);

goog.exportProperty(
    ol.geom.MultiPoint.prototype,
    'getPoint',
    ol.geom.MultiPoint.prototype.getPoint);

goog.exportProperty(
    ol.geom.MultiPoint.prototype,
    'getPoints',
    ol.geom.MultiPoint.prototype.getPoints);

goog.exportProperty(
    ol.geom.MultiPoint.prototype,
    'getType',
    ol.geom.MultiPoint.prototype.getType);

goog.exportProperty(
    ol.geom.MultiPoint.prototype,
    'intersectsExtent',
    ol.geom.MultiPoint.prototype.intersectsExtent);

goog.exportProperty(
    ol.geom.MultiPoint.prototype,
    'setCoordinates',
    ol.geom.MultiPoint.prototype.setCoordinates);

goog.exportSymbol(
    'ol.geom.MultiPolygon',
    ol.geom.MultiPolygon);

goog.exportProperty(
    ol.geom.MultiPolygon.prototype,
    'appendPolygon',
    ol.geom.MultiPolygon.prototype.appendPolygon);

goog.exportProperty(
    ol.geom.MultiPolygon.prototype,
    'clone',
    ol.geom.MultiPolygon.prototype.clone);

goog.exportProperty(
    ol.geom.MultiPolygon.prototype,
    'getArea',
    ol.geom.MultiPolygon.prototype.getArea);

goog.exportProperty(
    ol.geom.MultiPolygon.prototype,
    'getCoordinates',
    ol.geom.MultiPolygon.prototype.getCoordinates);

goog.exportProperty(
    ol.geom.MultiPolygon.prototype,
    'getInteriorPoints',
    ol.geom.MultiPolygon.prototype.getInteriorPoints);

goog.exportProperty(
    ol.geom.MultiPolygon.prototype,
    'getPolygon',
    ol.geom.MultiPolygon.prototype.getPolygon);

goog.exportProperty(
    ol.geom.MultiPolygon.prototype,
    'getPolygons',
    ol.geom.MultiPolygon.prototype.getPolygons);

goog.exportProperty(
    ol.geom.MultiPolygon.prototype,
    'getType',
    ol.geom.MultiPolygon.prototype.getType);

goog.exportProperty(
    ol.geom.MultiPolygon.prototype,
    'intersectsExtent',
    ol.geom.MultiPolygon.prototype.intersectsExtent);

goog.exportProperty(
    ol.geom.MultiPolygon.prototype,
    'setCoordinates',
    ol.geom.MultiPolygon.prototype.setCoordinates);

goog.exportSymbol(
    'ol.geom.Point',
    ol.geom.Point);

goog.exportProperty(
    ol.geom.Point.prototype,
    'clone',
    ol.geom.Point.prototype.clone);

goog.exportProperty(
    ol.geom.Point.prototype,
    'getCoordinates',
    ol.geom.Point.prototype.getCoordinates);

goog.exportProperty(
    ol.geom.Point.prototype,
    'getType',
    ol.geom.Point.prototype.getType);

goog.exportProperty(
    ol.geom.Point.prototype,
    'intersectsExtent',
    ol.geom.Point.prototype.intersectsExtent);

goog.exportProperty(
    ol.geom.Point.prototype,
    'setCoordinates',
    ol.geom.Point.prototype.setCoordinates);

goog.exportSymbol(
    'ol.geom.Polygon',
    ol.geom.Polygon);

goog.exportProperty(
    ol.geom.Polygon.prototype,
    'appendLinearRing',
    ol.geom.Polygon.prototype.appendLinearRing);

goog.exportProperty(
    ol.geom.Polygon.prototype,
    'clone',
    ol.geom.Polygon.prototype.clone);

goog.exportProperty(
    ol.geom.Polygon.prototype,
    'getArea',
    ol.geom.Polygon.prototype.getArea);

goog.exportProperty(
    ol.geom.Polygon.prototype,
    'getCoordinates',
    ol.geom.Polygon.prototype.getCoordinates);

goog.exportProperty(
    ol.geom.Polygon.prototype,
    'getInteriorPoint',
    ol.geom.Polygon.prototype.getInteriorPoint);

goog.exportProperty(
    ol.geom.Polygon.prototype,
    'getLinearRingCount',
    ol.geom.Polygon.prototype.getLinearRingCount);

goog.exportProperty(
    ol.geom.Polygon.prototype,
    'getLinearRing',
    ol.geom.Polygon.prototype.getLinearRing);

goog.exportProperty(
    ol.geom.Polygon.prototype,
    'getLinearRings',
    ol.geom.Polygon.prototype.getLinearRings);

goog.exportProperty(
    ol.geom.Polygon.prototype,
    'getType',
    ol.geom.Polygon.prototype.getType);

goog.exportProperty(
    ol.geom.Polygon.prototype,
    'intersectsExtent',
    ol.geom.Polygon.prototype.intersectsExtent);

goog.exportProperty(
    ol.geom.Polygon.prototype,
    'setCoordinates',
    ol.geom.Polygon.prototype.setCoordinates);

goog.exportSymbol(
    'ol.geom.Polygon.circular',
    ol.geom.Polygon.circular);

goog.exportSymbol(
    'ol.geom.Polygon.fromExtent',
    ol.geom.Polygon.fromExtent);

goog.exportSymbol(
    'ol.geom.Polygon.fromCircle',
    ol.geom.Polygon.fromCircle);

goog.exportSymbol(
    'ol.geom.SimpleGeometry',
    ol.geom.SimpleGeometry);

goog.exportProperty(
    ol.geom.SimpleGeometry.prototype,
    'getFirstCoordinate',
    ol.geom.SimpleGeometry.prototype.getFirstCoordinate);

goog.exportProperty(
    ol.geom.SimpleGeometry.prototype,
    'getLastCoordinate',
    ol.geom.SimpleGeometry.prototype.getLastCoordinate);

goog.exportProperty(
    ol.geom.SimpleGeometry.prototype,
    'getLayout',
    ol.geom.SimpleGeometry.prototype.getLayout);

goog.exportProperty(
    ol.geom.SimpleGeometry.prototype,
    'applyTransform',
    ol.geom.SimpleGeometry.prototype.applyTransform);

goog.exportProperty(
    ol.geom.SimpleGeometry.prototype,
    'translate',
    ol.geom.SimpleGeometry.prototype.translate);

goog.exportSymbol(
    'ol.format.EsriJSON',
    ol.format.EsriJSON);

goog.exportProperty(
    ol.format.EsriJSON.prototype,
    'readFeature',
    ol.format.EsriJSON.prototype.readFeature);

goog.exportProperty(
    ol.format.EsriJSON.prototype,
    'readFeatures',
    ol.format.EsriJSON.prototype.readFeatures);

goog.exportProperty(
    ol.format.EsriJSON.prototype,
    'readGeometry',
    ol.format.EsriJSON.prototype.readGeometry);

goog.exportProperty(
    ol.format.EsriJSON.prototype,
    'readProjection',
    ol.format.EsriJSON.prototype.readProjection);

goog.exportProperty(
    ol.format.EsriJSON.prototype,
    'writeGeometry',
    ol.format.EsriJSON.prototype.writeGeometry);

goog.exportProperty(
    ol.format.EsriJSON.prototype,
    'writeGeometryObject',
    ol.format.EsriJSON.prototype.writeGeometryObject);

goog.exportProperty(
    ol.format.EsriJSON.prototype,
    'writeFeature',
    ol.format.EsriJSON.prototype.writeFeature);

goog.exportProperty(
    ol.format.EsriJSON.prototype,
    'writeFeatureObject',
    ol.format.EsriJSON.prototype.writeFeatureObject);

goog.exportProperty(
    ol.format.EsriJSON.prototype,
    'writeFeatures',
    ol.format.EsriJSON.prototype.writeFeatures);

goog.exportProperty(
    ol.format.EsriJSON.prototype,
    'writeFeaturesObject',
    ol.format.EsriJSON.prototype.writeFeaturesObject);

goog.exportSymbol(
    'ol.format.Feature',
    ol.format.Feature);

goog.exportSymbol(
    'ol.format.GeoJSON',
    ol.format.GeoJSON);

goog.exportProperty(
    ol.format.GeoJSON.prototype,
    'readFeature',
    ol.format.GeoJSON.prototype.readFeature);

goog.exportProperty(
    ol.format.GeoJSON.prototype,
    'readFeatures',
    ol.format.GeoJSON.prototype.readFeatures);

goog.exportProperty(
    ol.format.GeoJSON.prototype,
    'readGeometry',
    ol.format.GeoJSON.prototype.readGeometry);

goog.exportProperty(
    ol.format.GeoJSON.prototype,
    'readProjection',
    ol.format.GeoJSON.prototype.readProjection);

goog.exportProperty(
    ol.format.GeoJSON.prototype,
    'writeFeature',
    ol.format.GeoJSON.prototype.writeFeature);

goog.exportProperty(
    ol.format.GeoJSON.prototype,
    'writeFeatureObject',
    ol.format.GeoJSON.prototype.writeFeatureObject);

goog.exportProperty(
    ol.format.GeoJSON.prototype,
    'writeFeatures',
    ol.format.GeoJSON.prototype.writeFeatures);

goog.exportProperty(
    ol.format.GeoJSON.prototype,
    'writeFeaturesObject',
    ol.format.GeoJSON.prototype.writeFeaturesObject);

goog.exportProperty(
    ol.format.GeoJSON.prototype,
    'writeGeometry',
    ol.format.GeoJSON.prototype.writeGeometry);

goog.exportProperty(
    ol.format.GeoJSON.prototype,
    'writeGeometryObject',
    ol.format.GeoJSON.prototype.writeGeometryObject);

goog.exportSymbol(
    'ol.format.GPX',
    ol.format.GPX);

goog.exportProperty(
    ol.format.GPX.prototype,
    'readFeature',
    ol.format.GPX.prototype.readFeature);

goog.exportProperty(
    ol.format.GPX.prototype,
    'readFeatures',
    ol.format.GPX.prototype.readFeatures);

goog.exportProperty(
    ol.format.GPX.prototype,
    'readProjection',
    ol.format.GPX.prototype.readProjection);

goog.exportProperty(
    ol.format.GPX.prototype,
    'writeFeatures',
    ol.format.GPX.prototype.writeFeatures);

goog.exportProperty(
    ol.format.GPX.prototype,
    'writeFeaturesNode',
    ol.format.GPX.prototype.writeFeaturesNode);

goog.exportSymbol(
    'ol.format.IGC',
    ol.format.IGC);

goog.exportProperty(
    ol.format.IGC.prototype,
    'readFeature',
    ol.format.IGC.prototype.readFeature);

goog.exportProperty(
    ol.format.IGC.prototype,
    'readFeatures',
    ol.format.IGC.prototype.readFeatures);

goog.exportProperty(
    ol.format.IGC.prototype,
    'readProjection',
    ol.format.IGC.prototype.readProjection);

goog.exportSymbol(
    'ol.format.KML',
    ol.format.KML);

goog.exportProperty(
    ol.format.KML.prototype,
    'readFeature',
    ol.format.KML.prototype.readFeature);

goog.exportProperty(
    ol.format.KML.prototype,
    'readFeatures',
    ol.format.KML.prototype.readFeatures);

goog.exportProperty(
    ol.format.KML.prototype,
    'readName',
    ol.format.KML.prototype.readName);

goog.exportProperty(
    ol.format.KML.prototype,
    'readNetworkLinks',
    ol.format.KML.prototype.readNetworkLinks);

goog.exportProperty(
    ol.format.KML.prototype,
    'readProjection',
    ol.format.KML.prototype.readProjection);

goog.exportProperty(
    ol.format.KML.prototype,
    'writeFeatures',
    ol.format.KML.prototype.writeFeatures);

goog.exportProperty(
    ol.format.KML.prototype,
    'writeFeaturesNode',
    ol.format.KML.prototype.writeFeaturesNode);

goog.exportSymbol(
    'ol.format.MVT',
    ol.format.MVT);

goog.exportProperty(
    ol.format.MVT.prototype,
    'setLayers',
    ol.format.MVT.prototype.setLayers);

goog.exportSymbol(
    'ol.format.OSMXML',
    ol.format.OSMXML);

goog.exportProperty(
    ol.format.OSMXML.prototype,
    'readFeatures',
    ol.format.OSMXML.prototype.readFeatures);

goog.exportProperty(
    ol.format.OSMXML.prototype,
    'readProjection',
    ol.format.OSMXML.prototype.readProjection);

goog.exportSymbol(
    'ol.format.Polyline',
    ol.format.Polyline);

goog.exportSymbol(
    'ol.format.Polyline.encodeDeltas',
    ol.format.Polyline.encodeDeltas);

goog.exportSymbol(
    'ol.format.Polyline.decodeDeltas',
    ol.format.Polyline.decodeDeltas);

goog.exportSymbol(
    'ol.format.Polyline.encodeFloats',
    ol.format.Polyline.encodeFloats);

goog.exportSymbol(
    'ol.format.Polyline.decodeFloats',
    ol.format.Polyline.decodeFloats);

goog.exportProperty(
    ol.format.Polyline.prototype,
    'readFeature',
    ol.format.Polyline.prototype.readFeature);

goog.exportProperty(
    ol.format.Polyline.prototype,
    'readFeatures',
    ol.format.Polyline.prototype.readFeatures);

goog.exportProperty(
    ol.format.Polyline.prototype,
    'readGeometry',
    ol.format.Polyline.prototype.readGeometry);

goog.exportProperty(
    ol.format.Polyline.prototype,
    'readProjection',
    ol.format.Polyline.prototype.readProjection);

goog.exportProperty(
    ol.format.Polyline.prototype,
    'writeGeometry',
    ol.format.Polyline.prototype.writeGeometry);

goog.exportSymbol(
    'ol.format.TopoJSON',
    ol.format.TopoJSON);

goog.exportProperty(
    ol.format.TopoJSON.prototype,
    'readFeatures',
    ol.format.TopoJSON.prototype.readFeatures);

goog.exportProperty(
    ol.format.TopoJSON.prototype,
    'readProjection',
    ol.format.TopoJSON.prototype.readProjection);

goog.exportSymbol(
    'ol.format.WFS',
    ol.format.WFS);

goog.exportProperty(
    ol.format.WFS.prototype,
    'readFeatures',
    ol.format.WFS.prototype.readFeatures);

goog.exportProperty(
    ol.format.WFS.prototype,
    'readTransactionResponse',
    ol.format.WFS.prototype.readTransactionResponse);

goog.exportProperty(
    ol.format.WFS.prototype,
    'readFeatureCollectionMetadata',
    ol.format.WFS.prototype.readFeatureCollectionMetadata);

goog.exportProperty(
    ol.format.WFS.prototype,
    'writeGetFeature',
    ol.format.WFS.prototype.writeGetFeature);

goog.exportProperty(
    ol.format.WFS.prototype,
    'writeTransaction',
    ol.format.WFS.prototype.writeTransaction);

goog.exportProperty(
    ol.format.WFS.prototype,
    'readProjection',
    ol.format.WFS.prototype.readProjection);

goog.exportSymbol(
    'ol.format.WKT',
    ol.format.WKT);

goog.exportProperty(
    ol.format.WKT.prototype,
    'readFeature',
    ol.format.WKT.prototype.readFeature);

goog.exportProperty(
    ol.format.WKT.prototype,
    'readFeatures',
    ol.format.WKT.prototype.readFeatures);

goog.exportProperty(
    ol.format.WKT.prototype,
    'readGeometry',
    ol.format.WKT.prototype.readGeometry);

goog.exportProperty(
    ol.format.WKT.prototype,
    'writeFeature',
    ol.format.WKT.prototype.writeFeature);

goog.exportProperty(
    ol.format.WKT.prototype,
    'writeFeatures',
    ol.format.WKT.prototype.writeFeatures);

goog.exportProperty(
    ol.format.WKT.prototype,
    'writeGeometry',
    ol.format.WKT.prototype.writeGeometry);

goog.exportSymbol(
    'ol.format.WMSCapabilities',
    ol.format.WMSCapabilities);

goog.exportProperty(
    ol.format.WMSCapabilities.prototype,
    'read',
    ol.format.WMSCapabilities.prototype.read);

goog.exportSymbol(
    'ol.format.WMSGetFeatureInfo',
    ol.format.WMSGetFeatureInfo);

goog.exportProperty(
    ol.format.WMSGetFeatureInfo.prototype,
    'readFeatures',
    ol.format.WMSGetFeatureInfo.prototype.readFeatures);

goog.exportSymbol(
    'ol.format.WMTSCapabilities',
    ol.format.WMTSCapabilities);

goog.exportProperty(
    ol.format.WMTSCapabilities.prototype,
    'read',
    ol.format.WMTSCapabilities.prototype.read);

goog.exportSymbol(
    'ol.format.GML2',
    ol.format.GML2);

goog.exportSymbol(
    'ol.format.GML3',
    ol.format.GML3);

goog.exportProperty(
    ol.format.GML3.prototype,
    'writeGeometryNode',
    ol.format.GML3.prototype.writeGeometryNode);

goog.exportProperty(
    ol.format.GML3.prototype,
    'writeFeatures',
    ol.format.GML3.prototype.writeFeatures);

goog.exportProperty(
    ol.format.GML3.prototype,
    'writeFeaturesNode',
    ol.format.GML3.prototype.writeFeaturesNode);

goog.exportSymbol(
    'ol.format.GML',
    ol.format.GML);

goog.exportProperty(
    ol.format.GML.prototype,
    'writeFeatures',
    ol.format.GML.prototype.writeFeatures);

goog.exportProperty(
    ol.format.GML.prototype,
    'writeFeaturesNode',
    ol.format.GML.prototype.writeFeaturesNode);

goog.exportProperty(
    ol.format.GMLBase.prototype,
    'readFeatures',
    ol.format.GMLBase.prototype.readFeatures);

goog.exportSymbol(
    'ol.events.condition.altKeyOnly',
    ol.events.condition.altKeyOnly);

goog.exportSymbol(
    'ol.events.condition.altShiftKeysOnly',
    ol.events.condition.altShiftKeysOnly);

goog.exportSymbol(
    'ol.events.condition.always',
    ol.events.condition.always);

goog.exportSymbol(
    'ol.events.condition.click',
    ol.events.condition.click);

goog.exportSymbol(
    'ol.events.condition.never',
    ol.events.condition.never);

goog.exportSymbol(
    'ol.events.condition.pointerMove',
    ol.events.condition.pointerMove);

goog.exportSymbol(
    'ol.events.condition.singleClick',
    ol.events.condition.singleClick);

goog.exportSymbol(
    'ol.events.condition.doubleClick',
    ol.events.condition.doubleClick);

goog.exportSymbol(
    'ol.events.condition.noModifierKeys',
    ol.events.condition.noModifierKeys);

goog.exportSymbol(
    'ol.events.condition.platformModifierKeyOnly',
    ol.events.condition.platformModifierKeyOnly);

goog.exportSymbol(
    'ol.events.condition.shiftKeyOnly',
    ol.events.condition.shiftKeyOnly);

goog.exportSymbol(
    'ol.events.condition.targetNotEditable',
    ol.events.condition.targetNotEditable);

goog.exportSymbol(
    'ol.events.condition.mouseOnly',
    ol.events.condition.mouseOnly);

goog.exportSymbol(
    'ol.control.Attribution',
    ol.control.Attribution);

goog.exportSymbol(
    'ol.control.Attribution.render',
    ol.control.Attribution.render);

goog.exportProperty(
    ol.control.Attribution.prototype,
    'getCollapsible',
    ol.control.Attribution.prototype.getCollapsible);

goog.exportProperty(
    ol.control.Attribution.prototype,
    'setCollapsible',
    ol.control.Attribution.prototype.setCollapsible);

goog.exportProperty(
    ol.control.Attribution.prototype,
    'setCollapsed',
    ol.control.Attribution.prototype.setCollapsed);

goog.exportProperty(
    ol.control.Attribution.prototype,
    'getCollapsed',
    ol.control.Attribution.prototype.getCollapsed);

goog.exportSymbol(
    'ol.control.Control',
    ol.control.Control);

goog.exportProperty(
    ol.control.Control.prototype,
    'getMap',
    ol.control.Control.prototype.getMap);

goog.exportProperty(
    ol.control.Control.prototype,
    'setMap',
    ol.control.Control.prototype.setMap);

goog.exportProperty(
    ol.control.Control.prototype,
    'setTarget',
    ol.control.Control.prototype.setTarget);

goog.exportSymbol(
    'ol.control.defaults',
    ol.control.defaults);

goog.exportSymbol(
    'ol.control.FullScreen',
    ol.control.FullScreen);

goog.exportSymbol(
    'ol.control.MousePosition',
    ol.control.MousePosition);

goog.exportSymbol(
    'ol.control.MousePosition.render',
    ol.control.MousePosition.render);

goog.exportProperty(
    ol.control.MousePosition.prototype,
    'getCoordinateFormat',
    ol.control.MousePosition.prototype.getCoordinateFormat);

goog.exportProperty(
    ol.control.MousePosition.prototype,
    'getProjection',
    ol.control.MousePosition.prototype.getProjection);

goog.exportProperty(
    ol.control.MousePosition.prototype,
    'setMap',
    ol.control.MousePosition.prototype.setMap);

goog.exportProperty(
    ol.control.MousePosition.prototype,
    'setCoordinateFormat',
    ol.control.MousePosition.prototype.setCoordinateFormat);

goog.exportProperty(
    ol.control.MousePosition.prototype,
    'setProjection',
    ol.control.MousePosition.prototype.setProjection);

goog.exportSymbol(
    'ol.control.OverviewMap',
    ol.control.OverviewMap);

goog.exportProperty(
    ol.control.OverviewMap.prototype,
    'setMap',
    ol.control.OverviewMap.prototype.setMap);

goog.exportSymbol(
    'ol.control.OverviewMap.render',
    ol.control.OverviewMap.render);

goog.exportProperty(
    ol.control.OverviewMap.prototype,
    'getCollapsible',
    ol.control.OverviewMap.prototype.getCollapsible);

goog.exportProperty(
    ol.control.OverviewMap.prototype,
    'setCollapsible',
    ol.control.OverviewMap.prototype.setCollapsible);

goog.exportProperty(
    ol.control.OverviewMap.prototype,
    'setCollapsed',
    ol.control.OverviewMap.prototype.setCollapsed);

goog.exportProperty(
    ol.control.OverviewMap.prototype,
    'getCollapsed',
    ol.control.OverviewMap.prototype.getCollapsed);

goog.exportProperty(
    ol.control.OverviewMap.prototype,
    'getOverviewMap',
    ol.control.OverviewMap.prototype.getOverviewMap);

goog.exportSymbol(
    'ol.control.Rotate',
    ol.control.Rotate);

goog.exportSymbol(
    'ol.control.Rotate.render',
    ol.control.Rotate.render);

goog.exportSymbol(
    'ol.control.ScaleLine',
    ol.control.ScaleLine);

goog.exportProperty(
    ol.control.ScaleLine.prototype,
    'getUnits',
    ol.control.ScaleLine.prototype.getUnits);

goog.exportSymbol(
    'ol.control.ScaleLine.render',
    ol.control.ScaleLine.render);

goog.exportProperty(
    ol.control.ScaleLine.prototype,
    'setUnits',
    ol.control.ScaleLine.prototype.setUnits);

goog.exportSymbol(
    'ol.control.Zoom',
    ol.control.Zoom);

goog.exportSymbol(
    'ol.control.ZoomSlider',
    ol.control.ZoomSlider);

goog.exportSymbol(
    'ol.control.ZoomSlider.render',
    ol.control.ZoomSlider.render);

goog.exportSymbol(
    'ol.control.ZoomToExtent',
    ol.control.ZoomToExtent);

goog.exportSymbol(
    'ol.color.asArray',
    ol.color.asArray);

goog.exportSymbol(
    'ol.color.asString',
    ol.color.asString);

goog.exportProperty(
    M.Control.prototype,
    'getImpl',
    M.Control.prototype.getImpl);

goog.exportProperty(
    M.Control.prototype,
    'onLoad',
    M.Control.prototype.onLoad);

goog.exportProperty(
    M.Label.prototype,
    'setImpl',
    M.Label.prototype.setImpl);

goog.exportProperty(
    M.Label.prototype,
    'addTo',
    M.Label.prototype.addTo);

goog.exportProperty(
    M.Label.prototype,
    'createView',
    M.Label.prototype.createView);

goog.exportProperty(
    M.Label.prototype,
    'activate',
    M.Label.prototype.activate);

goog.exportProperty(
    M.Label.prototype,
    'deactivate',
    M.Label.prototype.deactivate);

goog.exportProperty(
    M.Label.prototype,
    'getImpl',
    M.Label.prototype.getImpl);

goog.exportProperty(
    M.Label.prototype,
    'onLoad',
    M.Label.prototype.onLoad);

goog.exportProperty(
    ol.Object.prototype,
    'changed',
    ol.Object.prototype.changed);

goog.exportProperty(
    ol.Object.prototype,
    'dispatchEvent',
    ol.Object.prototype.dispatchEvent);

goog.exportProperty(
    ol.Object.prototype,
    'getRevision',
    ol.Object.prototype.getRevision);

goog.exportProperty(
    ol.Object.prototype,
    'on',
    ol.Object.prototype.on);

goog.exportProperty(
    ol.Object.prototype,
    'once',
    ol.Object.prototype.once);

goog.exportProperty(
    ol.Object.prototype,
    'un',
    ol.Object.prototype.un);

goog.exportProperty(
    ol.Object.prototype,
    'unByKey',
    ol.Object.prototype.unByKey);

goog.exportProperty(
    ol.control.Control.prototype,
    'get',
    ol.control.Control.prototype.get);

goog.exportProperty(
    ol.control.Control.prototype,
    'getKeys',
    ol.control.Control.prototype.getKeys);

goog.exportProperty(
    ol.control.Control.prototype,
    'getProperties',
    ol.control.Control.prototype.getProperties);

goog.exportProperty(
    ol.control.Control.prototype,
    'set',
    ol.control.Control.prototype.set);

goog.exportProperty(
    ol.control.Control.prototype,
    'setProperties',
    ol.control.Control.prototype.setProperties);

goog.exportProperty(
    ol.control.Control.prototype,
    'unset',
    ol.control.Control.prototype.unset);

goog.exportProperty(
    ol.control.Control.prototype,
    'changed',
    ol.control.Control.prototype.changed);

goog.exportProperty(
    ol.control.Control.prototype,
    'dispatchEvent',
    ol.control.Control.prototype.dispatchEvent);

goog.exportProperty(
    ol.control.Control.prototype,
    'getRevision',
    ol.control.Control.prototype.getRevision);

goog.exportProperty(
    ol.control.Control.prototype,
    'on',
    ol.control.Control.prototype.on);

goog.exportProperty(
    ol.control.Control.prototype,
    'once',
    ol.control.Control.prototype.once);

goog.exportProperty(
    ol.control.Control.prototype,
    'un',
    ol.control.Control.prototype.un);

goog.exportProperty(
    ol.control.Control.prototype,
    'unByKey',
    ol.control.Control.prototype.unByKey);

goog.exportProperty(
    M.impl.Label.prototype,
    'getMap',
    M.impl.Label.prototype.getMap);

goog.exportProperty(
    M.impl.Label.prototype,
    'setMap',
    M.impl.Label.prototype.setMap);

goog.exportProperty(
    M.impl.Label.prototype,
    'setTarget',
    M.impl.Label.prototype.setTarget);

goog.exportProperty(
    M.impl.Label.prototype,
    'get',
    M.impl.Label.prototype.get);

goog.exportProperty(
    M.impl.Label.prototype,
    'getKeys',
    M.impl.Label.prototype.getKeys);

goog.exportProperty(
    M.impl.Label.prototype,
    'getProperties',
    M.impl.Label.prototype.getProperties);

goog.exportProperty(
    M.impl.Label.prototype,
    'set',
    M.impl.Label.prototype.set);

goog.exportProperty(
    M.impl.Label.prototype,
    'setProperties',
    M.impl.Label.prototype.setProperties);

goog.exportProperty(
    M.impl.Label.prototype,
    'unset',
    M.impl.Label.prototype.unset);

goog.exportProperty(
    M.impl.Label.prototype,
    'changed',
    M.impl.Label.prototype.changed);

goog.exportProperty(
    M.impl.Label.prototype,
    'dispatchEvent',
    M.impl.Label.prototype.dispatchEvent);

goog.exportProperty(
    M.impl.Label.prototype,
    'getRevision',
    M.impl.Label.prototype.getRevision);

goog.exportProperty(
    M.impl.Label.prototype,
    'on',
    M.impl.Label.prototype.on);

goog.exportProperty(
    M.impl.Label.prototype,
    'once',
    M.impl.Label.prototype.once);

goog.exportProperty(
    M.impl.Label.prototype,
    'un',
    M.impl.Label.prototype.un);

goog.exportProperty(
    M.impl.Label.prototype,
    'unByKey',
    M.impl.Label.prototype.unByKey);

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
    'onLoad',
    M.Plugin.prototype.onLoad);

goog.exportProperty(
    ol.View.prototype,
    'get',
    ol.View.prototype.get);

goog.exportProperty(
    ol.View.prototype,
    'getKeys',
    ol.View.prototype.getKeys);

goog.exportProperty(
    ol.View.prototype,
    'getProperties',
    ol.View.prototype.getProperties);

goog.exportProperty(
    ol.View.prototype,
    'set',
    ol.View.prototype.set);

goog.exportProperty(
    ol.View.prototype,
    'setProperties',
    ol.View.prototype.setProperties);

goog.exportProperty(
    ol.View.prototype,
    'unset',
    ol.View.prototype.unset);

goog.exportProperty(
    ol.View.prototype,
    'changed',
    ol.View.prototype.changed);

goog.exportProperty(
    ol.View.prototype,
    'dispatchEvent',
    ol.View.prototype.dispatchEvent);

goog.exportProperty(
    ol.View.prototype,
    'getRevision',
    ol.View.prototype.getRevision);

goog.exportProperty(
    ol.View.prototype,
    'on',
    ol.View.prototype.on);

goog.exportProperty(
    ol.View.prototype,
    'once',
    ol.View.prototype.once);

goog.exportProperty(
    ol.View.prototype,
    'un',
    ol.View.prototype.un);

goog.exportProperty(
    ol.View.prototype,
    'unByKey',
    ol.View.prototype.unByKey);

goog.exportProperty(
    M.impl.View.prototype,
    'constrainCenter',
    M.impl.View.prototype.constrainCenter);

goog.exportProperty(
    M.impl.View.prototype,
    'constrainResolution',
    M.impl.View.prototype.constrainResolution);

goog.exportProperty(
    M.impl.View.prototype,
    'constrainRotation',
    M.impl.View.prototype.constrainRotation);

goog.exportProperty(
    M.impl.View.prototype,
    'getCenter',
    M.impl.View.prototype.getCenter);

goog.exportProperty(
    M.impl.View.prototype,
    'calculateExtent',
    M.impl.View.prototype.calculateExtent);

goog.exportProperty(
    M.impl.View.prototype,
    'getProjection',
    M.impl.View.prototype.getProjection);

goog.exportProperty(
    M.impl.View.prototype,
    'getResolution',
    M.impl.View.prototype.getResolution);

goog.exportProperty(
    M.impl.View.prototype,
    'getRotation',
    M.impl.View.prototype.getRotation);

goog.exportProperty(
    M.impl.View.prototype,
    'getZoom',
    M.impl.View.prototype.getZoom);

goog.exportProperty(
    M.impl.View.prototype,
    'fit',
    M.impl.View.prototype.fit);

goog.exportProperty(
    M.impl.View.prototype,
    'centerOn',
    M.impl.View.prototype.centerOn);

goog.exportProperty(
    M.impl.View.prototype,
    'rotate',
    M.impl.View.prototype.rotate);

goog.exportProperty(
    M.impl.View.prototype,
    'setCenter',
    M.impl.View.prototype.setCenter);

goog.exportProperty(
    M.impl.View.prototype,
    'setResolution',
    M.impl.View.prototype.setResolution);

goog.exportProperty(
    M.impl.View.prototype,
    'setRotation',
    M.impl.View.prototype.setRotation);

goog.exportProperty(
    M.impl.View.prototype,
    'setZoom',
    M.impl.View.prototype.setZoom);

goog.exportProperty(
    M.impl.View.prototype,
    'get',
    M.impl.View.prototype.get);

goog.exportProperty(
    M.impl.View.prototype,
    'getKeys',
    M.impl.View.prototype.getKeys);

goog.exportProperty(
    M.impl.View.prototype,
    'getProperties',
    M.impl.View.prototype.getProperties);

goog.exportProperty(
    M.impl.View.prototype,
    'set',
    M.impl.View.prototype.set);

goog.exportProperty(
    M.impl.View.prototype,
    'setProperties',
    M.impl.View.prototype.setProperties);

goog.exportProperty(
    M.impl.View.prototype,
    'unset',
    M.impl.View.prototype.unset);

goog.exportProperty(
    M.impl.View.prototype,
    'changed',
    M.impl.View.prototype.changed);

goog.exportProperty(
    M.impl.View.prototype,
    'dispatchEvent',
    M.impl.View.prototype.dispatchEvent);

goog.exportProperty(
    M.impl.View.prototype,
    'getRevision',
    M.impl.View.prototype.getRevision);

goog.exportProperty(
    M.impl.View.prototype,
    'on',
    M.impl.View.prototype.on);

goog.exportProperty(
    M.impl.View.prototype,
    'once',
    M.impl.View.prototype.once);

goog.exportProperty(
    M.impl.View.prototype,
    'un',
    M.impl.View.prototype.un);

goog.exportProperty(
    M.impl.View.prototype,
    'unByKey',
    M.impl.View.prototype.unByKey);

goog.exportProperty(
    ol.Collection.prototype,
    'get',
    ol.Collection.prototype.get);

goog.exportProperty(
    ol.Collection.prototype,
    'getKeys',
    ol.Collection.prototype.getKeys);

goog.exportProperty(
    ol.Collection.prototype,
    'getProperties',
    ol.Collection.prototype.getProperties);

goog.exportProperty(
    ol.Collection.prototype,
    'set',
    ol.Collection.prototype.set);

goog.exportProperty(
    ol.Collection.prototype,
    'setProperties',
    ol.Collection.prototype.setProperties);

goog.exportProperty(
    ol.Collection.prototype,
    'unset',
    ol.Collection.prototype.unset);

goog.exportProperty(
    ol.Collection.prototype,
    'changed',
    ol.Collection.prototype.changed);

goog.exportProperty(
    ol.Collection.prototype,
    'dispatchEvent',
    ol.Collection.prototype.dispatchEvent);

goog.exportProperty(
    ol.Collection.prototype,
    'getRevision',
    ol.Collection.prototype.getRevision);

goog.exportProperty(
    ol.Collection.prototype,
    'on',
    ol.Collection.prototype.on);

goog.exportProperty(
    ol.Collection.prototype,
    'once',
    ol.Collection.prototype.once);

goog.exportProperty(
    ol.Collection.prototype,
    'un',
    ol.Collection.prototype.un);

goog.exportProperty(
    ol.Collection.prototype,
    'unByKey',
    ol.Collection.prototype.unByKey);

goog.exportProperty(
    ol.DeviceOrientation.prototype,
    'get',
    ol.DeviceOrientation.prototype.get);

goog.exportProperty(
    ol.DeviceOrientation.prototype,
    'getKeys',
    ol.DeviceOrientation.prototype.getKeys);

goog.exportProperty(
    ol.DeviceOrientation.prototype,
    'getProperties',
    ol.DeviceOrientation.prototype.getProperties);

goog.exportProperty(
    ol.DeviceOrientation.prototype,
    'set',
    ol.DeviceOrientation.prototype.set);

goog.exportProperty(
    ol.DeviceOrientation.prototype,
    'setProperties',
    ol.DeviceOrientation.prototype.setProperties);

goog.exportProperty(
    ol.DeviceOrientation.prototype,
    'unset',
    ol.DeviceOrientation.prototype.unset);

goog.exportProperty(
    ol.DeviceOrientation.prototype,
    'changed',
    ol.DeviceOrientation.prototype.changed);

goog.exportProperty(
    ol.DeviceOrientation.prototype,
    'dispatchEvent',
    ol.DeviceOrientation.prototype.dispatchEvent);

goog.exportProperty(
    ol.DeviceOrientation.prototype,
    'getRevision',
    ol.DeviceOrientation.prototype.getRevision);

goog.exportProperty(
    ol.DeviceOrientation.prototype,
    'on',
    ol.DeviceOrientation.prototype.on);

goog.exportProperty(
    ol.DeviceOrientation.prototype,
    'once',
    ol.DeviceOrientation.prototype.once);

goog.exportProperty(
    ol.DeviceOrientation.prototype,
    'un',
    ol.DeviceOrientation.prototype.un);

goog.exportProperty(
    ol.DeviceOrientation.prototype,
    'unByKey',
    ol.DeviceOrientation.prototype.unByKey);

goog.exportProperty(
    ol.Feature.prototype,
    'get',
    ol.Feature.prototype.get);

goog.exportProperty(
    ol.Feature.prototype,
    'getKeys',
    ol.Feature.prototype.getKeys);

goog.exportProperty(
    ol.Feature.prototype,
    'getProperties',
    ol.Feature.prototype.getProperties);

goog.exportProperty(
    ol.Feature.prototype,
    'set',
    ol.Feature.prototype.set);

goog.exportProperty(
    ol.Feature.prototype,
    'setProperties',
    ol.Feature.prototype.setProperties);

goog.exportProperty(
    ol.Feature.prototype,
    'unset',
    ol.Feature.prototype.unset);

goog.exportProperty(
    ol.Feature.prototype,
    'changed',
    ol.Feature.prototype.changed);

goog.exportProperty(
    ol.Feature.prototype,
    'dispatchEvent',
    ol.Feature.prototype.dispatchEvent);

goog.exportProperty(
    ol.Feature.prototype,
    'getRevision',
    ol.Feature.prototype.getRevision);

goog.exportProperty(
    ol.Feature.prototype,
    'on',
    ol.Feature.prototype.on);

goog.exportProperty(
    ol.Feature.prototype,
    'once',
    ol.Feature.prototype.once);

goog.exportProperty(
    ol.Feature.prototype,
    'un',
    ol.Feature.prototype.un);

goog.exportProperty(
    ol.Feature.prototype,
    'unByKey',
    ol.Feature.prototype.unByKey);

goog.exportProperty(
    ol.Geolocation.prototype,
    'get',
    ol.Geolocation.prototype.get);

goog.exportProperty(
    ol.Geolocation.prototype,
    'getKeys',
    ol.Geolocation.prototype.getKeys);

goog.exportProperty(
    ol.Geolocation.prototype,
    'getProperties',
    ol.Geolocation.prototype.getProperties);

goog.exportProperty(
    ol.Geolocation.prototype,
    'set',
    ol.Geolocation.prototype.set);

goog.exportProperty(
    ol.Geolocation.prototype,
    'setProperties',
    ol.Geolocation.prototype.setProperties);

goog.exportProperty(
    ol.Geolocation.prototype,
    'unset',
    ol.Geolocation.prototype.unset);

goog.exportProperty(
    ol.Geolocation.prototype,
    'changed',
    ol.Geolocation.prototype.changed);

goog.exportProperty(
    ol.Geolocation.prototype,
    'dispatchEvent',
    ol.Geolocation.prototype.dispatchEvent);

goog.exportProperty(
    ol.Geolocation.prototype,
    'getRevision',
    ol.Geolocation.prototype.getRevision);

goog.exportProperty(
    ol.Geolocation.prototype,
    'on',
    ol.Geolocation.prototype.on);

goog.exportProperty(
    ol.Geolocation.prototype,
    'once',
    ol.Geolocation.prototype.once);

goog.exportProperty(
    ol.Geolocation.prototype,
    'un',
    ol.Geolocation.prototype.un);

goog.exportProperty(
    ol.Geolocation.prototype,
    'unByKey',
    ol.Geolocation.prototype.unByKey);

goog.exportProperty(
    ol.ImageTile.prototype,
    'getTileCoord',
    ol.ImageTile.prototype.getTileCoord);

goog.exportProperty(
    ol.Map.prototype,
    'get',
    ol.Map.prototype.get);

goog.exportProperty(
    ol.Map.prototype,
    'getKeys',
    ol.Map.prototype.getKeys);

goog.exportProperty(
    ol.Map.prototype,
    'getProperties',
    ol.Map.prototype.getProperties);

goog.exportProperty(
    ol.Map.prototype,
    'set',
    ol.Map.prototype.set);

goog.exportProperty(
    ol.Map.prototype,
    'setProperties',
    ol.Map.prototype.setProperties);

goog.exportProperty(
    ol.Map.prototype,
    'unset',
    ol.Map.prototype.unset);

goog.exportProperty(
    ol.Map.prototype,
    'changed',
    ol.Map.prototype.changed);

goog.exportProperty(
    ol.Map.prototype,
    'dispatchEvent',
    ol.Map.prototype.dispatchEvent);

goog.exportProperty(
    ol.Map.prototype,
    'getRevision',
    ol.Map.prototype.getRevision);

goog.exportProperty(
    ol.Map.prototype,
    'on',
    ol.Map.prototype.on);

goog.exportProperty(
    ol.Map.prototype,
    'once',
    ol.Map.prototype.once);

goog.exportProperty(
    ol.Map.prototype,
    'un',
    ol.Map.prototype.un);

goog.exportProperty(
    ol.Map.prototype,
    'unByKey',
    ol.Map.prototype.unByKey);

goog.exportProperty(
    ol.MapBrowserEvent.prototype,
    'map',
    ol.MapBrowserEvent.prototype.map);

goog.exportProperty(
    ol.MapBrowserEvent.prototype,
    'frameState',
    ol.MapBrowserEvent.prototype.frameState);

goog.exportProperty(
    ol.MapBrowserPointerEvent.prototype,
    'originalEvent',
    ol.MapBrowserPointerEvent.prototype.originalEvent);

goog.exportProperty(
    ol.MapBrowserPointerEvent.prototype,
    'pixel',
    ol.MapBrowserPointerEvent.prototype.pixel);

goog.exportProperty(
    ol.MapBrowserPointerEvent.prototype,
    'coordinate',
    ol.MapBrowserPointerEvent.prototype.coordinate);

goog.exportProperty(
    ol.MapBrowserPointerEvent.prototype,
    'dragging',
    ol.MapBrowserPointerEvent.prototype.dragging);

goog.exportProperty(
    ol.MapBrowserPointerEvent.prototype,
    'preventDefault',
    ol.MapBrowserPointerEvent.prototype.preventDefault);

goog.exportProperty(
    ol.MapBrowserPointerEvent.prototype,
    'stopPropagation',
    ol.MapBrowserPointerEvent.prototype.stopPropagation);

goog.exportProperty(
    ol.MapBrowserPointerEvent.prototype,
    'map',
    ol.MapBrowserPointerEvent.prototype.map);

goog.exportProperty(
    ol.MapBrowserPointerEvent.prototype,
    'frameState',
    ol.MapBrowserPointerEvent.prototype.frameState);

goog.exportProperty(
    ol.Overlay.prototype,
    'get',
    ol.Overlay.prototype.get);

goog.exportProperty(
    ol.Overlay.prototype,
    'getKeys',
    ol.Overlay.prototype.getKeys);

goog.exportProperty(
    ol.Overlay.prototype,
    'getProperties',
    ol.Overlay.prototype.getProperties);

goog.exportProperty(
    ol.Overlay.prototype,
    'set',
    ol.Overlay.prototype.set);

goog.exportProperty(
    ol.Overlay.prototype,
    'setProperties',
    ol.Overlay.prototype.setProperties);

goog.exportProperty(
    ol.Overlay.prototype,
    'unset',
    ol.Overlay.prototype.unset);

goog.exportProperty(
    ol.Overlay.prototype,
    'changed',
    ol.Overlay.prototype.changed);

goog.exportProperty(
    ol.Overlay.prototype,
    'dispatchEvent',
    ol.Overlay.prototype.dispatchEvent);

goog.exportProperty(
    ol.Overlay.prototype,
    'getRevision',
    ol.Overlay.prototype.getRevision);

goog.exportProperty(
    ol.Overlay.prototype,
    'on',
    ol.Overlay.prototype.on);

goog.exportProperty(
    ol.Overlay.prototype,
    'once',
    ol.Overlay.prototype.once);

goog.exportProperty(
    ol.Overlay.prototype,
    'un',
    ol.Overlay.prototype.un);

goog.exportProperty(
    ol.Overlay.prototype,
    'unByKey',
    ol.Overlay.prototype.unByKey);

goog.exportProperty(
    ol.VectorTile.prototype,
    'getTileCoord',
    ol.VectorTile.prototype.getTileCoord);

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
    'onLoad',
    M.Map.prototype.onLoad);

goog.exportProperty(
    ol.tilegrid.WMTS.prototype,
    'getMaxZoom',
    ol.tilegrid.WMTS.prototype.getMaxZoom);

goog.exportProperty(
    ol.tilegrid.WMTS.prototype,
    'getMinZoom',
    ol.tilegrid.WMTS.prototype.getMinZoom);

goog.exportProperty(
    ol.tilegrid.WMTS.prototype,
    'getOrigin',
    ol.tilegrid.WMTS.prototype.getOrigin);

goog.exportProperty(
    ol.tilegrid.WMTS.prototype,
    'getResolution',
    ol.tilegrid.WMTS.prototype.getResolution);

goog.exportProperty(
    ol.tilegrid.WMTS.prototype,
    'getResolutions',
    ol.tilegrid.WMTS.prototype.getResolutions);

goog.exportProperty(
    ol.tilegrid.WMTS.prototype,
    'getTileCoordExtent',
    ol.tilegrid.WMTS.prototype.getTileCoordExtent);

goog.exportProperty(
    ol.tilegrid.WMTS.prototype,
    'getTileCoordForCoordAndResolution',
    ol.tilegrid.WMTS.prototype.getTileCoordForCoordAndResolution);

goog.exportProperty(
    ol.tilegrid.WMTS.prototype,
    'getTileCoordForCoordAndZ',
    ol.tilegrid.WMTS.prototype.getTileCoordForCoordAndZ);

goog.exportProperty(
    ol.tilegrid.WMTS.prototype,
    'getTileSize',
    ol.tilegrid.WMTS.prototype.getTileSize);

goog.exportProperty(
    M.impl.Popup.prototype,
    'getElement',
    M.impl.Popup.prototype.getElement);

goog.exportProperty(
    M.impl.Popup.prototype,
    'getId',
    M.impl.Popup.prototype.getId);

goog.exportProperty(
    M.impl.Popup.prototype,
    'getMap',
    M.impl.Popup.prototype.getMap);

goog.exportProperty(
    M.impl.Popup.prototype,
    'getOffset',
    M.impl.Popup.prototype.getOffset);

goog.exportProperty(
    M.impl.Popup.prototype,
    'getPosition',
    M.impl.Popup.prototype.getPosition);

goog.exportProperty(
    M.impl.Popup.prototype,
    'getPositioning',
    M.impl.Popup.prototype.getPositioning);

goog.exportProperty(
    M.impl.Popup.prototype,
    'setElement',
    M.impl.Popup.prototype.setElement);

goog.exportProperty(
    M.impl.Popup.prototype,
    'setMap',
    M.impl.Popup.prototype.setMap);

goog.exportProperty(
    M.impl.Popup.prototype,
    'setOffset',
    M.impl.Popup.prototype.setOffset);

goog.exportProperty(
    M.impl.Popup.prototype,
    'setPosition',
    M.impl.Popup.prototype.setPosition);

goog.exportProperty(
    M.impl.Popup.prototype,
    'setPositioning',
    M.impl.Popup.prototype.setPositioning);

goog.exportProperty(
    M.impl.Popup.prototype,
    'get',
    M.impl.Popup.prototype.get);

goog.exportProperty(
    M.impl.Popup.prototype,
    'getKeys',
    M.impl.Popup.prototype.getKeys);

goog.exportProperty(
    M.impl.Popup.prototype,
    'getProperties',
    M.impl.Popup.prototype.getProperties);

goog.exportProperty(
    M.impl.Popup.prototype,
    'set',
    M.impl.Popup.prototype.set);

goog.exportProperty(
    M.impl.Popup.prototype,
    'setProperties',
    M.impl.Popup.prototype.setProperties);

goog.exportProperty(
    M.impl.Popup.prototype,
    'unset',
    M.impl.Popup.prototype.unset);

goog.exportProperty(
    M.impl.Popup.prototype,
    'changed',
    M.impl.Popup.prototype.changed);

goog.exportProperty(
    M.impl.Popup.prototype,
    'dispatchEvent',
    M.impl.Popup.prototype.dispatchEvent);

goog.exportProperty(
    M.impl.Popup.prototype,
    'getRevision',
    M.impl.Popup.prototype.getRevision);

goog.exportProperty(
    M.impl.Popup.prototype,
    'on',
    M.impl.Popup.prototype.on);

goog.exportProperty(
    M.impl.Popup.prototype,
    'once',
    M.impl.Popup.prototype.once);

goog.exportProperty(
    M.impl.Popup.prototype,
    'un',
    M.impl.Popup.prototype.un);

goog.exportProperty(
    M.impl.Popup.prototype,
    'unByKey',
    M.impl.Popup.prototype.unByKey);

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
    'onLoad',
    M.Layer.prototype.onLoad);

goog.exportProperty(
    M.layer.KML.prototype,
    'isVisible',
    M.layer.KML.prototype.isVisible);

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
    'getImpl',
    M.layer.KML.prototype.getImpl);

goog.exportProperty(
    M.layer.KML.prototype,
    'setImpl',
    M.layer.KML.prototype.setImpl);

goog.exportProperty(
    M.layer.KML.prototype,
    'onLoad',
    M.layer.KML.prototype.onLoad);

goog.exportProperty(
    M.layer.OSM.prototype,
    'isVisible',
    M.layer.OSM.prototype.isVisible);

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
    'getImpl',
    M.layer.OSM.prototype.getImpl);

goog.exportProperty(
    M.layer.OSM.prototype,
    'setImpl',
    M.layer.OSM.prototype.setImpl);

goog.exportProperty(
    M.layer.OSM.prototype,
    'onLoad',
    M.layer.OSM.prototype.onLoad);

goog.exportProperty(
    M.layer.WFS.prototype,
    'isVisible',
    M.layer.WFS.prototype.isVisible);

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
    'getImpl',
    M.layer.WFS.prototype.getImpl);

goog.exportProperty(
    M.layer.WFS.prototype,
    'setImpl',
    M.layer.WFS.prototype.setImpl);

goog.exportProperty(
    M.layer.WFS.prototype,
    'onLoad',
    M.layer.WFS.prototype.onLoad);

goog.exportProperty(
    M.layer.WMC.prototype,
    'isVisible',
    M.layer.WMC.prototype.isVisible);

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
    'getImpl',
    M.layer.WMC.prototype.getImpl);

goog.exportProperty(
    M.layer.WMC.prototype,
    'setImpl',
    M.layer.WMC.prototype.setImpl);

goog.exportProperty(
    M.layer.WMC.prototype,
    'onLoad',
    M.layer.WMC.prototype.onLoad);

goog.exportProperty(
    M.layer.WMS.prototype,
    'isVisible',
    M.layer.WMS.prototype.isVisible);

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
    'getImpl',
    M.layer.WMS.prototype.getImpl);

goog.exportProperty(
    M.layer.WMS.prototype,
    'setImpl',
    M.layer.WMS.prototype.setImpl);

goog.exportProperty(
    M.layer.WMS.prototype,
    'onLoad',
    M.layer.WMS.prototype.onLoad);

goog.exportProperty(
    M.layer.WMTS.prototype,
    'isVisible',
    M.layer.WMTS.prototype.isVisible);

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
    'getImpl',
    M.layer.WMTS.prototype.getImpl);

goog.exportProperty(
    M.layer.WMTS.prototype,
    'setImpl',
    M.layer.WMTS.prototype.setImpl);

goog.exportProperty(
    M.layer.WMTS.prototype,
    'onLoad',
    M.layer.WMTS.prototype.onLoad);

goog.exportProperty(
    ol.style.Circle.prototype,
    'getOpacity',
    ol.style.Circle.prototype.getOpacity);

goog.exportProperty(
    ol.style.Circle.prototype,
    'getRotateWithView',
    ol.style.Circle.prototype.getRotateWithView);

goog.exportProperty(
    ol.style.Circle.prototype,
    'getRotation',
    ol.style.Circle.prototype.getRotation);

goog.exportProperty(
    ol.style.Circle.prototype,
    'getScale',
    ol.style.Circle.prototype.getScale);

goog.exportProperty(
    ol.style.Circle.prototype,
    'getSnapToPixel',
    ol.style.Circle.prototype.getSnapToPixel);

goog.exportProperty(
    ol.style.Circle.prototype,
    'setOpacity',
    ol.style.Circle.prototype.setOpacity);

goog.exportProperty(
    ol.style.Circle.prototype,
    'setRotation',
    ol.style.Circle.prototype.setRotation);

goog.exportProperty(
    ol.style.Circle.prototype,
    'setScale',
    ol.style.Circle.prototype.setScale);

goog.exportProperty(
    ol.style.Icon.prototype,
    'getOpacity',
    ol.style.Icon.prototype.getOpacity);

goog.exportProperty(
    ol.style.Icon.prototype,
    'getRotateWithView',
    ol.style.Icon.prototype.getRotateWithView);

goog.exportProperty(
    ol.style.Icon.prototype,
    'getRotation',
    ol.style.Icon.prototype.getRotation);

goog.exportProperty(
    ol.style.Icon.prototype,
    'getScale',
    ol.style.Icon.prototype.getScale);

goog.exportProperty(
    ol.style.Icon.prototype,
    'getSnapToPixel',
    ol.style.Icon.prototype.getSnapToPixel);

goog.exportProperty(
    ol.style.Icon.prototype,
    'setOpacity',
    ol.style.Icon.prototype.setOpacity);

goog.exportProperty(
    ol.style.Icon.prototype,
    'setRotation',
    ol.style.Icon.prototype.setRotation);

goog.exportProperty(
    ol.style.Icon.prototype,
    'setScale',
    ol.style.Icon.prototype.setScale);

goog.exportProperty(
    ol.style.RegularShape.prototype,
    'getOpacity',
    ol.style.RegularShape.prototype.getOpacity);

goog.exportProperty(
    ol.style.RegularShape.prototype,
    'getRotateWithView',
    ol.style.RegularShape.prototype.getRotateWithView);

goog.exportProperty(
    ol.style.RegularShape.prototype,
    'getRotation',
    ol.style.RegularShape.prototype.getRotation);

goog.exportProperty(
    ol.style.RegularShape.prototype,
    'getScale',
    ol.style.RegularShape.prototype.getScale);

goog.exportProperty(
    ol.style.RegularShape.prototype,
    'getSnapToPixel',
    ol.style.RegularShape.prototype.getSnapToPixel);

goog.exportProperty(
    ol.style.RegularShape.prototype,
    'setOpacity',
    ol.style.RegularShape.prototype.setOpacity);

goog.exportProperty(
    ol.style.RegularShape.prototype,
    'setRotation',
    ol.style.RegularShape.prototype.setRotation);

goog.exportProperty(
    ol.style.RegularShape.prototype,
    'setScale',
    ol.style.RegularShape.prototype.setScale);

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
    'onLoad',
    M.impl.Layer.prototype.onLoad);

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
    'activate',
    M.control.GetFeatureInfo.prototype.activate);

goog.exportProperty(
    M.control.GetFeatureInfo.prototype,
    'deactivate',
    M.control.GetFeatureInfo.prototype.deactivate);

goog.exportProperty(
    M.control.GetFeatureInfo.prototype,
    'getImpl',
    M.control.GetFeatureInfo.prototype.getImpl);

goog.exportProperty(
    M.control.GetFeatureInfo.prototype,
    'onLoad',
    M.control.GetFeatureInfo.prototype.onLoad);

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
    'activate',
    M.control.LayerSwitcher.prototype.activate);

goog.exportProperty(
    M.control.LayerSwitcher.prototype,
    'deactivate',
    M.control.LayerSwitcher.prototype.deactivate);

goog.exportProperty(
    M.control.LayerSwitcher.prototype,
    'getImpl',
    M.control.LayerSwitcher.prototype.getImpl);

goog.exportProperty(
    M.control.LayerSwitcher.prototype,
    'onLoad',
    M.control.LayerSwitcher.prototype.onLoad);

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
    'activate',
    M.control.Location.prototype.activate);

goog.exportProperty(
    M.control.Location.prototype,
    'deactivate',
    M.control.Location.prototype.deactivate);

goog.exportProperty(
    M.control.Location.prototype,
    'getImpl',
    M.control.Location.prototype.getImpl);

goog.exportProperty(
    M.control.Location.prototype,
    'onLoad',
    M.control.Location.prototype.onLoad);

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
    'activate',
    M.control.Mouse.prototype.activate);

goog.exportProperty(
    M.control.Mouse.prototype,
    'deactivate',
    M.control.Mouse.prototype.deactivate);

goog.exportProperty(
    M.control.Mouse.prototype,
    'getImpl',
    M.control.Mouse.prototype.getImpl);

goog.exportProperty(
    M.control.Mouse.prototype,
    'onLoad',
    M.control.Mouse.prototype.onLoad);

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
    'activate',
    M.control.Navtoolbar.prototype.activate);

goog.exportProperty(
    M.control.Navtoolbar.prototype,
    'deactivate',
    M.control.Navtoolbar.prototype.deactivate);

goog.exportProperty(
    M.control.Navtoolbar.prototype,
    'getImpl',
    M.control.Navtoolbar.prototype.getImpl);

goog.exportProperty(
    M.control.Navtoolbar.prototype,
    'onLoad',
    M.control.Navtoolbar.prototype.onLoad);

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
    'activate',
    M.control.OverviewMap.prototype.activate);

goog.exportProperty(
    M.control.OverviewMap.prototype,
    'deactivate',
    M.control.OverviewMap.prototype.deactivate);

goog.exportProperty(
    M.control.OverviewMap.prototype,
    'getImpl',
    M.control.OverviewMap.prototype.getImpl);

goog.exportProperty(
    M.control.OverviewMap.prototype,
    'onLoad',
    M.control.OverviewMap.prototype.onLoad);

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
    'activate',
    M.control.Panzoom.prototype.activate);

goog.exportProperty(
    M.control.Panzoom.prototype,
    'deactivate',
    M.control.Panzoom.prototype.deactivate);

goog.exportProperty(
    M.control.Panzoom.prototype,
    'getImpl',
    M.control.Panzoom.prototype.getImpl);

goog.exportProperty(
    M.control.Panzoom.prototype,
    'onLoad',
    M.control.Panzoom.prototype.onLoad);

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
    'activate',
    M.control.Panzoombar.prototype.activate);

goog.exportProperty(
    M.control.Panzoombar.prototype,
    'deactivate',
    M.control.Panzoombar.prototype.deactivate);

goog.exportProperty(
    M.control.Panzoombar.prototype,
    'getImpl',
    M.control.Panzoombar.prototype.getImpl);

goog.exportProperty(
    M.control.Panzoombar.prototype,
    'onLoad',
    M.control.Panzoombar.prototype.onLoad);

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
    'activate',
    M.control.Scale.prototype.activate);

goog.exportProperty(
    M.control.Scale.prototype,
    'deactivate',
    M.control.Scale.prototype.deactivate);

goog.exportProperty(
    M.control.Scale.prototype,
    'getImpl',
    M.control.Scale.prototype.getImpl);

goog.exportProperty(
    M.control.Scale.prototype,
    'onLoad',
    M.control.Scale.prototype.onLoad);

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
    'activate',
    M.control.ScaleLine.prototype.activate);

goog.exportProperty(
    M.control.ScaleLine.prototype,
    'deactivate',
    M.control.ScaleLine.prototype.deactivate);

goog.exportProperty(
    M.control.ScaleLine.prototype,
    'getImpl',
    M.control.ScaleLine.prototype.getImpl);

goog.exportProperty(
    M.control.ScaleLine.prototype,
    'onLoad',
    M.control.ScaleLine.prototype.onLoad);

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
    'activate',
    M.control.WMCSelector.prototype.activate);

goog.exportProperty(
    M.control.WMCSelector.prototype,
    'deactivate',
    M.control.WMCSelector.prototype.deactivate);

goog.exportProperty(
    M.control.WMCSelector.prototype,
    'getImpl',
    M.control.WMCSelector.prototype.getImpl);

goog.exportProperty(
    M.control.WMCSelector.prototype,
    'onLoad',
    M.control.WMCSelector.prototype.onLoad);

goog.exportProperty(
    ol.source.Source.prototype,
    'get',
    ol.source.Source.prototype.get);

goog.exportProperty(
    ol.source.Source.prototype,
    'getKeys',
    ol.source.Source.prototype.getKeys);

goog.exportProperty(
    ol.source.Source.prototype,
    'getProperties',
    ol.source.Source.prototype.getProperties);

goog.exportProperty(
    ol.source.Source.prototype,
    'set',
    ol.source.Source.prototype.set);

goog.exportProperty(
    ol.source.Source.prototype,
    'setProperties',
    ol.source.Source.prototype.setProperties);

goog.exportProperty(
    ol.source.Source.prototype,
    'unset',
    ol.source.Source.prototype.unset);

goog.exportProperty(
    ol.source.Source.prototype,
    'changed',
    ol.source.Source.prototype.changed);

goog.exportProperty(
    ol.source.Source.prototype,
    'dispatchEvent',
    ol.source.Source.prototype.dispatchEvent);

goog.exportProperty(
    ol.source.Source.prototype,
    'getRevision',
    ol.source.Source.prototype.getRevision);

goog.exportProperty(
    ol.source.Source.prototype,
    'on',
    ol.source.Source.prototype.on);

goog.exportProperty(
    ol.source.Source.prototype,
    'once',
    ol.source.Source.prototype.once);

goog.exportProperty(
    ol.source.Source.prototype,
    'un',
    ol.source.Source.prototype.un);

goog.exportProperty(
    ol.source.Source.prototype,
    'unByKey',
    ol.source.Source.prototype.unByKey);

goog.exportProperty(
    ol.source.Tile.prototype,
    'getAttributions',
    ol.source.Tile.prototype.getAttributions);

goog.exportProperty(
    ol.source.Tile.prototype,
    'getLogo',
    ol.source.Tile.prototype.getLogo);

goog.exportProperty(
    ol.source.Tile.prototype,
    'getProjection',
    ol.source.Tile.prototype.getProjection);

goog.exportProperty(
    ol.source.Tile.prototype,
    'getState',
    ol.source.Tile.prototype.getState);

goog.exportProperty(
    ol.source.Tile.prototype,
    'setAttributions',
    ol.source.Tile.prototype.setAttributions);

goog.exportProperty(
    ol.source.Tile.prototype,
    'get',
    ol.source.Tile.prototype.get);

goog.exportProperty(
    ol.source.Tile.prototype,
    'getKeys',
    ol.source.Tile.prototype.getKeys);

goog.exportProperty(
    ol.source.Tile.prototype,
    'getProperties',
    ol.source.Tile.prototype.getProperties);

goog.exportProperty(
    ol.source.Tile.prototype,
    'set',
    ol.source.Tile.prototype.set);

goog.exportProperty(
    ol.source.Tile.prototype,
    'setProperties',
    ol.source.Tile.prototype.setProperties);

goog.exportProperty(
    ol.source.Tile.prototype,
    'unset',
    ol.source.Tile.prototype.unset);

goog.exportProperty(
    ol.source.Tile.prototype,
    'changed',
    ol.source.Tile.prototype.changed);

goog.exportProperty(
    ol.source.Tile.prototype,
    'dispatchEvent',
    ol.source.Tile.prototype.dispatchEvent);

goog.exportProperty(
    ol.source.Tile.prototype,
    'getRevision',
    ol.source.Tile.prototype.getRevision);

goog.exportProperty(
    ol.source.Tile.prototype,
    'on',
    ol.source.Tile.prototype.on);

goog.exportProperty(
    ol.source.Tile.prototype,
    'once',
    ol.source.Tile.prototype.once);

goog.exportProperty(
    ol.source.Tile.prototype,
    'un',
    ol.source.Tile.prototype.un);

goog.exportProperty(
    ol.source.Tile.prototype,
    'unByKey',
    ol.source.Tile.prototype.unByKey);

goog.exportProperty(
    ol.source.UrlTile.prototype,
    'getTileGrid',
    ol.source.UrlTile.prototype.getTileGrid);

goog.exportProperty(
    ol.source.UrlTile.prototype,
    'getAttributions',
    ol.source.UrlTile.prototype.getAttributions);

goog.exportProperty(
    ol.source.UrlTile.prototype,
    'getLogo',
    ol.source.UrlTile.prototype.getLogo);

goog.exportProperty(
    ol.source.UrlTile.prototype,
    'getProjection',
    ol.source.UrlTile.prototype.getProjection);

goog.exportProperty(
    ol.source.UrlTile.prototype,
    'getState',
    ol.source.UrlTile.prototype.getState);

goog.exportProperty(
    ol.source.UrlTile.prototype,
    'setAttributions',
    ol.source.UrlTile.prototype.setAttributions);

goog.exportProperty(
    ol.source.UrlTile.prototype,
    'get',
    ol.source.UrlTile.prototype.get);

goog.exportProperty(
    ol.source.UrlTile.prototype,
    'getKeys',
    ol.source.UrlTile.prototype.getKeys);

goog.exportProperty(
    ol.source.UrlTile.prototype,
    'getProperties',
    ol.source.UrlTile.prototype.getProperties);

goog.exportProperty(
    ol.source.UrlTile.prototype,
    'set',
    ol.source.UrlTile.prototype.set);

goog.exportProperty(
    ol.source.UrlTile.prototype,
    'setProperties',
    ol.source.UrlTile.prototype.setProperties);

goog.exportProperty(
    ol.source.UrlTile.prototype,
    'unset',
    ol.source.UrlTile.prototype.unset);

goog.exportProperty(
    ol.source.UrlTile.prototype,
    'changed',
    ol.source.UrlTile.prototype.changed);

goog.exportProperty(
    ol.source.UrlTile.prototype,
    'dispatchEvent',
    ol.source.UrlTile.prototype.dispatchEvent);

goog.exportProperty(
    ol.source.UrlTile.prototype,
    'getRevision',
    ol.source.UrlTile.prototype.getRevision);

goog.exportProperty(
    ol.source.UrlTile.prototype,
    'on',
    ol.source.UrlTile.prototype.on);

goog.exportProperty(
    ol.source.UrlTile.prototype,
    'once',
    ol.source.UrlTile.prototype.once);

goog.exportProperty(
    ol.source.UrlTile.prototype,
    'un',
    ol.source.UrlTile.prototype.un);

goog.exportProperty(
    ol.source.UrlTile.prototype,
    'unByKey',
    ol.source.UrlTile.prototype.unByKey);

goog.exportProperty(
    ol.source.TileImage.prototype,
    'getTileLoadFunction',
    ol.source.TileImage.prototype.getTileLoadFunction);

goog.exportProperty(
    ol.source.TileImage.prototype,
    'getTileUrlFunction',
    ol.source.TileImage.prototype.getTileUrlFunction);

goog.exportProperty(
    ol.source.TileImage.prototype,
    'getUrls',
    ol.source.TileImage.prototype.getUrls);

goog.exportProperty(
    ol.source.TileImage.prototype,
    'setTileLoadFunction',
    ol.source.TileImage.prototype.setTileLoadFunction);

goog.exportProperty(
    ol.source.TileImage.prototype,
    'setTileUrlFunction',
    ol.source.TileImage.prototype.setTileUrlFunction);

goog.exportProperty(
    ol.source.TileImage.prototype,
    'setUrl',
    ol.source.TileImage.prototype.setUrl);

goog.exportProperty(
    ol.source.TileImage.prototype,
    'setUrls',
    ol.source.TileImage.prototype.setUrls);

goog.exportProperty(
    ol.source.TileImage.prototype,
    'getTileGrid',
    ol.source.TileImage.prototype.getTileGrid);

goog.exportProperty(
    ol.source.TileImage.prototype,
    'getAttributions',
    ol.source.TileImage.prototype.getAttributions);

goog.exportProperty(
    ol.source.TileImage.prototype,
    'getLogo',
    ol.source.TileImage.prototype.getLogo);

goog.exportProperty(
    ol.source.TileImage.prototype,
    'getProjection',
    ol.source.TileImage.prototype.getProjection);

goog.exportProperty(
    ol.source.TileImage.prototype,
    'getState',
    ol.source.TileImage.prototype.getState);

goog.exportProperty(
    ol.source.TileImage.prototype,
    'setAttributions',
    ol.source.TileImage.prototype.setAttributions);

goog.exportProperty(
    ol.source.TileImage.prototype,
    'get',
    ol.source.TileImage.prototype.get);

goog.exportProperty(
    ol.source.TileImage.prototype,
    'getKeys',
    ol.source.TileImage.prototype.getKeys);

goog.exportProperty(
    ol.source.TileImage.prototype,
    'getProperties',
    ol.source.TileImage.prototype.getProperties);

goog.exportProperty(
    ol.source.TileImage.prototype,
    'set',
    ol.source.TileImage.prototype.set);

goog.exportProperty(
    ol.source.TileImage.prototype,
    'setProperties',
    ol.source.TileImage.prototype.setProperties);

goog.exportProperty(
    ol.source.TileImage.prototype,
    'unset',
    ol.source.TileImage.prototype.unset);

goog.exportProperty(
    ol.source.TileImage.prototype,
    'changed',
    ol.source.TileImage.prototype.changed);

goog.exportProperty(
    ol.source.TileImage.prototype,
    'dispatchEvent',
    ol.source.TileImage.prototype.dispatchEvent);

goog.exportProperty(
    ol.source.TileImage.prototype,
    'getRevision',
    ol.source.TileImage.prototype.getRevision);

goog.exportProperty(
    ol.source.TileImage.prototype,
    'on',
    ol.source.TileImage.prototype.on);

goog.exportProperty(
    ol.source.TileImage.prototype,
    'once',
    ol.source.TileImage.prototype.once);

goog.exportProperty(
    ol.source.TileImage.prototype,
    'un',
    ol.source.TileImage.prototype.un);

goog.exportProperty(
    ol.source.TileImage.prototype,
    'unByKey',
    ol.source.TileImage.prototype.unByKey);

goog.exportProperty(
    ol.source.BingMaps.prototype,
    'setRenderReprojectionEdges',
    ol.source.BingMaps.prototype.setRenderReprojectionEdges);

goog.exportProperty(
    ol.source.BingMaps.prototype,
    'setTileGridForProjection',
    ol.source.BingMaps.prototype.setTileGridForProjection);

goog.exportProperty(
    ol.source.BingMaps.prototype,
    'getTileLoadFunction',
    ol.source.BingMaps.prototype.getTileLoadFunction);

goog.exportProperty(
    ol.source.BingMaps.prototype,
    'getTileUrlFunction',
    ol.source.BingMaps.prototype.getTileUrlFunction);

goog.exportProperty(
    ol.source.BingMaps.prototype,
    'getUrls',
    ol.source.BingMaps.prototype.getUrls);

goog.exportProperty(
    ol.source.BingMaps.prototype,
    'setTileLoadFunction',
    ol.source.BingMaps.prototype.setTileLoadFunction);

goog.exportProperty(
    ol.source.BingMaps.prototype,
    'setTileUrlFunction',
    ol.source.BingMaps.prototype.setTileUrlFunction);

goog.exportProperty(
    ol.source.BingMaps.prototype,
    'setUrl',
    ol.source.BingMaps.prototype.setUrl);

goog.exportProperty(
    ol.source.BingMaps.prototype,
    'setUrls',
    ol.source.BingMaps.prototype.setUrls);

goog.exportProperty(
    ol.source.BingMaps.prototype,
    'getTileGrid',
    ol.source.BingMaps.prototype.getTileGrid);

goog.exportProperty(
    ol.source.BingMaps.prototype,
    'getAttributions',
    ol.source.BingMaps.prototype.getAttributions);

goog.exportProperty(
    ol.source.BingMaps.prototype,
    'getLogo',
    ol.source.BingMaps.prototype.getLogo);

goog.exportProperty(
    ol.source.BingMaps.prototype,
    'getProjection',
    ol.source.BingMaps.prototype.getProjection);

goog.exportProperty(
    ol.source.BingMaps.prototype,
    'getState',
    ol.source.BingMaps.prototype.getState);

goog.exportProperty(
    ol.source.BingMaps.prototype,
    'setAttributions',
    ol.source.BingMaps.prototype.setAttributions);

goog.exportProperty(
    ol.source.BingMaps.prototype,
    'get',
    ol.source.BingMaps.prototype.get);

goog.exportProperty(
    ol.source.BingMaps.prototype,
    'getKeys',
    ol.source.BingMaps.prototype.getKeys);

goog.exportProperty(
    ol.source.BingMaps.prototype,
    'getProperties',
    ol.source.BingMaps.prototype.getProperties);

goog.exportProperty(
    ol.source.BingMaps.prototype,
    'set',
    ol.source.BingMaps.prototype.set);

goog.exportProperty(
    ol.source.BingMaps.prototype,
    'setProperties',
    ol.source.BingMaps.prototype.setProperties);

goog.exportProperty(
    ol.source.BingMaps.prototype,
    'unset',
    ol.source.BingMaps.prototype.unset);

goog.exportProperty(
    ol.source.BingMaps.prototype,
    'changed',
    ol.source.BingMaps.prototype.changed);

goog.exportProperty(
    ol.source.BingMaps.prototype,
    'dispatchEvent',
    ol.source.BingMaps.prototype.dispatchEvent);

goog.exportProperty(
    ol.source.BingMaps.prototype,
    'getRevision',
    ol.source.BingMaps.prototype.getRevision);

goog.exportProperty(
    ol.source.BingMaps.prototype,
    'on',
    ol.source.BingMaps.prototype.on);

goog.exportProperty(
    ol.source.BingMaps.prototype,
    'once',
    ol.source.BingMaps.prototype.once);

goog.exportProperty(
    ol.source.BingMaps.prototype,
    'un',
    ol.source.BingMaps.prototype.un);

goog.exportProperty(
    ol.source.BingMaps.prototype,
    'unByKey',
    ol.source.BingMaps.prototype.unByKey);

goog.exportProperty(
    ol.source.Vector.prototype,
    'getAttributions',
    ol.source.Vector.prototype.getAttributions);

goog.exportProperty(
    ol.source.Vector.prototype,
    'getLogo',
    ol.source.Vector.prototype.getLogo);

goog.exportProperty(
    ol.source.Vector.prototype,
    'getProjection',
    ol.source.Vector.prototype.getProjection);

goog.exportProperty(
    ol.source.Vector.prototype,
    'getState',
    ol.source.Vector.prototype.getState);

goog.exportProperty(
    ol.source.Vector.prototype,
    'setAttributions',
    ol.source.Vector.prototype.setAttributions);

goog.exportProperty(
    ol.source.Vector.prototype,
    'get',
    ol.source.Vector.prototype.get);

goog.exportProperty(
    ol.source.Vector.prototype,
    'getKeys',
    ol.source.Vector.prototype.getKeys);

goog.exportProperty(
    ol.source.Vector.prototype,
    'getProperties',
    ol.source.Vector.prototype.getProperties);

goog.exportProperty(
    ol.source.Vector.prototype,
    'set',
    ol.source.Vector.prototype.set);

goog.exportProperty(
    ol.source.Vector.prototype,
    'setProperties',
    ol.source.Vector.prototype.setProperties);

goog.exportProperty(
    ol.source.Vector.prototype,
    'unset',
    ol.source.Vector.prototype.unset);

goog.exportProperty(
    ol.source.Vector.prototype,
    'changed',
    ol.source.Vector.prototype.changed);

goog.exportProperty(
    ol.source.Vector.prototype,
    'dispatchEvent',
    ol.source.Vector.prototype.dispatchEvent);

goog.exportProperty(
    ol.source.Vector.prototype,
    'getRevision',
    ol.source.Vector.prototype.getRevision);

goog.exportProperty(
    ol.source.Vector.prototype,
    'on',
    ol.source.Vector.prototype.on);

goog.exportProperty(
    ol.source.Vector.prototype,
    'once',
    ol.source.Vector.prototype.once);

goog.exportProperty(
    ol.source.Vector.prototype,
    'un',
    ol.source.Vector.prototype.un);

goog.exportProperty(
    ol.source.Vector.prototype,
    'unByKey',
    ol.source.Vector.prototype.unByKey);

goog.exportProperty(
    ol.source.Cluster.prototype,
    'addFeature',
    ol.source.Cluster.prototype.addFeature);

goog.exportProperty(
    ol.source.Cluster.prototype,
    'addFeatures',
    ol.source.Cluster.prototype.addFeatures);

goog.exportProperty(
    ol.source.Cluster.prototype,
    'clear',
    ol.source.Cluster.prototype.clear);

goog.exportProperty(
    ol.source.Cluster.prototype,
    'forEachFeature',
    ol.source.Cluster.prototype.forEachFeature);

goog.exportProperty(
    ol.source.Cluster.prototype,
    'forEachFeatureInExtent',
    ol.source.Cluster.prototype.forEachFeatureInExtent);

goog.exportProperty(
    ol.source.Cluster.prototype,
    'forEachFeatureIntersectingExtent',
    ol.source.Cluster.prototype.forEachFeatureIntersectingExtent);

goog.exportProperty(
    ol.source.Cluster.prototype,
    'getFeaturesCollection',
    ol.source.Cluster.prototype.getFeaturesCollection);

goog.exportProperty(
    ol.source.Cluster.prototype,
    'getFeatures',
    ol.source.Cluster.prototype.getFeatures);

goog.exportProperty(
    ol.source.Cluster.prototype,
    'getFeaturesAtCoordinate',
    ol.source.Cluster.prototype.getFeaturesAtCoordinate);

goog.exportProperty(
    ol.source.Cluster.prototype,
    'getFeaturesInExtent',
    ol.source.Cluster.prototype.getFeaturesInExtent);

goog.exportProperty(
    ol.source.Cluster.prototype,
    'getClosestFeatureToCoordinate',
    ol.source.Cluster.prototype.getClosestFeatureToCoordinate);

goog.exportProperty(
    ol.source.Cluster.prototype,
    'getExtent',
    ol.source.Cluster.prototype.getExtent);

goog.exportProperty(
    ol.source.Cluster.prototype,
    'getFeatureById',
    ol.source.Cluster.prototype.getFeatureById);

goog.exportProperty(
    ol.source.Cluster.prototype,
    'removeFeature',
    ol.source.Cluster.prototype.removeFeature);

goog.exportProperty(
    ol.source.Cluster.prototype,
    'getAttributions',
    ol.source.Cluster.prototype.getAttributions);

goog.exportProperty(
    ol.source.Cluster.prototype,
    'getLogo',
    ol.source.Cluster.prototype.getLogo);

goog.exportProperty(
    ol.source.Cluster.prototype,
    'getProjection',
    ol.source.Cluster.prototype.getProjection);

goog.exportProperty(
    ol.source.Cluster.prototype,
    'getState',
    ol.source.Cluster.prototype.getState);

goog.exportProperty(
    ol.source.Cluster.prototype,
    'setAttributions',
    ol.source.Cluster.prototype.setAttributions);

goog.exportProperty(
    ol.source.Cluster.prototype,
    'get',
    ol.source.Cluster.prototype.get);

goog.exportProperty(
    ol.source.Cluster.prototype,
    'getKeys',
    ol.source.Cluster.prototype.getKeys);

goog.exportProperty(
    ol.source.Cluster.prototype,
    'getProperties',
    ol.source.Cluster.prototype.getProperties);

goog.exportProperty(
    ol.source.Cluster.prototype,
    'set',
    ol.source.Cluster.prototype.set);

goog.exportProperty(
    ol.source.Cluster.prototype,
    'setProperties',
    ol.source.Cluster.prototype.setProperties);

goog.exportProperty(
    ol.source.Cluster.prototype,
    'unset',
    ol.source.Cluster.prototype.unset);

goog.exportProperty(
    ol.source.Cluster.prototype,
    'changed',
    ol.source.Cluster.prototype.changed);

goog.exportProperty(
    ol.source.Cluster.prototype,
    'dispatchEvent',
    ol.source.Cluster.prototype.dispatchEvent);

goog.exportProperty(
    ol.source.Cluster.prototype,
    'getRevision',
    ol.source.Cluster.prototype.getRevision);

goog.exportProperty(
    ol.source.Cluster.prototype,
    'on',
    ol.source.Cluster.prototype.on);

goog.exportProperty(
    ol.source.Cluster.prototype,
    'once',
    ol.source.Cluster.prototype.once);

goog.exportProperty(
    ol.source.Cluster.prototype,
    'un',
    ol.source.Cluster.prototype.un);

goog.exportProperty(
    ol.source.Cluster.prototype,
    'unByKey',
    ol.source.Cluster.prototype.unByKey);

goog.exportProperty(
    ol.source.Image.prototype,
    'getAttributions',
    ol.source.Image.prototype.getAttributions);

goog.exportProperty(
    ol.source.Image.prototype,
    'getLogo',
    ol.source.Image.prototype.getLogo);

goog.exportProperty(
    ol.source.Image.prototype,
    'getProjection',
    ol.source.Image.prototype.getProjection);

goog.exportProperty(
    ol.source.Image.prototype,
    'getState',
    ol.source.Image.prototype.getState);

goog.exportProperty(
    ol.source.Image.prototype,
    'setAttributions',
    ol.source.Image.prototype.setAttributions);

goog.exportProperty(
    ol.source.Image.prototype,
    'get',
    ol.source.Image.prototype.get);

goog.exportProperty(
    ol.source.Image.prototype,
    'getKeys',
    ol.source.Image.prototype.getKeys);

goog.exportProperty(
    ol.source.Image.prototype,
    'getProperties',
    ol.source.Image.prototype.getProperties);

goog.exportProperty(
    ol.source.Image.prototype,
    'set',
    ol.source.Image.prototype.set);

goog.exportProperty(
    ol.source.Image.prototype,
    'setProperties',
    ol.source.Image.prototype.setProperties);

goog.exportProperty(
    ol.source.Image.prototype,
    'unset',
    ol.source.Image.prototype.unset);

goog.exportProperty(
    ol.source.Image.prototype,
    'changed',
    ol.source.Image.prototype.changed);

goog.exportProperty(
    ol.source.Image.prototype,
    'dispatchEvent',
    ol.source.Image.prototype.dispatchEvent);

goog.exportProperty(
    ol.source.Image.prototype,
    'getRevision',
    ol.source.Image.prototype.getRevision);

goog.exportProperty(
    ol.source.Image.prototype,
    'on',
    ol.source.Image.prototype.on);

goog.exportProperty(
    ol.source.Image.prototype,
    'once',
    ol.source.Image.prototype.once);

goog.exportProperty(
    ol.source.Image.prototype,
    'un',
    ol.source.Image.prototype.un);

goog.exportProperty(
    ol.source.Image.prototype,
    'unByKey',
    ol.source.Image.prototype.unByKey);

goog.exportProperty(
    ol.source.ImageCanvas.prototype,
    'getAttributions',
    ol.source.ImageCanvas.prototype.getAttributions);

goog.exportProperty(
    ol.source.ImageCanvas.prototype,
    'getLogo',
    ol.source.ImageCanvas.prototype.getLogo);

goog.exportProperty(
    ol.source.ImageCanvas.prototype,
    'getProjection',
    ol.source.ImageCanvas.prototype.getProjection);

goog.exportProperty(
    ol.source.ImageCanvas.prototype,
    'getState',
    ol.source.ImageCanvas.prototype.getState);

goog.exportProperty(
    ol.source.ImageCanvas.prototype,
    'setAttributions',
    ol.source.ImageCanvas.prototype.setAttributions);

goog.exportProperty(
    ol.source.ImageCanvas.prototype,
    'get',
    ol.source.ImageCanvas.prototype.get);

goog.exportProperty(
    ol.source.ImageCanvas.prototype,
    'getKeys',
    ol.source.ImageCanvas.prototype.getKeys);

goog.exportProperty(
    ol.source.ImageCanvas.prototype,
    'getProperties',
    ol.source.ImageCanvas.prototype.getProperties);

goog.exportProperty(
    ol.source.ImageCanvas.prototype,
    'set',
    ol.source.ImageCanvas.prototype.set);

goog.exportProperty(
    ol.source.ImageCanvas.prototype,
    'setProperties',
    ol.source.ImageCanvas.prototype.setProperties);

goog.exportProperty(
    ol.source.ImageCanvas.prototype,
    'unset',
    ol.source.ImageCanvas.prototype.unset);

goog.exportProperty(
    ol.source.ImageCanvas.prototype,
    'changed',
    ol.source.ImageCanvas.prototype.changed);

goog.exportProperty(
    ol.source.ImageCanvas.prototype,
    'dispatchEvent',
    ol.source.ImageCanvas.prototype.dispatchEvent);

goog.exportProperty(
    ol.source.ImageCanvas.prototype,
    'getRevision',
    ol.source.ImageCanvas.prototype.getRevision);

goog.exportProperty(
    ol.source.ImageCanvas.prototype,
    'on',
    ol.source.ImageCanvas.prototype.on);

goog.exportProperty(
    ol.source.ImageCanvas.prototype,
    'once',
    ol.source.ImageCanvas.prototype.once);

goog.exportProperty(
    ol.source.ImageCanvas.prototype,
    'un',
    ol.source.ImageCanvas.prototype.un);

goog.exportProperty(
    ol.source.ImageCanvas.prototype,
    'unByKey',
    ol.source.ImageCanvas.prototype.unByKey);

goog.exportProperty(
    ol.source.ImageMapGuide.prototype,
    'getAttributions',
    ol.source.ImageMapGuide.prototype.getAttributions);

goog.exportProperty(
    ol.source.ImageMapGuide.prototype,
    'getLogo',
    ol.source.ImageMapGuide.prototype.getLogo);

goog.exportProperty(
    ol.source.ImageMapGuide.prototype,
    'getProjection',
    ol.source.ImageMapGuide.prototype.getProjection);

goog.exportProperty(
    ol.source.ImageMapGuide.prototype,
    'getState',
    ol.source.ImageMapGuide.prototype.getState);

goog.exportProperty(
    ol.source.ImageMapGuide.prototype,
    'setAttributions',
    ol.source.ImageMapGuide.prototype.setAttributions);

goog.exportProperty(
    ol.source.ImageMapGuide.prototype,
    'get',
    ol.source.ImageMapGuide.prototype.get);

goog.exportProperty(
    ol.source.ImageMapGuide.prototype,
    'getKeys',
    ol.source.ImageMapGuide.prototype.getKeys);

goog.exportProperty(
    ol.source.ImageMapGuide.prototype,
    'getProperties',
    ol.source.ImageMapGuide.prototype.getProperties);

goog.exportProperty(
    ol.source.ImageMapGuide.prototype,
    'set',
    ol.source.ImageMapGuide.prototype.set);

goog.exportProperty(
    ol.source.ImageMapGuide.prototype,
    'setProperties',
    ol.source.ImageMapGuide.prototype.setProperties);

goog.exportProperty(
    ol.source.ImageMapGuide.prototype,
    'unset',
    ol.source.ImageMapGuide.prototype.unset);

goog.exportProperty(
    ol.source.ImageMapGuide.prototype,
    'changed',
    ol.source.ImageMapGuide.prototype.changed);

goog.exportProperty(
    ol.source.ImageMapGuide.prototype,
    'dispatchEvent',
    ol.source.ImageMapGuide.prototype.dispatchEvent);

goog.exportProperty(
    ol.source.ImageMapGuide.prototype,
    'getRevision',
    ol.source.ImageMapGuide.prototype.getRevision);

goog.exportProperty(
    ol.source.ImageMapGuide.prototype,
    'on',
    ol.source.ImageMapGuide.prototype.on);

goog.exportProperty(
    ol.source.ImageMapGuide.prototype,
    'once',
    ol.source.ImageMapGuide.prototype.once);

goog.exportProperty(
    ol.source.ImageMapGuide.prototype,
    'un',
    ol.source.ImageMapGuide.prototype.un);

goog.exportProperty(
    ol.source.ImageMapGuide.prototype,
    'unByKey',
    ol.source.ImageMapGuide.prototype.unByKey);

goog.exportProperty(
    ol.source.ImageStatic.prototype,
    'getAttributions',
    ol.source.ImageStatic.prototype.getAttributions);

goog.exportProperty(
    ol.source.ImageStatic.prototype,
    'getLogo',
    ol.source.ImageStatic.prototype.getLogo);

goog.exportProperty(
    ol.source.ImageStatic.prototype,
    'getProjection',
    ol.source.ImageStatic.prototype.getProjection);

goog.exportProperty(
    ol.source.ImageStatic.prototype,
    'getState',
    ol.source.ImageStatic.prototype.getState);

goog.exportProperty(
    ol.source.ImageStatic.prototype,
    'setAttributions',
    ol.source.ImageStatic.prototype.setAttributions);

goog.exportProperty(
    ol.source.ImageStatic.prototype,
    'get',
    ol.source.ImageStatic.prototype.get);

goog.exportProperty(
    ol.source.ImageStatic.prototype,
    'getKeys',
    ol.source.ImageStatic.prototype.getKeys);

goog.exportProperty(
    ol.source.ImageStatic.prototype,
    'getProperties',
    ol.source.ImageStatic.prototype.getProperties);

goog.exportProperty(
    ol.source.ImageStatic.prototype,
    'set',
    ol.source.ImageStatic.prototype.set);

goog.exportProperty(
    ol.source.ImageStatic.prototype,
    'setProperties',
    ol.source.ImageStatic.prototype.setProperties);

goog.exportProperty(
    ol.source.ImageStatic.prototype,
    'unset',
    ol.source.ImageStatic.prototype.unset);

goog.exportProperty(
    ol.source.ImageStatic.prototype,
    'changed',
    ol.source.ImageStatic.prototype.changed);

goog.exportProperty(
    ol.source.ImageStatic.prototype,
    'dispatchEvent',
    ol.source.ImageStatic.prototype.dispatchEvent);

goog.exportProperty(
    ol.source.ImageStatic.prototype,
    'getRevision',
    ol.source.ImageStatic.prototype.getRevision);

goog.exportProperty(
    ol.source.ImageStatic.prototype,
    'on',
    ol.source.ImageStatic.prototype.on);

goog.exportProperty(
    ol.source.ImageStatic.prototype,
    'once',
    ol.source.ImageStatic.prototype.once);

goog.exportProperty(
    ol.source.ImageStatic.prototype,
    'un',
    ol.source.ImageStatic.prototype.un);

goog.exportProperty(
    ol.source.ImageStatic.prototype,
    'unByKey',
    ol.source.ImageStatic.prototype.unByKey);

goog.exportProperty(
    ol.source.ImageVector.prototype,
    'getAttributions',
    ol.source.ImageVector.prototype.getAttributions);

goog.exportProperty(
    ol.source.ImageVector.prototype,
    'getLogo',
    ol.source.ImageVector.prototype.getLogo);

goog.exportProperty(
    ol.source.ImageVector.prototype,
    'getProjection',
    ol.source.ImageVector.prototype.getProjection);

goog.exportProperty(
    ol.source.ImageVector.prototype,
    'getState',
    ol.source.ImageVector.prototype.getState);

goog.exportProperty(
    ol.source.ImageVector.prototype,
    'setAttributions',
    ol.source.ImageVector.prototype.setAttributions);

goog.exportProperty(
    ol.source.ImageVector.prototype,
    'get',
    ol.source.ImageVector.prototype.get);

goog.exportProperty(
    ol.source.ImageVector.prototype,
    'getKeys',
    ol.source.ImageVector.prototype.getKeys);

goog.exportProperty(
    ol.source.ImageVector.prototype,
    'getProperties',
    ol.source.ImageVector.prototype.getProperties);

goog.exportProperty(
    ol.source.ImageVector.prototype,
    'set',
    ol.source.ImageVector.prototype.set);

goog.exportProperty(
    ol.source.ImageVector.prototype,
    'setProperties',
    ol.source.ImageVector.prototype.setProperties);

goog.exportProperty(
    ol.source.ImageVector.prototype,
    'unset',
    ol.source.ImageVector.prototype.unset);

goog.exportProperty(
    ol.source.ImageVector.prototype,
    'changed',
    ol.source.ImageVector.prototype.changed);

goog.exportProperty(
    ol.source.ImageVector.prototype,
    'dispatchEvent',
    ol.source.ImageVector.prototype.dispatchEvent);

goog.exportProperty(
    ol.source.ImageVector.prototype,
    'getRevision',
    ol.source.ImageVector.prototype.getRevision);

goog.exportProperty(
    ol.source.ImageVector.prototype,
    'on',
    ol.source.ImageVector.prototype.on);

goog.exportProperty(
    ol.source.ImageVector.prototype,
    'once',
    ol.source.ImageVector.prototype.once);

goog.exportProperty(
    ol.source.ImageVector.prototype,
    'un',
    ol.source.ImageVector.prototype.un);

goog.exportProperty(
    ol.source.ImageVector.prototype,
    'unByKey',
    ol.source.ImageVector.prototype.unByKey);

goog.exportProperty(
    ol.source.ImageWMS.prototype,
    'getAttributions',
    ol.source.ImageWMS.prototype.getAttributions);

goog.exportProperty(
    ol.source.ImageWMS.prototype,
    'getLogo',
    ol.source.ImageWMS.prototype.getLogo);

goog.exportProperty(
    ol.source.ImageWMS.prototype,
    'getProjection',
    ol.source.ImageWMS.prototype.getProjection);

goog.exportProperty(
    ol.source.ImageWMS.prototype,
    'getState',
    ol.source.ImageWMS.prototype.getState);

goog.exportProperty(
    ol.source.ImageWMS.prototype,
    'setAttributions',
    ol.source.ImageWMS.prototype.setAttributions);

goog.exportProperty(
    ol.source.ImageWMS.prototype,
    'get',
    ol.source.ImageWMS.prototype.get);

goog.exportProperty(
    ol.source.ImageWMS.prototype,
    'getKeys',
    ol.source.ImageWMS.prototype.getKeys);

goog.exportProperty(
    ol.source.ImageWMS.prototype,
    'getProperties',
    ol.source.ImageWMS.prototype.getProperties);

goog.exportProperty(
    ol.source.ImageWMS.prototype,
    'set',
    ol.source.ImageWMS.prototype.set);

goog.exportProperty(
    ol.source.ImageWMS.prototype,
    'setProperties',
    ol.source.ImageWMS.prototype.setProperties);

goog.exportProperty(
    ol.source.ImageWMS.prototype,
    'unset',
    ol.source.ImageWMS.prototype.unset);

goog.exportProperty(
    ol.source.ImageWMS.prototype,
    'changed',
    ol.source.ImageWMS.prototype.changed);

goog.exportProperty(
    ol.source.ImageWMS.prototype,
    'dispatchEvent',
    ol.source.ImageWMS.prototype.dispatchEvent);

goog.exportProperty(
    ol.source.ImageWMS.prototype,
    'getRevision',
    ol.source.ImageWMS.prototype.getRevision);

goog.exportProperty(
    ol.source.ImageWMS.prototype,
    'on',
    ol.source.ImageWMS.prototype.on);

goog.exportProperty(
    ol.source.ImageWMS.prototype,
    'once',
    ol.source.ImageWMS.prototype.once);

goog.exportProperty(
    ol.source.ImageWMS.prototype,
    'un',
    ol.source.ImageWMS.prototype.un);

goog.exportProperty(
    ol.source.ImageWMS.prototype,
    'unByKey',
    ol.source.ImageWMS.prototype.unByKey);

goog.exportProperty(
    ol.source.XYZ.prototype,
    'setRenderReprojectionEdges',
    ol.source.XYZ.prototype.setRenderReprojectionEdges);

goog.exportProperty(
    ol.source.XYZ.prototype,
    'setTileGridForProjection',
    ol.source.XYZ.prototype.setTileGridForProjection);

goog.exportProperty(
    ol.source.XYZ.prototype,
    'getTileLoadFunction',
    ol.source.XYZ.prototype.getTileLoadFunction);

goog.exportProperty(
    ol.source.XYZ.prototype,
    'getTileUrlFunction',
    ol.source.XYZ.prototype.getTileUrlFunction);

goog.exportProperty(
    ol.source.XYZ.prototype,
    'getUrls',
    ol.source.XYZ.prototype.getUrls);

goog.exportProperty(
    ol.source.XYZ.prototype,
    'setTileLoadFunction',
    ol.source.XYZ.prototype.setTileLoadFunction);

goog.exportProperty(
    ol.source.XYZ.prototype,
    'setTileUrlFunction',
    ol.source.XYZ.prototype.setTileUrlFunction);

goog.exportProperty(
    ol.source.XYZ.prototype,
    'setUrl',
    ol.source.XYZ.prototype.setUrl);

goog.exportProperty(
    ol.source.XYZ.prototype,
    'setUrls',
    ol.source.XYZ.prototype.setUrls);

goog.exportProperty(
    ol.source.XYZ.prototype,
    'getTileGrid',
    ol.source.XYZ.prototype.getTileGrid);

goog.exportProperty(
    ol.source.XYZ.prototype,
    'getAttributions',
    ol.source.XYZ.prototype.getAttributions);

goog.exportProperty(
    ol.source.XYZ.prototype,
    'getLogo',
    ol.source.XYZ.prototype.getLogo);

goog.exportProperty(
    ol.source.XYZ.prototype,
    'getProjection',
    ol.source.XYZ.prototype.getProjection);

goog.exportProperty(
    ol.source.XYZ.prototype,
    'getState',
    ol.source.XYZ.prototype.getState);

goog.exportProperty(
    ol.source.XYZ.prototype,
    'setAttributions',
    ol.source.XYZ.prototype.setAttributions);

goog.exportProperty(
    ol.source.XYZ.prototype,
    'get',
    ol.source.XYZ.prototype.get);

goog.exportProperty(
    ol.source.XYZ.prototype,
    'getKeys',
    ol.source.XYZ.prototype.getKeys);

goog.exportProperty(
    ol.source.XYZ.prototype,
    'getProperties',
    ol.source.XYZ.prototype.getProperties);

goog.exportProperty(
    ol.source.XYZ.prototype,
    'set',
    ol.source.XYZ.prototype.set);

goog.exportProperty(
    ol.source.XYZ.prototype,
    'setProperties',
    ol.source.XYZ.prototype.setProperties);

goog.exportProperty(
    ol.source.XYZ.prototype,
    'unset',
    ol.source.XYZ.prototype.unset);

goog.exportProperty(
    ol.source.XYZ.prototype,
    'changed',
    ol.source.XYZ.prototype.changed);

goog.exportProperty(
    ol.source.XYZ.prototype,
    'dispatchEvent',
    ol.source.XYZ.prototype.dispatchEvent);

goog.exportProperty(
    ol.source.XYZ.prototype,
    'getRevision',
    ol.source.XYZ.prototype.getRevision);

goog.exportProperty(
    ol.source.XYZ.prototype,
    'on',
    ol.source.XYZ.prototype.on);

goog.exportProperty(
    ol.source.XYZ.prototype,
    'once',
    ol.source.XYZ.prototype.once);

goog.exportProperty(
    ol.source.XYZ.prototype,
    'un',
    ol.source.XYZ.prototype.un);

goog.exportProperty(
    ol.source.XYZ.prototype,
    'unByKey',
    ol.source.XYZ.prototype.unByKey);

goog.exportProperty(
    ol.source.MapQuest.prototype,
    'setRenderReprojectionEdges',
    ol.source.MapQuest.prototype.setRenderReprojectionEdges);

goog.exportProperty(
    ol.source.MapQuest.prototype,
    'setTileGridForProjection',
    ol.source.MapQuest.prototype.setTileGridForProjection);

goog.exportProperty(
    ol.source.MapQuest.prototype,
    'getTileLoadFunction',
    ol.source.MapQuest.prototype.getTileLoadFunction);

goog.exportProperty(
    ol.source.MapQuest.prototype,
    'getTileUrlFunction',
    ol.source.MapQuest.prototype.getTileUrlFunction);

goog.exportProperty(
    ol.source.MapQuest.prototype,
    'getUrls',
    ol.source.MapQuest.prototype.getUrls);

goog.exportProperty(
    ol.source.MapQuest.prototype,
    'setTileLoadFunction',
    ol.source.MapQuest.prototype.setTileLoadFunction);

goog.exportProperty(
    ol.source.MapQuest.prototype,
    'setTileUrlFunction',
    ol.source.MapQuest.prototype.setTileUrlFunction);

goog.exportProperty(
    ol.source.MapQuest.prototype,
    'setUrl',
    ol.source.MapQuest.prototype.setUrl);

goog.exportProperty(
    ol.source.MapQuest.prototype,
    'setUrls',
    ol.source.MapQuest.prototype.setUrls);

goog.exportProperty(
    ol.source.MapQuest.prototype,
    'getTileGrid',
    ol.source.MapQuest.prototype.getTileGrid);

goog.exportProperty(
    ol.source.MapQuest.prototype,
    'getAttributions',
    ol.source.MapQuest.prototype.getAttributions);

goog.exportProperty(
    ol.source.MapQuest.prototype,
    'getLogo',
    ol.source.MapQuest.prototype.getLogo);

goog.exportProperty(
    ol.source.MapQuest.prototype,
    'getProjection',
    ol.source.MapQuest.prototype.getProjection);

goog.exportProperty(
    ol.source.MapQuest.prototype,
    'getState',
    ol.source.MapQuest.prototype.getState);

goog.exportProperty(
    ol.source.MapQuest.prototype,
    'setAttributions',
    ol.source.MapQuest.prototype.setAttributions);

goog.exportProperty(
    ol.source.MapQuest.prototype,
    'get',
    ol.source.MapQuest.prototype.get);

goog.exportProperty(
    ol.source.MapQuest.prototype,
    'getKeys',
    ol.source.MapQuest.prototype.getKeys);

goog.exportProperty(
    ol.source.MapQuest.prototype,
    'getProperties',
    ol.source.MapQuest.prototype.getProperties);

goog.exportProperty(
    ol.source.MapQuest.prototype,
    'set',
    ol.source.MapQuest.prototype.set);

goog.exportProperty(
    ol.source.MapQuest.prototype,
    'setProperties',
    ol.source.MapQuest.prototype.setProperties);

goog.exportProperty(
    ol.source.MapQuest.prototype,
    'unset',
    ol.source.MapQuest.prototype.unset);

goog.exportProperty(
    ol.source.MapQuest.prototype,
    'changed',
    ol.source.MapQuest.prototype.changed);

goog.exportProperty(
    ol.source.MapQuest.prototype,
    'dispatchEvent',
    ol.source.MapQuest.prototype.dispatchEvent);

goog.exportProperty(
    ol.source.MapQuest.prototype,
    'getRevision',
    ol.source.MapQuest.prototype.getRevision);

goog.exportProperty(
    ol.source.MapQuest.prototype,
    'on',
    ol.source.MapQuest.prototype.on);

goog.exportProperty(
    ol.source.MapQuest.prototype,
    'once',
    ol.source.MapQuest.prototype.once);

goog.exportProperty(
    ol.source.MapQuest.prototype,
    'un',
    ol.source.MapQuest.prototype.un);

goog.exportProperty(
    ol.source.MapQuest.prototype,
    'unByKey',
    ol.source.MapQuest.prototype.unByKey);

goog.exportProperty(
    ol.source.OSM.prototype,
    'setRenderReprojectionEdges',
    ol.source.OSM.prototype.setRenderReprojectionEdges);

goog.exportProperty(
    ol.source.OSM.prototype,
    'setTileGridForProjection',
    ol.source.OSM.prototype.setTileGridForProjection);

goog.exportProperty(
    ol.source.OSM.prototype,
    'getTileLoadFunction',
    ol.source.OSM.prototype.getTileLoadFunction);

goog.exportProperty(
    ol.source.OSM.prototype,
    'getTileUrlFunction',
    ol.source.OSM.prototype.getTileUrlFunction);

goog.exportProperty(
    ol.source.OSM.prototype,
    'getUrls',
    ol.source.OSM.prototype.getUrls);

goog.exportProperty(
    ol.source.OSM.prototype,
    'setTileLoadFunction',
    ol.source.OSM.prototype.setTileLoadFunction);

goog.exportProperty(
    ol.source.OSM.prototype,
    'setTileUrlFunction',
    ol.source.OSM.prototype.setTileUrlFunction);

goog.exportProperty(
    ol.source.OSM.prototype,
    'setUrl',
    ol.source.OSM.prototype.setUrl);

goog.exportProperty(
    ol.source.OSM.prototype,
    'setUrls',
    ol.source.OSM.prototype.setUrls);

goog.exportProperty(
    ol.source.OSM.prototype,
    'getTileGrid',
    ol.source.OSM.prototype.getTileGrid);

goog.exportProperty(
    ol.source.OSM.prototype,
    'getAttributions',
    ol.source.OSM.prototype.getAttributions);

goog.exportProperty(
    ol.source.OSM.prototype,
    'getLogo',
    ol.source.OSM.prototype.getLogo);

goog.exportProperty(
    ol.source.OSM.prototype,
    'getProjection',
    ol.source.OSM.prototype.getProjection);

goog.exportProperty(
    ol.source.OSM.prototype,
    'getState',
    ol.source.OSM.prototype.getState);

goog.exportProperty(
    ol.source.OSM.prototype,
    'setAttributions',
    ol.source.OSM.prototype.setAttributions);

goog.exportProperty(
    ol.source.OSM.prototype,
    'get',
    ol.source.OSM.prototype.get);

goog.exportProperty(
    ol.source.OSM.prototype,
    'getKeys',
    ol.source.OSM.prototype.getKeys);

goog.exportProperty(
    ol.source.OSM.prototype,
    'getProperties',
    ol.source.OSM.prototype.getProperties);

goog.exportProperty(
    ol.source.OSM.prototype,
    'set',
    ol.source.OSM.prototype.set);

goog.exportProperty(
    ol.source.OSM.prototype,
    'setProperties',
    ol.source.OSM.prototype.setProperties);

goog.exportProperty(
    ol.source.OSM.prototype,
    'unset',
    ol.source.OSM.prototype.unset);

goog.exportProperty(
    ol.source.OSM.prototype,
    'changed',
    ol.source.OSM.prototype.changed);

goog.exportProperty(
    ol.source.OSM.prototype,
    'dispatchEvent',
    ol.source.OSM.prototype.dispatchEvent);

goog.exportProperty(
    ol.source.OSM.prototype,
    'getRevision',
    ol.source.OSM.prototype.getRevision);

goog.exportProperty(
    ol.source.OSM.prototype,
    'on',
    ol.source.OSM.prototype.on);

goog.exportProperty(
    ol.source.OSM.prototype,
    'once',
    ol.source.OSM.prototype.once);

goog.exportProperty(
    ol.source.OSM.prototype,
    'un',
    ol.source.OSM.prototype.un);

goog.exportProperty(
    ol.source.OSM.prototype,
    'unByKey',
    ol.source.OSM.prototype.unByKey);

goog.exportProperty(
    ol.source.Raster.prototype,
    'getAttributions',
    ol.source.Raster.prototype.getAttributions);

goog.exportProperty(
    ol.source.Raster.prototype,
    'getLogo',
    ol.source.Raster.prototype.getLogo);

goog.exportProperty(
    ol.source.Raster.prototype,
    'getProjection',
    ol.source.Raster.prototype.getProjection);

goog.exportProperty(
    ol.source.Raster.prototype,
    'getState',
    ol.source.Raster.prototype.getState);

goog.exportProperty(
    ol.source.Raster.prototype,
    'setAttributions',
    ol.source.Raster.prototype.setAttributions);

goog.exportProperty(
    ol.source.Raster.prototype,
    'get',
    ol.source.Raster.prototype.get);

goog.exportProperty(
    ol.source.Raster.prototype,
    'getKeys',
    ol.source.Raster.prototype.getKeys);

goog.exportProperty(
    ol.source.Raster.prototype,
    'getProperties',
    ol.source.Raster.prototype.getProperties);

goog.exportProperty(
    ol.source.Raster.prototype,
    'set',
    ol.source.Raster.prototype.set);

goog.exportProperty(
    ol.source.Raster.prototype,
    'setProperties',
    ol.source.Raster.prototype.setProperties);

goog.exportProperty(
    ol.source.Raster.prototype,
    'unset',
    ol.source.Raster.prototype.unset);

goog.exportProperty(
    ol.source.Raster.prototype,
    'changed',
    ol.source.Raster.prototype.changed);

goog.exportProperty(
    ol.source.Raster.prototype,
    'dispatchEvent',
    ol.source.Raster.prototype.dispatchEvent);

goog.exportProperty(
    ol.source.Raster.prototype,
    'getRevision',
    ol.source.Raster.prototype.getRevision);

goog.exportProperty(
    ol.source.Raster.prototype,
    'on',
    ol.source.Raster.prototype.on);

goog.exportProperty(
    ol.source.Raster.prototype,
    'once',
    ol.source.Raster.prototype.once);

goog.exportProperty(
    ol.source.Raster.prototype,
    'un',
    ol.source.Raster.prototype.un);

goog.exportProperty(
    ol.source.Raster.prototype,
    'unByKey',
    ol.source.Raster.prototype.unByKey);

goog.exportProperty(
    ol.source.Stamen.prototype,
    'setRenderReprojectionEdges',
    ol.source.Stamen.prototype.setRenderReprojectionEdges);

goog.exportProperty(
    ol.source.Stamen.prototype,
    'setTileGridForProjection',
    ol.source.Stamen.prototype.setTileGridForProjection);

goog.exportProperty(
    ol.source.Stamen.prototype,
    'getTileLoadFunction',
    ol.source.Stamen.prototype.getTileLoadFunction);

goog.exportProperty(
    ol.source.Stamen.prototype,
    'getTileUrlFunction',
    ol.source.Stamen.prototype.getTileUrlFunction);

goog.exportProperty(
    ol.source.Stamen.prototype,
    'getUrls',
    ol.source.Stamen.prototype.getUrls);

goog.exportProperty(
    ol.source.Stamen.prototype,
    'setTileLoadFunction',
    ol.source.Stamen.prototype.setTileLoadFunction);

goog.exportProperty(
    ol.source.Stamen.prototype,
    'setTileUrlFunction',
    ol.source.Stamen.prototype.setTileUrlFunction);

goog.exportProperty(
    ol.source.Stamen.prototype,
    'setUrl',
    ol.source.Stamen.prototype.setUrl);

goog.exportProperty(
    ol.source.Stamen.prototype,
    'setUrls',
    ol.source.Stamen.prototype.setUrls);

goog.exportProperty(
    ol.source.Stamen.prototype,
    'getTileGrid',
    ol.source.Stamen.prototype.getTileGrid);

goog.exportProperty(
    ol.source.Stamen.prototype,
    'getAttributions',
    ol.source.Stamen.prototype.getAttributions);

goog.exportProperty(
    ol.source.Stamen.prototype,
    'getLogo',
    ol.source.Stamen.prototype.getLogo);

goog.exportProperty(
    ol.source.Stamen.prototype,
    'getProjection',
    ol.source.Stamen.prototype.getProjection);

goog.exportProperty(
    ol.source.Stamen.prototype,
    'getState',
    ol.source.Stamen.prototype.getState);

goog.exportProperty(
    ol.source.Stamen.prototype,
    'setAttributions',
    ol.source.Stamen.prototype.setAttributions);

goog.exportProperty(
    ol.source.Stamen.prototype,
    'get',
    ol.source.Stamen.prototype.get);

goog.exportProperty(
    ol.source.Stamen.prototype,
    'getKeys',
    ol.source.Stamen.prototype.getKeys);

goog.exportProperty(
    ol.source.Stamen.prototype,
    'getProperties',
    ol.source.Stamen.prototype.getProperties);

goog.exportProperty(
    ol.source.Stamen.prototype,
    'set',
    ol.source.Stamen.prototype.set);

goog.exportProperty(
    ol.source.Stamen.prototype,
    'setProperties',
    ol.source.Stamen.prototype.setProperties);

goog.exportProperty(
    ol.source.Stamen.prototype,
    'unset',
    ol.source.Stamen.prototype.unset);

goog.exportProperty(
    ol.source.Stamen.prototype,
    'changed',
    ol.source.Stamen.prototype.changed);

goog.exportProperty(
    ol.source.Stamen.prototype,
    'dispatchEvent',
    ol.source.Stamen.prototype.dispatchEvent);

goog.exportProperty(
    ol.source.Stamen.prototype,
    'getRevision',
    ol.source.Stamen.prototype.getRevision);

goog.exportProperty(
    ol.source.Stamen.prototype,
    'on',
    ol.source.Stamen.prototype.on);

goog.exportProperty(
    ol.source.Stamen.prototype,
    'once',
    ol.source.Stamen.prototype.once);

goog.exportProperty(
    ol.source.Stamen.prototype,
    'un',
    ol.source.Stamen.prototype.un);

goog.exportProperty(
    ol.source.Stamen.prototype,
    'unByKey',
    ol.source.Stamen.prototype.unByKey);

goog.exportProperty(
    ol.source.TileArcGISRest.prototype,
    'setRenderReprojectionEdges',
    ol.source.TileArcGISRest.prototype.setRenderReprojectionEdges);

goog.exportProperty(
    ol.source.TileArcGISRest.prototype,
    'setTileGridForProjection',
    ol.source.TileArcGISRest.prototype.setTileGridForProjection);

goog.exportProperty(
    ol.source.TileArcGISRest.prototype,
    'getTileLoadFunction',
    ol.source.TileArcGISRest.prototype.getTileLoadFunction);

goog.exportProperty(
    ol.source.TileArcGISRest.prototype,
    'getTileUrlFunction',
    ol.source.TileArcGISRest.prototype.getTileUrlFunction);

goog.exportProperty(
    ol.source.TileArcGISRest.prototype,
    'getUrls',
    ol.source.TileArcGISRest.prototype.getUrls);

goog.exportProperty(
    ol.source.TileArcGISRest.prototype,
    'setTileLoadFunction',
    ol.source.TileArcGISRest.prototype.setTileLoadFunction);

goog.exportProperty(
    ol.source.TileArcGISRest.prototype,
    'setTileUrlFunction',
    ol.source.TileArcGISRest.prototype.setTileUrlFunction);

goog.exportProperty(
    ol.source.TileArcGISRest.prototype,
    'setUrl',
    ol.source.TileArcGISRest.prototype.setUrl);

goog.exportProperty(
    ol.source.TileArcGISRest.prototype,
    'setUrls',
    ol.source.TileArcGISRest.prototype.setUrls);

goog.exportProperty(
    ol.source.TileArcGISRest.prototype,
    'getTileGrid',
    ol.source.TileArcGISRest.prototype.getTileGrid);

goog.exportProperty(
    ol.source.TileArcGISRest.prototype,
    'getAttributions',
    ol.source.TileArcGISRest.prototype.getAttributions);

goog.exportProperty(
    ol.source.TileArcGISRest.prototype,
    'getLogo',
    ol.source.TileArcGISRest.prototype.getLogo);

goog.exportProperty(
    ol.source.TileArcGISRest.prototype,
    'getProjection',
    ol.source.TileArcGISRest.prototype.getProjection);

goog.exportProperty(
    ol.source.TileArcGISRest.prototype,
    'getState',
    ol.source.TileArcGISRest.prototype.getState);

goog.exportProperty(
    ol.source.TileArcGISRest.prototype,
    'setAttributions',
    ol.source.TileArcGISRest.prototype.setAttributions);

goog.exportProperty(
    ol.source.TileArcGISRest.prototype,
    'get',
    ol.source.TileArcGISRest.prototype.get);

goog.exportProperty(
    ol.source.TileArcGISRest.prototype,
    'getKeys',
    ol.source.TileArcGISRest.prototype.getKeys);

goog.exportProperty(
    ol.source.TileArcGISRest.prototype,
    'getProperties',
    ol.source.TileArcGISRest.prototype.getProperties);

goog.exportProperty(
    ol.source.TileArcGISRest.prototype,
    'set',
    ol.source.TileArcGISRest.prototype.set);

goog.exportProperty(
    ol.source.TileArcGISRest.prototype,
    'setProperties',
    ol.source.TileArcGISRest.prototype.setProperties);

goog.exportProperty(
    ol.source.TileArcGISRest.prototype,
    'unset',
    ol.source.TileArcGISRest.prototype.unset);

goog.exportProperty(
    ol.source.TileArcGISRest.prototype,
    'changed',
    ol.source.TileArcGISRest.prototype.changed);

goog.exportProperty(
    ol.source.TileArcGISRest.prototype,
    'dispatchEvent',
    ol.source.TileArcGISRest.prototype.dispatchEvent);

goog.exportProperty(
    ol.source.TileArcGISRest.prototype,
    'getRevision',
    ol.source.TileArcGISRest.prototype.getRevision);

goog.exportProperty(
    ol.source.TileArcGISRest.prototype,
    'on',
    ol.source.TileArcGISRest.prototype.on);

goog.exportProperty(
    ol.source.TileArcGISRest.prototype,
    'once',
    ol.source.TileArcGISRest.prototype.once);

goog.exportProperty(
    ol.source.TileArcGISRest.prototype,
    'un',
    ol.source.TileArcGISRest.prototype.un);

goog.exportProperty(
    ol.source.TileArcGISRest.prototype,
    'unByKey',
    ol.source.TileArcGISRest.prototype.unByKey);

goog.exportProperty(
    ol.source.TileDebug.prototype,
    'getTileGrid',
    ol.source.TileDebug.prototype.getTileGrid);

goog.exportProperty(
    ol.source.TileDebug.prototype,
    'getAttributions',
    ol.source.TileDebug.prototype.getAttributions);

goog.exportProperty(
    ol.source.TileDebug.prototype,
    'getLogo',
    ol.source.TileDebug.prototype.getLogo);

goog.exportProperty(
    ol.source.TileDebug.prototype,
    'getProjection',
    ol.source.TileDebug.prototype.getProjection);

goog.exportProperty(
    ol.source.TileDebug.prototype,
    'getState',
    ol.source.TileDebug.prototype.getState);

goog.exportProperty(
    ol.source.TileDebug.prototype,
    'setAttributions',
    ol.source.TileDebug.prototype.setAttributions);

goog.exportProperty(
    ol.source.TileDebug.prototype,
    'get',
    ol.source.TileDebug.prototype.get);

goog.exportProperty(
    ol.source.TileDebug.prototype,
    'getKeys',
    ol.source.TileDebug.prototype.getKeys);

goog.exportProperty(
    ol.source.TileDebug.prototype,
    'getProperties',
    ol.source.TileDebug.prototype.getProperties);

goog.exportProperty(
    ol.source.TileDebug.prototype,
    'set',
    ol.source.TileDebug.prototype.set);

goog.exportProperty(
    ol.source.TileDebug.prototype,
    'setProperties',
    ol.source.TileDebug.prototype.setProperties);

goog.exportProperty(
    ol.source.TileDebug.prototype,
    'unset',
    ol.source.TileDebug.prototype.unset);

goog.exportProperty(
    ol.source.TileDebug.prototype,
    'changed',
    ol.source.TileDebug.prototype.changed);

goog.exportProperty(
    ol.source.TileDebug.prototype,
    'dispatchEvent',
    ol.source.TileDebug.prototype.dispatchEvent);

goog.exportProperty(
    ol.source.TileDebug.prototype,
    'getRevision',
    ol.source.TileDebug.prototype.getRevision);

goog.exportProperty(
    ol.source.TileDebug.prototype,
    'on',
    ol.source.TileDebug.prototype.on);

goog.exportProperty(
    ol.source.TileDebug.prototype,
    'once',
    ol.source.TileDebug.prototype.once);

goog.exportProperty(
    ol.source.TileDebug.prototype,
    'un',
    ol.source.TileDebug.prototype.un);

goog.exportProperty(
    ol.source.TileDebug.prototype,
    'unByKey',
    ol.source.TileDebug.prototype.unByKey);

goog.exportProperty(
    ol.source.TileJSON.prototype,
    'setRenderReprojectionEdges',
    ol.source.TileJSON.prototype.setRenderReprojectionEdges);

goog.exportProperty(
    ol.source.TileJSON.prototype,
    'setTileGridForProjection',
    ol.source.TileJSON.prototype.setTileGridForProjection);

goog.exportProperty(
    ol.source.TileJSON.prototype,
    'getTileLoadFunction',
    ol.source.TileJSON.prototype.getTileLoadFunction);

goog.exportProperty(
    ol.source.TileJSON.prototype,
    'getTileUrlFunction',
    ol.source.TileJSON.prototype.getTileUrlFunction);

goog.exportProperty(
    ol.source.TileJSON.prototype,
    'getUrls',
    ol.source.TileJSON.prototype.getUrls);

goog.exportProperty(
    ol.source.TileJSON.prototype,
    'setTileLoadFunction',
    ol.source.TileJSON.prototype.setTileLoadFunction);

goog.exportProperty(
    ol.source.TileJSON.prototype,
    'setTileUrlFunction',
    ol.source.TileJSON.prototype.setTileUrlFunction);

goog.exportProperty(
    ol.source.TileJSON.prototype,
    'setUrl',
    ol.source.TileJSON.prototype.setUrl);

goog.exportProperty(
    ol.source.TileJSON.prototype,
    'setUrls',
    ol.source.TileJSON.prototype.setUrls);

goog.exportProperty(
    ol.source.TileJSON.prototype,
    'getTileGrid',
    ol.source.TileJSON.prototype.getTileGrid);

goog.exportProperty(
    ol.source.TileJSON.prototype,
    'getAttributions',
    ol.source.TileJSON.prototype.getAttributions);

goog.exportProperty(
    ol.source.TileJSON.prototype,
    'getLogo',
    ol.source.TileJSON.prototype.getLogo);

goog.exportProperty(
    ol.source.TileJSON.prototype,
    'getProjection',
    ol.source.TileJSON.prototype.getProjection);

goog.exportProperty(
    ol.source.TileJSON.prototype,
    'getState',
    ol.source.TileJSON.prototype.getState);

goog.exportProperty(
    ol.source.TileJSON.prototype,
    'setAttributions',
    ol.source.TileJSON.prototype.setAttributions);

goog.exportProperty(
    ol.source.TileJSON.prototype,
    'get',
    ol.source.TileJSON.prototype.get);

goog.exportProperty(
    ol.source.TileJSON.prototype,
    'getKeys',
    ol.source.TileJSON.prototype.getKeys);

goog.exportProperty(
    ol.source.TileJSON.prototype,
    'getProperties',
    ol.source.TileJSON.prototype.getProperties);

goog.exportProperty(
    ol.source.TileJSON.prototype,
    'set',
    ol.source.TileJSON.prototype.set);

goog.exportProperty(
    ol.source.TileJSON.prototype,
    'setProperties',
    ol.source.TileJSON.prototype.setProperties);

goog.exportProperty(
    ol.source.TileJSON.prototype,
    'unset',
    ol.source.TileJSON.prototype.unset);

goog.exportProperty(
    ol.source.TileJSON.prototype,
    'changed',
    ol.source.TileJSON.prototype.changed);

goog.exportProperty(
    ol.source.TileJSON.prototype,
    'dispatchEvent',
    ol.source.TileJSON.prototype.dispatchEvent);

goog.exportProperty(
    ol.source.TileJSON.prototype,
    'getRevision',
    ol.source.TileJSON.prototype.getRevision);

goog.exportProperty(
    ol.source.TileJSON.prototype,
    'on',
    ol.source.TileJSON.prototype.on);

goog.exportProperty(
    ol.source.TileJSON.prototype,
    'once',
    ol.source.TileJSON.prototype.once);

goog.exportProperty(
    ol.source.TileJSON.prototype,
    'un',
    ol.source.TileJSON.prototype.un);

goog.exportProperty(
    ol.source.TileJSON.prototype,
    'unByKey',
    ol.source.TileJSON.prototype.unByKey);

goog.exportProperty(
    ol.source.TileUTFGrid.prototype,
    'getTileGrid',
    ol.source.TileUTFGrid.prototype.getTileGrid);

goog.exportProperty(
    ol.source.TileUTFGrid.prototype,
    'getAttributions',
    ol.source.TileUTFGrid.prototype.getAttributions);

goog.exportProperty(
    ol.source.TileUTFGrid.prototype,
    'getLogo',
    ol.source.TileUTFGrid.prototype.getLogo);

goog.exportProperty(
    ol.source.TileUTFGrid.prototype,
    'getProjection',
    ol.source.TileUTFGrid.prototype.getProjection);

goog.exportProperty(
    ol.source.TileUTFGrid.prototype,
    'getState',
    ol.source.TileUTFGrid.prototype.getState);

goog.exportProperty(
    ol.source.TileUTFGrid.prototype,
    'setAttributions',
    ol.source.TileUTFGrid.prototype.setAttributions);

goog.exportProperty(
    ol.source.TileUTFGrid.prototype,
    'get',
    ol.source.TileUTFGrid.prototype.get);

goog.exportProperty(
    ol.source.TileUTFGrid.prototype,
    'getKeys',
    ol.source.TileUTFGrid.prototype.getKeys);

goog.exportProperty(
    ol.source.TileUTFGrid.prototype,
    'getProperties',
    ol.source.TileUTFGrid.prototype.getProperties);

goog.exportProperty(
    ol.source.TileUTFGrid.prototype,
    'set',
    ol.source.TileUTFGrid.prototype.set);

goog.exportProperty(
    ol.source.TileUTFGrid.prototype,
    'setProperties',
    ol.source.TileUTFGrid.prototype.setProperties);

goog.exportProperty(
    ol.source.TileUTFGrid.prototype,
    'unset',
    ol.source.TileUTFGrid.prototype.unset);

goog.exportProperty(
    ol.source.TileUTFGrid.prototype,
    'changed',
    ol.source.TileUTFGrid.prototype.changed);

goog.exportProperty(
    ol.source.TileUTFGrid.prototype,
    'dispatchEvent',
    ol.source.TileUTFGrid.prototype.dispatchEvent);

goog.exportProperty(
    ol.source.TileUTFGrid.prototype,
    'getRevision',
    ol.source.TileUTFGrid.prototype.getRevision);

goog.exportProperty(
    ol.source.TileUTFGrid.prototype,
    'on',
    ol.source.TileUTFGrid.prototype.on);

goog.exportProperty(
    ol.source.TileUTFGrid.prototype,
    'once',
    ol.source.TileUTFGrid.prototype.once);

goog.exportProperty(
    ol.source.TileUTFGrid.prototype,
    'un',
    ol.source.TileUTFGrid.prototype.un);

goog.exportProperty(
    ol.source.TileUTFGrid.prototype,
    'unByKey',
    ol.source.TileUTFGrid.prototype.unByKey);

goog.exportProperty(
    ol.source.TileWMS.prototype,
    'setRenderReprojectionEdges',
    ol.source.TileWMS.prototype.setRenderReprojectionEdges);

goog.exportProperty(
    ol.source.TileWMS.prototype,
    'setTileGridForProjection',
    ol.source.TileWMS.prototype.setTileGridForProjection);

goog.exportProperty(
    ol.source.TileWMS.prototype,
    'getTileLoadFunction',
    ol.source.TileWMS.prototype.getTileLoadFunction);

goog.exportProperty(
    ol.source.TileWMS.prototype,
    'getTileUrlFunction',
    ol.source.TileWMS.prototype.getTileUrlFunction);

goog.exportProperty(
    ol.source.TileWMS.prototype,
    'getUrls',
    ol.source.TileWMS.prototype.getUrls);

goog.exportProperty(
    ol.source.TileWMS.prototype,
    'setTileLoadFunction',
    ol.source.TileWMS.prototype.setTileLoadFunction);

goog.exportProperty(
    ol.source.TileWMS.prototype,
    'setTileUrlFunction',
    ol.source.TileWMS.prototype.setTileUrlFunction);

goog.exportProperty(
    ol.source.TileWMS.prototype,
    'setUrl',
    ol.source.TileWMS.prototype.setUrl);

goog.exportProperty(
    ol.source.TileWMS.prototype,
    'setUrls',
    ol.source.TileWMS.prototype.setUrls);

goog.exportProperty(
    ol.source.TileWMS.prototype,
    'getTileGrid',
    ol.source.TileWMS.prototype.getTileGrid);

goog.exportProperty(
    ol.source.TileWMS.prototype,
    'getAttributions',
    ol.source.TileWMS.prototype.getAttributions);

goog.exportProperty(
    ol.source.TileWMS.prototype,
    'getLogo',
    ol.source.TileWMS.prototype.getLogo);

goog.exportProperty(
    ol.source.TileWMS.prototype,
    'getProjection',
    ol.source.TileWMS.prototype.getProjection);

goog.exportProperty(
    ol.source.TileWMS.prototype,
    'getState',
    ol.source.TileWMS.prototype.getState);

goog.exportProperty(
    ol.source.TileWMS.prototype,
    'setAttributions',
    ol.source.TileWMS.prototype.setAttributions);

goog.exportProperty(
    ol.source.TileWMS.prototype,
    'get',
    ol.source.TileWMS.prototype.get);

goog.exportProperty(
    ol.source.TileWMS.prototype,
    'getKeys',
    ol.source.TileWMS.prototype.getKeys);

goog.exportProperty(
    ol.source.TileWMS.prototype,
    'getProperties',
    ol.source.TileWMS.prototype.getProperties);

goog.exportProperty(
    ol.source.TileWMS.prototype,
    'set',
    ol.source.TileWMS.prototype.set);

goog.exportProperty(
    ol.source.TileWMS.prototype,
    'setProperties',
    ol.source.TileWMS.prototype.setProperties);

goog.exportProperty(
    ol.source.TileWMS.prototype,
    'unset',
    ol.source.TileWMS.prototype.unset);

goog.exportProperty(
    ol.source.TileWMS.prototype,
    'changed',
    ol.source.TileWMS.prototype.changed);

goog.exportProperty(
    ol.source.TileWMS.prototype,
    'dispatchEvent',
    ol.source.TileWMS.prototype.dispatchEvent);

goog.exportProperty(
    ol.source.TileWMS.prototype,
    'getRevision',
    ol.source.TileWMS.prototype.getRevision);

goog.exportProperty(
    ol.source.TileWMS.prototype,
    'on',
    ol.source.TileWMS.prototype.on);

goog.exportProperty(
    ol.source.TileWMS.prototype,
    'once',
    ol.source.TileWMS.prototype.once);

goog.exportProperty(
    ol.source.TileWMS.prototype,
    'un',
    ol.source.TileWMS.prototype.un);

goog.exportProperty(
    ol.source.TileWMS.prototype,
    'unByKey',
    ol.source.TileWMS.prototype.unByKey);

goog.exportProperty(
    ol.source.VectorTile.prototype,
    'getTileLoadFunction',
    ol.source.VectorTile.prototype.getTileLoadFunction);

goog.exportProperty(
    ol.source.VectorTile.prototype,
    'getTileUrlFunction',
    ol.source.VectorTile.prototype.getTileUrlFunction);

goog.exportProperty(
    ol.source.VectorTile.prototype,
    'getUrls',
    ol.source.VectorTile.prototype.getUrls);

goog.exportProperty(
    ol.source.VectorTile.prototype,
    'setTileLoadFunction',
    ol.source.VectorTile.prototype.setTileLoadFunction);

goog.exportProperty(
    ol.source.VectorTile.prototype,
    'setTileUrlFunction',
    ol.source.VectorTile.prototype.setTileUrlFunction);

goog.exportProperty(
    ol.source.VectorTile.prototype,
    'setUrl',
    ol.source.VectorTile.prototype.setUrl);

goog.exportProperty(
    ol.source.VectorTile.prototype,
    'setUrls',
    ol.source.VectorTile.prototype.setUrls);

goog.exportProperty(
    ol.source.VectorTile.prototype,
    'getTileGrid',
    ol.source.VectorTile.prototype.getTileGrid);

goog.exportProperty(
    ol.source.VectorTile.prototype,
    'getAttributions',
    ol.source.VectorTile.prototype.getAttributions);

goog.exportProperty(
    ol.source.VectorTile.prototype,
    'getLogo',
    ol.source.VectorTile.prototype.getLogo);

goog.exportProperty(
    ol.source.VectorTile.prototype,
    'getProjection',
    ol.source.VectorTile.prototype.getProjection);

goog.exportProperty(
    ol.source.VectorTile.prototype,
    'getState',
    ol.source.VectorTile.prototype.getState);

goog.exportProperty(
    ol.source.VectorTile.prototype,
    'setAttributions',
    ol.source.VectorTile.prototype.setAttributions);

goog.exportProperty(
    ol.source.VectorTile.prototype,
    'get',
    ol.source.VectorTile.prototype.get);

goog.exportProperty(
    ol.source.VectorTile.prototype,
    'getKeys',
    ol.source.VectorTile.prototype.getKeys);

goog.exportProperty(
    ol.source.VectorTile.prototype,
    'getProperties',
    ol.source.VectorTile.prototype.getProperties);

goog.exportProperty(
    ol.source.VectorTile.prototype,
    'set',
    ol.source.VectorTile.prototype.set);

goog.exportProperty(
    ol.source.VectorTile.prototype,
    'setProperties',
    ol.source.VectorTile.prototype.setProperties);

goog.exportProperty(
    ol.source.VectorTile.prototype,
    'unset',
    ol.source.VectorTile.prototype.unset);

goog.exportProperty(
    ol.source.VectorTile.prototype,
    'changed',
    ol.source.VectorTile.prototype.changed);

goog.exportProperty(
    ol.source.VectorTile.prototype,
    'dispatchEvent',
    ol.source.VectorTile.prototype.dispatchEvent);

goog.exportProperty(
    ol.source.VectorTile.prototype,
    'getRevision',
    ol.source.VectorTile.prototype.getRevision);

goog.exportProperty(
    ol.source.VectorTile.prototype,
    'on',
    ol.source.VectorTile.prototype.on);

goog.exportProperty(
    ol.source.VectorTile.prototype,
    'once',
    ol.source.VectorTile.prototype.once);

goog.exportProperty(
    ol.source.VectorTile.prototype,
    'un',
    ol.source.VectorTile.prototype.un);

goog.exportProperty(
    ol.source.VectorTile.prototype,
    'unByKey',
    ol.source.VectorTile.prototype.unByKey);

goog.exportProperty(
    ol.source.WMTS.prototype,
    'setRenderReprojectionEdges',
    ol.source.WMTS.prototype.setRenderReprojectionEdges);

goog.exportProperty(
    ol.source.WMTS.prototype,
    'setTileGridForProjection',
    ol.source.WMTS.prototype.setTileGridForProjection);

goog.exportProperty(
    ol.source.WMTS.prototype,
    'getTileLoadFunction',
    ol.source.WMTS.prototype.getTileLoadFunction);

goog.exportProperty(
    ol.source.WMTS.prototype,
    'getTileUrlFunction',
    ol.source.WMTS.prototype.getTileUrlFunction);

goog.exportProperty(
    ol.source.WMTS.prototype,
    'getUrls',
    ol.source.WMTS.prototype.getUrls);

goog.exportProperty(
    ol.source.WMTS.prototype,
    'setTileLoadFunction',
    ol.source.WMTS.prototype.setTileLoadFunction);

goog.exportProperty(
    ol.source.WMTS.prototype,
    'setTileUrlFunction',
    ol.source.WMTS.prototype.setTileUrlFunction);

goog.exportProperty(
    ol.source.WMTS.prototype,
    'setUrl',
    ol.source.WMTS.prototype.setUrl);

goog.exportProperty(
    ol.source.WMTS.prototype,
    'setUrls',
    ol.source.WMTS.prototype.setUrls);

goog.exportProperty(
    ol.source.WMTS.prototype,
    'getTileGrid',
    ol.source.WMTS.prototype.getTileGrid);

goog.exportProperty(
    ol.source.WMTS.prototype,
    'getAttributions',
    ol.source.WMTS.prototype.getAttributions);

goog.exportProperty(
    ol.source.WMTS.prototype,
    'getLogo',
    ol.source.WMTS.prototype.getLogo);

goog.exportProperty(
    ol.source.WMTS.prototype,
    'getProjection',
    ol.source.WMTS.prototype.getProjection);

goog.exportProperty(
    ol.source.WMTS.prototype,
    'getState',
    ol.source.WMTS.prototype.getState);

goog.exportProperty(
    ol.source.WMTS.prototype,
    'setAttributions',
    ol.source.WMTS.prototype.setAttributions);

goog.exportProperty(
    ol.source.WMTS.prototype,
    'get',
    ol.source.WMTS.prototype.get);

goog.exportProperty(
    ol.source.WMTS.prototype,
    'getKeys',
    ol.source.WMTS.prototype.getKeys);

goog.exportProperty(
    ol.source.WMTS.prototype,
    'getProperties',
    ol.source.WMTS.prototype.getProperties);

goog.exportProperty(
    ol.source.WMTS.prototype,
    'set',
    ol.source.WMTS.prototype.set);

goog.exportProperty(
    ol.source.WMTS.prototype,
    'setProperties',
    ol.source.WMTS.prototype.setProperties);

goog.exportProperty(
    ol.source.WMTS.prototype,
    'unset',
    ol.source.WMTS.prototype.unset);

goog.exportProperty(
    ol.source.WMTS.prototype,
    'changed',
    ol.source.WMTS.prototype.changed);

goog.exportProperty(
    ol.source.WMTS.prototype,
    'dispatchEvent',
    ol.source.WMTS.prototype.dispatchEvent);

goog.exportProperty(
    ol.source.WMTS.prototype,
    'getRevision',
    ol.source.WMTS.prototype.getRevision);

goog.exportProperty(
    ol.source.WMTS.prototype,
    'on',
    ol.source.WMTS.prototype.on);

goog.exportProperty(
    ol.source.WMTS.prototype,
    'once',
    ol.source.WMTS.prototype.once);

goog.exportProperty(
    ol.source.WMTS.prototype,
    'un',
    ol.source.WMTS.prototype.un);

goog.exportProperty(
    ol.source.WMTS.prototype,
    'unByKey',
    ol.source.WMTS.prototype.unByKey);

goog.exportProperty(
    ol.source.Zoomify.prototype,
    'setRenderReprojectionEdges',
    ol.source.Zoomify.prototype.setRenderReprojectionEdges);

goog.exportProperty(
    ol.source.Zoomify.prototype,
    'setTileGridForProjection',
    ol.source.Zoomify.prototype.setTileGridForProjection);

goog.exportProperty(
    ol.source.Zoomify.prototype,
    'getTileLoadFunction',
    ol.source.Zoomify.prototype.getTileLoadFunction);

goog.exportProperty(
    ol.source.Zoomify.prototype,
    'getTileUrlFunction',
    ol.source.Zoomify.prototype.getTileUrlFunction);

goog.exportProperty(
    ol.source.Zoomify.prototype,
    'getUrls',
    ol.source.Zoomify.prototype.getUrls);

goog.exportProperty(
    ol.source.Zoomify.prototype,
    'setTileLoadFunction',
    ol.source.Zoomify.prototype.setTileLoadFunction);

goog.exportProperty(
    ol.source.Zoomify.prototype,
    'setTileUrlFunction',
    ol.source.Zoomify.prototype.setTileUrlFunction);

goog.exportProperty(
    ol.source.Zoomify.prototype,
    'setUrl',
    ol.source.Zoomify.prototype.setUrl);

goog.exportProperty(
    ol.source.Zoomify.prototype,
    'setUrls',
    ol.source.Zoomify.prototype.setUrls);

goog.exportProperty(
    ol.source.Zoomify.prototype,
    'getTileGrid',
    ol.source.Zoomify.prototype.getTileGrid);

goog.exportProperty(
    ol.source.Zoomify.prototype,
    'getAttributions',
    ol.source.Zoomify.prototype.getAttributions);

goog.exportProperty(
    ol.source.Zoomify.prototype,
    'getLogo',
    ol.source.Zoomify.prototype.getLogo);

goog.exportProperty(
    ol.source.Zoomify.prototype,
    'getProjection',
    ol.source.Zoomify.prototype.getProjection);

goog.exportProperty(
    ol.source.Zoomify.prototype,
    'getState',
    ol.source.Zoomify.prototype.getState);

goog.exportProperty(
    ol.source.Zoomify.prototype,
    'setAttributions',
    ol.source.Zoomify.prototype.setAttributions);

goog.exportProperty(
    ol.source.Zoomify.prototype,
    'get',
    ol.source.Zoomify.prototype.get);

goog.exportProperty(
    ol.source.Zoomify.prototype,
    'getKeys',
    ol.source.Zoomify.prototype.getKeys);

goog.exportProperty(
    ol.source.Zoomify.prototype,
    'getProperties',
    ol.source.Zoomify.prototype.getProperties);

goog.exportProperty(
    ol.source.Zoomify.prototype,
    'set',
    ol.source.Zoomify.prototype.set);

goog.exportProperty(
    ol.source.Zoomify.prototype,
    'setProperties',
    ol.source.Zoomify.prototype.setProperties);

goog.exportProperty(
    ol.source.Zoomify.prototype,
    'unset',
    ol.source.Zoomify.prototype.unset);

goog.exportProperty(
    ol.source.Zoomify.prototype,
    'changed',
    ol.source.Zoomify.prototype.changed);

goog.exportProperty(
    ol.source.Zoomify.prototype,
    'dispatchEvent',
    ol.source.Zoomify.prototype.dispatchEvent);

goog.exportProperty(
    ol.source.Zoomify.prototype,
    'getRevision',
    ol.source.Zoomify.prototype.getRevision);

goog.exportProperty(
    ol.source.Zoomify.prototype,
    'on',
    ol.source.Zoomify.prototype.on);

goog.exportProperty(
    ol.source.Zoomify.prototype,
    'once',
    ol.source.Zoomify.prototype.once);

goog.exportProperty(
    ol.source.Zoomify.prototype,
    'un',
    ol.source.Zoomify.prototype.un);

goog.exportProperty(
    ol.source.Zoomify.prototype,
    'unByKey',
    ol.source.Zoomify.prototype.unByKey);

goog.exportProperty(
    ol.reproj.Tile.prototype,
    'getTileCoord',
    ol.reproj.Tile.prototype.getTileCoord);

goog.exportProperty(
    ol.renderer.Layer.prototype,
    'changed',
    ol.renderer.Layer.prototype.changed);

goog.exportProperty(
    ol.renderer.Layer.prototype,
    'dispatchEvent',
    ol.renderer.Layer.prototype.dispatchEvent);

goog.exportProperty(
    ol.renderer.Layer.prototype,
    'getRevision',
    ol.renderer.Layer.prototype.getRevision);

goog.exportProperty(
    ol.renderer.Layer.prototype,
    'on',
    ol.renderer.Layer.prototype.on);

goog.exportProperty(
    ol.renderer.Layer.prototype,
    'once',
    ol.renderer.Layer.prototype.once);

goog.exportProperty(
    ol.renderer.Layer.prototype,
    'un',
    ol.renderer.Layer.prototype.un);

goog.exportProperty(
    ol.renderer.Layer.prototype,
    'unByKey',
    ol.renderer.Layer.prototype.unByKey);

goog.exportProperty(
    ol.renderer.webgl.Layer.prototype,
    'changed',
    ol.renderer.webgl.Layer.prototype.changed);

goog.exportProperty(
    ol.renderer.webgl.Layer.prototype,
    'dispatchEvent',
    ol.renderer.webgl.Layer.prototype.dispatchEvent);

goog.exportProperty(
    ol.renderer.webgl.Layer.prototype,
    'getRevision',
    ol.renderer.webgl.Layer.prototype.getRevision);

goog.exportProperty(
    ol.renderer.webgl.Layer.prototype,
    'on',
    ol.renderer.webgl.Layer.prototype.on);

goog.exportProperty(
    ol.renderer.webgl.Layer.prototype,
    'once',
    ol.renderer.webgl.Layer.prototype.once);

goog.exportProperty(
    ol.renderer.webgl.Layer.prototype,
    'un',
    ol.renderer.webgl.Layer.prototype.un);

goog.exportProperty(
    ol.renderer.webgl.Layer.prototype,
    'unByKey',
    ol.renderer.webgl.Layer.prototype.unByKey);

goog.exportProperty(
    ol.renderer.webgl.ImageLayer.prototype,
    'changed',
    ol.renderer.webgl.ImageLayer.prototype.changed);

goog.exportProperty(
    ol.renderer.webgl.ImageLayer.prototype,
    'dispatchEvent',
    ol.renderer.webgl.ImageLayer.prototype.dispatchEvent);

goog.exportProperty(
    ol.renderer.webgl.ImageLayer.prototype,
    'getRevision',
    ol.renderer.webgl.ImageLayer.prototype.getRevision);

goog.exportProperty(
    ol.renderer.webgl.ImageLayer.prototype,
    'on',
    ol.renderer.webgl.ImageLayer.prototype.on);

goog.exportProperty(
    ol.renderer.webgl.ImageLayer.prototype,
    'once',
    ol.renderer.webgl.ImageLayer.prototype.once);

goog.exportProperty(
    ol.renderer.webgl.ImageLayer.prototype,
    'un',
    ol.renderer.webgl.ImageLayer.prototype.un);

goog.exportProperty(
    ol.renderer.webgl.ImageLayer.prototype,
    'unByKey',
    ol.renderer.webgl.ImageLayer.prototype.unByKey);

goog.exportProperty(
    ol.renderer.webgl.TileLayer.prototype,
    'changed',
    ol.renderer.webgl.TileLayer.prototype.changed);

goog.exportProperty(
    ol.renderer.webgl.TileLayer.prototype,
    'dispatchEvent',
    ol.renderer.webgl.TileLayer.prototype.dispatchEvent);

goog.exportProperty(
    ol.renderer.webgl.TileLayer.prototype,
    'getRevision',
    ol.renderer.webgl.TileLayer.prototype.getRevision);

goog.exportProperty(
    ol.renderer.webgl.TileLayer.prototype,
    'on',
    ol.renderer.webgl.TileLayer.prototype.on);

goog.exportProperty(
    ol.renderer.webgl.TileLayer.prototype,
    'once',
    ol.renderer.webgl.TileLayer.prototype.once);

goog.exportProperty(
    ol.renderer.webgl.TileLayer.prototype,
    'un',
    ol.renderer.webgl.TileLayer.prototype.un);

goog.exportProperty(
    ol.renderer.webgl.TileLayer.prototype,
    'unByKey',
    ol.renderer.webgl.TileLayer.prototype.unByKey);

goog.exportProperty(
    ol.renderer.webgl.VectorLayer.prototype,
    'changed',
    ol.renderer.webgl.VectorLayer.prototype.changed);

goog.exportProperty(
    ol.renderer.webgl.VectorLayer.prototype,
    'dispatchEvent',
    ol.renderer.webgl.VectorLayer.prototype.dispatchEvent);

goog.exportProperty(
    ol.renderer.webgl.VectorLayer.prototype,
    'getRevision',
    ol.renderer.webgl.VectorLayer.prototype.getRevision);

goog.exportProperty(
    ol.renderer.webgl.VectorLayer.prototype,
    'on',
    ol.renderer.webgl.VectorLayer.prototype.on);

goog.exportProperty(
    ol.renderer.webgl.VectorLayer.prototype,
    'once',
    ol.renderer.webgl.VectorLayer.prototype.once);

goog.exportProperty(
    ol.renderer.webgl.VectorLayer.prototype,
    'un',
    ol.renderer.webgl.VectorLayer.prototype.un);

goog.exportProperty(
    ol.renderer.webgl.VectorLayer.prototype,
    'unByKey',
    ol.renderer.webgl.VectorLayer.prototype.unByKey);

goog.exportProperty(
    M.impl.format.KML.prototype,
    'readFeature',
    M.impl.format.KML.prototype.readFeature);

goog.exportProperty(
    M.impl.format.KML.prototype,
    'readFeatures',
    M.impl.format.KML.prototype.readFeatures);

goog.exportProperty(
    M.impl.format.KML.prototype,
    'readName',
    M.impl.format.KML.prototype.readName);

goog.exportProperty(
    M.impl.format.KML.prototype,
    'readNetworkLinks',
    M.impl.format.KML.prototype.readNetworkLinks);

goog.exportProperty(
    M.impl.format.KML.prototype,
    'readProjection',
    M.impl.format.KML.prototype.readProjection);

goog.exportProperty(
    M.impl.format.KML.prototype,
    'writeFeatures',
    M.impl.format.KML.prototype.writeFeatures);

goog.exportProperty(
    M.impl.format.KML.prototype,
    'writeFeaturesNode',
    M.impl.format.KML.prototype.writeFeaturesNode);

goog.exportProperty(
    ol.renderer.dom.Layer.prototype,
    'changed',
    ol.renderer.dom.Layer.prototype.changed);

goog.exportProperty(
    ol.renderer.dom.Layer.prototype,
    'dispatchEvent',
    ol.renderer.dom.Layer.prototype.dispatchEvent);

goog.exportProperty(
    ol.renderer.dom.Layer.prototype,
    'getRevision',
    ol.renderer.dom.Layer.prototype.getRevision);

goog.exportProperty(
    ol.renderer.dom.Layer.prototype,
    'on',
    ol.renderer.dom.Layer.prototype.on);

goog.exportProperty(
    ol.renderer.dom.Layer.prototype,
    'once',
    ol.renderer.dom.Layer.prototype.once);

goog.exportProperty(
    ol.renderer.dom.Layer.prototype,
    'un',
    ol.renderer.dom.Layer.prototype.un);

goog.exportProperty(
    ol.renderer.dom.Layer.prototype,
    'unByKey',
    ol.renderer.dom.Layer.prototype.unByKey);

goog.exportProperty(
    ol.renderer.dom.ImageLayer.prototype,
    'changed',
    ol.renderer.dom.ImageLayer.prototype.changed);

goog.exportProperty(
    ol.renderer.dom.ImageLayer.prototype,
    'dispatchEvent',
    ol.renderer.dom.ImageLayer.prototype.dispatchEvent);

goog.exportProperty(
    ol.renderer.dom.ImageLayer.prototype,
    'getRevision',
    ol.renderer.dom.ImageLayer.prototype.getRevision);

goog.exportProperty(
    ol.renderer.dom.ImageLayer.prototype,
    'on',
    ol.renderer.dom.ImageLayer.prototype.on);

goog.exportProperty(
    ol.renderer.dom.ImageLayer.prototype,
    'once',
    ol.renderer.dom.ImageLayer.prototype.once);

goog.exportProperty(
    ol.renderer.dom.ImageLayer.prototype,
    'un',
    ol.renderer.dom.ImageLayer.prototype.un);

goog.exportProperty(
    ol.renderer.dom.ImageLayer.prototype,
    'unByKey',
    ol.renderer.dom.ImageLayer.prototype.unByKey);

goog.exportProperty(
    ol.renderer.dom.TileLayer.prototype,
    'changed',
    ol.renderer.dom.TileLayer.prototype.changed);

goog.exportProperty(
    ol.renderer.dom.TileLayer.prototype,
    'dispatchEvent',
    ol.renderer.dom.TileLayer.prototype.dispatchEvent);

goog.exportProperty(
    ol.renderer.dom.TileLayer.prototype,
    'getRevision',
    ol.renderer.dom.TileLayer.prototype.getRevision);

goog.exportProperty(
    ol.renderer.dom.TileLayer.prototype,
    'on',
    ol.renderer.dom.TileLayer.prototype.on);

goog.exportProperty(
    ol.renderer.dom.TileLayer.prototype,
    'once',
    ol.renderer.dom.TileLayer.prototype.once);

goog.exportProperty(
    ol.renderer.dom.TileLayer.prototype,
    'un',
    ol.renderer.dom.TileLayer.prototype.un);

goog.exportProperty(
    ol.renderer.dom.TileLayer.prototype,
    'unByKey',
    ol.renderer.dom.TileLayer.prototype.unByKey);

goog.exportProperty(
    ol.renderer.dom.VectorLayer.prototype,
    'changed',
    ol.renderer.dom.VectorLayer.prototype.changed);

goog.exportProperty(
    ol.renderer.dom.VectorLayer.prototype,
    'dispatchEvent',
    ol.renderer.dom.VectorLayer.prototype.dispatchEvent);

goog.exportProperty(
    ol.renderer.dom.VectorLayer.prototype,
    'getRevision',
    ol.renderer.dom.VectorLayer.prototype.getRevision);

goog.exportProperty(
    ol.renderer.dom.VectorLayer.prototype,
    'on',
    ol.renderer.dom.VectorLayer.prototype.on);

goog.exportProperty(
    ol.renderer.dom.VectorLayer.prototype,
    'once',
    ol.renderer.dom.VectorLayer.prototype.once);

goog.exportProperty(
    ol.renderer.dom.VectorLayer.prototype,
    'un',
    ol.renderer.dom.VectorLayer.prototype.un);

goog.exportProperty(
    ol.renderer.dom.VectorLayer.prototype,
    'unByKey',
    ol.renderer.dom.VectorLayer.prototype.unByKey);

goog.exportProperty(
    M.impl.Control.prototype,
    'getMap',
    M.impl.Control.prototype.getMap);

goog.exportProperty(
    M.impl.Control.prototype,
    'setMap',
    M.impl.Control.prototype.setMap);

goog.exportProperty(
    M.impl.Control.prototype,
    'setTarget',
    M.impl.Control.prototype.setTarget);

goog.exportProperty(
    M.impl.Control.prototype,
    'get',
    M.impl.Control.prototype.get);

goog.exportProperty(
    M.impl.Control.prototype,
    'getKeys',
    M.impl.Control.prototype.getKeys);

goog.exportProperty(
    M.impl.Control.prototype,
    'getProperties',
    M.impl.Control.prototype.getProperties);

goog.exportProperty(
    M.impl.Control.prototype,
    'set',
    M.impl.Control.prototype.set);

goog.exportProperty(
    M.impl.Control.prototype,
    'setProperties',
    M.impl.Control.prototype.setProperties);

goog.exportProperty(
    M.impl.Control.prototype,
    'unset',
    M.impl.Control.prototype.unset);

goog.exportProperty(
    M.impl.Control.prototype,
    'changed',
    M.impl.Control.prototype.changed);

goog.exportProperty(
    M.impl.Control.prototype,
    'dispatchEvent',
    M.impl.Control.prototype.dispatchEvent);

goog.exportProperty(
    M.impl.Control.prototype,
    'getRevision',
    M.impl.Control.prototype.getRevision);

goog.exportProperty(
    M.impl.Control.prototype,
    'on',
    M.impl.Control.prototype.on);

goog.exportProperty(
    M.impl.Control.prototype,
    'once',
    M.impl.Control.prototype.once);

goog.exportProperty(
    M.impl.Control.prototype,
    'un',
    M.impl.Control.prototype.un);

goog.exportProperty(
    M.impl.Control.prototype,
    'unByKey',
    M.impl.Control.prototype.unByKey);

goog.exportProperty(
    M.impl.control.GetFeatureInfo.prototype,
    'getMap',
    M.impl.control.GetFeatureInfo.prototype.getMap);

goog.exportProperty(
    M.impl.control.GetFeatureInfo.prototype,
    'setMap',
    M.impl.control.GetFeatureInfo.prototype.setMap);

goog.exportProperty(
    M.impl.control.GetFeatureInfo.prototype,
    'setTarget',
    M.impl.control.GetFeatureInfo.prototype.setTarget);

goog.exportProperty(
    M.impl.control.GetFeatureInfo.prototype,
    'get',
    M.impl.control.GetFeatureInfo.prototype.get);

goog.exportProperty(
    M.impl.control.GetFeatureInfo.prototype,
    'getKeys',
    M.impl.control.GetFeatureInfo.prototype.getKeys);

goog.exportProperty(
    M.impl.control.GetFeatureInfo.prototype,
    'getProperties',
    M.impl.control.GetFeatureInfo.prototype.getProperties);

goog.exportProperty(
    M.impl.control.GetFeatureInfo.prototype,
    'set',
    M.impl.control.GetFeatureInfo.prototype.set);

goog.exportProperty(
    M.impl.control.GetFeatureInfo.prototype,
    'setProperties',
    M.impl.control.GetFeatureInfo.prototype.setProperties);

goog.exportProperty(
    M.impl.control.GetFeatureInfo.prototype,
    'unset',
    M.impl.control.GetFeatureInfo.prototype.unset);

goog.exportProperty(
    M.impl.control.GetFeatureInfo.prototype,
    'changed',
    M.impl.control.GetFeatureInfo.prototype.changed);

goog.exportProperty(
    M.impl.control.GetFeatureInfo.prototype,
    'dispatchEvent',
    M.impl.control.GetFeatureInfo.prototype.dispatchEvent);

goog.exportProperty(
    M.impl.control.GetFeatureInfo.prototype,
    'getRevision',
    M.impl.control.GetFeatureInfo.prototype.getRevision);

goog.exportProperty(
    M.impl.control.GetFeatureInfo.prototype,
    'on',
    M.impl.control.GetFeatureInfo.prototype.on);

goog.exportProperty(
    M.impl.control.GetFeatureInfo.prototype,
    'once',
    M.impl.control.GetFeatureInfo.prototype.once);

goog.exportProperty(
    M.impl.control.GetFeatureInfo.prototype,
    'un',
    M.impl.control.GetFeatureInfo.prototype.un);

goog.exportProperty(
    M.impl.control.GetFeatureInfo.prototype,
    'unByKey',
    M.impl.control.GetFeatureInfo.prototype.unByKey);

goog.exportProperty(
    M.impl.control.LayerSwitcher.prototype,
    'getMap',
    M.impl.control.LayerSwitcher.prototype.getMap);

goog.exportProperty(
    M.impl.control.LayerSwitcher.prototype,
    'setTarget',
    M.impl.control.LayerSwitcher.prototype.setTarget);

goog.exportProperty(
    M.impl.control.LayerSwitcher.prototype,
    'get',
    M.impl.control.LayerSwitcher.prototype.get);

goog.exportProperty(
    M.impl.control.LayerSwitcher.prototype,
    'getKeys',
    M.impl.control.LayerSwitcher.prototype.getKeys);

goog.exportProperty(
    M.impl.control.LayerSwitcher.prototype,
    'getProperties',
    M.impl.control.LayerSwitcher.prototype.getProperties);

goog.exportProperty(
    M.impl.control.LayerSwitcher.prototype,
    'set',
    M.impl.control.LayerSwitcher.prototype.set);

goog.exportProperty(
    M.impl.control.LayerSwitcher.prototype,
    'setProperties',
    M.impl.control.LayerSwitcher.prototype.setProperties);

goog.exportProperty(
    M.impl.control.LayerSwitcher.prototype,
    'unset',
    M.impl.control.LayerSwitcher.prototype.unset);

goog.exportProperty(
    M.impl.control.LayerSwitcher.prototype,
    'changed',
    M.impl.control.LayerSwitcher.prototype.changed);

goog.exportProperty(
    M.impl.control.LayerSwitcher.prototype,
    'dispatchEvent',
    M.impl.control.LayerSwitcher.prototype.dispatchEvent);

goog.exportProperty(
    M.impl.control.LayerSwitcher.prototype,
    'getRevision',
    M.impl.control.LayerSwitcher.prototype.getRevision);

goog.exportProperty(
    M.impl.control.LayerSwitcher.prototype,
    'on',
    M.impl.control.LayerSwitcher.prototype.on);

goog.exportProperty(
    M.impl.control.LayerSwitcher.prototype,
    'once',
    M.impl.control.LayerSwitcher.prototype.once);

goog.exportProperty(
    M.impl.control.LayerSwitcher.prototype,
    'un',
    M.impl.control.LayerSwitcher.prototype.un);

goog.exportProperty(
    M.impl.control.LayerSwitcher.prototype,
    'unByKey',
    M.impl.control.LayerSwitcher.prototype.unByKey);

goog.exportProperty(
    M.impl.control.Location.prototype,
    'getMap',
    M.impl.control.Location.prototype.getMap);

goog.exportProperty(
    M.impl.control.Location.prototype,
    'setMap',
    M.impl.control.Location.prototype.setMap);

goog.exportProperty(
    M.impl.control.Location.prototype,
    'setTarget',
    M.impl.control.Location.prototype.setTarget);

goog.exportProperty(
    M.impl.control.Location.prototype,
    'get',
    M.impl.control.Location.prototype.get);

goog.exportProperty(
    M.impl.control.Location.prototype,
    'getKeys',
    M.impl.control.Location.prototype.getKeys);

goog.exportProperty(
    M.impl.control.Location.prototype,
    'getProperties',
    M.impl.control.Location.prototype.getProperties);

goog.exportProperty(
    M.impl.control.Location.prototype,
    'set',
    M.impl.control.Location.prototype.set);

goog.exportProperty(
    M.impl.control.Location.prototype,
    'setProperties',
    M.impl.control.Location.prototype.setProperties);

goog.exportProperty(
    M.impl.control.Location.prototype,
    'unset',
    M.impl.control.Location.prototype.unset);

goog.exportProperty(
    M.impl.control.Location.prototype,
    'changed',
    M.impl.control.Location.prototype.changed);

goog.exportProperty(
    M.impl.control.Location.prototype,
    'dispatchEvent',
    M.impl.control.Location.prototype.dispatchEvent);

goog.exportProperty(
    M.impl.control.Location.prototype,
    'getRevision',
    M.impl.control.Location.prototype.getRevision);

goog.exportProperty(
    M.impl.control.Location.prototype,
    'on',
    M.impl.control.Location.prototype.on);

goog.exportProperty(
    M.impl.control.Location.prototype,
    'once',
    M.impl.control.Location.prototype.once);

goog.exportProperty(
    M.impl.control.Location.prototype,
    'un',
    M.impl.control.Location.prototype.un);

goog.exportProperty(
    M.impl.control.Location.prototype,
    'unByKey',
    M.impl.control.Location.prototype.unByKey);

goog.exportProperty(
    M.impl.control.Mouse.prototype,
    'getMap',
    M.impl.control.Mouse.prototype.getMap);

goog.exportProperty(
    M.impl.control.Mouse.prototype,
    'setMap',
    M.impl.control.Mouse.prototype.setMap);

goog.exportProperty(
    M.impl.control.Mouse.prototype,
    'setTarget',
    M.impl.control.Mouse.prototype.setTarget);

goog.exportProperty(
    M.impl.control.Mouse.prototype,
    'get',
    M.impl.control.Mouse.prototype.get);

goog.exportProperty(
    M.impl.control.Mouse.prototype,
    'getKeys',
    M.impl.control.Mouse.prototype.getKeys);

goog.exportProperty(
    M.impl.control.Mouse.prototype,
    'getProperties',
    M.impl.control.Mouse.prototype.getProperties);

goog.exportProperty(
    M.impl.control.Mouse.prototype,
    'set',
    M.impl.control.Mouse.prototype.set);

goog.exportProperty(
    M.impl.control.Mouse.prototype,
    'setProperties',
    M.impl.control.Mouse.prototype.setProperties);

goog.exportProperty(
    M.impl.control.Mouse.prototype,
    'unset',
    M.impl.control.Mouse.prototype.unset);

goog.exportProperty(
    M.impl.control.Mouse.prototype,
    'changed',
    M.impl.control.Mouse.prototype.changed);

goog.exportProperty(
    M.impl.control.Mouse.prototype,
    'dispatchEvent',
    M.impl.control.Mouse.prototype.dispatchEvent);

goog.exportProperty(
    M.impl.control.Mouse.prototype,
    'getRevision',
    M.impl.control.Mouse.prototype.getRevision);

goog.exportProperty(
    M.impl.control.Mouse.prototype,
    'on',
    M.impl.control.Mouse.prototype.on);

goog.exportProperty(
    M.impl.control.Mouse.prototype,
    'once',
    M.impl.control.Mouse.prototype.once);

goog.exportProperty(
    M.impl.control.Mouse.prototype,
    'un',
    M.impl.control.Mouse.prototype.un);

goog.exportProperty(
    M.impl.control.Mouse.prototype,
    'unByKey',
    M.impl.control.Mouse.prototype.unByKey);

goog.exportProperty(
    M.impl.control.Navtoolbar.prototype,
    'getMap',
    M.impl.control.Navtoolbar.prototype.getMap);

goog.exportProperty(
    M.impl.control.Navtoolbar.prototype,
    'setMap',
    M.impl.control.Navtoolbar.prototype.setMap);

goog.exportProperty(
    M.impl.control.Navtoolbar.prototype,
    'setTarget',
    M.impl.control.Navtoolbar.prototype.setTarget);

goog.exportProperty(
    M.impl.control.Navtoolbar.prototype,
    'get',
    M.impl.control.Navtoolbar.prototype.get);

goog.exportProperty(
    M.impl.control.Navtoolbar.prototype,
    'getKeys',
    M.impl.control.Navtoolbar.prototype.getKeys);

goog.exportProperty(
    M.impl.control.Navtoolbar.prototype,
    'getProperties',
    M.impl.control.Navtoolbar.prototype.getProperties);

goog.exportProperty(
    M.impl.control.Navtoolbar.prototype,
    'set',
    M.impl.control.Navtoolbar.prototype.set);

goog.exportProperty(
    M.impl.control.Navtoolbar.prototype,
    'setProperties',
    M.impl.control.Navtoolbar.prototype.setProperties);

goog.exportProperty(
    M.impl.control.Navtoolbar.prototype,
    'unset',
    M.impl.control.Navtoolbar.prototype.unset);

goog.exportProperty(
    M.impl.control.Navtoolbar.prototype,
    'changed',
    M.impl.control.Navtoolbar.prototype.changed);

goog.exportProperty(
    M.impl.control.Navtoolbar.prototype,
    'dispatchEvent',
    M.impl.control.Navtoolbar.prototype.dispatchEvent);

goog.exportProperty(
    M.impl.control.Navtoolbar.prototype,
    'getRevision',
    M.impl.control.Navtoolbar.prototype.getRevision);

goog.exportProperty(
    M.impl.control.Navtoolbar.prototype,
    'on',
    M.impl.control.Navtoolbar.prototype.on);

goog.exportProperty(
    M.impl.control.Navtoolbar.prototype,
    'once',
    M.impl.control.Navtoolbar.prototype.once);

goog.exportProperty(
    M.impl.control.Navtoolbar.prototype,
    'un',
    M.impl.control.Navtoolbar.prototype.un);

goog.exportProperty(
    M.impl.control.Navtoolbar.prototype,
    'unByKey',
    M.impl.control.Navtoolbar.prototype.unByKey);

goog.exportProperty(
    M.impl.control.OverviewMap.prototype,
    'getMap',
    M.impl.control.OverviewMap.prototype.getMap);

goog.exportProperty(
    M.impl.control.OverviewMap.prototype,
    'setMap',
    M.impl.control.OverviewMap.prototype.setMap);

goog.exportProperty(
    M.impl.control.OverviewMap.prototype,
    'setTarget',
    M.impl.control.OverviewMap.prototype.setTarget);

goog.exportProperty(
    M.impl.control.OverviewMap.prototype,
    'get',
    M.impl.control.OverviewMap.prototype.get);

goog.exportProperty(
    M.impl.control.OverviewMap.prototype,
    'getKeys',
    M.impl.control.OverviewMap.prototype.getKeys);

goog.exportProperty(
    M.impl.control.OverviewMap.prototype,
    'getProperties',
    M.impl.control.OverviewMap.prototype.getProperties);

goog.exportProperty(
    M.impl.control.OverviewMap.prototype,
    'set',
    M.impl.control.OverviewMap.prototype.set);

goog.exportProperty(
    M.impl.control.OverviewMap.prototype,
    'setProperties',
    M.impl.control.OverviewMap.prototype.setProperties);

goog.exportProperty(
    M.impl.control.OverviewMap.prototype,
    'unset',
    M.impl.control.OverviewMap.prototype.unset);

goog.exportProperty(
    M.impl.control.OverviewMap.prototype,
    'changed',
    M.impl.control.OverviewMap.prototype.changed);

goog.exportProperty(
    M.impl.control.OverviewMap.prototype,
    'dispatchEvent',
    M.impl.control.OverviewMap.prototype.dispatchEvent);

goog.exportProperty(
    M.impl.control.OverviewMap.prototype,
    'getRevision',
    M.impl.control.OverviewMap.prototype.getRevision);

goog.exportProperty(
    M.impl.control.OverviewMap.prototype,
    'on',
    M.impl.control.OverviewMap.prototype.on);

goog.exportProperty(
    M.impl.control.OverviewMap.prototype,
    'once',
    M.impl.control.OverviewMap.prototype.once);

goog.exportProperty(
    M.impl.control.OverviewMap.prototype,
    'un',
    M.impl.control.OverviewMap.prototype.un);

goog.exportProperty(
    M.impl.control.OverviewMap.prototype,
    'unByKey',
    M.impl.control.OverviewMap.prototype.unByKey);

goog.exportProperty(
    M.impl.control.Panzoom.prototype,
    'getMap',
    M.impl.control.Panzoom.prototype.getMap);

goog.exportProperty(
    M.impl.control.Panzoom.prototype,
    'setMap',
    M.impl.control.Panzoom.prototype.setMap);

goog.exportProperty(
    M.impl.control.Panzoom.prototype,
    'setTarget',
    M.impl.control.Panzoom.prototype.setTarget);

goog.exportProperty(
    M.impl.control.Panzoom.prototype,
    'get',
    M.impl.control.Panzoom.prototype.get);

goog.exportProperty(
    M.impl.control.Panzoom.prototype,
    'getKeys',
    M.impl.control.Panzoom.prototype.getKeys);

goog.exportProperty(
    M.impl.control.Panzoom.prototype,
    'getProperties',
    M.impl.control.Panzoom.prototype.getProperties);

goog.exportProperty(
    M.impl.control.Panzoom.prototype,
    'set',
    M.impl.control.Panzoom.prototype.set);

goog.exportProperty(
    M.impl.control.Panzoom.prototype,
    'setProperties',
    M.impl.control.Panzoom.prototype.setProperties);

goog.exportProperty(
    M.impl.control.Panzoom.prototype,
    'unset',
    M.impl.control.Panzoom.prototype.unset);

goog.exportProperty(
    M.impl.control.Panzoom.prototype,
    'changed',
    M.impl.control.Panzoom.prototype.changed);

goog.exportProperty(
    M.impl.control.Panzoom.prototype,
    'dispatchEvent',
    M.impl.control.Panzoom.prototype.dispatchEvent);

goog.exportProperty(
    M.impl.control.Panzoom.prototype,
    'getRevision',
    M.impl.control.Panzoom.prototype.getRevision);

goog.exportProperty(
    M.impl.control.Panzoom.prototype,
    'on',
    M.impl.control.Panzoom.prototype.on);

goog.exportProperty(
    M.impl.control.Panzoom.prototype,
    'once',
    M.impl.control.Panzoom.prototype.once);

goog.exportProperty(
    M.impl.control.Panzoom.prototype,
    'un',
    M.impl.control.Panzoom.prototype.un);

goog.exportProperty(
    M.impl.control.Panzoom.prototype,
    'unByKey',
    M.impl.control.Panzoom.prototype.unByKey);

goog.exportProperty(
    M.impl.control.Panzoombar.prototype,
    'getMap',
    M.impl.control.Panzoombar.prototype.getMap);

goog.exportProperty(
    M.impl.control.Panzoombar.prototype,
    'setMap',
    M.impl.control.Panzoombar.prototype.setMap);

goog.exportProperty(
    M.impl.control.Panzoombar.prototype,
    'setTarget',
    M.impl.control.Panzoombar.prototype.setTarget);

goog.exportProperty(
    M.impl.control.Panzoombar.prototype,
    'get',
    M.impl.control.Panzoombar.prototype.get);

goog.exportProperty(
    M.impl.control.Panzoombar.prototype,
    'getKeys',
    M.impl.control.Panzoombar.prototype.getKeys);

goog.exportProperty(
    M.impl.control.Panzoombar.prototype,
    'getProperties',
    M.impl.control.Panzoombar.prototype.getProperties);

goog.exportProperty(
    M.impl.control.Panzoombar.prototype,
    'set',
    M.impl.control.Panzoombar.prototype.set);

goog.exportProperty(
    M.impl.control.Panzoombar.prototype,
    'setProperties',
    M.impl.control.Panzoombar.prototype.setProperties);

goog.exportProperty(
    M.impl.control.Panzoombar.prototype,
    'unset',
    M.impl.control.Panzoombar.prototype.unset);

goog.exportProperty(
    M.impl.control.Panzoombar.prototype,
    'changed',
    M.impl.control.Panzoombar.prototype.changed);

goog.exportProperty(
    M.impl.control.Panzoombar.prototype,
    'dispatchEvent',
    M.impl.control.Panzoombar.prototype.dispatchEvent);

goog.exportProperty(
    M.impl.control.Panzoombar.prototype,
    'getRevision',
    M.impl.control.Panzoombar.prototype.getRevision);

goog.exportProperty(
    M.impl.control.Panzoombar.prototype,
    'on',
    M.impl.control.Panzoombar.prototype.on);

goog.exportProperty(
    M.impl.control.Panzoombar.prototype,
    'once',
    M.impl.control.Panzoombar.prototype.once);

goog.exportProperty(
    M.impl.control.Panzoombar.prototype,
    'un',
    M.impl.control.Panzoombar.prototype.un);

goog.exportProperty(
    M.impl.control.Panzoombar.prototype,
    'unByKey',
    M.impl.control.Panzoombar.prototype.unByKey);

goog.exportProperty(
    M.impl.control.Scale.prototype,
    'getMap',
    M.impl.control.Scale.prototype.getMap);

goog.exportProperty(
    M.impl.control.Scale.prototype,
    'setMap',
    M.impl.control.Scale.prototype.setMap);

goog.exportProperty(
    M.impl.control.Scale.prototype,
    'setTarget',
    M.impl.control.Scale.prototype.setTarget);

goog.exportProperty(
    M.impl.control.Scale.prototype,
    'get',
    M.impl.control.Scale.prototype.get);

goog.exportProperty(
    M.impl.control.Scale.prototype,
    'getKeys',
    M.impl.control.Scale.prototype.getKeys);

goog.exportProperty(
    M.impl.control.Scale.prototype,
    'getProperties',
    M.impl.control.Scale.prototype.getProperties);

goog.exportProperty(
    M.impl.control.Scale.prototype,
    'set',
    M.impl.control.Scale.prototype.set);

goog.exportProperty(
    M.impl.control.Scale.prototype,
    'setProperties',
    M.impl.control.Scale.prototype.setProperties);

goog.exportProperty(
    M.impl.control.Scale.prototype,
    'unset',
    M.impl.control.Scale.prototype.unset);

goog.exportProperty(
    M.impl.control.Scale.prototype,
    'changed',
    M.impl.control.Scale.prototype.changed);

goog.exportProperty(
    M.impl.control.Scale.prototype,
    'dispatchEvent',
    M.impl.control.Scale.prototype.dispatchEvent);

goog.exportProperty(
    M.impl.control.Scale.prototype,
    'getRevision',
    M.impl.control.Scale.prototype.getRevision);

goog.exportProperty(
    M.impl.control.Scale.prototype,
    'on',
    M.impl.control.Scale.prototype.on);

goog.exportProperty(
    M.impl.control.Scale.prototype,
    'once',
    M.impl.control.Scale.prototype.once);

goog.exportProperty(
    M.impl.control.Scale.prototype,
    'un',
    M.impl.control.Scale.prototype.un);

goog.exportProperty(
    M.impl.control.Scale.prototype,
    'unByKey',
    M.impl.control.Scale.prototype.unByKey);

goog.exportProperty(
    M.impl.control.ScaleLine.prototype,
    'getMap',
    M.impl.control.ScaleLine.prototype.getMap);

goog.exportProperty(
    M.impl.control.ScaleLine.prototype,
    'setMap',
    M.impl.control.ScaleLine.prototype.setMap);

goog.exportProperty(
    M.impl.control.ScaleLine.prototype,
    'setTarget',
    M.impl.control.ScaleLine.prototype.setTarget);

goog.exportProperty(
    M.impl.control.ScaleLine.prototype,
    'get',
    M.impl.control.ScaleLine.prototype.get);

goog.exportProperty(
    M.impl.control.ScaleLine.prototype,
    'getKeys',
    M.impl.control.ScaleLine.prototype.getKeys);

goog.exportProperty(
    M.impl.control.ScaleLine.prototype,
    'getProperties',
    M.impl.control.ScaleLine.prototype.getProperties);

goog.exportProperty(
    M.impl.control.ScaleLine.prototype,
    'set',
    M.impl.control.ScaleLine.prototype.set);

goog.exportProperty(
    M.impl.control.ScaleLine.prototype,
    'setProperties',
    M.impl.control.ScaleLine.prototype.setProperties);

goog.exportProperty(
    M.impl.control.ScaleLine.prototype,
    'unset',
    M.impl.control.ScaleLine.prototype.unset);

goog.exportProperty(
    M.impl.control.ScaleLine.prototype,
    'changed',
    M.impl.control.ScaleLine.prototype.changed);

goog.exportProperty(
    M.impl.control.ScaleLine.prototype,
    'dispatchEvent',
    M.impl.control.ScaleLine.prototype.dispatchEvent);

goog.exportProperty(
    M.impl.control.ScaleLine.prototype,
    'getRevision',
    M.impl.control.ScaleLine.prototype.getRevision);

goog.exportProperty(
    M.impl.control.ScaleLine.prototype,
    'on',
    M.impl.control.ScaleLine.prototype.on);

goog.exportProperty(
    M.impl.control.ScaleLine.prototype,
    'once',
    M.impl.control.ScaleLine.prototype.once);

goog.exportProperty(
    M.impl.control.ScaleLine.prototype,
    'un',
    M.impl.control.ScaleLine.prototype.un);

goog.exportProperty(
    M.impl.control.ScaleLine.prototype,
    'unByKey',
    M.impl.control.ScaleLine.prototype.unByKey);

goog.exportProperty(
    M.impl.control.WMCSelector.prototype,
    'getMap',
    M.impl.control.WMCSelector.prototype.getMap);

goog.exportProperty(
    M.impl.control.WMCSelector.prototype,
    'setMap',
    M.impl.control.WMCSelector.prototype.setMap);

goog.exportProperty(
    M.impl.control.WMCSelector.prototype,
    'setTarget',
    M.impl.control.WMCSelector.prototype.setTarget);

goog.exportProperty(
    M.impl.control.WMCSelector.prototype,
    'get',
    M.impl.control.WMCSelector.prototype.get);

goog.exportProperty(
    M.impl.control.WMCSelector.prototype,
    'getKeys',
    M.impl.control.WMCSelector.prototype.getKeys);

goog.exportProperty(
    M.impl.control.WMCSelector.prototype,
    'getProperties',
    M.impl.control.WMCSelector.prototype.getProperties);

goog.exportProperty(
    M.impl.control.WMCSelector.prototype,
    'set',
    M.impl.control.WMCSelector.prototype.set);

goog.exportProperty(
    M.impl.control.WMCSelector.prototype,
    'setProperties',
    M.impl.control.WMCSelector.prototype.setProperties);

goog.exportProperty(
    M.impl.control.WMCSelector.prototype,
    'unset',
    M.impl.control.WMCSelector.prototype.unset);

goog.exportProperty(
    M.impl.control.WMCSelector.prototype,
    'changed',
    M.impl.control.WMCSelector.prototype.changed);

goog.exportProperty(
    M.impl.control.WMCSelector.prototype,
    'dispatchEvent',
    M.impl.control.WMCSelector.prototype.dispatchEvent);

goog.exportProperty(
    M.impl.control.WMCSelector.prototype,
    'getRevision',
    M.impl.control.WMCSelector.prototype.getRevision);

goog.exportProperty(
    M.impl.control.WMCSelector.prototype,
    'on',
    M.impl.control.WMCSelector.prototype.on);

goog.exportProperty(
    M.impl.control.WMCSelector.prototype,
    'once',
    M.impl.control.WMCSelector.prototype.once);

goog.exportProperty(
    M.impl.control.WMCSelector.prototype,
    'un',
    M.impl.control.WMCSelector.prototype.un);

goog.exportProperty(
    M.impl.control.WMCSelector.prototype,
    'unByKey',
    M.impl.control.WMCSelector.prototype.unByKey);

goog.exportProperty(
    ol.renderer.canvas.Layer.prototype,
    'changed',
    ol.renderer.canvas.Layer.prototype.changed);

goog.exportProperty(
    ol.renderer.canvas.Layer.prototype,
    'dispatchEvent',
    ol.renderer.canvas.Layer.prototype.dispatchEvent);

goog.exportProperty(
    ol.renderer.canvas.Layer.prototype,
    'getRevision',
    ol.renderer.canvas.Layer.prototype.getRevision);

goog.exportProperty(
    ol.renderer.canvas.Layer.prototype,
    'on',
    ol.renderer.canvas.Layer.prototype.on);

goog.exportProperty(
    ol.renderer.canvas.Layer.prototype,
    'once',
    ol.renderer.canvas.Layer.prototype.once);

goog.exportProperty(
    ol.renderer.canvas.Layer.prototype,
    'un',
    ol.renderer.canvas.Layer.prototype.un);

goog.exportProperty(
    ol.renderer.canvas.Layer.prototype,
    'unByKey',
    ol.renderer.canvas.Layer.prototype.unByKey);

goog.exportProperty(
    ol.renderer.canvas.ImageLayer.prototype,
    'changed',
    ol.renderer.canvas.ImageLayer.prototype.changed);

goog.exportProperty(
    ol.renderer.canvas.ImageLayer.prototype,
    'dispatchEvent',
    ol.renderer.canvas.ImageLayer.prototype.dispatchEvent);

goog.exportProperty(
    ol.renderer.canvas.ImageLayer.prototype,
    'getRevision',
    ol.renderer.canvas.ImageLayer.prototype.getRevision);

goog.exportProperty(
    ol.renderer.canvas.ImageLayer.prototype,
    'on',
    ol.renderer.canvas.ImageLayer.prototype.on);

goog.exportProperty(
    ol.renderer.canvas.ImageLayer.prototype,
    'once',
    ol.renderer.canvas.ImageLayer.prototype.once);

goog.exportProperty(
    ol.renderer.canvas.ImageLayer.prototype,
    'un',
    ol.renderer.canvas.ImageLayer.prototype.un);

goog.exportProperty(
    ol.renderer.canvas.ImageLayer.prototype,
    'unByKey',
    ol.renderer.canvas.ImageLayer.prototype.unByKey);

goog.exportProperty(
    ol.renderer.canvas.TileLayer.prototype,
    'changed',
    ol.renderer.canvas.TileLayer.prototype.changed);

goog.exportProperty(
    ol.renderer.canvas.TileLayer.prototype,
    'dispatchEvent',
    ol.renderer.canvas.TileLayer.prototype.dispatchEvent);

goog.exportProperty(
    ol.renderer.canvas.TileLayer.prototype,
    'getRevision',
    ol.renderer.canvas.TileLayer.prototype.getRevision);

goog.exportProperty(
    ol.renderer.canvas.TileLayer.prototype,
    'on',
    ol.renderer.canvas.TileLayer.prototype.on);

goog.exportProperty(
    ol.renderer.canvas.TileLayer.prototype,
    'once',
    ol.renderer.canvas.TileLayer.prototype.once);

goog.exportProperty(
    ol.renderer.canvas.TileLayer.prototype,
    'un',
    ol.renderer.canvas.TileLayer.prototype.un);

goog.exportProperty(
    ol.renderer.canvas.TileLayer.prototype,
    'unByKey',
    ol.renderer.canvas.TileLayer.prototype.unByKey);

goog.exportProperty(
    ol.renderer.canvas.VectorLayer.prototype,
    'changed',
    ol.renderer.canvas.VectorLayer.prototype.changed);

goog.exportProperty(
    ol.renderer.canvas.VectorLayer.prototype,
    'dispatchEvent',
    ol.renderer.canvas.VectorLayer.prototype.dispatchEvent);

goog.exportProperty(
    ol.renderer.canvas.VectorLayer.prototype,
    'getRevision',
    ol.renderer.canvas.VectorLayer.prototype.getRevision);

goog.exportProperty(
    ol.renderer.canvas.VectorLayer.prototype,
    'on',
    ol.renderer.canvas.VectorLayer.prototype.on);

goog.exportProperty(
    ol.renderer.canvas.VectorLayer.prototype,
    'once',
    ol.renderer.canvas.VectorLayer.prototype.once);

goog.exportProperty(
    ol.renderer.canvas.VectorLayer.prototype,
    'un',
    ol.renderer.canvas.VectorLayer.prototype.un);

goog.exportProperty(
    ol.renderer.canvas.VectorLayer.prototype,
    'unByKey',
    ol.renderer.canvas.VectorLayer.prototype.unByKey);

goog.exportProperty(
    ol.renderer.canvas.VectorTileLayer.prototype,
    'changed',
    ol.renderer.canvas.VectorTileLayer.prototype.changed);

goog.exportProperty(
    ol.renderer.canvas.VectorTileLayer.prototype,
    'dispatchEvent',
    ol.renderer.canvas.VectorTileLayer.prototype.dispatchEvent);

goog.exportProperty(
    ol.renderer.canvas.VectorTileLayer.prototype,
    'getRevision',
    ol.renderer.canvas.VectorTileLayer.prototype.getRevision);

goog.exportProperty(
    ol.renderer.canvas.VectorTileLayer.prototype,
    'on',
    ol.renderer.canvas.VectorTileLayer.prototype.on);

goog.exportProperty(
    ol.renderer.canvas.VectorTileLayer.prototype,
    'once',
    ol.renderer.canvas.VectorTileLayer.prototype.once);

goog.exportProperty(
    ol.renderer.canvas.VectorTileLayer.prototype,
    'un',
    ol.renderer.canvas.VectorTileLayer.prototype.un);

goog.exportProperty(
    ol.renderer.canvas.VectorTileLayer.prototype,
    'unByKey',
    ol.renderer.canvas.VectorTileLayer.prototype.unByKey);

goog.exportProperty(
    ol.layer.Base.prototype,
    'get',
    ol.layer.Base.prototype.get);

goog.exportProperty(
    ol.layer.Base.prototype,
    'getKeys',
    ol.layer.Base.prototype.getKeys);

goog.exportProperty(
    ol.layer.Base.prototype,
    'getProperties',
    ol.layer.Base.prototype.getProperties);

goog.exportProperty(
    ol.layer.Base.prototype,
    'set',
    ol.layer.Base.prototype.set);

goog.exportProperty(
    ol.layer.Base.prototype,
    'setProperties',
    ol.layer.Base.prototype.setProperties);

goog.exportProperty(
    ol.layer.Base.prototype,
    'unset',
    ol.layer.Base.prototype.unset);

goog.exportProperty(
    ol.layer.Base.prototype,
    'changed',
    ol.layer.Base.prototype.changed);

goog.exportProperty(
    ol.layer.Base.prototype,
    'dispatchEvent',
    ol.layer.Base.prototype.dispatchEvent);

goog.exportProperty(
    ol.layer.Base.prototype,
    'getRevision',
    ol.layer.Base.prototype.getRevision);

goog.exportProperty(
    ol.layer.Base.prototype,
    'on',
    ol.layer.Base.prototype.on);

goog.exportProperty(
    ol.layer.Base.prototype,
    'once',
    ol.layer.Base.prototype.once);

goog.exportProperty(
    ol.layer.Base.prototype,
    'un',
    ol.layer.Base.prototype.un);

goog.exportProperty(
    ol.layer.Base.prototype,
    'unByKey',
    ol.layer.Base.prototype.unByKey);

goog.exportProperty(
    ol.layer.Layer.prototype,
    'getExtent',
    ol.layer.Layer.prototype.getExtent);

goog.exportProperty(
    ol.layer.Layer.prototype,
    'getMaxResolution',
    ol.layer.Layer.prototype.getMaxResolution);

goog.exportProperty(
    ol.layer.Layer.prototype,
    'getMinResolution',
    ol.layer.Layer.prototype.getMinResolution);

goog.exportProperty(
    ol.layer.Layer.prototype,
    'getOpacity',
    ol.layer.Layer.prototype.getOpacity);

goog.exportProperty(
    ol.layer.Layer.prototype,
    'getVisible',
    ol.layer.Layer.prototype.getVisible);

goog.exportProperty(
    ol.layer.Layer.prototype,
    'getZIndex',
    ol.layer.Layer.prototype.getZIndex);

goog.exportProperty(
    ol.layer.Layer.prototype,
    'setExtent',
    ol.layer.Layer.prototype.setExtent);

goog.exportProperty(
    ol.layer.Layer.prototype,
    'setMaxResolution',
    ol.layer.Layer.prototype.setMaxResolution);

goog.exportProperty(
    ol.layer.Layer.prototype,
    'setMinResolution',
    ol.layer.Layer.prototype.setMinResolution);

goog.exportProperty(
    ol.layer.Layer.prototype,
    'setOpacity',
    ol.layer.Layer.prototype.setOpacity);

goog.exportProperty(
    ol.layer.Layer.prototype,
    'setVisible',
    ol.layer.Layer.prototype.setVisible);

goog.exportProperty(
    ol.layer.Layer.prototype,
    'setZIndex',
    ol.layer.Layer.prototype.setZIndex);

goog.exportProperty(
    ol.layer.Layer.prototype,
    'get',
    ol.layer.Layer.prototype.get);

goog.exportProperty(
    ol.layer.Layer.prototype,
    'getKeys',
    ol.layer.Layer.prototype.getKeys);

goog.exportProperty(
    ol.layer.Layer.prototype,
    'getProperties',
    ol.layer.Layer.prototype.getProperties);

goog.exportProperty(
    ol.layer.Layer.prototype,
    'set',
    ol.layer.Layer.prototype.set);

goog.exportProperty(
    ol.layer.Layer.prototype,
    'setProperties',
    ol.layer.Layer.prototype.setProperties);

goog.exportProperty(
    ol.layer.Layer.prototype,
    'unset',
    ol.layer.Layer.prototype.unset);

goog.exportProperty(
    ol.layer.Layer.prototype,
    'changed',
    ol.layer.Layer.prototype.changed);

goog.exportProperty(
    ol.layer.Layer.prototype,
    'dispatchEvent',
    ol.layer.Layer.prototype.dispatchEvent);

goog.exportProperty(
    ol.layer.Layer.prototype,
    'getRevision',
    ol.layer.Layer.prototype.getRevision);

goog.exportProperty(
    ol.layer.Layer.prototype,
    'on',
    ol.layer.Layer.prototype.on);

goog.exportProperty(
    ol.layer.Layer.prototype,
    'once',
    ol.layer.Layer.prototype.once);

goog.exportProperty(
    ol.layer.Layer.prototype,
    'un',
    ol.layer.Layer.prototype.un);

goog.exportProperty(
    ol.layer.Layer.prototype,
    'unByKey',
    ol.layer.Layer.prototype.unByKey);

goog.exportProperty(
    ol.layer.Vector.prototype,
    'setMap',
    ol.layer.Vector.prototype.setMap);

goog.exportProperty(
    ol.layer.Vector.prototype,
    'setSource',
    ol.layer.Vector.prototype.setSource);

goog.exportProperty(
    ol.layer.Vector.prototype,
    'getExtent',
    ol.layer.Vector.prototype.getExtent);

goog.exportProperty(
    ol.layer.Vector.prototype,
    'getMaxResolution',
    ol.layer.Vector.prototype.getMaxResolution);

goog.exportProperty(
    ol.layer.Vector.prototype,
    'getMinResolution',
    ol.layer.Vector.prototype.getMinResolution);

goog.exportProperty(
    ol.layer.Vector.prototype,
    'getOpacity',
    ol.layer.Vector.prototype.getOpacity);

goog.exportProperty(
    ol.layer.Vector.prototype,
    'getVisible',
    ol.layer.Vector.prototype.getVisible);

goog.exportProperty(
    ol.layer.Vector.prototype,
    'getZIndex',
    ol.layer.Vector.prototype.getZIndex);

goog.exportProperty(
    ol.layer.Vector.prototype,
    'setExtent',
    ol.layer.Vector.prototype.setExtent);

goog.exportProperty(
    ol.layer.Vector.prototype,
    'setMaxResolution',
    ol.layer.Vector.prototype.setMaxResolution);

goog.exportProperty(
    ol.layer.Vector.prototype,
    'setMinResolution',
    ol.layer.Vector.prototype.setMinResolution);

goog.exportProperty(
    ol.layer.Vector.prototype,
    'setOpacity',
    ol.layer.Vector.prototype.setOpacity);

goog.exportProperty(
    ol.layer.Vector.prototype,
    'setVisible',
    ol.layer.Vector.prototype.setVisible);

goog.exportProperty(
    ol.layer.Vector.prototype,
    'setZIndex',
    ol.layer.Vector.prototype.setZIndex);

goog.exportProperty(
    ol.layer.Vector.prototype,
    'get',
    ol.layer.Vector.prototype.get);

goog.exportProperty(
    ol.layer.Vector.prototype,
    'getKeys',
    ol.layer.Vector.prototype.getKeys);

goog.exportProperty(
    ol.layer.Vector.prototype,
    'getProperties',
    ol.layer.Vector.prototype.getProperties);

goog.exportProperty(
    ol.layer.Vector.prototype,
    'set',
    ol.layer.Vector.prototype.set);

goog.exportProperty(
    ol.layer.Vector.prototype,
    'setProperties',
    ol.layer.Vector.prototype.setProperties);

goog.exportProperty(
    ol.layer.Vector.prototype,
    'unset',
    ol.layer.Vector.prototype.unset);

goog.exportProperty(
    ol.layer.Vector.prototype,
    'changed',
    ol.layer.Vector.prototype.changed);

goog.exportProperty(
    ol.layer.Vector.prototype,
    'dispatchEvent',
    ol.layer.Vector.prototype.dispatchEvent);

goog.exportProperty(
    ol.layer.Vector.prototype,
    'getRevision',
    ol.layer.Vector.prototype.getRevision);

goog.exportProperty(
    ol.layer.Vector.prototype,
    'on',
    ol.layer.Vector.prototype.on);

goog.exportProperty(
    ol.layer.Vector.prototype,
    'once',
    ol.layer.Vector.prototype.once);

goog.exportProperty(
    ol.layer.Vector.prototype,
    'un',
    ol.layer.Vector.prototype.un);

goog.exportProperty(
    ol.layer.Vector.prototype,
    'unByKey',
    ol.layer.Vector.prototype.unByKey);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'getSource',
    ol.layer.Heatmap.prototype.getSource);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'getStyle',
    ol.layer.Heatmap.prototype.getStyle);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'getStyleFunction',
    ol.layer.Heatmap.prototype.getStyleFunction);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'setStyle',
    ol.layer.Heatmap.prototype.setStyle);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'setMap',
    ol.layer.Heatmap.prototype.setMap);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'setSource',
    ol.layer.Heatmap.prototype.setSource);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'getExtent',
    ol.layer.Heatmap.prototype.getExtent);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'getMaxResolution',
    ol.layer.Heatmap.prototype.getMaxResolution);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'getMinResolution',
    ol.layer.Heatmap.prototype.getMinResolution);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'getOpacity',
    ol.layer.Heatmap.prototype.getOpacity);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'getVisible',
    ol.layer.Heatmap.prototype.getVisible);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'getZIndex',
    ol.layer.Heatmap.prototype.getZIndex);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'setExtent',
    ol.layer.Heatmap.prototype.setExtent);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'setMaxResolution',
    ol.layer.Heatmap.prototype.setMaxResolution);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'setMinResolution',
    ol.layer.Heatmap.prototype.setMinResolution);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'setOpacity',
    ol.layer.Heatmap.prototype.setOpacity);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'setVisible',
    ol.layer.Heatmap.prototype.setVisible);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'setZIndex',
    ol.layer.Heatmap.prototype.setZIndex);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'get',
    ol.layer.Heatmap.prototype.get);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'getKeys',
    ol.layer.Heatmap.prototype.getKeys);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'getProperties',
    ol.layer.Heatmap.prototype.getProperties);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'set',
    ol.layer.Heatmap.prototype.set);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'setProperties',
    ol.layer.Heatmap.prototype.setProperties);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'unset',
    ol.layer.Heatmap.prototype.unset);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'changed',
    ol.layer.Heatmap.prototype.changed);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'dispatchEvent',
    ol.layer.Heatmap.prototype.dispatchEvent);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'getRevision',
    ol.layer.Heatmap.prototype.getRevision);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'on',
    ol.layer.Heatmap.prototype.on);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'once',
    ol.layer.Heatmap.prototype.once);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'un',
    ol.layer.Heatmap.prototype.un);

goog.exportProperty(
    ol.layer.Heatmap.prototype,
    'unByKey',
    ol.layer.Heatmap.prototype.unByKey);

goog.exportProperty(
    ol.layer.Image.prototype,
    'setMap',
    ol.layer.Image.prototype.setMap);

goog.exportProperty(
    ol.layer.Image.prototype,
    'setSource',
    ol.layer.Image.prototype.setSource);

goog.exportProperty(
    ol.layer.Image.prototype,
    'getExtent',
    ol.layer.Image.prototype.getExtent);

goog.exportProperty(
    ol.layer.Image.prototype,
    'getMaxResolution',
    ol.layer.Image.prototype.getMaxResolution);

goog.exportProperty(
    ol.layer.Image.prototype,
    'getMinResolution',
    ol.layer.Image.prototype.getMinResolution);

goog.exportProperty(
    ol.layer.Image.prototype,
    'getOpacity',
    ol.layer.Image.prototype.getOpacity);

goog.exportProperty(
    ol.layer.Image.prototype,
    'getVisible',
    ol.layer.Image.prototype.getVisible);

goog.exportProperty(
    ol.layer.Image.prototype,
    'getZIndex',
    ol.layer.Image.prototype.getZIndex);

goog.exportProperty(
    ol.layer.Image.prototype,
    'setExtent',
    ol.layer.Image.prototype.setExtent);

goog.exportProperty(
    ol.layer.Image.prototype,
    'setMaxResolution',
    ol.layer.Image.prototype.setMaxResolution);

goog.exportProperty(
    ol.layer.Image.prototype,
    'setMinResolution',
    ol.layer.Image.prototype.setMinResolution);

goog.exportProperty(
    ol.layer.Image.prototype,
    'setOpacity',
    ol.layer.Image.prototype.setOpacity);

goog.exportProperty(
    ol.layer.Image.prototype,
    'setVisible',
    ol.layer.Image.prototype.setVisible);

goog.exportProperty(
    ol.layer.Image.prototype,
    'setZIndex',
    ol.layer.Image.prototype.setZIndex);

goog.exportProperty(
    ol.layer.Image.prototype,
    'get',
    ol.layer.Image.prototype.get);

goog.exportProperty(
    ol.layer.Image.prototype,
    'getKeys',
    ol.layer.Image.prototype.getKeys);

goog.exportProperty(
    ol.layer.Image.prototype,
    'getProperties',
    ol.layer.Image.prototype.getProperties);

goog.exportProperty(
    ol.layer.Image.prototype,
    'set',
    ol.layer.Image.prototype.set);

goog.exportProperty(
    ol.layer.Image.prototype,
    'setProperties',
    ol.layer.Image.prototype.setProperties);

goog.exportProperty(
    ol.layer.Image.prototype,
    'unset',
    ol.layer.Image.prototype.unset);

goog.exportProperty(
    ol.layer.Image.prototype,
    'changed',
    ol.layer.Image.prototype.changed);

goog.exportProperty(
    ol.layer.Image.prototype,
    'dispatchEvent',
    ol.layer.Image.prototype.dispatchEvent);

goog.exportProperty(
    ol.layer.Image.prototype,
    'getRevision',
    ol.layer.Image.prototype.getRevision);

goog.exportProperty(
    ol.layer.Image.prototype,
    'on',
    ol.layer.Image.prototype.on);

goog.exportProperty(
    ol.layer.Image.prototype,
    'once',
    ol.layer.Image.prototype.once);

goog.exportProperty(
    ol.layer.Image.prototype,
    'un',
    ol.layer.Image.prototype.un);

goog.exportProperty(
    ol.layer.Image.prototype,
    'unByKey',
    ol.layer.Image.prototype.unByKey);

goog.exportProperty(
    ol.layer.Group.prototype,
    'getExtent',
    ol.layer.Group.prototype.getExtent);

goog.exportProperty(
    ol.layer.Group.prototype,
    'getMaxResolution',
    ol.layer.Group.prototype.getMaxResolution);

goog.exportProperty(
    ol.layer.Group.prototype,
    'getMinResolution',
    ol.layer.Group.prototype.getMinResolution);

goog.exportProperty(
    ol.layer.Group.prototype,
    'getOpacity',
    ol.layer.Group.prototype.getOpacity);

goog.exportProperty(
    ol.layer.Group.prototype,
    'getVisible',
    ol.layer.Group.prototype.getVisible);

goog.exportProperty(
    ol.layer.Group.prototype,
    'getZIndex',
    ol.layer.Group.prototype.getZIndex);

goog.exportProperty(
    ol.layer.Group.prototype,
    'setExtent',
    ol.layer.Group.prototype.setExtent);

goog.exportProperty(
    ol.layer.Group.prototype,
    'setMaxResolution',
    ol.layer.Group.prototype.setMaxResolution);

goog.exportProperty(
    ol.layer.Group.prototype,
    'setMinResolution',
    ol.layer.Group.prototype.setMinResolution);

goog.exportProperty(
    ol.layer.Group.prototype,
    'setOpacity',
    ol.layer.Group.prototype.setOpacity);

goog.exportProperty(
    ol.layer.Group.prototype,
    'setVisible',
    ol.layer.Group.prototype.setVisible);

goog.exportProperty(
    ol.layer.Group.prototype,
    'setZIndex',
    ol.layer.Group.prototype.setZIndex);

goog.exportProperty(
    ol.layer.Group.prototype,
    'get',
    ol.layer.Group.prototype.get);

goog.exportProperty(
    ol.layer.Group.prototype,
    'getKeys',
    ol.layer.Group.prototype.getKeys);

goog.exportProperty(
    ol.layer.Group.prototype,
    'getProperties',
    ol.layer.Group.prototype.getProperties);

goog.exportProperty(
    ol.layer.Group.prototype,
    'set',
    ol.layer.Group.prototype.set);

goog.exportProperty(
    ol.layer.Group.prototype,
    'setProperties',
    ol.layer.Group.prototype.setProperties);

goog.exportProperty(
    ol.layer.Group.prototype,
    'unset',
    ol.layer.Group.prototype.unset);

goog.exportProperty(
    ol.layer.Group.prototype,
    'changed',
    ol.layer.Group.prototype.changed);

goog.exportProperty(
    ol.layer.Group.prototype,
    'dispatchEvent',
    ol.layer.Group.prototype.dispatchEvent);

goog.exportProperty(
    ol.layer.Group.prototype,
    'getRevision',
    ol.layer.Group.prototype.getRevision);

goog.exportProperty(
    ol.layer.Group.prototype,
    'on',
    ol.layer.Group.prototype.on);

goog.exportProperty(
    ol.layer.Group.prototype,
    'once',
    ol.layer.Group.prototype.once);

goog.exportProperty(
    ol.layer.Group.prototype,
    'un',
    ol.layer.Group.prototype.un);

goog.exportProperty(
    ol.layer.Group.prototype,
    'unByKey',
    ol.layer.Group.prototype.unByKey);

goog.exportProperty(
    ol.layer.Tile.prototype,
    'setMap',
    ol.layer.Tile.prototype.setMap);

goog.exportProperty(
    ol.layer.Tile.prototype,
    'setSource',
    ol.layer.Tile.prototype.setSource);

goog.exportProperty(
    ol.layer.Tile.prototype,
    'getExtent',
    ol.layer.Tile.prototype.getExtent);

goog.exportProperty(
    ol.layer.Tile.prototype,
    'getMaxResolution',
    ol.layer.Tile.prototype.getMaxResolution);

goog.exportProperty(
    ol.layer.Tile.prototype,
    'getMinResolution',
    ol.layer.Tile.prototype.getMinResolution);

goog.exportProperty(
    ol.layer.Tile.prototype,
    'getOpacity',
    ol.layer.Tile.prototype.getOpacity);

goog.exportProperty(
    ol.layer.Tile.prototype,
    'getVisible',
    ol.layer.Tile.prototype.getVisible);

goog.exportProperty(
    ol.layer.Tile.prototype,
    'getZIndex',
    ol.layer.Tile.prototype.getZIndex);

goog.exportProperty(
    ol.layer.Tile.prototype,
    'setExtent',
    ol.layer.Tile.prototype.setExtent);

goog.exportProperty(
    ol.layer.Tile.prototype,
    'setMaxResolution',
    ol.layer.Tile.prototype.setMaxResolution);

goog.exportProperty(
    ol.layer.Tile.prototype,
    'setMinResolution',
    ol.layer.Tile.prototype.setMinResolution);

goog.exportProperty(
    ol.layer.Tile.prototype,
    'setOpacity',
    ol.layer.Tile.prototype.setOpacity);

goog.exportProperty(
    ol.layer.Tile.prototype,
    'setVisible',
    ol.layer.Tile.prototype.setVisible);

goog.exportProperty(
    ol.layer.Tile.prototype,
    'setZIndex',
    ol.layer.Tile.prototype.setZIndex);

goog.exportProperty(
    ol.layer.Tile.prototype,
    'get',
    ol.layer.Tile.prototype.get);

goog.exportProperty(
    ol.layer.Tile.prototype,
    'getKeys',
    ol.layer.Tile.prototype.getKeys);

goog.exportProperty(
    ol.layer.Tile.prototype,
    'getProperties',
    ol.layer.Tile.prototype.getProperties);

goog.exportProperty(
    ol.layer.Tile.prototype,
    'set',
    ol.layer.Tile.prototype.set);

goog.exportProperty(
    ol.layer.Tile.prototype,
    'setProperties',
    ol.layer.Tile.prototype.setProperties);

goog.exportProperty(
    ol.layer.Tile.prototype,
    'unset',
    ol.layer.Tile.prototype.unset);

goog.exportProperty(
    ol.layer.Tile.prototype,
    'changed',
    ol.layer.Tile.prototype.changed);

goog.exportProperty(
    ol.layer.Tile.prototype,
    'dispatchEvent',
    ol.layer.Tile.prototype.dispatchEvent);

goog.exportProperty(
    ol.layer.Tile.prototype,
    'getRevision',
    ol.layer.Tile.prototype.getRevision);

goog.exportProperty(
    ol.layer.Tile.prototype,
    'on',
    ol.layer.Tile.prototype.on);

goog.exportProperty(
    ol.layer.Tile.prototype,
    'once',
    ol.layer.Tile.prototype.once);

goog.exportProperty(
    ol.layer.Tile.prototype,
    'un',
    ol.layer.Tile.prototype.un);

goog.exportProperty(
    ol.layer.Tile.prototype,
    'unByKey',
    ol.layer.Tile.prototype.unByKey);

goog.exportProperty(
    ol.layer.VectorTile.prototype,
    'getStyle',
    ol.layer.VectorTile.prototype.getStyle);

goog.exportProperty(
    ol.layer.VectorTile.prototype,
    'getStyleFunction',
    ol.layer.VectorTile.prototype.getStyleFunction);

goog.exportProperty(
    ol.layer.VectorTile.prototype,
    'setStyle',
    ol.layer.VectorTile.prototype.setStyle);

goog.exportProperty(
    ol.layer.VectorTile.prototype,
    'setMap',
    ol.layer.VectorTile.prototype.setMap);

goog.exportProperty(
    ol.layer.VectorTile.prototype,
    'setSource',
    ol.layer.VectorTile.prototype.setSource);

goog.exportProperty(
    ol.layer.VectorTile.prototype,
    'getExtent',
    ol.layer.VectorTile.prototype.getExtent);

goog.exportProperty(
    ol.layer.VectorTile.prototype,
    'getMaxResolution',
    ol.layer.VectorTile.prototype.getMaxResolution);

goog.exportProperty(
    ol.layer.VectorTile.prototype,
    'getMinResolution',
    ol.layer.VectorTile.prototype.getMinResolution);

goog.exportProperty(
    ol.layer.VectorTile.prototype,
    'getOpacity',
    ol.layer.VectorTile.prototype.getOpacity);

goog.exportProperty(
    ol.layer.VectorTile.prototype,
    'getVisible',
    ol.layer.VectorTile.prototype.getVisible);

goog.exportProperty(
    ol.layer.VectorTile.prototype,
    'getZIndex',
    ol.layer.VectorTile.prototype.getZIndex);

goog.exportProperty(
    ol.layer.VectorTile.prototype,
    'setExtent',
    ol.layer.VectorTile.prototype.setExtent);

goog.exportProperty(
    ol.layer.VectorTile.prototype,
    'setMaxResolution',
    ol.layer.VectorTile.prototype.setMaxResolution);

goog.exportProperty(
    ol.layer.VectorTile.prototype,
    'setMinResolution',
    ol.layer.VectorTile.prototype.setMinResolution);

goog.exportProperty(
    ol.layer.VectorTile.prototype,
    'setOpacity',
    ol.layer.VectorTile.prototype.setOpacity);

goog.exportProperty(
    ol.layer.VectorTile.prototype,
    'setVisible',
    ol.layer.VectorTile.prototype.setVisible);

goog.exportProperty(
    ol.layer.VectorTile.prototype,
    'setZIndex',
    ol.layer.VectorTile.prototype.setZIndex);

goog.exportProperty(
    ol.layer.VectorTile.prototype,
    'get',
    ol.layer.VectorTile.prototype.get);

goog.exportProperty(
    ol.layer.VectorTile.prototype,
    'getKeys',
    ol.layer.VectorTile.prototype.getKeys);

goog.exportProperty(
    ol.layer.VectorTile.prototype,
    'getProperties',
    ol.layer.VectorTile.prototype.getProperties);

goog.exportProperty(
    ol.layer.VectorTile.prototype,
    'set',
    ol.layer.VectorTile.prototype.set);

goog.exportProperty(
    ol.layer.VectorTile.prototype,
    'setProperties',
    ol.layer.VectorTile.prototype.setProperties);

goog.exportProperty(
    ol.layer.VectorTile.prototype,
    'unset',
    ol.layer.VectorTile.prototype.unset);

goog.exportProperty(
    ol.layer.VectorTile.prototype,
    'changed',
    ol.layer.VectorTile.prototype.changed);

goog.exportProperty(
    ol.layer.VectorTile.prototype,
    'dispatchEvent',
    ol.layer.VectorTile.prototype.dispatchEvent);

goog.exportProperty(
    ol.layer.VectorTile.prototype,
    'getRevision',
    ol.layer.VectorTile.prototype.getRevision);

goog.exportProperty(
    ol.layer.VectorTile.prototype,
    'on',
    ol.layer.VectorTile.prototype.on);

goog.exportProperty(
    ol.layer.VectorTile.prototype,
    'once',
    ol.layer.VectorTile.prototype.once);

goog.exportProperty(
    ol.layer.VectorTile.prototype,
    'un',
    ol.layer.VectorTile.prototype.un);

goog.exportProperty(
    ol.layer.VectorTile.prototype,
    'unByKey',
    ol.layer.VectorTile.prototype.unByKey);

goog.exportProperty(
    ol.interaction.Interaction.prototype,
    'get',
    ol.interaction.Interaction.prototype.get);

goog.exportProperty(
    ol.interaction.Interaction.prototype,
    'getKeys',
    ol.interaction.Interaction.prototype.getKeys);

goog.exportProperty(
    ol.interaction.Interaction.prototype,
    'getProperties',
    ol.interaction.Interaction.prototype.getProperties);

goog.exportProperty(
    ol.interaction.Interaction.prototype,
    'set',
    ol.interaction.Interaction.prototype.set);

goog.exportProperty(
    ol.interaction.Interaction.prototype,
    'setProperties',
    ol.interaction.Interaction.prototype.setProperties);

goog.exportProperty(
    ol.interaction.Interaction.prototype,
    'unset',
    ol.interaction.Interaction.prototype.unset);

goog.exportProperty(
    ol.interaction.Interaction.prototype,
    'changed',
    ol.interaction.Interaction.prototype.changed);

goog.exportProperty(
    ol.interaction.Interaction.prototype,
    'dispatchEvent',
    ol.interaction.Interaction.prototype.dispatchEvent);

goog.exportProperty(
    ol.interaction.Interaction.prototype,
    'getRevision',
    ol.interaction.Interaction.prototype.getRevision);

goog.exportProperty(
    ol.interaction.Interaction.prototype,
    'on',
    ol.interaction.Interaction.prototype.on);

goog.exportProperty(
    ol.interaction.Interaction.prototype,
    'once',
    ol.interaction.Interaction.prototype.once);

goog.exportProperty(
    ol.interaction.Interaction.prototype,
    'un',
    ol.interaction.Interaction.prototype.un);

goog.exportProperty(
    ol.interaction.Interaction.prototype,
    'unByKey',
    ol.interaction.Interaction.prototype.unByKey);

goog.exportProperty(
    ol.interaction.DoubleClickZoom.prototype,
    'getActive',
    ol.interaction.DoubleClickZoom.prototype.getActive);

goog.exportProperty(
    ol.interaction.DoubleClickZoom.prototype,
    'setActive',
    ol.interaction.DoubleClickZoom.prototype.setActive);

goog.exportProperty(
    ol.interaction.DoubleClickZoom.prototype,
    'get',
    ol.interaction.DoubleClickZoom.prototype.get);

goog.exportProperty(
    ol.interaction.DoubleClickZoom.prototype,
    'getKeys',
    ol.interaction.DoubleClickZoom.prototype.getKeys);

goog.exportProperty(
    ol.interaction.DoubleClickZoom.prototype,
    'getProperties',
    ol.interaction.DoubleClickZoom.prototype.getProperties);

goog.exportProperty(
    ol.interaction.DoubleClickZoom.prototype,
    'set',
    ol.interaction.DoubleClickZoom.prototype.set);

goog.exportProperty(
    ol.interaction.DoubleClickZoom.prototype,
    'setProperties',
    ol.interaction.DoubleClickZoom.prototype.setProperties);

goog.exportProperty(
    ol.interaction.DoubleClickZoom.prototype,
    'unset',
    ol.interaction.DoubleClickZoom.prototype.unset);

goog.exportProperty(
    ol.interaction.DoubleClickZoom.prototype,
    'changed',
    ol.interaction.DoubleClickZoom.prototype.changed);

goog.exportProperty(
    ol.interaction.DoubleClickZoom.prototype,
    'dispatchEvent',
    ol.interaction.DoubleClickZoom.prototype.dispatchEvent);

goog.exportProperty(
    ol.interaction.DoubleClickZoom.prototype,
    'getRevision',
    ol.interaction.DoubleClickZoom.prototype.getRevision);

goog.exportProperty(
    ol.interaction.DoubleClickZoom.prototype,
    'on',
    ol.interaction.DoubleClickZoom.prototype.on);

goog.exportProperty(
    ol.interaction.DoubleClickZoom.prototype,
    'once',
    ol.interaction.DoubleClickZoom.prototype.once);

goog.exportProperty(
    ol.interaction.DoubleClickZoom.prototype,
    'un',
    ol.interaction.DoubleClickZoom.prototype.un);

goog.exportProperty(
    ol.interaction.DoubleClickZoom.prototype,
    'unByKey',
    ol.interaction.DoubleClickZoom.prototype.unByKey);

goog.exportProperty(
    ol.interaction.DragAndDrop.prototype,
    'getActive',
    ol.interaction.DragAndDrop.prototype.getActive);

goog.exportProperty(
    ol.interaction.DragAndDrop.prototype,
    'setActive',
    ol.interaction.DragAndDrop.prototype.setActive);

goog.exportProperty(
    ol.interaction.DragAndDrop.prototype,
    'get',
    ol.interaction.DragAndDrop.prototype.get);

goog.exportProperty(
    ol.interaction.DragAndDrop.prototype,
    'getKeys',
    ol.interaction.DragAndDrop.prototype.getKeys);

goog.exportProperty(
    ol.interaction.DragAndDrop.prototype,
    'getProperties',
    ol.interaction.DragAndDrop.prototype.getProperties);

goog.exportProperty(
    ol.interaction.DragAndDrop.prototype,
    'set',
    ol.interaction.DragAndDrop.prototype.set);

goog.exportProperty(
    ol.interaction.DragAndDrop.prototype,
    'setProperties',
    ol.interaction.DragAndDrop.prototype.setProperties);

goog.exportProperty(
    ol.interaction.DragAndDrop.prototype,
    'unset',
    ol.interaction.DragAndDrop.prototype.unset);

goog.exportProperty(
    ol.interaction.DragAndDrop.prototype,
    'changed',
    ol.interaction.DragAndDrop.prototype.changed);

goog.exportProperty(
    ol.interaction.DragAndDrop.prototype,
    'dispatchEvent',
    ol.interaction.DragAndDrop.prototype.dispatchEvent);

goog.exportProperty(
    ol.interaction.DragAndDrop.prototype,
    'getRevision',
    ol.interaction.DragAndDrop.prototype.getRevision);

goog.exportProperty(
    ol.interaction.DragAndDrop.prototype,
    'on',
    ol.interaction.DragAndDrop.prototype.on);

goog.exportProperty(
    ol.interaction.DragAndDrop.prototype,
    'once',
    ol.interaction.DragAndDrop.prototype.once);

goog.exportProperty(
    ol.interaction.DragAndDrop.prototype,
    'un',
    ol.interaction.DragAndDrop.prototype.un);

goog.exportProperty(
    ol.interaction.DragAndDrop.prototype,
    'unByKey',
    ol.interaction.DragAndDrop.prototype.unByKey);

goog.exportProperty(
    ol.interaction.Pointer.prototype,
    'getActive',
    ol.interaction.Pointer.prototype.getActive);

goog.exportProperty(
    ol.interaction.Pointer.prototype,
    'setActive',
    ol.interaction.Pointer.prototype.setActive);

goog.exportProperty(
    ol.interaction.Pointer.prototype,
    'get',
    ol.interaction.Pointer.prototype.get);

goog.exportProperty(
    ol.interaction.Pointer.prototype,
    'getKeys',
    ol.interaction.Pointer.prototype.getKeys);

goog.exportProperty(
    ol.interaction.Pointer.prototype,
    'getProperties',
    ol.interaction.Pointer.prototype.getProperties);

goog.exportProperty(
    ol.interaction.Pointer.prototype,
    'set',
    ol.interaction.Pointer.prototype.set);

goog.exportProperty(
    ol.interaction.Pointer.prototype,
    'setProperties',
    ol.interaction.Pointer.prototype.setProperties);

goog.exportProperty(
    ol.interaction.Pointer.prototype,
    'unset',
    ol.interaction.Pointer.prototype.unset);

goog.exportProperty(
    ol.interaction.Pointer.prototype,
    'changed',
    ol.interaction.Pointer.prototype.changed);

goog.exportProperty(
    ol.interaction.Pointer.prototype,
    'dispatchEvent',
    ol.interaction.Pointer.prototype.dispatchEvent);

goog.exportProperty(
    ol.interaction.Pointer.prototype,
    'getRevision',
    ol.interaction.Pointer.prototype.getRevision);

goog.exportProperty(
    ol.interaction.Pointer.prototype,
    'on',
    ol.interaction.Pointer.prototype.on);

goog.exportProperty(
    ol.interaction.Pointer.prototype,
    'once',
    ol.interaction.Pointer.prototype.once);

goog.exportProperty(
    ol.interaction.Pointer.prototype,
    'un',
    ol.interaction.Pointer.prototype.un);

goog.exportProperty(
    ol.interaction.Pointer.prototype,
    'unByKey',
    ol.interaction.Pointer.prototype.unByKey);

goog.exportProperty(
    ol.interaction.DragBox.prototype,
    'getActive',
    ol.interaction.DragBox.prototype.getActive);

goog.exportProperty(
    ol.interaction.DragBox.prototype,
    'setActive',
    ol.interaction.DragBox.prototype.setActive);

goog.exportProperty(
    ol.interaction.DragBox.prototype,
    'get',
    ol.interaction.DragBox.prototype.get);

goog.exportProperty(
    ol.interaction.DragBox.prototype,
    'getKeys',
    ol.interaction.DragBox.prototype.getKeys);

goog.exportProperty(
    ol.interaction.DragBox.prototype,
    'getProperties',
    ol.interaction.DragBox.prototype.getProperties);

goog.exportProperty(
    ol.interaction.DragBox.prototype,
    'set',
    ol.interaction.DragBox.prototype.set);

goog.exportProperty(
    ol.interaction.DragBox.prototype,
    'setProperties',
    ol.interaction.DragBox.prototype.setProperties);

goog.exportProperty(
    ol.interaction.DragBox.prototype,
    'unset',
    ol.interaction.DragBox.prototype.unset);

goog.exportProperty(
    ol.interaction.DragBox.prototype,
    'changed',
    ol.interaction.DragBox.prototype.changed);

goog.exportProperty(
    ol.interaction.DragBox.prototype,
    'dispatchEvent',
    ol.interaction.DragBox.prototype.dispatchEvent);

goog.exportProperty(
    ol.interaction.DragBox.prototype,
    'getRevision',
    ol.interaction.DragBox.prototype.getRevision);

goog.exportProperty(
    ol.interaction.DragBox.prototype,
    'on',
    ol.interaction.DragBox.prototype.on);

goog.exportProperty(
    ol.interaction.DragBox.prototype,
    'once',
    ol.interaction.DragBox.prototype.once);

goog.exportProperty(
    ol.interaction.DragBox.prototype,
    'un',
    ol.interaction.DragBox.prototype.un);

goog.exportProperty(
    ol.interaction.DragBox.prototype,
    'unByKey',
    ol.interaction.DragBox.prototype.unByKey);

goog.exportProperty(
    ol.interaction.DragPan.prototype,
    'getActive',
    ol.interaction.DragPan.prototype.getActive);

goog.exportProperty(
    ol.interaction.DragPan.prototype,
    'setActive',
    ol.interaction.DragPan.prototype.setActive);

goog.exportProperty(
    ol.interaction.DragPan.prototype,
    'get',
    ol.interaction.DragPan.prototype.get);

goog.exportProperty(
    ol.interaction.DragPan.prototype,
    'getKeys',
    ol.interaction.DragPan.prototype.getKeys);

goog.exportProperty(
    ol.interaction.DragPan.prototype,
    'getProperties',
    ol.interaction.DragPan.prototype.getProperties);

goog.exportProperty(
    ol.interaction.DragPan.prototype,
    'set',
    ol.interaction.DragPan.prototype.set);

goog.exportProperty(
    ol.interaction.DragPan.prototype,
    'setProperties',
    ol.interaction.DragPan.prototype.setProperties);

goog.exportProperty(
    ol.interaction.DragPan.prototype,
    'unset',
    ol.interaction.DragPan.prototype.unset);

goog.exportProperty(
    ol.interaction.DragPan.prototype,
    'changed',
    ol.interaction.DragPan.prototype.changed);

goog.exportProperty(
    ol.interaction.DragPan.prototype,
    'dispatchEvent',
    ol.interaction.DragPan.prototype.dispatchEvent);

goog.exportProperty(
    ol.interaction.DragPan.prototype,
    'getRevision',
    ol.interaction.DragPan.prototype.getRevision);

goog.exportProperty(
    ol.interaction.DragPan.prototype,
    'on',
    ol.interaction.DragPan.prototype.on);

goog.exportProperty(
    ol.interaction.DragPan.prototype,
    'once',
    ol.interaction.DragPan.prototype.once);

goog.exportProperty(
    ol.interaction.DragPan.prototype,
    'un',
    ol.interaction.DragPan.prototype.un);

goog.exportProperty(
    ol.interaction.DragPan.prototype,
    'unByKey',
    ol.interaction.DragPan.prototype.unByKey);

goog.exportProperty(
    ol.interaction.DragRotateAndZoom.prototype,
    'getActive',
    ol.interaction.DragRotateAndZoom.prototype.getActive);

goog.exportProperty(
    ol.interaction.DragRotateAndZoom.prototype,
    'setActive',
    ol.interaction.DragRotateAndZoom.prototype.setActive);

goog.exportProperty(
    ol.interaction.DragRotateAndZoom.prototype,
    'get',
    ol.interaction.DragRotateAndZoom.prototype.get);

goog.exportProperty(
    ol.interaction.DragRotateAndZoom.prototype,
    'getKeys',
    ol.interaction.DragRotateAndZoom.prototype.getKeys);

goog.exportProperty(
    ol.interaction.DragRotateAndZoom.prototype,
    'getProperties',
    ol.interaction.DragRotateAndZoom.prototype.getProperties);

goog.exportProperty(
    ol.interaction.DragRotateAndZoom.prototype,
    'set',
    ol.interaction.DragRotateAndZoom.prototype.set);

goog.exportProperty(
    ol.interaction.DragRotateAndZoom.prototype,
    'setProperties',
    ol.interaction.DragRotateAndZoom.prototype.setProperties);

goog.exportProperty(
    ol.interaction.DragRotateAndZoom.prototype,
    'unset',
    ol.interaction.DragRotateAndZoom.prototype.unset);

goog.exportProperty(
    ol.interaction.DragRotateAndZoom.prototype,
    'changed',
    ol.interaction.DragRotateAndZoom.prototype.changed);

goog.exportProperty(
    ol.interaction.DragRotateAndZoom.prototype,
    'dispatchEvent',
    ol.interaction.DragRotateAndZoom.prototype.dispatchEvent);

goog.exportProperty(
    ol.interaction.DragRotateAndZoom.prototype,
    'getRevision',
    ol.interaction.DragRotateAndZoom.prototype.getRevision);

goog.exportProperty(
    ol.interaction.DragRotateAndZoom.prototype,
    'on',
    ol.interaction.DragRotateAndZoom.prototype.on);

goog.exportProperty(
    ol.interaction.DragRotateAndZoom.prototype,
    'once',
    ol.interaction.DragRotateAndZoom.prototype.once);

goog.exportProperty(
    ol.interaction.DragRotateAndZoom.prototype,
    'un',
    ol.interaction.DragRotateAndZoom.prototype.un);

goog.exportProperty(
    ol.interaction.DragRotateAndZoom.prototype,
    'unByKey',
    ol.interaction.DragRotateAndZoom.prototype.unByKey);

goog.exportProperty(
    ol.interaction.DragRotate.prototype,
    'getActive',
    ol.interaction.DragRotate.prototype.getActive);

goog.exportProperty(
    ol.interaction.DragRotate.prototype,
    'setActive',
    ol.interaction.DragRotate.prototype.setActive);

goog.exportProperty(
    ol.interaction.DragRotate.prototype,
    'get',
    ol.interaction.DragRotate.prototype.get);

goog.exportProperty(
    ol.interaction.DragRotate.prototype,
    'getKeys',
    ol.interaction.DragRotate.prototype.getKeys);

goog.exportProperty(
    ol.interaction.DragRotate.prototype,
    'getProperties',
    ol.interaction.DragRotate.prototype.getProperties);

goog.exportProperty(
    ol.interaction.DragRotate.prototype,
    'set',
    ol.interaction.DragRotate.prototype.set);

goog.exportProperty(
    ol.interaction.DragRotate.prototype,
    'setProperties',
    ol.interaction.DragRotate.prototype.setProperties);

goog.exportProperty(
    ol.interaction.DragRotate.prototype,
    'unset',
    ol.interaction.DragRotate.prototype.unset);

goog.exportProperty(
    ol.interaction.DragRotate.prototype,
    'changed',
    ol.interaction.DragRotate.prototype.changed);

goog.exportProperty(
    ol.interaction.DragRotate.prototype,
    'dispatchEvent',
    ol.interaction.DragRotate.prototype.dispatchEvent);

goog.exportProperty(
    ol.interaction.DragRotate.prototype,
    'getRevision',
    ol.interaction.DragRotate.prototype.getRevision);

goog.exportProperty(
    ol.interaction.DragRotate.prototype,
    'on',
    ol.interaction.DragRotate.prototype.on);

goog.exportProperty(
    ol.interaction.DragRotate.prototype,
    'once',
    ol.interaction.DragRotate.prototype.once);

goog.exportProperty(
    ol.interaction.DragRotate.prototype,
    'un',
    ol.interaction.DragRotate.prototype.un);

goog.exportProperty(
    ol.interaction.DragRotate.prototype,
    'unByKey',
    ol.interaction.DragRotate.prototype.unByKey);

goog.exportProperty(
    ol.interaction.DragZoom.prototype,
    'getGeometry',
    ol.interaction.DragZoom.prototype.getGeometry);

goog.exportProperty(
    ol.interaction.DragZoom.prototype,
    'getActive',
    ol.interaction.DragZoom.prototype.getActive);

goog.exportProperty(
    ol.interaction.DragZoom.prototype,
    'setActive',
    ol.interaction.DragZoom.prototype.setActive);

goog.exportProperty(
    ol.interaction.DragZoom.prototype,
    'get',
    ol.interaction.DragZoom.prototype.get);

goog.exportProperty(
    ol.interaction.DragZoom.prototype,
    'getKeys',
    ol.interaction.DragZoom.prototype.getKeys);

goog.exportProperty(
    ol.interaction.DragZoom.prototype,
    'getProperties',
    ol.interaction.DragZoom.prototype.getProperties);

goog.exportProperty(
    ol.interaction.DragZoom.prototype,
    'set',
    ol.interaction.DragZoom.prototype.set);

goog.exportProperty(
    ol.interaction.DragZoom.prototype,
    'setProperties',
    ol.interaction.DragZoom.prototype.setProperties);

goog.exportProperty(
    ol.interaction.DragZoom.prototype,
    'unset',
    ol.interaction.DragZoom.prototype.unset);

goog.exportProperty(
    ol.interaction.DragZoom.prototype,
    'changed',
    ol.interaction.DragZoom.prototype.changed);

goog.exportProperty(
    ol.interaction.DragZoom.prototype,
    'dispatchEvent',
    ol.interaction.DragZoom.prototype.dispatchEvent);

goog.exportProperty(
    ol.interaction.DragZoom.prototype,
    'getRevision',
    ol.interaction.DragZoom.prototype.getRevision);

goog.exportProperty(
    ol.interaction.DragZoom.prototype,
    'on',
    ol.interaction.DragZoom.prototype.on);

goog.exportProperty(
    ol.interaction.DragZoom.prototype,
    'once',
    ol.interaction.DragZoom.prototype.once);

goog.exportProperty(
    ol.interaction.DragZoom.prototype,
    'un',
    ol.interaction.DragZoom.prototype.un);

goog.exportProperty(
    ol.interaction.DragZoom.prototype,
    'unByKey',
    ol.interaction.DragZoom.prototype.unByKey);

goog.exportProperty(
    ol.interaction.Draw.prototype,
    'getActive',
    ol.interaction.Draw.prototype.getActive);

goog.exportProperty(
    ol.interaction.Draw.prototype,
    'setActive',
    ol.interaction.Draw.prototype.setActive);

goog.exportProperty(
    ol.interaction.Draw.prototype,
    'get',
    ol.interaction.Draw.prototype.get);

goog.exportProperty(
    ol.interaction.Draw.prototype,
    'getKeys',
    ol.interaction.Draw.prototype.getKeys);

goog.exportProperty(
    ol.interaction.Draw.prototype,
    'getProperties',
    ol.interaction.Draw.prototype.getProperties);

goog.exportProperty(
    ol.interaction.Draw.prototype,
    'set',
    ol.interaction.Draw.prototype.set);

goog.exportProperty(
    ol.interaction.Draw.prototype,
    'setProperties',
    ol.interaction.Draw.prototype.setProperties);

goog.exportProperty(
    ol.interaction.Draw.prototype,
    'unset',
    ol.interaction.Draw.prototype.unset);

goog.exportProperty(
    ol.interaction.Draw.prototype,
    'changed',
    ol.interaction.Draw.prototype.changed);

goog.exportProperty(
    ol.interaction.Draw.prototype,
    'dispatchEvent',
    ol.interaction.Draw.prototype.dispatchEvent);

goog.exportProperty(
    ol.interaction.Draw.prototype,
    'getRevision',
    ol.interaction.Draw.prototype.getRevision);

goog.exportProperty(
    ol.interaction.Draw.prototype,
    'on',
    ol.interaction.Draw.prototype.on);

goog.exportProperty(
    ol.interaction.Draw.prototype,
    'once',
    ol.interaction.Draw.prototype.once);

goog.exportProperty(
    ol.interaction.Draw.prototype,
    'un',
    ol.interaction.Draw.prototype.un);

goog.exportProperty(
    ol.interaction.Draw.prototype,
    'unByKey',
    ol.interaction.Draw.prototype.unByKey);

goog.exportProperty(
    ol.interaction.KeyboardPan.prototype,
    'getActive',
    ol.interaction.KeyboardPan.prototype.getActive);

goog.exportProperty(
    ol.interaction.KeyboardPan.prototype,
    'setActive',
    ol.interaction.KeyboardPan.prototype.setActive);

goog.exportProperty(
    ol.interaction.KeyboardPan.prototype,
    'get',
    ol.interaction.KeyboardPan.prototype.get);

goog.exportProperty(
    ol.interaction.KeyboardPan.prototype,
    'getKeys',
    ol.interaction.KeyboardPan.prototype.getKeys);

goog.exportProperty(
    ol.interaction.KeyboardPan.prototype,
    'getProperties',
    ol.interaction.KeyboardPan.prototype.getProperties);

goog.exportProperty(
    ol.interaction.KeyboardPan.prototype,
    'set',
    ol.interaction.KeyboardPan.prototype.set);

goog.exportProperty(
    ol.interaction.KeyboardPan.prototype,
    'setProperties',
    ol.interaction.KeyboardPan.prototype.setProperties);

goog.exportProperty(
    ol.interaction.KeyboardPan.prototype,
    'unset',
    ol.interaction.KeyboardPan.prototype.unset);

goog.exportProperty(
    ol.interaction.KeyboardPan.prototype,
    'changed',
    ol.interaction.KeyboardPan.prototype.changed);

goog.exportProperty(
    ol.interaction.KeyboardPan.prototype,
    'dispatchEvent',
    ol.interaction.KeyboardPan.prototype.dispatchEvent);

goog.exportProperty(
    ol.interaction.KeyboardPan.prototype,
    'getRevision',
    ol.interaction.KeyboardPan.prototype.getRevision);

goog.exportProperty(
    ol.interaction.KeyboardPan.prototype,
    'on',
    ol.interaction.KeyboardPan.prototype.on);

goog.exportProperty(
    ol.interaction.KeyboardPan.prototype,
    'once',
    ol.interaction.KeyboardPan.prototype.once);

goog.exportProperty(
    ol.interaction.KeyboardPan.prototype,
    'un',
    ol.interaction.KeyboardPan.prototype.un);

goog.exportProperty(
    ol.interaction.KeyboardPan.prototype,
    'unByKey',
    ol.interaction.KeyboardPan.prototype.unByKey);

goog.exportProperty(
    ol.interaction.KeyboardZoom.prototype,
    'getActive',
    ol.interaction.KeyboardZoom.prototype.getActive);

goog.exportProperty(
    ol.interaction.KeyboardZoom.prototype,
    'setActive',
    ol.interaction.KeyboardZoom.prototype.setActive);

goog.exportProperty(
    ol.interaction.KeyboardZoom.prototype,
    'get',
    ol.interaction.KeyboardZoom.prototype.get);

goog.exportProperty(
    ol.interaction.KeyboardZoom.prototype,
    'getKeys',
    ol.interaction.KeyboardZoom.prototype.getKeys);

goog.exportProperty(
    ol.interaction.KeyboardZoom.prototype,
    'getProperties',
    ol.interaction.KeyboardZoom.prototype.getProperties);

goog.exportProperty(
    ol.interaction.KeyboardZoom.prototype,
    'set',
    ol.interaction.KeyboardZoom.prototype.set);

goog.exportProperty(
    ol.interaction.KeyboardZoom.prototype,
    'setProperties',
    ol.interaction.KeyboardZoom.prototype.setProperties);

goog.exportProperty(
    ol.interaction.KeyboardZoom.prototype,
    'unset',
    ol.interaction.KeyboardZoom.prototype.unset);

goog.exportProperty(
    ol.interaction.KeyboardZoom.prototype,
    'changed',
    ol.interaction.KeyboardZoom.prototype.changed);

goog.exportProperty(
    ol.interaction.KeyboardZoom.prototype,
    'dispatchEvent',
    ol.interaction.KeyboardZoom.prototype.dispatchEvent);

goog.exportProperty(
    ol.interaction.KeyboardZoom.prototype,
    'getRevision',
    ol.interaction.KeyboardZoom.prototype.getRevision);

goog.exportProperty(
    ol.interaction.KeyboardZoom.prototype,
    'on',
    ol.interaction.KeyboardZoom.prototype.on);

goog.exportProperty(
    ol.interaction.KeyboardZoom.prototype,
    'once',
    ol.interaction.KeyboardZoom.prototype.once);

goog.exportProperty(
    ol.interaction.KeyboardZoom.prototype,
    'un',
    ol.interaction.KeyboardZoom.prototype.un);

goog.exportProperty(
    ol.interaction.KeyboardZoom.prototype,
    'unByKey',
    ol.interaction.KeyboardZoom.prototype.unByKey);

goog.exportProperty(
    ol.interaction.Modify.prototype,
    'getActive',
    ol.interaction.Modify.prototype.getActive);

goog.exportProperty(
    ol.interaction.Modify.prototype,
    'setActive',
    ol.interaction.Modify.prototype.setActive);

goog.exportProperty(
    ol.interaction.Modify.prototype,
    'get',
    ol.interaction.Modify.prototype.get);

goog.exportProperty(
    ol.interaction.Modify.prototype,
    'getKeys',
    ol.interaction.Modify.prototype.getKeys);

goog.exportProperty(
    ol.interaction.Modify.prototype,
    'getProperties',
    ol.interaction.Modify.prototype.getProperties);

goog.exportProperty(
    ol.interaction.Modify.prototype,
    'set',
    ol.interaction.Modify.prototype.set);

goog.exportProperty(
    ol.interaction.Modify.prototype,
    'setProperties',
    ol.interaction.Modify.prototype.setProperties);

goog.exportProperty(
    ol.interaction.Modify.prototype,
    'unset',
    ol.interaction.Modify.prototype.unset);

goog.exportProperty(
    ol.interaction.Modify.prototype,
    'changed',
    ol.interaction.Modify.prototype.changed);

goog.exportProperty(
    ol.interaction.Modify.prototype,
    'dispatchEvent',
    ol.interaction.Modify.prototype.dispatchEvent);

goog.exportProperty(
    ol.interaction.Modify.prototype,
    'getRevision',
    ol.interaction.Modify.prototype.getRevision);

goog.exportProperty(
    ol.interaction.Modify.prototype,
    'on',
    ol.interaction.Modify.prototype.on);

goog.exportProperty(
    ol.interaction.Modify.prototype,
    'once',
    ol.interaction.Modify.prototype.once);

goog.exportProperty(
    ol.interaction.Modify.prototype,
    'un',
    ol.interaction.Modify.prototype.un);

goog.exportProperty(
    ol.interaction.Modify.prototype,
    'unByKey',
    ol.interaction.Modify.prototype.unByKey);

goog.exportProperty(
    ol.interaction.MouseWheelZoom.prototype,
    'getActive',
    ol.interaction.MouseWheelZoom.prototype.getActive);

goog.exportProperty(
    ol.interaction.MouseWheelZoom.prototype,
    'setActive',
    ol.interaction.MouseWheelZoom.prototype.setActive);

goog.exportProperty(
    ol.interaction.MouseWheelZoom.prototype,
    'get',
    ol.interaction.MouseWheelZoom.prototype.get);

goog.exportProperty(
    ol.interaction.MouseWheelZoom.prototype,
    'getKeys',
    ol.interaction.MouseWheelZoom.prototype.getKeys);

goog.exportProperty(
    ol.interaction.MouseWheelZoom.prototype,
    'getProperties',
    ol.interaction.MouseWheelZoom.prototype.getProperties);

goog.exportProperty(
    ol.interaction.MouseWheelZoom.prototype,
    'set',
    ol.interaction.MouseWheelZoom.prototype.set);

goog.exportProperty(
    ol.interaction.MouseWheelZoom.prototype,
    'setProperties',
    ol.interaction.MouseWheelZoom.prototype.setProperties);

goog.exportProperty(
    ol.interaction.MouseWheelZoom.prototype,
    'unset',
    ol.interaction.MouseWheelZoom.prototype.unset);

goog.exportProperty(
    ol.interaction.MouseWheelZoom.prototype,
    'changed',
    ol.interaction.MouseWheelZoom.prototype.changed);

goog.exportProperty(
    ol.interaction.MouseWheelZoom.prototype,
    'dispatchEvent',
    ol.interaction.MouseWheelZoom.prototype.dispatchEvent);

goog.exportProperty(
    ol.interaction.MouseWheelZoom.prototype,
    'getRevision',
    ol.interaction.MouseWheelZoom.prototype.getRevision);

goog.exportProperty(
    ol.interaction.MouseWheelZoom.prototype,
    'on',
    ol.interaction.MouseWheelZoom.prototype.on);

goog.exportProperty(
    ol.interaction.MouseWheelZoom.prototype,
    'once',
    ol.interaction.MouseWheelZoom.prototype.once);

goog.exportProperty(
    ol.interaction.MouseWheelZoom.prototype,
    'un',
    ol.interaction.MouseWheelZoom.prototype.un);

goog.exportProperty(
    ol.interaction.MouseWheelZoom.prototype,
    'unByKey',
    ol.interaction.MouseWheelZoom.prototype.unByKey);

goog.exportProperty(
    ol.interaction.PinchRotate.prototype,
    'getActive',
    ol.interaction.PinchRotate.prototype.getActive);

goog.exportProperty(
    ol.interaction.PinchRotate.prototype,
    'setActive',
    ol.interaction.PinchRotate.prototype.setActive);

goog.exportProperty(
    ol.interaction.PinchRotate.prototype,
    'get',
    ol.interaction.PinchRotate.prototype.get);

goog.exportProperty(
    ol.interaction.PinchRotate.prototype,
    'getKeys',
    ol.interaction.PinchRotate.prototype.getKeys);

goog.exportProperty(
    ol.interaction.PinchRotate.prototype,
    'getProperties',
    ol.interaction.PinchRotate.prototype.getProperties);

goog.exportProperty(
    ol.interaction.PinchRotate.prototype,
    'set',
    ol.interaction.PinchRotate.prototype.set);

goog.exportProperty(
    ol.interaction.PinchRotate.prototype,
    'setProperties',
    ol.interaction.PinchRotate.prototype.setProperties);

goog.exportProperty(
    ol.interaction.PinchRotate.prototype,
    'unset',
    ol.interaction.PinchRotate.prototype.unset);

goog.exportProperty(
    ol.interaction.PinchRotate.prototype,
    'changed',
    ol.interaction.PinchRotate.prototype.changed);

goog.exportProperty(
    ol.interaction.PinchRotate.prototype,
    'dispatchEvent',
    ol.interaction.PinchRotate.prototype.dispatchEvent);

goog.exportProperty(
    ol.interaction.PinchRotate.prototype,
    'getRevision',
    ol.interaction.PinchRotate.prototype.getRevision);

goog.exportProperty(
    ol.interaction.PinchRotate.prototype,
    'on',
    ol.interaction.PinchRotate.prototype.on);

goog.exportProperty(
    ol.interaction.PinchRotate.prototype,
    'once',
    ol.interaction.PinchRotate.prototype.once);

goog.exportProperty(
    ol.interaction.PinchRotate.prototype,
    'un',
    ol.interaction.PinchRotate.prototype.un);

goog.exportProperty(
    ol.interaction.PinchRotate.prototype,
    'unByKey',
    ol.interaction.PinchRotate.prototype.unByKey);

goog.exportProperty(
    ol.interaction.PinchZoom.prototype,
    'getActive',
    ol.interaction.PinchZoom.prototype.getActive);

goog.exportProperty(
    ol.interaction.PinchZoom.prototype,
    'setActive',
    ol.interaction.PinchZoom.prototype.setActive);

goog.exportProperty(
    ol.interaction.PinchZoom.prototype,
    'get',
    ol.interaction.PinchZoom.prototype.get);

goog.exportProperty(
    ol.interaction.PinchZoom.prototype,
    'getKeys',
    ol.interaction.PinchZoom.prototype.getKeys);

goog.exportProperty(
    ol.interaction.PinchZoom.prototype,
    'getProperties',
    ol.interaction.PinchZoom.prototype.getProperties);

goog.exportProperty(
    ol.interaction.PinchZoom.prototype,
    'set',
    ol.interaction.PinchZoom.prototype.set);

goog.exportProperty(
    ol.interaction.PinchZoom.prototype,
    'setProperties',
    ol.interaction.PinchZoom.prototype.setProperties);

goog.exportProperty(
    ol.interaction.PinchZoom.prototype,
    'unset',
    ol.interaction.PinchZoom.prototype.unset);

goog.exportProperty(
    ol.interaction.PinchZoom.prototype,
    'changed',
    ol.interaction.PinchZoom.prototype.changed);

goog.exportProperty(
    ol.interaction.PinchZoom.prototype,
    'dispatchEvent',
    ol.interaction.PinchZoom.prototype.dispatchEvent);

goog.exportProperty(
    ol.interaction.PinchZoom.prototype,
    'getRevision',
    ol.interaction.PinchZoom.prototype.getRevision);

goog.exportProperty(
    ol.interaction.PinchZoom.prototype,
    'on',
    ol.interaction.PinchZoom.prototype.on);

goog.exportProperty(
    ol.interaction.PinchZoom.prototype,
    'once',
    ol.interaction.PinchZoom.prototype.once);

goog.exportProperty(
    ol.interaction.PinchZoom.prototype,
    'un',
    ol.interaction.PinchZoom.prototype.un);

goog.exportProperty(
    ol.interaction.PinchZoom.prototype,
    'unByKey',
    ol.interaction.PinchZoom.prototype.unByKey);

goog.exportProperty(
    ol.interaction.Select.prototype,
    'getActive',
    ol.interaction.Select.prototype.getActive);

goog.exportProperty(
    ol.interaction.Select.prototype,
    'setActive',
    ol.interaction.Select.prototype.setActive);

goog.exportProperty(
    ol.interaction.Select.prototype,
    'get',
    ol.interaction.Select.prototype.get);

goog.exportProperty(
    ol.interaction.Select.prototype,
    'getKeys',
    ol.interaction.Select.prototype.getKeys);

goog.exportProperty(
    ol.interaction.Select.prototype,
    'getProperties',
    ol.interaction.Select.prototype.getProperties);

goog.exportProperty(
    ol.interaction.Select.prototype,
    'set',
    ol.interaction.Select.prototype.set);

goog.exportProperty(
    ol.interaction.Select.prototype,
    'setProperties',
    ol.interaction.Select.prototype.setProperties);

goog.exportProperty(
    ol.interaction.Select.prototype,
    'unset',
    ol.interaction.Select.prototype.unset);

goog.exportProperty(
    ol.interaction.Select.prototype,
    'changed',
    ol.interaction.Select.prototype.changed);

goog.exportProperty(
    ol.interaction.Select.prototype,
    'dispatchEvent',
    ol.interaction.Select.prototype.dispatchEvent);

goog.exportProperty(
    ol.interaction.Select.prototype,
    'getRevision',
    ol.interaction.Select.prototype.getRevision);

goog.exportProperty(
    ol.interaction.Select.prototype,
    'on',
    ol.interaction.Select.prototype.on);

goog.exportProperty(
    ol.interaction.Select.prototype,
    'once',
    ol.interaction.Select.prototype.once);

goog.exportProperty(
    ol.interaction.Select.prototype,
    'un',
    ol.interaction.Select.prototype.un);

goog.exportProperty(
    ol.interaction.Select.prototype,
    'unByKey',
    ol.interaction.Select.prototype.unByKey);

goog.exportProperty(
    ol.interaction.Snap.prototype,
    'getActive',
    ol.interaction.Snap.prototype.getActive);

goog.exportProperty(
    ol.interaction.Snap.prototype,
    'setActive',
    ol.interaction.Snap.prototype.setActive);

goog.exportProperty(
    ol.interaction.Snap.prototype,
    'get',
    ol.interaction.Snap.prototype.get);

goog.exportProperty(
    ol.interaction.Snap.prototype,
    'getKeys',
    ol.interaction.Snap.prototype.getKeys);

goog.exportProperty(
    ol.interaction.Snap.prototype,
    'getProperties',
    ol.interaction.Snap.prototype.getProperties);

goog.exportProperty(
    ol.interaction.Snap.prototype,
    'set',
    ol.interaction.Snap.prototype.set);

goog.exportProperty(
    ol.interaction.Snap.prototype,
    'setProperties',
    ol.interaction.Snap.prototype.setProperties);

goog.exportProperty(
    ol.interaction.Snap.prototype,
    'unset',
    ol.interaction.Snap.prototype.unset);

goog.exportProperty(
    ol.interaction.Snap.prototype,
    'changed',
    ol.interaction.Snap.prototype.changed);

goog.exportProperty(
    ol.interaction.Snap.prototype,
    'dispatchEvent',
    ol.interaction.Snap.prototype.dispatchEvent);

goog.exportProperty(
    ol.interaction.Snap.prototype,
    'getRevision',
    ol.interaction.Snap.prototype.getRevision);

goog.exportProperty(
    ol.interaction.Snap.prototype,
    'on',
    ol.interaction.Snap.prototype.on);

goog.exportProperty(
    ol.interaction.Snap.prototype,
    'once',
    ol.interaction.Snap.prototype.once);

goog.exportProperty(
    ol.interaction.Snap.prototype,
    'un',
    ol.interaction.Snap.prototype.un);

goog.exportProperty(
    ol.interaction.Snap.prototype,
    'unByKey',
    ol.interaction.Snap.prototype.unByKey);

goog.exportProperty(
    ol.interaction.Translate.prototype,
    'getActive',
    ol.interaction.Translate.prototype.getActive);

goog.exportProperty(
    ol.interaction.Translate.prototype,
    'setActive',
    ol.interaction.Translate.prototype.setActive);

goog.exportProperty(
    ol.interaction.Translate.prototype,
    'get',
    ol.interaction.Translate.prototype.get);

goog.exportProperty(
    ol.interaction.Translate.prototype,
    'getKeys',
    ol.interaction.Translate.prototype.getKeys);

goog.exportProperty(
    ol.interaction.Translate.prototype,
    'getProperties',
    ol.interaction.Translate.prototype.getProperties);

goog.exportProperty(
    ol.interaction.Translate.prototype,
    'set',
    ol.interaction.Translate.prototype.set);

goog.exportProperty(
    ol.interaction.Translate.prototype,
    'setProperties',
    ol.interaction.Translate.prototype.setProperties);

goog.exportProperty(
    ol.interaction.Translate.prototype,
    'unset',
    ol.interaction.Translate.prototype.unset);

goog.exportProperty(
    ol.interaction.Translate.prototype,
    'changed',
    ol.interaction.Translate.prototype.changed);

goog.exportProperty(
    ol.interaction.Translate.prototype,
    'dispatchEvent',
    ol.interaction.Translate.prototype.dispatchEvent);

goog.exportProperty(
    ol.interaction.Translate.prototype,
    'getRevision',
    ol.interaction.Translate.prototype.getRevision);

goog.exportProperty(
    ol.interaction.Translate.prototype,
    'on',
    ol.interaction.Translate.prototype.on);

goog.exportProperty(
    ol.interaction.Translate.prototype,
    'once',
    ol.interaction.Translate.prototype.once);

goog.exportProperty(
    ol.interaction.Translate.prototype,
    'un',
    ol.interaction.Translate.prototype.un);

goog.exportProperty(
    ol.interaction.Translate.prototype,
    'unByKey',
    ol.interaction.Translate.prototype.unByKey);

goog.exportProperty(
    ol.geom.Geometry.prototype,
    'get',
    ol.geom.Geometry.prototype.get);

goog.exportProperty(
    ol.geom.Geometry.prototype,
    'getKeys',
    ol.geom.Geometry.prototype.getKeys);

goog.exportProperty(
    ol.geom.Geometry.prototype,
    'getProperties',
    ol.geom.Geometry.prototype.getProperties);

goog.exportProperty(
    ol.geom.Geometry.prototype,
    'set',
    ol.geom.Geometry.prototype.set);

goog.exportProperty(
    ol.geom.Geometry.prototype,
    'setProperties',
    ol.geom.Geometry.prototype.setProperties);

goog.exportProperty(
    ol.geom.Geometry.prototype,
    'unset',
    ol.geom.Geometry.prototype.unset);

goog.exportProperty(
    ol.geom.Geometry.prototype,
    'changed',
    ol.geom.Geometry.prototype.changed);

goog.exportProperty(
    ol.geom.Geometry.prototype,
    'dispatchEvent',
    ol.geom.Geometry.prototype.dispatchEvent);

goog.exportProperty(
    ol.geom.Geometry.prototype,
    'getRevision',
    ol.geom.Geometry.prototype.getRevision);

goog.exportProperty(
    ol.geom.Geometry.prototype,
    'on',
    ol.geom.Geometry.prototype.on);

goog.exportProperty(
    ol.geom.Geometry.prototype,
    'once',
    ol.geom.Geometry.prototype.once);

goog.exportProperty(
    ol.geom.Geometry.prototype,
    'un',
    ol.geom.Geometry.prototype.un);

goog.exportProperty(
    ol.geom.Geometry.prototype,
    'unByKey',
    ol.geom.Geometry.prototype.unByKey);

goog.exportProperty(
    ol.geom.SimpleGeometry.prototype,
    'getClosestPoint',
    ol.geom.SimpleGeometry.prototype.getClosestPoint);

goog.exportProperty(
    ol.geom.SimpleGeometry.prototype,
    'getExtent',
    ol.geom.SimpleGeometry.prototype.getExtent);

goog.exportProperty(
    ol.geom.SimpleGeometry.prototype,
    'simplify',
    ol.geom.SimpleGeometry.prototype.simplify);

goog.exportProperty(
    ol.geom.SimpleGeometry.prototype,
    'transform',
    ol.geom.SimpleGeometry.prototype.transform);

goog.exportProperty(
    ol.geom.SimpleGeometry.prototype,
    'get',
    ol.geom.SimpleGeometry.prototype.get);

goog.exportProperty(
    ol.geom.SimpleGeometry.prototype,
    'getKeys',
    ol.geom.SimpleGeometry.prototype.getKeys);

goog.exportProperty(
    ol.geom.SimpleGeometry.prototype,
    'getProperties',
    ol.geom.SimpleGeometry.prototype.getProperties);

goog.exportProperty(
    ol.geom.SimpleGeometry.prototype,
    'set',
    ol.geom.SimpleGeometry.prototype.set);

goog.exportProperty(
    ol.geom.SimpleGeometry.prototype,
    'setProperties',
    ol.geom.SimpleGeometry.prototype.setProperties);

goog.exportProperty(
    ol.geom.SimpleGeometry.prototype,
    'unset',
    ol.geom.SimpleGeometry.prototype.unset);

goog.exportProperty(
    ol.geom.SimpleGeometry.prototype,
    'changed',
    ol.geom.SimpleGeometry.prototype.changed);

goog.exportProperty(
    ol.geom.SimpleGeometry.prototype,
    'dispatchEvent',
    ol.geom.SimpleGeometry.prototype.dispatchEvent);

goog.exportProperty(
    ol.geom.SimpleGeometry.prototype,
    'getRevision',
    ol.geom.SimpleGeometry.prototype.getRevision);

goog.exportProperty(
    ol.geom.SimpleGeometry.prototype,
    'on',
    ol.geom.SimpleGeometry.prototype.on);

goog.exportProperty(
    ol.geom.SimpleGeometry.prototype,
    'once',
    ol.geom.SimpleGeometry.prototype.once);

goog.exportProperty(
    ol.geom.SimpleGeometry.prototype,
    'un',
    ol.geom.SimpleGeometry.prototype.un);

goog.exportProperty(
    ol.geom.SimpleGeometry.prototype,
    'unByKey',
    ol.geom.SimpleGeometry.prototype.unByKey);

goog.exportProperty(
    ol.geom.Circle.prototype,
    'getFirstCoordinate',
    ol.geom.Circle.prototype.getFirstCoordinate);

goog.exportProperty(
    ol.geom.Circle.prototype,
    'getLastCoordinate',
    ol.geom.Circle.prototype.getLastCoordinate);

goog.exportProperty(
    ol.geom.Circle.prototype,
    'getLayout',
    ol.geom.Circle.prototype.getLayout);

goog.exportProperty(
    ol.geom.Circle.prototype,
    'getClosestPoint',
    ol.geom.Circle.prototype.getClosestPoint);

goog.exportProperty(
    ol.geom.Circle.prototype,
    'getExtent',
    ol.geom.Circle.prototype.getExtent);

goog.exportProperty(
    ol.geom.Circle.prototype,
    'simplify',
    ol.geom.Circle.prototype.simplify);

goog.exportProperty(
    ol.geom.Circle.prototype,
    'get',
    ol.geom.Circle.prototype.get);

goog.exportProperty(
    ol.geom.Circle.prototype,
    'getKeys',
    ol.geom.Circle.prototype.getKeys);

goog.exportProperty(
    ol.geom.Circle.prototype,
    'getProperties',
    ol.geom.Circle.prototype.getProperties);

goog.exportProperty(
    ol.geom.Circle.prototype,
    'set',
    ol.geom.Circle.prototype.set);

goog.exportProperty(
    ol.geom.Circle.prototype,
    'setProperties',
    ol.geom.Circle.prototype.setProperties);

goog.exportProperty(
    ol.geom.Circle.prototype,
    'unset',
    ol.geom.Circle.prototype.unset);

goog.exportProperty(
    ol.geom.Circle.prototype,
    'changed',
    ol.geom.Circle.prototype.changed);

goog.exportProperty(
    ol.geom.Circle.prototype,
    'dispatchEvent',
    ol.geom.Circle.prototype.dispatchEvent);

goog.exportProperty(
    ol.geom.Circle.prototype,
    'getRevision',
    ol.geom.Circle.prototype.getRevision);

goog.exportProperty(
    ol.geom.Circle.prototype,
    'on',
    ol.geom.Circle.prototype.on);

goog.exportProperty(
    ol.geom.Circle.prototype,
    'once',
    ol.geom.Circle.prototype.once);

goog.exportProperty(
    ol.geom.Circle.prototype,
    'un',
    ol.geom.Circle.prototype.un);

goog.exportProperty(
    ol.geom.Circle.prototype,
    'unByKey',
    ol.geom.Circle.prototype.unByKey);

goog.exportProperty(
    ol.geom.GeometryCollection.prototype,
    'getClosestPoint',
    ol.geom.GeometryCollection.prototype.getClosestPoint);

goog.exportProperty(
    ol.geom.GeometryCollection.prototype,
    'getExtent',
    ol.geom.GeometryCollection.prototype.getExtent);

goog.exportProperty(
    ol.geom.GeometryCollection.prototype,
    'simplify',
    ol.geom.GeometryCollection.prototype.simplify);

goog.exportProperty(
    ol.geom.GeometryCollection.prototype,
    'transform',
    ol.geom.GeometryCollection.prototype.transform);

goog.exportProperty(
    ol.geom.GeometryCollection.prototype,
    'get',
    ol.geom.GeometryCollection.prototype.get);

goog.exportProperty(
    ol.geom.GeometryCollection.prototype,
    'getKeys',
    ol.geom.GeometryCollection.prototype.getKeys);

goog.exportProperty(
    ol.geom.GeometryCollection.prototype,
    'getProperties',
    ol.geom.GeometryCollection.prototype.getProperties);

goog.exportProperty(
    ol.geom.GeometryCollection.prototype,
    'set',
    ol.geom.GeometryCollection.prototype.set);

goog.exportProperty(
    ol.geom.GeometryCollection.prototype,
    'setProperties',
    ol.geom.GeometryCollection.prototype.setProperties);

goog.exportProperty(
    ol.geom.GeometryCollection.prototype,
    'unset',
    ol.geom.GeometryCollection.prototype.unset);

goog.exportProperty(
    ol.geom.GeometryCollection.prototype,
    'changed',
    ol.geom.GeometryCollection.prototype.changed);

goog.exportProperty(
    ol.geom.GeometryCollection.prototype,
    'dispatchEvent',
    ol.geom.GeometryCollection.prototype.dispatchEvent);

goog.exportProperty(
    ol.geom.GeometryCollection.prototype,
    'getRevision',
    ol.geom.GeometryCollection.prototype.getRevision);

goog.exportProperty(
    ol.geom.GeometryCollection.prototype,
    'on',
    ol.geom.GeometryCollection.prototype.on);

goog.exportProperty(
    ol.geom.GeometryCollection.prototype,
    'once',
    ol.geom.GeometryCollection.prototype.once);

goog.exportProperty(
    ol.geom.GeometryCollection.prototype,
    'un',
    ol.geom.GeometryCollection.prototype.un);

goog.exportProperty(
    ol.geom.GeometryCollection.prototype,
    'unByKey',
    ol.geom.GeometryCollection.prototype.unByKey);

goog.exportProperty(
    ol.geom.LinearRing.prototype,
    'getFirstCoordinate',
    ol.geom.LinearRing.prototype.getFirstCoordinate);

goog.exportProperty(
    ol.geom.LinearRing.prototype,
    'getLastCoordinate',
    ol.geom.LinearRing.prototype.getLastCoordinate);

goog.exportProperty(
    ol.geom.LinearRing.prototype,
    'getLayout',
    ol.geom.LinearRing.prototype.getLayout);

goog.exportProperty(
    ol.geom.LinearRing.prototype,
    'getClosestPoint',
    ol.geom.LinearRing.prototype.getClosestPoint);

goog.exportProperty(
    ol.geom.LinearRing.prototype,
    'getExtent',
    ol.geom.LinearRing.prototype.getExtent);

goog.exportProperty(
    ol.geom.LinearRing.prototype,
    'simplify',
    ol.geom.LinearRing.prototype.simplify);

goog.exportProperty(
    ol.geom.LinearRing.prototype,
    'transform',
    ol.geom.LinearRing.prototype.transform);

goog.exportProperty(
    ol.geom.LinearRing.prototype,
    'get',
    ol.geom.LinearRing.prototype.get);

goog.exportProperty(
    ol.geom.LinearRing.prototype,
    'getKeys',
    ol.geom.LinearRing.prototype.getKeys);

goog.exportProperty(
    ol.geom.LinearRing.prototype,
    'getProperties',
    ol.geom.LinearRing.prototype.getProperties);

goog.exportProperty(
    ol.geom.LinearRing.prototype,
    'set',
    ol.geom.LinearRing.prototype.set);

goog.exportProperty(
    ol.geom.LinearRing.prototype,
    'setProperties',
    ol.geom.LinearRing.prototype.setProperties);

goog.exportProperty(
    ol.geom.LinearRing.prototype,
    'unset',
    ol.geom.LinearRing.prototype.unset);

goog.exportProperty(
    ol.geom.LinearRing.prototype,
    'changed',
    ol.geom.LinearRing.prototype.changed);

goog.exportProperty(
    ol.geom.LinearRing.prototype,
    'dispatchEvent',
    ol.geom.LinearRing.prototype.dispatchEvent);

goog.exportProperty(
    ol.geom.LinearRing.prototype,
    'getRevision',
    ol.geom.LinearRing.prototype.getRevision);

goog.exportProperty(
    ol.geom.LinearRing.prototype,
    'on',
    ol.geom.LinearRing.prototype.on);

goog.exportProperty(
    ol.geom.LinearRing.prototype,
    'once',
    ol.geom.LinearRing.prototype.once);

goog.exportProperty(
    ol.geom.LinearRing.prototype,
    'un',
    ol.geom.LinearRing.prototype.un);

goog.exportProperty(
    ol.geom.LinearRing.prototype,
    'unByKey',
    ol.geom.LinearRing.prototype.unByKey);

goog.exportProperty(
    ol.geom.LineString.prototype,
    'getFirstCoordinate',
    ol.geom.LineString.prototype.getFirstCoordinate);

goog.exportProperty(
    ol.geom.LineString.prototype,
    'getLastCoordinate',
    ol.geom.LineString.prototype.getLastCoordinate);

goog.exportProperty(
    ol.geom.LineString.prototype,
    'getLayout',
    ol.geom.LineString.prototype.getLayout);

goog.exportProperty(
    ol.geom.LineString.prototype,
    'getClosestPoint',
    ol.geom.LineString.prototype.getClosestPoint);

goog.exportProperty(
    ol.geom.LineString.prototype,
    'getExtent',
    ol.geom.LineString.prototype.getExtent);

goog.exportProperty(
    ol.geom.LineString.prototype,
    'simplify',
    ol.geom.LineString.prototype.simplify);

goog.exportProperty(
    ol.geom.LineString.prototype,
    'transform',
    ol.geom.LineString.prototype.transform);

goog.exportProperty(
    ol.geom.LineString.prototype,
    'get',
    ol.geom.LineString.prototype.get);

goog.exportProperty(
    ol.geom.LineString.prototype,
    'getKeys',
    ol.geom.LineString.prototype.getKeys);

goog.exportProperty(
    ol.geom.LineString.prototype,
    'getProperties',
    ol.geom.LineString.prototype.getProperties);

goog.exportProperty(
    ol.geom.LineString.prototype,
    'set',
    ol.geom.LineString.prototype.set);

goog.exportProperty(
    ol.geom.LineString.prototype,
    'setProperties',
    ol.geom.LineString.prototype.setProperties);

goog.exportProperty(
    ol.geom.LineString.prototype,
    'unset',
    ol.geom.LineString.prototype.unset);

goog.exportProperty(
    ol.geom.LineString.prototype,
    'changed',
    ol.geom.LineString.prototype.changed);

goog.exportProperty(
    ol.geom.LineString.prototype,
    'dispatchEvent',
    ol.geom.LineString.prototype.dispatchEvent);

goog.exportProperty(
    ol.geom.LineString.prototype,
    'getRevision',
    ol.geom.LineString.prototype.getRevision);

goog.exportProperty(
    ol.geom.LineString.prototype,
    'on',
    ol.geom.LineString.prototype.on);

goog.exportProperty(
    ol.geom.LineString.prototype,
    'once',
    ol.geom.LineString.prototype.once);

goog.exportProperty(
    ol.geom.LineString.prototype,
    'un',
    ol.geom.LineString.prototype.un);

goog.exportProperty(
    ol.geom.LineString.prototype,
    'unByKey',
    ol.geom.LineString.prototype.unByKey);

goog.exportProperty(
    ol.geom.MultiLineString.prototype,
    'getFirstCoordinate',
    ol.geom.MultiLineString.prototype.getFirstCoordinate);

goog.exportProperty(
    ol.geom.MultiLineString.prototype,
    'getLastCoordinate',
    ol.geom.MultiLineString.prototype.getLastCoordinate);

goog.exportProperty(
    ol.geom.MultiLineString.prototype,
    'getLayout',
    ol.geom.MultiLineString.prototype.getLayout);

goog.exportProperty(
    ol.geom.MultiLineString.prototype,
    'getClosestPoint',
    ol.geom.MultiLineString.prototype.getClosestPoint);

goog.exportProperty(
    ol.geom.MultiLineString.prototype,
    'getExtent',
    ol.geom.MultiLineString.prototype.getExtent);

goog.exportProperty(
    ol.geom.MultiLineString.prototype,
    'simplify',
    ol.geom.MultiLineString.prototype.simplify);

goog.exportProperty(
    ol.geom.MultiLineString.prototype,
    'transform',
    ol.geom.MultiLineString.prototype.transform);

goog.exportProperty(
    ol.geom.MultiLineString.prototype,
    'get',
    ol.geom.MultiLineString.prototype.get);

goog.exportProperty(
    ol.geom.MultiLineString.prototype,
    'getKeys',
    ol.geom.MultiLineString.prototype.getKeys);

goog.exportProperty(
    ol.geom.MultiLineString.prototype,
    'getProperties',
    ol.geom.MultiLineString.prototype.getProperties);

goog.exportProperty(
    ol.geom.MultiLineString.prototype,
    'set',
    ol.geom.MultiLineString.prototype.set);

goog.exportProperty(
    ol.geom.MultiLineString.prototype,
    'setProperties',
    ol.geom.MultiLineString.prototype.setProperties);

goog.exportProperty(
    ol.geom.MultiLineString.prototype,
    'unset',
    ol.geom.MultiLineString.prototype.unset);

goog.exportProperty(
    ol.geom.MultiLineString.prototype,
    'changed',
    ol.geom.MultiLineString.prototype.changed);

goog.exportProperty(
    ol.geom.MultiLineString.prototype,
    'dispatchEvent',
    ol.geom.MultiLineString.prototype.dispatchEvent);

goog.exportProperty(
    ol.geom.MultiLineString.prototype,
    'getRevision',
    ol.geom.MultiLineString.prototype.getRevision);

goog.exportProperty(
    ol.geom.MultiLineString.prototype,
    'on',
    ol.geom.MultiLineString.prototype.on);

goog.exportProperty(
    ol.geom.MultiLineString.prototype,
    'once',
    ol.geom.MultiLineString.prototype.once);

goog.exportProperty(
    ol.geom.MultiLineString.prototype,
    'un',
    ol.geom.MultiLineString.prototype.un);

goog.exportProperty(
    ol.geom.MultiLineString.prototype,
    'unByKey',
    ol.geom.MultiLineString.prototype.unByKey);

goog.exportProperty(
    ol.geom.MultiPoint.prototype,
    'getFirstCoordinate',
    ol.geom.MultiPoint.prototype.getFirstCoordinate);

goog.exportProperty(
    ol.geom.MultiPoint.prototype,
    'getLastCoordinate',
    ol.geom.MultiPoint.prototype.getLastCoordinate);

goog.exportProperty(
    ol.geom.MultiPoint.prototype,
    'getLayout',
    ol.geom.MultiPoint.prototype.getLayout);

goog.exportProperty(
    ol.geom.MultiPoint.prototype,
    'getClosestPoint',
    ol.geom.MultiPoint.prototype.getClosestPoint);

goog.exportProperty(
    ol.geom.MultiPoint.prototype,
    'getExtent',
    ol.geom.MultiPoint.prototype.getExtent);

goog.exportProperty(
    ol.geom.MultiPoint.prototype,
    'simplify',
    ol.geom.MultiPoint.prototype.simplify);

goog.exportProperty(
    ol.geom.MultiPoint.prototype,
    'transform',
    ol.geom.MultiPoint.prototype.transform);

goog.exportProperty(
    ol.geom.MultiPoint.prototype,
    'get',
    ol.geom.MultiPoint.prototype.get);

goog.exportProperty(
    ol.geom.MultiPoint.prototype,
    'getKeys',
    ol.geom.MultiPoint.prototype.getKeys);

goog.exportProperty(
    ol.geom.MultiPoint.prototype,
    'getProperties',
    ol.geom.MultiPoint.prototype.getProperties);

goog.exportProperty(
    ol.geom.MultiPoint.prototype,
    'set',
    ol.geom.MultiPoint.prototype.set);

goog.exportProperty(
    ol.geom.MultiPoint.prototype,
    'setProperties',
    ol.geom.MultiPoint.prototype.setProperties);

goog.exportProperty(
    ol.geom.MultiPoint.prototype,
    'unset',
    ol.geom.MultiPoint.prototype.unset);

goog.exportProperty(
    ol.geom.MultiPoint.prototype,
    'changed',
    ol.geom.MultiPoint.prototype.changed);

goog.exportProperty(
    ol.geom.MultiPoint.prototype,
    'dispatchEvent',
    ol.geom.MultiPoint.prototype.dispatchEvent);

goog.exportProperty(
    ol.geom.MultiPoint.prototype,
    'getRevision',
    ol.geom.MultiPoint.prototype.getRevision);

goog.exportProperty(
    ol.geom.MultiPoint.prototype,
    'on',
    ol.geom.MultiPoint.prototype.on);

goog.exportProperty(
    ol.geom.MultiPoint.prototype,
    'once',
    ol.geom.MultiPoint.prototype.once);

goog.exportProperty(
    ol.geom.MultiPoint.prototype,
    'un',
    ol.geom.MultiPoint.prototype.un);

goog.exportProperty(
    ol.geom.MultiPoint.prototype,
    'unByKey',
    ol.geom.MultiPoint.prototype.unByKey);

goog.exportProperty(
    ol.geom.MultiPolygon.prototype,
    'getFirstCoordinate',
    ol.geom.MultiPolygon.prototype.getFirstCoordinate);

goog.exportProperty(
    ol.geom.MultiPolygon.prototype,
    'getLastCoordinate',
    ol.geom.MultiPolygon.prototype.getLastCoordinate);

goog.exportProperty(
    ol.geom.MultiPolygon.prototype,
    'getLayout',
    ol.geom.MultiPolygon.prototype.getLayout);

goog.exportProperty(
    ol.geom.MultiPolygon.prototype,
    'getClosestPoint',
    ol.geom.MultiPolygon.prototype.getClosestPoint);

goog.exportProperty(
    ol.geom.MultiPolygon.prototype,
    'getExtent',
    ol.geom.MultiPolygon.prototype.getExtent);

goog.exportProperty(
    ol.geom.MultiPolygon.prototype,
    'simplify',
    ol.geom.MultiPolygon.prototype.simplify);

goog.exportProperty(
    ol.geom.MultiPolygon.prototype,
    'transform',
    ol.geom.MultiPolygon.prototype.transform);

goog.exportProperty(
    ol.geom.MultiPolygon.prototype,
    'get',
    ol.geom.MultiPolygon.prototype.get);

goog.exportProperty(
    ol.geom.MultiPolygon.prototype,
    'getKeys',
    ol.geom.MultiPolygon.prototype.getKeys);

goog.exportProperty(
    ol.geom.MultiPolygon.prototype,
    'getProperties',
    ol.geom.MultiPolygon.prototype.getProperties);

goog.exportProperty(
    ol.geom.MultiPolygon.prototype,
    'set',
    ol.geom.MultiPolygon.prototype.set);

goog.exportProperty(
    ol.geom.MultiPolygon.prototype,
    'setProperties',
    ol.geom.MultiPolygon.prototype.setProperties);

goog.exportProperty(
    ol.geom.MultiPolygon.prototype,
    'unset',
    ol.geom.MultiPolygon.prototype.unset);

goog.exportProperty(
    ol.geom.MultiPolygon.prototype,
    'changed',
    ol.geom.MultiPolygon.prototype.changed);

goog.exportProperty(
    ol.geom.MultiPolygon.prototype,
    'dispatchEvent',
    ol.geom.MultiPolygon.prototype.dispatchEvent);

goog.exportProperty(
    ol.geom.MultiPolygon.prototype,
    'getRevision',
    ol.geom.MultiPolygon.prototype.getRevision);

goog.exportProperty(
    ol.geom.MultiPolygon.prototype,
    'on',
    ol.geom.MultiPolygon.prototype.on);

goog.exportProperty(
    ol.geom.MultiPolygon.prototype,
    'once',
    ol.geom.MultiPolygon.prototype.once);

goog.exportProperty(
    ol.geom.MultiPolygon.prototype,
    'un',
    ol.geom.MultiPolygon.prototype.un);

goog.exportProperty(
    ol.geom.MultiPolygon.prototype,
    'unByKey',
    ol.geom.MultiPolygon.prototype.unByKey);

goog.exportProperty(
    ol.geom.Point.prototype,
    'getFirstCoordinate',
    ol.geom.Point.prototype.getFirstCoordinate);

goog.exportProperty(
    ol.geom.Point.prototype,
    'getLastCoordinate',
    ol.geom.Point.prototype.getLastCoordinate);

goog.exportProperty(
    ol.geom.Point.prototype,
    'getLayout',
    ol.geom.Point.prototype.getLayout);

goog.exportProperty(
    ol.geom.Point.prototype,
    'getClosestPoint',
    ol.geom.Point.prototype.getClosestPoint);

goog.exportProperty(
    ol.geom.Point.prototype,
    'getExtent',
    ol.geom.Point.prototype.getExtent);

goog.exportProperty(
    ol.geom.Point.prototype,
    'simplify',
    ol.geom.Point.prototype.simplify);

goog.exportProperty(
    ol.geom.Point.prototype,
    'transform',
    ol.geom.Point.prototype.transform);

goog.exportProperty(
    ol.geom.Point.prototype,
    'get',
    ol.geom.Point.prototype.get);

goog.exportProperty(
    ol.geom.Point.prototype,
    'getKeys',
    ol.geom.Point.prototype.getKeys);

goog.exportProperty(
    ol.geom.Point.prototype,
    'getProperties',
    ol.geom.Point.prototype.getProperties);

goog.exportProperty(
    ol.geom.Point.prototype,
    'set',
    ol.geom.Point.prototype.set);

goog.exportProperty(
    ol.geom.Point.prototype,
    'setProperties',
    ol.geom.Point.prototype.setProperties);

goog.exportProperty(
    ol.geom.Point.prototype,
    'unset',
    ol.geom.Point.prototype.unset);

goog.exportProperty(
    ol.geom.Point.prototype,
    'changed',
    ol.geom.Point.prototype.changed);

goog.exportProperty(
    ol.geom.Point.prototype,
    'dispatchEvent',
    ol.geom.Point.prototype.dispatchEvent);

goog.exportProperty(
    ol.geom.Point.prototype,
    'getRevision',
    ol.geom.Point.prototype.getRevision);

goog.exportProperty(
    ol.geom.Point.prototype,
    'on',
    ol.geom.Point.prototype.on);

goog.exportProperty(
    ol.geom.Point.prototype,
    'once',
    ol.geom.Point.prototype.once);

goog.exportProperty(
    ol.geom.Point.prototype,
    'un',
    ol.geom.Point.prototype.un);

goog.exportProperty(
    ol.geom.Point.prototype,
    'unByKey',
    ol.geom.Point.prototype.unByKey);

goog.exportProperty(
    ol.geom.Polygon.prototype,
    'getFirstCoordinate',
    ol.geom.Polygon.prototype.getFirstCoordinate);

goog.exportProperty(
    ol.geom.Polygon.prototype,
    'getLastCoordinate',
    ol.geom.Polygon.prototype.getLastCoordinate);

goog.exportProperty(
    ol.geom.Polygon.prototype,
    'getLayout',
    ol.geom.Polygon.prototype.getLayout);

goog.exportProperty(
    ol.geom.Polygon.prototype,
    'getClosestPoint',
    ol.geom.Polygon.prototype.getClosestPoint);

goog.exportProperty(
    ol.geom.Polygon.prototype,
    'getExtent',
    ol.geom.Polygon.prototype.getExtent);

goog.exportProperty(
    ol.geom.Polygon.prototype,
    'simplify',
    ol.geom.Polygon.prototype.simplify);

goog.exportProperty(
    ol.geom.Polygon.prototype,
    'transform',
    ol.geom.Polygon.prototype.transform);

goog.exportProperty(
    ol.geom.Polygon.prototype,
    'get',
    ol.geom.Polygon.prototype.get);

goog.exportProperty(
    ol.geom.Polygon.prototype,
    'getKeys',
    ol.geom.Polygon.prototype.getKeys);

goog.exportProperty(
    ol.geom.Polygon.prototype,
    'getProperties',
    ol.geom.Polygon.prototype.getProperties);

goog.exportProperty(
    ol.geom.Polygon.prototype,
    'set',
    ol.geom.Polygon.prototype.set);

goog.exportProperty(
    ol.geom.Polygon.prototype,
    'setProperties',
    ol.geom.Polygon.prototype.setProperties);

goog.exportProperty(
    ol.geom.Polygon.prototype,
    'unset',
    ol.geom.Polygon.prototype.unset);

goog.exportProperty(
    ol.geom.Polygon.prototype,
    'changed',
    ol.geom.Polygon.prototype.changed);

goog.exportProperty(
    ol.geom.Polygon.prototype,
    'dispatchEvent',
    ol.geom.Polygon.prototype.dispatchEvent);

goog.exportProperty(
    ol.geom.Polygon.prototype,
    'getRevision',
    ol.geom.Polygon.prototype.getRevision);

goog.exportProperty(
    ol.geom.Polygon.prototype,
    'on',
    ol.geom.Polygon.prototype.on);

goog.exportProperty(
    ol.geom.Polygon.prototype,
    'once',
    ol.geom.Polygon.prototype.once);

goog.exportProperty(
    ol.geom.Polygon.prototype,
    'un',
    ol.geom.Polygon.prototype.un);

goog.exportProperty(
    ol.geom.Polygon.prototype,
    'unByKey',
    ol.geom.Polygon.prototype.unByKey);

goog.exportProperty(
    ol.format.GML2.prototype,
    'readFeatures',
    ol.format.GML2.prototype.readFeatures);

goog.exportProperty(
    ol.format.GML3.prototype,
    'readFeatures',
    ol.format.GML3.prototype.readFeatures);

goog.exportProperty(
    ol.format.GML.prototype,
    'readFeatures',
    ol.format.GML.prototype.readFeatures);

goog.exportProperty(
    ol.control.Attribution.prototype,
    'getMap',
    ol.control.Attribution.prototype.getMap);

goog.exportProperty(
    ol.control.Attribution.prototype,
    'setMap',
    ol.control.Attribution.prototype.setMap);

goog.exportProperty(
    ol.control.Attribution.prototype,
    'setTarget',
    ol.control.Attribution.prototype.setTarget);

goog.exportProperty(
    ol.control.Attribution.prototype,
    'get',
    ol.control.Attribution.prototype.get);

goog.exportProperty(
    ol.control.Attribution.prototype,
    'getKeys',
    ol.control.Attribution.prototype.getKeys);

goog.exportProperty(
    ol.control.Attribution.prototype,
    'getProperties',
    ol.control.Attribution.prototype.getProperties);

goog.exportProperty(
    ol.control.Attribution.prototype,
    'set',
    ol.control.Attribution.prototype.set);

goog.exportProperty(
    ol.control.Attribution.prototype,
    'setProperties',
    ol.control.Attribution.prototype.setProperties);

goog.exportProperty(
    ol.control.Attribution.prototype,
    'unset',
    ol.control.Attribution.prototype.unset);

goog.exportProperty(
    ol.control.Attribution.prototype,
    'changed',
    ol.control.Attribution.prototype.changed);

goog.exportProperty(
    ol.control.Attribution.prototype,
    'dispatchEvent',
    ol.control.Attribution.prototype.dispatchEvent);

goog.exportProperty(
    ol.control.Attribution.prototype,
    'getRevision',
    ol.control.Attribution.prototype.getRevision);

goog.exportProperty(
    ol.control.Attribution.prototype,
    'on',
    ol.control.Attribution.prototype.on);

goog.exportProperty(
    ol.control.Attribution.prototype,
    'once',
    ol.control.Attribution.prototype.once);

goog.exportProperty(
    ol.control.Attribution.prototype,
    'un',
    ol.control.Attribution.prototype.un);

goog.exportProperty(
    ol.control.Attribution.prototype,
    'unByKey',
    ol.control.Attribution.prototype.unByKey);

goog.exportProperty(
    ol.control.FullScreen.prototype,
    'getMap',
    ol.control.FullScreen.prototype.getMap);

goog.exportProperty(
    ol.control.FullScreen.prototype,
    'setMap',
    ol.control.FullScreen.prototype.setMap);

goog.exportProperty(
    ol.control.FullScreen.prototype,
    'setTarget',
    ol.control.FullScreen.prototype.setTarget);

goog.exportProperty(
    ol.control.FullScreen.prototype,
    'get',
    ol.control.FullScreen.prototype.get);

goog.exportProperty(
    ol.control.FullScreen.prototype,
    'getKeys',
    ol.control.FullScreen.prototype.getKeys);

goog.exportProperty(
    ol.control.FullScreen.prototype,
    'getProperties',
    ol.control.FullScreen.prototype.getProperties);

goog.exportProperty(
    ol.control.FullScreen.prototype,
    'set',
    ol.control.FullScreen.prototype.set);

goog.exportProperty(
    ol.control.FullScreen.prototype,
    'setProperties',
    ol.control.FullScreen.prototype.setProperties);

goog.exportProperty(
    ol.control.FullScreen.prototype,
    'unset',
    ol.control.FullScreen.prototype.unset);

goog.exportProperty(
    ol.control.FullScreen.prototype,
    'changed',
    ol.control.FullScreen.prototype.changed);

goog.exportProperty(
    ol.control.FullScreen.prototype,
    'dispatchEvent',
    ol.control.FullScreen.prototype.dispatchEvent);

goog.exportProperty(
    ol.control.FullScreen.prototype,
    'getRevision',
    ol.control.FullScreen.prototype.getRevision);

goog.exportProperty(
    ol.control.FullScreen.prototype,
    'on',
    ol.control.FullScreen.prototype.on);

goog.exportProperty(
    ol.control.FullScreen.prototype,
    'once',
    ol.control.FullScreen.prototype.once);

goog.exportProperty(
    ol.control.FullScreen.prototype,
    'un',
    ol.control.FullScreen.prototype.un);

goog.exportProperty(
    ol.control.FullScreen.prototype,
    'unByKey',
    ol.control.FullScreen.prototype.unByKey);

goog.exportProperty(
    ol.control.MousePosition.prototype,
    'getMap',
    ol.control.MousePosition.prototype.getMap);

goog.exportProperty(
    ol.control.MousePosition.prototype,
    'setMap',
    ol.control.MousePosition.prototype.setMap);

goog.exportProperty(
    ol.control.MousePosition.prototype,
    'setTarget',
    ol.control.MousePosition.prototype.setTarget);

goog.exportProperty(
    ol.control.MousePosition.prototype,
    'get',
    ol.control.MousePosition.prototype.get);

goog.exportProperty(
    ol.control.MousePosition.prototype,
    'getKeys',
    ol.control.MousePosition.prototype.getKeys);

goog.exportProperty(
    ol.control.MousePosition.prototype,
    'getProperties',
    ol.control.MousePosition.prototype.getProperties);

goog.exportProperty(
    ol.control.MousePosition.prototype,
    'set',
    ol.control.MousePosition.prototype.set);

goog.exportProperty(
    ol.control.MousePosition.prototype,
    'setProperties',
    ol.control.MousePosition.prototype.setProperties);

goog.exportProperty(
    ol.control.MousePosition.prototype,
    'unset',
    ol.control.MousePosition.prototype.unset);

goog.exportProperty(
    ol.control.MousePosition.prototype,
    'changed',
    ol.control.MousePosition.prototype.changed);

goog.exportProperty(
    ol.control.MousePosition.prototype,
    'dispatchEvent',
    ol.control.MousePosition.prototype.dispatchEvent);

goog.exportProperty(
    ol.control.MousePosition.prototype,
    'getRevision',
    ol.control.MousePosition.prototype.getRevision);

goog.exportProperty(
    ol.control.MousePosition.prototype,
    'on',
    ol.control.MousePosition.prototype.on);

goog.exportProperty(
    ol.control.MousePosition.prototype,
    'once',
    ol.control.MousePosition.prototype.once);

goog.exportProperty(
    ol.control.MousePosition.prototype,
    'un',
    ol.control.MousePosition.prototype.un);

goog.exportProperty(
    ol.control.MousePosition.prototype,
    'unByKey',
    ol.control.MousePosition.prototype.unByKey);

goog.exportProperty(
    ol.control.OverviewMap.prototype,
    'getMap',
    ol.control.OverviewMap.prototype.getMap);

goog.exportProperty(
    ol.control.OverviewMap.prototype,
    'setMap',
    ol.control.OverviewMap.prototype.setMap);

goog.exportProperty(
    ol.control.OverviewMap.prototype,
    'setTarget',
    ol.control.OverviewMap.prototype.setTarget);

goog.exportProperty(
    ol.control.OverviewMap.prototype,
    'get',
    ol.control.OverviewMap.prototype.get);

goog.exportProperty(
    ol.control.OverviewMap.prototype,
    'getKeys',
    ol.control.OverviewMap.prototype.getKeys);

goog.exportProperty(
    ol.control.OverviewMap.prototype,
    'getProperties',
    ol.control.OverviewMap.prototype.getProperties);

goog.exportProperty(
    ol.control.OverviewMap.prototype,
    'set',
    ol.control.OverviewMap.prototype.set);

goog.exportProperty(
    ol.control.OverviewMap.prototype,
    'setProperties',
    ol.control.OverviewMap.prototype.setProperties);

goog.exportProperty(
    ol.control.OverviewMap.prototype,
    'unset',
    ol.control.OverviewMap.prototype.unset);

goog.exportProperty(
    ol.control.OverviewMap.prototype,
    'changed',
    ol.control.OverviewMap.prototype.changed);

goog.exportProperty(
    ol.control.OverviewMap.prototype,
    'dispatchEvent',
    ol.control.OverviewMap.prototype.dispatchEvent);

goog.exportProperty(
    ol.control.OverviewMap.prototype,
    'getRevision',
    ol.control.OverviewMap.prototype.getRevision);

goog.exportProperty(
    ol.control.OverviewMap.prototype,
    'on',
    ol.control.OverviewMap.prototype.on);

goog.exportProperty(
    ol.control.OverviewMap.prototype,
    'once',
    ol.control.OverviewMap.prototype.once);

goog.exportProperty(
    ol.control.OverviewMap.prototype,
    'un',
    ol.control.OverviewMap.prototype.un);

goog.exportProperty(
    ol.control.OverviewMap.prototype,
    'unByKey',
    ol.control.OverviewMap.prototype.unByKey);

goog.exportProperty(
    ol.control.Rotate.prototype,
    'getMap',
    ol.control.Rotate.prototype.getMap);

goog.exportProperty(
    ol.control.Rotate.prototype,
    'setMap',
    ol.control.Rotate.prototype.setMap);

goog.exportProperty(
    ol.control.Rotate.prototype,
    'setTarget',
    ol.control.Rotate.prototype.setTarget);

goog.exportProperty(
    ol.control.Rotate.prototype,
    'get',
    ol.control.Rotate.prototype.get);

goog.exportProperty(
    ol.control.Rotate.prototype,
    'getKeys',
    ol.control.Rotate.prototype.getKeys);

goog.exportProperty(
    ol.control.Rotate.prototype,
    'getProperties',
    ol.control.Rotate.prototype.getProperties);

goog.exportProperty(
    ol.control.Rotate.prototype,
    'set',
    ol.control.Rotate.prototype.set);

goog.exportProperty(
    ol.control.Rotate.prototype,
    'setProperties',
    ol.control.Rotate.prototype.setProperties);

goog.exportProperty(
    ol.control.Rotate.prototype,
    'unset',
    ol.control.Rotate.prototype.unset);

goog.exportProperty(
    ol.control.Rotate.prototype,
    'changed',
    ol.control.Rotate.prototype.changed);

goog.exportProperty(
    ol.control.Rotate.prototype,
    'dispatchEvent',
    ol.control.Rotate.prototype.dispatchEvent);

goog.exportProperty(
    ol.control.Rotate.prototype,
    'getRevision',
    ol.control.Rotate.prototype.getRevision);

goog.exportProperty(
    ol.control.Rotate.prototype,
    'on',
    ol.control.Rotate.prototype.on);

goog.exportProperty(
    ol.control.Rotate.prototype,
    'once',
    ol.control.Rotate.prototype.once);

goog.exportProperty(
    ol.control.Rotate.prototype,
    'un',
    ol.control.Rotate.prototype.un);

goog.exportProperty(
    ol.control.Rotate.prototype,
    'unByKey',
    ol.control.Rotate.prototype.unByKey);

goog.exportProperty(
    ol.control.ScaleLine.prototype,
    'getMap',
    ol.control.ScaleLine.prototype.getMap);

goog.exportProperty(
    ol.control.ScaleLine.prototype,
    'setMap',
    ol.control.ScaleLine.prototype.setMap);

goog.exportProperty(
    ol.control.ScaleLine.prototype,
    'setTarget',
    ol.control.ScaleLine.prototype.setTarget);

goog.exportProperty(
    ol.control.ScaleLine.prototype,
    'get',
    ol.control.ScaleLine.prototype.get);

goog.exportProperty(
    ol.control.ScaleLine.prototype,
    'getKeys',
    ol.control.ScaleLine.prototype.getKeys);

goog.exportProperty(
    ol.control.ScaleLine.prototype,
    'getProperties',
    ol.control.ScaleLine.prototype.getProperties);

goog.exportProperty(
    ol.control.ScaleLine.prototype,
    'set',
    ol.control.ScaleLine.prototype.set);

goog.exportProperty(
    ol.control.ScaleLine.prototype,
    'setProperties',
    ol.control.ScaleLine.prototype.setProperties);

goog.exportProperty(
    ol.control.ScaleLine.prototype,
    'unset',
    ol.control.ScaleLine.prototype.unset);

goog.exportProperty(
    ol.control.ScaleLine.prototype,
    'changed',
    ol.control.ScaleLine.prototype.changed);

goog.exportProperty(
    ol.control.ScaleLine.prototype,
    'dispatchEvent',
    ol.control.ScaleLine.prototype.dispatchEvent);

goog.exportProperty(
    ol.control.ScaleLine.prototype,
    'getRevision',
    ol.control.ScaleLine.prototype.getRevision);

goog.exportProperty(
    ol.control.ScaleLine.prototype,
    'on',
    ol.control.ScaleLine.prototype.on);

goog.exportProperty(
    ol.control.ScaleLine.prototype,
    'once',
    ol.control.ScaleLine.prototype.once);

goog.exportProperty(
    ol.control.ScaleLine.prototype,
    'un',
    ol.control.ScaleLine.prototype.un);

goog.exportProperty(
    ol.control.ScaleLine.prototype,
    'unByKey',
    ol.control.ScaleLine.prototype.unByKey);

goog.exportProperty(
    ol.control.Zoom.prototype,
    'getMap',
    ol.control.Zoom.prototype.getMap);

goog.exportProperty(
    ol.control.Zoom.prototype,
    'setMap',
    ol.control.Zoom.prototype.setMap);

goog.exportProperty(
    ol.control.Zoom.prototype,
    'setTarget',
    ol.control.Zoom.prototype.setTarget);

goog.exportProperty(
    ol.control.Zoom.prototype,
    'get',
    ol.control.Zoom.prototype.get);

goog.exportProperty(
    ol.control.Zoom.prototype,
    'getKeys',
    ol.control.Zoom.prototype.getKeys);

goog.exportProperty(
    ol.control.Zoom.prototype,
    'getProperties',
    ol.control.Zoom.prototype.getProperties);

goog.exportProperty(
    ol.control.Zoom.prototype,
    'set',
    ol.control.Zoom.prototype.set);

goog.exportProperty(
    ol.control.Zoom.prototype,
    'setProperties',
    ol.control.Zoom.prototype.setProperties);

goog.exportProperty(
    ol.control.Zoom.prototype,
    'unset',
    ol.control.Zoom.prototype.unset);

goog.exportProperty(
    ol.control.Zoom.prototype,
    'changed',
    ol.control.Zoom.prototype.changed);

goog.exportProperty(
    ol.control.Zoom.prototype,
    'dispatchEvent',
    ol.control.Zoom.prototype.dispatchEvent);

goog.exportProperty(
    ol.control.Zoom.prototype,
    'getRevision',
    ol.control.Zoom.prototype.getRevision);

goog.exportProperty(
    ol.control.Zoom.prototype,
    'on',
    ol.control.Zoom.prototype.on);

goog.exportProperty(
    ol.control.Zoom.prototype,
    'once',
    ol.control.Zoom.prototype.once);

goog.exportProperty(
    ol.control.Zoom.prototype,
    'un',
    ol.control.Zoom.prototype.un);

goog.exportProperty(
    ol.control.Zoom.prototype,
    'unByKey',
    ol.control.Zoom.prototype.unByKey);

goog.exportProperty(
    ol.control.ZoomSlider.prototype,
    'getMap',
    ol.control.ZoomSlider.prototype.getMap);

goog.exportProperty(
    ol.control.ZoomSlider.prototype,
    'setMap',
    ol.control.ZoomSlider.prototype.setMap);

goog.exportProperty(
    ol.control.ZoomSlider.prototype,
    'setTarget',
    ol.control.ZoomSlider.prototype.setTarget);

goog.exportProperty(
    ol.control.ZoomSlider.prototype,
    'get',
    ol.control.ZoomSlider.prototype.get);

goog.exportProperty(
    ol.control.ZoomSlider.prototype,
    'getKeys',
    ol.control.ZoomSlider.prototype.getKeys);

goog.exportProperty(
    ol.control.ZoomSlider.prototype,
    'getProperties',
    ol.control.ZoomSlider.prototype.getProperties);

goog.exportProperty(
    ol.control.ZoomSlider.prototype,
    'set',
    ol.control.ZoomSlider.prototype.set);

goog.exportProperty(
    ol.control.ZoomSlider.prototype,
    'setProperties',
    ol.control.ZoomSlider.prototype.setProperties);

goog.exportProperty(
    ol.control.ZoomSlider.prototype,
    'unset',
    ol.control.ZoomSlider.prototype.unset);

goog.exportProperty(
    ol.control.ZoomSlider.prototype,
    'changed',
    ol.control.ZoomSlider.prototype.changed);

goog.exportProperty(
    ol.control.ZoomSlider.prototype,
    'dispatchEvent',
    ol.control.ZoomSlider.prototype.dispatchEvent);

goog.exportProperty(
    ol.control.ZoomSlider.prototype,
    'getRevision',
    ol.control.ZoomSlider.prototype.getRevision);

goog.exportProperty(
    ol.control.ZoomSlider.prototype,
    'on',
    ol.control.ZoomSlider.prototype.on);

goog.exportProperty(
    ol.control.ZoomSlider.prototype,
    'once',
    ol.control.ZoomSlider.prototype.once);

goog.exportProperty(
    ol.control.ZoomSlider.prototype,
    'un',
    ol.control.ZoomSlider.prototype.un);

goog.exportProperty(
    ol.control.ZoomSlider.prototype,
    'unByKey',
    ol.control.ZoomSlider.prototype.unByKey);

goog.exportProperty(
    ol.control.ZoomToExtent.prototype,
    'getMap',
    ol.control.ZoomToExtent.prototype.getMap);

goog.exportProperty(
    ol.control.ZoomToExtent.prototype,
    'setMap',
    ol.control.ZoomToExtent.prototype.setMap);

goog.exportProperty(
    ol.control.ZoomToExtent.prototype,
    'setTarget',
    ol.control.ZoomToExtent.prototype.setTarget);

goog.exportProperty(
    ol.control.ZoomToExtent.prototype,
    'get',
    ol.control.ZoomToExtent.prototype.get);

goog.exportProperty(
    ol.control.ZoomToExtent.prototype,
    'getKeys',
    ol.control.ZoomToExtent.prototype.getKeys);

goog.exportProperty(
    ol.control.ZoomToExtent.prototype,
    'getProperties',
    ol.control.ZoomToExtent.prototype.getProperties);

goog.exportProperty(
    ol.control.ZoomToExtent.prototype,
    'set',
    ol.control.ZoomToExtent.prototype.set);

goog.exportProperty(
    ol.control.ZoomToExtent.prototype,
    'setProperties',
    ol.control.ZoomToExtent.prototype.setProperties);

goog.exportProperty(
    ol.control.ZoomToExtent.prototype,
    'unset',
    ol.control.ZoomToExtent.prototype.unset);

goog.exportProperty(
    ol.control.ZoomToExtent.prototype,
    'changed',
    ol.control.ZoomToExtent.prototype.changed);

goog.exportProperty(
    ol.control.ZoomToExtent.prototype,
    'dispatchEvent',
    ol.control.ZoomToExtent.prototype.dispatchEvent);

goog.exportProperty(
    ol.control.ZoomToExtent.prototype,
    'getRevision',
    ol.control.ZoomToExtent.prototype.getRevision);

goog.exportProperty(
    ol.control.ZoomToExtent.prototype,
    'on',
    ol.control.ZoomToExtent.prototype.on);

goog.exportProperty(
    ol.control.ZoomToExtent.prototype,
    'once',
    ol.control.ZoomToExtent.prototype.once);

goog.exportProperty(
    ol.control.ZoomToExtent.prototype,
    'un',
    ol.control.ZoomToExtent.prototype.un);

goog.exportProperty(
    ol.control.ZoomToExtent.prototype,
    'unByKey',
    ol.control.ZoomToExtent.prototype.unByKey);
