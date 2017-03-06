goog.provide('M.impl.control.GetFeatureInfo');

goog.require('M.impl.Control');
goog.require('ol.format.GML');

/**
 * @namespace M.impl.control
 */
(function () {

  var regExs = {
    gsResponse: /^results[\w\s\S]*\'http\:/i,
    msNewFeature: /feature(\s*)(\w+)(\s*)\:/i,
    gsNewFeature: /\#newfeature\#/,
    gsGeometry: /geom$/i,
    msGeometry: /boundedby$/i,
    msUnsupportedFormat: /error(.*)unsupported(.*)info\_format/i
  };

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
  M.impl.control.GetFeatureInfo = function (format, options) {
    /**
     * Format response
     * @public
     * @type {String}
     * @api stable
     */
    this.userFormat = format;

    this.featureCount = options.featureCount;
    if (M.utils.isNullOrEmpty(this.featureCount)) {
      this.featureCount = 10;
    }

    /**
     * Buffer
     * @public
     * @type {Integer}
     * @api stable
     */
    this.buffer = options.buffer;
  };
  goog.inherits(M.impl.control.GetFeatureInfo, M.impl.Control);

  /**
   * This function adds the event singleclick to the specified map
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.control.GetFeatureInfo.prototype.activate = function () {
    this.addOnClickEvent_();
  };

  /**
   * This function remove the event singleclick to the specified map
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.control.GetFeatureInfo.prototype.deactivate = function () {
    this.deleteOnClickEvent_();
  };

  /**
   * This function adds the event singleclick to the specified map
   *
   * @private
   * @function
   */
  M.impl.control.GetFeatureInfo.prototype.addOnClickEvent_ = function () {
    var olMap = this.facadeMap_.getMapImpl();
    if ((M.utils.normalize(this.userFormat) === "plain") || (M.utils.normalize(this.userFormat) === "text/plain")) {
      this.userFormat = "text/plain";
    }
    else if ((M.utils.normalize(this.userFormat) === "gml") || (M.utils.normalize(this.userFormat) === "application/vnd.ogc.gml")) {
      this.userFormat = "application/vnd.ogc.gml";
    }
    else {
      this.userFormat = "text/html";
    }
    olMap.on('singleclick', this.buildUrl_, this);
  };

  /**
   * This function builds the query URL and show results
   *
   * @private
   * @function
   * @param {ol.MapBrowserPointerEvent} evt - Browser point event
   */
  M.impl.control.GetFeatureInfo.prototype.buildUrl_ = function (evt) {
    var olMap = this.facadeMap_.getMapImpl();
    var viewResolution = olMap.getView().getResolution();
    var srs = this.facadeMap_.getProjection().code;
    var layerNamesUrls = [];
    this.facadeMap_.getWMS().forEach(function (layer) {
      var olLayer = layer.getImpl().getOL3Layer();
      if (layer.isVisible() && layer.isQueryable() && !M.utils.isNullOrEmpty(olLayer)) {
        let getFeatureInfoParams = {
          'INFO_FORMAT': this.userFormat,
          'FEATURE_COUNT': this.featureCount,
        };
        if (!/buffer/i.test(layer.url)) {
          getFeatureInfoParams['Buffer'] = this.buffer;
        }
        var url = olLayer.getSource().getGetFeatureInfoUrl(evt.coordinate, viewResolution, srs, getFeatureInfoParams);
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
      M.dialog.info('No existen capas consultables');
    }
  };

  /**
   * This function remove the event singleclick to the specified map
   *
   * @private
   * @function
   */
  M.impl.control.GetFeatureInfo.prototype.deleteOnClickEvent_ = function () {
    var olMap = this.facadeMap_.getMapImpl();
    olMap.un('singleclick', this.buildUrl_, this);
  };

  /**
   * This function specifies whether the information is valid
   *
   * @param {string} info - Information to validate
   * @param {string} formato - Specific format to validate
   * @returns {boolean} res - Is valid or not format
   * @private
   * @function
   */
  M.impl.control.GetFeatureInfo.prototype.insert_ = function (info, formato) {
    var res = false;
    switch (formato) {
      case "text/html": // ex
        var infoContainer = document.createElement("div");
        infoContainer.innerHTML = info;

        // content
        var content = "";
        Array.prototype.forEach.call(infoContainer.querySelectorAll('body'), function (element) {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('div'), function (element) {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('table'), function (element) {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('b'), function (element) {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('span'), function (element) {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('input'), function (element) {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('a'), function (element) {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('img'), function (element) {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('p'), function (element) {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('ul'), function (element) {
          content += element.innerHTML.trim();
        });
        Array.prototype.forEach.call(infoContainer.querySelectorAll('li'), function (element) {
          content += element.innerHTML.trim();
        });

        if ((content.length > 0) && !/WMS\s+server\s+error/i.test(info)) {
          res = true;
        }
        break;
      case "application/vnd.ogc.gml": // ol.format.GML (http://openlayers.org/en/v3.9.0/apidoc/ol.format.GML.html)
        var formater = new ol.format.WFS();
        var features = formater.readFeatures(info);
        res = (features.length > 0);
        break;
      case "text/plain": // exp reg
        if (!/returned\s+no\s+results/i.test(info) && !/features\s+were\s+found/i.test(info) && !/:$/i.test(info)) {
          res = true;
        }
        break;
    }
    return res;
  };

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
  M.impl.control.GetFeatureInfo.prototype.formatInfo_ = function (info, formato, layerName) {
    var formatedInfo = null;
    switch (formato) {
      case "text/html": // ex
        formatedInfo = info;
        break;
      case "application/vnd.ogc.gml": // ol.format.GML (http://openlayers.org/en/v3.9.0/apidoc/ol.format.GML.html)
        // var formater = new ol.format.GML();
        // var feature = formater.readFeatures(info)[0];
        var formater = new ol.format.WFS();
        var features = formater.readFeatures(info);
        formatedInfo = "";
        features.forEach(function (feature) {
          var attr = feature.getKeys();
          formatedInfo += "<div class=\"divinfo\">";
          formatedInfo += "<table class=\"mapea-table\"><tbody><tr><td class=\"header\" colspan=\"3\">" + M.utils.beautifyAttribute(layerName) + "</td></tr>";
          for (var i = 0, ilen = attr.length; i < ilen; i++) {
            var attrName = attr[i];
            var attrValue = feature.get(attrName);

            formatedInfo += '<tr><td class="key"><b>';
            formatedInfo += M.utils.beautifyAttribute(attrName);
            formatedInfo += '</b></td><td class="value">';
            formatedInfo += attrValue;
            formatedInfo += "</td></tr>";
          }
          formatedInfo += "</tbody></table></div>";
        });
        break;
      case "text/plain": // exp reg
        if (regExs.gsResponse.test(info)) {
          formatedInfo = this.txtToHtml_Geoserver_(info, layerName);
        }
        else {
          formatedInfo = this.txtToHtml_Mapserver_(info, layerName);
        }
        break;
    }
    return formatedInfo;
  };

  /**
   * This function indicates whether the format is accepted by the layer - Specific format text/html
   *
   * @param {string} info - Response to consult layer
   * @param {string} formato - Specific format
   * @returns {boolean} unsupported - It indicates whether the format is accepted
   * @private
   * @function
   */
  M.impl.control.GetFeatureInfo.prototype.unsupportedFormat_ = function (info, formato) {
    var unsupported = false;
    if (formato === "text/html") {
      unsupported = regExs.msUnsupportedFormat.test(info);
    }
    return unsupported;
  };

  /**
   * This function return formatted information. Specific Geoserver
   *
   * @private
   * @function
   * @param {string} info - Information to formatting
   * @param {string} layername - Layer name
   * @returns {string} html - Information formated
   */
  M.impl.control.GetFeatureInfo.prototype.txtToHtml_Geoserver_ = function (info, layerName) {
    // get layer name from the header
    // var layerName = info.replace(/[\w\s\S]*\:(\w*)\'\:[\s\S\w]*/i, "$1");

    // remove header
    info = info.replace(/[\w\s\S]*\'\:/i, "");

    info = info.replace(/---(\-*)(\n+)---(\-*)/g, "#newfeature#");

    var attrValuesString = info.split("\n");

    var html = "<div class=\"divinfo\">";

    // build the table
    html += "<table class=\"mapea-table\"><tbody><tr><td class=\"header\" colspan=\"3\">" + M.utils.beautifyAttribute(layerName) + "</td></tr>";

    for (var i = 0, ilen = attrValuesString.length; i < ilen; i++) {
      var attrValueString = attrValuesString[i].trim();
      if (attrValueString.indexOf("=") != -1) {
        var attrValue = attrValueString.split("=");
        var attr = attrValue[0].trim();
        var value = "-";
        if (attrValue.length > 1) {
          value = attrValue[1].trim();
          if (value.length === 0 || value === "null") {
            value = "-";
          }
        }

        if (regExs.gsGeometry.test(attr) === false) {
          html += '<tr><td class="key"><b>';
          html += M.utils.beautifyAttribute(attr);
          html += '</b></td><td class="value">';
          html += value;
          html += "</td></tr>";
        }
      }
      else if (regExs.gsNewFeature.test(attrValueString)) {
        // set new header
        html += "<tr><td class=\"header\" colspan=\"3\">" + M.utils.beautifyAttribute(layerName) + "</td></tr>";
      }
    }

    html += "</tbody></table></div>";

    return html;
  };

  /**
   * This function return formatted information. Specific Mapserver
   *
   * @private
   * @function
   * @param {string} info - Information to formatting
   * @returns {string} html - Information formated
   */
  M.impl.control.GetFeatureInfo.prototype.txtToHtml_Mapserver_ = function (info) {
    // remove header
    info = info.replace(/[\w\s\S]*(layer)/i, "$1");

    // get layer name
    var layerName = info.replace(/layer(\s*)\'(\w+)\'[\w\s\S]*/i, "$2");

    // remove layer name
    info = info.replace(/layer(\s*)\'(\w+)\'([\w\s\S]*)/i, "$3");

    // remove feature number
    info = info.replace(/feature(\s*)(\w*)(\s*)(\:)([\w\s\S]*)/i, "$5");

    // remove simple quotes
    info = info.replace(/\'/g, "");

    // replace the equal (=) with (;)
    info = info.replace(/\=/g, ';');

    var attrValuesString = info.split("\n");

    var html = "";
    var htmlHeader = "<table class=\"mapea-table\"><tbody><tr><td class=\"header\" colspan=\"3\">" + M.utils.beautifyAttribute(layerName) + "</td></tr>";

    for (var i = 0, ilen = attrValuesString.length; i < ilen; i++) {
      var attrValueString = attrValuesString[i].trim();
      var nextAttrValueString = attrValuesString[i] ? attrValuesString[i]
        .trim() : "";
      var attrValue = attrValueString.split(";");
      var attr = attrValue[0].trim();
      var value = "-";
      if (attrValue.length > 1) {
        value = attrValue[1].trim();
        if (value.length === 0) {
          value = "-";
        }
      }

      if (attr.length > 0) {
        if (regExs.msNewFeature.test(attr)) {
          if ((nextAttrValueString.length > 0) && !regExs.msNewFeature.test(nextAttrValueString)) {
            // set new header
            html += "<tr><td class=\"header\" colspan=\"3\">" + M.utils.beautifyAttribute(layerName) + "</td><td></td></tr>";
          }
        }
        else {
          html += '<tr><td class="key"><b>';
          html += M.utils.beautifyAttribute(attr);
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
  };

  /**
   * This function displays information in a popup
   *
   * @private
   * @function
   * @param {array<object>} layerNamesUrls - Consulted layers
   * @param {array} coordinate - Coordinate position onClick
   * @param {olMap} olMap - Map

   */
  M.impl.control.GetFeatureInfo.prototype.showInfoFromURL_ = function (layerNamesUrls,
    coordinate, olMap) {
    var infos = [];
    var formato = String(this.userFormat);
    var contFull = 0;
    var this_ = this;
    var loadingInfoTab;
    var popup;
    M.template.compile(M.control.GetFeatureInfo.POPUP_TEMPLATE, {
      'jsonp': true,
      'vars': {
        'info': M.impl.control.GetFeatureInfo.LOADING_MESSAGE
      },
      'parseToHtml': false
    }).then(function (htmlAsText) {
      popup = this_.facadeMap_.getPopup();
      loadingInfoTab = {
        'icon': 'g-cartografia-info',
        'title': M.control.GetFeatureInfo.POPUP_TITLE,
        'content': htmlAsText
      };
      if (M.utils.isNullOrEmpty(popup)) {
        popup = new M.Popup();
        popup.addTab(loadingInfoTab);
        this_.facadeMap_.addPopup(popup, coordinate);
      }
      else {
        // removes popup if all contents are getfeatureinfo
        var hasExternalContent = popup.getTabs().some(function (tab) {
          return (tab['title'] !== M.control.GetFeatureInfo.POPUP_TITLE);
        });
        if (!hasExternalContent) {
          this_.facadeMap_.removePopup();
          popup = new M.Popup();
          popup.addTab(loadingInfoTab);
          this_.facadeMap_.addPopup(popup, coordinate);
        }
        else {
          popup.addTab(loadingInfoTab);
        }
      }
    });
    layerNamesUrls.forEach(function (layerNameUrl) {
      var url = layerNameUrl['url'];
      var layerName = layerNameUrl['layer'];
      M.remote.get(url).then(function (response) {
        popup = this_.facadeMap_.getPopup();
        if ((response.code === 200) && (response.error === false)) {
          var info = response.text;
          if (this_.insert_(info, formato) === true) {
            var formatedInfo = this_.formatInfo_(info, formato, layerName);
            infos.push(formatedInfo);
          }
          else if (this_.unsupportedFormat_(info, formato)) {
            infos.push('La capa <b>' + layerName + '</b> no soporta el formato <i>' + formato + '</i>');
          }
        }
        if (layerNamesUrls.length === ++contFull && !M.utils.isNullOrEmpty(popup)) {
          popup.removeTab(loadingInfoTab);
          if (infos.join('') === "") {
            popup.addTab({
              'icon': 'g-cartografia-info',
              'title': M.control.GetFeatureInfo.POPUP_TITLE,
              'content': 'No hay información asociada.'
            });
          }
          else {
            popup.addTab({
              'icon': 'g-cartografia-info',
              'title': M.control.GetFeatureInfo.POPUP_TITLE,
              'content': infos.join('')
            });
          }
        }
      });
    });
  };

  /**
   * Loading message
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.impl.control.GetFeatureInfo.LOADING_MESSAGE = 'Obteniendo información...';
})();
