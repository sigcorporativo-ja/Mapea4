/**
 * @fileoverview Custom exports file.
 * @suppress {checkVars}
 */

goog.require('P.plugin.Autocomplete');


goog.exportSymbol(
    'M.plugin.Autocomplete',
    M.plugin.Autocomplete);

goog.exportProperty(
    M.plugin.Autocomplete.prototype,
    'addTo',
    M.plugin.Autocomplete.prototype.addTo);

goog.exportProperty(
    M.plugin.Autocomplete.prototype,
    'destroy',
    M.plugin.Autocomplete.prototype.destroy);

goog.exportSymbol(
    'M.plugin.Autocomplete.CLASS',
    M.plugin.Autocomplete.CLASS);

goog.exportSymbol(
    'M.plugin.Autocomplete.SEARCHING_CLASS',
    M.plugin.Autocomplete.SEARCHING_CLASS);

goog.exportSymbol(
    'M.plugin.Autocomplete.RESULTAUTOCOMPLETE',
    M.plugin.Autocomplete.RESULTAUTOCOMPLETE);

goog.exportSymbol(
    'M.plugin.Autocomplete.MINIMUM',
    M.plugin.Autocomplete.MINIMUM);
