goog.provide('P.impl.control.SaveFeature');

goog.require('goog.dom.xml');
goog.require('goog.dom.classes');

/**
 * @namespace M.impl.control
 */
(function () {
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
  M.impl.control.SaveFeature = function (layer) {
    /**
     * Layer for use in control
     * @private
     * @type {M.layer.WFS}
     */
    this.layer_ = layer;
  };
  goog.inherits(M.impl.control.SaveFeature, M.impl.Control);

  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map - Map to add the plugin
   * @param {HTMLElement} element - Container SaveFeature
   * @api stable
   */
  M.impl.control.SaveFeature.prototype.addTo = function (map, element) {
    this.facadeMap_ = map;
    goog.base(this, 'addTo', map, element);
  };

  /**
   * This function saves changes
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.control.SaveFeature.prototype.saveFeature = function () {
    var layerImpl = this.layer_.getImpl();
    layerImpl.getDescribeFeatureType().then(function (describeFeatureType) {
      var saveFeaturesDraw = null;
      var saveFeaturesModify = null;
      var saveFeaturesDelete = null;

      var drawfeatureCtrl = this.facadeMap_.getControls(M.control.DrawFeature.NAME)[0];
      if (!M.utils.isNullOrEmpty(drawfeatureCtrl)) {
        saveFeaturesDraw = drawfeatureCtrl.getImpl().modifiedFeatures;
        M.impl.control.SaveFeature.applyDescribeFeatureType.bind(this)(saveFeaturesDraw, describeFeatureType);
      }
      var modifyfeatureCtrl = this.facadeMap_.getControls(M.control.ModifyFeature.NAME)[0];
      if (!M.utils.isNullOrEmpty(modifyfeatureCtrl)) {
        saveFeaturesModify = modifyfeatureCtrl.getImpl().modifiedFeatures;
        M.impl.control.SaveFeature.applyDescribeFeatureType.bind(this)(saveFeaturesModify, describeFeatureType);
      }
      var deletefeatureCtrl = this.facadeMap_.getControls(M.control.DeleteFeature.NAME)[0];
      if (!M.utils.isNullOrEmpty(deletefeatureCtrl)) {
        saveFeaturesDelete = deletefeatureCtrl.getImpl().modifiedFeatures;
        M.impl.control.SaveFeature.applyDescribeFeatureType.bind(this)(saveFeaturesDelete, describeFeatureType);
      }
      //JGL 20163105: para evitar que se envié en la petición WFST el bbox
      if (!M.utils.isNullOrEmpty(saveFeaturesModify)) {
        saveFeaturesModify.forEach(function (feature) {
          feature.unset('bbox');
        });
      }
      if (!M.utils.isNullOrEmpty(saveFeaturesDraw)) {
        saveFeaturesDraw.forEach(function (feature) {
          feature.unset('bbox');
        });
      }

      var projectionCode = this.facadeMap_.getProjection().code;
      var formatWFS = new ol.format.WFS();
      var wfstRequestXml = formatWFS.writeTransaction(saveFeaturesDraw, saveFeaturesModify, saveFeaturesDelete, {
        'featureNS': describeFeatureType.featureNS,
        'featurePrefix': describeFeatureType.featurePrefix,
        'featureType': this.layer_.name,
        'srsName': projectionCode,
        'gmlOptions': {
          'srsName': projectionCode
        }
      });

      var wfstRequestText = goog.dom.xml.serialize(wfstRequestXml);
      M.remote.post(this.layer_.url, wfstRequestText).then(function (response) {
        // clears layer
        let clearCtrl = this.facadeMap_.getControls(M.control.ClearFeature.NAME)[0];
        clearCtrl.getImpl().clear();
        if (response.code === 200 && response.text.indexOf("ExceptionText") === -1 && response.text.indexOf("<error><descripcion>") === -1) {
          M.dialog.success('Se ha guardado correctamente');
        }
        else if (response.code === 401) {
          M.dialog.error('Ha ocurrido un error al guardar: Usuario no autorizado');
        }
        else {
          M.dialog.error('Ha ocurrido un error al guardar: '.concat(response.text));
        }
      }.bind(this));
    }.bind(this));
  };

  /**
   * This function destroys this control and cleaning the HTML
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.control.SaveFeature.prototype.destroy = function () {
    this.layer_ = null;
    this.facadeMap_.getMapImpl().removeControl(this);
  };


  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.control.SaveFeature.applyDescribeFeatureType = function (features, describeFeatureType) {
    var layerImpl = this.layer_.getImpl();

    features.forEach(function (feature) {
      // sets geometry name
      var editFeatureGeomName = feature.getGeometryName();
      var editFeatureGeom = feature.getGeometry();
      feature.set(describeFeatureType.geometryName, editFeatureGeom);
      feature.setGeometryName(describeFeatureType.geometryName);
      feature.setGeometry(editFeatureGeom);
      feature.unset(editFeatureGeomName);

      // sets default values
      describeFeatureType.properties.forEach(function (property) {
        if (!M.utils.isGeometryType(property.localType)) {
          feature.set(property.name, layerImpl.getDefaultValue(property.localType));
        }
      });
    });
  };

})();
