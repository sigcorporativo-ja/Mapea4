<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="es.juntadeandalucia.mapea.plugins.PluginsManager"%>
<%@ page import="es.juntadeandalucia.mapea.parameter.adapter.ParametersAdapterV3ToV4"%>
<%@ page import="java.util.Map"%>

<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
   <meta http-equiv="X-UA-Compatible" content="IE=edge" />
   <meta name="mapea" content="yes">
<title>MAPEA</title>
<link type="text/css" rel="stylesheet" href="assets/css/mapea.ol.min.css"></link>
<style type="text/css">
html, body {
   margin: 0;
   padding: 0;
   height: 100%;
   overflow: hidden;
}
</style>
   <%
      Map<String, String[]> parameterMap = request.getParameterMap();
      PluginsManager.init (getServletContext());
      Map<String, String[]> adaptedParams = ParametersAdapterV3ToV4.adapt(parameterMap);
      String[] cssfiles = PluginsManager.getCSSFiles(adaptedParams);
      for (int i = 0; i < cssfiles.length; i++) {
         String cssfile = cssfiles[i];
   %>
         <link type="text/css" rel="stylesheet" href="plugins/<%=cssfile%>"></link>
   <%
         if (cssfile.toLowerCase().indexOf("streetview") != -1) { %>
            <link href="plugins/streetview/streetview.min.css" rel="stylesheet" />
            <link href="http://code.jquery.com/ui/1.10.4/themes/ui-lightness/jquery-ui.css" rel="stylesheet">
      <% }
      } %>
</head>
<body>
   <div id="map" class="m-container"></div>
   <script type="text/javascript" src="vendor/browser-polyfill.js"></script>
   <script type="text/javascript" src="js/mapea.ol.min.js"></script>
   <script type="text/javascript" src="js/configuration.js"></script>
   <%
      String[] jsfiles = PluginsManager.getJSFiles(adaptedParams);
      for (int i = 0; i < jsfiles.length; i++) {
         String jsfile = jsfiles[i];
   %>
         <script type="text/javascript" src="plugins/<%=jsfile%>"></script>
   <%
         if (jsfile.toLowerCase().indexOf("streetview") != -1) { %>
            <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3.exp"></script>
      <% }
      }
   %>
   <!-- API JS -->
   <%
      String params = "container=map";
      String queryString = request.getQueryString();
      if ((queryString != null) && (queryString.trim().length() > 0)) {
         params += "&";
         params += request.getQueryString();
      }
   %>
   <script type="text/javascript">
      M.config.DEFAULT_PROJ = 'EPSG:23030*m';
   </script>
   <script type="text/javascript" src="api/js?<%out.print(params);%>"></script>
</body>
</html>