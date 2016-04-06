(function (window) {
   // module
   window.mapeaSuite = {};

   // configure
   mocha.setup('tdd');
   mocha.reporter('html');
   window.assert = chai.assert;

   // Mapea suite
   window.mapeaSuite = function (title, suiteFn) {
      suite(title, suiteFn);

      if (window.mochaPhantomJS) {
         mochaPhantomJS.run();
      }
      else {
         mocha.run();
      }
   };

   // modules
   window.mapeaSuite.wmc = {};
   window.mapeaSuite.wms = {};
   window.mapeaSuite.wmts = {};
   window.mapeaSuite.wfs = {};
   window.mapeaSuite.kml = {};
   window.mapeaSuite.maxExtent = {};
   window.mapeaSuite.bbox = {};
   window.mapeaSuite.resolutions = {};
   window.mapeaSuite.controls = {};

   Array.prototype.includes = function (searchElement /*, fromIndex*/ ) {
      var O = Object(this);
      var len = parseInt(O.length) || 0;
      if (len === 0) {
         return false;
      }
      var n = parseInt(arguments[1]) || 0;
      var k;
      if (n >= 0) {
         k = n;
      }
      else {
         k = len + n;
         if (k < 0) {
            k = 0;
         }
      }
      var currentElement;
      while (k < len) {
         currentElement = O[k];
         if (searchElement === currentElement || Object.equals(searchElement, currentElement) ||
            (searchElement !== searchElement && currentElement !== currentElement)) {
            return true;
         }
         k++;
      }
      return false;
   };

})(window || {});