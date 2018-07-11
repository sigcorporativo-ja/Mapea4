import WFSTBase from "./wfstcontrolbase";
import EventsManager from "facade/js/event/Eventsmanager";
import Utils from "facade/js/utils/Utils";
import Geom from "facade/js/geom/Geom";
import ControlImpl from "impl/ol/js/controls/Controlbase";
import Dialog from "facade/js/Dialog";
import Template from "facade/js/utils/Template";
import FEditattribute from "../../../facade/js/editattribute";
import Popup from "facade/js/popup";
import Remote from "facade/js/utils/Remote";
import WFSImpl from "impl/ol/js/layers/WFS";


/**
 * @namespace M.impl.control
 */
export default class EditAttribute extends ControlImpl {
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
    this.layer_.on(EventsManager.SELECT_FEATURES, this.showEditPopup_, this);
    this.layer_.on(EventsManager.UNSELECT_FEATURES, this.unselectFeature_, this);
  }

  /**
   * This function deactivate control
   *
   * @public
   * @function
   * @api stable
   */
  deactivate() {
    this.layer_.un(EventsManager.SELECT_FEATURES, this.showEditPopup_, this);
    this.layer_.un(EventsManager.UNSELECT_FEATURES, this.unselectFeature_, this);
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
    let coordinate = evt.coord;

    // avoid editing new features
    if (Utils.isNullOrEmpty(this.editFeature.getId())) {
      this.editFeature = null;
      Dialog.info('Debe guardar el elemento previamente');
    } else {
      this.editFeature.setStyle(EditAttribute.SELECTED_STYLE);

      let templateVar = {
        'properties': []
      };
      Object.keys(this.editFeature.getProperties()).filter(propName => {
        return (propName !== 'geometry');
      }).forEach(propName => {
        templateVar.properties.push({
          'key': propName,
          'value': this.editFeature.get(propName),
          // 'type': p.localType
        });
      }, this);
      Template.compile(FEditattribute.TEMPLATE_POPUP, {
        'jsonp': true,
        'vars': templateVar,
        'parseToHtml': false
      }).then(htmlAsText => {
        let popupContent = {
          'icon': 'g-cartografia-texto',
          'title': FEditattribute.POPUP_TITLE,
          'content': htmlAsText
        };
        this.popup_ = this.facadeMap_.getPopup();
        if (!Utils.isNullOrEmpty(this.popup_)) {
          let hasExternalContent = this.popup_.getTabs().some(function (tab) {
            return (tab['title'] !== FEditattribute.POPUP_TITLE);
          });
          if (!hasExternalContent) {
            this.facadeMap_.removePopup();
            this.popup_ = new Popup();
            this.popup_.addTab(popupContent);
            this.facadeMap_.addPopup(this.popup_, coordinate);
          } else {
            this.popup_.addTab(popupContent);
          }
        } else {
          this.popup_ = new Popup();
          this.popup_.addTab(popupContent);
          this.facadeMap_.addPopup(this.popup_, coordinate);
        }

        // adds save button events on show
        this.popup_.on(EventsManager.SHOW, function () {
          let popupButton = this.popup_.getContent().querySelector('button#m-button-editattributeSave');
          if (!Utils.isNullOrEmpty(popupButton)) {
            popupButton.addEventListener("click", this.saveAttributes_);
          }
        }, this);

        // removes events on destroy
        this.popup_.on(EventsManager.DESTROY, function () {
          let popupButton = this.popup_.getContent().querySelector('button#m-button-editattributeSave');
          if (!Utils.isNullOrEmpty(popupButton)) {
            popupButton.removeEventListener("click", this.saveAttributes_);
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

    //JGL 20163105: para evitar que se envié en la petición WFST el bbox
    this.editFeature.unset("bbox", true);
    //
    // add class css
    let popupContentHtml = this.popup_.getContent();
    let popupButton = evt.target;
    let featureProps = this.editFeature.getProperties();


    popupButton.classList.add('m-savefeature-saving');

    // updates the properties from the inputs
    // with key of property as id
    Object.keys(featureProps).forEach(p => {
      let inputPopup = popupContentHtml.querySelector('input#' + p);
      if (inputPopup !== null) {
        let value = popupContentHtml.querySelector('input#' + p).value;
        this.editFeature.set(p, value, true);
      }
    }, this);

    this.layer_.getImpl().getDescribeFeatureType().then(function (describeFeatureType) {
      let editFeatureGeomName = this.editFeature.getGeometryName();
      let editFeatureGeom = this.editFeature.getGeometry();
      this.editFeature.setGeometryName(describeFeatureType.geometryName);
      this.editFeature.setGeometry(editFeatureGeom);
      this.editFeature.unset(editFeatureGeomName);

      let projectionCode = this.facadeMap_.getProjection().code;
      let formatWFS = new ol.format.WFS();
      let wfstRequestXml = formatWFS.writeTransaction(null, [this.editFeature], null, {
        'featureNS': describeFeatureType.featureNS,
        'featurePrefix': describeFeatureType.featurePrefix,
        'featureType': this.layer_.name,
        'srsName': projectionCode,
        'gmlOptions': {
          'srsName': projectionCode
        }
      })

      let wfstRequestText = wfstRequestXml.serializeToString(doc);

      // closes the popup
      this.facadeMap_.removePopup(this.popup_);
      Remote.post(this.layer_.url, wfstRequestText).then(response => {
        popupButton.classList.remove('m-savefeature-saving');
        if (response.code === 200) {
          Dialog.success('Se ha guardado correctamente el elemento');
        } else {
          Dialog.error('Ha ocurrido un error al guardar: '.concat(response.text));
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
      this.editFeature.setStyle(WFS.STYLE);
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
    super('destroy');
    if (!Utils.isNull(this.facadeMap_) && !Utils.isNull(this.facadeMap_.getPopup())) {
      this.facadeMap_.removePopup();
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
}
