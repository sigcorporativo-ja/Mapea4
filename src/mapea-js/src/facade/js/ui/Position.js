export default class Position {}
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
Position.TL = '.m-top.m-left';

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
Position.TR = '.m-top.m-right';

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
Position.BL = '.m-bottom.m-left';

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
Position.BR = '.m-bottom.m-right';
