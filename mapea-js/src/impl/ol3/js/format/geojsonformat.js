goog.provide('M.impl.format.GeoJSON');

goog.require('ol.format.GeoJSON');

/**
 * @classdesc
 * Feature format for reading and writing data in the GeoJSON format.
 *
 * @constructor
 * @extends {ol.format.JSONFeature}
 * @param {olx.format.GeoJSONOptions=} opt_options Options.
 * @api stable
 */
M.impl.format.GeoJSON = function (opt_options) {
   var options = opt_options ? opt_options : {};
   goog.base(this, options);
};
goog.inherits(M.impl.format.GeoJSON, ol.format.GeoJSON);

/**
 * @inheritDoc
 */
ol.format.GeoJSON.prototype.readFeatureFromObject = function (
   object, opt_options) {
   var geoJSONFeature = /** @type {GeoJSONFeature} */ (object);
   goog.asserts.assert(geoJSONFeature.type == 'Feature',
      'geoJSONFeature.type should be Feature');
   var geometry = ol.format.GeoJSON.readGeometry_(geoJSONFeature.geometry,
      opt_options);
   var feature = new ol.Feature();
   if (this.geometryName_) {
      feature.setGeometryName(this.geometryName_);
   }
   feature.setGeometry(geometry);
   if (geoJSONFeature.id) {
      feature.setId(geoJSONFeature.id);
   }
   if (geoJSONFeature.properties) {
      feature.setProperties(geoJSONFeature.properties);
   }
   if (geoJSONFeature.click) {
      feature.click = geoJSONFeature.click;
   }
   return feature;
};

/**
 * @inheritDoc
 */
M.impl.format.GeoJSON.prototype.writeFeatureObject = function (
   feature, opt_options) {
   opt_options = this.adaptOptions(opt_options);
   var object = {
      'type': 'Feature'
   };

   var id = feature.getId();
   if (id) {
      object['id'] = id;
   }
   var geometry = feature.getGeometry();
   if (geometry) {
      object['geometry'] =
         ol.format.GeoJSON.writeGeometry_(geometry, opt_options);
   }
   else {
      object['geometry'] = null;
   }
   var properties = feature.getProperties();
   delete properties[feature.getGeometryName()];
   if (!goog.object.isEmpty(properties)) {
      object['properties'] = properties;
   }
   else {
      object['properties'] = null;
   }

   if (!M.utils.isNullOrEmpty(feature.click)) {
      object['click'] = feature.click;
   }
   return object;
};