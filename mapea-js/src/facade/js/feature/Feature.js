/**
 * @module M/Feature
 */
import FeatureImpl from 'impl/feature/Feature';
import Base from '../Base';
import { isNullOrEmpty } from '../util/Utils';
import GeoJSON from '../format/GeoJSON';
import * as dialog from '../dialog';
import StyleFeature from '../style/Feature';
import StylePoint from '../style/Point';
import * as EventType from '../event/eventtype';
import { getValue } from '../i18n/language';

/**
 * @classdesc
 * Main constructor of the class. Creates a Feature
 * @api
 */
class Feature extends Base {
  /**
   * @constructor
   * @extends {M.facade.Base}
   * @param {string} id id of feature
   * @param {Object} geojson GeoJSON representation of the feature
   * @param {M.style} [style=default vector style] style to apply
   * @api
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
   * Sets the id
   *
   * @public
   * @function
   * @param {string} id id to set
   * @api
   */
  setId(id) {
    this.getImpl().setId(id);
  }

  /**
   * Returns the id of the feature
   *
   * @public
   * @function
   * @return {string} Id of the feature
   * @api
   */
  getId() {
    return this.getImpl().getId();
  }

  /**
   * Returns the geometry of the feature
   *
   * @public
   * @function
   * @return {object} GeoJSON Geometry of the feature
   * @api
   */
  getGeometry() {
    return this.getGeoJSON().geometry;
  }

  /**
   * Sets the geometry of the feature
   *
   * @public
   * @function
   * @param {object} Geometry GeoJSON geometry to set
   * @api
   */
  setGeometry(geometry) {
    this.getImpl().setGeometry(geometry);
  }

  /**
   * Returns the feature as GeoJSON
   *
   * @public
   * @function
   * @return {Object} GeoJSON representation of the feature
   * @api
   */
  getGeoJSON() {
    return this.formatGeoJSON_.write(this)[0];
  }

  /**
   * Returns  attributes feature
   *
   * @public
   * @function
   * @return {Object} all attributes of the feature and their values
   * @api
   */
  getAttributes() {
    return this.getImpl().getAttributes();
  }

  /**
   * Sets the attributes and their value
   *
   * @public
   * @function
   * @param {Object} attributes - attributes to feature
   * @api
   */
  setAttributes(attributes) {
    if (typeof attributes === 'object') {
      this.getImpl().setAttributes(attributes);
    } else {
      dialog.info(getValue('feature').incorrect_attributes);
    }
  }

  /**
   * Returns the value of one attribute
   *
   * @public
   * @function
   * @param {string} attribute name of the attribute
   * @return  {string|number|object} value of the requested attribute
   * @api
   */
  getAttribute(attribute) {
    let attrValue;

    attrValue = this.getImpl().getAttribute(attribute);
    if (isNullOrEmpty(attrValue)) {
      // we look up the attribute by its path. Example: getAttribute('foo.bar.attr')
      // --> return feature.properties.foo.bar.attr value
      const attrPath = attribute.split('.');
      if (attrPath.length > 1) {
        attrValue = attrPath.reduce((obj, attr) => {
          let attrParam;
          if (!isNullOrEmpty(obj)) {
            if (obj instanceof Feature) {
              attrParam = obj.getAttribute(attr);
            } else {
              attrParam = obj[attr];
            }
          }
          return attrParam;
        }, this);
      }
    }
    return attrValue;
  }

  /**
   * Sets a value to an attribute
   *
   * @public
   * @function
   * @param {string} attribute - name of the attribute to set
   * @param {string|number|object} value the value to set
   * @api
   */
  setAttribute(attribute, value) {
    return this.getImpl().setAttribute(attribute, value);
  }

  /**
   * Sets the style to the feature. Style type must fit the appropriate
   * geometry type (point, line, polygon)
   *
   * @public
   * @function
   * @param {M.style.Feature} style style to apply
   * @api
   */
  setStyle(style) {
    if (!isNullOrEmpty(style) && style instanceof StyleFeature) {
      this.style_ = style;
      this.style_.applyToFeature(this);
    } else if (isNullOrEmpty(style)) {
      this.style_ = null;
      this.getImpl().clearStyle();
    }
    this.fire(EventType.CHANGE_STYLE, [style, this]);
  }

  /**
   * Checks if two features are equal, which happens when both of them
   * have the same feature id.
   * @public
   * @function
   * @param {M.Feature} feature feature to compare
   * @return {boolean} true if equal, false otherwise
   */
  equals(feature) {
    return this.getId() === feature.getId();
  }

  /**
   * Gets the style of feature, if any
   *
   * @public
   * @function
   * @return {M.style.Feature} style of the feature
   * @api
   */
  getStyle() {
    return this.style_;
  }

  /**
   * Clears the style of the feature. Layer style will apply now
   * to the feature.
   *
   * @public
   * @function
   * @api
   */
  clearStyle() {
    this.setStyle(null);
  }

  /**
   * Returns de centroid of the feature as a feature itself
   *
   * @public
   * @function
   * @return {M.Feature} feature representing the centroid
   * @api
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
    if (!isNullOrEmpty(centroid)) {
      centroid.id(`${id} centroid}`);
      centroid.attributes(attributes);
      centroid.style = style;
    }
    return centroid;
  }
}

export default Feature;
