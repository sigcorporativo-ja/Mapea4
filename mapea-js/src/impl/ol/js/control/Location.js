/**
 * @module M/impl/control/Location
 */

import { isNullOrEmpty } from 'M/util/Utils';
import { get as getProj } from 'ol/proj';
import OLFeature from 'ol/Feature';
import OLGeolocation from 'ol/Geolocation';
import OLGeomPoint from 'ol/geom/Point';
import OLStyle from 'ol/style/Style';
import OLStyleCircle from 'ol/style/Circle';
import OLStyleFill from 'ol/style/Fill';
import OLStyleStroke from 'ol/style/Stroke';
import Control from './Control';
import Feature from '../feature/Feature';

/**
 * @classdesc Main constructor of the class. Creates a Locatio control
 * @api
 */
class Location extends Control {
  /**
   * @constructor
   * @extends {M.impl.Control}
   * @api stable
   */

  constructor(tracking, highAccuracy, maximumAge) {
    super();
    /**
     * Helper class for providing HTML5 Geolocation
     * @private
     * @type {OLGeolocation}
     */
    this.geolocation_ = null;

    /**
     * Feature of the accuracy position
     * @private
     * @type {OLFeature}
     */
    this.accuracyFeature_ = Feature.olFeature2Facade(new OLFeature());

    this.tracking_ = tracking;
    this.highAccuracy_ = highAccuracy;
    this.maximumAge_ = maximumAge;
    this.activated_ = false;

    /**
     * Feature of the position
     * @private
     * @type {OLFeature}
     */
    this.positionFeature_ = Feature.olFeature2Facade(new OLFeature({
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
    this.element.classList.add('m-locating');

    if (isNullOrEmpty(this.geolocation_)) {
      const proj = getProj(this.facadeMap_.getProjection().code);
      this.geolocation_ = new OLGeolocation({
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
        const newPosition = isNullOrEmpty(newCoord) ?
          null : new OLGeomPoint(newCoord);
        this.positionFeature_.getImpl().getOLFeature().setGeometry(newPosition);
        this.facadeMap_.setCenter(newCoord);
        if (this.element.classList.contains('m-locating')) {
          this.facadeMap_.setZoom(Location.ZOOM); // solo 1a vez
        }
        this.element.classList.remove('m-locating');
        this.element.classList.add('m-located');

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
    if (!isNullOrEmpty(this.accuracyFeature_)) {
      this.facadeMap_.removeFeatures([this.accuracyFeature_]);
    }
    if (!isNullOrEmpty(this.positionFeature_)) {
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
    this.element.classList.remove('m-located');
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
 * @memberof module:M/impl/control/Location~
 */
Location.POSITION_STYLE = new OLStyle({
  image: new OLStyleCircle({
    radius: 6,
    fill: new OLStyleFill({
      color: '#3399CC',
    }),
    stroke: new OLStyleStroke({
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

export default Location;
