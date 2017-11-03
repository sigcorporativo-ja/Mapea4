goog.provide('M.impl.interaction.SelectCluster');

goog.require('ol.interaction.Select');

/**
 * @classdesc
 * Main constructor of the class. Creates interaction SelectCluster
 * control
 *
 * @constructor
 * @param {Object} options - ranges defined by user
 * @api stable
 */
M.impl.interaction.SelectCluster = function(options) {
  options = options || {};

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

  // Create a new overlay layer for
  let overlay = this.overlayLayer_ = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: new ol.Collection(),
      useSpatialIndex: true
    }),
    name: 'Cluster overlay',
    updateWhileAnimating: true,
    updateWhileInteracting: true,
    displayInLayerSwitcher: false,
    style: options.featureStyle
  });

  // Add the overlay to selection
  if (options.layers) {
    if (typeof(options.layers) == "function") {
      let fn = options.layers;
      options.layers = function(layer) {
        return (layer === overlay || fn(layer));
      };
    }
    else if (options.layers.push) {
      options.layers.push(this.overlayLayer_);
    }
  }

  // Don't select links
  if (options.filter) {
    let fn = options.filter;
    options.filter = function(f, l) { //if (l===overlay && f.get("selectclusterlink")) return false;
      if (!l && f.get("selectclusterlink")) return false;
      else return fn(f, l);
    };
  }
  else options.filter = function(f, l) { //if (l===overlay && f.get("selectclusterlink")) return false;
    if (!l && f.get("selectclusterlink")) return false;
    else return true;
  };
  this.filter_ = options.filter;

  ol.interaction.Select.call(this, options);
  this.on("select", this.selectCluster, this);
};

ol.inherits(M.impl.interaction.SelectCluster, ol.interaction.Select);


/**
 * TODO
 *
 * @public
 * @function
 * @api stable
 */
M.impl.interaction.SelectCluster.prototype.setMap = function(map) {
  if (this.getMap()) {
    if (this.getMap().getView()) {
      this.getMap().getView().un('change:resolution', this.clear, this);
    }
    this.getMap().removeLayer(this.overlayLayer_);
  }

  ol.interaction.Select.prototype.setMap.call(this, map);
  this.overlayLayer_.setMap(map);
  // map.addLayer(this.overlayLayer_);

  if (map && map.getView()) {
    map.getView().on('change:resolution', this.clear, this);
  }
};

/**
 * TODO
 *
 * @public
 * @function
 * @api stable
 */
M.impl.interaction.SelectCluster.prototype.clear = function() {
  this.getFeatures().clear();
  this.overlayLayer_.getSource().clear();
};

/**
 * TODO
 *
 * @public
 * @function
 * @api stable
 */
M.impl.interaction.SelectCluster.prototype.getLayer = function() {
  return this.overlayLayer_;
};

/**
 * TODO
 *
 * @public
 * @function
 * @api stable
 */
M.impl.interaction.SelectCluster.prototype.selectCluster = function(e) { // Nothing selected
  if (!e.selected.length) {

    this.clear();
    return;
  }

  // Get selection
  let feature = e.selected[0];
  // It's one of ours
  if (feature.get('selectclusterfeature')) return;

  // Clic out of the cluster => close it
  let source = this.overlayLayer_.getSource();
  source.clear();

  let cluster = feature.get('features');
  // Not a cluster (or just one feature)
  if (!cluster || cluster.length == 1) {
    let features = cluster.map(M.impl.Feature.olFeature2Facade);
    this.map.getFeatureHandler().selectFeatures(features, this.facadeLayer_, {
      'pixel': e.mapBrowserEvent.pixel,
      'coord': e.mapBrowserEvent.coordinate,
      'vendor': e
    });
    return;
  }

  if (!cluster || cluster.length > this.maxFeaturesToSelect) {
    let extend = M.impl.utils.getFeaturesExtent(cluster);
    this.map.setBbox(extend);
    return;
  }

  // Remove cluster from selection
  if (!this.selectCluster_) this.getFeatures().clear();

  let center = feature.getGeometry().getCoordinates();
  // Pixel size in map unit
  let pix = this.getMap().getView().getResolution();
  let r = pix * this.pointRadius * (0.5 + cluster.length / 4);
  // Draw on a circle
  if (!this.spiral || cluster.length <= this.circleMaxObjects) {
    let max = Math.min(cluster.length, this.circleMaxObjects);
    for (let i = 0; i < max; i++) {
      let a = 2 * Math.PI * i / max;
      if (max == 2 || max == 4) a += Math.PI / 4;
      let p = [center[0] + r * Math.sin(a), center[1] + r * Math.cos(a)];
      let cf = new ol.Feature();
      cluster[i].getKeys().forEach(attr => {
        cf.set(attr, cluster[i].get(attr));
      });
      let [style, styleIcon] = cluster[i].getStyle()(cluster[i], pix);
      let styleIconClone = styleIcon.clone();
      let styleImage = styleIconClone.getImage();
      if (styleImage) {
        if (!styleImage.size_) {
          styleImage.size_ = [42, 42];
        }
      }
      cf.setStyle([style, styleIconClone]);
      cf.set('features', [cluster[i]]);
      cf.set('geometry', new ol.geom.Point(p));
      source.addFeature(cf);
      let lk = new ol.Feature({
        'selectclusterlink': true,
        geometry: new ol.geom.LineString([center, p])
      });
      source.addFeature(lk);
    }
  }
  // Draw on a spiral
  else { // Start angle
    let a = 0;
    let r;
    let d = 2 * this.pointRadius;
    let max = Math.min(this.maxObjects, cluster.length);
    // Feature on a spiral
    for (let i = 0; i < max; i++) { // New radius => increase d in one turn
      r = d / 2 + d * a / (2 * Math.PI);
      // Angle
      a = a + (d + 0.1) / r;
      let dx = pix * r * Math.sin(a);
      let dy = pix * r * Math.cos(a);
      let p = [center[0] + dx, center[1] + dy];
      let cf = new ol.Feature();
      cluster[i].getKeys().forEach(attr => {
        cf.set(attr, cluster[i].get(attr));
      });
      let [style, styleIcon] = cluster[i].getStyle()(cluster[i], pix);
      let styleIconClone = styleIcon.clone();
      let styleImage = styleIconClone.getImage();
      if (styleImage) {
        if (!styleImage.size_) {
          styleImage.size_ = [42, 42];
        }
      }
      cf.setStyle([style, styleIconClone]);
      cf.set('features', [cluster[i]]);
      cf.set('geometry', new ol.geom.Point(p));
      source.addFeature(cf);
      let lk = new ol.Feature({
        'selectclusterlink': true,
        geometry: new ol.geom.LineString([center, p])
      });
      source.addFeature(lk);
    }
  }

  if (this.animate) this.animateCluster_(center);
};

/**
 * TODO
 *
 * @public
 * @function
 * @api stable
 */
M.impl.interaction.SelectCluster.prototype.animateCluster_ = function(center) { // Stop animation (if one is running)
  if (this.listenerKey_) {
    this.overlayLayer_.setVisible(true);
    ol.Observable.unByKey(this.listenerKey_);
  }

  // Features to animate
  let features = this.overlayLayer_.getSource().getFeatures();
  if (!features.length) return;

  this.overlayLayer_.setVisible(false);
  let style = this.overlayLayer_.getStyle();
  let stylefn = (typeof(style) == 'function') ? style : style.length ? function() {
    return style;
  } : function() {
    return [style];
  };
  let duration = this.animationDuration || 500;
  let start = new Date().getTime();

  // Animate function
  function animate(event) {
    let vectorContext = event.vectorContext;
    // Retina device
    let ratio = event.frameState.pixelRatio;
    let res = event.target.getView().getResolution();
    let e = ol.easing.easeOut((event.frameState.time - start) / duration);
    for (let i = 0; i < features.length; i++)
      if (features[i].get('features')) {
        let feature = features[i];
        let mFeature = feature.get('features')[0];
        let pt = feature.getGeometry().getCoordinates();
        pt[0] = center[0] + e * (pt[0] - center[0]);
        pt[1] = center[1] + e * (pt[1] - center[1]);
        let geo = new ol.geom.Point(pt);
        // Image style
        let st = null;
        if (mFeature.getStyleFunction() != null) {
          st = mFeature.getStyleFunction().call(mFeature, res);
        }
        else {
          st = stylefn.call(mFeature, res);
        }
        for (let s = 0; s < st.length; s++) {
          let style = st[s];
          if (style.getImage() instanceof M.impl.style.PointIcon) {
            style = st[s].clone();
            if (!style.getImage().size_) {
              style.getImage().size_ = [42, 42];
            }
          }
          let imgs = style.getImage();
          let sc;
          if (imgs) {
            sc = imgs.getScale();
            imgs.setScale(ratio); // setImageStyle don't check retina
          }
          // OL3 > v3.14
          if (vectorContext.setStyle) {
            vectorContext.setStyle(style);
            vectorContext.drawGeometry(geo);
          }
          // older version
          else {
            vectorContext.setImageStyle(imgs);
            vectorContext.drawPointGeometry(geo);
          }
          if (imgs) imgs.setScale(sc);
        }
      }
    // Stop animation and restore cluster visibility
    if (e > 1.0) {
      ol.Observable.unByKey(this.listenerKey_);
      this.overlayLayer_.setVisible(true);
      // text on chart style not show
      // this.overlayLayer_.changed();
      return;
    }
    // tell OL3 to continue postcompose animation
    event.frameState.animate = true;
  }

  // Start a new postcompose animation
  this.listenerKey_ = this.getMap().on('postcompose', animate, this);
  //select.getMap().renderSync();
};
