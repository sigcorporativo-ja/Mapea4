/**
 * @fileoverview Custom exports file.
 * @suppress {checkVars}
 */

goog.require('P.control.Measure');
goog.require('P.control.MeasureArea');
goog.require('P.control.MeasureClear');
goog.require('P.control.MeasureLength');
goog.require('P.impl.control.Measure');
goog.require('P.impl.control.MeasureArea');
goog.require('P.impl.control.MeasureClear');
goog.require('P.impl.control.MeasureLength');
goog.require('P.plugin.Measurebar');


goog.exportSymbol(
    'M.control.MeasureArea',
    M.control.MeasureArea);

goog.exportProperty(
    M.control.MeasureArea.prototype,
    'equals',
    M.control.MeasureArea.prototype.equals);

goog.exportSymbol(
    'M.control.MeasureArea.TEMPLATE',
    M.control.MeasureArea.TEMPLATE);

goog.exportSymbol(
    'M.impl.control.MeasureArea',
    M.impl.control.MeasureArea);

goog.exportSymbol(
    'M.plugin.Measurebar',
    M.plugin.Measurebar);

goog.exportProperty(
    M.plugin.Measurebar.prototype,
    'addTo',
    M.plugin.Measurebar.prototype.addTo);

goog.exportProperty(
    M.plugin.Measurebar.prototype,
    'destroy',
    M.plugin.Measurebar.prototype.destroy);

goog.exportSymbol(
    'M.control.Measure',
    M.control.Measure);

goog.exportProperty(
    M.control.Measure.prototype,
    'createView',
    M.control.Measure.prototype.createView);

goog.exportProperty(
    M.control.Measure.prototype,
    'equals',
    M.control.Measure.prototype.equals);

goog.exportProperty(
    M.control.Measure.prototype,
    'destroy',
    M.control.Measure.prototype.destroy);

goog.exportSymbol(
    'M.control.Measure.POINTER_TOOLTIP_TEMPLATE',
    M.control.Measure.POINTER_TOOLTIP_TEMPLATE);

goog.exportSymbol(
    'M.control.Measure.MEASURE_TOOLTIP_TEMPLATE',
    M.control.Measure.MEASURE_TOOLTIP_TEMPLATE);

goog.exportSymbol(
    'M.impl.control.Measure',
    M.impl.control.Measure);

goog.exportProperty(
    M.impl.control.Measure.prototype,
    'addTo',
    M.impl.control.Measure.prototype.addTo);

goog.exportProperty(
    M.impl.control.Measure.prototype,
    'onClick',
    M.impl.control.Measure.prototype.onClick);

goog.exportProperty(
    M.impl.control.Measure.prototype,
    'activate',
    M.impl.control.Measure.prototype.activate);

goog.exportProperty(
    M.impl.control.Measure.prototype,
    'deactivate',
    M.impl.control.Measure.prototype.deactivate);

goog.exportProperty(
    M.impl.control.Measure.prototype,
    'clear',
    M.impl.control.Measure.prototype.clear);

goog.exportProperty(
    M.impl.control.Measure.prototype,
    'destroy',
    M.impl.control.Measure.prototype.destroy);

goog.exportSymbol(
    'M.control.MeasureClear',
    M.control.MeasureClear);

goog.exportProperty(
    M.control.MeasureClear.prototype,
    'createView',
    M.control.MeasureClear.prototype.createView);

goog.exportProperty(
    M.control.MeasureClear.prototype,
    'equals',
    M.control.MeasureClear.prototype.equals);

goog.exportProperty(
    M.control.MeasureClear.prototype,
    'destroy',
    M.control.MeasureClear.prototype.destroy);

goog.exportSymbol(
    'M.control.MeasureClear.TEMPLATE',
    M.control.MeasureClear.TEMPLATE);

goog.exportSymbol(
    'M.impl.control.MeasureClear',
    M.impl.control.MeasureClear);

goog.exportProperty(
    M.impl.control.MeasureClear.prototype,
    'addTo',
    M.impl.control.MeasureClear.prototype.addTo);

goog.exportProperty(
    M.impl.control.MeasureClear.prototype,
    'onClick',
    M.impl.control.MeasureClear.prototype.onClick);

goog.exportProperty(
    M.impl.control.MeasureClear.prototype,
    'destroy',
    M.impl.control.MeasureClear.prototype.destroy);

goog.exportSymbol(
    'M.control.MeasureLength',
    M.control.MeasureLength);

goog.exportProperty(
    M.control.MeasureLength.prototype,
    'equals',
    M.control.MeasureLength.prototype.equals);

goog.exportSymbol(
    'M.control.MeasureLength.TEMPLATE',
    M.control.MeasureLength.TEMPLATE);

goog.exportSymbol(
    'M.impl.control.MeasureLength',
    M.impl.control.MeasureLength);

goog.exportProperty(
    M.control.MeasureArea.prototype,
    'createView',
    M.control.MeasureArea.prototype.createView);

goog.exportProperty(
    M.control.MeasureArea.prototype,
    'destroy',
    M.control.MeasureArea.prototype.destroy);

goog.exportProperty(
    M.impl.control.MeasureArea.prototype,
    'addTo',
    M.impl.control.MeasureArea.prototype.addTo);

goog.exportProperty(
    M.impl.control.MeasureArea.prototype,
    'onClick',
    M.impl.control.MeasureArea.prototype.onClick);

goog.exportProperty(
    M.impl.control.MeasureArea.prototype,
    'activate',
    M.impl.control.MeasureArea.prototype.activate);

goog.exportProperty(
    M.impl.control.MeasureArea.prototype,
    'deactivate',
    M.impl.control.MeasureArea.prototype.deactivate);

goog.exportProperty(
    M.impl.control.MeasureArea.prototype,
    'clear',
    M.impl.control.MeasureArea.prototype.clear);

goog.exportProperty(
    M.impl.control.MeasureArea.prototype,
    'destroy',
    M.impl.control.MeasureArea.prototype.destroy);

goog.exportProperty(
    M.control.MeasureLength.prototype,
    'createView',
    M.control.MeasureLength.prototype.createView);

goog.exportProperty(
    M.control.MeasureLength.prototype,
    'destroy',
    M.control.MeasureLength.prototype.destroy);

goog.exportProperty(
    M.impl.control.MeasureLength.prototype,
    'addTo',
    M.impl.control.MeasureLength.prototype.addTo);

goog.exportProperty(
    M.impl.control.MeasureLength.prototype,
    'onClick',
    M.impl.control.MeasureLength.prototype.onClick);

goog.exportProperty(
    M.impl.control.MeasureLength.prototype,
    'activate',
    M.impl.control.MeasureLength.prototype.activate);

goog.exportProperty(
    M.impl.control.MeasureLength.prototype,
    'deactivate',
    M.impl.control.MeasureLength.prototype.deactivate);

goog.exportProperty(
    M.impl.control.MeasureLength.prototype,
    'clear',
    M.impl.control.MeasureLength.prototype.clear);

goog.exportProperty(
    M.impl.control.MeasureLength.prototype,
    'destroy',
    M.impl.control.MeasureLength.prototype.destroy);
