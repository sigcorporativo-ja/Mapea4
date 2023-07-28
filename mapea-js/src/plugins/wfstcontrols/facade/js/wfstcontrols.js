import 'plugins/wfstcontrols/facade/assets/css/wfstcontrols';
import DrawFeature from './drawfeature';
import ModifyFeature from './modifyfeature';
import DeleteFeature from './deletefeature';
import ClearFeature from './clearfeature';
import SaveFeature from './savefeature';
import EditAttribute from './editattribute';
import api from '../../api';

/**
 * @classdesc
 * Main facade plugin object. This class creates a plugin
 * object which has an implementation Object
 *
 * @constructor
 * @extends {M.Plugin}
 * @param {array | string} controls - Array of controls to be added
 * @param {string} layername - Name of the WFS layer
 * @param {string} geometry - Geometry of the WFS layer
 * @api stable
 */
export default class WFSTControls extends M.Plugin {
  constructor(controls, layername, geometry, proxyStatus, proxyDisable) {
    super();

    let controlsfix;
    let layernamefix;
    let geometryfix;
    const proxyfix = {};

    // Parse new controls model to the old one

    if (!controls.length || !Array.isArray(controls)) {
      layernamefix = controls.layername;
      controlsfix = controls.features.split(',');
      geometryfix = controls.geometry;
      proxyfix.status = controls.proxy ? controls.proxy.status === true || controls.proxy.status === 'true' : true;
      proxyfix.disable = controls.proxy ? controls.proxy.disable === true || controls.proxy.disable === 'true' : true;
    } else {
      layernamefix = layername;
      controlsfix = controls;
      geometryfix = geometry;
      proxyfix.status = proxyStatus;
      proxyfix.disable = proxyDisable;
    }

    /**
     * Array of controls to be added
     * @private
     * @type {String}
     */

    this.controls = controlsfix;
    /**
     * Array of controls to be added
     * @private
     * @type {String}
     */
    this.controls_ = [];

    /**
     * Geometry of the layer
     * @private
     * @type {String}
     */

    this.geometry = geometryfix;

    /**
     * Name of this control
     * @public
     * @type {string}
     * @api stable
     */
    this.name = WFSTControls.NAME;

    /**
     * Layer
     * @private
     * @type {String}
     */
    this.layername_ = layernamefix;

    /**
     * Proxy config
     * @private
     * @type {boolean}
     */

    this.proxy = proxyfix;

    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.map_ = null;

    /**
     * Implementation of this object
     * @private
     * @type {Object}
     */
    this.drawfeature_ = null;

    /**
     * Implementation of this object
     * @private
     * @type {Object}
     */
    this.modifyfeature_ = null;

    /**
     * Implementation of this object
     * @private
     * @type {Object}
     */
    this.deletefeature_ = null;

    /**
     * Implementation of this object
     * @private
     * @type {Object}
     */
    this.clearfeature_ = null;

    /**
     * Implementation of this object
     * @private
     * @type {Object}
     */
    this.savefeature_ = null;

    /**
     * Implementation of this object
     * @private
     * @type {Object}
     */
    this.editattibute_ = null;

    /**
     * Metadata from api.json
     * @private
     * @type {Object}
     */
    this.metadata_ = api.metadata;

    /**
     * Number controls
     * @private
     * @type {Object}
     */
    this.numControls_ = 0;

    /**
     * Number load controls
     * @private
     * @type {Object}
     */
    this.numLoadControls_ = 0;
  }

  /**
   * This function provides the implementation
   * of the object
   *
   * @public
   * @function
   * @param {Object} map - Map to add the plugin
   * @api stable
   */
  addTo(map) {
    this.map_ = map;
    window.mapjs = this.map_;
    const firstLayer = this.map_.getWFS()[0];
    const firstNamedLayer = this.map_.getWFS({
      name: this.layername_,
    })[0];
    const wfslayer = M.utils.isNullOrEmpty(firstNamedLayer) ? firstLayer : firstNamedLayer;

    if (!this.geometry) {
      let geomChanged = false;

      const tryParseGeometry = () => {
        if (!M.utils.isNullOrEmpty(wfslayer) &&
          !wfslayer.geometry &&
          wfslayer.getFeatures &&
          wfslayer.getFeatures().length > 0) {
          const reemplazos = {
            MultiPolygon: 'MPOLYGON',
            MultiPPoint: 'MPOINT',
          };

          const geom = wfslayer.getGeometryType();

          wfslayer.geometry = geom.replace(geom, reemplazos[geom]);
          return true;
        }
        return false;
      };

      geomChanged = tryParseGeometry();

      wfslayer.on(M.evt.LOAD, () => {
        if (!geomChanged) {
          tryParseGeometry();
        }
      });
    } else {
      wfslayer.geometry = this.geometry;
    }

    this.panel_ = new M.ui.Panel('edit', {
      collapsible: true,
      className: 'm-edition',
      collapsedButtonClass: 'g-cartografia-editar',
      position: M.ui.position.TL,
      tooltip: 'Herramientas de edición',
    });
    if (M.utils.isNullOrEmpty(wfslayer)) {
      M.dialog.error(`Los controles <b>${this.controls.join(',')}</b> no se pueden añadir al mapa porque no existe una capa WFS cargada.`);
    } else {
      let addSave = false;
      let addClear = false;
      for (let i = 0, ilen = this.controls.length; i < ilen; i += 1) {
        if (this.controls[i] === 'drawfeature') {
          this.drawfeature_ = new DrawFeature(wfslayer);
          this.controls_.push(this.drawfeature_);
          addSave = true;
          addClear = true;
          this.numControls_ += 1;
          this.drawfeature_.on(M.evt.ADDED_TO_MAP, () => {
            this.checkAddControlsToMap();
          });
        } else if (this.controls[i] === 'modifyfeature') {
          this.modifyfeature_ = new ModifyFeature(wfslayer);
          this.controls_.push(this.modifyfeature_);
          addSave = true;
          addClear = true;
          this.numControls_ += 1;
          this.modifyfeature_.on(M.evt.ADDED_TO_MAP, () => {
            this.checkAddControlsToMap();
          });
        } else if (this.controls[i] === 'deletefeature') {
          this.deletefeature_ = new DeleteFeature(wfslayer);
          this.controls_.push(this.deletefeature_);
          addSave = true;
          addClear = true;
          this.numControls_ += 1;
          this.deletefeature_.on(M.evt.ADDED_TO_MAP, () => {
            this.checkAddControlsToMap();
          });
        } else if (this.controls[i] === 'editattribute') {
          this.editattibute_ = new EditAttribute(wfslayer);
          this.controls_.push(this.editattibute_);
          addClear = true;
          this.numControls_ += 1;
          this.editattibute_.on(M.evt.ADDED_TO_MAP, () => {
            this.checkAddControlsToMap();
          });
        }
      }

      if (addSave) {
        this.savefeature_ = new SaveFeature(wfslayer, this.proxy);
        this.controls_.push(this.savefeature_);
        this.numControls_ += 1;
        this.savefeature_.on(M.evt.ADDED_TO_MAP, () => {
          this.checkAddControlsToMap();
        });
      }
      if (addClear) {
        this.clearfeature_ = new ClearFeature(wfslayer);
        this.controls_.push(this.clearfeature_);
        this.numControls_ += 1;
        this.clearfeature_.on(M.evt.ADDED_TO_MAP, () => {
          this.checkAddControlsToMap();
        });
      }

      this.panel_.addControls(this.controls_);
      this.map_.addPanels(this.panel_);
      this.map_.panel.EDITION = this.panel_;
    }
  }

  /**
   * This function return the control of plugin
   *
   * @public
   * @function
   * @api stable
   */
  getControls() {
    return this.controls_;
  }

  /**
   * This function return the geometry provided
   *
   * @public
   * @function
   * @api stable
   */
  getGeometry() {
    return this.geometry;
  }

  /**
   * This function destroys this plugin
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.map_.removeControls([
      this.drawfeature_,
      this.modifyfeature_,
      this.deletefeature_,
      this.clearfeature_,
      this.savefeature_,
      this.editattibute_,
    ]);
    this.controls = null;
    this.map_ = null;
    this.drawfeature_ = null;
    this.modifyfeature_ = null;
    this.deletefeature_ = null;
    this.clearfeature_ = null;
    this.savefeature_ = null;
    this.editattibute_ = null;
  }

  /**
   * This function set layer
   *
   * @public
   * @function
   * @param {M.layer.WFS} layer - Layer
   * @api stable
   */
  setLayer(layername) {
    this.layername_ = layername;
    const wfslayer = this.map_.getWFS({
      name: this.layername_,
    })[0];
    if (M.utils.isNullOrEmpty(wfslayer)) {
      M.dialog.error(`Los capa <b>${layername}</b> no es una capa WFS cargada.`);
    } else {
      const objControls = [];
      if (!M.utils.isNullOrEmpty(this.drawfeature_)) objControls.push(this.drawfeature_);
      if (!M.utils.isNullOrEmpty(this.modifyfeature_)) objControls.push(this.modifyfeature_);
      if (!M.utils.isNullOrEmpty(this.deletefeature_)) objControls.push(this.deletefeature_);
      if (!M.utils.isNullOrEmpty(this.clearfeature_)) objControls.push(this.clearfeature_);
      if (!M.utils.isNullOrEmpty(this.savefeature_)) objControls.push(this.savefeature_);
      if (!M.utils.isNullOrEmpty(this.editattibute_)) objControls.push(this.editattibute_);

      // let ctrlActivo = null;
      // objControls.forEach(function (ctrl){if (ctrl.activated) ctrlActivo = ctrl});
      this.clearfeature_.getImpl().clear();
      objControls.forEach(ctrl => ctrl.setLayer(wfslayer));
      // if(ctrl===ctrlActivo){ ctrl.activate();} //JGL: TODO no funciona
    }
  }

  /**
   * This function compare if pluging recieved by param is instance of M.plugin.WFSTControls
   *
   * @public
   * @function
   * @param {M.plugin} plugin to comapre
   * @api stable
   */

  equals(plugin) {
    if (plugin instanceof WFSTControls) {
      return true;
    }
    return false;
  }


  /**
   * Gets the parameter api rest of the plugin
   *
   * @public
   * @function
   * @api
   */
  getAPIRest() {
    return `wfstcontrols=${this.controls.join(',')}`;
  }

  /**
   * This function gets metadata plugin
   *
   * @public
   * @function
   * @api stable
   */
  getMetadata() {
    return this.metadata_;
  }

  /**
   * This function return the control of plugin
   *
   * @public
   * @function
   * @api stable
   */
  checkAddControlsToMap() {
    this.numLoadControls_ += 1;
    if (this.numLoadControls_ === this.numControls_) {
      this.fire(M.evt.ADDED_TO_MAP);
    }
  }
}

/**
 * Name to identify this plugin
 * @const
 * @type {string}
 * @public
 * @api stable
 */
WFSTControls.NAME = 'wfstcontrols';
