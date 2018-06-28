import Utils from('../utils/utils.js');
import Exception from('../exception/exception.js');
import LayerBase from('./layerbase.js');
import Vector from('./vector.js');
import WFSImpl from('../../../impl/js/layers/wfs.js');
import LayerType from('./layertype.js');
import Layer from('../parameters/layers.js');
import Geom from('../geom/geom.js');

export class WFS extends Vector {
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
    // calls the super constructor
    super(this, parameters, options, impl);

    // checks if the implementation can create WFS layers
    if (Utils.isUndefined(WFSImpl)) {
      Exception('La implementación usada no puede crear capas WFS');
    }

    // checks if the param is null or empty
    if (Utils.isNullOrEmpty(userParameters)) {
      Exception('No ha especificado ningún parámetro');
    }

    //This layer is of parameters.
    let parameters = Layer(userParameters, LayerType.WFS);


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
  get type() {
    return LayerType.WFS;
  }

  set type(newType) {
    if (!Utils.isUndefined(newType) && !Utils.isNullOrEmpty(newType) && (newType !== LayerType.WFS)) {
      Exception('El tipo de capa debe ser \''.concat(LayerType.WFS).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
    }
  }

  /**
   * 'namespace' the layer name
   */
  get namespace() {
    return this.impl().namespace;
  }

  set namespace(newNamespace) {
    this.impl().namespace = newNamespace;
  }
  /**
   * 'legend' the layer name
   */
  get legend() {
    return this.impl().legend;
  }

  set legend(newLegend) {
    if (Utils.isNullOrEmpty(newLegend)) {
      this.impl().legend = this.name;
    } else {
      this.impl().legend = newLegend;
    }
  }

  /**
   * 'cql' the layer name
   */
  get cql() {
    return this.impl().cql;
  }

  set cql(newCQL) {
    this.impl().cql = newCQL;
  }

  /**
   * 'geometry' the layer name
   */
  get geometry() {
    return this.impl().geometry;
  }

  set geometry(newGeometry) {
    if (!Utils.isNullOrEmpty(newGeometry)) {
      var parsedGeom = Geom.parse(newGeometry);
      if (Utils.isNullOrEmpty(parsedGeom)) {
        Exception('El tipo de capa WFS <b>' + newGeometry + '</b> no se reconoce. Los tipos disponibles son: POINT, LINE, POLYGON, MPOINT, MLINE, MPOLYGON');
      }
      this.impl().geometry = parsedGeom;
    }
  }

  /**
   * 'ids' the layer name
   */
  get ids() {
    return this.impl().ids;
  }

  set ids(newIds) {
    if (Utils.isNullOrEmpty(newIds)) {
      this.impl().ids = this.ids;
    } else {
      this.impl().ids = newIds;
    }
  }

  /**
   * 'version' the layer name
   */
  get version() {
    return this.impl().version;
  }

  set version(newVersion) {
    if (!Utils.isNullOrEmpty(newVersion)) {
      this.impl().version = newVersion;
    } else {
      this.impl().version = '1.0.0'; // default value
    }
  }
  /**
   * This function checks if an object is equals
   * to this layer
   *
   * @function
   * @api stable
   */
  set CQL(newCQL) {
    this.impl().describeFeatureType().then((describeFeatureType) => {
      if (!Utils.isNullOrEmpty(newCQL)) {
        let geometryName = describeFeatureType.geometryName;
        // if exist, replace {{geometryName}} with the value geometryName
        newCQL = newCQL.replace(/{{geometryName}}/g, geometryName);
      }
      if (this.impl().cql !== newCQL) {
        this.impl().setCQL(newCQL);
      }
    }.bind(this));
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
      opacity: 0.4
    },
    stroke: {
      color: '#67af13',
      width: 1
    },
    radius: 5
  };
}
