/**
 * @fileoverview Custom exports file.
 * @suppress {checkVars}
 */

goog.require('P.impl.plugin.CountLayers');
goog.require('P.plugin.CountLayers');


goog.exportSymbol(
    'M.impl.plugin.CountLayers',
    M.impl.plugin.CountLayers);

goog.exportProperty(
    M.impl.plugin.CountLayers.prototype,
    'addTo',
    M.impl.plugin.CountLayers.prototype.addTo);

goog.exportSymbol(
    'M.plugin.CountLayers',
    M.plugin.CountLayers);

goog.exportProperty(
    M.plugin.CountLayers.prototype,
    'addTo',
    M.plugin.CountLayers.prototype.addTo);
