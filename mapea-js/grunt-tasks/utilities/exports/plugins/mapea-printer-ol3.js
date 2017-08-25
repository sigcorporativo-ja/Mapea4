/**
 * @fileoverview Custom exports file.
 * @suppress {checkVars}
 */

goog.require('P.control.Printer');
goog.require('P.impl.control.Printer');
goog.require('P.plugin.Printer');


goog.exportSymbol(
    'M.impl.control.Printer',
    M.impl.control.Printer);

goog.exportProperty(
    M.impl.control.Printer.prototype,
    'addTo',
    M.impl.control.Printer.prototype.addTo);

goog.exportProperty(
    M.impl.control.Printer.prototype,
    'encodeLayer',
    M.impl.control.Printer.prototype.encodeLayer);

goog.exportProperty(
    M.impl.control.Printer.prototype,
    'encodeLegend',
    M.impl.control.Printer.prototype.encodeLegend);

goog.exportProperty(
    M.impl.control.Printer.prototype,
    'encodeKML',
    M.impl.control.Printer.prototype.encodeKML);

goog.exportProperty(
    M.impl.control.Printer.prototype,
    'encodeWMS',
    M.impl.control.Printer.prototype.encodeWMS);

goog.exportProperty(
    M.impl.control.Printer.prototype,
    'encodeWFS',
    M.impl.control.Printer.prototype.encodeWFS);

goog.exportProperty(
    M.impl.control.Printer.prototype,
    'encodeWMTS',
    M.impl.control.Printer.prototype.encodeWMTS);

goog.exportProperty(
    M.impl.control.Printer.prototype,
    'encodeOSM',
    M.impl.control.Printer.prototype.encodeOSM);

goog.exportProperty(
    M.impl.control.Printer.prototype,
    'destroy',
    M.impl.control.Printer.prototype.destroy);

goog.exportSymbol(
    'M.plugin.Printer',
    M.plugin.Printer);

goog.exportProperty(
    M.plugin.Printer.prototype,
    'addTo',
    M.plugin.Printer.prototype.addTo);

goog.exportProperty(
    M.plugin.Printer.prototype,
    'destroy',
    M.plugin.Printer.prototype.destroy);

goog.exportSymbol(
    'M.control.Printer',
    M.control.Printer);

goog.exportProperty(
    M.control.Printer.prototype,
    'createView',
    M.control.Printer.prototype.createView);

goog.exportProperty(
    M.control.Printer.prototype,
    'addEvents',
    M.control.Printer.prototype.addEvents);

goog.exportProperty(
    M.control.Printer.prototype,
    'getCapabilities',
    M.control.Printer.prototype.getCapabilities);

goog.exportProperty(
    M.control.Printer.prototype,
    'createQueueElement',
    M.control.Printer.prototype.createQueueElement);

goog.exportProperty(
    M.control.Printer.prototype,
    'dowloadPrint',
    M.control.Printer.prototype.dowloadPrint);

goog.exportProperty(
    M.control.Printer.prototype,
    'equals',
    M.control.Printer.prototype.equals);

goog.exportSymbol(
    'M.control.Printer.TEMPLATE',
    M.control.Printer.TEMPLATE);

goog.exportSymbol(
    'M.control.Printer.LOADING_CLASS',
    M.control.Printer.LOADING_CLASS);

goog.exportSymbol(
    'M.control.Printer.DOWNLOAD_ATTR_NAME',
    M.control.Printer.DOWNLOAD_ATTR_NAME);

goog.exportSymbol(
    'M.control.Printer.NO_TITLE',
    M.control.Printer.NO_TITLE);
