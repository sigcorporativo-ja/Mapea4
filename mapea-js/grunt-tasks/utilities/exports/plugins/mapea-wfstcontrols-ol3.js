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
goog.require('P.plugin.WFSTControls');


goog.exportSymbol(
    'M.control.ClearFeature',
    M.control.ClearFeature);

goog.exportProperty(
    M.control.ClearFeature.prototype,
    'createView',
    M.control.ClearFeature.prototype.createView);

goog.exportProperty(
    M.control.ClearFeature.prototype,
    'equals',
    M.control.ClearFeature.prototype.equals);

goog.exportProperty(
    M.control.ClearFeature.prototype,
    'addEvents',
    M.control.ClearFeature.prototype.addEvents);

goog.exportProperty(
    M.control.ClearFeature.prototype,
    'clear_',
    M.control.ClearFeature.prototype.clear_);

goog.exportSymbol(
    'M.control.ClearFeature.NAME',
    M.control.ClearFeature.NAME);

goog.exportSymbol(
    'M.control.ClearFeature.TEMPLATE',
    M.control.ClearFeature.TEMPLATE);

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
    'M.control.DeleteFeature',
    M.control.DeleteFeature);

goog.exportProperty(
    M.control.DeleteFeature.prototype,
    'createView',
    M.control.DeleteFeature.prototype.createView);

goog.exportProperty(
    M.control.DeleteFeature.prototype,
    'addEvents',
    M.control.DeleteFeature.prototype.addEvents);

goog.exportProperty(
    M.control.DeleteFeature.prototype,
    'activeDelete_',
    M.control.DeleteFeature.prototype.activeDelete_);

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
    'M.impl.control.DeleteFeature',
    M.impl.control.DeleteFeature);

goog.exportProperty(
    M.impl.control.DeleteFeature.prototype,
    'addTo',
    M.impl.control.DeleteFeature.prototype.addTo);

goog.exportProperty(
    M.impl.control.DeleteFeature.prototype,
    'activeDelete',
    M.impl.control.DeleteFeature.prototype.activeDelete);

goog.exportProperty(
    M.impl.control.DeleteFeature.prototype,
    'createInteractionDelete_',
    M.impl.control.DeleteFeature.prototype.createInteractionDelete_);

goog.exportProperty(
    M.impl.control.DeleteFeature.prototype,
    'destroy',
    M.impl.control.DeleteFeature.prototype.destroy);

goog.exportSymbol(
    'M.control.DrawFeature',
    M.control.DrawFeature);

goog.exportProperty(
    M.control.DrawFeature.prototype,
    'createView',
    M.control.DrawFeature.prototype.createView);

goog.exportProperty(
    M.control.DrawFeature.prototype,
    'equals',
    M.control.DrawFeature.prototype.equals);

goog.exportProperty(
    M.control.DrawFeature.prototype,
    'addEvents',
    M.control.DrawFeature.prototype.addEvents);

goog.exportProperty(
    M.control.DrawFeature.prototype,
    'activeDraw_',
    M.control.DrawFeature.prototype.activeDraw_);

goog.exportSymbol(
    'M.control.DrawFeature.NAME',
    M.control.DrawFeature.NAME);

goog.exportSymbol(
    'M.control.DrawFeature.TEMPLATE',
    M.control.DrawFeature.TEMPLATE);

goog.exportSymbol(
    'M.impl.control.DrawFeature',
    M.impl.control.DrawFeature);

goog.exportProperty(
    M.impl.control.DrawFeature.prototype,
    'addTo',
    M.impl.control.DrawFeature.prototype.addTo);

goog.exportProperty(
    M.impl.control.DrawFeature.prototype,
    'activeDraw',
    M.impl.control.DrawFeature.prototype.activeDraw);

goog.exportProperty(
    M.impl.control.DrawFeature.prototype,
    'createInteractionDraw',
    M.impl.control.DrawFeature.prototype.createInteractionDraw);

goog.exportProperty(
    M.impl.control.DrawFeature.prototype,
    'destroy',
    M.impl.control.DrawFeature.prototype.destroy);

goog.exportSymbol(
    'M.control.EditAttribute',
    M.control.EditAttribute);

goog.exportProperty(
    M.control.EditAttribute.prototype,
    'createView',
    M.control.EditAttribute.prototype.createView);

goog.exportProperty(
    M.control.EditAttribute.prototype,
    'addEvents',
    M.control.EditAttribute.prototype.addEvents);

goog.exportProperty(
    M.control.EditAttribute.prototype,
    'edit_',
    M.control.EditAttribute.prototype.edit_);

goog.exportProperty(
    M.control.EditAttribute.prototype,
    'equals',
    M.control.EditAttribute.prototype.equals);

goog.exportSymbol(
    'M.control.EditAttribute.NAME',
    M.control.EditAttribute.NAME);

goog.exportSymbol(
    'M.control.EditAttribute.TEMPLATE',
    M.control.EditAttribute.TEMPLATE);

goog.exportSymbol(
    'M.control.EditAttribute.TEMPLATE_POPUP',
    M.control.EditAttribute.TEMPLATE_POPUP);

goog.exportSymbol(
    'M.impl.control.EditAttribute',
    M.impl.control.EditAttribute);

goog.exportProperty(
    M.impl.control.EditAttribute.prototype,
    'addTo',
    M.impl.control.EditAttribute.prototype.addTo);

goog.exportProperty(
    M.impl.control.EditAttribute.prototype,
    'edit',
    M.impl.control.EditAttribute.prototype.edit);

goog.exportProperty(
    M.impl.control.EditAttribute.prototype,
    'editAtt',
    M.impl.control.EditAttribute.prototype.editAtt);

goog.exportProperty(
    M.impl.control.EditAttribute.prototype,
    'saveAttributes',
    M.impl.control.EditAttribute.prototype.saveAttributes);

goog.exportProperty(
    M.impl.control.EditAttribute.prototype,
    'destroy',
    M.impl.control.EditAttribute.prototype.destroy);

goog.exportSymbol(
    'M.control.ModifyFeature',
    M.control.ModifyFeature);

goog.exportProperty(
    M.control.ModifyFeature.prototype,
    'createView',
    M.control.ModifyFeature.prototype.createView);

goog.exportProperty(
    M.control.ModifyFeature.prototype,
    'addEvents',
    M.control.ModifyFeature.prototype.addEvents);

goog.exportProperty(
    M.control.ModifyFeature.prototype,
    'activeModify_',
    M.control.ModifyFeature.prototype.activeModify_);

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
    'M.impl.control.ModifyFeature',
    M.impl.control.ModifyFeature);

goog.exportProperty(
    M.impl.control.ModifyFeature.prototype,
    'addTo',
    M.impl.control.ModifyFeature.prototype.addTo);

goog.exportProperty(
    M.impl.control.ModifyFeature.prototype,
    'activeModify',
    M.impl.control.ModifyFeature.prototype.activeModify);

goog.exportProperty(
    M.impl.control.ModifyFeature.prototype,
    'createInteractionModify_',
    M.impl.control.ModifyFeature.prototype.createInteractionModify_);

goog.exportProperty(
    M.impl.control.ModifyFeature.prototype,
    'modificar',
    M.impl.control.ModifyFeature.prototype.modificar);

goog.exportProperty(
    M.impl.control.ModifyFeature.prototype,
    'destroy',
    M.impl.control.ModifyFeature.prototype.destroy);

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
    'addEvents',
    M.control.SaveFeature.prototype.addEvents);

goog.exportProperty(
    M.control.SaveFeature.prototype,
    'saveFeature',
    M.control.SaveFeature.prototype.saveFeature);

goog.exportSymbol(
    'M.control.SaveFeature.NAME',
    M.control.SaveFeature.NAME);

goog.exportSymbol(
    'M.control.SaveFeature.TEMPLATE',
    M.control.SaveFeature.TEMPLATE);

goog.exportSymbol(
    'M.impl.control.SaveFeature',
    M.impl.control.SaveFeature);

goog.exportProperty(
    M.impl.control.SaveFeature.prototype,
    'addTo',
    M.impl.control.SaveFeature.prototype.addTo);

goog.exportProperty(
    M.impl.control.SaveFeature.prototype,
    'destroy',
    M.impl.control.SaveFeature.prototype.destroy);

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
