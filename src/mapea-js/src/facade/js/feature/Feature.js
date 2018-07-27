import FeatureImpl from 'impl/feature/Feature';
import Base from '../Base';
import Utils from '../util/Utils';
import GeoJSON from '../format/GeoJSON';
import * as dialog from '../dialog';
import StyleFeature from '../style/Feature';
import StylePoint from '../style/Point';
import EvtManager from '../event/Manager';

export default class Feature extends Base {
  /**
   * @classdesc
   * Main constructor of the class. Create a Feature
   *
   * @constructor
   * @extends {M.facade.Base}
   * @param {string} id - id to feature
   * @param {Object} geojson - geojson to feature
   * @api stable
   */
  constructor(id, geojson, style) {
    /**
     * Implementation of feature
     * @public
     * @type {M.impl.Feature}
     */
    const impl = new FeatureImpl(id, geojson, style);

    super(impl);

    /**
     * Style of feature
     * @private
     * @type {M.style.Feature}
     */
    this.style_ = null;

    /** * GeoJSON format
     * @private
     * @type {M.format.GeoJSON}
     */
    this.formatGeoJSON_ = new GeoJSON();

    this.setStyle(style);
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
    if (typeof attributes === 'object') {
      this.getImpl().setAttributes(attributes);
    }
    else {
      dialog.info('No se han especificado correctamente los atributos.');
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
      const attrPath = attribute.split('.');
      if (attrPath.length > 1) {
        attrValue = attrPath.reduce((obj, attr) => {
          let attrParam;
          if (!Utils.isNullOrEmpty(obj)) {
            if (obj instanceof Feature) {
              attrParam = obj.getAttribute(attr);
            }
            else {
              attrParam = obj[attr];
            }
          }
          return attrParam;
        });
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
    }
    else if (Utils.isNullOrEmpty(style)) {
      this.style_ = null;
      this.getImpl().clearStyle();
    }
    this.fire(EvtManager.CHANGE_STYLE, [style, this]);
  }

  /**
   * This function return if two features are equals
   * @public
   * @function
   * @param {M.Feature} feature
   * @return {bool} returns the result of comparing two features
   */
  equals(feature) {
    return this.getId() === feature.getId();
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
    this.setStyle(null);
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
    const id = this.getId();
    const attributes = this.getAttributes();
    const style = new StylePoint({
      stroke: {
        color: '#67af13',
        width: 2,
      },
      radius: 8,
      fill: {
        color: '#67af13',
        opacity: 0.2,
      },
    });
    const centroid = this.getImpl().getCentroid();
    if (!Utils.isNullOrEmpty(centroid)) {
      centroid.id(`${id} centroid}`);
      centroid.attributes(attributes);
      centroid.style = style;
    }
    return centroid;
  }
}
