/**
 * @module M/impl/format/GeoJSON
 */
import { isNullOrEmpty, generateRandom } from 'M/util/Utils';
import Feature from 'M/feature/Feature';
import OLFormatGeoJSON from 'ol/format/GeoJSON';
import { get as getProj } from 'ol/proj';
import OLStyle from 'ol/style/Style';
import OLStyleIcon from 'ol/style/Icon';
/**
 * @classdesc
 * @api
 */
class GeoJSON extends OLFormatGeoJSON {
  /**
   * @constructor
   * @extends {ol.format.JSONFeature}
   * @param {olx.format.GeoJSONOptions=} options Options.
   * @api stable
   */
  constructor(options = {}) {
    super(options);
  }

  /**
   * @inheritDoc
   */
  readFeatureFromObject(object, options) {
    const geoJSONFeature = object;
    const feature = super.readFeatureFromObject(geoJSONFeature, options);
    // geometry
    if (this.geometryName_) {
      feature.setGeometryName(this.geometryName_);
    }
    // id
    if (!isNullOrEmpty(geoJSONFeature.id)) {
      feature.setId(geoJSONFeature.id);
    } else {
      feature.setId(generateRandom('geojson_'));
    }
    // properties
    if (geoJSONFeature.properties) {
      feature.setProperties(geoJSONFeature.properties);
    }
    // click function
    if (geoJSONFeature.click) {
      feature.click = geoJSONFeature.click;
    }
    // vendor parameters
    if (geoJSONFeature.properties && geoJSONFeature.properties.vendor &&
      geoJSONFeature.properties.vendor.mapea) {
      // icons
      if (geoJSONFeature.properties.vendor.mapea.icon) {
        GeoJSON.applyIcon(feature, geoJSONFeature.properties.vendor.mapea.icon);
      }
    }
    return feature;
  }

  /**
   * @inheritDoc
   */
  writeFeatureObject(feature, optionsParameters) {
    const options = optionsParameters;
    const object = {
      type: 'Feature',
    };

    const id = feature.getId();
    if (id) {
      object.id = id;
    }
    const geometry = feature.getGeometry();
    if (geometry) {
      object.geometry = super.writeGeometryObject(geometry, options);
    } else {
      object.geometry = null;
    }
    const properties = feature.getProperties();
    delete properties[feature.getGeometryName()];
    if (!isNullOrEmpty(properties)) {
      object.properties = properties;
    } else {
      object.properties = null;
    }

    if (!isNullOrEmpty(feature.click)) {
      object.click = feature.click;
    }
    return object;
  }

  /**
   * @inheritDoc
   */
  static readProjectionFromObject(object) {
    let projection;
    const geoJSONObject = object;
    const crs = geoJSONObject.crs;
    if (crs) {
      if (crs.type === 'name') {
        projection = getProj(crs.properties.name);
      } else if (crs.type === 'EPSG') {
        // 'EPSG' is not part of the GeoJSON specification, but is generated by
        // GeoServer.
        // TODO: remove this when http://jira.codehaus.org/browse/GEOS-5996
        // is fixed and widely deployed.
        projection = getProj(`EPSG:${crs.properties.code}`);
      } else {
        projection = null;
        throw new Error(`Unknown crs.type: ${crs.type}`);
      }
    } else {
      projection = 'EPSG:4326';
    }
    return projection;
  }


  static applyIcon(feature, icon) {
    const imgIcon = document.createElement('IMG');
    imgIcon.src = icon.url;
    imgIcon.width = icon.width;
    imgIcon.height = icon.height;
    imgIcon.crossOrigin = 'anonymous';

    let imgAnchor;
    if (icon.anchor && icon.anchor.x && icon.anchor.y) {
      imgAnchor = [icon.anchor.x, icon.anchor.y];
    }
    feature.setStyle(new OLStyle({
      image: new OLStyleIcon({
        // 'src': icon.url
        img: imgIcon,
        imgSize: [icon.width, icon.height],
        anchor: imgAnchor,
      }),
    }));
  }

  /**
   * @inheritDoc
   */
  write(features) {
    return features.map(feature => this.writeFeatureObject(feature.getImpl().getOLFeature()));
  }

  /**
   * This function read Features
   *
   * @public
   * @function
   * @param {object} geojson GeoJSON to parsed as a
   * M.Feature array
   * @return {Array<M.Feature>}
   * @api estable
   */
  read(geojson, geojsonFeatures, projection) {
    let features = [];
    let dstProj = projection.code;
    if (isNullOrEmpty(dstProj)) {
      if (!isNullOrEmpty(projection.featureProjection)) {
        dstProj = getProj(projection.featureProjection.getCode());
      } else {
        dstProj = getProj(projection.getCode());
      }
    }
    const srcProj = GeoJSON.readProjectionFromObject(geojson);
    features = geojsonFeatures.map((geojsonFeature) => {
      const id = geojsonFeature.id;
      const feature = new Feature(id, geojsonFeature);
      const olFeature = feature.getImpl().getOLFeature();
      let newGeometry;
      if (olFeature.getGeometry()) {
        newGeometry = olFeature.getGeometry().transform(srcProj, dstProj);
      }
      olFeature.setGeometry(newGeometry);
      return feature;
    });
    return features;
  }
}

export default GeoJSON;
