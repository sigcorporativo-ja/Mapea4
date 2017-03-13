goog.provide('M.impl.layer.GeoJSON');

goog.require('M.utils');
goog.require('M.exception');
goog.require('M.impl.Layer');
goog.require('M.impl.loader.JSONP');
goog.require('M.impl.format.GeoJSON');
goog.require('M.impl.Popup');

goog.require('ol.layer.Vector');
goog.require('ol.source.Vector');

goog.require('goog.style');

(function () {
  /**
   * @classdesc
   * Main constructor of the class. Creates a KML layer
   * with parameters specified by the user
   *
   * @constructor
   * @implements {M.impl.Layer}
   * @param {Mx.parameters.LayerOptions} options custom options for this layer
   * @api stable
   */
  M.impl.layer.GeoJSON = (function (parameters, options) {
    /**
     * Popup showed
     * @private
     * @type {M.impl.Popup}
     */
    this.popup_ = null;

    /**
     *
     * @private
     * @type {M.impl.format.GeoJSON}
     */
    this.formater_ = null;

    /**
     *
     * @private
     * @type {function}
     */
    this.loader_ = null;

    /**
     *
     * @private
     * @type {Array<String>}
     */
    this.hiddenAttributes_ = [];
    if (!M.utils.isNullOrEmpty(options.hide)) {
      this.hiddenAttributes_ = options.hide;
    }

    /**
     *
     * @private
     * @type {Array<String>}
     */
    this.showAttributes_ = [];
    if (!M.utils.isNullOrEmpty(options.show)) {
      this.showAttributes_ = options.show;
    }
    // calls the super constructor
    goog.base(this, options);
  });
  goog.inherits(M.impl.layer.GeoJSON, M.impl.Layer);

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.impl.Map} map
   * @api stable
   */
  M.impl.layer.GeoJSON.prototype.addTo = function (map) {
    this.map = map;

    this.formater_ = new M.impl.format.GeoJSON({
      'defaultDataProjection': ol.proj.get(this.map.getProjection().code)
    });
    if (!M.utils.isNullOrEmpty(this.url)) {
      this.loader_ = new M.impl.loader.JSONP(map, this.url, this.formater_);
    }
    this.ol3Layer = new ol.layer.Vector();
    this.updateSource_();
    // sets its visibility if it is in range
    if (this.options.visibility !== false) {
      this.setVisible(this.inRange());
    }
    // sets its z-index
    if (this.zIndex_ !== null) {
      this.setZIndex(this.zIndex_);
    }
    this.setZIndex(999999);
    var olMap = this.map.getMapImpl();
    olMap.addLayer(this.ol3Layer);
    this.map.getImpl().getFeaturesHandler().addLayer(this);
  };

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.Map} map
   * @api stable
   */
  M.impl.layer.GeoJSON.prototype.refresh = function () {
    this.updateSource_();
  };

  /**
   * This function sets the map object of the layer
   *
   * @private
   * @function
   */
  M.impl.layer.GeoJSON.prototype.updateSource_ = function () {
    var srcOptions;
    var this_ = this;
    if (!M.utils.isNullOrEmpty(this.url)) {
      srcOptions = {
        format: this.formater_,
        loader: this.loader_.getLoaderFn(function (features) {
          this_.ol3Layer.getSource().addFeatures(features);
          this_.fire(M.evt.LOAD, features);
        }),
        strategy: ol.loadingstrategy.all
      };
    }
    else if (!M.utils.isNullOrEmpty(this.source)) {
      srcOptions = {
        features: this.formater_.readFeatures(this.source, {
          featureProjection: ol.proj.get(this_.map.getProjection().code)
        })
      };
    }
    this.ol3Layer.setSource(new ol.source.Vector(srcOptions));
  };

  /**
   * This function checks if an object is equals
   * to this layer
   * @public
   * @function
   * @param {ol.Feature} feature
   * @api stable
   */
  M.impl.layer.GeoJSON.prototype.selectFeatures = function (features, coord, evt) {
    if (this.extract === true) {
      // unselects previous features
      this.unselectFeatures();

      var feature = features[0];
      if (!M.utils.isNullOrEmpty(feature) && !M.utils.isNullOrEmpty(feature.getProperties()) && !M.utils.isNullOrEmpty(feature.getProperties().vendor) && !M.utils.isNullOrEmpty(feature.getProperties().vendor.mapea) && !M.utils.isNullOrEmpty(feature.getProperties().vendor.mapea.click) && M.utils.isFunction(feature.getProperties().vendor.mapea.click)) {
        feature.getProperties().vendor.mapea.click(evt, feature);
      }
      else {
        M.template.compile(M.layer.GeoJSON.POPUP_TEMPLATE, {
            'jsonp': true,
            'vars': this.parseFeaturesForTemplate_(features),
            'parseToHtml': false
          })
          .then(function (htmlAsText) {
            var featureTabOpts = {
              'icon': 'g-cartografia-pin',
              'title': this.name,
              'content': htmlAsText
            };
            var popup = this.map.getPopup();
            if (M.utils.isNullOrEmpty(popup)) {
              popup = new M.Popup();
              popup.addTab(featureTabOpts);
              this.map.addPopup(popup, coord);
            }
            else {
              popup.addTab(featureTabOpts);
            }
          }.bind(this));
      }
    }
  };

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @public
   * @function
   * @param {ol.Feature} feature
   * @api stable
   */
  M.impl.layer.GeoJSON.prototype.unselectFeatures = function () {
    this.map.removePopup();
  };

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  M.impl.layer.GeoJSON.prototype.parseFeaturesForTemplate_ = function (features) {
    var featuresTemplate = {
      'features': []
    };

    features.forEach(function (feature) {
      var properties = feature.getProperties();
      var attributes = [];
      for (var key in properties) {
        let addAttribute = true;
        // adds the attribute just if it is not in
        // hiddenAttributes_ or it is in showAttributes_
        if (!M.utils.isNullOrEmpty(this.showAttributes_)) {
          addAttribute = M.utils.includes(this.showAttributes_, key);
        }
        else if (!M.utils.isNullOrEmpty(this.hiddenAttributes_)) {
          addAttribute = !M.utils.includes(this.hiddenAttributes_, key);
        }
        if (addAttribute) {
          attributes.push({
            'key': M.utils.beautifyAttributeName(key),
            'value': properties[key]
          });
        }
      }
      var featureTemplate = {
        'id': feature.getId(),
        'attributes': attributes
      };
      featuresTemplate.features.push(featureTemplate);
    }, this);
    return featuresTemplate;
  };

  /**
   * This function destroys this layer, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.layer.GeoJSON.prototype.destroy = function () {
    var olMap = this.map.getMapImpl();

    if (!M.utils.isNullOrEmpty(this.ol3Layer)) {
      olMap.removeLayer(this.ol3Layer);
      this.ol3Layer = null;
    }
    this.options = null;
    this.map = null;
  };

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api stable
   */
  M.impl.layer.GeoJSON.prototype.equals = function (obj) {
    var equals = false;

    if (obj instanceof M.impl.layer.GeoJSON) {
      equals = equals && (this.name === obj.name);
      equals = equals && (this.extract === obj.extract);
    }
    return equals;
  };

  /**
   * Style for this layer
   * @const
   * @type {ol.style.Style}
   * @public
   * @api stable
   */
  M.impl.layer.GeoJSON.STYLE = new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(163, 93, 56, 0.2)'
    }),
    stroke: new ol.style.Stroke({
      color: '#a35d38',
      width: 2
    }),
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({
        color: '#a35d38'
      })
    })
  });
})();
