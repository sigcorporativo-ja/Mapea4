/**
 * @module M/impl/layer/Mapbox
 */
import * as LayerType from 'M/layer/Type';
import FacadeOSM from 'M/layer/OSM';
import FacadeMapbox from 'M/layer/Mapbox';
import { isNullOrEmpty, generateResolutionsFromExtent, extend } from 'M/util/Utils';
import OLLayerTile from 'ol/layer/Tile';
import OLSourceXYZ from 'ol/source/XYZ';
import OLControlAttribution from 'ol/control/Attribution';
import { get as getProj } from 'ol/proj';
import ImplMap from '../Map';
import Layer from './Layer';
/**
 * @classdesc
 * @api
 */
class Mapbox extends Layer {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WMS layer
   * with parameters specified by the user
   *
   * @constructor
   * @implements {M.impl.Layer}
   * @param {Mx.parameters.LayerOptions} options custom options for this layer
   * @param {Object} vendorOptions vendor options for the base library
   * @api stable
   */
  constructor(userParameters, options, vendorOptions) {
    // calls the super constructor
    super(options, vendorOptions);

    /**
     * Layer resolutions
     * @private
     * @type {Array<Number>}
     */
    this.resolutions_ = null;

    /**
     * The facade layer instance
     * @private
     * @type {M.layer.Mapbox}
     * @expose
     */
    this.facadeLayer_ = null;

    // Añadir plugin attributions
    this.hasAttributtion = false;

    // Tiene alguna capa que necesite el attributions
    this.haveOSMorMapboxLayer = false;

    // sets visibility
    if (options.visibility === false) {
      this.visibility = false;
    }

    this.zIndex_ = ImplMap.Z_INDEX[LayerType.Mapbox];
  }

  /**
   * This function sets the visibility of this layer
   *
   * @function
   * @api stable
   */
  setVisible(visibility) {
    this.visibility = visibility;
    if (this.inRange() === true) {
      // if this layer is base then it hides all base layers
      if ((visibility === true) && (this.transparent !== true)) {
        // hides all base layers
        this.map.getBaseLayers().forEach((layer) => {
          if (!layer.equals(this) && layer.isVisible()) {
            layer.setVisible(false);
          }
        });

        // set this layer visible
        if (!isNullOrEmpty(this.ol3Layer)) {
          this.ol3Layer.setVisible(visibility);
        }

        // updates resolutions and keep the bbox
        const oldBbox = this.map.getBbox();
        this.map.getImpl().updateResolutionsFromBaseLayer();
        if (!isNullOrEmpty(oldBbox)) {
          this.map.setBbox(oldBbox);
        }
      } else if (!isNullOrEmpty(this.ol3Layer)) {
        this.ol3Layer.setVisible(visibility);
      }
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
    this.map = map;

    const extent = this.facadeLayer_.getMaxExtent();
    this.ol3Layer = new OLLayerTile(extend({
      source: new OLSourceXYZ({
        url: `${this.url}${this.name}/{z}/{x}/{y}.png?${M.config.MAPBOX_TOKEN_NAME}=${this.accessToken}`,
      }),
      extent,
    }, this.vendorOptions_, true));

    this.map.getMapImpl().addLayer(this.ol3Layer);

    this.map.getMapImpl().getControls().getArray().forEach((cont) => {
      if (cont instanceof OLControlAttribution) {
        this.hasAttributtion = true;
      }
    });
    if (!this.hasAttributtion) {
      let attributionCtrlOptions;
      if (isNullOrEmpty(this.vendorOptions_)) {
        attributionCtrlOptions = {
          className: 'ol-attribution ol-unselectable ol-control ol-collapsed m-attribution',
        };
      }
      this.map.getMapImpl().addControl(new OLControlAttribution(attributionCtrlOptions));
      this.hasAttributtion = false;
    }

    // recalculate resolutions
    this.map.getMapImpl().updateSize();
    const size = this.map.getMapImpl().getSize();
    const units = this.map.getProjection().units;
    this.resolutions_ = generateResolutionsFromExtent(this.getExtent(), size, 16, units);

    // sets its visibility if it is in range
    if (this.isVisible() && !this.inRange()) {
      this.setVisible(false);
    }
    if (this.zIndex_ !== null) {
      this.setZIndex(this.zIndex_);
    }
    // sets the resolutions
    if (this.resolutions_ !== null) {
      this.setResolutions(this.resolutions_);
    }
    // activates animation for base layers or animated parameters
    const animated = ((this.transparent === false) || (this.options.animated === true));
    this.ol3Layer.set('animated', animated);
  }

  /**
   * This function sets the resolutions for this layer
   *
   * @public
   * @function
   * @param {Array<Number>} resolutions
   * @api stable
   */
  setResolutions(resolutions) {
    this.resolutions_ = resolutions;

    if (!isNullOrEmpty(this.ol3Layer) && isNullOrEmpty(this.vendorOptions_.source)) {
      // gets the extent
      const extent = this.facadeLayer_.getMaxExtent();
      const newSource = new OLSourceXYZ({
        url: `${this.url}${this.name}/{z}/{x}/{y}.png?${M.config.MAPBOX_TOKEN_NAME}=${this.accessToken}`,
        extent,
        resolutions,
        attributionControl: true,
      });
      this.ol3Layer.setSource(newSource);
    }
  }

  /**
   * This function gets the envolved extent for
   * this WMS
   *
   * @public
   * @function
   * @api stable
   */
  getExtent() {
    let extent = null;
    if (!isNullOrEmpty(this.ol3Layer)) {
      extent = getProj(this.map.getProjection().code).getExtent();
    }
    return {
      x: {
        min: extent[0],
        max: extent[2],
      },
      y: {
        min: extent[1],
        max: extent[3],
      },
    };
  }

  /**
   * This function set facade class Mapbox
   *
   * @function
   * @param {object} obj - Facade layer
   * @api stable
   */
  setFacadeObj(obj) {
    this.facadeLayer_ = obj;
  }

  /**
   * This function gets the min resolution for
   * this WMS
   *
   * @public
   * @function
   * @api stable
   */
  getMinResolution() {
    return this.resolutions_[0];
  }

  /**
   * This function gets the max resolution for
   * this WMS
   *
   * @public
   * @function
   * @api stable
   */
  getMaxResolution() {
    return this.resolutions_[this.resolutions_.length - 1];
  }

  /**
   * This function destroys this layer, cleaning the HTML
   * and unregistering all events
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    const olMap = this.map.getMapImpl();
    if (!isNullOrEmpty(this.ol3Layer)) {
      olMap.removeLayer(this.ol3Layer);
      this.ol3Layer = null;
    }

    this.map.getLayers().forEach((layer) => {
      if (layer instanceof FacadeMapbox || layer instanceof FacadeOSM) {
        this.haveOSMorMapboxLayer = true;
      }
    });

    if (!this.haveOSMorMapboxLayer) {
      this.map.getImpl().getMapImpl().getControls().getArray()
        .forEach((data) => {
          if (data instanceof OLControlAttribution) {
            this.map.getImpl().getMapImpl().removeControl(data);
          }
        });
    }
    this.map = null;
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

    if (obj instanceof Mapbox) {
      equals = (this.url === obj.url);
      equals = equals && (this.name === obj.name);
    }

    return equals;
  }
}

/**
 * The attribution containing a link to the OpenStreetMap Copyright and License
 * page.
 * @const
 * @type {ol.Attribution}
 * @api
 */
Mapbox.ATTRIBUTION = '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>';

export default Mapbox;
