/**
 * @module M/impl/control/GetFeatureInfo
 */
import OLFormatWFS from 'ol/format/WFS';
import { unByKey } from 'ol/Observable';
import OLControl from 'ol/control/Control';
import * as dialog from 'M/dialog';
import { isString, addParameters } from 'M/util/Utils';
import getfeatureinfoPopupTemplate from 'templates/getfeatureinfo_popup.html';
import getfeatureinfoLayers from 'templates/getfeatureinfo_layers.html';
import Popup from 'M/Popup';
import { get as getRemote } from 'M/util/Remote';
import { compileSync as compileTemplate } from 'M/util/Template';
import { isNullOrEmpty, normalize, beautifyAttribute } from 'M/util/Utils';
import { getValue } from 'M/i18n/language';
import Control from './Control';

/**
 * @classdesc
 * Main constructor of the class. Creates a GetFeatureInfo
 * control
 * @api
 */
class GetFeatureInfo extends Control {
  /**
   * @constructor
   * @param {string} format - Format response
   * @param {Object} options - Control options
   * @extends {M.impl.Control}
   * @api stable
   */
  constructor(format, options) {
    super();

    /**
     * Format response
     * @public
     * @type {String}
     * @api stable
     */
    this.userFormat = format;

    this.featureCount = options.featureCount;
    if (isNullOrEmpty(this.featureCount)) {
      this.featureCount = 10;
    }

    /**
     * Buffer
     * @public
     * @type {Integer}
     * @api stable
     */
    this.buffer = options.buffer;
  }

  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {function} template template of this control
   * @api stable
   * @export
   */
  addTo(map, element) {
    const olControls = map.getMapImpl().getControls().getArray();
    const hasControl = olControls.some(control => control instanceof GetFeatureInfo);
    if (hasControl === false) {
      this.facadeMap_ = map;
      OLControl.call(this, {
        element,
        target: null,
      });
      map.getMapImpl().addControl(this);
    }
  }

  /**
   * This function adds the event singleclick to the specified map
   *
   * @public
   * @function
   * @api stable
   */
  activate() {
    this.addOnClickEvent_();
  }

  /**
   * This function remove the event singleclick to the specified map
   *
   * @public
   * @function
   * @api stable
   */
  deactivate() {
    this.deleteOnClickEvent_();
  }

  /**
   * This function adds the event singleclick to the specified map
   *
   * @private
   * @function
   */
  addOnClickEvent_() {
    const olMap = this.facadeMap_.getMapImpl();
    if ((normalize(this.userFormat) === 'plain') || (normalize(this.userFormat) === 'text/plain')) {
      this.userFormat = 'text/plain';
    } else if ((normalize(this.userFormat) === 'gml') || (normalize(this.userFormat) === 'application/vnd.ogc.gml')) {
      this.userFormat = 'application/vnd.ogc.gml';
    } else {
      this.userFormat = 'text/html';
    }
    this.clickEventKey_ = olMap.on('singleclick', e => this.buildUrl_(dialog, e));
  }

  /**
   * This function builds the query URL and show results
   *
   * @private
   * @function
   * @param {ol.MapBrowserPointerEvent} evt - Browser point event
   */
  buildUrl_(dialogParam, evt) {
    this.evt = evt;
    const olMap = this.facadeMap_.getMapImpl();
    const wmsInfoURLS = this.buildWMSInfoURL(this.facadeMap_.getWMS());
    const wmtsInfoURLS = this.buildWMTSInfoURL(this.facadeMap_.getWMTS());
    const layerNamesUrls = [...wmtsInfoURLS, ...wmsInfoURLS]
      .filter(layer => !isNullOrEmpty(layer));
    if (layerNamesUrls.length > 0) {
      this.showInfoFromURL_(layerNamesUrls, evt.coordinate, olMap);
    } else {
      dialogParam.info('No existen capas consultables');
    }
  }

  /**
   * @function
   * @public
   * @api
   */
  buildWMSInfoURL(wmsLayers) {
    const olMap = this.facadeMap_.getMapImpl();
    const viewResolution = olMap.getView().getResolution();
    const srs = this.facadeMap_.getProjection().code;
    return wmsLayers.map((layer) => {
      const olLayer = layer.getImpl().getOL3Layer();
      let param;
      if (layer.isVisible() && layer.isQueryable() && !isNullOrEmpty(olLayer)) {
        param = {};
        const getFeatureInfoParams = {
          INFO_FORMAT: this.userFormat,
          FEATURE_COUNT: this.featureCount,
        };
        const regexBuffer = /buffer/i;
        const source = olLayer.getSource();
        const coord = this.evt.coordinate;
        let url = source.getFeatureInfoUrl(coord, viewResolution, srs, getFeatureInfoParams);
        if (isString(M.config.ticket)) {
          url = addParameters(url, { ticket: M.config.ticket });
        }
        if (!regexBuffer.test(layer.url)) {
          getFeatureInfoParams.Buffer = this.buffer;
        }
        param = { layer: layer.legend || layer.name, url };
      }
      return param;
    });
  }

  /**
   * @function
   * @public
   * @api
   */
  buildWMTSInfoURL(wmtsLayers) {
    return wmtsLayers.map((layer) => {
      let param;
      if (layer.isVisible()) {
        param = {};
        const infoFormat = this.userFormat;
        const coord = this.evt.coordinate;
        let url = layer.getGetFeatureInfoUrl(coord, this.facadeMap_.getZoom(), infoFormat);
        if (isString(M.config.ticket)) {
          url = addParameters(url, { ticket: M.config.ticket });
        }
        param = { layer: layer.legend || layer.name, url };
      }
      return param;
    });
  }

  /**
   * This function remove the event singleclick to the specified map
   *
   * @private
   * @function
   */
  deleteOnClickEvent_() {
    // const olMap = this.facadeMap_.getMapImpl();
    unByKey(this.clickEventKey_);
  }

  /**
   * This function specifies whether the information is valid
   *
   * @param {string} info - Information to validate
   * @param {string} formato - Specific format to validate
   * @returns {boolean} res - Is valid or not format
   * @private
   * @function
   */
  static insert(info, formato) {
    let res = false;
    switch (formato) {
      case 'text/html':
        // ex
        const infoContainer = document.createElement('div');
        infoContainer.innerHTML = info;
        // content
        let content = '';
        Array.prototype.forEach.call(infoContainer.querySelectorAll('body'), (element) => {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('div'), (element) => {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('table'), (element) => {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('b'), (element) => {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('span'), (element) => {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('input'), (element) => {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('a'), (element) => {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('img'), (element) => {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('p'), (element) => {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('ul'), (element) => {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('li'), (element) => {
          content += element.innerHTML.trim();
        });

        if ((content.length > 0) && !/WMS\s+server\s+error/i.test(info)) {
          res = true;
        }
        break;

      case 'application/vnd.ogc.gml': // ol.format.GML (http://openlayers.org/en/v3.9.0/apidoc/ol.format.GML.html)
        const formater = new OLFormatWFS();
        const features = formater.readFeatures(info);
        res = (features.length > 0);
        break;

      case 'text/plain': // exp reg
        if (!/returned\s+no\s+results/i.test(info) && !/features\s+were\s+found/i.test(info) && !/:$/i.test(info)) {
          res = true;
        }
        break;
      default:
    }
    return res;
  }

  /**
   * This function formats the response
   *
   * @param {string} info - Information to formatting
   * @param {string} formato - Specific format
   * @param {string} layername - Layer name
   * @returns {string} information - Formatted information
   * @private
   * @function
   */
  formatInfo(info, formato, layerName) {
    let formatedInfo = null;
    switch (formato) {
      case 'text/html': // ex
        formatedInfo = info;
        break;
      case 'application/vnd.ogc.gml': // ol.format.GML (http://openlayers.org/en/v3.9.0/apidoc/ol.format.GML.html)
        // let formater = new ol.format.GML();
        // let feature = formater.readFeatures(info)[0];
        const formater = new OLFormatWFS();
        const features = formater.readFeatures(info);
        formatedInfo = '';
        features.forEach((feature) => {
          const attr = feature.getKeys();
          formatedInfo += '<div class=\'divinfo\'>';
          formatedInfo += `<table class='mapea-table'><tbody><tr><td class='header' colspan='3'>' ${beautifyAttribute(layerName)} '</td></tr>'`;
          for (let i = 0, ilen = attr.length; i < ilen; i += 1) {
            const attrName = attr[i];
            const attrValue = feature.get(attrName);

            formatedInfo += '<tr><td class="key"><b>';
            formatedInfo += beautifyAttribute(attrName);
            formatedInfo += '</b></td><td class="value">';
            formatedInfo += attrValue;
            formatedInfo += '</td></tr>';
          }
          formatedInfo += '</tbody></table></div>';
        });
        break;
      case 'text/plain': // exp reg
        if (GetFeatureInfo.regExs.gsResponse.test(info)) {
          formatedInfo = this.txtToHtmlGeoserver(info, layerName);
        } else {
          formatedInfo = this.txtToHtmlMapserver(info, layerName);
        }
        break;
      default:
    }
    return formatedInfo;
  }

  /**
   * This function indicates whether the format is accepted by the layer - Specific format text/html
   *
   * @param {string} info - Response to consult layer
   * @param {string} formato - Specific format
   * @returns {boolean} unsupported - It indicates whether the format is accepted
   * @private
   * @function
   */
  static unsupportedFormat(info, formato) {
    let unsupported = false;
    if (formato === 'text/html') {
      unsupported = GetFeatureInfo.regExs.msUnsupportedFormat.test(info);
    }
    return unsupported;
  }

  /**
   * This function return formatted information. Specific Geoserver
   *
   * @private
   * @function
   * @param {string} info - Information to formatting
   * @param {string} layername - Layer name
   * @returns {string} html - Information formated
   */
  txtToHtmlGeoserver(info, layerName) {
    // get layer name from the header
    // let layerName = info.replace(/[\w\s\S]*\:(\w*)\'\:[\s\S\w]*/i, "$1");
    // remove header
    let infoVar = info;

    infoVar = infoVar.replace(/[\w\s\S]*':/i, '');

    infoVar = infoVar.replace(/---(-*)(n+)---(-*)/g, '#newfeature#');

    const attrValuesString = infoVar.split('\n');

    let html = '<div class=\'divinfo\'>';

    // build the table
    html += `<table class='mapea-table'><tbody><tr><td class='header' colspan='3'>${beautifyAttribute(layerName)}</td></tr>`;

    for (let i = 0, ilen = attrValuesString.length; i < ilen; i += 1) {
      const attrValueString = attrValuesString[i].trim();
      if (attrValueString.indexOf('=') !== -1) {
        const attrValue = attrValueString.split('=');
        const attr = attrValue[0].trim();
        let value = '-';
        if (attrValue.length > 1) {
          value = attrValue[1].trim();
          if (value.length === 0 || value === 'null') {
            value = '-';
          }
        }

        if (GetFeatureInfo.regExs.gsGeometry.test(attr) === false) {
          html += '<tr><td class="key"><b>';
          html += beautifyAttribute(attr);
          html += '</b></td><td class="value">';
          html += value;
          html += '</td></tr>';
        }
      } else if (GetFeatureInfo.regExs.gsNewFeature.test(attrValueString)) {
        // set new header
        html += `<tr><td class="header" colspan="3">${beautifyAttribute(layerName)}</td></tr>`;
      }
    }

    html += '</tbody></table></div>';

    return html;
  }

  /**
   * This function return formatted information. Specific Mapserver
   *
   * @private
   * @function
   * @param {string} info - Information to formatting
   * @returns {string} html - Information formated
   */
  txtToHtmlMapserver(info) {
    let infoVar = info;
    // remove header
    infoVar = infoVar.replace(/[\w\s\S]*(layer)/i, '$1');

    // get layer name
    const layerName = infoVar.replace(/layer(\s*)'(\w+)'[\w\s\S]*/i, '$2');

    // remove layer name
    infoVar = infoVar.replace(/layer(\s*)'(\w+)'([\w\s\S]*)/i, '$3');

    // remove feature number
    infoVar = infoVar.replace(/feature(\s*)(\w*)(\s*)(:)([\w\s\S]*)/i, '$5');

    // remove simple quotes
    infoVar = infoVar.replace(/'/g, '');

    // replace the equal (=) with (;)
    infoVar = infoVar.replace(/=/g, ';');

    const attrValuesString = infoVar.split('\n');

    let html = '';
    const htmlHeader = `<table class='mapea-table'><tbody><tr><td class='header' colspan='3'>${beautifyAttribute(layerName)}</td></tr>`;

    for (let i = 0, ilen = attrValuesString.length; i < ilen; i += 1) {
      const attrValueString = attrValuesString[i].trim();
      const nextAttrValueString = attrValuesString[i] ? attrValuesString[i].trim() : '';

      const attrValue = attrValueString.split(';');
      const attr = attrValue[0].trim();
      let value = '-';
      if (attrValue.length > 1) {
        value = attrValue[1].trim();
        if (value.length === 0) {
          value = '-';
        }
      }

      if (attr.length > 0) {
        if (GetFeatureInfo.regExs.msNewFeature.test(attr)) {
          if ((nextAttrValueString.length > 0) &&
            !GetFeatureInfo.regExs.msNewFeature.test(nextAttrValueString)) {
            // set new header
            html += `<tr><td class='header' colspan='3'>${beautifyAttribute(layerName)}</td><td></td></tr>`;
          }
        } else {
          html += '<tr><td class="key"><b>';
          html += beautifyAttribute(attr);
          html += '</b></td><td class="value">';
          html += value;
          html += '</td></tr>';
        }
      }
    }

    if (html.length > 0) {
      html = `${htmlHeader + html}</tbody></table>`;
    }

    return html;
  }

  /**
   * This function displays information in a popup
   *
   * @private
   * @function
   * @param {array<object>} layerNamesUrls - Consulted layers
   * @param {array} coordinate - Coordinate position onClick
   * @param {olMap} olMap - Map

   */
  showInfoFromURL_(layerNamesUrls, coordinate, olMap) {
    const htmlAsText = compileTemplate(getfeatureinfoPopupTemplate, {
      vars: {
        info: GetFeatureInfo.LOADING_MESSAGE,
      },
      parseToHtml: false,
    });

    const infos = [];
    const formato = String(this.userFormat);
    let contFull = 0;
    const loadingInfoTab = {
      icon: 'g-cartografia-info',
      title: GetFeatureInfo.POPUP_TITLE,
      content: htmlAsText,
    };
    let popup = this.facadeMap_.getPopup();

    if (isNullOrEmpty(popup)) {
      popup = new Popup();
      popup.addTab(loadingInfoTab);
      this.facadeMap_.addPopup(popup, coordinate);
    } else {
      // removes popup if all contents are getfeatureinfo
      const hasExternalContent =
        popup.getTabs().some(tab => tab.title !== GetFeatureInfo.POPUP_TITLE);
      if (!hasExternalContent) {
        this.facadeMap_.removePopup();
        popup = new Popup();
        popup.addTab(loadingInfoTab);
        this.facadeMap_.addPopup(popup, coordinate);
      } else {
        popup.addTab(loadingInfoTab);
      }
    }
    layerNamesUrls.forEach((layerNameUrl) => {
      const url = layerNameUrl.url;
      const layerName = layerNameUrl.layer;
      getRemote(url).then((response) => {
        popup = this.facadeMap_.getPopup();
        if (response.code === 200 && response.error === false) {
          const info = response.text;
          if (GetFeatureInfo.insert(info, formato) === true) {
            const formatedInfo = this.formatInfo(info, formato, layerName);
            infos.push({ formatedInfo, layerName });
          } else if (GetFeatureInfo.unsupportedFormat(info, formato)) {
            infos.push({
              formatedInfo: getValue('getfeatureinfo').unsupported_format,
              layerName,
            });
          }
        }
        contFull += 1;
        if (layerNamesUrls.length === contFull && !isNullOrEmpty(popup)) {
          popup.removeTab(loadingInfoTab);
          if (infos.length === 0) {
            popup.addTab({
              icon: 'g-cartografia-info',
              title: GetFeatureInfo.POPUP_TITLE,
              content: getValue('getfeatureinfo').no_info,
            });
          } else {
            const popupContent = compileTemplate(getfeatureinfoLayers, {
              vars: {
                layers: infos,
                info_of: getValue('getfeatureinfo').info_of,
              },
              parseToHtml: false,
            });
            popup.addTab({
              icon: 'g-cartografia-info',
              title: GetFeatureInfo.POPUP_TITLE,
              content: popupContent,
              listeners: [{
                selector: '.m-getfeatureinfo-content-info div.m-arrow-right',
                all: true,
                type: 'click',
                callback: e => this.toogleSection(e),
              }],
            });
          }
        }
      });
    });
    this.popup_ = popup;
  }

  /**
   * This functions handle the close/open beahaviour of the sections feature info
   * @function
   */
  toogleSection(e) {
    const { target } = e;
    const { parentElement } = target.parentElement;
    const content = parentElement.querySelector('.m-getfeatureinfo-content-info-body');
    if (content.classList.contains('m-content-collapsed')) {
      content.classList.remove('m-content-collapsed');
      target.classList.remove('m-arrow-right');
      target.classList.add('m-arrow-down');
      const coordinates = this.popup_.getCoordinate();
      if (!isNullOrEmpty(this.popup_.getImpl().panIntoView)) {
        this.popup_.getImpl().panIntoView(coordinates);
      }
    } else {
      content.classList.add('m-content-collapsed');
      target.classList.add('m-arrow-right');
      target.classList.remove('m-arrow-down');
    }
  }
}

/**
 * Loading message
 * @const
 * @type {string}
 * @public
 * @api
 */
GetFeatureInfo.LOADING_MESSAGE = 'Obteniendo información...';

/**
 * Regular expressions of GetFeatureInfo
 * @type {object}
 * @public
 * @api
 */
GetFeatureInfo.regExs = {
  gsResponse: /^results[\w\s\S]*'http:/i,
  msNewFeature: /feature(\s*)(\w+)(\s*):/i,
  gsNewFeature: /#newfeature#/,
  gsGeometry: /geom$/i,
  msGeometry: /boundedby$/i,
  msUnsupportedFormat: /error(.*)unsupported(.*)info_format/i,
};

export default GetFeatureInfo;
