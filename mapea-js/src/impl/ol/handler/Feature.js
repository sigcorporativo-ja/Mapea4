/**
 * @module M/impl/handler/Feature
 */
import ClusteredFeature from 'M/feature/Clustered';
import Cluster from 'M/style/Cluster';
import { isNullOrEmpty } from 'M/util/Utils';
import RenderFeature from 'ol/render/Feature';
import AnimatedCluster from '../layer/AnimatedCluster';
import RenderFeatureImpl from '../feature/RenderFeature';

/**
 * function adds the event 'click'
 *
 * @private
 * @function
 * @export
 */
const getFacadeFeature = (feature, layer) => {
  let mFeature;
  const featureId = feature.getId();
  if (!isNullOrEmpty(featureId)) {
    mFeature = layer.getFeatureById(featureId);
  }
  if (isNullOrEmpty(mFeature) && (feature instanceof RenderFeature)) {
    mFeature = RenderFeatureImpl.olFeature2Facade(feature);
  }
  return mFeature;
};

/**
 * @classdesc
 * Main constructor of the class. Creates a KML layer
 * with parameters specified by the user
 */
class Feature {
  /**
   * @constructor
   * @param {ol.Map} options custom options for this layer
   * @api stable
   */
  constructor(options = {}) {
    /**
     * OpenLayers map
     * @private
     * @type {M.impl.Map}
     */
    this.map_ = null;

    /**
     * @private
     * @type {String}
     * @expose
     */
    this.defaultCursor_ = undefined;
  }

  /**
   * This function destroys this layer, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  addTo(map) {
    this.map_ = map;
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  getFeaturesByLayer(evt, layer) {
    const features = [];

    if (!isNullOrEmpty(layer) && layer.isVisible()
      && !isNullOrEmpty(layer.getImpl().getOLLayer())) {
      const olLayer = layer.getImpl().getOLLayer();
      this.map_.getMapImpl().forEachFeatureAtPixel(evt.pixel, (feature, layerFrom) => {
        if ((layerFrom instanceof AnimatedCluster) && !isNullOrEmpty(feature.get('features'))) {
          const clusteredFeatures = feature.get('features').map((f) => getFacadeFeature(f, layer));
          if (clusteredFeatures.length === 1) {
            features.push(clusteredFeatures[0]);
          } else {
            let styleCluster = layer.getStyle();
            if (!(styleCluster instanceof Cluster)) {
              styleCluster = styleCluster.getStyles().find((style) => style instanceof Cluster);
            }
            features.push(new ClusteredFeature(clusteredFeatures, {
              ranges: styleCluster.getRanges(),
              hoverInteraction: styleCluster.getOptions().hoverInteraction,
              maxFeaturesToSelect: styleCluster.getOptions().maxFeaturesToSelect,
              distance: styleCluster.getOptions().distance,
            }));
          }
        } else if (!Object.prototype.hasOwnProperty.call(feature.getProperties(), 'selectclusterlink')) {
          features.push(getFacadeFeature(feature, layer));
        }
      }, {
        layerFilter: (l) => {
          let passFilter = false;
          if (layer.getStyle() instanceof Cluster
            && layer.getStyle().getOptions().selectInteraction) {
            passFilter = (l === layer.getStyle().getImpl().selectClusterInteraction.getLayer());
          }
          passFilter = passFilter || l === olLayer;
          return passFilter;
        },
      });
    }
    return features;
  }

  /**
   * function adds the event 'click'
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  addCursorPointer() {
    const viewport = this.map_.getMapImpl().getViewport();
    if (viewport.style.cursor !== 'pointer') {
      this.defaultCursor_ = viewport.style.cursor;
    }
    viewport.style.cursor = 'pointer';
  }

  /**
   * function adds the event 'click'
   *
   * @public
   * @function
   * @api stable
   * @export
   */
  removeCursorPointer() {
    this.map_.getMapImpl().getViewport().style.cursor = this.defaultCursor_;
  }

  /**
   * This function destroys this layer, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    // unlisten event
    this.map_.un('click', this.onMapClick_, this);
    this.map_ = null;
  }
}

export default Feature;
