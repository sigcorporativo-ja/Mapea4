goog.provide('M.dialog');

goog.require('M.utils');

(function() {
   /**
    * TODO
    *
    * @public
    * @function
    * @api stable
    * @returns {Promise}
    */
   M.dialog.show = function(message, title, severity) {
      return M.template.compile('dialog.html', {
         'jsonp': true,
         'vars': {
            'message': message,
            'title': title,
            'severity': severity
         }
      }).then(function(html) {
         // removes previous dialogs
         M.dialog.remove();

         // append new dialog
         var mapeaContainer = document.querySelector('div.m-mapea-container');

         // adds listener to close the dialog
         var okButton = html.querySelector('div.m-button > button');
         goog.events.listen(okButton, goog.events.EventType.CLICK, function(evt) {
            goog.dom.removeNode(html);
         });
         goog.dom.appendChild(mapeaContainer, html);
      });
   };

   /**
    * TODO
    *
    * @public
    * @function
    * @api stable
    */
   M.dialog.remove = function() {
      var dialogs = document.querySelectorAll('div.m-dialog');
      Array.prototype.forEach.call(dialogs, function(dialog) {
         goog.dom.removeNode(dialog);
      });
   };

   /**
    * TODO
    *
    * @public
    * @function
    * @param {string} message to show
    * @param {string} title of the dialog
    * @api stable
    * @returns {Promise}
    */
   M.dialog.info = function(message, title) {
      if (M.utils.isNullOrEmpty(title)) {
         title = 'INFORMACIÓN';
      }
      return M.dialog.show(message, title, 'info');
   };

   /**
    * TODO
    *
    * @public
    * @function
    * @param {string} message to show
    * @param {string} title of the dialog
    * @api stable
    * @returns {Promise}
    */
   M.dialog.error = function(message, title) {
      if (M.utils.isNullOrEmpty(title)) {
         title = 'ERROR';
      }
      return M.dialog.show(message, title, 'error');
   };

   /**
    * TODO
    *
    * @public
    * @function
    * @param {string} message to show
    * @param {string} title of the dialog
    * @api stable
    * @returns {Promise}
    */
   M.dialog.success = function(message, title) {
      if (M.utils.isNullOrEmpty(title)) {
         title = 'ÉXITO';
      }
      return M.dialog.show(message, title, 'success');
   };
})();