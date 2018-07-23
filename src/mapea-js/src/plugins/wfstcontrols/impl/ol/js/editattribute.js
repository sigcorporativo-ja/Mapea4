import FEditattribute from '../../../facade/js/editattribute';

/**
 * @namespace M.impl.control
 */
export default class EditAttribute extends M.impl.control {
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
  constructor(layer) {
    super();

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
  }

  /**
   * This function active control
   *
   * @public
   * @function
   * @api stable
   */
  activate() {
    this.layer_.on(M.evt.SELECT_FEATURES, this.showEditPopup_, this);
    this.layer_.on(M.evt.UNSELECT_FEATURES, this.unselectFeature_, this);
  }

  /**
   * This function deactivate control
   *
   * @public
   * @function
   * @api stable
   */
  deactivate() {
    this.layer_.un(M.evt.SELECT_FEATURES, this.showEditPopup_, this);
    this.layer_.un(M.evt.UNSELECT_FEATURES, this.unselectFeature_, this);
  }

  /**
   * This function displays the popup to edit attributes
   *
   * @private
   * @function
   * @param {ol.Feature} features - Feature to edit attributes
   * @param {array} coordinate - Coordinated to show popup
   */
  showEditPopup_(features, evt) {
    this.unselectFeature_();

    this.editFeature = features[0].getImpl().getOLFeature();
    const coordinate = evt.coord;

    // avoid editing new features
    if (M.utils.isNullOrEmpty(this.editFeature.getId())) {
      this.editFeature = null;
      M.dialog.info('Debe guardar el elemento previamente');
    }
    else {
      this.editFeature.setStyle(EditAttribute.SELECTED_STYLE);

      const templateVar = {
        properties: [],
      };
      Object.keys(this.editFeature.getProperties()).filter((propName) => {
        return (propName !== 'geometry');
      }).forEach((propName) => {
        templateVar.properties.push({
          key: propName,
          value: this.editFeature.get(propName),
          // 'type': p.localType
        });
      }, this);
      M.Template.compile(FEditattribute.TEMPLATE_POPUP, {
        jsonp: true,
        vars: templateVar,
        parseToHtml: false,
      }).then((htmlAsText) => {
        const popupContent = {
          icon: 'g-cartografia-texto',
          title: FEditattribute.POPUP_TITLE,
          content: htmlAsText,
        };
        this.popup_ = this.facadeMap_.getPopup();
        if (!M.utils.isNullOrEmpty(this.popup_)) {
          const hasExternalContent = this.popup_.getTabs().some((tab) => {
            return (tab.title !== FEditattribute.POPUP_TITLE);
          });
          if (!hasExternalContent) {
            this.facadeMap_.removePopup();
            this.popup_ = new M.Popup();
            this.popup_.addTab(popupContent);
            this.facadeMap_.addPopup(this.popup_, coordinate);
          }
          else {
            this.popup_.addTab(popupContent);
          }
        }
        else {
          this.popup_ = new M.Popup();
          this.popup_.addTab(popupContent);
          this.facadeMap_.addPopup(this.popup_, coordinate);
        }

        // adds save button events on show
        this.popup_.on(M.evt.SHOW, () => {
          const popupButton = this.popup_.getContent().querySelector('button#m-button-editattributeSave');
          if (!M.utils.isNullOrEmpty(popupButton)) {
            popupButton.addEventListener('click', this.saveAttributes_);
          }
        }, this);

        // removes events on destroy
        this.popup_.on(M.evt.DESTROY, () => {
          const popupButton = this.popup_.getContent().querySelector('button#m-button-editattributeSave');
          if (!M.utils.isNullOrEmpty(popupButton)) {
            popupButton.removeEventListener('click', this.saveAttributes_);
          }
          this.unselectFeature_();
        }, this);
      });
    }
  }

  /**
   * This function save changes
   *
   * @private
   * @function
   * @param {goog.events.Event} evt - Event click
   * @api stable
   */
  saveAttributes_(evt) {
    // JGL 20163105: para evitar que se envié en la petición WFST el bbox
    this.editFeature.unset('bbox', true);
    //
    // add class css
    const popupContentHtml = this.popup_.getContent();
    const popupButton = evt.target;
    const featureProps = this.editFeature.getProperties();


    popupButton.classList.add('m-savefeature-saving');

    // updates the properties from the inputs
    // with key of property as id
    Object.keys(featureProps).forEach((p) => {
      const inputPopup = popupContentHtml.querySelector(`input#${p}`);
      if (inputPopup !== null) {
        const value = popupContentHtml.querySelector(`input#${p}`).value;
        this.editFeature.set(p, value, true);
      }
    }, this);

    this.layer_.getImpl().getDescribeFeatureType().then((describeFeatureType) => {
      const editFeatureGeomName = this.editFeature.getGeometryName();
      const editFeatureGeom = this.editFeature.getGeometry();
      this.editFeature.setGeometryName(describeFeatureType.geometryName);
      this.editFeature.setGeometry(editFeatureGeom);
      this.editFeature.unset(editFeatureGeomName);

      const projectionCode = this.facadeMap_.getProjection().code;
      const formatWFS = new ol.format.WFS();
      const wfstRequestXml = formatWFS.writeTransaction(null, [this.editFeature], null, {
        featureNS: describeFeatureType.featureNS,
        featurePrefix: describeFeatureType.featurePrefix,
        featureType: this.layer_.name,
        srsName: projectionCode,
        gmlOptions: {
          srsName: projectionCode,
        },
      });

      let doc;
      const wfstRequestText = wfstRequestXml.serializeToString(doc);

      // closes the popup
      this.facadeMap_.removePopup(this.popup_);
      M.Remote.post(this.layer_.url, wfstRequestText).then((response) => {
        popupButton.classList.remove('m-savefeature-saving');
        if (response.code === 200) {
          M.dialog.success('Se ha guardado correctamente el elemento');
        }
        else {
          M.dialog.error('Ha ocurrido un error al guardar: '.concat(response.text));
        }
      });
    });
  }

  /**
   * This function unselect feature and remove popup
   *
   * @public
   * @function
   * @api stable
   */
  unselectFeature_() {
    if (this.editFeature !== null) {
      this.editFeature.setStyle(M.impl.layer.WFS.STYLE);
      this.editFeature = null;
      this.facadeMap_.removePopup();
    }
  }

  /**
   * This function destroys this control and cleaning the HTML
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    super.destroy();
    if (!M.utils.isNull(this.facadeMap_) && !M.utils.isNull(this.facadeMap_.getPopup())) {
      this.facadeMap_.removePopup();
    }
  }
}
/**
 * Style for selected features
 * @const
 * @type {ol.style.Style}
 * @public
 * @api stable
 */
EditAttribute.SELECTED_STYLE = new ol.style.Style({
  fill: new ol.style.Fill({
    color: 'rgba(175, 127, 19, 0.2)',
  }),
  stroke: new ol.style.Stroke({
    color: '#af7f13',
    width: 2,
  }),
  image: new ol.style.Circle({
    radius: 7,
    fill: new ol.style.Fill({
      color: '#af7f13',
    }),
  }),
});
