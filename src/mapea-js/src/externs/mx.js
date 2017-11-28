/**
 * @externs
 */

/* typedefs for object literals provided by applications */

/**
 * @namespace Mx
 */

/**
 * @namespace Mx.config
 */

/**
 * @namespace Mx.config
 */

/**
 * @namespace Mx.parameters
 */

/**
 * @namespace Mx.Center
 */

/**
 * @namespace Mx.OverviewMapOpts
 */

/**
 * @namespace Mx.Popup
 */

/**
 * Namespace.
 * @type {Object}
 */
Mx.config;

/**
 * Pixels width for mobile devices
 * @type {Number}
 */
Mx.config.MOBILE_WIDTH;

/**
 * Mapea url
 * @type {string}
 */
Mx.config.MAPEA_URL;

/**
 * The URL to the Mapea proxy to send
 * jsonp requests
 * @type {string}
 */
Mx.config.PROXY_URL;

/**
 * The URL to the Mapea proxy to send
 * jsonp requests
 * @type {string}
 */
Mx.config.PROXY_POST_URL;

/**
 * The path to the Mapea templates
 * @type {string}
 */
Mx.config.TEMPLATES_PATH;

/**
 * The Mapea theme URL
 * @type {string}
 */
Mx.config.THEME_URL;

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
 * TODO
 * @type {String}
 */
M.config.MAPBOX_URL;

/**
 * TODO
 * @type {String}
 */
M.config.MAPBOX_EXTENSION;

/**
 * TODO
 * @type {String}
 */
M.config.MAPBOX_TOKEN_NAME;

/**
 * TODO
 * @type {String}
 */
M.config.MAPBOX_TOKEN_VALUE;

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
 * TODO
 * @type {object}
 */
Mx.config.tileMappgins;

/**
 * TODO
 * @type {Array<string>}
 */
Mx.config.tileMappgins.tiledNames;

/**
 * TODO
 * @type {Array<string>}
 */
Mx.config.tileMappgins.tiledUrls;

/**
 * TODO
 * @type {Array<string>}
 */
Mx.config.tileMappgins.names;

/**
 * TODO
 * @type {Array<string>}
 */
Mx.config.tileMappgins.urls;

/**
 * Default projection
 * @type {string}
 */
Mx.config.DEFAULT_PROJ;

/**
 * Default projection
 * @type {string}
 */
Mx.config.geoprint.URL;

/**
 * Default projection
 * @type {string}
 */
Mx.config.geoprint.DPI;

/**
 * Default projection
 * @type {string}
 */
Mx.config.geoprint.FORMAT;

/**
 * Default projection
 * @type {string}
 */
Mx.config.geoprint.TEMPLATE;

/**
 * Default projection
 * @type {string}
 */
Mx.config.geoprint.FORCE_SCALE;

/**
 * TODO
 * @type {string}
 */
Mx.config.geoprint.LEGEND;

/**
 * Default projection
 * @type {string}
 */
Mx.config.panels.TOOLS;

/**
 * Default projection
 * @type {string}
 */
Mx.config.panels.EDITION;

/**
 * Object literal with config options for the map provided by the user.
 * @typedef {{
 *     container: (Object|string)
 * }}
 * @api @stable
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
 * Object literal with config options for the map provided by the user.
 * @typedef {{
 *     container: (Object|string)
 * }}
 * @api
 */
Mx.parameters.Panel;

/**
 * Flag to indicate if the panel is collapsible
 * @type {boolean}
 * @api stable
 */
Mx.parameters.Panel.collapsible;

/**
 * Position of the panel
 * @type {string}
 * @api stable
 */
Mx.parameters.Panel.position;

/**
 * Flag to indicate if the panel is collapsed
 * @type {boolean}
 * @api stable
 */
Mx.parameters.Panel.collapsed;

/**
 * Flag to indicate if manages multi-activation
 * @type {boolean}
 * @api stable
 */
Mx.parameters.Panel.multiActivation;

/**
 * class name for panel
 * @type {String}
 * @api stable
 */
Mx.parameters.Panel.className;

/**
 * class name for collapsed button
 * @type {String}
 * @api stable
 */
Mx.parameters.Panel.collapsedButtonClass;

/**
 * class name for opened button
 * @type {String}
 * @api stable
 */
Mx.parameters.Panel.openedButtonClass;

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
 * Object literal with config options for a layer
 * @typedef {{
 *     minResolution: (Number),
 *     maxResolution: (Number),
 *     minScale: (Number),
 *     maxScale: (Number)
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
 * Number of zoom levels for the laeyr
 * @type {Number}
 * @api stable
 */
Mx.parameters.WMC.prototype.numZoomLevels;

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
 * Flag to indicate if the layers is animated
 * @type {boolean}
 * @api stable
 */
Mx.parameters.WMS.prototype.animated;

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
 * CQL filter of the WFS layer
 * @type {sring}
 * @api stable
 */
Mx.parameters.WFS.prototype.ecql;

/**
 * Version of the WFS service
 * @type {string}
 * @api stable
 */
Mx.parameters.WFS.prototype.version;

/**
 * Object literal with config options for a WFS
 * @typedef {{
 *     getFeatureOutputFormat: (String),
 *     describeFeatureTypeOutputFormat: (String),
 * }}
 * @api stable
 */
Mx.parameters.WFSOptions;

/**
 * GetFeature output format
 * @type {String}
 * @api stable
 */
Mx.parameters.WFSOptions.getFeatureOutputFormat;

/**
 * DescribeFeatureType output format
 * @type {String}
 * @api stable
 */
Mx.parameters.WFSOptions.describeFeatureTypeOutputFormat;

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
 * Object literal with config options for the GeoJSON layer provided by the user.
 * @typedef {{
 *     source: (Array<JSON>),
 *     hide: (Array<string>),
 *     show: (Array<string>),
 *     properties: (Object)
 * }}
 * @api
 */
Mx.parameters.GeoJSON;

/**
 * GeoJSON elements as source
 * @type {Array<JSON>}
 * @api stable
 */
Mx.parameters.GeoJSON.prototype.source;

/**
 * attributes to hide from info
 * @type {Array<string>}
 * @api stable
 */
Mx.parameters.GeoJSON.prototype.hide;

/**
 * attributes to show from info
 * @type {Array<string>}
 * @api stable
 */
Mx.parameters.GeoJSON.prototype.show;

/**
 * attributes to show from info
 * @type {Array<string>}
 * @api stable
 */
Mx.parameters.GeoJSON.prototype.properties;

/**
 * Vendor properties from GeoJSON
 * @type {Object}
 * @api stable
 */
Mx.parameters.GeoJSON.prototype.properties.vendor;

/**
 * Vendor properties of Mapea from GeoJSON
 * @type {Object}
 * @api stable
 */
Mx.parameters.GeoJSON.prototype.properties.vendor.mapea;

/**
 * Icon properties for GeoJSON
 * @type {Object}
 * @api stable
 */
Mx.parameters.GeoJSON.prototype.properties.vendor.mapea.icon;

/**
 * Object literal with config options for the Mapbox layer provided by the user.
 * @typedef {{
 *     accessToken: (String)
 * }}
 * @api
 */
Mx.parameters.Mapbox;

/**
 * Mapbox token API
 * @type {String}
 * @api stable
 */
Mx.parameters.Mapbox.prototype.accessToken;

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
 * Object literal with config options for a template
 * @typedef {{
 *     vars: (Object),
 *     parseToHtml: (boolean),
 *     jsonp: (boolean),
 *     scope: (Object)
 * }}
 * @api stable
 */
Mx.parameters.TemplateOptions;

/**
 * Min resolution
 * @type {Number}
 * @api stable
 */
Mx.parameters.TemplateOptions.vars;
/**
 * parseToHtml
 * @type {Number}
 * @api stable
 */
Mx.parameters.TemplateOptions.parseToHtml;
/**
 * jsonp
 * @type {Number}
 * @api stable
 */
Mx.parameters.TemplateOptions.jsonp;
/**
 * scope
 * @type {Number}
 * @api stable
 */
Mx.parameters.TemplateOptions.scope;

/**
 * Object literal with config options for Autocomplete
 * @typedef {{
 *     locality: (number),
 *     target: (HTMLElement),
 *     html: (HTMLElement)
 * }}
 * @api stable
 */
Mx.parameters.Autocomplete;
/**
 * INE code to specify the search
 * @type {number}
 * @api stable
 */
Mx.parameters.Autocomplete.locality;
/**
 * Input searchstreet
 * @type {HTMLElement}
 * @api stable
 */
Mx.parameters.Autocomplete.target;
/**
 * Container searchstreet
 * @type {HTMLElement}
 * @api stable
 */
Mx.parameters.Autocomplete.html;

/**
 * Object literal with config options for Searchstreet
 * @typedef {{
 *     locality: (number)
 * }}
 * @api stable
 */
Mx.parameters.Searchstreet;
/**
 * INE code to specify the search
 * @type {number}
 * @api stable
 */
Mx.parameters.Searchstreet.locality;

/**
 * Object literal with config options for SearchstreetGeosearch
 * @typedef {{
 *     locality: (number)
 * }}
 * @api stable
 */
Mx.parameters.SearchstreetGeosearch;
/**
 * INE code to specify the search
 * @type {number}
 * @api stable
 */
Mx.parameters.SearchstreetGeosearch.locality;

/**
 * Object literal with config options for Geosearchbylocation
 * @typedef {{
 *     distance: (number),
 *     core: (string),
 *     url: (string),
 *     handler: (string)
 * }}
 * @api stable
 */
Mx.parameters.Geosearchbylocation;
/**
 * Distance search
 * @type {number}
 * @api stable
 */
Mx.parameters.Geosearchbylocation.distance;
/**
 * Core to the URL for the query
 * @type {string}
 * @api stable
 */
Mx.parameters.Geosearchbylocation.core;
/**
 * URL for the query
 * @type {string}
 * @api stable
 */
Mx.parameters.Geosearchbylocation.url;
/**
 * Handler to the URL for the query
 * @type {string}
 * @api stable
 */
Mx.parameters.Geosearchbylocation.handler;

/**
 * Object literal with x y coordinates for an extent.
 * @typedef {{
 *     x: (Object),
 *     y: (Object),
 *    draw: (boolean)
 * }}
 * @api stable
 */
Mx.Center;

/**
 * TODO
 * @type {Number}
 * @api stable
 */
Mx.Center.x;

/**
 * TODO
 * @type {Number}
 * @api stable
 */
Mx.Center.y;

/**
 * TODO
 * @type {boolean}
 * @api stable
 */
Mx.Center.draw;

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
 * TODO
 * @type {Number}
 * @api stable
 */
Mx.Extent.x.min;

/**
 * TODO
 * @type {Number}
 * @api stable
 */
Mx.Extent.x.max;
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
 * TODO
 * @type {Number}
 * @api stable
 */
Mx.Extent.y.min;

/**
 * TODO
 * @type {Number}
 * @api stable
 */
Mx.Extent.y.max;

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
 *    Capability: (Mx.GetCapabilities.Capability),
 *    singleTile: ({boolean}),
 *    queryable: ({boolean})
 * }}
 * @api stable
 */
Mx.GetCapabilities;

/**
 * Object literal representing the service capability
 * @typedef {boolean}
 * @api stable
 */
Mx.GetCapabilities.singleTile;

/**
 * Object literal representing the service capability
 * @typedef {boolean}
 * @api stable
 */
Mx.GetCapabilities.queryable;

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


/**
 * Object literal representing a Event in Mapea
 * @typedef {{
 *     coord: (Mx.Evt.coord),
 *     pixel: (Mx.Evt.pixel),
 *     vendor: (Mx.Evt.vendor)
 * }}
 * @api stable
 */
Mx.Event;

/**
 * @type {Array<Number>}
 * @api stable
 */
Mx.Event.coord;

/**
 * @type {Array<Number>}
 * @api stable
 */
Mx.Event.pixel;

/**
 * @type {Object}
 * @api stable
 */
Mx.Event.vendor;

/**
 * Object literal representing a WFS DescribeFeatureType response
 * @typedef {{
 *     targetNamespace: (String),
 *     targetPrefix: (String),
 *     localType: (String)
 * }}
 * @api stable
 */
Mx.WFSDescribeFeatureType;

/**
 * @type {String}
 * @api stable
 */
Mx.WFSDescribeFeatureType.targetNamespace;

/**
 * @type {String}
 * @api stable
 */
Mx.WFSDescribeFeatureType.targetPrefix;

/**
 * @type {String}
 * @api stable
 */
Mx.WFSDescribeFeatureType.localType;

/**
 * Object literal representing a OverviewMap options
 * @typedef {{
 *     toggleDelay: (Boolean)
 * }}
 * @api stable
 */
Mx.OverviewMapOpts;

/**
 * @type {String}
 * @api stable
 */
Mx.OverviewMapOpts.toggleDelay;


/**
 * Object literal representing a M.Popup options
 * @typedef {{
 *     content: (HTMLElement)
 * }}
 * @api stable
 */
Mx.Popup;

/**
 * @type {HTMLElement}
 * @api stable
 */
Mx.Popup.content;

/**
 * Describe Feature WFST
 * @typedef {{
 *     geometryName: (string),
 *     featureNS: (string),
 *     featurePrefix: (string),
 *     properties: (array)
 * }}
 * @api stable
 */
Mx.describeFeatureType.WFSTBase;

/**
 * Name geometry
 * @type {string}
 * @api stable
 */
Mx.describeFeatureType.WFSTBase.geometryName;

/**
 * Feature NS
 * @type {string}
 * @api stable
 */
Mx.describeFeatureType.WFSTBase.featureNS;

/**
 * Prefix feature
 * @type {string}
 * @api stable
 */
Mx.describeFeatureType.WFSTBase.featurePrefix;

/**
 * Properties feature
 * @type {array}
 * @api stable
 */
Mx.describeFeatureType.WFSTBase.properties;

/**
 * Panel collapse
 * @type {function}
 * @api stable
 */
Mx.ui.Panel.prototype.collapse;

/**
 * GeoJSON Reader (Filters)
 * @type {function}
 * @api stable
 */
Mx.jsts.io.GeoJSONReader;

/**
 * Disjoint (Filters)
 * @type {function}
 * @api stable
 */
Mx.jtsGeom.disjoint;


/**
 * distanceSelectFeatures (options)
 * @type {number}
 * @api stable
 */
Mx.optionsVendor.distanceSelectFeatures;

/**
 * displayInLayerSwitcherHoverLayer (options)
 * @type {number}
 * @api stable
 */
Mx.optionsVendor.displayInLayerSwitcherHoverLayer;

/**
 * convexHullStyle (options)
 * @type {object}
 * @api stable
 */
Mx.optionsVendor.convexHullStyle;

/**
 * ranges (options)
 * @type {Array}
 * @api stable
 */
Mx.options.ranges;

/**
 * distance (options)
 * @type {number}
 * @api stable
 */
Mx.options.distance;

/**
 * hoverInteraction (options)
 * @type {boolean}
 * @api stable
 */
Mx.options.hoverInteraction;
/**
 * selectInteraction (options)
 * @type {boolean}
 * @api stable
 */
Mx.options.selectInteraction;

/**
 * maxFeaturesToSelect (options)
 * @type {number}
 * @api stable
 */
Mx.options.maxFeaturesToSelect;
/**
 * animated (options)
 * @type {boolean}
 * @api stable
 */
Mx.options.animated;

/**
 * animated (options)
 * @type {number}
 * @api stable
 */
Mx.options.animationDuration;

/**
 * animated (options)
 * @type {string}
 * @api stable
 */
Mx.options.animationMethod;

/**
 * displayAmount (options)
 * @type {boolean}
 * @api stable
 */
Mx.options.displayAmount;

/**
 * style icons
 * @type {object}
 * @api stable
 */
Mx.options.glyphs;



/**
 * chart variables
 * @type {Object}
 * @api stable
 */
Mx.options.variables;

/**
 * style icons
 * @type {string}
 * @api stable
 */
Mx.form;

/**
 * style icons
 * @type {boolean}
 * @api stable
 */
Mx.gradient;

/**
 * style icons
 * @type {string}
 * @api stable
 */
Mx.class;

/**
 * style icons
 * @type {number}
 * @api stable
 */
Mx.fontsize;

/**
 * style icons
 * @type {number}
 * @api stable
 */
Mx.radius;


/**
 * style icons
 * @type {number}
 * @api stable
 */
Mx.rotation;


/**
 * style icons
 * @type {boolean}
 * @api stable
 */
Mx.rotate;


/**
 * style icons
 * @type {array}
 * @api stable
 */
Mx.offset;

/**
 * style icons
 * @type {string}
 * @api stable
 */
Mx.color;

/**
 * style icons
 * @type {string}
 * @api stable
 */
Mx.fill;

/**
 * style icons
 * @type {string}
 * @api stable
 */
Mx.gradientcolor;


/**
 * Object literal representing a Event in Mapea
 * @typedef {{
 *     stroke: (Mx.ChartOptions.stroke),
 *     scheme: (Mx.ChartOptions.scheme),
 *     variables: (Mx.ChartOptions.variables)
 * }}
 * @api stable
 */
Mx.ChartOptions;

/**
 * @type {Object}
 * @api stable
 */
Mx.ChartOptions.stroke;

/**
 * @type {number}
 * @api stable
 */
Mx.ChartOptions.radius;

/**
 * @type {number}
 * @api stable
 */
Mx.ChartOptions.offsetX;

/**
 * @type {number}
 * @api stable
 */
Mx.ChartOptions.offsetY;

/**
 * @type {string}
 * @api stable
 */
Mx.ChartOptions.fill3DColor;

/**
 * @type {Array<string>|Object}
 * @api stable
 */
Mx.ChartOptions.scheme;

/**
 * @type {boolean}
 * @api stable
 */
Mx.ChartOptions.rotateWithView;

/**
 * @type {boolean}
 * @api stable
 */
Mx.ChartOptions.animation;

/**
 * @type {Object}
 * @api stable
 */
Mx.ChartOptions.variables;

/**
 * Object literal representing a Event in Mapea
 * @typedef {{
 *     attribute: (Mx.ChartVariableOptions.attribute),
 *     label: (Mx.ChartVariableOptions.label)
 * }}
 * @api stable
 */
Mx.ChartVariableOptions;

/**
 * @type {string}
 * @api stable
 */
Mx.ChartVariableOptions.attribute;

/**
 * @type {Object}
 * @api stable
 */
Mx.ChartVariableOptions.label;

/**
 * @type {number}
 * @api stable
 */
Mx.ChartVariableOptions.fill;

/**
 * @type {string}
 * @api stable
 */
Mx.ChartVariableOptions.legend;

/**
 * @type {string}
 * @api stable
 */
Mx.style.chart.types.DONUT;

/**
 * @type {string}
 * @api stable
 */
Mx.style.chart.types.PIE_3D;

/**
 * @type {string}
 * @api stable
 */
Mx.style.chart.types.PIE;

/**
 * @type {string}
 * @api stable
 */
Mx.style.chart.types.BAR;

/**
 * @type {string}
 * @api stable
 */
M.style.chart.schemes.Custom;

/**
 * @type {string}
 * @api stable
 */
M.style.chart.schemes.Classic;

/**
 * @type {string}
 * @api stable
 */
M.style.chart.schemes.Dark;

/**
 * @type {string}
 * @api stable
 */
M.style.chart.schemes.Pale;

/**
 * @type {string}
 * @api stable
 */
M.style.chart.schemes.Pastel;

/**
 * @type {string}
 * @api stable
 */
M.style.chart.schemes.Neon;

/**
 * @type {string}
 * @api stable
 */
Mx.FontSymbolOptions.type;

/**
 * @type {number}
 * @api stable
 */
Mx.FontSymbolOptions.radius;

/**
 * @type {number}
 * @api stable
 */
Mx.FontSymbolOptions.rotation;

/**
 * @type {bool}
 * @api stable
 */
Mx.FontSymbolOptions.snapToPixel;

/**
 * @type {ol.style.Stroke}
 * @api stable
 */
Mx.FontSymbolOptions.stroke;

/**
 * @type {string|Array<string>}
 * @api stable
 */
Mx.FontSymbolOptions.colors;

/**
 * @type {number}
 * @api stable
 */
Mx.FontSymbolOptions.offsetX;

/**
 * @type {number}
 * @api stable
 */
Mx.FontSymbolOptions.offsetY;

/**
 * @type {number}
 * @api stable
 */
Mx.FontSymbolOptions.animation;

/**
 * @type {object|M.style.chart.Variable|string|Array<string>|Array<M.style.chart.Variable>}
 * @api stable
 */
Mx.FontSymbolOptions.variables;

/**
 * @type {number}
 * @api stable
 */
Mx.FontSymbolOptions.donutRatio;

/**
 * @type {Array<number>}
 * @api stable
 */
Mx.FontSymbolOptions.data;

/**
 * @type {string}
 * @api stable
 */
Mx.FontSymbolOptions.fill3DColor;

/**
 * @type {number}
 * @api stable
 */
Mx.style.Point.zindex;

/**
 * @type {string}
 * @api stable
 */
Mx.style.Point.offsetorigin;


/**
 * @type {bool}
 * @api stable
 */
Mx.style.Line.textPath;

/**
 * @type {string}
 * @api stable
 */
Mx.style.Line.smooth;

/**
 * @type {string}
 * @api stable
 */
Mx.style.Point.anchororigin;

/**
 * @type {function}
 * @api stable
 */
Mx.jsts.io.OL3Parser

/**
 * @type {string}
 * @api stable
 */
Mx.style.Line.textoverflow;

/**
 * @type {number}
 * @api stable
 */
Mx.style.Line.minwidth;

/**
 * Style parameters
 */

/**
 * @type {Array<number>}
 * @api stable
 */
Mx.style.linedash;

/**
 * @type {number}
 * @api stable
 */
Mx.style.linedashoffset;


/**
 * @type {string}
 * @api stable
 */
Mx.style.anchorxunits;

/**
 * @type {string}
 * @api stable
 */
Mx.style.anchoryunits;

/**
 * @type {bool}
 * @api stable
 */
Mx.style.snaptopixel;

/**
 * @type {string}
 * @api stable
 */
Mx.style.crossorigin;

/**
 * @type {string}
 */
Mx.style.linejoin;

/**
 * @type {string}
 */
Mx.style.linecap;

/**
 * @type {number}
 */
Mx.style.miterlimit;

/**
 * @type {string}
 */
Mx.style.align;

/**
 * @type {string}
 */
Mx.style.baseline;

Mx.style.spacing;
