import ClusteredFeature from 'facade/js/feature/Clustered';
import Cluster from 'facade/js/style/Cluster';
import Utils from 'facade/js/util/Utils';
import AnimatedCluster from '../layer/AnimatedCluster';

export default class Feature {
  /**
   * @classdesc
   * Main constructor of the class. Creates a KML layer
   * with parameters specified by the user
   *
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

    if (!Utils.isNullOrEmpty(layer) && layer.isVisible() &&
      !Utils.isNullOrEmpty(layer.getImpl().getOL3Layer())) {
      const olLayer = layer.getImpl().getOL3Layer();
      this.map_.getMapImpl().forEachFeatureAtPixel(evt.pixel, (feature, layerFrom) => {
        if ((layerFrom instanceof AnimatedCluster) && !Utils.isNullOrEmpty(feature.get('features'))) {
          const clusteredFeatures = feature.get('features').map(f => this.getFacadeFeature_(f, layer));
          if (clusteredFeatures.length === 1) {
            features.push(clusteredFeatures[0]);
          }
          else {
            let styleCluster = layer.getStyle();
            if (!(styleCluster instanceof Cluster)) {
              styleCluster = styleCluster.getStyles().find(style => style instanceof Cluster);
            }
            features.push(new ClusteredFeature(clusteredFeatures, {
              ranges: styleCluster.getRanges(),
              hoverInteraction: styleCluster.getOptions().hoverInteraction,
              maxFeaturesToSelect: styleCluster.getOptions().maxFeaturesToSelect,
              distance: styleCluster.getOptions().distance,
            }));
          }
        }
        else if (!Object.prototype.hasOwnProperty.call(feature.getProperties(), 'selectclusterlink')) {
          features.push(this.getFacadeFeature_(feature, layer));
        }
      }, {
        layerFilter: (l) => {
          let passFilter = false;
          if (layer.getStyle() instanceof Cluster &&
            layer.getStyle().getOptions().selectInteraction) {
            passFilter = (l === layer.getStyle().getImpl().selectClusterInteraction.overlayLayer);
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
   * function adds the event 'click'
   *
   * @private
   * @function
   * @export
   */
  static getFacadeFeature_(feature, layer) {
    let mFeature;
    const featureId = feature.getId();
    if (!Utils.isNullOrEmpty(featureId)) {
      mFeature = layer.getFeatureById(featureId);
    }
    if (Utils.isNullOrEmpty(mFeature)) {
      mFeature = Feature.olFeature2Facade(feature);
    }
    return mFeature;
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
