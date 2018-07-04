import Base from "../facade";
import Utils from '../utils/utils';
import GeoJSON from "../format/geojson";
import Dialog from "../dialog";
import FeatureImpl from '../../../impl/js/format/feature';
import StyleFeature from "../style/stylefeature";
import StylePoint from "../style/stylepoint";
import Evt from "../event/eventsmanager";

export default class Feature extends Base {

  constructor(id, geojson, style) {
    let impl = new FeatureImpl(id, geojson, style);

    super(impl);

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
  setId(id) {
    this.getImpl().setId(id);
  }

  /**
   * This function return id feature
   *
   * @public
   * @function
   * @return {string} ID to feature
   * @api stable
   */
  getId() {
    return this.getImpl().getId();
  }

  /**
   * This function return geometry feature
   *
   * @public
   * @function
   * @return {object} Geometry feature
   * @api stable
   */
  getGeometry() {
    return this.getGeoJSON().geometry;
  }

  /**
   * This function set geometry feature
   *
   * @public
   * @function
   * @param {object} Geometry feature
   * @api stable
   */
  setGeometry(geometry) {
    this.getImpl().setGeometry(geometry);
  }

  /**
   * This function return geojson feature
   *
   * @public
   * @function
   * @return {Object} geojson feature
   * @api stable
   */
  getGeoJSON() {
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
  getAttributes() {
    return this.getImpl().getAttributes();
  }

  /**
   * This function set attributes feature
   *
   * @public
   * @function
   * @param {Object} attributes - attributes to feature
   * @api stable
   */
  setAttributes(attributes) {
    if (typeof attributes === "object") {
      this.getImpl().setAttributes(attributes);
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
  getAttribute(attribute) {
    let attrValue;

    attrValue = this.getImpl().getAttribute(attribute);
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
  setAttribute(attribute, value) {
    return this.getImpl().setAttribute(attribute, value);
  }

  /**
   * This function set style feature
   *
   * @public
   * @function
   * @param {M.style.Feature}
   * @api stable
   */
  setStyle(style) {
    if (!Utils.isNullOrEmpty(style) && style instanceof StyleFeature) {
      this.style_ = style;
      this.style_.applyToFeature(this);
    } else if (Utils.isNullOrEmpty(style)) {
      this.style_ = null;
      this.getImpl().clearStyle();
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
  getStyle() {
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
  getCentroid() {
    let id = this.getId();
    let attributes = this.getAttributes();
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
      let centroid = this.getImpl().getCentroid();
    });
    if (!M.utils.isNullOrEmpty(centroid)) {
      centroid.id(id + "_centroid");
      centroid.attributes(attributes);
      centroid.style = style;
      return centroid;
    }
  }
}
