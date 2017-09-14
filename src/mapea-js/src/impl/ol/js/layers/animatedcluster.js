goog.provide('M.impl.layer.AnimatedCluster');


/**
 * @classdesc
 * Main constructor of the class. Creates a AnimatedCluster layer
 * with parameters specified by the user
 *
 * @constructor
 * @implements {M.impl.layer.Vector}
 * @param {Mx.parameters.LayerOptions} options custom options for this layer
 * @api stable
 */
M.impl.layer.AnimatedCluster = function(options = {}) {
  // super
  goog.base(this, options);

  this.oldcluster = new ol.source.Vector();
  this.clusters = [];
  this.animation = {
    start: false
  };
  this.set('animationDuration', typeof(options.animationDuration) == 'number' ? options.animationDuration : 700);
  this.set('animationMethod', options.animationMethod || ol.easing.easeOut);

  // Save cluster before change
  this.getSource().on('change', this.saveCluster, this);
  // Animate the cluster
  this.on('precompose', this.animate, this);
  this.on('postcompose', this.postanimate, this);
};
goog.inherits(M.impl.layer.AnimatedCluster, ol.layer.Vector);

/**
 * This function sets the map object of the layer
 *
 * @public
 * @function
 * @param {M.impl.Map} map
 * @api stable
 */
M.impl.layer.AnimatedCluster.prototype.saveCluster = function() {
  this.oldcluster.clear();
  if (!this.get('animationDuration')) return;
  let features = this.getSource().getFeatures();
  if (features.length && features[0].get('features')) {
    this.oldcluster.addFeatures(this.clusters);
    this.clusters = features.slice(0);
    this.sourceChanged = true;
  }
};

/**
 * This function sets the map object of the layer
 *
 * @public
 * @function
 * @param {M.impl.Map} map
 * @api stable
 */
M.impl.layer.AnimatedCluster.prototype.getClusterForFeature = function(f, cluster) {
  for (let j = 0; j < cluster.length; j++) {
    let features = cluster[j].get('features');
    if (features && features.length) {
      for (let k = 0; k < features.length; k++) {
        let f2 = features[k];
        if (f === f2) {
          return cluster[j];
        }
      }
    }
  }
  return false;
};

/**
 * This function sets the map object of the layer
 *
 * @public
 * @function
 * @param {M.impl.Map} map
 * @api stable
 */
M.impl.layer.AnimatedCluster.prototype.stopAnimation = function() {
  this.animation.start = false;
  this.animation.cA = [];
  this.animation.cB = [];
};

/**
 * This function sets the map object of the layer
 *
 * @public
 * @function
 * @param {M.impl.Map} map
 * @api stable
 */
M.impl.layer.AnimatedCluster.prototype.animate = function(e) {
  let duration = this.get('animationDuration');
  if (!duration) return;
  let resolution = e.frameState.viewState.resolution;
  let a = this.animation;
  let time = e.frameState.time;

  // Start a new animation, if change resolution and source has changed
  if (a.resolution != resolution && this.sourceChanged) {
    let extent = e.frameState.extent;
    if (a.resolution < resolution) {
      extent = ol.extent.buffer(extent, 100 * resolution);
      a.cA = this.oldcluster.getFeaturesInExtent(extent);
      a.cB = this.getSource().getFeaturesInExtent(extent);
      a.revers = false;
    }
    else {
      extent = ol.extent.buffer(extent, 100 * resolution);
      a.cA = this.getSource().getFeaturesInExtent(extent);
      a.cB = this.oldcluster.getFeaturesInExtent(extent);
      a.revers = true;
    }
    a.clusters = [];
    for (let i = 0; i < a.cA.length; i++) {
      let c0 = a.cA[i];
      let f = c0.get('features');
      if (f && f.length) {
        let c = this.getClusterForFeature(f[0], a.cB);
        if (c) a.clusters.push({
          f: c0,
          pt: c.getGeometry().getCoordinates()
        });
      }
    }
    // Save state
    a.resolution = resolution;
    this.sourceChanged = false;

    // No cluster or too much to animate
    if (!a.clusters.length || a.clusters.length > 1000) {
      this.stopAnimation();
      return;
    }
    // Start animation from now
    time = a.start = (new Date()).getTime();
  }

  // Run animation
  if (a.start) {
    let vectorContext = e.vectorContext;
    let d = (time - a.start) / duration;
    // Animation ends
    if (d > 1.0) {
      this.stopAnimation();
      d = 1;
    }
    d = this.get('animationMethod')(d);
    // Animate
    let style = this.getStyle();
    let stylefn = (typeof(style) == 'function') ? style : style.length ? function() {
      return style;
    } : function() {
      return [style];
    };
    // Layer opacity
    e.context.save();
    e.context.globalAlpha = this.getOpacity();
    // Retina device
    let ratio = e.frameState.pixelRatio;
    for (let i = 0; i < a.clusters.length; i++) {
      let c = a.clusters[i];
      let pt = c.f.getGeometry().getCoordinates();
      if (a.revers) {
        pt[0] = c.pt[0] + d * (pt[0] - c.pt[0]);
        pt[1] = c.pt[1] + d * (pt[1] - c.pt[1]);
      }
      else {
        pt[0] = pt[0] + d * (c.pt[0] - pt[0]);
        pt[1] = pt[1] + d * (c.pt[1] - pt[1]);
      }
      // Draw feature
      let st = stylefn(c.f, resolution);
      /* Preserve pixel ration on retina */
      let geo = new ol.geom.Point(pt);
      for (let k = 0; k < st.length; k++) {
        let s = st[k];
        let imgs = s.getImage();
        let sc;
        if (imgs) {
          sc = imgs.getScale();
          imgs.setScale(sc * ratio); // setImageStyle don't check retina
        }
        // OL3 > v3.14
        if (vectorContext.setStyle) {
          // if (M.utils.isNullOrEmpty(s.getImage().getAnchor())) {
          //   s.getImage().normalizedAnchor_ = s.getImage().anchor_;
          // }
          // if (M.utils.isNullOrEmpty(s.getImage().size_)) {
          //   s.getImage().size_ = [];
          // }
          vectorContext.setStyle(s);
          vectorContext.drawGeometry(geo);
        }
        // older version
        else {
          vectorContext.setImageStyle(imgs);
          vectorContext.setTextStyle(s.getText());
          vectorContext.drawPointGeometry(geo);
        }
        if (imgs) imgs.setScale(sc);
      }
      /*/
      let f = new ol.Feature(new ol.geom.Point(pt));
      for (let k=0; s=st[k]; k++)
      {	let imgs = s.getImage();
      	let sc = imgs.getScale();
      	imgs.setScale(sc*ratio); // drawFeature don't check retina
      	vectorContext.drawFeature(f, s);
      	imgs.setScale(sc);
      }
      /**/
    }
    e.context.restore();
    // tell OL3 to continue postcompose animation
    e.frameState.animate = true;

    // Prevent layer drawing (clip with null rect)
    e.context.save();
    e.context.beginPath();
    e.context.rect(0, 0, 0, 0);
    e.context.clip();
    this.clip_ = true;
  }

  return;
};

/**
 * This function sets the map object of the layer
 *
 * @public
 * @function
 * @param {M.impl.Map} map
 * @api stable
 */
M.impl.layer.AnimatedCluster.prototype.postanimate = function(e) {
  if (this.clip_) {
    e.context.restore();
    this.clip_ = false;
  }
};
