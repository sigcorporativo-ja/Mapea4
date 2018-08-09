/**
 * @module M/style/chart
 */

/**
 * Chart Types
 * @const
 * @type {object}
 * @public
 * @api
 */
export const types = {
  DONUT: 'donut',
  PIE_3D: 'pie3D',
  PIE: 'pie',
  BAR: 'bar',
};

/**
 * Default themes for this style
 * @const
 * @type {object}
 * @public
 * @api
 */
export const schemes = {
  Custom: 'm.style.chart.types.custom_scheme',
  Classic: ['#ffa500', 'blue', 'red', 'green', 'cyan', 'magenta', 'yellow', '#0f0'],
  Dark: ['#960', '#003', '#900', '#060', '#099', '#909', '#990', '#090'],
  Pale: ['#fd0', '#369', '#f64', '#3b7', '#880', '#b5d', '#666'],
  Pastel: ['#fb4', '#79c', '#f66', '#7d7', '#acc', '#fdd', '#ff9', '#b9b'],
  Neon: ['#ff0', '#0ff', '#0f0', '#f0f', '#f00', '#00f'],
};
