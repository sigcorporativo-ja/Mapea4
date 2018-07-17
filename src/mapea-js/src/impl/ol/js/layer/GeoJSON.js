import Utils from 'facade/js/util/Utils';
import EventsManager from 'facade/js/event/Manager';
import ClusteredFeature from 'facade/js/feature/Clustered';
import Popup from 'facade/js/Popup';
import Template from 'facade/js/util/Template';
import geojsonPopupTemplate from 'templates/geojson_popup';
import GeoJSONFormat from '../format/GeoJSON';
import JSONPLoader from '../loader/JSONP';
import Vector from './Vector';

export default class GeoJSON extends Vector {
  /**
   * @classdesc
   * Main constructor of the class. Creates a KML layer
   * with parameters specified by the user
   *
   * @constructor
   * @implements {M.impl.layer.Vector}
   * @param {Mx.parameters.LayerOptions} options custom options for this layer
   * @api stable
   */
  constructor(parameters, options) {
    // calls the super constructor
    super(options);

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
     * @type {Boolean}
     */
    this.loaded_ = false;

    /**
     *
     * @private
     * @type {Array<String>}
     */
    this.hiddenAttributes_ = [];
    if (!Utils.isNullOrEmpty(options.hide)) {
      this.hiddenAttributes_ = options.hide;
    }

    /**
     *
     * @private
     * @type {Array<String>}
     */
    this.showAttributes_ = [];
    if (!Utils.isNullOrEmpty(options.show)) {
      this.showAttributes_ = options.show;
    }
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.impl.Map} map
   * @api stable
   */
  addTo(map) {
    this.formater_ = new GeoJSONFormat({
      defaultDataProjection: ol.proj.get(map.getProjection().code),
    });
    if (!Utils.isNullOrEmpty(this.url)) {
      this.loader_ = new JSONPLoader(map, this.url, this.formater_);
    }
    super.addTo(map);

    // this.ol3Layer.setStyle(undefined);
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.Map} map
   * @api stable
   */
  refresh(source = null) {
    const features = this.formater_.write(this.facadeVector_.getFeatures());
    const codeProjection = this.map.getProjection().code.split(':')[1];
    let newSource = {
      type: 'FeatureCollection',
      features,
      crs: {
        properties: {
          code: codeProjection,
        },
        type: 'EPSG',
      },
    };
    if (Utils.isObject(source)) {
      newSource = source;
    }
    this.source = newSource;
    this.updateSource_();
  }

  /**
   * This function sets the map object of the layer
   *
   * @public
   * @function
   * @param {M.Map} map
   * @api stable
   */
  setSource(source) {
    this.source = source;
    if (!Utils.isNullOrEmpty(this.map)) {
      this.updateSource_();
    }
  }

  /**
   * This function sets the map object of the layer
   *
   * @private
   * @function
   */
  updateSource_() {
    let srcOptions;
    if (!Utils.isNullOrEmpty(this.url)) {
      srcOptions = {
        format: this.formater_,
        loader: this.loader_.getLoaderFn((features) => {
          this.loaded_ = true;
          this.facadeVector_.addFeatures(features);
          this.fire(EventsManager.LOAD, [features]);
        }),
        strategy: ol.loadingstrategy.all,
      };
      this.ol3Layer.setSource(new ol.source.Vector(srcOptions));
    }
    else if (!Utils.isNullOrEmpty(this.source)) {
      const features = this.formater_.read(this.source, this.map.getProjection());
      this.ol3Layer.setSource(new ol.source.Vector({
        loader: (extent, resolution, projection) => {
          this.loaded_ = true;
          // removes previous features
          this.facadeVector_.clear();
          this.facadeVector_.addFeatures(features);
          this.fire(EventsManager.LOAD, [features]);
        },
      }));
      this.facadeVector_.addFeatures(features);
    }
  }

  /**
   * This function checks if an object is equals
   * to this layer
   * @public
   * @function
   * @param {ol.Feature} feature
   * @api stable
   */
  selectFeatures(features, coord, evt) {
    const feature = features[0];
    if (!(feature instanceof ClusteredFeature) && (this.extract === true)) {
      // unselects previous features
      this.unselectFeatures();

      if (!Utils.isNullOrEmpty(feature)) {
        const clickFn = feature.getAttribute('vendor.mapea.click');
        if (Utils.isFunction(clickFn)) {
          clickFn(evt, feature);
        }
        else {
          const htmlAsText = Template.compile(geojsonPopupTemplate, {
            vars: this.parseFeaturesForTemplate_(features),
            parseToHtml: false,
          });
          const featureTabOpts = {
            icon: 'g-cartografia-pin',
            title: this.name,
            content: htmlAsText,
          };
          let popup = this.map.getPopup();
          if (Utils.isNullOrEmpty(popup)) {
            popup = new Popup();
            popup.addTab(featureTabOpts);
            this.map.addPopup(popup, coord);
          }
          else {
            popup.addTab(featureTabOpts);
          }
        }
      }
    }
  }

  /**
   * This function checks if an object is equals
   * to this control
   *
   * @private
   * @function
   */
  parseFeaturesForTemplate_(features) {
    const featuresTemplate = {
      features: [],
    };

    features.forEach((feature) => {
      if (!(feature instanceof ClusteredFeature)) {
        const properties = feature.getAttributes();
        const propertyKeys = Object.keys(properties);
        const attributes = [];
        propertyKeys.forEach((key) => {
          let addAttribute = true;
          // adds the attribute just if it is not in
          // hiddenAttributes_ or it is in showAttributes_
          if (!Utils.isNullOrEmpty(this.showAttributes_)) {
            addAttribute = Utils.includes(this.showAttributes_, key);
          }
          else if (!Utils.isNullOrEmpty(this.hiddenAttributes_)) {
            addAttribute = !Utils.includes(this.hiddenAttributes_, key);
          }
          if (addAttribute) {
            attributes.push({
              key: Utils.beautifyAttributeName(key),
              value: properties[key],
            });
          }
        });
        const featureTemplate = {
          id: feature.getId(),
          attributes,
        };
        featuresTemplate.features.push(featureTemplate);
      }
    });
    return featuresTemplate;
  }

  // /**
  //  * This function destroys this layer, cleaning the HTML
  //  * and unregistering all events
  //  *
  //  * @public
  //  * @function
  //  * @api stable
  //  */
  // destroy () {
  //   let olMap = this.map.getMapImpl();
  //
  //   if (!Utils.isNullOrEmpty(this.ol3Layer)) {
  //     olMap.removeLayer(this.ol3Layer);
  //     this.ol3Layer = null;
  //   }
  //   this.options = null;
  //   this.map = null;
  // };

  /**
   * TODO
   * @function
   * @api stable
   */
  isLoaded() {
    return this.loaded_;
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api stable
   */
  equals(obj) {
    let equals = false;

    if (obj instanceof GeoJSON) {
      equals = equals && (this.name === obj.name);
      equals = equals && (this.extract === obj.extract);
    }
    return equals;
  }
}
