import FDrawFeature from '../../../facade/js/drawfeature';
import FModifyFeature from '../../../facade/js/modifyfeature';
import FDeleteFeature from '../../../facade/js/deletefeature';
import FClearFeature from '../../../facade/js/clearfeature';

/**
 * @namespace M.impl.control
 */
export default class SaveFeature extends M.impl.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a Savefeature
   * control
   *
   * @constructor
   * @param {M.layer.WFS} layer - Layer for use in control
   * @extends {M.impl.Control}
   * @api stable
   */
  constructor(layer, proxy) {
    super();
    /**
     * Layer for use in control
     * @private
     * @type {M.layer.WFS}
     */
    this.layer_ = layer;
    this.proxy_ = proxy;
  }

  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map - Map to add the plugin
   * @param {HTMLElement} element - Container SaveFeature
   * @api stable
   */
  addTo(map, element) {
    this.facadeMap_ = map;
    super.addTo(map, element);
    this.mapjs_ = map;
  }

  /**
   * This function saves changes
   *
   * @public
   * @function
   * @api stable
   */
  saveFeature() {
    if (this.proxy_) {
      if (this.proxy_.disable) {
        M.proxy(false);
      }
    }
    const layerImpl = this.layer_.getImpl();
    layerImpl.getDescribeFeatureType().then((describeFeatureType) => {
      let saveFeaturesDraw = null;
      let saveFeaturesModify = null;
      let saveFeaturesDelete = null;

      const drawfeatureCtrl = this.facadeMap_.getControls(FDrawFeature.NAME)[0];
      if (!M.utils.isNullOrEmpty(drawfeatureCtrl)) {
        saveFeaturesDraw = drawfeatureCtrl.getImpl().modifiedFeatures;
        saveFeaturesDraw = saveFeaturesDraw.filter(featureAux => !featureAux.toDelete);
        SaveFeature.applyDescribeFeatureType.bind(this)(saveFeaturesDraw, describeFeatureType);
      }
      const modifyfeatureCtrl = this.facadeMap_.getControls(FModifyFeature.NAME)[0];
      if (!M.utils.isNullOrEmpty(modifyfeatureCtrl)) {
        saveFeaturesModify = modifyfeatureCtrl.getImpl().modifiedFeatures;
        SaveFeature.applyDescribeFeatureType.bind(this)(saveFeaturesModify, describeFeatureType);
      }
      const deletefeatureCtrl = this.facadeMap_.getControls(FDeleteFeature.NAME)[0];
      if (!M.utils.isNullOrEmpty(deletefeatureCtrl)) {
        saveFeaturesDelete = deletefeatureCtrl.getImpl().modifiedFeatures;
        SaveFeature.applyDescribeFeatureType.bind(this)(saveFeaturesDelete, describeFeatureType);
      }
      // JGL 20163105: para evitar que se envié en la petición WFST el bbox
      if (!M.utils.isNullOrEmpty(saveFeaturesModify)) {
        saveFeaturesModify.forEach((feature) => {
          feature.unset('bbox');
        });
      }
      if (!M.utils.isNullOrEmpty(saveFeaturesDraw)) {
        saveFeaturesDraw.forEach((feature) => {
          feature.unset('bbox');
        });
      }

      let projectionCode = this.facadeMap_.getProjection().code;
      if (projectionCode === 'EPSG:4326') {
        projectionCode = 'CRS:84';
      }

      // Setup formatter
      const formatWFS = new ol.format.WFS();

      // Array of transactions to execute
      const transactionsToExec = [formatWFS
        .writeTransaction(saveFeaturesDraw, undefined, undefined, {
          featureNS: describeFeatureType.featureNS,
          featurePrefix: describeFeatureType.featurePrefix,
          featureType: this.layer_.name,
          srsName: projectionCode,
          gmlOptions: {
            srsName: projectionCode,
          },
        }), formatWFS.writeTransaction(undefined, saveFeaturesModify, undefined, {
        featureNS: describeFeatureType.featureNS,
        featurePrefix: describeFeatureType.featurePrefix,
        featureType: this.layer_.name,
        srsName: projectionCode,
        gmlOptions: {
          srsName: projectionCode,
        },
      }), formatWFS.writeTransaction(undefined, undefined, saveFeaturesDelete, {
        featureNS: describeFeatureType.featureNS,
        featurePrefix: describeFeatureType.featurePrefix,
        featureType: this.layer_.name,
        srsName: projectionCode,
        gmlOptions: {
          srsName: projectionCode,
        },
      })];

      // Function to sleep synchronously
      const sleep = (ms) => {
        const start = new Date().getTime();
        const expire = start + ms;
        while (new Date().getTime() < expire) {
          /* empty */
        }
      };

      // For each transaction
      transactionsToExec.forEach((transactionToExec) => {
        // If it is blank, return
        if (transactionToExec.innerHTML === '') return;
        const oSerializer = new XMLSerializer();
        const wfstRequestText = oSerializer.serializeToString(transactionToExec);

        const fixurl = M.config.ticket
          ? `${this.layer_.url}&ticket=${this.mapjs_.getTicket()}`
          : this.layer_.url
        M.remote.post(fixurl, wfstRequestText).then((response) => {
          // clears layer
          const clearCtrl = this.facadeMap_.getControls(FClearFeature.NAME)[0];
          clearCtrl.getImpl().clear();
          if (response.code === 200 && response.text.indexOf('ExceptionText') === -1 && response.text.indexOf('<error><descripcion>') === -1) {
            M.dialog.success('Se ha guardado correctamente');
          } else if (response.code === 401) {
            M.dialog.error('Ha ocurrido un error al guardar: Usuario no autorizado');
          } else {
            M.dialog.error('Ha ocurrido un error al guardar: '.concat(response.text));
          }
        });

        // sleep to let geoserver refresh itself
        sleep(200);
      });
      if (this.proxy_) {
        if (this.proxy_.status) {
          M.proxy(true);
        }
      }
    });
  }

  /**
   * This function destroys this control and cleaning the HTML
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.layer_ = null;
    this.facadeMap_.getMapImpl().removeControl(this);
  }


  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  static applyDescribeFeatureType(features, describeFeatureType) {
    const layerImpl = this.layer_.getImpl();

    features.forEach((feature) => {
      // sets geometry name
      const editFeatureGeomName = feature.getGeometryName();
      const editFeatureGeom = feature.getGeometry();
      feature.set(describeFeatureType.geometryName, editFeatureGeom);
      feature.setGeometryName(describeFeatureType.geometryName);
      feature.setGeometry(editFeatureGeom);
      if (editFeatureGeomName !== describeFeatureType.geometryName) {
        feature.unset(editFeatureGeomName);
      }
      // sets default values
      if (!M.utils.isNullOrEmpty(describeFeatureType) &&
        M.utils.isArray(describeFeatureType.properties)) {
        describeFeatureType.properties.forEach((property) => {
          if (!M.utils.isGeometryType(property.localType)) {
            const valueToAdd = feature
              .getProperties()[property.name] || layerImpl.getDefaultValue(property.localType);
            feature.set(property.name, valueToAdd);
          }
        });
      }
    });
  }

  /**
   * @public
   * @function
   * @api stable
   */
  setLayer(layer) {
    this.layer_ = layer;
  }
}
