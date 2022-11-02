/**
 * @module M/layer/WFS
 */
import WFSImpl from 'impl/layer/WFS.js';
import { isUndefined, isNullOrEmpty } from '../util/Utils.js';
import Exception from '../exception/exception.js';
import Vector from './Vector.js';
import * as LayerType from './Type.js';
import * as parameter from '../parameter/parameter.js';
import { parse } from '../geom/Geom.js';
import { getValue } from '../i18n/language.js';

/**
 * @classdesc
 * Main constructor of the class. Creates a WFS layer
 * with parameters specified by the user
 * @api
 */
class WFS extends Vector {
  /**
   * @constructor
   * @extends {M.layer.Vector}
   * @param {string|Mx.parameters.WFS} userParams parameters
   * @param {Mx.parameters.LayerOptions} options provided by the user
   * @param {Object} vendorOpts vendor options for the base library
   * @api
   */
  constructor(userParams, options = {}, vendorOpts = {}, impl = new WFSImpl(options, vendorOpts)) {
    // This layer is of parameters.
    const parameters = parameter.layer(userParams, LayerType.WFS);

    // calls the super constructor
    super(parameters, options, undefined, impl);

    // checks if the implementation can create WFS layers
    if (isUndefined(WFSImpl)) {
      Exception(getValue('exception').wfslayer_method);
    }

    // checks if the param is null or empty
    if (isNullOrEmpty(userParams)) {
      Exception(getValue('exception').no_param);
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

    // extract
    this.extract = parameters.extract;
  }

  /**
   * 'type' This property indicates if
   * the layer was selected
   */
  get type() {
    return LayerType.WFS;
  }

  set type(newType) {
    if (!isUndefined(newType) && !isNullOrEmpty(newType) &&
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
    if (isNullOrEmpty(newLegend)) {
      this.getImpl().legend = this.name;
    } else {
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
    if (!isNullOrEmpty(newGeometry)) {
      const parsedGeom = parse(newGeometry);
      if (isNullOrEmpty(parsedGeom)) {
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
    if (isNullOrEmpty(newIds)) {
      this.getImpl().ids = this.ids;
    } else {
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
    if (!isNullOrEmpty(newVersion)) {
      this.getImpl().version = newVersion;
    } else {
      this.getImpl().version = '1.0.0'; // default value
    }
  }
  /**
   * Sets a CQL string to apply to the layer. A new query will be made to the WFS server.
   * @param {String} cql CQL to apply
   *
   * @function
   * @api
   */
  setCQL(newCQLparam) {
    let newCQL = newCQLparam;
    this.getImpl().getDescribeFeatureType().then((describeFeatureType) => {
      if (!isNullOrEmpty(newCQL)) {
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
   * This function sets a style to the layer
   *
   * @function
   * @public
   * @param {M.Style} style Style to apply
   * @param {bool} [applyToFeature=false] True if set at feature level, false to set at layer level
   */
  setStyle(styleParam, applyToFeature = false, defaultStyle = WFS.DEFAULT_OPTIONS_STYLE) {
    super.setStyle(styleParam, applyToFeature, defaultStyle);
  }


  /**
   * Checks if an object is equal to this layer. Two WFS layers are equal if both of them are
   * WFS instances and have the same namespace, name, id, cql and version.
   *
   * @function
   * @param {Object} obj Object to to compare
   * @return {boolean} True if equal, false otherwise
   * @api
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
      equals = equals && (this.id === obj.id);
    }

    return equals;
  }
}

/**
 * Default params for style vector layers
 * @const
 * @type {object}
 * @public
 * @api
 */
WFS.DEFAULT_PARAMS = {
  fill: {
    color: 'rgba(103, 175, 19, 0.2)',
    opacity: 0.4,
  },
  stroke: {
    color: '#67af13',
    width: 1,
  },
};

/**
 * Default style for WFS layers
 * @const
 * @type {object}
 * @public
 * @api
 */
WFS.DEFAULT_OPTIONS_STYLE = {
  point: {
    ...WFS.DEFAULT_PARAMS,
    radius: 5,
  },
  line: {
    ...WFS.DEFAULT_PARAMS,
  },
  polygon: {
    ...WFS.DEFAULT_PARAMS,
  },
};

export default WFS;
