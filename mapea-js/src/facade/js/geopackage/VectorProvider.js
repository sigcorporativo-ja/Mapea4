import AbstractProvider from './AbstractProvider';

/**
 * @classdesc
 */
class GeoPackageVector extends AbstractProvider {
  getGeoJSON() {
    const featureDao = this.connector_.getFeatureDao(this.getTableName());
    const { srs } = featureDao;
    const rows = featureDao.queryForAll();
    const features = rows.map(row => featureDao.getRow(row));
    const geojsonFeatures = features.map((feature) => {
      const properties = { ...feature.values };
      delete properties.geom;
      const geometry = feature.geometry.toGeoJSON();
      const featureGeoJSON = {
        type: 'Feature',
        geometry,
        properties,
      };
      return featureGeoJSON;
    });
    const geojson = {
      type: 'FeatureCollection',
      features: geojsonFeatures,
      crs: {
        type: 'name',
        properties: {
          name: `${srs.organization}:${srs.srs_id}`,
        },
      },
    };
    return geojson;
  }
}

export default GeoPackageVector;
