import Utils from "./utils/utils";
import Template from "./utils/template";

export default class Dialog {
  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   * @returns {Promise}
   */
  static show(message, title, severity) {
    return Template.compile('dialog.html', {
      'jsonp': true,
      'vars': {
        'message': message,
        'title': title,
        'severity': severity
      }
    }).then((html) => {
      // removes previous dialogs
      Dialog.remove();

      // append new dialog
      let mapeaContainer = document.querySelector('div.m-mapea-container');

      // adds listener to close the dialog
      let okButton = html.querySelector('div.m-button > button');
      okButton.addEventListener("click", evt => {
        okButton.removeNode(html);
      });
      mapeaContainer.appendChild(html);
    });
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  static remove() {
    let dialogs = document.querySelectorAll('div.m-dialog');
    Array.prototype.forEach.call(dialogs, dialog => {
      dialogs.removeNode(dialog);
    });
  }

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
  static info(message, title) {
    if (Utils.isNullOrEmpty(title)) {
      title = 'INFORMACIÓN';
    }
    return Dialog.show(message, title, 'info');
  }

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
  static error(message, title) {
    if (Utils.isNullOrEmpty(title)) {
      title = 'ERROR';
    }
    return Dialog.show(message, title, 'error');
  }

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
  static success(message, title) {
    if (Utils.isNullOrEmpty(title)) {
      title = 'ÉXITO';
    }
    return Dialog.show(message, title, 'success');
  }
}
