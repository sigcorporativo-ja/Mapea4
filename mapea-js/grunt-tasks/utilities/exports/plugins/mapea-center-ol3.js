/**
 * @fileoverview Custom exports file.
 * @suppress {checkVars}
 */

goog.require('P.control.Center');
goog.require('P.impl.control.Center');
goog.require('P.plugin.Center');


goog.exportSymbol(
    'M.plugin.Center',
    M.plugin.Center);

goog.exportProperty(
    M.plugin.Center.prototype,
    'addTo',
    M.plugin.Center.prototype.addTo);

goog.exportProperty(
    M.plugin.Center.prototype,
    'destroy',
    M.plugin.Center.prototype.destroy);

goog.exportSymbol(
    'M.impl.control.Center',
    M.impl.control.Center);

goog.exportProperty(
    M.impl.control.Center.prototype,
    'addTo',
    M.impl.control.Center.prototype.addTo);

goog.exportProperty(
    M.impl.control.Center.prototype,
    'onClick',
    M.impl.control.Center.prototype.onClick);

goog.exportProperty(
    M.impl.control.Center.prototype,
    'destroy',
    M.impl.control.Center.prototype.destroy);

goog.exportSymbol(
    'M.control.Center',
    M.control.Center);

goog.exportProperty(
    M.control.Center.prototype,
    'createView',
    M.control.Center.prototype.createView);

goog.exportProperty(
    M.control.Center.prototype,
    'equals',
    M.control.Center.prototype.equals);

goog.exportProperty(
    M.control.Center.prototype,
    'destroy',
    M.control.Center.prototype.destroy);

goog.exportSymbol(
    'M.control.Center.TEMPLATE',
    M.control.Center.TEMPLATE);
