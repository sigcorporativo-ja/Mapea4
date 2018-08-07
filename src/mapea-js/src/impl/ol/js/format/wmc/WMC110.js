import { isNullOrEmpty, normalize } from 'facade/js/util/Utils';
import WMS from 'facade/js/layer/WMS';
import XML from '../XML';

export default class WMCV110 extends XML {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WMC formater
   * for version 1.0.0
   */
  /**
   * Read a sld:MinScaleDenominator node.
   *
   * @private
   * @function
   * @param {Object} layerInfo An object representing a layer.
   * @param {Element} node An element node.
   * @api stable
   */
  read_sld_MinScaleDenominator(layerInfo, node) {
    layerInfo['options']['minScale'] = parseFloat(XML.getChildValue(node));
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_Layer(context, node) {
    let layerInfo = {
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
    let layer = this.getLayerFromInfo(layerInfo);
    if (layerInfo["styles"] != null && layerInfo["styles"][0] != null) {
      let firstStyle = layerInfo["styles"][0];
      if (firstStyle["legend"] != null && firstStyle["legend"]["href"]) {
        let legendUrl = firstStyle["legend"]["href"];
        layer.setLegendURL(legendUrl);
      }
    }
    context['layers'].push(layer);
  }

  /**
   * Create a WMS layer from a layerInfo object
   *
   * @private
   * @function
   * @param {Object} layerInfo An object representing a WMS layer
   * @return {M.layer.WMS} A WMS layer
   * @api stable
   */
  getLayerFromInfo(layerInfo) {
    let options = layerInfo['options'];
    options['params'] = layerInfo['params'];
    let layer = new WMS({
      'name': layerInfo['name'],
      'legend': layerInfo['title'],
      'url': layerInfo['href'],
      'transparent': !/^1|(true)$/i.test(options.isBaseLayer)
    }, options);
    return layer;
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_ol_units(obj, node) {
    obj['units'] = XML.getChildValue(node);
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_ol_tileSize(context, node) {
    context['tileSize'] = {
      'width': parseFloat(node.getAttribute("width")),
      'height': parseFloat(node.getAttribute("height"))
    };
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_ol_groupDisplayLayerSwitcher(layerInfo, node) {
    layerInfo['options']['groupDisplayLayerSwitcher'] =
      (XML.getChildValue(node));
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_ol_orderInsideGroupDisplayLayerSwitcher(layerInfo, node) {
    layerInfo['options']['orderInsideGroupDisplayLayerSwitcher'] =
      XML.getChildValue(node);
  }

  /**
   * Read a sld:MaxScaleDenominator node.
   *
   * @private
   * @function
   * @param {Object} layerInfo an object representing a layer
   * @param {Element} node an element node
   * @api stable
   */
  read_sld_MaxScaleDenominator(layerInfo, node) {
    layerInfo['options']['maxScale'] = parseFloat(XML.getChildValue(node));
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_Style(layerInfo, node) {

    let style = {};
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
      } else if (style['body']) {
        layerInfo['params']['sld_body'] = style['body'];
      } else {
        layerInfo['params']['styles'] = style['name'];
      }
    }
    layerInfo['styles'].push(style);
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_General(context, node) {
    this.runChildNodes(context, node);
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_BoundingBox(context, node) {
    context['projection'] = node.getAttribute("SRS");
    context['bounds'] = [
      parseFloat(node.getAttribute("minx")),
      parseFloat(node.getAttribute("miny")),
      parseFloat(node.getAttribute("maxx")),
      parseFloat(node.getAttribute("maxy"))
   ];
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_LayerList(context, node) {
    context['layers'] = [];
    this.runChildNodes(context, node);
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_Extension(obj, node) {
    this.runChildNodes(obj, node);
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_ol_maxExtent(obj, node) {
    let maxExtent = 'maxExtent';

    let extent = [
      parseFloat(node.getAttribute("minx")),
      parseFloat(node.getAttribute("miny")),
      parseFloat(node.getAttribute("maxx")),
      parseFloat(node.getAttribute("maxy"))
   ];

    let projDst = this.options.projection;
    let projSrc = obj.projection;
    if (!isNullOrEmpty(projDst) && !isNullOrEmpty(projSrc) && (projDst !== projSrc)) {
      projSrc = ol.proj.get(projSrc);
      projDst = ol.proj.get(projDst);
      extent = ol.proj.transformExtent(extent, projSrc, projDst);
    }
    obj[maxExtent] = extent;
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_ol_transparent(layerInfo, node) {
    let transparent = 'transparent';
    let params = 'params';
    layerInfo[params][transparent] = XML.getChildValue(node);
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_ol_numZoomLevels(layerInfo, node) {
    let options = 'options';
    let numZoomLevels = 'numZoomLevels';
    layerInfo[options][numZoomLevels] = parseInt(XML.getChildValue(node));
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_ol_opacity(layerInfo, node) {
    layerInfo['options']['opacity'] = parseFloat(XML.getChildValue(node));
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_ol_singleTile(layerInfo, node) {
    layerInfo['options']['singleTile'] = (XML.getChildValue(node) == "true");
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_ol_isBaseLayer(layerInfo, node) {
    layerInfo['options']['isBaseLayer'] = (XML.getChildValue(node) == "true");
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_ol_displayInLayerSwitcher(layerInfo, node) {
    let nodeValue = normalize(XML.getChildValue(node));
    layerInfo['options']['displayInLayerSwitcher'] = (nodeValue == "true");
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_Server(layerInfo, node) {
    layerInfo['params']['version'] = node.getAttribute("version");
    this.runChildNodes(layerInfo, node);
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_FormatList(layerInfo, node) {
    this.runChildNodes(layerInfo, node);
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_Format(layerInfo, node) {
    let format = XML.getChildValue(node);
    layerInfo['formats'].push(format);
    if (node.getAttribute("current") == "1") {
      layerInfo['params']['format'] = format;
    }
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_StyleList(layerInfo, node) {
    this.runChildNodes(layerInfo, node);
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_SLD(style, node) {
    this.runChildNodes(style, node);
    // style either comes back with an href or a body property
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_sld_StyledLayerDescriptor(sld, node) {
    let body = 'body';
    sld[body] = ol.xml.getAllTextContent(node);
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_OnlineResource(obj, node) {
    let href = 'href';
    let xlink = 'xlink';
    obj[href] = this.getAttributeNS(
      node, this.namespaces[xlink], "href"
    );
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_Name(obj, node) {
    let nameValue = XML.getChildValue(node);
    if (nameValue) {
      let nameAttr = 'name';
      obj[nameAttr] = nameValue;
    }
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_Title(obj, node) {
    let title = XML.getChildValue(node);
    if (title) {
      let titleAttr = 'title';
      obj[titleAttr] = title;
    }
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_MetadataURL(layerInfo, node) {
    let metadataURL = {};
    let links = node.getElementsByTagName("OnlineResource");
    if (links.length > 0) {
      this.read_wmc_OnlineResource(metadataURL, links[0]);
    }
    let options = 'options';
    let metadataURLAttr = 'metadataURL';
    let href = 'href';
    layerInfo[options][metadataURLAttr] = metadataURL[href];

  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_Abstract(obj, node) {
    let abst = XML.getChildValue(node);
    if (abst) {
      let abstProp = 'abstract';
      obj[abstProp] = abst;
    }
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_LatLonBoundingBox(layer, node) {
    let llbbox = 'llbbox';
    layer[llbbox] = [
      parseFloat(node.getAttribute("minx")),
      parseFloat(node.getAttribute("miny")),
      parseFloat(node.getAttribute("maxx")),
      parseFloat(node.getAttribute("maxy"))
   ];
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_LegendURL(style, node) {
    let legend = {
      'width': node.getAttribute('width'),
      'height': node.getAttribute('height')
    };
    let links = node.getElementsByTagName("OnlineResource");
    if (links.length > 0) {
      this.read_wmc_OnlineResource(legend, links[0]);
    }
    let legendAttr = 'legend';
    style[legendAttr] = legend;
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_sld_FeatureTypeStyle(sld, node) {
    let body = 'body';
    sld[body] = ol.xml.getAllTextContent(node);
  }

  /**
  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_KeywordList(context, node) {
    let keywords = 'keywords';
    context[keywords] = [];
    this.runChildNodes(context[keywords], node);
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_Keyword(keywords, node) {
    keywords.push(XML.getChildValue(node));
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_LogoURL(context, node) {
    let logo = 'logo';
    context[logo] = {
      'width': node.getAttribute("width"),
      'height': node.getAttribute("height"),
      'format': node.getAttribute("format"),
      'href': this.getOnlineResource_href(node)
    };
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_DescriptionURL(context, node) {
    let descriptionURL = 'descriptionURL';
    context[descriptionURL] = this.getOnlineResource_href(node);
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_ContactInformation(obj, node) {
    let contact = {};
    this.runChildNodes(contact, node);
    let contactInformation = 'contactInformation';
    obj[contactInformation] = contact;
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_ContactPersonPrimary(contact, node) {
    let personPrimary = {};
    this.runChildNodes(personPrimary, node);
    let personPrimaryAttr = 'personPrimary';
    contact[personPrimaryAttr] = personPrimary;
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_ContactPerson(primaryPerson, node) {
    let person = XML.getChildValue(node);
    if (person) {
      let personAttr = 'person';
      primaryPerson[personAttr] = person;
    }
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_ContactOrganization(primaryPerson, node) {
    let organization = XML.getChildValue(node);
    if (organization) {
      let organizationAttr = 'organization';
      primaryPerson[organizationAttr] = organization;
    }
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_ContactPosition(contact, node) {
    let position = XML.getChildValue(node);
    if (position) {
      let positionAttr = 'position';
      contact[positionAttr] = position;
    }
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_ContactAddress(contact, node) {
    let contactAddress = {};
    this.runChildNodes(contactAddress, node);
    let contactAddressAttr = 'contactAddress';
    contact[contactAddressAttr] = contactAddress;
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_AddressType(contactAddress, node) {
    let type = XML.getChildValue(node);
    if (type) {
      let typeAttr = 'type';
      contactAddress[typeAttr] = type;
    }
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_Address(contactAddress, node) {
    let address = XML.getChildValue(node);
    if (address) {
      let addressAttr = 'address';
      contactAddress[addressAttr] = address;
    }
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_City(contactAddress, node) {
    let city = XML.getChildValue(node);
    if (city) {
      let cityAttr = 'city';
      contactAddress[cityAttr] = city;
    }
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_StateOrProvince(contactAddress, node) {
    let stateOrProvince = XML.getChildValue(node);
    if (stateOrProvince) {
      let stateOrProvinceAttr = 'stateOrProvince';
      contactAddress[stateOrProvinceAttr] = stateOrProvince;
    }
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_PostCode(contactAddress, node) {
    let postcode = XML.getChildValue(node);
    if (postcode) {
      let postcodeAttr = 'postcode';
      contactAddress[postcodeAttr] = postcode;
    }
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_Country(contactAddress, node) {
    let country = XML.getChildValue(node);
    if (country) {
      let countryAttr = 'country';
      contactAddress[countryAttr] = country;
    }
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_ContactVoiceTelephone(contact, node) {
    let phone = XML.getChildValue(node);
    if (phone) {
      let phoneAttr = 'phone';
      contact[phoneAttr] = phone;
    }
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_ContactFacsimileTelephone(contact, node) {
    let fax = XML.getChildValue(node);
    if (fax) {
      let faxAttr = 'fax';
      contact[faxAttr] = fax;
    }
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_ContactElectronicMailAddress(contact, node) {
    let email = XML.getChildValue(node);
    if (email) {
      let emailAttr = 'email';
      contact[emailAttr] = email;
    }
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_DataURL(layerContext, node) {
    let dataURL = 'dataURL';
    layerContext[dataURL] = this.getOnlineResource_href(node);
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_DimensionList(layerContext, node) {
    let dimensions = 'dimensions';
    layerContext[dimensions] = {};
    this.runChildNodes(layerContext[dimensions], node);
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_Dimension(dimensions, node) {
    let name = node.getAttribute("name").toLowerCase();

    let dim = {
      'name': name,
      'units': node.getAttribute("units") || "",
      'unitSymbol': node.getAttribute("unitSymbol") || "",
      'userValue': node.getAttribute("userValue") || "",
      'nearestValue': node.getAttribute("nearestValue") === "1",
      'multipleValues': node.getAttribute("multipleValues") === "1",
      'current': node.getAttribute("current") === "1",
      'default': node.getAttribute("default") || ""
    };
    let values = XML.getChildValue(node);

    let valuesAttr = 'values';
    dim[valuesAttr] = values.split(",");

    let nameAttr = 'name';
    dimensions[dim[nameAttr]] = dim;
  }
}
