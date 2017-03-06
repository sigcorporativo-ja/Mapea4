goog.provide('M.window');

goog.require('goog.dom.ViewportSizeMonitor');

/**
 * @namespace M.window
 */
(function () {
   // monitor changes in the viewport size
   goog.dom.ViewportSizeMonitor.removeInstanceForWindow(window);
   var vsm = goog.dom.ViewportSizeMonitor.getInstanceForWindow(window);
   // listens to resize events
   goog.events.listen(vsm, goog.events.EventType.RESIZE, function (e) {
      // new size
      M.window.WIDTH = vsm.getSize().width;
      M.window.HEIGHT = vsm.getSize().height;
   });

   /**
    * TODO
    * @public
    * @type {Number}
    * @api stable
    * @expose
    */
   M.window.WIDTH = vsm.getSize().width;

   /**
    * TODO
    * @public
    * @type {Number}
    * @api stable
    * @expose
    */
   M.window.HEIGHT = vsm.getSize().height;
})();