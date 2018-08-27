import SearchstreetPopup from '../../../templates/searchstreetpopup';

/**
 * @namespace M.impl.control
 */
export default class SearchstreetControl extends ol.control.Control {
  /**
   * @classdesc Main constructor of the Searchstreet control.
   *
   * @constructor
   * @extends {ol.control.Control}
   * @api stable
   */
  constructor() {
    super({});

    /**
     * Facade of the map
     *
     * @private
     * @type {M.Map}
     */
    this.facadeMap_ = null;

    /**
     * List of items drawn on the map for control
     *
     * @public
     * @type {array}
     * @api stable
     */
    this.listPoints = [];

    /**
     * HTML template
     *
     * @private
     * @type {HTMLElement}
     */
    this.element_ = null;
  }

  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map - Map to add the plugin
   * @param {HTMLElement} element - Template of this control
   * @api stable
   */
  addTo(map, element) {
    this.facadeMap_ = map;
    this.element_ = element;

    ol.control.Control.call(this, {
      element,
      target: null,
    });
    map.getMapImpl().addControl(this);
  }

  /**
   * This function draw points on the map
   *
   * @public
   * @function
   * @param {array} results - Results query results
   * @api stable
   */
  drawPoints(results) {
    let positionFeature = null;
    for (let i = 0, ilen = results.length; i < ilen; i += 1) {
      positionFeature = new ol.Feature();
      positionFeature.setStyle(new ol.style.Style({
        image: new ol.style.Circle({
          radius: 6,
          fill: new ol.style.Fill({
            color: '#3399CC',
          }),
          stroke: new ol.style.Stroke({
            color: '#fff',
            width: 2,
          }),
        }),
      }));
      positionFeature.setGeometry(results[i].coordinateX !== null &&
        results[i].coordinateY !== null ?
        new ol.geom.Point([results[i].coordinateX, results[i].coordinateY,
        ]) : null);
      const feature = results[i];
      this.addEventClickFeature(feature, positionFeature);

      // this.facadeMap_.drawFeatures([M.impl.Feature.olFeature2Facade(positionFeature)]);
      this.facadeMap_.drawFeatures([new M.Feature(positionFeature.id)]);
      this.listPoints.push([positionFeature]);
    }
    this.zoomResults();
  }

  /**
   * This function zooms results
   *
   * @public
   * @function
   * @api stable
   */
  zoomResults() {
    // let features =
    // this.facadeMap_.getImpl().getDrawLayer().getOL3Layer().getSource().getFeatures();
    const features = this.listPoints[0];
    const bbox = ol.extent.boundingExtent(features
      .filter((feature) => {
        return (!M.utils.isNullOrEmpty(feature.getGeometry()));
      })
      .map((feature) => {
        return feature.getGeometry().getFirstCoordinate();
      }));
    this.facadeMap_.setBbox(bbox);
  }


  /**
   * This function calls the show popup function to display information
   *
   * @public
   * @function
   * @param {object} element - Specific result query response
   * @param {ol.Feature} result - Feature
   * @api stable
   */
  addEventClickFeature(element, result) {
    this.facadeMap_.removePopup();
    const this2 = this;
    if (M.utils.isNullOrEmpty(result)) {
      this.showPopup(element, false);
      this.facadeMap_.setBbox([element.coordinateX,
        element.coordinateY, element.coordinateX, element.coordinateY]);
    } else if (result instanceof ol.Feature) {
      result.set('vendor', {
        mapea: {
          click(evt) {
            this2.showPopup(element, false);
          },
        },
      });
    }
  }

  /**
   * This function show popup with information
   *
   * @private
   * @function
   * @param {object} feature - Specific result query response
   * @param {boolean} noPanMapIfOutOfView
   */
  showPopup(feature, noPanMapIfOutOfView) {
    const options = {
      jsonp: true,
      vars: {
        tVia: feature.streetType,
        nVia: feature.streetName,
        num: feature.streetNumber,
        mun: feature.localityName,
        prov: feature.cityName,
      },
      parseToHtml: false,
    };
    const htmlAsText = M.template.compile(SearchstreetPopup, options);
    const popupContent = {
      icon: 'g-cartografia-zoom',
      title: 'Searchstreet',
      content: htmlAsText,
    };

    this.popup_ = this.facadeMap_.getPopup();
    if (!M.utils.isNullOrEmpty(this.popup_)) {
      const hasExternalContent = this.popup_.getTabs().some((tab) => {
        return (tab.title !== 'Searchstreet');
      });
      if (!hasExternalContent) {
        this.facadeMap_.removePopup();
        if (M.utils.isUndefined(noPanMapIfOutOfView)) {
          this.popup_ = new M.Popup();
        } else {
          this.popup_ = new M.Popup({
            panMapIfOutOfView: noPanMapIfOutOfView,
          });
        }
        this.popup_.addTab(popupContent);
        this.facadeMap_.addPopup(this.popup_, [feature.coordinateX, feature.coordinateY]);
      } else {
        this.popup_.addTab(popupContent);
      }
    } else {
      if (M.utils.isUndefined(noPanMapIfOutOfView)) {
        this.popup_ = new M.Popup();
      } else {
        this.popup_ = new M.Popup({
          panMapIfOutOfView: noPanMapIfOutOfView,
        });
      }
      this.popup_.addTab(popupContent);
      this.facadeMap_.addPopup(this.popup_, [feature.coordinateX, feature.coordinateY]);
    }
  }

  /**
   * This function return HTML template
   *
   * @public
   * @function
   * @api stable
   * @returns {HTMLElement} HTML template
   */
  getElement() {
    return this.element_;
  }


  /**
   * This function remove the points drawn on the map
   *
   * @private
   * @function
   */
  removePoints() {
    for (let i = 0, ilen = this.listPoints.length; i < ilen; i += 1) {
      // this.facadeMap_.removeFeatures(this.listPoints[i].map(M.impl.Feature.olFeature2Facade));
      this.facadeMap_.removeFeatures(this.listPoints[i].map(M.Feature));
    }
    this.listPoints = [];
  }


  /**
   * This function destroys this control and clearing the HTML
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.facadeMap_.areasContainer.getElementsByClassName('m-top m-right')[0].classList.remove('top-extra');
    this.removePoints();
    this.facadeMap_.getMapImpl().removeControl(this);
    this.facadeMap_.getImpl().removePopup();
    this.facadeMap_ = null;
    this.listPoints = null;
    this.element_ = null;
  }
}

/**
 * Template for popup
 *
 * @const
 * @type {string}
 * @public
 * @api stable
 */

SearchstreetControl.POPUP_TEMPLATE = 'searchstreetpopup.html';
