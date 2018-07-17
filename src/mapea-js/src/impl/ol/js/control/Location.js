import Utils from 'facade/js/util/Utils';
import Control from './Control';
import Feature from '../feature/Feature';

/**
 * @namespace M.impl.control
 */
export default class Location extends Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a Location
   * control
   *
   * @constructor
   * @extends {M.impl.Control}
   * @api stable
   */

  constructor(tracking, highAccuracy, maximumAge) {
    super();
    /**
     * Helper class for providing HTML5 Geolocation
     * @private
     * @type {ol.Geolocation}
     */
    this.geolocation_ = null;

    /**
     * Feature of the accuracy position
     * @private
     * @type {ol.Feature}
     */
    this.accuracyFeature_ = Feature.olFeature2Facade(new ol.Feature());

    this.tracking_ = tracking;
    this.highAccuracy_ = highAccuracy;
    this.maximumAge_ = maximumAge;
    this.activated_ = false;

    /**
     * Feature of the position
     * @private
     * @type {ol.Feature}
     */
    this.positionFeature_ = Feature.olFeature2Facade(new ol.Feature({
      style: Location.POSITION_STYLE,
    }));
  }

  /**
   * This function paints a point on the map with your location
   *
   * @public
   * @function
   * @api stable
   */
  activate() {
    this.element.classlist.add('m-locating');

    if (Utils.isNullOrEmpty(this.geolocation_)) {
      const proj = ol.proj.get(this.facadeMap_.getProjection().code);
      this.geolocation_ = new ol.Geolocation({
        projection: proj,
        tracking: this.tracking_,
        trackingOptions: {
          enableHighAccuracy: this.highAccuracy_,
          maximumAge: this.maximumAge_,
        },
      });
      this.geolocation_.on('change:accuracyGeometry', (evt) => {
        const accuracyGeom = evt.target.get(evt.key);
        this.accuracyFeature_.getImpl().getOLFeature().setGeometry(accuracyGeom);
      });
      this.geolocation_.on('change:position', (evt) => {
        const newCoord = evt.target.get(evt.key);
        const newPosition = Utils.isNullOrEmpty(newCoord) ?
          null : new ol.geom.Point(newCoord);
        this.positionFeature_.getImpl().getOLFeature().setGeometry(newPosition);
        this.facadeMap_.setCenter(newCoord);
        if (this.element.classlist.contains('m-locating')) {
          this.facadeMap_.setZoom(Location.ZOOM); // solo 1a vez
        }
        this.element.classlist.remove('m-locating');
        this.element.classlist.add('m-located');

        this.geolocation_.setTracking(this.tracking_);
      });
    }

    this.geolocation_.setTracking(true);
    this.facadeMap_.drawFeatures([this.accuracyFeature_, this.positionFeature_]);
  }

  /**
   * This function remove the drawn location
   *
   * @private
   * @function
   */
  removePositions_() {
    if (!Utils.isNullOrEmpty(this.accuracyFeature_)) {
      this.facadeMap_.removeFeatures([this.accuracyFeature_]);
    }
    if (!Utils.isNullOrEmpty(this.positionFeature_)) {
      this.facadeMap_.removeFeatures([this.positionFeature_]);
    }
    this.geolocation_.setTracking(false);
  }

  /**
   * This function remove the drawn location and restores the style button
   *
   * @public
   * @function
   * @api stable
   */
  deactivate() {
    this.removePositions_();
    this.element.classlist.remove('m-located');
  }

  /**
   * TODO
   */
  setTracking(tracking) {
    this.tracking_ = tracking;
    this.geolocation_.setTracking(tracking);
  }

  /**
   * This function destroys this control and cleaning the HTML
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.removePositions_();
    super.destroy();
  }
}

/**
 * Style for location
 * @const
 * @type {ol.style.Style}
 * @public
 * @api stable
 */
Location.POSITION_STYLE = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 6,
    fill: new ol.style.Fill({
      color: '#3399CC',
    }),
    stroke: new ol.style.Stroke({
      color: '#fff',
      width: 2,
    }),
  }),
});

/**
 * Zoom Location
 * @const
 * @type {number}
 * @public
 * @api stable
 */
Location.ZOOM = 12;
