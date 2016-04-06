/**
 * @fileoverview Custom exports file.
 * @suppress {checkVars}
 */

goog.require('P.control.Geosearchbylocation');
goog.require('P.impl.control.Geosearchbylocation');
goog.require('P.plugin.Geosearchbylocation');


goog.exportSymbol(
    'M.plugin.Geosearchbylocation',
    M.plugin.Geosearchbylocation);

goog.exportProperty(
    M.plugin.Geosearchbylocation.prototype,
    'addTo',
    M.plugin.Geosearchbylocation.prototype.addTo);

goog.exportProperty(
    M.plugin.Geosearchbylocation.prototype,
    'destroy',
    M.plugin.Geosearchbylocation.prototype.destroy);

goog.exportSymbol(
    'M.control.Geosearchbylocation',
    M.control.Geosearchbylocation);

goog.exportProperty(
    M.control.Geosearchbylocation.prototype,
    'equals',
    M.control.Geosearchbylocation.prototype.equals);

goog.exportProperty(
    M.control.Geosearchbylocation.prototype,
    'createView',
    M.control.Geosearchbylocation.prototype.createView);

goog.exportProperty(
    M.control.Geosearchbylocation.prototype,
    'addEvents',
    M.control.Geosearchbylocation.prototype.addEvents);

goog.exportProperty(
    M.control.Geosearchbylocation.prototype,
    'locate',
    M.control.Geosearchbylocation.prototype.locate);

goog.exportSymbol(
    'M.control.Geosearchbylocation.TEMPLATE',
    M.control.Geosearchbylocation.TEMPLATE);

goog.exportSymbol(
    'M.control.Geosearchbylocation.RESULTS_TEMPLATE',
    M.control.Geosearchbylocation.RESULTS_TEMPLATE);

goog.exportSymbol(
    'M.impl.control.Geosearchbylocation',
    M.impl.control.Geosearchbylocation);

goog.exportProperty(
    M.impl.control.Geosearchbylocation.prototype,
    'addTo',
    M.impl.control.Geosearchbylocation.prototype.addTo);

goog.exportProperty(
    M.impl.control.Geosearchbylocation.prototype,
    'setMap',
    M.impl.control.Geosearchbylocation.prototype.setMap);

goog.exportProperty(
    M.impl.control.Geobusquedas.prototype,
    'locate',
    M.impl.control.Geobusquedas.prototype.locate);

goog.exportProperty(
    M.impl.control.Geobusquedas.prototype,
    'removeLocate',
    M.impl.control.Geobusquedas.prototype.removeLocate);

goog.exportProperty(
    M.impl.control.Geosearchbylocation.prototype,
    'drawLocation',
    M.impl.control.Geosearchbylocation.prototype.drawLocation);

goog.exportProperty(
    M.impl.control.Geosearchbylocation.prototype,
    'addResultsContainer',
    M.impl.control.Geosearchbylocation.prototype.addResultsContainer);

goog.exportProperty(
    M.impl.control.Geosearchbylocation.prototype,
    'removeResultsContainer',
    M.impl.control.Geosearchbylocation.prototype.removeResultsContainer);

goog.exportProperty(
    M.impl.control.Geosearchbylocation.prototype,
    'destroy',
    M.impl.control.Geosearchbylocation.prototype.destroy);

goog.exportSymbol(
    'M.impl.control.Geosearchbylocation.POPUP_LOCATION',
    M.impl.control.Geosearchbylocation.POPUP_LOCATION);

goog.exportProperty(
    M.impl.control.Geosearchbylocation.prototype,
    'locate',
    M.impl.control.Geosearchbylocation.prototype.locate);

goog.exportProperty(
    M.impl.control.Geosearchbylocation.prototype,
    'removeLocate',
    M.impl.control.Geosearchbylocation.prototype.removeLocate);
