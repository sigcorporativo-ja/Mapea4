import Draggabilly from 'draggabilly';
import GeosearchByCoordinatesImpl from '../../impl/ol/js/geosearchbycoordinatescontrol.js';
import GeosearchByCoordinatesHTML from '../../templates/geosearchbycoordinates.html';
import GeosearchByCoordinatesresultsHTML from '../../templates/results.html';
import GeosearchControl from './geosearch/geosearchcontrol.js';

export default class GeosearchByCoordinatesControl extends GeosearchControl {
  /**
   * @classdesc
   * Main constructor of the class. Creates a GeosearchByCoordinates
   * Control to display nearby points of interest to your location
   *
   * @constructor
   * @param {string} url - URL for the query
   * @param {string} core - Core to the URL for the query
   * @param {string} handler - Handler to the URL for the query
   * @param {number} distance - Distance search
   * @param {string} spatialField - Spatial field
   * @param {number} rows - Number of responses allowed
   * @extends {GeosearchControl}
   * @api stable
   */
  constructor(url, core, handler, distance, spatialField, rows) {
    // calls super
    super(url, core, handler);

    // implementation of this control
    this.impl_ = new GeosearchByCoordinatesImpl(this.searchUrl_);

    /**
     * Status button 'GeosearchByCoordinates'
     * @private
     * @type {boolean}
     */
    this.activate_ = false;

    /**
     * Status button 'List' GeosearchByCoordinates
     * @private
     * @type {boolean}
     */
    this.activatebtnList_ = true;

    /**
     * Distance search
     * @private
     * @type {number}
     */
    this.distance_ = distance;

    /**
     * Spatial field
     * @private
     * @type {string}
     */
    this.spatialField_ = spatialField;

    /**
     * Number of responses allowed
     * @private
     * @type {number}
     */
    this.rows_ = rows;

    /**
     * URL for the query
     * @private
     * @type {string}
     */
    this.searchUrl_ = M.utils.concatUrlPaths([url, core, handler]);

    /**
     * Facade Map
     * @private
     * @type {M.map}
     */
    this.facadeMap_ = null;

    /**
     * Container of the results to scroll
     * @private
     * @type {HTMLElement}
     */
    this.resultsScrollContainer_ = null;

    // checks if the implementation can create GeosearchByCoordinates Control
    if (M.utils.isUndefined(GeosearchByCoordinatesImpl)) {
      M.Exception('La implementación usada no puede crear controles GeosearchByCoordinates');
    }

    // name for this control
    this.name = GeosearchByCoordinatesControl.NAME;
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @public
   * @function
   * @param {*} obj - Object to compare
   * @returns {boolean} equals - Returns if they are equal or not
   * @api stable
   */
  equals(obj) {
    let equals = false;
    if (obj instanceof GeosearchByCoordinatesControl) {
      equals = (this.name === obj.name);
    }
    return equals;
  }

  /**
   * This function creates the view to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map - Facade map
   * @returns {Promise} HTML template
   * @api stable
   */
  createView(map) {
    this.facadeMap_ = map;
    this.facadeMap_.on(M.evt.CLICK, (evt) => {
      if (this.activate_ === true) {
        const pointGeom = new ol.geom.Point(evt.coord);
        const format = new ol.format.WKT();
        const coorTrans = format.writeGeometry(pointGeom);
        this.searchFrom(coorTrans, evt.coord);
        this.element_.classList.add(GeosearchControl.SEARCHING_CLASS);
        this.element_.classList.remove('ready');
        this.activated = false;
        this.activate_ = false;
      }
    });

    const template = M.template.compileSync(GeosearchByCoordinatesHTML, {
      jsonp: true,
    });

    const btnShowList = template.querySelector('button#m-geosearchbycoordinates-button-list');
    btnShowList.onclick = this.showList_.bind(this);
    this.createImagesCache(template);
    return template;
  }

  /**
   * This function creates the images cache
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stabletrue
   */
  createImagesCache(html) {
    const container = html.getElementsByClassName('img-cache-loader')[0];

    const urls = [
      '/img/m-pin-24.svg',
      '/img/m-pin-24-new.svg',
      '/img/m-pin-24-sel.svg',
    ];

    urls.forEach((url) => {
      const img = new Image();
      img.src = M.utils.concatUrlPaths([M.config.THEME_URL, url]);
      img.width = '24';
      img.height = '24';
      img.crossOrigin = 'anonymous';
      container.append(img);
    });
  }

  /**
   * This function returns the HTML control button
   *
   * @public
   * @function
   * @param {HTMLElement} html to add the plugin
   * @api stable
   * @export
   */
  getActivationButton(element) {
    return element.querySelector('button#m-geosearchbycoordinates-button');
  }

  /**
   * This function enables search
   *
   * @public
   * @function
   * @api stable
   */
  activate() {
    this.activate_ = true;
    this.element_.classList.add('ready');
  }

  /**
   * This feature disables the search and delete the contents displayed by this control
   * @public
   * @function
   * @api stable
   */
  deactivate() {
    this.thereIsSearch = false;
    this.activate_ = false;
    this.element_.classList.remove('activated');
    this.element_.classList.remove('ready');
    this.getImpl().clear();
    this.getImpl().removeResultsContainer(this.resultsContainer_);
    this.getImpl().deactivate();
  }

  /**
   * This function draws the location on the map
   * @param {array} coor - Location coordinates
   * @private
   * @function
   */
  drawLocation_(coor) {
    this.getImpl().drawLocation(coor);
  }

  /**
   * This function performs search
   *
   * @param {string} coorTrans - Formatted coordinates with WKT
   * @param {array} coor - Coordinates
   * @private
   * @function
   */
  searchFrom(coorTrans, coor) {
    let searchUrl = null;
    searchUrl = M.utils.addParameters(this.searchUrl_, {
      wt: 'json',
      pt: coorTrans,
      q: '*:*',
      start: 0,
      d: this.distance_,
      spatialField: this.spatialField_,
      rows: this.rows_,
      srs: this.map_.getProjection().code,
    });

    this.searchTime_ = Date.now();
    /* uses closure to keep the search time and it checks
     if the response is about the last executed search */
    ((searchTime) => {
      M.remote.get(searchUrl).then((response) => {
        // if searchTime was updated by this promise then this is the last
        if (searchTime === this.searchTime_) {
          let results;
          try {
            results = JSON.parse(response.text);
          } catch (err) {
            M.Exception(`La respuesta no es un JSON válido:${err}`);
          }
          this.getImpl().removeResultsContainer(this.resultsContainer_);
          this.showResults_(results);
          this.drawLocation_(coor);
          this.zoomToResultsAll_();
          this.activationBtn_.classList.remove(GeosearchControl.HIDDEN_RESULTS_CLASS);
          this.element_.classList.remove(GeosearchControl.SEARCHING_CLASS);
        }
      });
    })(this.searchTime_);
  }

  /**
   * This function zooms results
   *
   * @private
   * @function
   */
  zoomToResultsAll_() {
    this.getImpl().zoomToResultsAll();
  }

  /**
   * This function clear map. draw results and adds a button click event to show list
   *
   * @private
   * @function
   * @param {object} results - Query results
   */
  showResults_(results) {
    // clears the layer
    this.getImpl().clear();

    this.results = results;
    this.showList = true;
    this.thereIsSearch = true;

    // draws the results on the map
    this.drawResults(results);
  }

  /**
   * This function adds a button click event to show list
   *
   * @private
   * @function
   */
  showList_() {
    if (this.thereIsSearch) {
      if (this.showList === true) {
        const resultsTemplateVars = this.parseResultsForTemplate_(this.results);
        const options = { jsonp: true, vars: resultsTemplateVars };
        const html = M.template.compileSync(GeosearchByCoordinatesresultsHTML, options);

        this.draggable_ = new Draggabilly(html, {
          containment: '.m-mapea-container',
          handle: '.m-geosearchbycoordinates-results-panel .title',
        });
        this.draggable_.enable();
        html.style.position = 'absolute';

        this.resultsContainer_ = html;
        this.resultsScrollContainer_ = this.resultsContainer_.querySelector('div#m-geosearchbycoordinates-results-scroll');
        M.utils.enableTouchScroll(this.resultsScrollContainer_);
        this.getImpl().addResultsContainer(this.resultsContainer_);
        const resultsHtmlElements = this.resultsContainer_.getElementsByClassName('result');
        for (let i = 0, ilen = resultsHtmlElements.length; i < ilen; i += 1) {
          const resultHtml = resultsHtmlElements.item(i);
          resultHtml.addEventListener('click', (evt) => {
            this.resultClick_(evt);
            this.getImpl().removeResultsContainer(this.resultsContainer_);
            this.showList = true;
          });
        }
        const btnCloseList = html.querySelector('.title > button.m-panel-btn');
        btnCloseList.addEventListener('click', this.showList_.bind(this));
        this.showList = false;
      } else {
        this.getImpl().removeResultsContainer(this.resultsContainer_);
        this.showList = true;
      }
    } else {
      M.dialog.info('No se ha realizado ninguna búsqueda.', 'Sin información');
    }
  }

  /**
   * This function add/remove 'hidden' class
   *
   * @private
   * @function
   * @param {goog.events.BrowserEvent} evt - Keypress event
   */
  resultsClick_(evt) {
    this.resultsContainer_.classList.toggle(GeosearchControl.HIDDEN_RESULTS_CLASS);
  }
}

/**
 * Name of this control
 *
 * @const
 * @type {string}
 * @public
 * @api
 */
GeosearchByCoordinatesControl.NAME = 'geosearchbycoordinates';

/**
 * Hidden class
 *
 * @const
 * @type {string}
 * @public
 * @api
 */
GeosearchByCoordinatesControl.HIDDEN = 'hidden';

/**
 * Template for this controls
 *
 * @const
 * @type {string}
 * @public
 * @api stable
 */

GeosearchByCoordinatesControl.TEMPLATE = 'geosearchbycoordinates.html';

/**
 * Template for show results
 * @const
 * @type {string}
 * @public
 * @api stable
 */
GeosearchByCoordinatesControl.RESULTS_TEMPLATE = 'GeosearchByCoordinatesresults.html';
