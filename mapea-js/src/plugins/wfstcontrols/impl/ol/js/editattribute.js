goog.provide('P.impl.control.EditAttribute');

goog.require('goog.events');

/**
 * @namespace M.impl.control
 */
(function () {
  /**
   * @classdesc
   * Main constructor of the class. Creates a EditAttribute
   * control
   *
   * @constructor
   * @param {M.layer.WFS} layer - Layer for use in control
   * @extends {M.impl.Control}
   * @api stable
   */
  M.impl.control.EditAttribute = function (layer) {
    /**
     * Layer for use in control
     * @private
     * @type {M.layer.WFS}
     */
    this.layer_ = layer;

    /**
     * Feature selected
     * @public
     * @type {ol.Feature}
     * @api stable
     */
    this.editFeature = null;

    goog.base(this);
  };
  goog.inherits(M.impl.control.EditAttribute, M.impl.Control);

  /**
   * This function active control
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.control.EditAttribute.prototype.activate = function () {
    var layerImpl = this.layer_.getImpl();
    layerImpl.on(M.evt.SELECT_FEATURES, this.showEditPopup_, this);
    layerImpl.on(M.evt.UNSELECT_FEATURES, this.unselectFeature_, this);
  };

  /**
   * This function deactivate control
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.control.EditAttribute.prototype.deactivate = function () {
    var layerImpl = this.layer_.getImpl();
    layerImpl.un(M.evt.SELECT_FEATURES, this.showEditPopup_, this);
    layerImpl.un(M.evt.UNSELECT_FEATURES, this.unselectFeature_, this);
  };

  /**
   * This function displays the popup to edit attributes
   *
   * @private
   * @function
   * @param {ol.Feature} features - Feature to edit attributes
   * @param {array} coordinate - Coordinated to show popup
   */
  M.impl.control.EditAttribute.prototype.showEditPopup_ = function (features, coordinate) {
    this.editFeature = features[0];

    // avoid editing new features
    if (M.utils.isNullOrEmpty(this.editFeature.getId())) {
      this.editFeature = null;
      M.dialog.info('Debe guardar el elemento previamente');
    }
    else {
      this.editFeature.setStyle(M.impl.control.EditAttribute.SELECTED_STYLE);

      var templateVar = {
        'properties': []
      };
      Object.keys(this.editFeature.getProperties()).filter(function (propName) {
        return (propName !== 'geometry');
      }).forEach(function (propName) {
        templateVar.properties.push({
          'key': propName,
          'value': this.editFeature.get(propName),
          // 'type': p.localType
        });
      }, this);
      var this_ = this;
      M.template.compile(M.control.EditAttribute.TEMPLATE_POPUP, {
        'jsonp': true,
        'vars': templateVar,
        'parseToHtml': false
      }).then(function (htmlAsText) {
        var popupContent = {
          'icon': 'g-cartografia-texto',
          'title': M.control.EditAttribute.POPUP_TITLE,
          'content': htmlAsText
        };
        this_.popup_ = this_.facadeMap_.getPopup();
        if (!M.utils.isNullOrEmpty(this_.popup_)) {
          var hasExternalContent = this_.popup_.getTabs().some(function (tab) {
            return (tab['title'] !== M.control.EditAttribute.POPUP_TITLE);
          });
          if (!hasExternalContent) {
            this_.facadeMap_.removePopup();
            this_.popup_ = new M.Popup();
            this_.popup_.addTab(popupContent);
            this_.facadeMap_.addPopup(this_.popup_, coordinate);
          }
          else {
            this_.popup_.addTab(popupContent);
          }
        }
        else {
          this_.popup_ = new M.Popup();
          this_.popup_.addTab(popupContent);
          this_.facadeMap_.addPopup(this_.popup_, coordinate);
        }

        // adds save button events on show
        this_.popup_.on(M.evt.SHOW, function () {
          var popupButton = this.popup_.getContent().querySelector('button#m-button-editattributeSave');
          if (!M.utils.isNullOrEmpty(popupButton)) {
            goog.events.listen(popupButton, goog.events.EventType.CLICK, this.saveAttributes_, false, this);
          }
        }, this_);

        // removes events on destroy
        this_.popup_.on(M.evt.DESTROY, function () {
          var popupButton = this.popup_.getContent().querySelector('button#m-button-editattributeSave');
          if (!M.utils.isNullOrEmpty(popupButton)) {
            goog.events.unlisten(popupButton, goog.events.EventType.CLICK, this.saveAttributes_, false, this);
          }
          this.unselectFeature_();
        }, this_);
      });
    }
  };

  /**
   * This function save changes
   *
   * @private
   * @function
   * @param {goog.events.Event} evt - Event click
   * @api stable
   */
  M.impl.control.EditAttribute.prototype.saveAttributes_ = function (evt) {

    //JGL 20163105: para evitar que se envié en la petición WFST el bbox
    this.editFeature.unset("bbox", true);
    //
    // add class css
    var popupContentHtml = this.popup_.getContent();
    var popupButton = evt.target;
    var featureProps = this.editFeature.getProperties();


    goog.dom.classes.add(popupButton, 'm-savefeature-saving');

    // updates the properties from the inputs
    // with key of property as id
    Object.keys(featureProps).forEach(function (p) {
      var inputPopup = popupContentHtml.querySelector('input#' + p);
      if (inputPopup !== null) {
        var value = popupContentHtml.querySelector('input#' + p).value;
        this.editFeature.set(p, value, true);
      }
    }, this);

    this.layer_.getImpl().getDescribeFeatureType().then(function (describeFeatureType) {
      var editFeatureGeomName = this.editFeature.getGeometryName();
      var editFeatureGeom = this.editFeature.getGeometry();
      this.editFeature.setGeometryName(describeFeatureType.geometryName);
      this.editFeature.setGeometry(editFeatureGeom);
      this.editFeature.unset(editFeatureGeomName);

      var projectionCode = this.facadeMap_.getProjection().code;
      var formatWFS = new ol.format.WFS();
      var wfstRequestXml = formatWFS.writeTransaction(null, [this.editFeature], null, {
        'featureNS': describeFeatureType.featureNS,
        'featurePrefix': describeFeatureType.featurePrefix,
        'featureType': this.layer_.name,
        'srsName': projectionCode,
        'gmlOptions': {
          'srsName': projectionCode
        }
      });
      var wfstRequestText = goog.dom.xml.serialize(wfstRequestXml);

      // closes the popup
      this.facadeMap_.removePopup(this.popup_);
      M.remote.post(this.layer_.url, wfstRequestText).then(function (response) {
        goog.dom.classes.remove(popupButton, 'm-savefeature-saving');
        if (response.code === 200) {
          M.dialog.success('Se ha guardado correctamente el elemento');
        }
        else {
          M.dialog.error('Ha ocurrido un error al guardar: '.concat(response.text));
        }
      });
    }.bind(this));
  };

  /**
   * This function unselect feature and remove popup
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.control.EditAttribute.prototype.unselectFeature_ = function () {
    if (this.editFeature !== null) {
      this.editFeature.setStyle(M.impl.layer.WFS.STYLE);
      this.editFeature = null;
      this.facadeMap_.removePopup();
    }
  };

  /**
   * This function destroys this control and cleaning the HTML
   *
   * @public
   * @function
   * @api stable
   */
  M.impl.control.EditAttribute.prototype.destroy = function () {
    goog.base(this, 'destroy');
    this.facadeMap_.removePopup();
  };


  /**
   * Style for selected features
   * @const
   * @type {ol.style.Style}
   * @public
   * @api stable
   */
  M.impl.control.EditAttribute.SELECTED_STYLE = new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(175, 127, 19, 0.2)'
    }),
    stroke: new ol.style.Stroke({
      color: '#af7f13',
      width: 2
    }),
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({
        color: '#af7f13'
      })
    })
  });
})();
