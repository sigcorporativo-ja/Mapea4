import PrinterControlImpl from "../../impl/ol/js/printercontrol";

export default class PrinterControl extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WMCSelector
   * control to provides a way to select an specific WMC
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor(url, params, options) {
    // implementation of this control
    let impl = new PrinterControlImpl();

    super(impl);

    // checks if the implementation can manage this control
    if (M.utils.isUndefined(PrinterControlImpl)) {
      M.Exception('La implementación usada no puede crear controles Printer');
    }

    if (M.utils.isUndefined(PrinterControlImpl.prototype.encodeLayer)) {
      M.Exception('La implementación usada no posee el método encodeLayer');
    }

    if (M.utils.isUndefined(PrinterControlImpl.prototype.encodeLegend)) {
      M.Exception('La implementación usada no posee el método encodeLegend');
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

  }

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stabletrue
   */
  createView(map) {
    let promise = new Promise((success, fail) => {
      this.getCapabilities().then(capabilities => {
        let i = 0,
          ilen;
        // default layout
        for (i = 0, ilen = capabilities.layouts.length; i < ilen; i++) {
          let layout = capabilities.layouts[i];
          if (layout.name === this.options_.layout) {
            layout.default = true;
            break;
          }
        }
        // default dpi
        for (i = 0, ilen = capabilities.dpis.length; i < ilen; i++) {
          let dpi = capabilities.dpis[i];
          if (dpi.value == this.options_.dpi) {
            dpi.default = true;
            break;
          }
        }
        // default outputFormat
        for (i = 0, ilen = capabilities.outputFormats.length; i < ilen; i++) {
          let outputFormat = capabilities.outputFormats[i];
          if (outputFormat.name === this.options_.format) {
            outputFormat.default = true;
            break;
          }
        }
        // forceScale
        capabilities.forceScale = this.options_.forceScale;
        M.Template.compile(Printer.TEMPLATE, {
          'jsonp': true,
          'vars': capabilities
        }).then(html => {
          this.addEvents(html);
          success(html);
        });
      });
    });
    return promise;
  }

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  addEvents(html) {
    this.element_ = html;

    // title
    this.inputTitle_ = this.element_.querySelector('.form div.title > input');

    // description
    this.areaDescription_ = this.element_.querySelector('.form div.description > textarea');

    // layout
    let selectLayout = this.element_.querySelector('.form div.layout > select');
    selectLayout.addEventListener("change", (event) => {
      let layoutValue = selectLayout.value;
      this.setLayout({
        'value': layoutValue,
        'name': layoutValue
      });
    });

    let layoutValue = selectLayout.value;
    this.setLayout({
      'value': layoutValue,
      'name': layoutValue
    });

    // dpi
    let selectDpi = this.element_.querySelector('.form div.dpi > select');
    selectDpi.addEventListener("change", (event) => {
      let dpiValue = selectDpi.value;
      this.setDpi({
        'value': dpiValue,
        'name': dpiValue
      });
    });

    var dpiValue = selectDpi.value;
    this.setDpi({
      'value': dpiValue,
      'name': dpiValue
    });

    // format
    let selectFormat = this.element_.querySelector('.form div.format > select');
    selectFormat.addEventListener("change", (event) => {
      this.setFormat(selectFormat.value);
    });
    this.setFormat(selectFormat.value);

    // force scale
    let checkboxForceScale = this.element_.querySelector('.form div.forcescale > input');
    checkboxForceScale.addEventListener("click", (event) => {
      this.setForceScale(checkboxForceScale.checked === true);
    });
    this.setForceScale(checkboxForceScale.checked === true);

    // print button
    let printBtn = this.element_.querySelector('.button > button.print');
    printBtn.addEventListener("click", this.printClick_);

    // clean button
    let cleanBtn = this.element_.querySelector('.button > button.remove');
    cleanBtn.addEventListener("click", (event) => {
      event.preventDefault();

      // resets values
      this.inputTitle_.value = "";
      this.areaDescription_.value = "";
      selectLayout.value = this.options_.layout;
      selectDpi.value = this.options_.dpi;
      selectFormat.value = this.options_.format;
      checkboxForceScale.checked = this.options_.forceScale;

      // fires all listeners
      //TODO TODO TODO TODO TODO TODO
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
    });

    // queue
    this.queueContainer_ = this.element_.querySelector('.queue > ul.queue-container');
    M.utils.enableTouchScroll(this.queueContainer_);
  }

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  getCapabilities() {
    if (M.utils.isNullOrEmpty(this.capabilitiesPromise_)) {
      this.capabilitiesPromise_ = new Promise((success, fail) => {
        let capabilitiesUrl = M.utils.concatUrlPaths([this.url_, 'info.json']);
        M.Remote.get(capabilitiesUrl).then((response) => {
          let capabilities = {};
          try {
            capabilities = JSON.parse(response.text);
          } catch (err) {}
          success(capabilities);
        });
      });
    }
    return this.capabilitiesPromise_;
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  setLayout(layout) {
    this.layout_ = layout;
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  setFormat(format) {
    this.format_ = format;
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  setDpi(dpi) {
    this.dpi_ = dpi;
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  setForceScale(forceScale) {
    this.forceScale_ = forceScale;
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  printClick_(evt) {
    evt.preventDefault();

    this.getCapabilities().then(capabilities => {
      this.getPrintData().then(printData => {
        let printUrl = M.utils.addParameters(capabilities.createURL, 'mapeaop=geoprint');

        // append child
        let queueEl = this.createQueueElement();
        this.queueContainer_.appendChild(queueEl);
        queueEl.classList.add(Printer.LOADING_CLASS);

        M.Remote.post(printUrl, printData).then((response) => {
          queueEl.classList.remove(queueEl, Printer.LOADING_CLASS);

          if (response.error !== true) {
            let downloadUrl;
            try {
              response = JSON.parse(response.text);
              downloadUrl = response['getURL'];
            } catch (err) {}
            // sets the download URL
            queueEl.setAttribute(Printer.DOWNLOAD_ATTR_NAME, downloadUrl);
            queueEl.addEventListener("click", this.dowloadPrint);
          } else {
            M.Dialog.error('Se ha producido un error en la impresión');
          }
        });
      });
    });
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  getPrintData() {
    let title = this.inputTitle_.value;
    let description = this.areaDescription_.value;
    let projection = this.map_.getProjection();
    let layout = this.layout_.name;
    let dpi = this.dpi_.value;
    let outputFormat = this.format_;

    let printData = M.utils.extend({
      'units': projection.units,
      'srs': projection.code,
      'layout': layout,
      'dpi': dpi,
      'outputFormat': outputFormat
    }, this.params_.layout);

    return this.encodeLayers().then(encodedLayers => {
      printData.layers = encodedLayers;
      printData.pages = this.encodePages(title, description);
      if (this.options_.legend === true) {
        printData.legends = this.encodeLegends();
      }
      if (projection.code !== "EPSG:3857" && this.map_.getLayers().some(layer => (layer.type === M.layer.type.OSM || layer.type === M.layer.type.Mapbox))) {
        printData.srs = 'EPSG:3857';
      }
      return printData;
    });
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  encodeLayers() {
    let layers = this.map_.getLayers().filter(layer => {
      return ((layer.isVisible() === true) && (layer.inRange() === true) && layer.name !== "cluster_cover");
    });
    let numLayersToProc = layers.length;

    return (new Promise((success, fail) => {
      let encodedLayers = [];
      layers.forEach(layer => {
        this.getImpl().encodeLayer(layer).then(encodedLayer => {
          if (encodedLayer !== null) {
            encodedLayers.push(encodedLayer);
          }
          numLayersToProc--;
          if (numLayersToProc === 0) {
            success(encodedLayers);
          }
        });

      }, this);
    }));
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  encodePages(title, description) {
    let encodedPages = [];
    let projection = this.map_.getProjection();

    if (!M.utils.isArray(this.params_.pages)) {
      this.params_.pages = [this.params_.pages];
    }
    this.params_.pages.forEach(page => {
      let encodedPage = M.utils.extend({
        'title': title,
        'printTitle': title,
        'printDescription': description,
        'infoSRS': "\n" + this.map_.getProjection().code
      }, page);

      if (this.forceScale_ === false) {
        let bbox = this.map_.getBbox();
        encodedPage.bbox = [bbox.x.min, bbox.y.min, bbox.x.max, bbox.y.max];
        if (projection.code !== "EPSG:3857" && this.map_.getLayers().some(layer => (layer.type === M.layer.type.OSM || layer.type === M.layer.type.Mapbox))) {
          encodedPage.bbox = ol.proj.transformExtent(encodedPage.bbox, projection.code, 'EPSG:3857');
        }
      } else if (this.forceScale_ === true) {
        let center = this.map_.getCenter();
        encodedPage.center = [center.x, center.y];
        encodedPage.scale = this.map_.getScale();
      }
      encodedPage.rotation = 0;
      encodedPages.push(encodedPage);
    }, this);

    return encodedPages;
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  encodeLegends() {
    // TODO
    let encodedLegends = [];

    let layers = this.map_.getLayers();
    layers.forEach(layer => {
      if ((layer.isVisible() === true) && (layer.inRange() === true)) {
        let encodedLegend = this.getImpl().encodeLegend(layer);
        if (encodedLegend !== null) {
          encodedLegends.push(encodedLegend);
        }
      }
    }, this);
    return encodedLegends;
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @public
   * @function
   * @api stable
   */
  createQueueElement() {
    let queueElem = document.createElement('li');
    let title = this.inputTitle_.value;
    if (M.utils.isNullOrEmpty(title)) {
      title = Printer.NO_TITLE;
    }
    queueElem.innerHTML = title;
    return queueElem;
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @public
   * @function
   * @api stable
   */
  dowloadPrint(event) {
    event.preventDefault();

    let downloadUrl = this.getAttribute(Printer.DOWNLOAD_ATTR_NAME);
    if (!M.utils.isNullOrEmpty(downloadUrl)) {
      window.open(downloadUrl, '_blank');
    }
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @function
   * @api stable
   */
  equals(obj) {
    let equals = false;
    if (obj instanceof Printer) {
      equals = (this.name === obj.name);
    }
    return equals;
  }
}

/**
 * M.Template for this controls
 * @const
 * @type {string}
 * @public
 * @api stable
 */
Printer.TEMPLATE = 'printer.html';

/**
 * M.Template for this controls
 * @const
 * @type {string}
 * @public
 * @api stable
 */
Printer.LOADING_CLASS = 'printing';

/**
 * M.Template for this controls
 * @const
 * @type {string}
 * @public
 * @api stable
 */
Printer.DOWNLOAD_ATTR_NAME = 'data-donwload-url-print';

/**
 * M.Template for this controls
 * @const
 * @type {string}
 * @public
 * @api stable
 */
Printer.NO_TITLE = '(Sin título)';
