import { isNullOrEmpty, normalize } from 'facade/js/util/Utils';
import WMS from 'facade/js/layer/WMS';
import { get as getProj, transformExtent } from 'ol/proj';
import { getAllTextContent } from 'ol/xml';
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
  read_sld_MinScaleDenominator(layerInfoVar, node) {
    const layerInfo = layerInfoVar;
    layerInfo.options.minScale = parseFloat(XML.getChildValue(node));
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_Layer(context, node) {
    const layerInfo = {
      params: this.layerParams || {},
      options: {
        visibility: (node.getAttribute('hidden') !== '1'),
        queryable: (node.getAttribute('queryable') === '1'),

      },
      formats: [],
      styles: [],
    };
    this.runChildNodes(layerInfo, node);
    // set properties common to multiple objects on layer options/params
    layerInfo.params.isWMC = 'ok';
    layerInfo.params.layers = layerInfo.name;
    layerInfo.options.maxExtent = layerInfo.maxExtent;
    // create the layer
    const layer = this.getLayerFromInfo(layerInfo);
    if (layerInfo.styles != null && layerInfo.styles[0] != null) {
      const firstStyle = layerInfo.styles[0];
      if (firstStyle.legend != null && firstStyle.legend.href) {
        const legendUrl = firstStyle.legend.href;
        layer.setLegendURL(legendUrl);
      }
    }
    context.layers.push(layer);
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
    const options = layerInfo.options;
    options.params = layerInfo.params;
    const layer = new WMS({
      name: layerInfo.name,
      legend: layerInfo.title,
      url: layerInfo.href,
      transparent: !/^1|(true)$/i.test(options.isBaseLayer),
    }, options);
    return layer;
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_ol_units(objVar, node) {
    const obj = objVar;
    obj.units = XML.getChildValue(node);
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_ol_tileSize(contextVar, node) {
    const context = contextVar;
    context.tileSize = {
      width: parseFloat(node.getAttribute('width')),
      height: parseFloat(node.getAttribute('height')),
    };
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_ol_groupDisplayLayerSwitcher(layerInfoVar, node) {
    const layerInfo = layerInfoVar;
    layerInfo.options.groupDisplayLayerSwitcher =
      (XML.getChildValue(node));
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_ol_orderInsideGroupDisplayLayerSwitcher(layerInfoVar, node) {
    const layerInfo = layerInfoVar;
    layerInfo.options.orderInsideGroupDisplayLayerSwitcher =
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
  read_sld_MaxScaleDenominator(layerInfoVar, node) {
    const layerInfo = layerInfoVar;
    layerInfo.options.maxScale = parseFloat(XML.getChildValue(node));
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_Style(layerInfoVar, node) {
    const layerInfo = layerInfoVar;
    const style = {};
    this.runChildNodes(style, node);

    if (node.getAttribute('current') === '1') {
      // three style types to consider
      // 1) linked SLD
      // 2) inline SLD
      // 3) named style
      // running child nodes always gets name, optionally gets href or body

      // MDRC_STYLE_LEGEND 06102008
      if (style.legend) {
        layerInfo.params.layerLegend = style.legend;
      }
      // //////////////////////////////////////////////
      if (style.href) {
        layerInfo.params.sld = style.href;
      } else if (style.body) {
        layerInfo.params.sld_body = style.body;
      } else {
        layerInfo.params.styles = style.name;
      }
    }
    layerInfo.styles.push(style);
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
  read_wmc_BoundingBox(contextVar, node) {
    const context = contextVar;
    context.projection = node.getAttribute('SRS');
    context.bounds = [
      parseFloat(node.getAttribute('minx')),
      parseFloat(node.getAttribute('miny')),
      parseFloat(node.getAttribute('maxx')),
      parseFloat(node.getAttribute('maxy')),
    ];
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_LayerList(contextVar, node) {
    const context = contextVar;
    context.layers = [];
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
  read_ol_maxExtent(objVar, node) {
    const obj = objVar;
    const maxExtent = 'maxExtent';

    let extent = [
      parseFloat(node.getAttribute('minx')),
      parseFloat(node.getAttribute('miny')),
      parseFloat(node.getAttribute('maxx')),
      parseFloat(node.getAttribute('maxy')),
    ];

    let projDst = this.options.projection;
    let projSrc = obj.projection;
    if (!isNullOrEmpty(projDst) && !isNullOrEmpty(projSrc) && (projDst !== projSrc)) {
      projSrc = getProj(projSrc);
      projDst = getProj(projDst);
      extent = transformExtent(extent, projSrc, projDst);
    }
    obj[maxExtent] = extent;
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_ol_transparent(layerInfoVar, node) {
    const layerInfo = layerInfoVar;
    const transparent = 'transparent';
    const params = 'params';
    layerInfo[params][transparent] = XML.getChildValue(node);
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_ol_numZoomLevels(layerInfoVar, node) {
    const layerInfo = layerInfoVar;
    const options = 'options';
    const numZoomLevels = 'numZoomLevels';
    layerInfo[options][numZoomLevels] = parseInt(XML.getChildValue(node), 10);
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_ol_opacity(layerInfoVar, node) {
    const layerInfo = layerInfoVar;
    layerInfo.options.opacity = parseFloat(XML.getChildValue(node));
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_ol_singleTile(layerInfoVar, node) {
    const layerInfo = layerInfoVar;
    layerInfo.options.singleTile = (XML.getChildValue(node) === 'true');
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_ol_isBaseLayer(layerInfoVar, node) {
    const layerInfo = layerInfoVar;
    layerInfo.options.isBaseLayer = (XML.getChildValue(node) === 'true');
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_ol_displayInLayerSwitcher(layerInfoVar, node) {
    const layerInfo = layerInfoVar;
    const nodeValue = normalize(XML.getChildValue(node));
    layerInfo.options.displayInLayerSwitcher = (nodeValue === 'true');
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_Server(layerInfoVar, node) {
    const layerInfo = layerInfoVar;
    layerInfo.params.version = node.getAttribute('version');
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
  read_wmc_Format(layerInfoVar, node) {
    const layerInfo = layerInfoVar;
    const format = XML.getChildValue(node);
    layerInfo.formats.push(format);
    if (node.getAttribute('current') === '1') {
      layerInfo.params.format = format;
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
  read_sld_StyledLayerDescriptor(sldVar, node) {
    const sld = sldVar;
    const body = 'body';
    sld[body] = getAllTextContent(node);
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_OnlineResource(objVar, node) {
    const obj = objVar;
    const href = 'href';
    const xlink = 'xlink';
    obj[href] = this.getAttributeNS(node, this.namespaces[xlink], 'href');
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_Name(objVar, node) {
    const obj = objVar;
    const nameValue = XML.getChildValue(node);
    if (nameValue) {
      const nameAttr = 'name';
      obj[nameAttr] = nameValue;
    }
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_Title(objVar, node) {
    const obj = objVar;
    const title = XML.getChildValue(node);
    if (title) {
      const titleAttr = 'title';
      obj[titleAttr] = title;
    }
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_MetadataURL(layerInfoVar, node) {
    const layerInfo = layerInfoVar;
    const metadataURL = {};
    const links = node.getElementsByTagName('OnlineResource');
    if (links.length > 0) {
      this.read_wmc_OnlineResource(metadataURL, links[0]);
    }
    const options = 'options';
    const metadataURLAttr = 'metadataURL';
    const href = 'href';
    layerInfo[options][metadataURLAttr] = metadataURL[href];
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_Abstract(objVar, node) {
    const obj = objVar;
    const abst = XML.getChildValue(node);
    if (abst) {
      const abstProp = 'abstract';
      obj[abstProp] = abst;
    }
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_LatLonBoundingBox(layerVar, node) {
    const layer = layerVar;
    const llbbox = 'llbbox';
    layer[llbbox] = [
      parseFloat(node.getAttribute('minx')),
      parseFloat(node.getAttribute('miny')),
      parseFloat(node.getAttribute('maxx')),
      parseFloat(node.getAttribute('maxy')),
    ];
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_LegendURL(styleVar, node) {
    const style = styleVar;
    const legend = {
      width: node.getAttribute('width'),
      height: node.getAttribute('height'),
    };
    const links = node.getElementsByTagName('OnlineResource');
    if (links.length > 0) {
      this.read_wmc_OnlineResource(legend, links[0]);
    }
    const legendAttr = 'legend';
    style[legendAttr] = legend;
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_sld_FeatureTypeStyle(sldVar, node) {
    const sld = sldVar;
    const body = 'body';
    sld[body] = getAllTextContent(node);
  }

  /**
  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_KeywordList(contextVar, node) {
    const context = contextVar;
    const keywords = 'keywords';
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
  read_wmc_LogoURL(contextVar, node) {
    const context = contextVar;
    const logo = 'logo';
    context[logo] = {
      width: node.getAttribute('width'),
      height: node.getAttribute('height'),
      format: node.getAttribute('format'),
      href: this.getOnlineResource_href(node),
    };
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_DescriptionURL(contextVar, node) {
    const context = contextVar;
    const descriptionURL = 'descriptionURL';
    context[descriptionURL] = this.getOnlineResource_href(node);
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_ContactInformation(objVar, node) {
    const obj = objVar;
    const contact = {};
    this.runChildNodes(contact, node);
    const contactInformation = 'contactInformation';
    obj[contactInformation] = contact;
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_ContactPersonPrimary(contactVar, node) {
    const contact = contactVar;
    const personPrimary = {};
    this.runChildNodes(personPrimary, node);
    const personPrimaryAttr = 'personPrimary';
    contact[personPrimaryAttr] = personPrimary;
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_ContactPerson(primaryPersonVar, node) {
    const primaryPerson = primaryPersonVar;
    const person = XML.getChildValue(node);
    if (person) {
      const personAttr = 'person';
      primaryPerson[personAttr] = person;
    }
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_ContactOrganization(primaryPersonVar, node) {
    const primaryPerson = primaryPersonVar;
    const organization = XML.getChildValue(node);
    if (organization) {
      const organizationAttr = 'organization';
      primaryPerson[organizationAttr] = organization;
    }
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_ContactPosition(contactVar, node) {
    const contact = contactVar;
    const position = XML.getChildValue(node);
    if (position) {
      const positionAttr = 'position';
      contact[positionAttr] = position;
    }
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_ContactAddress(contactVar, node) {
    const contact = contactVar;
    const contactAddress = {};
    this.runChildNodes(contactAddress, node);
    const contactAddressAttr = 'contactAddress';
    contact[contactAddressAttr] = contactAddress;
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_AddressType(contactAddressVar, node) {
    const contactAddress = contactAddressVar;
    const type = XML.getChildValue(node);
    if (type) {
      const typeAttr = 'type';
      contactAddress[typeAttr] = type;
    }
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_Address(contactAddressVar, node) {
    const contactAddress = contactAddressVar;
    const address = XML.getChildValue(node);
    if (address) {
      const addressAttr = 'address';
      contactAddress[addressAttr] = address;
    }
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_City(contactAddressVar, node) {
    const contactAddress = contactAddressVar;
    const city = XML.getChildValue(node);
    if (city) {
      const cityAttr = 'city';
      contactAddress[cityAttr] = city;
    }
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_StateOrProvince(contactAddressVar, node) {
    const contactAddress = contactAddressVar;
    const stateOrProvince = XML.getChildValue(node);
    if (stateOrProvince) {
      const stateOrProvinceAttr = 'stateOrProvince';
      contactAddress[stateOrProvinceAttr] = stateOrProvince;
    }
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_PostCode(contactAddressVar, node) {
    const contactAddress = contactAddressVar;
    const postcode = XML.getChildValue(node);
    if (postcode) {
      const postcodeAttr = 'postcode';
      contactAddress[postcodeAttr] = postcode;
    }
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_Country(contactAddressVar, node) {
    const contactAddress = contactAddressVar;
    const country = XML.getChildValue(node);
    if (country) {
      const countryAttr = 'country';
      contactAddress[countryAttr] = country;
    }
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_ContactVoiceTelephone(contactVar, node) {
    const contact = contactVar;
    const phone = XML.getChildValue(node);
    if (phone) {
      const phoneAttr = 'phone';
      contact[phoneAttr] = phone;
    }
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_ContactFacsimileTelephone(contactVar, node) {
    const contact = contactVar;
    const fax = XML.getChildValue(node);
    if (fax) {
      const faxAttr = 'fax';
      contact[faxAttr] = fax;
    }
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_ContactElectronicMailAddress(contactVar, node) {
    const contact = contactVar;
    const email = XML.getChildValue(node);
    if (email) {
      const emailAttr = 'email';
      contact[emailAttr] = email;
    }
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_DataURL(layerContextVar, node) {
    const layerContext = layerContextVar;
    const dataURL = 'dataURL';
    layerContext[dataURL] = this.getOnlineResource_href(node);
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_DimensionList(layerContextVar, node) {
    const layerContext = layerContextVar;
    const dimensions = 'dimensions';
    layerContext[dimensions] = {};
    this.runChildNodes(layerContext[dimensions], node);
  }

  /**
   * @private
   * @function
   * @api stable
   */
  read_wmc_Dimension(dimensionsVar, node) {
    const dimensions = dimensionsVar;
    const name = node.getAttribute('name').toLowerCase();

    const dim = {
      name,
      units: node.getAttribute('units') || '',
      unitSymbol: node.getAttribute('unitSymbol') || '',
      userValue: node.getAttribute('userValue') || '',
      nearestValue: node.getAttribute('nearestValue') === '1',
      multipleValues: node.getAttribute('multipleValues') === '1',
      current: node.getAttribute('current') === '1',
      default: node.getAttribute('default') || '',
    };
    const values = XML.getChildValue(node);

    const valuesAttr = 'values';
    dim[valuesAttr] = values.split(',');

    const nameAttr = 'name';
    dimensions[dim[nameAttr]] = dim;
  }
}
