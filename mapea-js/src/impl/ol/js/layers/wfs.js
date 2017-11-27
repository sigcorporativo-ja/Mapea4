goog.provide('M.impl.layer.WFS');

goog.require('M.utils');
goog.require('M.exception');
goog.require('M.impl.Layer');
goog.require('M.impl.service.WFS');
goog.require('M.impl.format.GML');
goog.require('M.format.GeoJSON');
goog.require('M.impl.loader.WFS');

goog.require('ol.layer.Vector');
goog.require('ol.source.Vector');

goog.require('M.impl.layer.Vector');

(function() {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WFS layer
   * with parameters specified by the user
   *
   * @constructor
   * @implements {M.impl.layer.Vector}
   * @param {Mx.parameters.LayerOptions} options custom options for this layer
   * @api stable
   */
  M.impl.layer.WFS = (function(options) {

    /**
     * WFS layer options
     * @private
     * @type {Mx.parameters.WFSOptions}
     * @expose
     */
    this.options = options || {};

    /**
     *
     * @private
     * @type {Object}
     */
    this.describeFeatureType_ = null;

    /**
     *
     * @private
     * @type {M.impl.format.GeoJSON | M.impl.format.GML}
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
     * @type {M.iml.service.WFS}
     */
    this.service_ = null;

    /**
     *
     * @private
     * @type {Boolean}
     */
    this.loaded_ = false;

    // GetFeature output format parameter
    if (M.utils.isNullOrEmpty(this.options.getFeatureOutputFormat)) {
      this.options.getFeatureOutputFormat = 'application/json'; // by default
    }

    // calls the super constructor
    goog.base(this, this.options);
  });
  goog.inherits(M.impl.layer.WFS, M.impl.layer.Vector);

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.Map} map
   * @api stable
   */
  M.impl.layer.WFS.prototype.addTo = function(map) {
    goog.base(this, 'addTo', map);
    // this.ol3Layer.setStyle(M.impl.layer.WFS.STYLE);
    // this.on(M.evt.LOAD, function() {
    //   let style = M.Style.createStyleLayer(M.impl.layer.WFS.DEFAULT_OPTIONS_STYLE, this.facadeVector_);
    //   this.facadeVector_.setStyle(style);
    // }.bind(this));

    this.updateSource_();
    map.getImpl().on(M.evt.CHANGE, function() {
      this.refresh();
    }, this);
  };

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {Boolean} forceNewSource
   * @api stable
   */
  M.impl.layer.WFS.prototype.refresh = function(forceNewSource) {
    if (forceNewSource) this.facadeVector_.clear();
    this.updateSource_(forceNewSource);
  };

  /**
   * This function sets the map object of the layer
   *
   * @private
   * @function
   */
  M.impl.layer.WFS.prototype.updateSource_ = function(forceNewSource) {
    var this_ = this;

    this.service_ = new M.impl.service.WFS({
      'url': this.url,
      'namespace': this.namespace,
      'name': this.name,
      'version': this.version,
      'ids': this.ids,
      'cql': this.cql,
      'projection': this.map.getProjection(),
      'getFeatureOutputFormat': this.options.getFeatureOutputFormat,
      'describeFeatureTypeOutputFormat': this.options.describeFeatureTypeOutputFormat,
    }, this.options.vendor);
    if (/json/gi.test(this.options.getFeatureOutputFormat)) {
      this.formater_ = new M.format.GeoJSON({
        'defaultDataProjection': ol.proj.get(this.map.getProjection().code)
      });
    }
    else {
      this.formater_ = new M.impl.format.GML(this.name, this.version, this.map.getProjection());
    }
    this.loader_ = new M.impl.loader.WFS(this.map, this.service_, this.formater_);

    var ol3LayerSource = this.ol3Layer.getSource();
    if ((forceNewSource === true) || M.utils.isNullOrEmpty(ol3LayerSource)) {
      this.ol3Layer.setSource(new ol.source.Vector({
        format: this.formater_.getImpl(),
        loader: this.loader_.getLoaderFn(function(features) {
          this_.loaded_ = true;
          this_.facadeVector_.addFeatures(features);
          this_.fire(M.evt.LOAD, [features]);
        }),
        strategy: ol.loadingstrategy.all
      }));
    }
    else {
      ol3LayerSource.set("format", this.formater_);
      ol3LayerSource.set("loader", this.loader_.getLoaderFn(function(features) {
        this.loaded_ = true;
        this.facadeVector_.addFeatures(features);
        this.fire(M.evt.LOAD, [features]);
      }));
      ol3LayerSource.set("strategy", ol.loadingstrategy.all);
      ol3LayerSource.changed();
    }
  };

  /**
   * This function destroys this layer, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.layer.WFS.prototype.setCQL = function(newCQL) {
    this.cql = newCQL;
    this.refresh(true);
  };

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.layer.WFS.prototype.getDescribeFeatureType = function() {
    if (M.utils.isNullOrEmpty(this.describeFeatureType_)) {
      this.describeFeatureType_ = this.service_.getDescribeFeatureType().then(function(describeFeatureType) {
        if (!M.utils.isNullOrEmpty(describeFeatureType)) {
          this.formater_ = new M.impl.format.GeoJSON({
            'geometryName': describeFeatureType.geometryName,
            'defaultDataProjection': ol.proj.get(this.map.getProjection().code)
          });
        }
        return describeFeatureType;
      }.bind(this));
    }

    return this.describeFeatureType_;
  };

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.layer.WFS.prototype.getDefaultValue = function(type) {
    var defaultValue;
    if (type == "dateTime") {
      defaultValue = '0000-00-00T00:00:00';
    }
    else if (type == "date") {
      defaultValue = '0000-00-00';
    }
    else if (type == "time") {
      defaultValue = '00:00:00';
    }
    else if (type == "duration") {
      defaultValue = 'P0Y';
    }
    else if (type == "int" || type == "number" || type == "float" || type == "double" || type == "decimal" || type == "short" || type == "byte" || type == "integer" || type == "long" || type == "negativeInteger" || type == "nonNegativeInteger" || type == "nonPositiveInteger" || type == "positiveInteger" || type == "unsignedLong" || type == "unsignedInt" || type == "unsignedShort" || type == "unsignedByte") {
      defaultValue = 0;
    }
    else {
      defaultValue = "-";
    }
    return defaultValue;
  };

  // /**
  //  * This function destroys this layer, cleaning the HTML
  //  * and unregistering all events
  //  *
  //  * @public
  //  * @function
  //  * @api stable
  //  */
  // M.impl.layer.WFS.prototype.destroy = function() {
  //   var olMap = this.map.getMapImpl();
  //   if (!M.utils.isNullOrEmpty(this.ol3Layer)) {
  //     olMap.removeLayer(this.ol3Layer);
  //     this.ol3Layer = null;
  //   }
  //   this.map = null;
  // };

  /**
   * TODO
   * @function
   * @api stable
   */
  M.impl.layer.WFS.prototype.isLoaded = function() {
    return this.loaded_;
  };

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api stable
   */
  M.impl.layer.WFS.prototype.equals = function(obj) {
    var equals = false;

    if (obj instanceof M.layer.WFS) {
      equals = (this.url === obj.url);
      equals = equals && (this.namespace === obj.namespace);
      equals = equals && (this.name === obj.name);
      equals = equals && (this.ids === obj.ids);
      equals = equals && (this.cql === obj.cql);
      equals = equals && (this.version === obj.version);
    }

    return equals;
  };

})();
