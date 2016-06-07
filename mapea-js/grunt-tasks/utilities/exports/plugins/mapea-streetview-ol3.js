/**
 * @fileoverview Custom exports file.
 * @suppress {checkVars}
 */

goog.require('P.control.Streetview');
goog.require('P.impl.control.Streetview');
goog.require('P.plugin.Streetview');


goog.exportSymbol(
    'M.plugin.Streetview',
    M.plugin.Streetview);

goog.exportProperty(
    M.plugin.Streetview.prototype,
    'addTo',
    M.plugin.Streetview.prototype.addTo);

goog.exportProperty(
    M.plugin.Streetview.prototype,
    'destroy',
    M.plugin.Streetview.prototype.destroy);

goog.exportSymbol(
    'M.plugin.Streetview.NAME',
    M.plugin.Streetview.NAME);

goog.exportSymbol(
    'M.impl.control.Streetview',
    M.impl.control.Streetview);

goog.exportProperty(
    M.impl.control.Streetview.prototype,
    'openStreetView',
    M.impl.control.Streetview.prototype.openStreetView);

goog.exportProperty(
    M.impl.control.Streetview.prototype,
    'processSVData',
    M.impl.control.Streetview.prototype.processSVData);

goog.exportProperty(
    M.impl.control.Streetview.prototype,
    'destroy',
    M.impl.control.Streetview.prototype.destroy);

goog.exportSymbol(
    'M.control.Streetview',
    M.control.Streetview);

goog.exportProperty(
    M.control.Streetview.prototype,
    'createView',
    M.control.Streetview.prototype.createView);

goog.exportProperty(
    M.control.Streetview.prototype,
    'manageActivation',
    M.control.Streetview.prototype.manageActivation);

goog.exportProperty(
    M.control.Streetview.prototype,
    'closeStreetView',
    M.control.Streetview.prototype.closeStreetView);

goog.exportProperty(
    M.control.Streetview.prototype,
    'equals',
    M.control.Streetview.prototype.equals);

goog.exportProperty(
    M.control.Streetview.prototype,
    'openStreetView',
    M.control.Streetview.prototype.openStreetView);

goog.exportSymbol(
    'M.control.Streetview.NAME',
    M.control.Streetview.NAME);

goog.exportSymbol(
    'M.control.Streetview.TEMPLATE',
    M.control.Streetview.TEMPLATE);

goog.exportSymbol(
    'M.control.Streetview.TEMPLATE_DIALOG',
    M.control.Streetview.TEMPLATE_DIALOG);
