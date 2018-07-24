import Utils from "facade/js/util/Utils";
import ImplMap from "../Map";
import FacadeOSM from "facade/js/layer/OSM";
import FacadeMapbox from "facade/js/layer/Mapbox";
import EnvolvedExtent from "../util/EnvolvedExtent";
import Layer from "./Layer";
import LayerType from "facade/js/layer/Type";
import Config from 'configuration';

export default class Mapbox extends Layer {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WMS layer
   * with parameters specified by the user
   *
   * @constructor
   * @implements {M.impl.Layer}
   * @param {Mx.parameters.LayerOptions} options custom options for this layer
   * @api stable
   */
  constructor(userParameters, options) {

    // calls the super constructor
    super(options);

    /**
     * Layer resolutions
     * @private
     * @type {Array<Number>}
     */
    this.resolutions_ = null;

    //Añadir plugin attributions
    this.hasAttributtion = false;

    //Tiene alguna capa que necesite el attributions
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
        if (!Utils.isNullOrEmpty(this.ol3Layer)) {
          this.ol3Layer.setVisible(visibility);
        }

        // updates resolutions and keep the bbox
        const oldBbox = this.map.getBbox();
        this.map.getImpl().updateResolutionsFromBaseLayer();
        if (!Utils.isNullOrEmpty(oldBbox)) {
          this.map.setBbox(oldBbox);
        }
      }
      else if (!Utils.isNullOrEmpty(this.ol3Layer)) {
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

    this.ol3Layer = new ol.layer.Tile({
      source: new ol.source.XYZ({
        url: `${this.url}${this.name}/{z}/{x}/{y}.png?${Config.MAPBOX_TOKEN_NAME}=${this.accessToken}`,
      }),
    });

    this.map.getMapImpl().addLayer(this.ol3Layer);

    this.map.getMapImpl().getControls().getArray().forEach(cont => {
      if (cont instanceof ol.control.Attribution) {
        this.hasAttributtion = true;
      }
    });
    if (!this.hasAttributtion) {
      this.map.getMapImpl().addControl(new ol.control.Attribution({
        className: 'ol-attribution ol-unselectable ol-control ol-collapsed m-attribution'
      }));
      this.hasAttributtion = false;
    }

    // recalculate resolutions
    this.map.getMapImpl().updateSize();
    this.resolutions_ = Utils.generateResolutionsFromExtent(this.getExtent(), this.map.getMapImpl().getSize(), 16, this.map.getProjection().units);

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
    let animated = ((this.transparent === false) || (this.options.animated === true));
    this.ol3Layer.set("animated", animated);
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

    if (!Utils.isNullOrEmpty(this.ol3Layer)) {
      // gets the extent
      let promise = new Promise((success, fail) => {
        // gets the extent
        let extent = this.map.getMaxExtent();
        if (!Utils.isNullOrEmpty(extent)) {
          success.call(this, extent);
        }
        else {
          EnvolvedExtent.calculate(this.map, this).then(success);
        }
      });
      // resolve the promise
      promise.then((extent) => {
        let olExtent;
        if (Utils.isArray(extent)) {
          olExtent = extent;
        }
        else {
          olExtent = [extent.x.min, extent.y.min, extent.x.max, extent.y.max];
        }
        const newSource = new ol.source.XYZ({
          url: `${this.url}${this.name}/{z}/{x}/{y}.png?${Config.MAPBOX_TOKEN_NAME}=${this.accessToken}`,
          // tileGrid: new ol.tilegrid.TileGrid({
          //   resolutions,
          //   extent: olExtent,
          //   origin: ol.extent.getBottomLeft(olExtent)
          // }),
          extent: olExtent,
          resolutions,
          attributionControl: true
        });
        this.ol3Layer.setSource(newSource);
      });
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
    if (!Utils.isNullOrEmpty(this.ol3Layer)) {
      extent = ol.proj.get(this.map.getProjection().code).getExtent();
    }
    return {
      "x": {
        "min": extent[0],
        "max": extent[2]
      },
      "y": {
        "min": extent[1],
        "max": extent[3]
      }
    };
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
    let olMap = this.map.getMapImpl();
    if (!Utils.isNullOrEmpty(this.ol3Layer)) {
      olMap.removeLayer(this.ol3Layer);
      this.ol3Layer = null;
    }

    this.map.getLayers().forEach(layer => {
      if (layer instanceof FacadeMapbox || layer instanceof FacadeOSM) {
        this.haveOSMorMapboxLayer = true;
      }
    });

    if (!this.haveOSMorMapboxLayer) {
      this.map.getImpl().getMapImpl().getControls().getArray().forEach(data => {
        if (data instanceof ol.control.Attribution) {
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
