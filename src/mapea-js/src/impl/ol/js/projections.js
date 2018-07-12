import proj4 from "proj4";

export const addProjections = () => {

  // EPSG:25830
  let proj25830 = {
    def: "+proj=utm +zone=30 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
    extent: [-729785.83, 3715125.82, 940929.67, 9518470.69],
    codes: ["EPSG:25830", "urn:ogc:def:crs:EPSG::25830", "http://www.opengis.net/gml/srs/epsg.xml#23030"]
  };

  // EPSG:23030
  let proj23030 = {
    def: "+proj=utm +zone=30 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs",
    extent: [-99844.71, 3879626.63, 1682737.72, 8251830.80],
    codes: ["EPSG:23030", "urn:ogc:def:crs:EPSG::23030", "http://www.opengis.net/gml/srs/epsg.xml#23030", ]
  };

  // EPSG:4258
  let proj4258 = {
    def: "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs",
    extent: [-16.1, 32.88, 39.65, 84.17],
    codes: ["EPSG:4258", "urn:ogc:def:crs:EPSG::4258", "http://www.opengis.net/gml/srs/epsg.xml#4258"]
  };

  // EPSG:25829
  let proj25829 = {
    def: "+proj=utm +zone=29 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
    extent: [-164850.78, 3660417.01, 988728.57, 9567111.85],
    codes: ["EPSG:25829", "urn:ogc:def:crs:EPSG::25829", "http://www.opengis.net/gml/srs/epsg.xml#25829"]
  };

  // EPSG:23029
  let proj23029 = {
    def: "+proj=utm +zone=29 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs",
    extent: [448933.91, 3860083.93, 1860436.11, 8381369.16],
    codes: ["EPSG:23029", "urn:ogc:def:crs:EPSG::23029", "http://www.opengis.net/gml/srs/epsg.xml#23029"]
  };

  // EPSG:4230
  let proj4230 = {
    def: "+proj=longlat +ellps=intl +no_defs",
    extent: [-16.09882145355955, 25.711114310330917, 48.60999527749605, 84.16977336415472],
    codes: ["EPSG:4230", "urn:ogc:def:crs:EPSG::4230", "http://www.opengis.net/gml/srs/epsg.xml#4230"]
  };

  // EPSG:32628
  let proj32628 = {
    def: "+proj=utm +zone=28 +ellps=WGS84 +datum=WGS84 +units=m +no_defs",
    extent: [166021.44317933178, 0, 833978.5568206678, 9329005.18301614],
    codes: ["EPSG:32628", "urn:ogc:def:crs:EPSG::32628", "http://www.opengis.net/gml/srs/epsg.xml#32628"]
  };

  // EPSG:4326
  let proj4326 = {
    def: "+proj=utm +zone=28 +ellps=WGS84 +datum=WGS84 +units=m +no_defs",
    extent: [-180, -90, 180, 90],
    codes: ["EPSG:4326", "urn:ogc:def:crs:EPSG::4326", "urn:ogc:def:crs:OGC:1.3:CRS84"]
  };

  // All projections above
  let projections = [proj25830, proj23030, proj4258, proj25829, proj23029, proj4230, proj32628, proj4326];

  // Register and publish projections
  projections.forEach(projection => {
    projection.codes.forEach(code => {
      proj4.defs(code, projection.def);
    });
    let olProjections = projection.codes.map(code => {
      return new ol.proj.Projection({
        code: code,
        extent: projection.extent
      });
    });
    ol.proj.addEquivalentProjections(olProjections);
  });

  //register proj4
  ol.proj.proj4.register(proj4);
};
addProjections();
