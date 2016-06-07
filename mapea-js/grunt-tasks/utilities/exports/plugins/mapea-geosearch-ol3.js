/**
 * @fileoverview Custom exports file.
 * @suppress {checkVars}
 */

goog.require('P.control.Geosearch');
goog.require('P.impl.control.Geosearch');
goog.require('P.impl.layer.Geosearch');
goog.require('P.plugin.Geosearch');


goog.exportSymbol(
    'M.plugin.Geosearch',
    M.plugin.Geosearch);

goog.exportProperty(
    M.plugin.Geosearch.prototype,
    'addTo',
    M.plugin.Geosearch.prototype.addTo);

goog.exportProperty(
    M.plugin.Geosearch.prototype,
    'getInput',
    M.plugin.Geosearch.prototype.getInput);

goog.exportProperty(
    M.plugin.Geosearch.prototype,
    'destroy',
    M.plugin.Geosearch.prototype.destroy);

goog.exportSymbol(
    'M.impl.control.Geosearch',
    M.impl.control.Geosearch);

goog.exportProperty(
    M.impl.control.Geosearch.prototype,
    'addTo',
    M.impl.control.Geosearch.prototype.addTo);

goog.exportProperty(
    M.impl.control.Geosearch.prototype,
    'unselectResults',
    M.impl.control.Geosearch.prototype.unselectResults);

goog.exportProperty(
    M.impl.control.Geosearch.prototype,
    'setNewResultsAsDefault',
    M.impl.control.Geosearch.prototype.setNewResultsAsDefault);

goog.exportProperty(
    M.impl.control.Geosearch.prototype,
    'drawResults',
    M.impl.control.Geosearch.prototype.drawResults);

goog.exportProperty(
    M.impl.control.Geosearch.prototype,
    'drawNewResults',
    M.impl.control.Geosearch.prototype.drawNewResults);

goog.exportProperty(
    M.impl.control.Geosearch.prototype,
    'zoomToResults',
    M.impl.control.Geosearch.prototype.zoomToResults);

goog.exportProperty(
    M.impl.control.Geosearch.prototype,
    'getLayer',
    M.impl.control.Geosearch.prototype.getLayer);

goog.exportProperty(
    M.impl.control.Geosearch.prototype,
    'resultClick',
    M.impl.control.Geosearch.prototype.resultClick);

goog.exportProperty(
    M.impl.control.Geosearch.prototype,
    'hideHelp',
    M.impl.control.Geosearch.prototype.hideHelp);

goog.exportProperty(
    M.impl.control.Geosearch.prototype,
    'showHelp',
    M.impl.control.Geosearch.prototype.showHelp);

goog.exportProperty(
    M.impl.control.Geosearch.prototype,
    'clear',
    M.impl.control.Geosearch.prototype.clear);

goog.exportProperty(
    M.impl.control.Geosearch.prototype,
    'destroy',
    M.impl.control.Geosearch.prototype.destroy);

goog.exportSymbol(
    'M.control.Geosearch',
    M.control.Geosearch);

goog.exportProperty(
    M.control.Geosearch.prototype,
    'createView',
    M.control.Geosearch.prototype.createView);

goog.exportProperty(
    M.control.Geosearch.prototype,
    'addEvents',
    M.control.Geosearch.prototype.addEvents);

goog.exportProperty(
    M.control.Geosearch.prototype,
    'drawResults',
    M.control.Geosearch.prototype.drawResults);

goog.exportProperty(
    M.control.Geosearch.prototype,
    'drawNewResults',
    M.control.Geosearch.prototype.drawNewResults);

goog.exportProperty(
    M.control.Geosearch.prototype,
    'zoomToResults',
    M.control.Geosearch.prototype.zoomToResults);

goog.exportProperty(
    M.control.Geosearch.prototype,
    'getInput',
    M.control.Geosearch.prototype.getInput);

goog.exportProperty(
    M.control.Geosearch.prototype,
    'equals',
    M.control.Geosearch.prototype.equals);

goog.exportSymbol(
    'M.control.Geosearch.NAME',
    M.control.Geosearch.NAME);

goog.exportSymbol(
    'M.control.Geosearch.TEMPLATE',
    M.control.Geosearch.TEMPLATE);

goog.exportSymbol(
    'M.control.Geosearch.RESULTS_TEMPLATE',
    M.control.Geosearch.RESULTS_TEMPLATE);

goog.exportSymbol(
    'M.control.Geosearch.HELP_TEMPLATE',
    M.control.Geosearch.HELP_TEMPLATE);

goog.exportSymbol(
    'M.control.Geosearch.SEARCHING_CLASS',
    M.control.Geosearch.SEARCHING_CLASS);

goog.exportSymbol(
    'M.control.Geosearch.HIDDEN_RESULTS_CLASS',
    M.control.Geosearch.HIDDEN_RESULTS_CLASS);

goog.exportSymbol(
    'M.impl.layer.Geosearch',
    M.impl.layer.Geosearch);

goog.exportProperty(
    M.impl.layer.Geosearch.prototype,
    'addTo',
    M.impl.layer.Geosearch.prototype.addTo);

goog.exportProperty(
    M.impl.layer.Geosearch.prototype,
    'drawResults',
    M.impl.layer.Geosearch.prototype.drawResults);

goog.exportProperty(
    M.impl.layer.Geosearch.prototype,
    'drawNewResults',
    M.impl.layer.Geosearch.prototype.drawNewResults);

goog.exportProperty(
    M.impl.layer.Geosearch.prototype,
    'clear',
    M.impl.layer.Geosearch.prototype.clear);

goog.exportProperty(
    M.impl.layer.Geosearch.prototype,
    'selectFeatures',
    M.impl.layer.Geosearch.prototype.selectFeatures);

goog.exportProperty(
    M.impl.layer.Geosearch.prototype,
    'selectFeatureBySolrid',
    M.impl.layer.Geosearch.prototype.selectFeatureBySolrid);

goog.exportProperty(
    M.impl.layer.Geosearch.prototype,
    'unselectFeatures',
    M.impl.layer.Geosearch.prototype.unselectFeatures);

goog.exportProperty(
    M.impl.layer.Geosearch.prototype,
    'setNewResultsAsDefault',
    M.impl.layer.Geosearch.prototype.setNewResultsAsDefault);

goog.exportProperty(
    M.impl.layer.Geosearch.prototype,
    'destroy',
    M.impl.layer.Geosearch.prototype.destroy);

goog.exportProperty(
    M.impl.layer.Geosearch.prototype,
    'equals',
    M.impl.layer.Geosearch.prototype.equals);

goog.exportSymbol(
    'M.impl.layer.Geosearch.POPUP_RESULT',
    M.impl.layer.Geosearch.POPUP_RESULT);
