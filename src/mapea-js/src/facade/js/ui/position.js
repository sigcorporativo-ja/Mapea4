goog.provide('M.ui.position');

(function () {
   /**
    *  ______________
    * |    |    |    |
    * | TL |    |    |
    * |____|    |____|
    * |              |
    * |              |
    * |____      ____|
    * |    |    |    |
    * |    |    |    |
    * |____|____|____|
    * @public
    * @type {string}
    * @api stable
    */
   M.ui.position.TL = '.m-top.m-left';

   /**
    *  ______________
    * |    |    |    |
    * |    |    | TR |
    * |____|    |____|
    * |              |
    * |              |
    * |____      ____|
    * |    |    |    |
    * |    |    |    |
    * |____|____|____|
    * @public
    * @type {string}
    * @api stable
    */
   M.ui.position.TR = '.m-top.m-right';

   /**
    *  ______________
    * |    |    |    |
    * |    |    |    |
    * |____|    |____|
    * |              |
    * |              |
    * |____      ____|
    * |    |    |    |
    * | BL |    |    |
    * |____|____|____|
    * @public
    * @type {string}
    * @api stable
    */
   M.ui.position.BL = '.m-bottom.m-left';

   /**
    *  ______________
    * |    |    |    |
    * |    |    |    |
    * |____|    |____|
    * |              |
    * |              |
    * |____      ____|
    * |    |    |    |
    * |    |    | BR |
    * |____|____|____|
    * @public
    * @type {string}
    * @api stable
    */
   M.ui.position.BR = '.m-bottom.m-right';
})();