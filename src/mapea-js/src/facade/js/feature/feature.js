import Base from("../facade.js");
import Utils from('../utils/utils.js');
import GeoJSON from("../format/geojson.js");
import Dialog from("../dialog.js");
import FeatureImpl from('../../../impl/js/format/feature.js');
import StyleFeature from("../style/stylefeature.js");
import StylePoint from("../style/stylepoint.js");

export class Feature extends Base {

  constructor(id, geojson, style) {

    /**
     * Style of feature
     * @private
     * @type {M.style.Feature}
     */

    this.style_ = null;

    /*** GeoJSON format

     * @private
     * @type {M.format.GeoJSON}
     */
    this.formatGeoJSON_ = new GeoJSON();

    /**
     * Implementation of feature
     * @public
     * @type {M.impl.Feature}
     */
    let impl = new FeatureImpl(id, geojson, style);
    super(this, impl);

    this.style = style;
  }

  /**
   * This function set id
   *
   * @public
   * @function
   * @param {string} id - ID to feature
   * @api stable
   */
  set id(id) {
    this.impl().setId(id);
  }

  /**
   * This function return id feature
   *
   * @public
   * @function
   * @return {string} ID to feature
   * @api stable
   */
  get id() {
    return this.impl().id();
  }

  /**
   * This function return geometry feature
   *
   * @public
   * @function
   * @return {object} Geometry feature
   * @api stable
   */
  get geometry() {
    return this.geoJSON().geometry;
  }

  /**
   * This function set geometry feature
   *
   * @public
   * @function
   * @param {object} Geometry feature
   * @api stable
   */
  set geometry(geometry) {
    this.impl().geometry = geometry;
  }

  /**
   * This function return geojson feature
   *
   * @public
   * @function
   * @return {Object} geojson feature
   * @api stable
   */
  get geoJSON() {
    return this.formatGeoJSON_.write(this)[0];
  }

  /**
   * This function return attributes feature
   *
   * @public
   * @function
   * @return {Object} attributes feature
   * @api stable
   */
  get attributes() {
    return this.impl().attributes();
  }

  /**
   * This function set attributes feature
   *
   * @public
   * @function
   * @param {Object} attributes - attributes to feature
   * @api stable
   */
  set attributes(attributes) {
    if (typeof attributes === "object") {
      this.impl().setAttributes(attributes);
    } else {
      Dialog.info("No se han especificado correctamente los atributos.");
    }
  }

  /**
   * This function returns the value of the indicated attribute
   *
   * @public
   * @function
   * @param {string} attribute - Name attribute
   * @return  {string|number|object} returns the value of the indicated attribute
   * @api stable
   */
  get attribute(attribute) {
    let attrValue;

    attrValue = this.impl().attribute(attribute);
    if (Utils.isNullOrEmpty(attrValue)) {
      // we look up the attribute by its path. Example: getAttribute('foo.bar.attr')
      // --> return feature.properties.foo.bar.attr value
      let attrPath = attribute.split('.');
      if (attrPath.length > 1) {
        attrValue = attrPath.reduce((obj, attr) => !M.utils.isNullOrEmpty(obj) ? ((obj instanceof Feature) ? obj.getAttribute(attr) : obj[attr]) : undefined, this);
      }
    }

    return attrValue;
  }

  /**
   * This function set value the value of the indicated attribute
   *
   * @public
   * @function
   * @param {string} attribute - Name attribute
   * @return  {string|number|object} returns the value of the indicated attribute
   * @api stable
   */
  set attribute(attribute, value) {
    return this.impl().attribute(attribute, value);
  }

  /**
   * This function set style feature
   *
   * @public
   * @function
   * @param {M.style.Feature}
   * @api stable
   */
  set style(style) {
    if (!Utils.isNullOrEmpty(style) && style instanceof StyleFeature) {
      this.style_ = style;
      this.style_.applyToFeature(this);
    } else if (Utils.isNullOrEmpty(style)) {
      this.style_ = null;
      this.impl().clearStyle();
    }
    this.fire(Evt.CHANGE_STYLE, [style, this]);
    // else if (applyDefault === true) {
    //   let geom = this.getGeometry();
    //   if (!M.utils.isNullOrEmpty(geom)) {
    //     let type = geom.type;
    //     if (type === M.geom.geojson.type.POINT || type === M.geom.geojson.type.MULTI_POINT) {
    //       style = new M.style.Point();
    //     }
    //     if (type === M.geom.geojson.type.LINE_STRING || type === M.geom.geojson.type.MULTI_LINE_STRING) {
    //       style = new M.style.Line();
    //     }
    //     if (type === M.geom.geojson.type.POLYGON || type === M.geom.geojson.type.MULTI_POLYGON) {
    //       style = new M.style.Polygon();
    //     }
    //     this.style_ = style;
    //     this.style_.applyToFeature(this);
    //   }
    // }
  };

  /**
   * This function return if two features are equals
   * @public
   * @function
   * @param {M.Feature} feature
   * @return {bool} returns the result of comparing two features
   */
  equals(feature) {
    return this.id() === feature.id();
  }

  /**
   * This function returns style feature
   *
   * @public
   * @function
   * @return {M.style.Feature} returns the style feature
   * @api stable
   */
  get style() {
    return this.style_;
  }

  /**
   * This function clear style feature
   *
   * @public
   * @function
   * @return {M.style.Feature} returns the style feature
   * @api stable
   */
  clearStyle() {
    this.style = null;
  }

  /**
   * This function returns de centroid of feature
   *
   * @public
   * @function
   * @return {M.Feature}
   * @api stable
   */
  get centroid() {
    let id = this.id();
    let attributes = this.attributes();
    let style = new StylePoint({
      stroke: {
        color: '#67af13',
        width: 2
      },
      radius: 8,
      fill: {
        color: '#67af13',
        opacity: 0.2
      }
    let centroid = this.impl().centroid();
  });
    if (!M.utils.isNullOrEmpty(centroid)) {
      centroid.id(id + "_centroid");
      centroid.attributes(attributes);
      centroid.style = style;
      return centroid;
    }
  }
}
