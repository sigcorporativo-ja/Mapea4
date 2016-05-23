<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>MAPEA</title>
<link type="text/css" rel="stylesheet" href="assets/css/mapea.ol3.min.css"></link>
<style type="text/css">
html, body {
   margin: 0;
   padding: 0;
   height: 100%;
   overflow: hidden;
}
</style>
</head>
<body>
   <div id="map" class="m-container"></div>

   <script type="text/javascript" src="js/mapea.ol3.min.js"></script>
   <script type="text/javascript" src="js/configuration.js"></script>
   <%
      String params = "container=map";
      String queryString = request.getQueryString();
      if ((queryString != null) && (queryString.trim().length() > 0)) {
         params += "&";
         params += request.getQueryString();
      }
   %>
   <script type="text/javascript" src="api/js?<%out.print(params);%>"></script>
</body>
</html>
