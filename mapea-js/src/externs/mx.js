/**
 * @externs
 */

/* typedefs for object literals provided by applications */

/**
 * Namespace.
 * @type {Object}
 */
Mx.config;

/**
 * Mapea url
 * @type {string}
 */
Mx.config.MAPEA_URL;

/**
 * The path to the Mapea proxy to send
 * jsonp requests
 * @type {string}
 */
Mx.config.PROXY_PATH;

/**
 * The path to the Mapea proxy to send
 * jsonp requests
 * @type {string}
 */
Mx.config.PROXY_POST_PATH;

/**
 * The path to the Mapea templates
 * @type {string}
 */
Mx.config.TEMPLATES_PATH;

/**
 * The Geosearch URL
 * @type {string}
 */
Mx.config.GEOSEARCH_URL;

/**
 * Distance
 * @type {Number}
 */
Mx.config.GEOSEARCH_DISTANCE;

/**
 * Name of the spatial field
 * @type {string}
 */
Mx.config.GEOSEARCH_SPATIAL_FIELD;

/**
 * Predefined WMC files. It is composed of URL,
 * predefined name and context name.
 * @type {object}
 */
Mx.config.predefinedWMC;

/**
 * Predefined WMC URLs
 * @type {Array<string>}
 */
Mx.config.predefinedWMC.urls;

/**
 * WMC predefined names
 * @type {Array<string>}
 */
Mx.config.predefinedWMC.predefinedNames;

/**
 * WMC context names
 * @type {Array<string>}
 */
Mx.config.predefinedWMC.names;

/**
 * Default projection
 * @type {string}
 */
Mx.config.DEFAULT_PROJ;

/**
 * Namespace.
 * @type {Object}
 */
Mx.parameters;

/**
 * Object literal with config options for the map provided by the user.
 * @typedef {{
 *     container: (Object|string)
 * }}
 * @api
 */
Mx.parameters.Map;


/**
 * Container where the map will be loaded
 * @type {Object|string}
 * @api stable
 */
Mx.parameters.Map.prototype.container;

/**
 * Map layers
 * @type {Mx.parameters.Layer|Array<Mx.parameters.Layer>}
 * @api stable
 */
Mx.parameters.Map.prototype.layers;

/**
 * WMC layers of the map
 * @type {Mx.parameters.WMC|Array<Mx.parameters.WMC>}
 * @api stable
 */
Mx.parameters.Map.prototype.wmc;

/**
 * WMC layers of the map
 * @type {Mx.parameters.WMC|Array<Mx.parameters.WMC>}
 * @api stable
 */
Mx.parameters.Map.prototype.wmcfile;

/**
 * WMC layers of the map
 * @type {Mx.parameters.WMC|Array<Mx.parameters.WMC>}
 * @api stable
 */
Mx.parameters.Map.prototype.wmcfiles;

/**
 * WMS layers of the map
 * @type {Mx.parameters.WMS|Array<Mx.parameters.WMS>}
 * @api stable
 */
Mx.parameters.Map.prototype.wms;

/**
 * WMS layers of the map
 * @type {Mx.parameters.WMTS|Array<Mx.parameters.WMTS>}
 * @api stable
 */
Mx.parameters.Map.prototype.wmts;

/**
 * WFS layers of the map
 * @type {Mx.parameters.WFS|Array<Mx.parameters.WFS>}
 * @api stable
 */
Mx.parameters.Map.prototype.wfs;

/**
 * KML layers of the map
 * @type {Mx.parameters.KML|Array<Mx.parameters.KML>}
 * @api stable
 */
Mx.parameters.Map.prototype.kml;

/**
 * Controls of the map
 * @type {Mx.parameters.Control|Array<Mx.parameters.Control>}
 * @api stable
 */
Mx.parameters.Map.prototype.controls;

/**
 * GetFeatureInfo control
 * @type {Mx.parameters.Control}
 * @api stable
 */
Mx.parameters.Map.prototype.getfeatureinfo;

/**
 * Maximum extent parameter
 * @type {String|Array<String>|Array<Number>|Mx.Extent}
 * @api stable
 */
Mx.parameters.Map.prototype.maxExtent;

/**
 * Maximum extent parameter
 * @type {String|Array<String>|Array<Number>|Mx.Extent}
 * @api stable
 */
Mx.parameters.Map.prototype.maxextent;

/**
 * Bbox parameter
 * @type {String|Array<String>|Array<Number>|Mx.Extent}
 * @api stable
 */
Mx.parameters.Map.prototype.bbox;

/**
 * Resolutions parameter
 * @type {String|Array<String>|Array<Number>}
 * @api stable
 */
Mx.parameters.Map.prototype.resolutions;

/**
 * Object literal with config options for the map
 * @typedef {{
 *     renderer: (String)
 * }}
 * @api stable
 */
Mx.parameters.MapOptions;

/**
 * Map renderer
 * @type {String}
 * @api stable
 */
Mx.parameters.MapOptions.renderer;

/**
 * Object literal with config options for a lyaer
 * @typedef {{
 *     minResolution: (Number),
 *     maxResolution: (Number),
 *     minScale: (Number),
 *     maxScale: (Number),
 * }}
 * @api stable
 */
Mx.parameters.LayerOptions;

/**
 * Min resolution
 * @type {Number}
 * @api stable
 */
Mx.parameters.LayerOptions.minResolution;

/**
 * Max resolution
 * @type {Number}
 * @api stable
 */
Mx.parameters.LayerOptions.minResolution;

/**
 * Max scale
 * @type {Number}
 * @api stable
 */
Mx.parameters.LayerOptions.minScale;

/**
 * Max scale
 * @type {Number}
 * @api stable
 */
Mx.parameters.LayerOptions.maxScale;

/**
 * Is base layer
 * @type {Boolean}
 * @api stable
 */
Mx.parameters.LayerOptions.isBaseLayer;

/**
 * Object literal with config options for the WMC layer provided by the user.
 * @typedef {{
 *     type: (string),
 *     url: (string),
 *     name: (string)
 * }}
 * @api
 */
Mx.parameters.WMC;

/**
 * Type of the WMC layer
 * @type {string}
 * @api stable
 */
Mx.parameters.WMC.prototype.type;

/**
 * Name of the WMC layer
 * @type {string}
 * @api stable
 */
Mx.parameters.WMC.prototype.name;

/**
 * Service URL of the WMC layer
 * @type {string}
 * @api stable
 */
Mx.parameters.WMC.prototype.url;

/**
 * Resolutions specified for all layers
 * @type {Array<Number>}
 * @api stable
 */
Mx.parameters.WMC.prototype.resolutions;

/**
 * Object literal with config options for the WMS layer provided by the user.
 * @typedef {{
 *     type: (string),
 *     url: (string),
 *     name: (string)
 * }}
 * @api
 */
Mx.parameters.WMS;

/**
 * Type of the WMS layer
 * @type {string}
 * @api stable
 */
Mx.parameters.WMS.prototype.type;

/**
 * Name of the WMS layer
 * @type {string}
 * @api stable
 */
Mx.parameters.WMS.prototype.name;

/**
 * Title of the WMS layer
 * @type {string}
 * @api stable
 */
Mx.parameters.WMS.prototype.legend;

/**
 * Service URL of the WMS layer
 * @type {string}
 * @api stable
 */
Mx.parameters.WMS.prototype.url;

/**
 * Transparence of the WMS layer
 * @type {boolean}
 * @api stable
 */
Mx.parameters.WMS.prototype.transparent;

/**
 * Tiled of the WMS layer
 * @type {boolean}
 * @api stable
 */
Mx.parameters.WMS.prototype.tiled;

/**
 * CQL filter of the WMS layer
 * @type {sring}
 * @api stable
 */
Mx.parameters.WMS.prototype.cql;

/**
 * Version of the WMS service
 * @type {string}
 * @api stable
 */
Mx.parameters.WMS.prototype.version;

/**
 * Object literal with config options for the WMTS layer provided by the user.
 * @typedef {{
 *     type: (string),
 *     url: (string),
 *     name: (string)
 * }}
 * @api
 */
Mx.parameters.WMTS;

/**
 * Type of the WMTS layer
 * @type {string}
 * @api stable
 */
Mx.parameters.WMTS.prototype.type;

/**
 * Name of the WMTS layer
 * @type {string}
 * @api stable
 */
Mx.parameters.WMTS.prototype.name;

/**
 * Title of the WMTS layer
 * @type {string}
 * @api stable
 */
Mx.parameters.WMTS.prototype.legend;

/**
 * Service URL of the WMTS layer
 * @type {string}
 * @api stable
 */
Mx.parameters.WMTS.prototype.url;

/**
 * matrix set of the WMTS layer
 * @type {string}
 * @api stable
 */
Mx.parameters.WMTS.prototype.matrixSet;

/**
* Version of the WMS service
   * @type {
      string
   } * @api stable

Mx.parameters.WMS.prototype.setResolutions;*/

/**
 * Object literal with config options for the WFS layer provided by the user.
 * @typedef {{
 *     type: (string),
 *     url: (string),
 *     name: (string)
 * }}
 * @api
 */
Mx.parameters.WFS;

/**
 * Type of the WFS layer
 * @type {string}
 * @api stable
 */
Mx.parameters.WFS.prototype.type;

/**
 * Name of the WFS layer
 * @type {string}
 * @api stable
 */
Mx.parameters.WFS.prototype.name;

/**
 * Title of the WFS layer
 * @type {string}
 * @api stable
 */
Mx.parameters.WFS.prototype.legend;

/**
 * Service URL of the WFS layer
 * @type {string}
 * @api stable
 */
Mx.parameters.WFS.prototype.url;

/**
 * Transparence of the WFS layer
 * @type {boolean}
 * @api stable
 */
Mx.parameters.WFS.prototype.namespace;

/**
 * Tiled of the WFS layer
 * @type {boolean}
 * @api stable
 */
Mx.parameters.WFS.prototype.ids;

/**
 * Tiled of the WFS layer
 * @type {boolean}
 * @api stable
 */
Mx.parameters.WFS.prototype.geometry;

/**
 * CQL filter of the WFS layer
 * @type {sring}
 * @api stable
 */
Mx.parameters.WFS.prototype.cql;

/**
 * Version of the WFS service
 * @type {string}
 * @api stable
 */
Mx.parameters.WFS.prototype.version;

/**
 * Object literal with config options for the KML layer provided by the user.
 * @typedef {{
 *     type: (string),
 *     url: (string),
 *     name: (string)
 * }}
 * @api
 */
Mx.parameters.KML;

/**
 * Type of the KML layer
 * @type {string}
 * @api stable
 */
Mx.parameters.KML.prototype.type;

/**
 * Name of the KML layer
 * @type {string}
 * @api stable
 */
Mx.parameters.KML.prototype.name;

/**
 * Service URL of the KML layer
 * @type {string}
 * @api stable
 */
Mx.parameters.KML.prototype.url;

/**
 * Extract attribute of the KML layer
 * @type {boolean}
 * @api stable
 */
Mx.parameters.KML.prototype.extract;

/**
 * Object literal with config options for the layer provided by the user.
 * @typedef {{
 *     type: (string),
 *     url: (string),
 *     name: (string)
 * }}
 * @api
 */
Mx.parameters.Layer;

/**
 * Type of the WMC layer
 * @type {string}
 * @api stable
 */
Mx.parameters.Layer.prototype.type;

/**
 * Name of the WMC layer
 * @type {string}
 * @api stable
 */
Mx.parameters.Layer.prototype.name;

/**
 * Service URL of the WMC layer
 * @type {string}
 * @api stable
 */
Mx.parameters.Layer.prototype.url;


/**
 * Object literal with x y coordinates for an extent.
 * @typedef {{
 *     x: (Object),
 *     y: (Object)
 * }}
 * @api stable
 */
Mx.Extent;

/**
 * Object literal with x coordinate for an extent.
 * @typedef {{
 *     min: (Number),
 *     max: (Object)
 * }}
 * @api stable
 */
Mx.Extent.x;

/**
 * Object literal with y coordinate for an extent.
 * @typedef {{
 *     min: (Number),
 *     max: (Object)
 * }}
 * @api stable
 */
Mx.Extent.y;

/**
 * Plugin provided by the user
 * @typedef {{
 *     addTo: (function)
 * }}
 * @api
 */
Mx.Plugin;

/**
 * This function adds the plugin to the specified map
 * @public
 * @function
 * @api
 */
Mx.Plugin.prototype.addTo;

/**
 * Object literal representing a response
 * @typedef {{
 *     responseTxt: (String),
 *     responseXml: (Document)
 * }}
 * @api stable
 */
Mx.Response;

/**
 * Response in text format
 * @type {String}
 * @api stable
 */
Mx.Response.responseTxt;

/**
 * Document of the response
 * @type {Document}
 * @api stable
 */
Mx.Response.responseXml;

/**
 * Object literal representing a GetCapabilities response
 * @typedef {{
 *     Capability: (Mx.GetCapabilities.Capability)
 * }}
 * @api stable
 */
Mx.GetCapabilities;

/**
 * Object literal representing the service capability
 * @typedef {{
 *     Layer: (Mx.GetCapabilities.Capability.Layer)
 * }}
 * @api stable
 */
Mx.GetCapabilities.Capability;

/**
 * Object literal representing a layer from GetCapabilities response
 * @typedef {{
 *     Name: (Mx.GetCapabilities.Capability.Layer.Name)
 * }}
 * @api stable
 */
Mx.GetCapabilities.Capability.Layer;

/**
 * Name of a layer from capabilities
 * @type {String}
 * @api stable
 */
Mx.GetCapabilities.Capability.Layer.Name;

/**
 * Bounding box of a layer from capabilities
 * @type {Object}
 * @api stable
 */
Mx.GetCapabilities.Capability.Layer.BoundingBox;

/**
 * Extent of a layer from capabilities
 * @type {Array<Number>}
 * @api stable
 */
Mx.GetCapabilities.Capability.Layer.BoundingBox.extent;

/**
 * Extent of a layer from capabilities
 * @type {Array<Number>}
 * @api stable
 */
Mx.GetCapabilities.Capability.Layer.SRS;

/**
 * Extent of a layer from capabilities
 * @type {Array<Number>}
 * @api stable
 */
Mx.GetCapabilities.Capability.Layer.crs;
/**
 * Extent of a layer from capabilities
 * @type {Array<Number>}
 * @api stable
 */
Mx.GetCapabilities.Capability.Layer.CRS;

/**
 * Object literal representing a WMTS GetCapabilities response
 * @typedef {{
 *     Capability: (Mx.WMTSGetCapabilities.Contents)
 * }}
 * @api stable
 */
Mx.WMTSGetCapabilities;

/**
 * Object literal representing the service content
 * @typedef {{
 *     Layer: (Mx.WMTSGetCapabilities.Contents.Layer)
 * }}
 * @api stable
 */
Mx.WMTSGetCapabilities.Contents;

/**
 * Object literal representing a layer from WMTS GetCapabilities response
 * @typedef {{
 *     Identifier: (Mx.WMTSGetCapabilities.Contents.Layer.Identifier),
 *     Format: (Mx.WMTSGetCapabilities.Contents.Layer.Format)
 * }}
 * @api stable
 */
Mx.WMTSGetCapabilities.Contents.Layer;

/**
 * Identifier of a layer from capabilities
 * @type {String}
 * @api stable
 */
Mx.WMTSGetCapabilities.Contents.Layer.Identifier;

/**
 * Format of a layer from capabilities
 * @type {String}
 * @api stable
 */
Mx.WMTSGetCapabilities.Contents.Layer.Format;

/**
 * @type {String}
 * @api stable
 */
Mx.WMTSGetCapabilities.TileMatrixSetLink;

/**
 * @type {String}
 * @api stable
 */
Mx.WMTSGetCapabilities.TileMatrixSet;

/**
 * @type {String}
 * @api stable
 */
Mx.WMTSGetCapabilities.TileMatrix;