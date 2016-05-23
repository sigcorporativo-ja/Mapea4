goog.provide('M.remote');

goog.require('M.utils');
goog.require('M.exception');

goog.require('goog.dom.xml');

/**
 * @namespace M.remote
 */
(function (window) {
   'use strict';

   /**
    * This function gets a resource throw a
    * HTTP GET method and checks if the request
    * is ajax or jsonp based
    *
    * @function
    * @param {string} url
    * @param {Object} options
    * @returns {Promise}
    * @api stable
    */
   M.remote.get = function (url, options) {
      var req;

      if (!options || options.jsonp) {
         req = M.remote.jsonp(url, options);
      }

      return req;
   };
   
   /**
    * This function gets a resource throw a
    * HTTP POST method using ajax
    *
    * @function
    * @param {string} url
    * @param {Object} data
    * @returns {Promise}
    * @api stable
    */
   M.remote.post = function (url, data, options) {
      var proxyUrl = M.config.MAPEA_URL.concat(M.config.PROXY_POST_PATH);
      proxyUrl = M.utils.addParameters(proxyUrl, {
         'url': url
      });
      
      var req = new Promise(function(success, fail) {
      var peticion_http;
         if(window.XMLHttpRequest) {
            peticion_http = new XMLHttpRequest();
          }
          else if(window.ActiveXObject) {
            peticion_http = new ActiveXObject("Microsoft.XMLHTTP");
          }
         peticion_http.onreadystatechange = function(){
            if(peticion_http.readyState == 4) {
               if(peticion_http.status == 200) {
                  success(peticion_http.responseText);
                  //console.log(peticion_http.responseText);
               }
            }
         };
         peticion_http.open('POST', proxyUrl, true);
         peticion_http.send(data);
         
         
         
        // var wfstRequestXml = '<Transaction xmlns="http://www.opengis.net/wfs" service="WFS" version="1.1.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd"><Update typeName="callejero:prueba_pol_wfst" xmlns:callejero="callejero"><Property><Name>the_geom</Name><Value><MultiPolygon xmlns="http://www.opengis.net/gml"><polygonMember><Polygon><exterior><LinearRing><posList>135983.50504265295 4128799.1718575535 99721.23703127884 4107268.4502258003 137116.7009180084 4105002.0584750893 135983.50504265295 4128799.1718575535</posList></LinearRing></exterior></Polygon></polygonMember></MultiPolygon></Value></Property><Property><Name>cod_ine_municipio</Name><Value>-</Value></Property><Property><Name>cod_ine_provincia</Name><Value>-</Value></Property><Property><Name>area</Name><Value>0</Value></Property><Property><Name>perimetro</Name><Value>0</Value></Property><Property><Name>cod_gesta</Name><Value>0</Value></Property><Property><Name>cod_ine_comunidad</Name><Value>-</Value></Property><Property><Name>nombre</Name><Value>-</Value></Property><Property><Name>nom_provincia</Name><Value>-</Value></Property><Property><Name>alias</Name><Value>-</Value></Property><Property><Name>nom_ccaa</Name><Value>-</Value></Property><Property><Name>the_geom</Name><Value><MultiPolygon xmlns="http://www.opengis.net/gml"><polygonMember><Polygon><exterior><LinearRing><posList>135983.50504265295 4128799.1718575535 99721.23703127884 4107268.4502258003 137116.7009180084 4105002.0584750893 135983.50504265295 4128799.1718575535</posList></LinearRing></exterior></Polygon></polygonMember></MultiPolygon></Value></Property><Filter xmlns="http://www.opengis.net/ogc"><FeatureId fid="prueba_pol_wfst.1245"/></Filter></Update></Transaction>';
        // peticion_http.send(wfstRequestXml);
         
         //var wfstRequestXml = '<wfs:Transaction xmlns:wfs="http://www.opengis.net/wfs" version="1.0.0" service="WFS"><wfs:Insert><feature:prueba_pol_wfst xmlns:feature="www.callejero.es"><feature:the_geom><gml:MultiPolygon xmlns:gml="http://www.opengis.net/gml" srsName="EPSG:23030"><gml:polygonMember><gml:Polygon><gml:outerBoundaryIs><gml:LinearRing><gml:coordinates decimal="." cs="," ts=" ">137440.18656948,4059728.0853791 130728.68057448,3988586.1218322 222005.16210643,3992613.0254292 189789.93333045,4067781.8925731 162943.90935047,4093285.6153541 137440.18656948,4059728.0853791</gml:coordinates></gml:LinearRing></gml:outerBoundaryIs></gml:Polygon></gml:polygonMember></gml:MultiPolygon></feature:the_geom><feature:cod_ine_municipio>-</feature:cod_ine_municipio><feature:cod_ine_provincia>-</feature:cod_ine_provincia><feature:area>0</feature:area><feature:perimetro>0</feature:perimetro><feature:cod_gesta>0</feature:cod_gesta><feature:cod_ine_comunidad>-</feature:cod_ine_comunidad><feature:nombre>-</feature:nombre><feature:nom_provincia>-</feature:nom_provincia><feature:alias>-</feature:alias><feature:nom_ccaa>-</feature:nom_ccaa></feature:prueba_pol_wfst></wfs:Insert></wfs:Transaction>';
//         peticion_http.send(wfstRequestXml);
      });
      return req;
      
     /* var req = new Promise(function(success, fail) {
         ajax......success: function(resturls ) {}
         success(results);
      });
      return req;*/
   };

   M.remote.jsonp = function (url, options) {
      var xhr;

      if (!M.utils.isNullOrEmpty(options) && !M.utils.isUndefined(options.params)) {
         url = M.utils.addParameters(url, options.params);
      }

      if (M.proxy) {
         xhr = M.remote.manageProxy(url, options);
      }
      else {
         // TODO
      }

      return xhr;
   };

   M.remote.manageProxy = function (requestedUrl, options) {
      var promise;

      var proxyUrl = M.config.MAPEA_URL.concat(M.config.PROXY_PATH);

      // creates a random name to avoid clonflicts
      var jsonpHandlerName = M.utils.generateRandom('mapea_jsonp_handler_');
      proxyUrl = M.utils.addParameters(proxyUrl, {
         'url': requestedUrl,
         'callback': jsonpHandlerName
      });

      promise = new Promise(function (success, fail) {
         var userCallback = success;
         var userFail = fail;
         // get the promise of the script tag
         var scriptTagPromise = new Promise(function (scriptTagSuccess) {
            window[jsonpHandlerName] = scriptTagSuccess;
         });
         /* when the script tag was executed remove
          * the handler and execute the callback
          */
         scriptTagPromise.then(function (response) {
            // remove the jsonp handler from global window
            delete window[jsonpHandlerName];

            // remove the script tag from the html
            M.remote.removeScriptTag(jsonpHandlerName);

            // checks response
            if (response.code === 200) {
               if (response.error || !response.valid) {
                  userFail(response.code + ': ' + response.message);
               }
               else {
                  var responseTxt = response.content.trim();
                  var responseXml;
                  try {
                     responseXml = goog.dom.xml.loadXml(responseTxt);
                  }
                  catch (err) {}
                  userCallback({
                     'responseTxt': responseTxt,
                     'responseXml': responseXml
                  });
               }
            }
            else {
               userFail(response.code + ': ' + response.message);
            }
         });
      });

      // creates the script tag
      M.remote.createScriptTag(proxyUrl, jsonpHandlerName);

      return promise;
   };

   M.remote.createScriptTag = function (proxyUrl, jsonpHandlerName) {
      var scriptTag = document.createElement("script");
      scriptTag.type = "text/javascript";
      scriptTag.id = jsonpHandlerName;
      scriptTag.src = proxyUrl;
      window.document.body.appendChild(scriptTag);
   };

   M.remote.removeScriptTag = function (jsonpHandlerName) {
      var scriptTag = document.getElementById(jsonpHandlerName);
      window.document.body.removeChild(scriptTag);
   };
})(window || {});