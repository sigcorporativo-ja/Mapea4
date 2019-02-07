import 'plugins/wfstcontrols/facade/assets/css/wfstcontrols';
import DrawFeature from './drawfeature';
import ModifyFeature from './modifyfeature';
import DeleteFeature from './deletefeature';
import ClearFeature from './clearfeature';
import SaveFeature from './savefeature';
import EditAttribute from './editattribute';

/**
 * @classdesc
 * Main facade plugin object. This class creates a plugin
 * object which has an implementation Object
 *
 * @constructor
 * @extends {M.Plugin}
 * @param {array} controls - Array of controls to be added
 * @api stable
 */
export default class WFSTControls extends M.Plugin {
  constructor(controls, layername) {
    super();

    /**
     * Array of controls to be added
     * @private
     * @type {String}
     */

    this.controls = controls;
    /**
     * Array of controls to be added
     * @private
     * @type {String}
     */
    this.controls_ = [];

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
    this.layername_ = layername;

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
    const firstLayer = this.map_.getWFS()[0];
    const firstNamedLayer = this.map_.getWFS({
      name: this.layername_,
    })[0];
    const wfslayer = M.utils.isNullOrEmpty(firstNamedLayer) ? firstLayer : firstNamedLayer;

    if (M.utils.isNullOrEmpty(wfslayer)) {
      M.dialog.error(`Los controles <b>${this.controls.join(',')}</b> no se pueden añadir al mapa porque no existe una capa WFS cargada.`);
    } else {
      let addSave = false;
      let addClear = false;
      for (let i = 0, ilen = this.controls.length; i < ilen; i += 1) {
        if (this.controls[i] === 'drawfeature') {
          this.drawfeature_ = new DrawFeature(wfslayer);
          map.addControls([this.drawfeature_]);
          this.controls_.push(this.drawfeature_);
          addSave = true;
          addClear = true;
        } else if (this.controls[i] === 'modifyfeature') {
          this.modifyfeature_ = new ModifyFeature(wfslayer);
          map.addControls([this.modifyfeature_]);
          this.controls_.push(this.modifyfeature_);
          addSave = true;
          addClear = true;
        } else if (this.controls[i] === 'deletefeature') {
          this.deletefeature_ = new DeleteFeature(wfslayer);
          map.addControls([this.deletefeature_]);
          this.controls_.push(this.deletefeature_);
          addSave = true;
          addClear = true;
        } else if (this.controls[i] === 'editattribute') {
          this.editattibute_ = new EditAttribute(wfslayer);
          map.addControls([this.editattibute_]);
          this.controls_.push(this.editattibute_);
          addClear = true;
        }
      }

      if (addSave) {
        this.savefeature_ = new SaveFeature(wfslayer);
        map.addControls([this.savefeature_]);
        this.controls_.push(this.savefeature_);
      }
      if (addClear) {
        this.clearfeature_ = new ClearFeature(wfslayer);
        map.addControls([this.clearfeature_]);
        this.controls_.push(this.clearfeature_);
      }
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
}

/**
 * Name to identify this plugin
 * @const
 * @type {string}
 * @public
 * @api stable
 */

WFSTControls.NAME = 'wfstcontrols';
