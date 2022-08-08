import OLOverlay from 'ol/Overlay';
import { enableTouchScroll, isFunction, isNullOrEmpty } from 'M/util/Utils';
import FacadePopup from 'M/Popup';
import FacadeWindow from 'M/util/Window';

/**
 * @module M/impl/Popup
 */
class Popup extends OLOverlay {
  /**
   * OpenLayers 3 Popup Overlay.
   * @constructor
   * @extends {OLOverlay}
   * @api stable
   */
  constructor(options = {}) {
    super({});

    /**
     * Flag to indicate if map does pan or not
     * @private
     * @type {boolean}
     * @api stable
     */
    this.panMapIfOutOfView = options.panMapIfOutOfView;
    if (this.panMapIfOutOfView === undefined) {
      this.panMapIfOutOfView = true;
    }

    /**
     * Animation options
     * @private
     * @type {object}
     * @api stable
     */
    this.ani_opts = options.ani_opts;
    if (this.ani_opts === undefined) {
      this.ani_opts = {
        duration: 250,
      };
    }

    /**
     * TODO
     * @private
     * @type {M.Map}
     */
    this.facadeMap_ = null;

    /**
     * TODO
     * @private
     * @type {ol.Coordinate}
     */
    this.cachedAniPixel_ = null;
  }

  /**
   * TODO
   * @public
   * @function
   * @param {M.Map}
   * @param {String} html String of HTML to display within the popup.
   * @api stable
   */
  addTo(map, html) {
    this.facadeMap_ = map;

    // container
    this.container = html;

    this.content = this.getContentFromContainer(html);

    // Apply workaround to enable scrolling of content div on touch devices
    enableTouchScroll(this.content);

    this.setElement(this.container);

    map.getMapImpl().addOverlay(this);
  }

  /**
   * Show the popup.
   * @public
   * @function
   * @param {ol.Coordinate} coord Where to anchor the popup.
   * @param {function} callback Callback function to execute
   * @api stable
   * @memberof module:M/impl/Popup#
   */
  show(coord, callback) {
    this.setPosition(coord);
    if (this.panMapIfOutOfView) {
      this.panIntoView_(coord);
    }
    this.content.scrollTop = 0;
    if (isFunction(callback)) {
      callback();
    }
    return this;
  }

  /**
   * Center the popup
   * @public
   * @function
   * @param {ol.Coordinate} coord Where to anchor the popup.
   * @param {String} html String of HTML to display within the popup.
   * @api stable
   */
  centerByStatus(status, coord) {
    const resolution = this.getMap().getView().getResolution();
    const newCoord = [].concat(coord);
    if (status === FacadePopup.status.COLLAPSED) {
      newCoord[1] -= 0.1 * FacadeWindow.HEIGHT * resolution;
    } else if (status === FacadePopup.status.DEFAULT) {
      newCoord[1] -= 0.275 * FacadeWindow.HEIGHT * resolution;
    } else { // FULL state no effects
      return;
    }

    const featureCenter = this.facadeMap_.getFeatureCenter();
    this.facadeMap_.setCenter({
      x: newCoord[0],
      y: newCoord[1],
    });
    // if the center was drawn then draw it again
    if (!isNullOrEmpty(featureCenter)) {
      this.facadeMap_.drawFeatures([featureCenter]);
    }
  }

  /**
   * @private
   */
  getContentFromContainer(html) {
    return html.querySelector('div.m-body');
  }


  /**
   * @private
   */
  panIntoView_(coord) {
    // it waits for the previous animation in order to execute this
    this.panIntoSynchronizedAnim_().then(() => {
      this.isAnimating_ = true;
      if (FacadeWindow.WIDTH > 768) {
        const tabHeight = 30; // 30px for tabs
        const popupElement = this.element.querySelector('.m-popup');
        const popupWidth = popupElement.clientWidth + 20;
        const popupHeight = popupElement.clientHeight + 20 + tabHeight;
        const mapSize = this.getMap().getSize();

        const center = this.getMap().getView().getCenter();
        const tailHeight = 20;
        const tailOffsetLeft = 60;
        const tailOffsetRight = popupWidth - tailOffsetLeft;
        const popOffset = this.getOffset();
        const popPx = this.getMap().getPixelFromCoordinate(coord);

        if (!isNullOrEmpty(popPx)) {
          const fromLeft = (popPx[0] - tailOffsetLeft);
          const fromRight = mapSize[0] - (popPx[0] + tailOffsetRight);

          const fromTop = popPx[1] - (popupHeight + popOffset[1]);
          const fromBottom = mapSize[1] - (popPx[1] + tailHeight) - popOffset[1];

          const curPix = this.getMap().getPixelFromCoordinate(center);
          const newPx = curPix.slice();

          if (fromRight < 0) {
            newPx[0] -= fromRight;
          } else if (fromLeft < 0) {
            newPx[0] += fromLeft;
          }

          if (fromTop < 0) {
            newPx[1] += fromTop;
          } else if (fromBottom < 0) {
            newPx[1] -= fromBottom;
          }

          // if (this.ani && this.ani_opts) {
          if (!isNullOrEmpty(this.ani_opts) && isNullOrEmpty(this.ani_opts.source)) {
            this.ani_opts.source = center;
            this.getMap().getView().animate(this.ani_opts);
          }

          if (newPx[0] !== curPix[0] || newPx[1] !== curPix[1]) {
            this.getMap().getView().setCenter(this.getMap().getCoordinateFromPixel(newPx));
          }
        }
      }
      // the animation ended
      this.isAnimating_ = false;
    });

    return this.getMap().getView().getCenter();
  }

  /**
   * @private
   */
  panIntoSynchronizedAnim_() {
    return new Promise((success, fail) => {
      /* if the popup is animating then it waits for the animation
      in order to execute the next animation */
      if (this.isAnimating_ === true) {
        // gets the duration of the animation
        let aniDuration = 300;
        if (!isNullOrEmpty(this.ani_opts)) {
          aniDuration = this.ani_opts.duration;
        }
        setTimeout(success, aniDuration);
      } else {
        /* if there is not any animation then it starts
        a new one */
        success();
      }
    });
  }

  /**
   *
   * @public
   * @function
   * @api stable
   */
  hide(popup) {
    this.facadeMap_.removePopup(popup);
  }

  /**
   * change text popup
   * @public
   * @function
   * @param {text} new text.
   * @api stable
   */
  setContainer(html) {
    this.setElement(html);
    this.content = this.getContentFromContainer(html);
    enableTouchScroll(this.content);
  }

  /**
   * change text popup
   * @public
   * @function
   * @param {text} new text.
   * @api stable
   */
  getContent() {
    return this.content;
  }
}
export default Popup;
