goog.provide('M.impl.format.WMC.v110');

goog.require('M.impl.format.WMC');
goog.require('M.utils');
goog.require('M.layer.WMS');
goog.require('M.impl.format.XML');
/**
 * @classdesc
 * Main constructor of the class. Creates a WMC formater
 * for version 1.0.0
 *
 * @constructor
 * @param {Mx.parameters.LayerOptions} options custom options for this formater
 * @extends {M.impl.format.XML}
 * @api stable
 */
M.impl.format.WMC.v110 = function (options) {
  goog.base(this, options);
};
goog.inherits(M.impl.format.WMC.v110, M.impl.format.XML);

/**
 * Read a sld:MinScaleDenominator node.
 *
 * @private
 * @function
 * @param {Object} layerInfo An object representing a layer.
 * @param {Element} node An element node.
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_sld_MinScaleDenominator = function (layerInfo, node) {
  layerInfo['options']['minScale'] = parseFloat(this.getChildValue(node));
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_Layer = function (context, node) {
  var layerInfo = {
    'params': this.layerParams || {},
    'options': {
      'visibility': (node.getAttribute("hidden") != "1"),
      'queryable': (node.getAttribute("queryable") == "1")

    },
    'formats': [],
    'styles': []
  };
  this.runChildNodes(layerInfo, node);
  // set properties common to multiple objects on layer options/params
  layerInfo['params']['isWMC'] = 'ok';
  layerInfo['params']['layers'] = layerInfo['name'];
  layerInfo['options']['maxExtent'] = layerInfo.maxExtent;
  // create the layer
  var layer = this.getLayerFromInfo(layerInfo);
  context['layers'].push(layer);
};

/**
 * Create a WMS layer from a layerInfo object
 *
 * @private
 * @function
 * @param {Object} layerInfo An object representing a WMS layer
 * @return {M.layer.WMS} A WMS layer
 * @api stable
 */
M.impl.format.WMC.v110.prototype.getLayerFromInfo = function (layerInfo) {
  var options = layerInfo['options'];
  options['params'] = layerInfo['params'];
  var layer = new M.layer.WMS({
    'name': layerInfo['name'],
    'legend': layerInfo['title'],
    'url': layerInfo['href'],
    'transparent': !/^1|(true)$/i.test(options.isBaseLayer)
  }, options);
  return layer;
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_ol_units = function (obj, node) {
  obj['units'] = this.getChildValue(node);
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_ol_tileSize = function (context, node) {
  context['tileSize'] = {
    'width': parseFloat(node.getAttribute("width")),
    'height': parseFloat(node.getAttribute("height"))
  };
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_ol_groupDisplayLayerSwitcher = function (layerInfo, node) {
  layerInfo['options']['groupDisplayLayerSwitcher'] =
    (this.getChildValue(node));
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_ol_orderInsideGroupDisplayLayerSwitcher = function (layerInfo, node) {
  layerInfo['options']['orderInsideGroupDisplayLayerSwitcher'] =
    this.getChildValue(node);
};

/**
 * Read a sld:MaxScaleDenominator node.
 *
 * @private
 * @function
 * @param {Object} layerInfo an object representing a layer
 * @param {Element} node an element node
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_sld_MaxScaleDenominator = function (layerInfo, node) {
  layerInfo['options']['maxScale'] = parseFloat(this.getChildValue(node));
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_Style = function (layerInfo, node) {

  var style = {};
  this.runChildNodes(style, node);

  if (node.getAttribute("current") == "1") {
    // three style types to consider
    // 1) linked SLD
    // 2) inline SLD
    // 3) named style
    // running child nodes always gets name, optionally gets href or body

    //MDRC_STYLE_LEGEND 06102008
    if (style['legend']) {
      layerInfo['params']['layerLegend'] = style['legend'];
    }
    ////////////////////////////////////////////////
    if (style['href']) {
      layerInfo['params']['sld'] = style['href'];
    }
    else if (style['body']) {
      layerInfo['params']['sld_body'] = style['body'];
    }
    else {
      layerInfo['params']['styles'] = style['name'];
    }
  }
  layerInfo['styles'].push(style);
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_General = function (context, node) {
  this.runChildNodes(context, node);
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_BoundingBox = function (context, node) {
  context['projection'] = node.getAttribute("SRS");
  context['bounds'] = [
      parseFloat(node.getAttribute("minx")),
      parseFloat(node.getAttribute("miny")),
      parseFloat(node.getAttribute("maxx")),
      parseFloat(node.getAttribute("maxy"))
   ];
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_LayerList = function (context, node) {
  context['layers'] = [];
  this.runChildNodes(context, node);
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_Extension = function (obj, node) {
  this.runChildNodes(obj, node);
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_ol_maxExtent = function (obj, node) {
  var maxExtent = 'maxExtent';

  var extent = [
      parseFloat(node.getAttribute("minx")),
      parseFloat(node.getAttribute("miny")),
      parseFloat(node.getAttribute("maxx")),
      parseFloat(node.getAttribute("maxy"))
   ];

  var projDst = this.options.projection;
  var projSrc = obj.projection;
  if (!M.utils.isNullOrEmpty(projDst) && !M.utils.isNullOrEmpty(projSrc) && (projDst !== projSrc)) {
    projSrc = ol.proj.get(projSrc);
    projDst = ol.proj.get(projDst);
    extent = ol.proj.transformExtent(extent, projSrc, projDst);
  }
  obj[maxExtent] = extent;
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_ol_transparent = function (layerInfo, node) {
  var transparent = 'transparent';
  var params = 'params';
  layerInfo[params][transparent] = this.getChildValue(node);
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_ol_numZoomLevels = function (layerInfo, node) {
  var options = 'options';
  var numZoomLevels = 'numZoomLevels';
  layerInfo[options][numZoomLevels] = parseInt(this.getChildValue(node));
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_ol_opacity = function (layerInfo, node) {
  layerInfo['options']['opacity'] = parseFloat(this.getChildValue(node));
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_ol_singleTile = function (layerInfo, node) {
  layerInfo['options']['singleTile'] = (this.getChildValue(node) == "true");
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_ol_isBaseLayer = function (layerInfo, node) {
  layerInfo['options']['isBaseLayer'] = (this.getChildValue(node) == "true");
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_ol_displayInLayerSwitcher = function (layerInfo, node) {
  var nodeValue = M.utils.normalize(this.getChildValue(node));
  layerInfo['options']['displayInLayerSwitcher'] = (nodeValue == "true");
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_Server = function (layerInfo, node) {
  layerInfo['params']['version'] = node.getAttribute("version");
  this.runChildNodes(layerInfo, node);
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_FormatList = function (layerInfo, node) {
  this.runChildNodes(layerInfo, node);
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_Format = function (layerInfo, node) {
  var format = this.getChildValue(node);
  layerInfo['formats'].push(format);
  if (node.getAttribute("current") == "1") {
    layerInfo['params']['format'] = format;
  }
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_StyleList = function (layerInfo, node) {
  this.runChildNodes(layerInfo, node);
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_SLD = function (style, node) {
  this.runChildNodes(style, node);
  // style either comes back with an href or a body property
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_sld_StyledLayerDescriptor = function (sld, node) {
  var body = 'body';
  sld[body] = ol.xml.getAllTextContent(node);
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_OnlineResource = function (obj, node) {
  var href = 'href';
  var xlink = 'xlink';
  obj[href] = this.getAttributeNS(
    node, this.namespaces[xlink], "href"
  );
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_Name = function (obj, node) {
  var nameValue = this.getChildValue(node);
  if (nameValue) {
    var nameAttr = 'name';
    obj[nameAttr] = nameValue;
  }
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_Title = function (obj, node) {
  var title = this.getChildValue(node);
  if (title) {
    var titleAttr = 'title';
    obj[titleAttr] = title;
  }
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_MetadataURL = function (layerInfo, node) {
  var metadataURL = {};
  var links = node.getElementsByTagName("OnlineResource");
  if (links.length > 0) {
    this.read_wmc_OnlineResource(metadataURL, links[0]);
  }
  var options = 'options';
  var metadataURLAttr = 'metadataURL';
  var href = 'href';
  layerInfo[options][metadataURLAttr] = metadataURL[href];

};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_Abstract = function (obj, node) {
  var abst = this.getChildValue(node);
  if (abst) {
    var abstProp = 'abstract';
    obj[abstProp] = abst;
  }
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_LatLonBoundingBox = function (layer, node) {
  var llbbox = 'llbbox';
  layer[llbbox] = [
      parseFloat(node.getAttribute("minx")),
      parseFloat(node.getAttribute("miny")),
      parseFloat(node.getAttribute("maxx")),
      parseFloat(node.getAttribute("maxy"))
   ];
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_LegendURL = function (style, node) {
  var legend = {
    'width': node.getAttribute('width'),
    'height': node.getAttribute('height')
  };
  var links = node.getElementsByTagName("OnlineResource");
  if (links.length > 0) {
    this.read_wmc_OnlineResource(legend, links[0]);
  }
  var legendAttr = 'legend';
  style[legendAttr] = legend;
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_sld_FeatureTypeStyle = function (sld, node) {
  var body = 'body';
  sld[body] = ol.xml.getAllTextContent(node);
};

/**
/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_KeywordList = function (context, node) {
  var keywords = 'keywords';
  context[keywords] = [];
  this.runChildNodes(context[keywords], node);
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_Keyword = function (keywords, node) {
  keywords.push(this.getChildValue(node));
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_LogoURL = function (context, node) {
  var logo = 'logo';
  context[logo] = {
    'width': node.getAttribute("width"),
    'height': node.getAttribute("height"),
    'format': node.getAttribute("format"),
    'href': this.getOnlineResource_href(node)
  };
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_DescriptionURL = function (context, node) {
  var descriptionURL = 'descriptionURL';
  context[descriptionURL] = this.getOnlineResource_href(node);
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_ContactInformation = function (obj, node) {
  var contact = {};
  this.runChildNodes(contact, node);
  var contactInformation = 'contactInformation';
  obj[contactInformation] = contact;
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_ContactPersonPrimary = function (contact, node) {
  var personPrimary = {};
  this.runChildNodes(personPrimary, node);
  var personPrimaryAttr = 'personPrimary';
  contact[personPrimaryAttr] = personPrimary;
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_ContactPerson = function (primaryPerson, node) {
  var person = this.getChildValue(node);
  if (person) {
    var personAttr = 'person';
    primaryPerson[personAttr] = person;
  }
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_ContactOrganization = function (primaryPerson, node) {
  var organization = this.getChildValue(node);
  if (organization) {
    var organizationAttr = 'organization';
    primaryPerson[organizationAttr] = organization;
  }
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_ContactPosition = function (contact, node) {
  var position = this.getChildValue(node);
  if (position) {
    var positionAttr = 'position';
    contact[positionAttr] = position;
  }
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_ContactAddress = function (contact, node) {
  var contactAddress = {};
  this.runChildNodes(contactAddress, node);
  var contactAddressAttr = 'contactAddress';
  contact[contactAddressAttr] = contactAddress;
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_AddressType = function (contactAddress, node) {
  var type = this.getChildValue(node);
  if (type) {
    var typeAttr = 'type';
    contactAddress[typeAttr] = type;
  }
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_Address = function (contactAddress, node) {
  var address = this.getChildValue(node);
  if (address) {
    var addressAttr = 'address';
    contactAddress[addressAttr] = address;
  }
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_City = function (contactAddress, node) {
  var city = this.getChildValue(node);
  if (city) {
    var cityAttr = 'city';
    contactAddress[cityAttr] = city;
  }
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_StateOrProvince = function (contactAddress, node) {
  var stateOrProvince = this.getChildValue(node);
  if (stateOrProvince) {
    var stateOrProvinceAttr = 'stateOrProvince';
    contactAddress[stateOrProvinceAttr] = stateOrProvince;
  }
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_PostCode = function (contactAddress, node) {
  var postcode = this.getChildValue(node);
  if (postcode) {
    var postcodeAttr = 'postcode';
    contactAddress[postcodeAttr] = postcode;
  }
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_Country = function (contactAddress, node) {
  var country = this.getChildValue(node);
  if (country) {
    var countryAttr = 'country';
    contactAddress[countryAttr] = country;
  }
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_ContactVoiceTelephone = function (contact, node) {
  var phone = this.getChildValue(node);
  if (phone) {
    var phoneAttr = 'phone';
    contact[phoneAttr] = phone;
  }
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_ContactFacsimileTelephone = function (contact, node) {
  var fax = this.getChildValue(node);
  if (fax) {
    var faxAttr = 'fax';
    contact[faxAttr] = fax;
  }
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_ContactElectronicMailAddress = function (contact, node) {
  var email = this.getChildValue(node);
  if (email) {
    var emailAttr = 'email';
    contact[emailAttr] = email;
  }
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_DataURL = function (layerContext, node) {
  var dataURL = 'dataURL';
  layerContext[dataURL] = this.getOnlineResource_href(node);
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_DimensionList = function (layerContext, node) {
  var dimensions = 'dimensions';
  layerContext[dimensions] = {};
  this.runChildNodes(layerContext[dimensions], node);
};

/**
 * @private
 * @function
 * @api stable
 */
M.impl.format.WMC.v110.prototype.read_wmc_Dimension = function (dimensions, node) {
  var name = node.getAttribute("name").toLowerCase();

  var dim = {
    'name': name,
    'units': node.getAttribute("units") || "",
    'unitSymbol': node.getAttribute("unitSymbol") || "",
    'userValue': node.getAttribute("userValue") || "",
    'nearestValue': node.getAttribute("nearestValue") === "1",
    'multipleValues': node.getAttribute("multipleValues") === "1",
    'current': node.getAttribute("current") === "1",
    'default': node.getAttribute("default") || ""
  };
  var values = this.getChildValue(node);

  var valuesAttr = 'values';
  dim[valuesAttr] = values.split(",");

  var nameAttr = 'name';
  dimensions[dim[nameAttr]] = dim;
};
