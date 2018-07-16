import FDrawFeature from "../../../facade/js/drawfeature";
import FModifyFeature from "../../../facade/js/modifyfeature";
import FDeleteFeature from "../../../facade/js/deletefeature";
import FClearFeature from "../../../facade/js/clearfeature";

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
  constructor(layer) {
    /**
     * Layer for use in control
     * @private
     * @type {M.layer.WFS}
     */
    this.layer_ = layer;
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
    super('addTo', map, element);
  }

  /**
   * This function saves changes
   *
   * @public
   * @function
   * @api stable
   */
  saveFeature() {
    let layerImpl = this.layer_.getImpl();
    layerImpl.getDescribeFeatureType().then((describeFeatureType) => {
      let saveFeaturesDraw = null;
      let saveFeaturesModify = null;
      let saveFeaturesDelete = null;

      let drawfeatureCtrl = this.facadeMap_.getControls(FDrawFeature.NAME)[0];
      if (!M.utils.isNullOrEmpty(drawfeatureCtrl)) {
        saveFeaturesDraw = drawfeatureCtrl.getImpl().modifiedFeatures;
        SaveFeature.applyDescribeFeatureType.bind(this)(saveFeaturesDraw, describeFeatureType);
      }
      var modifyfeatureCtrl = this.facadeMap_.getControls(FModifyFeature.NAME)[0];
      if (!M.utils.isNullOrEmpty(modifyfeatureCtrl)) {
        saveFeaturesModify = modifyfeatureCtrl.getImpl().modifiedFeatures;
        SaveFeature.applyDescribeFeatureType.bind(this)(saveFeaturesModify, describeFeatureType);
      }
      var deletefeatureCtrl = this.facadeMap_.getControls(FDeleteFeature.NAME)[0];
      if (!M.utils.isNullOrEmpty(deletefeatureCtrl)) {
        saveFeaturesDelete = deletefeatureCtrl.getImpl().modifiedFeatures;
        SaveFeature.applyDescribeFeatureType.bind(this)(saveFeaturesDelete, describeFeatureType);
      }
      //JGL 20163105: para evitar que se envié en la petición WFST el bbox
      if (!M.utils.isNullOrEmpty(saveFeaturesModify)) {
        saveFeaturesModify.forEach(feature => {
          feature.unset('bbox');
        });
      }
      if (!M.utils.isNullOrEmpty(saveFeaturesDraw)) {
        saveFeaturesDraw.forEach(feature => {
          feature.unset('bbox');
        });
      }

      let projectionCode = this.facadeMap_.getProjection().code;
      let formatWFS = new ol.format.WFS();
      let wfstRequestXml = formatWFS.writeTransaction(saveFeaturesDraw, saveFeaturesModify, saveFeaturesDelete, {
        'featureNS': describeFeatureType.featureNS,
        'featurePrefix': describeFeatureType.featurePrefix,
        'featureType': this.layer_.name,
        'srsName': projectionCode,
        'gmlOptions': {
          'srsName': projectionCode
        }
      });

      var wfstRequestText = goog.dom.xml.serialize(wfstRequestXml);
      M.Remote.post(this.layer_.url, wfstRequestText).then(function (response) {
        // clears layer
        let clearCtrl = this.facadeMap_.getControls(FClearFeature.NAME)[0];
        clearCtrl.getImpl().clear();
        if (response.code === 200 && response.text.indexOf("ExceptionText") === -1 && response.text.indexOf("<error><descripcion>") === -1) {
          M.dialog.success('Se ha guardado correctamente');
        } else if (response.code === 401) {
          M.dialog.error('Ha ocurrido un error al guardar: Usuario no autorizado');
        } else {
          M.dialog.error('Ha ocurrido un error al guardar: '.concat(response.text));
        }
      });
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
  applyDescribeFeatureType(features, describeFeatureType) {
    let layerImpl = this.layer_.getImpl();

    features.forEach(feature => {
      // sets geometry name
      let editFeatureGeomName = feature.getGeometryName();
      let editFeatureGeom = feature.getGeometry();
      feature.set(describeFeatureType.geometryName, editFeatureGeom);
      feature.setGeometryName(describeFeatureType.geometryName);
      feature.setGeometry(editFeatureGeom);
      feature.unset(editFeatureGeomName);

      // sets default values
      describeFeatureType.properties.forEach(property => {
        if (!M.utils.isGeometryType(property.localType)) {
          let valueToAdd = feature.getProperties()[property.name] || layerImpl.getDefaultValue(property.localType);
          feature.set(property.name, valueToAdd);
        }
      });
    });
  }
}
