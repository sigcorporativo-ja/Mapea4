/**
 * @module M/impl/interaction/SelectCluster
 */
import OLFeature from 'ol/Feature';
import OLGeomPoint from 'ol/geom/Point';
import OLGeomLineString from 'ol/geom/LineString';
import OLInteractionSelect from 'ol/interaction/Select';
import OLLayerVector from 'ol/layer/Vector';
import OLSourceVector from 'ol/source/Vector';
import OLCollection from 'ol/Collection';
import { unByKey } from 'ol/Observable';
import { easeOut } from 'ol/easing';
import { getVectorContext } from 'ol/render';
import Icon from '../point/Icon';
import Utils from '../util/Utils';

class SelectCluster extends OLInteractionSelect {
  /**
   * @classdesc
   * Main constructor of the class. Creates interaction SelectCluster
   * control
   *
   * @constructor
   * @param {Object} options - ranges defined by user
   * @api
   */
  constructor(optionsParam = {}) {
    const options = optionsParam;
    const overlayLayer = new OLLayerVector({
      source: new OLSourceVector({
        features: new OLCollection(),
        useSpatialIndex: true,
      }),
      name: 'Cluster overlay',
      updateWhileAnimating: true,
      updateWhileInteracting: true,
      displayInLayerSwitcher: false,
      style: options.featureStyle,
    });
    optionsParam.layers.push(overlayLayer);

    options.filter = (f, l) => {
      if (!l && f.get('selectclusterlink')) return false;
      return true;
    };
    super(options);

    this.map = options.map;
    this.pointRadius = options.pointRadius || 12;
    this.circleMaxObjects = options.circleMaxObjects || 10;
    this.maxObjects = options.maxObjects || 60;
    this.spiral = (options.spiral !== false);
    this.animate = options.animate;
    this.animationDuration = options.animationDuration || 500;
    this.selectCluster_ = (options.selectCluster !== false);
    this.maxFeaturesToSelect = options.maxFeaturesToSelect;
    this.facadeLayer_ = options.fLayer;
    this.style_ = options.style;
    this.filter_ = options.filter;
    // Create a new overlay layer for
    this.overlayLayer_ = overlayLayer;

    this.originalHandleEvent = this.handleEvent;
    this.on('select', this.selectCluster.bind(this), this);
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api
   */
  setMap(map) {
    if (this.getMap()) {
      if (this.getMap().getView()) {
        this.getMap().getView().un('change:resolution', this.clear.bind(this));
      }
      this.getMap().removeLayer(this.overlayLayer_);
    }

    OLInteractionSelect.prototype.setMap.call(this, map);
    this.overlayLayer_.setMap(map);
    // map.addLayer(this.overlayLayer_);

    if (map && map.getView()) {
      map.getView().on('change:resolution', this.clear.bind(this));
    }

    this.handleEvent = (mapBrowserEvent) => {
      this.originalHandleEvent.apply(this, [mapBrowserEvent]);
      return true;
    };
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api
   */
  clear() {
    this.getFeatures().clear();
    this.overlayLayer_.getSource().clear();
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api
   */
  getLayer() {
    return this.overlayLayer_;
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api
   */
  refreshViewEvents() {
    if (this.getMap() && this.getMap().getView()) {
      this.getMap().getView().on('change:resolution', this.clear.bind(this));
    }
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api
   */
  selectCluster(e) {
    // Nothing selected
    if (!e.selected.length) {
      this.clear();
      return;
    }
    // Get selection
    const feature = e.selected[0];
    // It's one of ours
    if (feature.get('selectclusterfeature')) return;

    const cluster = feature.get('features');
    // Not a cluster (or just one feature)
    if (!cluster || cluster.length === 1) {
      return;
    }

    if (!cluster || cluster.length > this.maxFeaturesToSelect) {
      if (this.facadeLayer_.getImpl().getNumZoomLevels() - this.map.getZoom() !== 1) {
        const extend = Utils.getFeaturesExtent(cluster, this.map.getProjection().code);
        this.map.setBbox(extend);
        return;
      }
    }

    // Clic out of the cluster => close it
    // const source = this.overlayLayer_.getSource();
    // source.clear();

    // Remove cluster from selection
    if (!this.selectCluster_) {
      this.getFeatures().clear();
    }

    const center = feature.getGeometry().getCoordinates();
    const resolution = this.getMap().getView().getResolution();
    const radiusInPixels = resolution * this.pointRadius * (0.5 + (cluster.length / 4));

    if (!this.spiral || cluster.length <= this.circleMaxObjects) {
      this.overlayLayer_.getSource().refresh();
      this.drawFeaturesAndLinsInCircle_(cluster, resolution, radiusInPixels, center);
    } else { // Start angle
      this.overlayLayer_.getSource().refresh();
      this.drawFeaturesAndLinsInSpiral_(cluster, resolution, center);
    }
    if (this.animate) {
      this.animateCluster_(center);
    }
  }


  /**
   * TODO
   *
   * @private
   * @function
   */
  drawFeaturesAndLinsInCircle_(cluster, resolution, radiusInPixels, center) {
    const max = Math.min(cluster.length, this.circleMaxObjects);
    for (let i = 0; i < max; i += 1) {
      let a = (2 * Math.PI) * (i / max);
      if (max === 2 || max === 4) a += Math.PI / 4;
      const newPoint = [
        center[0] + (radiusInPixels * Math.sin(a)),
        center[1] + (radiusInPixels * Math.cos(a)),
      ];
      this.drawAnimatedFeatureAndLink_(cluster[i], resolution, center, newPoint);
    }
  }

  /**
   * TODO
   *
   * @private
   * @function
   */
  drawFeaturesAndLinsInSpiral_(cluster, resolution, center) {
    let a = 0;
    let r;
    const d = 2 * this.pointRadius;
    const max = Math.min(this.maxObjects, cluster.length);
    // Feature on a spiral
    for (let i = 0; i < max; i += 1) { // New radius => increase d in one turn
      r = (d / 2) + ((d * a) / (2 * Math.PI));
      // Angle
      a += ((d + 0.1) / r);
      const dx = resolution * r * Math.sin(a);
      const dy = resolution * r * Math.cos(a);
      const newPoint = [center[0] + dx, center[1] + dy];
      this.drawAnimatedFeatureAndLink_(cluster[i], resolution, center, newPoint);
    }
  }

  /**
   * TODO
   *
   * @private
   * @function
   */
  drawAnimatedFeatureAndLink_(clusterFeature, resolution, center, newPoint) {
    const cf = new OLFeature();
    clusterFeature.getKeys().forEach((attr) => {
      cf.set(attr, clusterFeature.get(attr));
    });

    let clusterStyleFn = clusterFeature.getStyle();
    if (!clusterStyleFn) {
      clusterStyleFn = this.facadeLayer_.getStyle().getImpl().oldOLLayer.getStyle();
    }
    const olClusterStyles = clusterStyleFn(clusterFeature, resolution);
    const clonedStyles =
      olClusterStyles.map ? olClusterStyles.map(s => s.clone()) : [olClusterStyles.clone()];

    cf.setId(clusterFeature.getId());
    cf.setStyle(clonedStyles);
    cf.set('features', [clusterFeature]);
    const geometry = ['Point', 'MultiPoint'].includes(clusterFeature.getGeometry().getType()) === true ?
      new OLGeomPoint(newPoint) :
      clusterFeature.getGeometry();
    const linkGeometry = ['Point', 'MultiPoint'].includes(clusterFeature.getGeometry().getType()) === true ?
      new OLGeomLineString([center, newPoint]) :
      new OLGeomLineString([center, Utils.getCentroid(clusterFeature.getGeometry())]);
    cf.set('geometry', geometry);
    this.overlayLayer_.getSource().addFeature(cf);

    const lk = new OLFeature({
      selectclusterlink: true,
      geometry: linkGeometry,
    });
    this.overlayLayer_.getSource().addFeature(lk);
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api
   */
  animateCluster_(center, callbackFn) {
    // Stop animation (if one is running)
    if (this.listenerKey_) {
      this.overlayLayer_.setVisible(true);
      unByKey(this.listenerKey_);
    }

    // Features to animate
    const features = this.overlayLayer_.getSource().getFeatures();
    if (!features.length) return;

    this.overlayLayer_.setVisible(false);
    const duration = this.animationDuration || 500;
    const start = new Date().getTime();

    // Animate function
    const animate = (event) => {
      const vectorContext = getVectorContext(event);
      // Retina device
      // let ratio = event.frameState.pixelRatio;
      const res = this.getMap().getView().getResolution();
      const e = easeOut((event.frameState.time - start) / duration);
      for (let i = 0; i < features.length; i += 1) {
        if (features[i].get('features')) {
          const feature = features[i];
          const mFeature = feature.get('features')[0];
          const pt = feature.getGeometry().getCoordinates();
          pt[0] = center[0] + (e * (pt[0] - center[0]));
          pt[1] = center[1] + (e * (pt[1] - center[1]));
          const geo = new OLGeomPoint(pt);

          // draw links
          const st2 = this.overlayLayer_.getStyle()(mFeature, res).map(s => s.clone());
          for (let s = 0; s < st2.length; s += 1) {
            const styleLink = st2[s];
            if (!styleLink.getImage().size) {
              styleLink.getImage().size = [42, 42];
            }
            vectorContext.setStyle(styleLink);
            vectorContext.drawLineString(new OLGeomLineString([center, pt]));
          }

          // Image style
          let clusterStyleFn = mFeature.getStyle();
          if (!clusterStyleFn) {
            clusterStyleFn = this.facadeLayer_.getStyle().getImpl().oldOLLayer.getStyle();
          }
          const olClusterStyles = clusterStyleFn(mFeature, res);
          const st =
            olClusterStyles.map ? olClusterStyles.map(s => s.clone()) : [olClusterStyles.clone()];
          for (let s = 0; s < st.length; s += 1) {
            const style = st[s];
            const imgs = style.getImage();

            if (imgs instanceof Icon) {
              const newOrigin = imgs.getOrigin() == null ? [0, 0] : imgs.getOrigin();
              const newAnchor = imgs.getAnchor() == null ? [0, 0] : imgs.getAnchor();
              const newSize = imgs.getSize() == null ? [42, 42] : imgs.getSize();
              imgs.size = newSize;
              imgs.anchor = newAnchor;
              imgs.origin = newOrigin;
              style.setImage(imgs);
            }
            // OL3 > v3.14
            vectorContext.setStyle(style);
            vectorContext.drawGeometry(geo);
          }
        }
        // Stop animation and restore cluster visibility
        if (e > 1.0) {
          unByKey(this.listenerKey_);
          this.overlayLayer_.setVisible(true);
          this.overlayLayer_.changed();
          return;
        }
        // tell OL3 to continue postcompose animation
        const eventVariable = event;
        eventVariable.frameState.animate = true;
      }
    };
    // Start a new postcompose animation
    this.listenerKey_ = this.facadeLayer_.getImpl().getOL3Layer().on(['postrender', 'postcompose'], animate, this);
    // select.getMap().renderSync();
  }
}

export default SelectCluster;
