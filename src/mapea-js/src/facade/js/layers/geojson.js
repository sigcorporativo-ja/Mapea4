import Vector from './vector';
import Utils from '../utils/utils';
import Exception from '../exception/exception';
import GeoJSONImpl from '../../../impl/js/layers/geojson';
import Cluster from '../style/stylecluster';
import LayerType from './layertype';
import Geojson from '../geom/geojson';

export default class GeoJSON extends Vector {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WMS layer
   * with parameters specified by the user
   *
   * @constructor
   * @extends {M.layer.Vector}
   * @param {string|Mx.parameters.GeoJSON} userParameters parameters
   * @param {Mx.parameters.LayerOptions} options provided by the user
   * @api stable
   */
  constructor(parameters, options = {}) {

    let impl = new GeoJSONImpl(parameters, options);

    // calls the super constructor
    super(options, impl);

    // checks if the implementation can create KML layers
    if (Utils.isUndefined(GeoJSONImpl)) {
      Exception('La implementación usada no puede crear capas GeoJSON');
    }

    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(parameters)) {
      Exception('No ha especificado ningún parámetro');
    }

    /**
     * Implementation of this layer
     * @public
     * @type {M.impl.layer.GeoJSON}
     */


    if (Utils.isString(parameters)) {
      this.url = parameters;
    } else if (Utils.isArray(parameters)) {
      this.source = parameters;
    } else {
      // url
      this.url = parameters.url;

      // name
      this.name = parameters.name;

      // source
      this.source = parameters.source;

      // extract
      this.extract = parameters.extract;
      //crs
      if (!Utils.isNullOrEmpty(parameters.crs)) {
        if (Utils.isNullOrEmpty(this.source)) {
          this.source = {
            "type": "FeatureCollection",
            "features": []
          };
        }
        this.source['crs'] = {
          "type": "EPSG",
          "properties": {
            "code": parameters.crs
          }
        };
      }
    }

    if (Utils.isNullOrEmpty(this.extract)) {
      this.extract = true; // by default
    }

    // options
    this.options = options;
  }

  /**
   * 'type' This property indicates if
   * the layer was selected
   */
  getType() {
    return LayerType.GeoJSON;
  }

  setType(newType) {
    if (!Utils.isUndefined(newType) &&
      !Utils.isNullOrEmpty(newType) && (newType !== LayerType.GeoJSON)) {
      Exception('El tipo de capa debe ser \''.concat(LayerType.GeoJSON).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
    }
  }

  /**
   * 'extract' the features properties
   */

  //TODO

  getSource() {
    return this.impl.source;
  }

  setSource(newSource) {
    this.getImpl().source = newSource;
  }


  /**
   * 'extract' the features properties
   */
  getExtract() {
    return this.getImpl().extract;
  }

  setExtract(newExtract) {
    if (!Utils.isNullOrEmpty(newExtract)) {
      if (Utils.isString(newExtract)) {
        this.getImpl().extract = (Utils.normalize(newExtract) === 'true');
      } else {
        this.getImpl().extract = newExtract;
      }
    } else {
      this.getImpl().extract = true;
    }
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
      equals = this.name === obj.name;
      equals = equals && (this.extract === obj.extract);
    }

    return equals;
  }

  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api stable
   */
  setSource(source) {
    this.source = source;
    this.getImpl().refresh(source);
  }

  setStyle(style, applyToFeature = false) {
    let isNullStyle = false;
    if (style === null) {
      isNullStyle = true;
    }
    const applyStyleFn = () => {
      if (Utils.isNullOrEmpty(style)) {
        style = Utils.generateStyleLayer(GeoJSON.DEFAULT_OPTIONS_STYLE, this);
      }
      let isCluster = style instanceof Cluster;
      let isPoint = [Geojson.POINT, Geojson.MULTI_POINT].includes(Utils.getGeometryType(this));
      if (style instanceof Style && (!isCluster || isPoint)) {
        if (!Utils.isNullOrEmpty(this.style_)) {
          this.style_.unapply(this);
        }
        style.apply(this, applyToFeature, isNullStyle);
        this.style_ = style;
      }
      if (!Utils.isNullOrEmpty(this.getImpl().getMap())) {
        let layerswitcher = this.getImpl().getMap().getControls('layerswitcher')[0];
        if (!Utils.isNullOrEmpty(layerswitcher)) {
          layerswitcher.render();
        }
      }
      this.fire(Evt.CHANGE_STYLE, [style, this]);
    };

    if (this.getImpl().isLoaded()) {
      applyStyleFn.bind(this)();
    } else {
      this.once(Evt.LOAD, applyStyleFn, this);
    }
  }

  /**
   * Template for this controls
   * @const
   * @type {string}
   * @public
   * @api stable
   */
  GeoJSON.POPUP_TEMPLATE = 'geojson_popup.html';

  /**
   * Options style by default
   * @const
   * @type {object}
   * @public
   * @api stable
   */
  GeoJSON.DEFAULT_OPTIONS_STYLE = {
    fill: {
      color: 'rgba(255, 255, 255, 0.4)',
      opacity: 0.4
    },
    stroke: {
      color: "#3399CC",
      width: 1.5
    },
    radius: 5,
  };
}
