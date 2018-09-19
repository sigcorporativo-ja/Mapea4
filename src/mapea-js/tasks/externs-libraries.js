/**
 * Array of objects {name, path} with information about what libraries will
 * be in window scope.
 * @const libraries - array of libraries that will be be in window scope.
 * @type {array<object>}
 */
const libraries = [
  {
    name: 'jsts',
    path: 'jsts/dist/jsts.min.js',
  },
  {
    name: 'Handlebars',
    path: 'handlebars',
  },
];

module.exports = libraries;
