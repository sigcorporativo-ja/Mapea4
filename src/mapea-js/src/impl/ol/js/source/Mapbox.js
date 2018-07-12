import Config from "configuration";
import Utils from "facade/js/util/Utils";

export default class Mapbox extends ol.source.OSM {


  /**
   * @classdesc
   * Layer source for the OpenStreetMap tile server.
   *
   * @constructor
   * @extends {ol.source.XYZ}
   * @param {olx.source.OSMOptions=} opt_options Open Street Map options.
   * @api stable
   */

  constructor(opt_options) {
    // appends
    super({
      attributions: attributions,
      url: url
    });

    /**
     * Mapbox source options
     * @private
     * @type {object}
     * @expose
     */

    this.options = opt_options || {};

    let attributions;
    if (this.options.attributions !== undefined) {
      attributions = this.options.attributions;
    } else {
      attributions = [Mapbox.ATTRIBUTION];
    }

    let url = this.options.url;
    url += this.options.name;
    url += '/{z}/{x}/{y}.';
    url += this.options.extension !== undefined ?
      this.options.extension : Config.MAPBOX_EXTENSION;
  }


  /**
   * Set the URL to use for requests.
   * @param {string} url URL.
   * @api stable
   */

  setUrl(url) {
    let accessToken = this.options.accessToken;
    let urlFunction = ol.TileUrlFunction.createFromTemplates(
      ol.TileUrlFunction.expandUrl(url), this.tileGrid);
    this.setTileUrlFunction(() => {
      let urlResolved = urlFunction.apply(this, arguments);
      let tokenParam = {};
      tokenParam[Config.MAPBOX_TOKEN_NAME] = accessToken;
      return Utils.addParameters(urlResolved, tokenParam);
    });
    this.urls = [url];
  }

  /**
   * The attribution containing a link to the OpenStreetMap Copyright and License
   * page.
   * @const
   * @type {ol.Attribution}
   * @api
   */

  Mapbox.ATTRIBUTION = new ol.Attribution({
    html: '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
  });
}
