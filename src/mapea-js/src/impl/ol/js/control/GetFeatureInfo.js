import Control from "./Control";
import Utils from "facade/js/util/Utils";
import Popup from "facade/js/Popup";
import getfeatureinfoPopupTemplate from "templates/getfeatureinfo_popup.html";

/**
 * @namespace M.impl.control
 */
export default class GetFeatureInfo extends Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a GetFeatureInfo
   * control
   *
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
    if (Utils.isNullOrEmpty(this.featureCount)) {
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
    let olMap = this.facadeMap_.getMapImpl();
    if ((Utils.normalize(this.userFormat) === "plain") || (Utils.normalize(this.userFormat) === "text/plain")) {
      this.userFormat = "text/plain";
    }
    else if ((Utils.normalize(this.userFormat) === "gml") || (Utils.normalize(this.userFormat) === "application/vnd.ogc.gml")) {
      this.userFormat = "application/vnd.ogc.gml";
    }
    else {
      this.userFormat = "text/html";
    }
    olMap.on('singleclick', this.buildUrl_, this);
  }

  /**
   * This function builds the query URL and show results
   *
   * @private
   * @function
   * @param {ol.MapBrowserPointerEvent} evt - Browser point event
   */
  buildUrl_(evt) {
    let olMap = this.facadeMap_.getMapImpl();
    let viewResolution = olMap.getView().getResolution();
    let srs = this.facadeMap_.getProjection().code;
    let layerNamesUrls = [];
    this.facadeMap_.getWMS().forEach(layer => {
      let olLayer = layer.getImpl().getOL3Layer();
      if (layer.isVisible() && layer.isQueryable() && !Utils.isNullOrEmpty(olLayer)) {
        let getFeatureInfoParams = {
          'INFO_FORMAT': this.userFormat,
          'FEATURE_COUNT': this.featureCount,
        };
        if (!/buffer/i.test(layer.url)) {
          getFeatureInfoParams['Buffer'] = this.buffer;
        }
        let url = olLayer.getSource().getGetFeatureInfoUrl(evt.coordinate, viewResolution, srs, getFeatureInfoParams);
        layerNamesUrls.push({
          /** @type {String} */
          'layer': layer.name,
          /** @type {String} */
          'url': url
        });
      }
    }, this);
    if (layerNamesUrls.length > 0) {
      this.showInfoFromURL_(layerNamesUrls, evt.coordinate, olMap);
    }
    else {
      Dialog.info('No existen capas consultables');
    }
  }

  /**
   * This function remove the event singleclick to the specified map
   *
   * @private
   * @function
   */
  deleteOnClickEvent_() {
    let olMap = this.facadeMap_.getMapImpl();
    olMap.un('singleclick', this.buildUrl_, this);
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
  insert_(info, formato) {
    let res = false;
    switch (formato) {
      case "text/html": // ex
        let infoContainer = document.createElement("div");
        infoContainer.innerHTML = info;

        // content
        let content = "";
        Array.prototype.forEach.call(infoContainer.querySelectorAll('body'), element => {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('div'), element => {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('table'), element => {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('b'), element => {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('span'), element => {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('input'), element => {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('a'), element => {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('img'), element => {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('p'), element => {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('ul'), element => {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('li'), element => {
          content += element.innerHTML.trim();
        });

        if ((content.length > 0) && !/WMS\s+server\s+error/i.test(info)) {
          res = true;
        }
        break;
      case "application/vnd.ogc.gml": // ol.format.GML (http://openlayers.org/en/v3.9.0/apidoc/ol.format.GML.html)
        let formater = new ol.format.WFS();
        let features = formater.readFeatures(info);
        res = (features.length > 0);
        break;
      case "text/plain": // exp reg
        if (!/returned\s+no\s+results/i.test(info) && !/features\s+were\s+found/i.test(info) && !/:$/i.test(info)) {
          res = true;
        }
        break;
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
  formatInfo_(info, formato, layerName) {
    let formatedInfo = null;
    switch (formato) {
      case "text/html": // ex
        formatedInfo = info;
        break;
      case "application/vnd.ogc.gml": // ol.format.GML (http://openlayers.org/en/v3.9.0/apidoc/ol.format.GML.html)
        // let formater = new ol.format.GML();
        // let feature = formater.readFeatures(info)[0];
        let formater = new ol.format.WFS();
        let features = formater.readFeatures(info);
        formatedInfo = "";
        features.forEach((feature) => {
          let attr = feature.getKeys();
          formatedInfo += "<div class=\"divinfo\">";
          formatedInfo += "<table class=\"mapea-table\"><tbody><tr><td class=\"header\" colspan=\"3\">" + Utils.beautifyAttribute(layerName) + "</td></tr>";
          for (let i = 0, ilen = attr.length; i < ilen; i++) {
            let attrName = attr[i];
            let attrValue = feature.get(attrName);

            formatedInfo += '<tr><td class="key"><b>';
            formatedInfo += Utils.beautifyAttribute(attrName);
            formatedInfo += '</b></td><td class="value">';
            formatedInfo += attrValue;
            formatedInfo += "</td></tr>";
          }
          formatedInfo += "</tbody></table></div>";
        });
        break;
      case "text/plain": // exp reg
        if (GetFeatureInfo.regExs.gsResponse.test(info)) {
          formatedInfo = this.txtToHtml_Geoserver_(info, layerName);
        }
        else {
          formatedInfo = this.txtToHtml_Mapserver_(info, layerName);
        }
        break;
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
  unsupportedFormat_(info, formato) {
    let unsupported = false;
    if (formato === "text/html") {
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
  txtToHtml_Geoserver_(info, layerName) {
    // get layer name from the header
    // let layerName = info.replace(/[\w\s\S]*\:(\w*)\'\:[\s\S\w]*/i, "$1");

    // remove header
    info = info.replace(/[\w\s\S]*\'\:/i, "");

    info = info.replace(/---(\-*)(\n+)---(\-*)/g, "#newfeature#");

    let attrValuesString = info.split("\n");

    let html = "<div class=\"divinfo\">";

    // build the table
    html += "<table class=\"mapea-table\"><tbody><tr><td class=\"header\" colspan=\"3\">" + Utils.beautifyAttribute(layerName) + "</td></tr>";

    for (let i = 0, ilen = attrValuesString.length; i < ilen; i++) {
      let attrValueString = attrValuesString[i].trim();
      if (attrValueString.indexOf("=") != -1) {
        let attrValue = attrValueString.split("=");
        let attr = attrValue[0].trim();
        let value = "-";
        if (attrValue.length > 1) {
          value = attrValue[1].trim();
          if (value.length === 0 || value === "null") {
            value = "-";
          }
        }

        if (GetFeatureInfo.regExs.gsGeometry.test(attr) === false) {
          html += '<tr><td class="key"><b>';
          html += Utils.beautifyAttribute(attr);
          html += '</b></td><td class="value">';
          html += value;
          html += "</td></tr>";
        }
      }
      else if (GetFeatureInfo.regExs.gsNewFeature.test(attrValueString)) {
        // set new header
        html += "<tr><td class=\"header\" colspan=\"3\">" + Utils.beautifyAttribute(layerName) + "</td></tr>";
      }
    }

    html += "</tbody></table></div>";

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
  txtToHtml_Mapserver_(info) {
    // remove header
    info = info.replace(/[\w\s\S]*(layer)/i, "$1");

    // get layer name
    let layerName = info.replace(/layer(\s*)\'(\w+)\'[\w\s\S]*/i, "$2");

    // remove layer name
    info = info.replace(/layer(\s*)\'(\w+)\'([\w\s\S]*)/i, "$3");

    // remove feature number
    info = info.replace(/feature(\s*)(\w*)(\s*)(\:)([\w\s\S]*)/i, "$5");

    // remove simple quotes
    info = info.replace(/\'/g, "");

    // replace the equal (=) with (;)
    info = info.replace(/\=/g, ';');

    let attrValuesString = info.split("\n");

    let html = "";
    let htmlHeader = "<table class=\"mapea-table\"><tbody><tr><td class=\"header\" colspan=\"3\">" + Utils.beautifyAttribute(layerName) + "</td></tr>";

    for (let i = 0, ilen = attrValuesString.length; i < ilen; i++) {
      let attrValueString = attrValuesString[i].trim();
      let nextAttrValueString = attrValuesString[i] ? attrValuesString[i].trim() : "";
      let attrValue = attrValueString.split(";");
      let attr = attrValue[0].trim();
      let value = "-";
      if (attrValue.length > 1) {
        value = attrValue[1].trim();
        if (value.length === 0) {
          value = "-";
        }
      }

      if (attr.length > 0) {
        if (GetFeatureInfo.regExs.msNewFeature.test(attr)) {
          if ((nextAttrValueString.length > 0) && !GetFeatureInfo.regExs.msNewFeature.test(nextAttrValueString)) {
            // set new header
            html += "<tr><td class=\"header\" colspan=\"3\">" + Utils.beautifyAttribute(layerName) + "</td><td></td></tr>";
          }
        }
        else {
          html += '<tr><td class="key"><b>';
          html += Utils.beautifyAttribute(attr);
          html += '</b></td><td class="value">';
          html += value;
          html += "</td></tr>";
        }
      }
    }

    if (html.length > 0) {
      html = htmlHeader + html + "</tbody></table>";
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
    let htmlAsText = Template.compile(getfeatureinfoPopupTemplate, {
      'vars': {
        'info': GetFeatureInfo.LOADING_MESSAGE
      },
      'parseToHtml': false
    });

    let infos = [];
    let formato = String(this.userFormat);
    let contFull = 0;
    let loadingInfoTab = {
      'icon': 'g-cartografia-info',
      'title': GetFeatureInfo.POPUP_TITLE,
      'content': htmlAsText
    };
    let popup = this.facadeMap_.getPopup();

    if (Utils.isNullOrEmpty(popup)) {
      popup = new Popup();
      popup.addTab(loadingInfoTab);
      this.facadeMap_.addPopup(popup, coordinate);
    }
    else {
      // removes popup if all contents are getfeatureinfo
      let hasExternalContent = popup.getTabs().some(tab => tab['title'] !== GetFeatureInfo.POPUP_TITLE);
      if (!hasExternalContent) {
        this.facadeMap_.removePopup();
        popup = new Popup();
        popup.addTab(loadingInfoTab);
        this.facadeMap_.addPopup(popup, coordinate);
      }
      else {
        popup.addTab(loadingInfoTab);
      }
    }
    layerNamesUrls.forEach(layerNameUrl => {
      let url = layerNameUrl['url'];
      let layerName = layerNameUrl['layer'];
      Remote.get(url).then(response => {
        popup = this.facadeMap_.getPopup();
        if (response.code === 200 && response.error === false) {
          let info = response.text;
          if (this.insert_(info, formato) === true) {
            let formatedInfo = this.formatInfo_(info, formato, layerName);
            infos.push(formatedInfo);
          }
          else if (this.unsupportedFormat_(info, formato)) {
            infos.push('La capa <b>' + layerName + '</b> no soporta el formato <i>' + formato + '</i>');
          }
        }
        if (layerNamesUrls.length === ++contFull && !Utils.isNullOrEmpty(popup)) {
          popup.removeTab(loadingInfoTab);
          if (infos.join('') === "") {
            popup.addTab({
              'icon': 'g-cartografia-info',
              'title': GetFeatureInfo.POPUP_TITLE,
              'content': 'No hay información asociada.'
            });
          }
          else {
            popup.addTab({
              'icon': 'g-cartografia-info',
              'title': GetFeatureInfo.POPUP_TITLE,
              'content': infos.join('')
            });
          }
        }
      });
    });
  }
}

/**
 * Loading message
 * @const
 * @type {string}
 * @public
 * @api stable
 */
GetFeatureInfo.LOADING_MESSAGE_ = 'Obteniendo información...';

GetFeatureInfo.regExs = {
  gsResponse: /^results[\w\s\S]*\'http\:/i,
  msNewFeature: /feature(\s*)(\w+)(\s*)\:/i,
  gsNewFeature: /\#newfeature\#/,
  gsGeometry: /geom$/i,
  msGeometry: /boundedby$/i,
  msUnsupportedFormat: /error(.*)unsupported(.*)info\_format/i
};
