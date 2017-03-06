goog.provide('P.control.Printer');

goog.require('goog.dom.classlist');
goog.require('goog.events');
goog.require('goog.style');

(function () {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WMCSelector
   * control to provides a way to select an specific WMC
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  M.control.Printer = (function (url, params, options) {
    // checks if the implementation can manage this control
    if (M.utils.isUndefined(M.impl.control.Printer)) {
      M.exception('La implementación usada no puede crear controles Printer');
    }

    if (M.utils.isUndefined(M.impl.control.Printer.prototype.encodeLayer)) {
      M.exception('La implementación usada no posee el método encodeLayer');
    }

    if (M.utils.isUndefined(M.impl.control.Printer.prototype.encodeLegend)) {
      M.exception('La implementación usada no posee el método encodeLegend');
    }

    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.url_ = url;

    /**
     * Facade of the map
     * @private
     * @type {HTMLElement}
     */
    this.inputTitle_ = null;

    /**
     * Facade of the map
     * @private
     * @type {HTMLElement}
     */
    this.areaDescription_ = null;

    /**
     * Facade of the map
     * @private
     * @type {HTMLElement}
     */
    this.layout_ = null;

    /**
     * Facade of the map
     * @private
     * @type {HTMLElement}
     */
    this.format_ = null;

    /**
     * Facade of the map
     * @private
     * @type {HTMLElement}
     */
    this.dpi_ = null;

    /**
     * Facade of the map
     * @private
     * @type {HTMLElement}
     */
    this.forceScale_ = null;

    /**
     * Facade of the map
     * @private
     * @type {Promise}
     */
    this.params_ = params || {};

    /**
     * Facade of the map
     * @private
     * @type {HTMLElement}
     */
    this.queueContainer_ = null;

    /**
     * Facade of the map
     * @private
     * @type {Promise}
     */
    this.capabilitiesPromise_ = null;

    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.options_ = options || {};
    // gets default values
    // layout
    if (M.utils.isNullOrEmpty(this.options_.layout)) {
      this.options_.layout = M.config.geoprint.TEMPLATE;
    }
    // dpi
    if (M.utils.isNullOrEmpty(this.options_.dpi)) {
      this.options_.dpi = M.config.geoprint.DPI;
    }
    // format
    if (M.utils.isNullOrEmpty(this.options_.format)) {
      this.options_.format = M.config.geoprint.FORMAT;
    }
    // force scale
    if (M.utils.isNullOrEmpty(this.options_.forceScale)) {
      this.options_.forceScale = M.config.geoprint.FORCE_SCALE;
    }
    // legend
    if (M.utils.isNullOrEmpty(this.options_.legend)) {
      this.options_.legend = M.config.geoprint.LEGEND;
    }

    // implementation of this control
    var impl = new M.impl.control.Printer();

    goog.base(this, impl);
  });
  goog.inherits(M.control.Printer, M.Control);

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stabletrue
   */
  M.control.Printer.prototype.createView = function (map) {
    var this_ = this;
    var promise = new Promise(function (success, fail) {
      this_.getCapabilities().then(function (capabilities) {
        var i = 0,
          ilen;
        // default layout
        for (i = 0, ilen = capabilities.layouts.length; i < ilen; i++) {
          var layout = capabilities.layouts[i];
          if (layout.name === this_.options_.layout) {
            layout.default = true;
            break;
          }
        }
        // default dpi
        for (i = 0, ilen = capabilities.dpis.length; i < ilen; i++) {
          var dpi = capabilities.dpis[i];
          if (dpi.value == this_.options_.dpi) {
            dpi.default = true;
            break;
          }
        }
        // default outputFormat
        for (i = 0, ilen = capabilities.outputFormats.length; i < ilen; i++) {
          var outputFormat = capabilities.outputFormats[i];
          if (outputFormat.name === this_.options_.format) {
            outputFormat.default = true;
            break;
          }
        }
        // forceScale
        capabilities.forceScale = this_.options_.forceScale;
        M.template.compile(M.control.Printer.TEMPLATE, {
          'jsonp': true,
          'vars': capabilities
        }).then(function (html) {
          this_.addEvents(html);
          success(html);
        });
      });
    });
    return promise;
  };

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  M.control.Printer.prototype.addEvents = function (html) {
    this.element_ = html;

    // title
    this.inputTitle_ = this.element_.querySelector('.form div.title > input');

    // description
    this.areaDescription_ = this.element_.querySelector('.form div.description > textarea');

    // layout
    var selectLayout = this.element_.querySelector('.form div.layout > select');
    goog.events.listen(selectLayout, [
         goog.events.EventType.CHANGE
      ], function (event) {
      var layoutValue = selectLayout.value;
      this.setLayout({
        'value': layoutValue,
        'name': layoutValue
      });
    }, false, this);
    var layoutValue = selectLayout.value;
    this.setLayout({
      'value': layoutValue,
      'name': layoutValue
    });

    // dpi
    var selectDpi = this.element_.querySelector('.form div.dpi > select');
    goog.events.listen(selectDpi, [
         goog.events.EventType.CHANGE
      ], function (event) {
      var dpiValue = selectDpi.value;
      this.setDpi({
        'value': dpiValue,
        'name': dpiValue
      });
    }, false, this);
    var dpiValue = selectDpi.value;
    this.setDpi({
      'value': dpiValue,
      'name': dpiValue
    });

    // format
    var selectFormat = this.element_.querySelector('.form div.format > select');
    goog.events.listen(selectFormat, [
         goog.events.EventType.CHANGE
      ], function (event) {
      this.setFormat(selectFormat.value);
    }, false, this);
    this.setFormat(selectFormat.value);

    // force scale
    var checkboxForceScale = this.element_.querySelector('.form div.forcescale > input');
    goog.events.listen(checkboxForceScale, goog.events.EventType.CLICK, function (event) {
      this.setForceScale(checkboxForceScale.checked === true);
    }, false, this);
    this.setForceScale(checkboxForceScale.checked === true);

    // print button
    var printBtn = this.element_.querySelector('.button > button.print');
    goog.events.listen(printBtn, goog.events.EventType.CLICK, this.printClick_, false, this);

    // clean button
    var cleanBtn = this.element_.querySelector('.button > button.remove');
    goog.events.listen(cleanBtn, goog.events.EventType.CLICK, function (event) {
      event.preventDefault();

      // resets values
      this.inputTitle_.value = "";
      this.areaDescription_.value = "";
      selectLayout.value = this.options_.layout;
      selectDpi.value = this.options_.dpi;
      selectFormat.value = this.options_.format;
      checkboxForceScale.checked = this.options_.forceScale;

      // fires all listeners
      goog.events.getListeners(selectLayout, goog.events.EventType.CHANGE, false)
        .concat(goog.events.getListeners(selectDpi, goog.events.EventType.CHANGE, false))
        .concat(goog.events.getListeners(selectFormat, goog.events.EventType.CHANGE, false))
        .concat(goog.events.getListeners(checkboxForceScale, goog.events.EventType.CLICK, false))
        .forEach(goog.events.fireListener);

      // clean queue
      Array.prototype.forEach.apply(this.queueContainer_.children, [function (child) {
        // unlisten events
        goog.events.unlisten(child, goog.events.EventType.CLICK, this.dowloadPrint, false, child);
         }, this]);
      goog.dom.removeChildren(this.queueContainer_);
    }, false, this);

    // queue
    this.queueContainer_ = this.element_.querySelector('.queue > ul.queue-container');
    M.utils.enableTouchScroll(this.queueContainer_);
  };

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  M.control.Printer.prototype.getCapabilities = function () {
    if (M.utils.isNullOrEmpty(this.capabilitiesPromise_)) {
      var this_ = this;
      this.capabilitiesPromise_ = new Promise(function (success, fail) {
        var capabilitiesUrl = M.utils.concatUrlPaths([this_.url_, 'info.json']);
        M.remote.get(capabilitiesUrl).then(function (response) {
          var capabilities = {};
          try {
            capabilities = JSON.parse(response.text);
          }
          catch (err) {}
          success(capabilities);
        });
      });
    }
    return this.capabilitiesPromise_;
  };

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  M.control.Printer.prototype.setLayout = function (layout) {
    this.layout_ = layout;
  };

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  M.control.Printer.prototype.setFormat = function (format) {
    this.format_ = format;
  };

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  M.control.Printer.prototype.setDpi = function (dpi) {
    this.dpi_ = dpi;
  };

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  M.control.Printer.prototype.setForceScale = function (forceScale) {
    this.forceScale_ = forceScale;
  };

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  M.control.Printer.prototype.printClick_ = function (evt) {
    evt.preventDefault();

    var this_ = this;
    this.getCapabilities().then(function (capabilities) {
      this_.getPrintData().then(function (printData) {
        var printUrl = M.utils.addParameters(capabilities.createURL, 'mapeaop=geoprint');

        // append child
        var queueEl = this_.createQueueElement();
        goog.dom.appendChild(this_.queueContainer_, queueEl);
        goog.dom.classlist.add(queueEl, M.control.Printer.LOADING_CLASS);

        M.remote.post(printUrl, printData).then(function (response) {
          goog.dom.classlist.remove(queueEl, M.control.Printer.LOADING_CLASS);

          if (response.error !== true) {
            var downloadUrl;
            try {
              response = JSON.parse(response.text);
              downloadUrl = response['getURL'];
            }
            catch (err) {}
            // sets the download URL
            queueEl.setAttribute(M.control.Printer.DOWNLOAD_ATTR_NAME, downloadUrl);
            goog.events.listen(queueEl, goog.events.EventType.CLICK, this_.dowloadPrint, false, queueEl);
          }
          else {
            M.dialog.error('Se ha producido un error en la impresión');
          }
        });
      });
    });
  };

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  M.control.Printer.prototype.getPrintData = function () {
    var title = this.inputTitle_.value;
    var description = this.areaDescription_.value;
    var projection = this.map_.getProjection();
    var layout = this.layout_.name;
    var dpi = this.dpi_.value;
    var outputFormat = this.format_;

    var printData = M.utils.extend({
      'units': projection.units,
      'srs': projection.code,
      'layout': layout,
      'dpi': dpi,
      'outputFormat': outputFormat
    }, this.params_.layout);

    var this_ = this;
    return this.encodeLayers().then(function (encodedLayers) {
      printData.layers = encodedLayers;
      printData.pages = this_.encodePages(title, description);
      if (this_.options_.legend === true) {
        printData.legends = this_.encodeLegends();
      }
      return printData;
    });
  };

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  M.control.Printer.prototype.encodeLayers = function () {
    var layers = this.map_.getLayers().filter(function (layer) {
      return ((layer.isVisible() === true) && (layer.inRange() === true));
    });
    var numLayersToProc = layers.length;

    var this_ = this;
    return (new Promise(function (success, fail) {
      var encodedLayers = [];
      layers.forEach(function (layer) {
        this.getImpl().encodeLayer(layer).then(function (encodedLayer) {
          if (encodedLayer !== null) {
            encodedLayers.push(encodedLayer);
          }
          numLayersToProc--;
          if (numLayersToProc === 0) {
            success(encodedLayers);
          }
        });

      }, this_);
    }));
  };

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  M.control.Printer.prototype.encodePages = function (title, description) {
    var encodedPages = [];

    if (!M.utils.isArray(this.params_.pages)) {
      this.params_.pages = [this.params_.pages];
    }
    this.params_.pages.forEach(function (page) {
      var encodedPage = M.utils.extend({
        'title': title,
        'printTitle': title,
        'printDescription': description,
        'infoSRS': "\n" + this.map_.getProjection().code
      }, page);

      if (this.forceScale_ === false) {
        var bbox = this.map_.getBbox();
        encodedPage.bbox = [bbox.x.min, bbox.y.min, bbox.x.max, bbox.y.max];
      }
      else if (this.forceScale_ === true) {
        var center = this.map_.getCenter();
        encodedPage.center = [center.x, center.y];
        encodedPage.scale = this.map_.getScale();
      }
      encodedPage.rotation = 0;
      encodedPages.push(encodedPage);
    }, this);

    return encodedPages;
  };

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  M.control.Printer.prototype.encodeLegends = function () {
    // TODO
    var encodedLegends = [];

    var layers = this.map_.getLayers();
    layers.forEach(function (layer) {
      if ((layer.isVisible() === true) && (layer.inRange() === true)) {
        var encodedLegend = this.getImpl().encodeLegend(layer);
        if (encodedLegend !== null) {
          encodedLegends.push(encodedLegend);
        }
      }
    }, this);
    return encodedLegends;
  };

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @public
   * @function
   * @api stable
   */
  M.control.Printer.prototype.createQueueElement = function () {
    var queueElem = goog.dom.createElement('li');
    var title = this.inputTitle_.value;
    if (M.utils.isNullOrEmpty(title)) {
      title = M.control.Printer.NO_TITLE;
    }
    queueElem.innerHTML = title;
    return queueElem;
  };

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @public
   * @function
   * @api stable
   */
  M.control.Printer.prototype.dowloadPrint = function (event) {
    event.preventDefault();

    var downloadUrl = this.getAttribute(M.control.Printer.DOWNLOAD_ATTR_NAME);
    if (!M.utils.isNullOrEmpty(downloadUrl)) {
      window.open(downloadUrl, '_blank');
    }
  };

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @function
   * @api stable
   */
  M.control.Printer.prototype.equals = function (obj) {
    var equals = false;
    if (obj instanceof M.control.Printer) {
      equals = (this.name === obj.name);
    }
    return equals;
  };

  /**
   * Template for this controls
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.control.Printer.TEMPLATE = 'printer.html';

  /**
   * Template for this controls
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.control.Printer.LOADING_CLASS = 'printing';

  /**
   * Template for this controls
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.control.Printer.DOWNLOAD_ATTR_NAME = 'data-donwload-url-print';

  /**
   * Template for this controls
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  M.control.Printer.NO_TITLE = '(Sin título)';
})();
