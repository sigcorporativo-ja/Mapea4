goog.provide('M.impl.control.GetFeatureInfo');

goog.require('M.impl.Control');
goog.require('ol.format.GML');

/**
 * @namespace M.impl.control
 */
(function () {
   /**
    * @classdesc Main constructor of the class. Creates a GetFeatureInfo 
    * control
    * @param {String} format format specify the format map
    * @constructor
    * @extends {ol.control.Control}
    * @api stable
    */
   M.impl.control.GetFeatureInfo = function (format) {
      this.userFormat = format;
   };
   goog.inherits(M.impl.control.GetFeatureInfo, M.impl.Control);

   /**
    * This function adds the control to the specified map
    * 
    * @public
    * @function
    * @param {M.Map}
    *        map map to add the plugin
    * @param {Object}
    *        element template of this control
    * @api stable
    */
   M.impl.control.GetFeatureInfo.prototype.addTo = function (map, element) {
      this.map = map;

      var activeGetfeatureinfo = false;
      var ctrlButton = element.querySelector('button#m-getfeatureinfo-button');
      goog.events.listen(ctrlButton, [
               goog.events.EventType.CLICK,
               goog.events.EventType.TOUCHEND
            ], function (evt) {
         evt.preventDefault();
         if (activeGetfeatureinfo === false) {
            this.activate();
            goog.dom.classlist.add(ctrlButton, 'activated');
            activeGetfeatureinfo = true;
         }
         else {
            this.desactivate();
            goog.dom.classlist.remove(ctrlButton, 'activated');
            activeGetfeatureinfo = false;
         }
      }, false, this);
      goog.base(this, 'addTo', map, element);
   };

   /**
    * This function call 'addOnClickEvent_' to active 'OnClick' Event
    * 
    * @public
    * @function
    * @api stable
    */
   M.impl.control.GetFeatureInfo.prototype.activate = function () {
      this.addOnClickEvent_();
   };

   /**
    * This function call 'deleteOnClickEvent_' to disable 'OnClick' Event
    * 
    * @public
    * @function
    * @api stable
    */
   M.impl.control.GetFeatureInfo.prototype.desactivate = function () {
      this.deleteOnClickEvent_();
   };

   /**
    * function adds the event singleclick to the specified map
    * 
    * @private
    * @function
    */
   M.impl.control.GetFeatureInfo.prototype.addOnClickEvent_ = function () {
      var olMap = this.map.getMapImpl();
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
    * function build Array URLs and call 'showInfoFromURL_'
    * to show
    * 
    * @private
    * @function
    */
   M.impl.control.GetFeatureInfo.prototype.buildUrl_ = function (evt) {
      var olMap = this.map.getMapImpl();
      var urls = [];
      var view = olMap.getView();
      var viewResolution = view.getResolution();
      var wmsLayers = this.map.getWMS();
      var proj = this.map.getProjection();
      var srs = proj.code;
      for (var i = 0, len = wmsLayers.length; i < len; i++) {
         var wms = wmsLayers[i];
         var src = wms.getImpl().getOL3Layer().getSource();
         var url = src.getGetFeatureInfoUrl(evt.coordinate, viewResolution,
            srs, {
               'INFO_FORMAT': this.userFormat
            });
         urls[i] = url;
      }
      this.showInfoFromURL_(urls, evt.coordinate, olMap);
   };

   /**
    * function delete the event singleclick to the specified map
    * 
    * @private
    * @function
    */
   M.impl.control.GetFeatureInfo.prototype.deleteOnClickEvent_ = function () {
      var olMap = this.map.getMapImpl();
      olMap.un('singleclick', this.buildUrl_, this);
   };

   /**
    * function specifies whether the information is valid
    * 
    * @param {String} info information to validate
    * @param {String} formato specific format to validate
    * @returns {boolean} is valid or not
    * @private
    * @function
    */
   M.impl.control.GetFeatureInfo.prototype.insert_ = function (info, formato) {
      var res = false;
      switch (formato) {
      case "text/html": // ex
         if (!/WMS\s+server\s+error/i.test(info)) {
            res = true;
         }
         break;
      case "application/vnd.ogc.gml": // ol.format.GML (http://openlayers.org/en/v3.9.0/apidoc/ol.format.GML.html)
         var formater = new ol.format.GML();
         var features = formater.readFeatures(info);
         res = (features.length > 0);
         res = true;
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
    * function formatting information
    * 
    * @param {String} info information to formatting
    * @param {String} formato specific format
    * @returns {String} information formatted in the format indicated
    * @private
    * @function
    */
   M.impl.control.GetFeatureInfo.prototype.formatInfo_ = function (info, formato) {
      var formatedInfo = null;
      regExs = {
         gsResponse: /^results[\w\s\S]*\'http\:/i,
         msNewFeature: /feature(\s*)(\w+)(\s*)\:/i,
         gsNewFeature: /\#newfeature\#/,
         gsGeometry: /geom$/i,
         msGeometry: /boundedby$/i
      };
      switch (formato) {
      case "text/html": // ex
         formatedInfo = info;
         break;
      case "application/vnd.ogc.gml": // ol.format.GML (http://openlayers.org/en/v3.9.0/apidoc/ol.format.GML.html)
         var formater = new ol.format.GML();
         var feature = formater.readFeatures(info)[0];
         var id = feature.getId();
         var attr = feature.getKeys();
         formatedInfo = '';
         for (var i = 0, ilen = attr.length; i < ilen; i++) {
            var attrName = attr[i];
            var attrValue = feature.get(attrName);
            formatedInfo += '<span>' + attrName + ':</span>&nbsp<span>' + attrValue + '</span>\r\n';
         }
         break;
      case "text/plain": // exp reg
         if (regExs.gsResponse.test(info)) {
            formatedInfo = this.txtToHtml_Geoserver_(info);
         }
         else {
            formatedInfo = this.txtToHtml_Mapserver_(info);
         }
         var res = info.split(/\n/);
         formatedInfo = '';
         for (var j = 2, jlen = res.length; j < jlen - 1; j++) {
            formatedInfo = formatedInfo + res[j] + '\n';
         }
         res = formatedInfo.split(/\n/);
         formatedInfo = '';
         for (var k = 0, klen = res.length - 1; k < klen; k++) {
            var str = res[k];
            str = str.split(" = ");
            formatedInfo = formatedInfo + '<span>' + str[0] + '</span>&nbsp' + '<span>' + str[1] + '</span>\r\n';
         }
         break;
      }
      return formatedInfo;
   };

   /**
    * function return formatted information url. Specific format "text/plain"
    * 
    * @private
    * @function
    * @param {String} info information to formatting
    * @returns {String} information formated
    */
   M.impl.control.GetFeatureInfo.prototype.txtToHtml_Geoserver_ = function (info) {
      // get layer name from the header
      var layerName = info.replace(/[\w\s\S]*\:(\w*)\'\:[\s\S\w]*/i, "$1");

      // remove header
      info = info.replace(/[\w\s\S]*\'\:/i, "");

      info = info.replace(/---(\-*)(\n+)---(\-*)/g, "#newfeature#");

      var attrValuesString = info.split("\n");

      var html = "<div class=\"divinfo\"><div class=\"popup-info-separator\">Información de la capa</div>";

      // build the table
      html += "<table class=\"mapea-table\"><tbody><tr><td class=\"header\" colspan=\"3\">" + M.utils.beautifyString(layerName) + "</td></tr>";

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
               html += "<tr><td><b>";
               html += M.utils.beautifyString(attr);
               html += "</b></td><td>";
               html += value;
               html += "</td></tr>";
            }
         }
         else if (regExs.gsNewFeature.test(attrValueString)) {
            // set new header
            html += "<tr><td class=\"header\" colspan=\"3\">" + M.utils.beautifyString(layerName) + "</td></tr>";
         }
      }

      html += "</tbody></table></div>";

      return html;
   };

   /**
    * function return formatted information url. Specific format "text/plain"
    * 
    * @private
    * @function
    * @param {String} info information to formatting
    * @returns {String} information formated
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
      var htmlHeader = "<div class=\"popup-info-separator\">Información de la capa</div><table class=\"mapea-table\"><tbody><tr><td class=\"header\" colspan=\"3\">" + this.beautifyString(layerName) + "</td></tr>";

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
                  html += "<tr><td class=\"header\" colspan=\"3\">" + M.utils.beautifyString(layerName) + "</td><td></td></tr>";
               }
            }
            else {
               html += "<tr><td><b>";
               html += M.utils.beautifyString(attr);
               html += "</b></td><td>";
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
    * function displays information in a popup
    * 
    * @private
    * @function
    * @param {Array}
    * urls Array url
    * @param {String}
    * coordinate coordinate position onClick
    * @param {olMap}
    * olMap map
    */
   M.impl.control.GetFeatureInfo.prototype.showInfoFromURL_ = function (urls,
      coordinate, olMap) {
      var infos = [];
      var formato = String(this.userFormat);
      var showConsole = function (response) {
         console.log(response);
      };
      var contFull = 0;
      var ob = this;
      var popup = null;
      M.template.compile(M.control.GetFeatureInfo.POPUP_TEMPLATE, {
         'info': "Cargando..."
      }).then(function (html) {
         popup = new M.impl.Popup(html);
         ob.map.getImpl().addPopup(popup);
         popup.show(coordinate);
      });
      urls.forEach(function (url) {
         M.remote.get(url).then(function (response) {
            var info = response.responseTxt;
            if (ob.insert_(info, formato) === true) {
               var formatedInfo = ob.formatInfo_(info, formato);
               infos.push(formatedInfo);
            }
            if (urls.length === ++contFull) {
               if (infos.join('') === "") {
                  popup.setContent('No hay información asociada.');
               }
               else {
                  popup.setContent(infos.join(''));
               }
            }
         });
      });
   };

   /**
    * This function destroys this control, cleaning the HTML and
    * unregistering all events
    * 
    * @public
    * @function
    * @api stable
    */
   M.impl.control.GetFeatureInfo.prototype.destroy = function () {
      goog.base(this, 'destroy');
      this.userFormat = null;
   };

})();