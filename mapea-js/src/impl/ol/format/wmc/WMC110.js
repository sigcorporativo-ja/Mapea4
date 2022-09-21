import { isNullOrEmpty, normalize, isArray } from 'M/util/Utils';
import WMS from 'M/layer/WMS';
import LayerGroup from 'M/layer/LayerGroup';
import { get as getProj } from 'ol/proj';
import { getAllTextContent } from 'ol/xml';
import ImplUtils from '../../util/Utils';
import XML from '../XML';

/**
 * @classdesc
 */
class WMC110 extends XML {
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
  readsldMinScaleDenominator(layerInfoVar, node) {
    const layerInfo = layerInfoVar;
    layerInfo.options.minScale = parseFloat(XML.getChildValue(node));
  }

  /**
   * TODO
   *
   * @private
   * @function
   * @param {Object} layerInfo An object representing a layer.
   * @param {Element} node An element node.
   * @api stable
   */
  readolgroup(obj, node) {
    const objVar = obj;
    if (isArray(objVar)) {
      const context = objVar[0];
      const currentGroup = objVar[1];
      const groups = context.layerGroups;
      const group = new LayerGroup({
        id: node.getAttribute('id'),
        title: node.getAttribute('title'),
        order: node.getAttribute('orderInsideGroupDisplay'),
      });
      if (isNullOrEmpty(currentGroup)) {
        groups.push(group);
      } else {
        currentGroup.addChild(group);
      }
      this.runChildNodes([context, group], node);
    } else {
      objVar.layerGroups = [];
      this.runChildNodes([objVar], node);
    }
  }

  /**
   * @private
   * @function
   * @api stable
   */
  readwmcLayer(contextVar, node) {
    const context = contextVar;
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
    layerInfo.options.wmcMaxExtent = layerInfo.maxExtent;
    layerInfo.options.wmcGlobalMaxExtent = context.maxExtent;
    // create the layer
    const layer = this.getLayerFromInfo(layerInfo);

    const groupId = layerInfo.options.groupDisplayLayerSwitcher;
    const groupOrder = layerInfo.options.orderInsideGroupDisplayLayerSwitcher;
    const layerGroups = context.layerGroups;

    const group = LayerGroup.findGroupById(groupId, layerGroups);

    if (layerInfo.styles != null && layerInfo.styles[0] != null) {
      const firstStyle = layerInfo.styles[0];
      if (firstStyle.legend != null && firstStyle.legend.href) {
        const legendUrl = firstStyle.legend.href;
        layer.setLegendURL(legendUrl);
      }
    }

    if (!isNullOrEmpty(group)) {
      group.addChild(layer, parseInt(groupOrder, 10));
    } else {
      if (isNullOrEmpty(context.layers)) {
        context.layers = [];
      }
      context.layers.push(layer);
    }
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
      version: layerInfo.params.version,
    }, options);
    return layer;
  }

  /**
   * @private
   * @function
   * @api stable
   */
  readolunits(objVar, node) {
    const obj = objVar;
    obj.units = XML.getChildValue(node);
  }

  /**
   * @private
   * @function
   * @api stable
   */
  readoltileSize(contextVar, node) {
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
  readolgroupDisplayLayerSwitcher(layerInfoVar, node) {
    const layerInfo = layerInfoVar;
    layerInfo.options.groupDisplayLayerSwitcher =
      (XML.getChildValue(node));
  }

  /**
   * @private
   * @function
   * @api stable
   */
  readolorderInsideGroupDisplayLayerSwitcher(layerInfoVar, node) {
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
  readsldMaxScaleDenominator(layerInfoVar, node) {
    const layerInfo = layerInfoVar;
    layerInfo.options.maxScale = parseFloat(XML.getChildValue(node));
  }

  /**
   * @private
   * @function
   * @api stable
   */
  readwmcStyle(layerInfoVar, node) {
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
  readwmcGeneral(context, node) {
    this.runChildNodes(context, node);
  }

  /**
   * @private
   * @function
   * @api stable
   */
  readwmcBoundingBox(contextVar, node) {
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
  readwmcLayerList(contextVar, node) {
    const context = contextVar;
    context.layers = [];
    this.runChildNodes(context, node);
  }

  /**
   * @private
   * @function
   * @api stable
   */
  readwmcExtension(obj, node) {
    this.runChildNodes(obj, node);
  }

  /**
   * @private
   * @function
   * @api stable
   */
  readolmaxExtent(objVar, node) {
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
      extent = ImplUtils.transformExtent(extent, projSrc, projDst);
    }
    obj[maxExtent] = extent;
  }

  /**
   * @private
   * @function
   * @api stable
   */
  readoltransparent(layerInfoVar, node) {
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
  readolnumZoomLevels(layerInfoVar, node) {
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
  readolopacity(layerInfoVar, node) {
    const layerInfo = layerInfoVar;
    layerInfo.options.opacity = parseFloat(XML.getChildValue(node));
  }

  /**
   * @private
   * @function
   * @api stable
   */
  readolsingleTile(layerInfoVar, node) {
    const layerInfo = layerInfoVar;
    layerInfo.options.singleTile = (XML.getChildValue(node) === 'true');
  }

  /**
   * @private
   * @function
   * @api stable
   */
  readolisBaseLayer(layerInfoVar, node) {
    const layerInfo = layerInfoVar;
    layerInfo.options.isBaseLayer = (XML.getChildValue(node) === 'true');
  }

  /**
   * @private
   * @function
   * @api stable
   */
  readoldisplayInLayerSwitcher(layerInfoVar, node) {
    const layerInfo = layerInfoVar;
    const nodeValue = normalize(XML.getChildValue(node));
    layerInfo.options.displayInLayerSwitcher = (nodeValue === 'true');
  }

  /**
   * @private
   * @function
   * @api stable
   */
  readwmcServer(layerInfoVar, node) {
    const layerInfo = layerInfoVar;
    layerInfo.params.version = node.getAttribute('version');
    this.runChildNodes(layerInfo, node);
  }

  /**
   * @private
   * @function
   * @api stable
   */
  readwmcFormatList(layerInfo, node) {
    this.runChildNodes(layerInfo, node);
  }

  /**
   * @private
   * @function
   * @api stable
   */
  readwmcFormat(layerInfoVar, node) {
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
  readwmcStyleList(layerInfo, node) {
    this.runChildNodes(layerInfo, node);
  }

  /**
   * @private
   * @function
   * @api stable
   */
  readwmcSLD(style, node) {
    this.runChildNodes(style, node);
    // style either comes back with an href or a body property
  }

  /**
   * @private
   * @function
   * @api stable
   */
  readsldStyledLayerDescriptor(sldVar, node) {
    const sld = sldVar;
    const body = 'body';
    sld[body] = getAllTextContent(node);
  }

  /**
   * @private
   * @function
   * @api stable
   */
  readwmcOnlineResource(objVar, node) {
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
  readwmcName(objVar, node) {
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
  readwmcTitle(objVar, node) {
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
  readwmcMetadataURL(layerInfoVar, node) {
    const layerInfo = layerInfoVar;
    const metadataURL = {};
    const links = node.getElementsByTagName('OnlineResource');
    if (links.length > 0) {
      this.readwmcOnlineResource(metadataURL, links[0]);
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
  readwmcextmetadata(layerInfoVar, node) {
    const layerInfo = layerInfoVar;
    layerInfo.options.metadataUrl = node && node.innerHTML;
  }

  /**
   * @private
   * @function
   * @api stable
   */
  readwmcAbstract(objVar, node) {
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
  readwmcLatLonBoundingBox(layerVar, node) {
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
  readwmcLegendURL(styleVar, node) {
    const style = styleVar;
    const legend = {
      width: node.getAttribute('width'),
      height: node.getAttribute('height'),
    };
    const links = node.getElementsByTagName('OnlineResource');
    if (links.length > 0) {
      this.readwmcOnlineResource(legend, links[0]);
    }
    const legendAttr = 'legend';
    style[legendAttr] = legend;
  }

  /**
   * @private
   * @function
   * @api stable
   */
  readsldFeatureTypeStyle(sldVar, node) {
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
  readwmcKeywordList(contextVar, node) {
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
  readwmcKeyword(keywords, node) {
    keywords.push(XML.getChildValue(node));
  }

  /**
   * @private
   * @function
   * @api stable
   */
  readwmcLogoURL(contextVar, node) {
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
  readwmcDescriptionURL(contextVar, node) {
    const context = contextVar;
    const descriptionURL = 'descriptionURL';
    context[descriptionURL] = this.getOnlineResource_href(node);
  }

  /**
   * @private
   * @function
   * @api stable
   */
  readwmcContactInformation(objVar, node) {
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
  readwmcContactPersonPrimary(contactVar, node) {
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
  readwmcContactPerson(primaryPersonVar, node) {
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
  readwmcContactOrganization(primaryPersonVar, node) {
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
  readwmcContactPosition(contactVar, node) {
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
  readwmcContactAddress(contactVar, node) {
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
  readwmcAddressType(contactAddressVar, node) {
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
  readwmcAddress(contactAddressVar, node) {
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
  readwmcCity(contactAddressVar, node) {
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
  readwmcStateOrProvince(contactAddressVar, node) {
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
  readwmcPostCode(contactAddressVar, node) {
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
  readwmcCountry(contactAddressVar, node) {
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
  readwmcContactVoiceTelephone(contactVar, node) {
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
  readwmcContactFacsimileTelephone(contactVar, node) {
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
  readwmcContactElectronicMailAddress(contactVar, node) {
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
  readwmcDataURL(layerContextVar, node) {
    const layerContext = layerContextVar;
    const dataURL = 'dataURL';
    layerContext[dataURL] = this.getOnlineResource_href(node);
  }

  /**
   * @private
   * @function
   * @api stable
   */
  readwmcDimensionList(layerContextVar, node) {
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
  readwmcDimension(dimensionsVar, node) {
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

export default WMC110;
