import Utils from "./util/Utils";
import Template from "./util/Template";
import dialogTemplate from "templates/dialog.html";
import 'assets/css/dialog';



/**
 * TODO
 *
 * @public
 * @function
 * @api stable
 */
const removeElement = (element) => {
  const parent = element.parentElement;
  parent.removeChild(element);
};
/**
 * TODO
 *
 * @public
 * @function
 * @api stable
 */
export const remove = () => {
  const dialogs = document.querySelectorAll('div.m-dialog');
  Array.prototype.forEach.call(dialogs, (dialog) => {
    const parent = dialog.parentElement;
    parent.removeChild(dialog);
  });
};

/**
 * TODO
 *
 * @public
 * @function
 * @api stable
 * @returns {Promise}
 */
export const show = (message, title, severity) => {
  let vars = {
    message,
    title,
    severity
  };
  let html = Template.compile(dialogTemplate, {
    vars
  });
  // removes previous dialogs
  remove();

  // append new dialog
  let mapeaContainer = document.querySelector('div.m-mapea-container');

  // adds listener to close the dialog
  let okButton = html.querySelector('div.m-button > button');
  okButton.addEventListener("click", evt => removeElement(html));
  mapeaContainer.appendChild(html);
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
export const info = (message, title) => {
  if (Utils.isNullOrEmpty(title)) {
    title = 'INFORMACIÓN';
  }
  return show(message, title, 'info');
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
export const error = (message, title) => {
  if (Utils.isNullOrEmpty(title)) {
    title = 'ERROR';
  }
  return show(message, title, 'error');
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
export const success = (message, title) => {
  if (Utils.isNullOrEmpty(title)) {
    title = 'ÉXITO';
  }
  return show(message, title, 'success');
};
