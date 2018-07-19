import WFSImpl from 'impl/ol/js/layer/WFS';
import Utils from '../util/Utils';
import Exception from '../exception/exception';
import Vector from './Vector';
import LayerType from './Type';
import * as parameter from '../parameter/parameter';
import Geom from '../geom/Geom';

export default class WFS extends Vector {
  /**
   * @classdesc
   * Main constructor of the class. Creates a WFS layer
   * with parameters specified by the user
   *
   * @constructor
   * @extends {M.layer.Vector}
   * @param {string|Mx.parameters.WFS} userParameters parameters
   * @param {Mx.parameters.LayerOptions} options provided by the user
   * @api stable
   */
  constructor(userParameters, options = {}, impl = new WFSImpl(options)) {
    // This layer is of parameters.
    const parameters = parameter.layer(userParameters, LayerType.WFS);

    // calls the super constructor
    super(parameters, options, impl);

    // checks if the implementation can create WFS layers
    if (Utils.isUndefined(WFSImpl)) {
      Exception('La implementación usada no puede crear capas WFS');
    }

    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(userParameters)) {
      Exception('No ha especificado ningún parámetro');
    }

    // namespace
    this.namespace = parameters.namespace;

    // legend
    this.legend = parameters.legend;

    // cql
    this.cql = parameters.cql;

    // geometry
    this.geometry = parameters.geometry;

    // ids
    this.ids = parameters.ids;

    // version
    this.version = parameters.version;

    // options
    this.options = options;
  }

  /**
   * 'type' This property indicates if
   * the layer was selected
   */
  static get type() {
    return LayerType.WFS;
  }

  static set type(newType) {
    if (!Utils.isUndefined(newType) && !Utils.isNullOrEmpty(newType) &&
      (newType !== LayerType.WFS)) {
      Exception('El tipo de capa debe ser \''.concat(LayerType.WFS).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
    }
  }

  /**
   * 'namespace' the layer name
   */
  get namespace() {
    return this.getImpl().namespace;
  }

  set namespace(newNamespace) {
    this.getImpl().namespace = newNamespace;
  }
  /**
   * 'legend' the layer name
   */
  get legend() {
    return this.getImpl().legend;
  }

  set legend(newLegend) {
    if (Utils.isNullOrEmpty(newLegend)) {
      this.getImpl().legend = this.name;
    }
    else {
      this.getImpl().legend = newLegend;
    }
  }

  /**
   * 'cql' the layer name
   */
  get cql() {
    return this.getImpl().cql;
  }

  set cql(newCQL) {
    this.getImpl().cql = newCQL;
  }

  /**
   * 'geometry' the layer name
   */
  get geometry() {
    return this.getImpl().geometry;
  }

  set geometry(newGeometry) {
    if (!Utils.isNullOrEmpty(newGeometry)) {
      const parsedGeom = Geom.parse(newGeometry);
      if (Utils.isNullOrEmpty(parsedGeom)) {
        Exception(`El tipo de capa WFS <b>${newGeometry}</b> no se reconoce. Los tipos disponibles son: POINT, LINE, POLYGON, MPOINT, MLINE, MPOLYGON`);
      }
      this.getImpl().geometry = parsedGeom;
    }
  }

  /**
   * 'ids' the layer name
   */
  get ids() {
    return this.getImpl().ids;
  }

  set ids(newIds) {
    if (Utils.isNullOrEmpty(newIds)) {
      this.getImpl().ids = this.ids;
    }
    else {
      this.getImpl().ids = newIds;
    }
  }

  /**
   * 'version' the layer name
   */
  get version() {
    return this.getImpl().version;
  }

  set version(newVersion) {
    if (!Utils.isNullOrEmpty(newVersion)) {
      this.getImpl().version = newVersion;
    }
    else {
      this.getImpl().version = '1.0.0'; // default value
    }
  }
  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api stable
   */
  setCQL(newCQLparam) {
    let newCQL = newCQLparam;
    this.getImpl().describeFeatureType().then((describeFeatureType) => {
      if (!Utils.isNullOrEmpty(newCQL)) {
        const geometryName = describeFeatureType.geometryName;
        // if exist, replace {{geometryName}} with the value geometryName
        newCQL = newCQL.replace(/{{geometryName}}/g, geometryName);
      }
      if (this.getImpl().cql !== newCQL) {
        this.getImpl().setCQL(newCQL);
      }
    });
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

    if (obj instanceof WFS) {
      equals = (this.url === obj.url);
      equals = equals && (this.namespace === obj.namespace);
      equals = equals && (this.name === obj.name);
      equals = equals && (this.ids === obj.ids);
      equals = equals && (this.cql === obj.cql);
      equals = equals && (this.version === obj.version);
    }

    return equals;
  }
}

/**
 * Style options by default for this layer
 * @const
 * @type {object}
 * @public
 * @api stable
 */
WFS.DEFAULT_OPTIONS_STYLE = {
  fill: {
    color: 'rgba(103, 175, 19, 0.2)',
    opacity: 0.4,
  },
  stroke: {
    color: '#67af13',
    width: 1,
  },
  radius: 5,
};
