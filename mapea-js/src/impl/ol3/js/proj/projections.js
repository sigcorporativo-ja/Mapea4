goog.provide('M.impl.projections');

goog.require('ol.proj.Projection');
goog.require('ol.proj.Units');


(function () {
   // EPSG:25830
   proj4.defs("EPSG:25830", "+proj=utm +zone=30 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
   ol.proj.addProjection(new ol.proj.Projection({
      'code': 'EPSG:25830',
      'extent': [-729785.83, 3715125.82, 940929.67, 9518470.69]
   }));

   // EPSG:23030
   proj4.defs("EPSG:23030", "+proj=utm +zone=30 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs");
   ol.proj.addProjection(new ol.proj.Projection({
      'code': 'EPSG:23030',
      'extent': [-99844.71, 3879626.63, 1682737.72, 8251830.80]
   }));

   // EPSG:4258
   proj4.defs("EPSG:4258", "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs");
   ol.proj.addProjection(new ol.proj.Projection({
      'code': 'EPSG:4258',
      'extent': [-16.1, 32.88, 39.65, 84.17]
   }));

   // EPSG:25829
   proj4.defs("EPSG:25829", "+proj=utm +zone=29 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
   ol.proj.addProjection(new ol.proj.Projection({
      'code': 'EPSG:25829',
      'extent': [-164850.78, 3660417.01, 988728.57, 9567111.85]
   }));

   // EPSG:23029
   proj4.defs("EPSG:23029", "+proj=utm +zone=29 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs");
   ol.proj.addProjection(new ol.proj.Projection({
      'code': 'EPSG:23029',
      'extent': [448933.91, 3860083.93, 1860436.11, 8381369.16]
   }));

   // EPSG:4230
   proj4.defs("EPSG:4230", "+proj=longlat +ellps=intl +no_defs");
   ol.proj.addProjection(new ol.proj.Projection({
      'code': 'EPSG:4230',
      'extent': [-16.09882145355955, 25.711114310330917, 48.60999527749605, 84.16977336415472]
   }));

   // EPSG:32628
   proj4.defs("EPSG:32628", "+proj=utm +zone=28 +ellps=WGS84 +datum=WGS84 +units=m +no_defs");
   ol.proj.addProjection(new ol.proj.Projection({
      'code': 'EPSG:32628',
      'extent': [166021.44317933178, 0, 833978.5568206678, 9329005.18301614]
   }));
})();