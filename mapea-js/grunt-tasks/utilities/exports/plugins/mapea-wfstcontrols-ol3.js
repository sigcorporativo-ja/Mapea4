/**
 * @fileoverview Custom exports file.
 * @suppress {checkVars}
 */

goog.require('P.control.ClearFeature');
goog.require('P.control.DeleteFeature');
goog.require('P.control.DrawFeature');
goog.require('P.control.EditAttribute');
goog.require('P.control.ModifyFeature');
goog.require('P.control.SaveFeature');
goog.require('P.impl.control.ClearFeature');
goog.require('P.impl.control.DeleteFeature');
goog.require('P.impl.control.DrawFeature');
goog.require('P.impl.control.EditAttribute');
goog.require('P.impl.control.ModifyFeature');
goog.require('P.impl.control.SaveFeature');
goog.require('P.impl.control.WFSTBase');
goog.require('P.plugin.WFSTControls');


goog.exportSymbol(
    'M.impl.control.ClearFeature',
    M.impl.control.ClearFeature);

goog.exportProperty(
    M.impl.control.ClearFeature.prototype,
    'addTo',
    M.impl.control.ClearFeature.prototype.addTo);

goog.exportProperty(
    M.impl.control.ClearFeature.prototype,
    'clear',
    M.impl.control.ClearFeature.prototype.clear);

goog.exportProperty(
    M.impl.control.ClearFeature.prototype,
    'destroy',
    M.impl.control.ClearFeature.prototype.destroy);

goog.exportSymbol(
    'M.control.ClearFeature',
    M.control.ClearFeature);

goog.exportProperty(
    M.control.ClearFeature.prototype,
    'createView',
    M.control.ClearFeature.prototype.createView);

goog.exportProperty(
    M.control.ClearFeature.prototype,
    'manageActivation',
    M.control.ClearFeature.prototype.manageActivation);

goog.exportProperty(
    M.control.ClearFeature.prototype,
    'equals',
    M.control.ClearFeature.prototype.equals);

goog.exportSymbol(
    'M.control.ClearFeature.NAME',
    M.control.ClearFeature.NAME);

goog.exportSymbol(
    'M.control.ClearFeature.TEMPLATE',
    M.control.ClearFeature.TEMPLATE);

goog.exportSymbol(
    'M.impl.control.DeleteFeature',
    M.impl.control.DeleteFeature);

goog.exportProperty(
    M.impl.control.DeleteFeature.prototype,
    'modifiedFeatures',
    M.impl.control.DeleteFeature.prototype.modifiedFeatures);

goog.exportProperty(
    M.impl.control.DeleteFeature.prototype,
    'activate',
    M.impl.control.DeleteFeature.prototype.activate);

goog.exportProperty(
    M.impl.control.DeleteFeature.prototype,
    'deactivate',
    M.impl.control.DeleteFeature.prototype.deactivate);

goog.exportSymbol(
    'M.control.DeleteFeature',
    M.control.DeleteFeature);

goog.exportProperty(
    M.control.DeleteFeature.prototype,
    'createView',
    M.control.DeleteFeature.prototype.createView);

goog.exportProperty(
    M.control.DeleteFeature.prototype,
    'getActivationButton',
    M.control.DeleteFeature.prototype.getActivationButton);

goog.exportProperty(
    M.control.DeleteFeature.prototype,
    'equals',
    M.control.DeleteFeature.prototype.equals);

goog.exportSymbol(
    'M.control.DeleteFeature.NAME',
    M.control.DeleteFeature.NAME);

goog.exportSymbol(
    'M.control.DeleteFeature.TEMPLATE',
    M.control.DeleteFeature.TEMPLATE);

goog.exportSymbol(
    'M.impl.control.DrawFeature',
    M.impl.control.DrawFeature);

goog.exportProperty(
    M.impl.control.DrawFeature.prototype,
    'createInteraction_',
    M.impl.control.DrawFeature.prototype.createInteraction_);

goog.exportSymbol(
    'M.control.DrawFeature',
    M.control.DrawFeature);

goog.exportProperty(
    M.control.DrawFeature.prototype,
    'createView',
    M.control.DrawFeature.prototype.createView);

goog.exportProperty(
    M.control.DrawFeature.prototype,
    'getActivationButton',
    M.control.DrawFeature.prototype.getActivationButton);

goog.exportProperty(
    M.control.DrawFeature.prototype,
    'equals',
    M.control.DrawFeature.prototype.equals);

goog.exportSymbol(
    'M.control.DrawFeature.NAME',
    M.control.DrawFeature.NAME);

goog.exportSymbol(
    'M.control.DrawFeature.TEMPLATE',
    M.control.DrawFeature.TEMPLATE);

goog.exportSymbol(
    'M.impl.control.EditAttribute',
    M.impl.control.EditAttribute);

goog.exportProperty(
    M.impl.control.EditAttribute.prototype,
    'editFeature',
    M.impl.control.EditAttribute.prototype.editFeature);

goog.exportProperty(
    M.impl.control.EditAttribute.prototype,
    'activate',
    M.impl.control.EditAttribute.prototype.activate);

goog.exportProperty(
    M.impl.control.EditAttribute.prototype,
    'deactivate',
    M.impl.control.EditAttribute.prototype.deactivate);

goog.exportProperty(
    M.impl.control.EditAttribute.prototype,
    'saveAttributes_',
    M.impl.control.EditAttribute.prototype.saveAttributes_);

goog.exportProperty(
    M.impl.control.EditAttribute.prototype,
    'unselectFeature_',
    M.impl.control.EditAttribute.prototype.unselectFeature_);

goog.exportProperty(
    M.impl.control.EditAttribute.prototype,
    'destroy',
    M.impl.control.EditAttribute.prototype.destroy);

goog.exportSymbol(
    'M.impl.control.EditAttribute.SELECTED_STYLE',
    M.impl.control.EditAttribute.SELECTED_STYLE);

goog.exportSymbol(
    'M.control.EditAttribute',
    M.control.EditAttribute);

goog.exportProperty(
    M.control.EditAttribute.prototype,
    'createView',
    M.control.EditAttribute.prototype.createView);

goog.exportProperty(
    M.control.EditAttribute.prototype,
    'getActivationButton',
    M.control.EditAttribute.prototype.getActivationButton);

goog.exportProperty(
    M.control.EditAttribute.prototype,
    'equals',
    M.control.EditAttribute.prototype.equals);

goog.exportSymbol(
    'M.control.EditAttribute.NAME',
    M.control.EditAttribute.NAME);

goog.exportSymbol(
    'M.control.EditAttribute.POPUP_TITLE',
    M.control.EditAttribute.POPUP_TITLE);

goog.exportSymbol(
    'M.control.EditAttribute.TEMPLATE',
    M.control.EditAttribute.TEMPLATE);

goog.exportSymbol(
    'M.control.EditAttribute.TEMPLATE_POPUP',
    M.control.EditAttribute.TEMPLATE_POPUP);

goog.exportSymbol(
    'M.impl.control.ModifyFeature',
    M.impl.control.ModifyFeature);

goog.exportProperty(
    M.impl.control.ModifyFeature.prototype,
    'activate',
    M.impl.control.ModifyFeature.prototype.activate);

goog.exportProperty(
    M.impl.control.ModifyFeature.prototype,
    'deactivate',
    M.impl.control.ModifyFeature.prototype.deactivate);

goog.exportProperty(
    M.impl.control.ModifyFeature.prototype,
    'destroy',
    M.impl.control.ModifyFeature.prototype.destroy);

goog.exportSymbol(
    'M.control.ModifyFeature',
    M.control.ModifyFeature);

goog.exportProperty(
    M.control.ModifyFeature.prototype,
    'createView',
    M.control.ModifyFeature.prototype.createView);

goog.exportProperty(
    M.control.ModifyFeature.prototype,
    'getActivationButton',
    M.control.ModifyFeature.prototype.getActivationButton);

goog.exportProperty(
    M.control.ModifyFeature.prototype,
    'equals',
    M.control.ModifyFeature.prototype.equals);

goog.exportSymbol(
    'M.control.ModifyFeature.NAME',
    M.control.ModifyFeature.NAME);

goog.exportSymbol(
    'M.control.ModifyFeature.TEMPLATE',
    M.control.ModifyFeature.TEMPLATE);

goog.exportSymbol(
    'M.impl.control.SaveFeature',
    M.impl.control.SaveFeature);

goog.exportProperty(
    M.impl.control.SaveFeature.prototype,
    'addTo',
    M.impl.control.SaveFeature.prototype.addTo);

goog.exportProperty(
    M.impl.control.SaveFeature.prototype,
    'saveFeature',
    M.impl.control.SaveFeature.prototype.saveFeature);

goog.exportProperty(
    M.impl.control.SaveFeature.prototype,
    'destroy',
    M.impl.control.SaveFeature.prototype.destroy);

goog.exportSymbol(
    'M.control.SaveFeature',
    M.control.SaveFeature);

goog.exportProperty(
    M.control.SaveFeature.prototype,
    'createView',
    M.control.SaveFeature.prototype.createView);

goog.exportProperty(
    M.control.SaveFeature.prototype,
    'equals',
    M.control.SaveFeature.prototype.equals);

goog.exportProperty(
    M.control.SaveFeature.prototype,
    'manageActivation',
    M.control.SaveFeature.prototype.manageActivation);

goog.exportProperty(
    M.control.SaveFeature.prototype,
    'saveFeature_',
    M.control.SaveFeature.prototype.saveFeature_);

goog.exportSymbol(
    'M.control.SaveFeature.NAME',
    M.control.SaveFeature.NAME);

goog.exportSymbol(
    'M.control.SaveFeature.TEMPLATE',
    M.control.SaveFeature.TEMPLATE);

goog.exportSymbol(
    'M.impl.control.WFSTBase',
    M.impl.control.WFSTBase);

goog.exportProperty(
    M.impl.control.WFSTBase.prototype,
    'modifiedFeatures',
    M.impl.control.WFSTBase.prototype.modifiedFeatures);

goog.exportProperty(
    M.impl.control.WFSTBase.prototype,
    'addTo',
    M.impl.control.WFSTBase.prototype.addTo);

goog.exportProperty(
    M.impl.control.WFSTBase.prototype,
    'activate',
    M.impl.control.WFSTBase.prototype.activate);

goog.exportProperty(
    M.impl.control.WFSTBase.prototype,
    'deactivate',
    M.impl.control.WFSTBase.prototype.deactivate);

goog.exportProperty(
    M.impl.control.WFSTBase.prototype,
    'destroy',
    M.impl.control.WFSTBase.prototype.destroy);

goog.exportSymbol(
    'M.plugin.WFSTControls',
    M.plugin.WFSTControls);

goog.exportProperty(
    M.plugin.WFSTControls.prototype,
    'addTo',
    M.plugin.WFSTControls.prototype.addTo);

goog.exportProperty(
    M.plugin.WFSTControls.prototype,
    'destroy',
    M.plugin.WFSTControls.prototype.destroy);
