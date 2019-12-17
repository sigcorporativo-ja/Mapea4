import WMCSelector from '../control/WMCSelector';
import LayerSwitcher from '../control/Layerswitcher';
import Location from '../control/Location';
import Scale from '../control/Scale';
import Rotate from '../control/Rotate';
import ScaleLine from '../control/ScaleLine';
import Mouse from '../control/Mouse';
import OverviewMap from '../control/OverviewMap';
import Panzoom from '../control/Panzoom';
import Panzoombar from '../control/Panzoombar';
import GetFeatureInfo from '../control/GetFeatureInfo';
import Control from '../control/Control';
import Panel from '../ui/Panel';
import {
  isString,
  normalize,
  enableTouchScroll,
  isNullOrEmpty,
  concatUrlPaths,
} from '../util/Utils';
import Exception from '../exception/exception';
import * as Position from '../ui/position';
import { getValue } from '../i18n/language';
import * as EventType from '../event/eventtype';
import * as Dialog from '../dialog';

/**
 * Name of the info map panel
 *
 * @constant
 * @type {string}
 */
const MAP_INFO_PANEL_NAME = 'map-info';

/**
 * Name of the tools  panel
 *
 * @constant
 * @type {string}
 */
const TOOLS_PANEL_NAME = 'tools';

/**
 * Utility method that adds the 'ol-scale-line-up' css class
 * @function
 */
const addUpClass = (panel, map) => {
  panel.on(EventType.ADDED_TO_MAP, () => {
    if (map.getControls(['wmcselector', 'scale', 'scaleline']).length === 3) {
      map.getControls(['scaleline'])[0].getElement().classList.add('ol-scale-line-up');
    }
  });
};

/**
 * This class build a plugin panel
 * with the options and callback specified by the user
 * @class
 * @constructor
 */
class PanelBuilder {
  constructor(options = {}, callback = () => null) {
    this.panel_ = new Panel(options.name, {
      ...options.params,
    });
    callback(this.panel_);
  }

  get panel() {
    return this.panel_;
  }
}

/**
 * This function create the feature info panel.
 * @function
 */
const getFeatureInfoPanel = (map) => {
  const mapParam = map;
  if (isNullOrEmpty(mapParam.panel.TOOLS)) {
    const panelBuilder = new PanelBuilder({
      name: TOOLS_PANEL_NAME,
      params: {
        collapsible: true,
        className: 'm-tools',
        collapsedButtonClass: 'g-cartografia-herramienta',
        position: Position.TL,
        tooltip: 'Panel de herramientas',
      },
    });
    mapParam.panel.TOOLS = panelBuilder.panel;
  }
  return mapParam.panel.TOOLS;
};

/**
 * This function create the layerswitcher panel.
 * @function
 */
const getLayerswitcherPanel = () => {
  const panelBuilder = new PanelBuilder({
    name: LayerSwitcher.NAME,
    params: {
      collapsible: true,
      className: 'm-layerswitcher',
      collapsedButtonClass: 'g-cartografia-capas2',
      position: Position.TR,
      tooltip: getValue('layerswitcher').title,
    },
  }, (panel) => {
    // enables touch scroll
    panel.on(EventType.ADDED_TO_MAP, (html) => {
      enableTouchScroll(html.querySelector('.m-panel-controls'));
    });

    // renders and registers events
    panel.on(EventType.SHOW, (evt) => {
      const layerswitcherCtrl = evt.getControls()[0];
      layerswitcherCtrl.registerEvents();
      layerswitcherCtrl.render();
    });

    // unregisters events
    panel.on(EventType.HIDE, (evt) => {
      const layerswitcherCtrl = evt.getControls()[0];
      layerswitcherCtrl.unregisterEvents();
    });
  });
  return panelBuilder.panel;
};

/**
 * This function create the location panel.
 * @function
 */
const getLocationPanel = () => {
  const panelBuilder = new PanelBuilder({
    name: Location.NAME,
    params: {
      collapsible: false,
      className: 'm-location',
      position: Position.BR,
    },
  });
  return panelBuilder.panel;
};

/**
 * This function create the mouse panel.
 * @function
 */
const getMousePanel = (map) => {
  let mapInfoPanel = map.getPanels('map-info')[0];
  if (isNullOrEmpty(mapInfoPanel)) {
    const panelBuilder = new PanelBuilder({
      name: MAP_INFO_PANEL_NAME,
      params: {
        collapsible: false,
        className: 'm-map-info',
        position: Position.BR,
        tooltip: 'Coordenadas del puntero',
      },
    });
    mapInfoPanel = panelBuilder.panel;
  }
  mapInfoPanel.addClassName('m-with-mouse');
  return mapInfoPanel;
};

/**
 * This function create the overview panel.
 * @function
 */
const getOverviewMapPanel = (map) => {
  let mapInfoPanel = map.getPanels('map-info')[0];
  if (isNullOrEmpty(mapInfoPanel)) {
    const panelBuilder = new PanelBuilder({
      name: MAP_INFO_PANEL_NAME,
      params: {
        collapsible: false,
        className: 'm-map-info',
        position: Position.BR,
      },
    });
    mapInfoPanel = panelBuilder.panel;
  }
  mapInfoPanel.addClassName('m-with-overview');
  return mapInfoPanel;
};

/**
 * This function create the panzoom panel.
 * @function
 */
const getPanzoomPanel = () => {
  const panelBuilder = new PanelBuilder({
    name: Panzoom.NAME,
    params: {
      collapsible: false,
      className: 'm-panzoom',
      position: Position.TL,
    },
  });
  return panelBuilder.panel;
};

/**
 * This function create the panzoobar panel.
 * @function
 */
const getPanzoombarPanel = () => {
  const panelBuilder = new PanelBuilder({
    name: Panzoombar.NAME,
    params: {
      collapsible: false,
      className: 'm-panzoombar',
      position: Position.TL,
      tooltip: 'Nivel de zoom',
    },
  });
  return panelBuilder.panel;
};

/**
 * This function create the rotate panel.
 * @function
 */
const getRotatePanel = () => {
  const panelBuilder = new PanelBuilder({
    name: Rotate.NAME,
    params: {
      collapsible: false,
      className: 'm-rotate',
      position: Position.TR,
    },
  });
  return panelBuilder.panel;
};

/**
 * This function create the scale panel.
 * @function
 */
const getScalePanel = (map) => {
  let mapInfoPanel = map.getPanels('map-info')[0];
  if (isNullOrEmpty(mapInfoPanel)) {
    const panelBuilder = new PanelBuilder({
      name: MAP_INFO_PANEL_NAME,
      params: {
        collapsible: false,
        className: 'm-map-info',
        position: Position.BR,
      },
    }, (panel) => {
      addUpClass(panel, map);
    });
    mapInfoPanel = panelBuilder.panel;
  }
  mapInfoPanel.addClassName('m-with-scale');
  return mapInfoPanel;
};

/**
 * This function create the scale line panel.
 * @function
 */
const getScaleLinePanel = (map) => {
  const panelBuilder = new PanelBuilder({
    name: ScaleLine.NAME,
    params: {
      collapsible: false,
      className: 'm-scaleline',
      position: Position.BL,
      tooltip: 'Línea de escala',
    },
  }, (panel) => {
    addUpClass(panel, map);
  });
  return panelBuilder.panel;
};

/**
 * This function create the wmc selector panel.
 * @function
 */
const getWMCSelectorPanel = (map) => {
  let mapInfoPanel = map.getPanels('map-info')[0];
  if (isNullOrEmpty(mapInfoPanel)) {
    const panelBuilder = new PanelBuilder({
      name: MAP_INFO_PANEL_NAME,
      params: {
        collapsible: false,
        className: 'm-map-info',
        position: Position.BR,
      },
    }, (panel) => {
      addUpClass(panel, map);
    });
    mapInfoPanel = panelBuilder.panel;
  }
  mapInfoPanel.addClassName('m-with-wmcselector');
  return mapInfoPanel;
};

/**
 * This method create the mapea panel control from the name control.
 * @function
 * @private
 */
export const getPanelForControl = (control, map) => {
  const panels = {
    [GetFeatureInfo.NAME]: () => getFeatureInfoPanel(map),
    [LayerSwitcher.NAME]: () => getLayerswitcherPanel(),
    [Location.NAME]: () => getLocationPanel(),
    [Mouse.NAME]: () => getMousePanel(map),
    [OverviewMap.NAME]: () => getOverviewMapPanel(map),
    [Panzoom.NAME]: () => getPanzoomPanel(),
    [Panzoombar.NAME]: () => getPanzoombarPanel(),
    [Rotate.NAME]: () => getRotatePanel(),
    [Scale.NAME]: () => getScalePanel(map),
    [`${Scale.NAME}*true`]: () => getScalePanel(map),
    [ScaleLine.NAME]: () => getScaleLinePanel(map),
    [WMCSelector.NAME]: () => getWMCSelectorPanel(map),
  };
  const controlParam = control.name;
  return panels[controlParam]();
};

/**
 * This method create the mapea control from its name string.
 * @function
 */
export const buildControl = (control) => {
  let builtControl = null;
  if (isString(control)) {
    const controlParam = normalize(control);
    const controls = {
      [LayerSwitcher.NAME]: new LayerSwitcher(),
      [Location.NAME]: new Location(),
      [Mouse.NAME]: new Mouse(),
      [OverviewMap.NAME]: new OverviewMap({ toggleDelay: 400 }),
      [Panzoom.NAME]: new Panzoom(),
      [Panzoombar.NAME]: new Panzoombar(),
      [Rotate.NAME]: new Rotate(),
      [Scale.NAME]: new Scale(),
      [`${Scale.Name}*true`]: new Scale({ exactScale: true }),
      [ScaleLine.NAME]: new ScaleLine(),
      [WMCSelector.NAME]: new WMCSelector(),
    };
    if (!(controlParam in controls)) {
      const getControlsAvailable = concatUrlPaths([M.config.MAPEA_URL, '/api/actions/controls']);
      Dialog.error(`El control ${controlParam} no está definido. Consulte los controles disponibles <a href='${getControlsAvailable}' target="_blank">aquí</a>`);
    }
    builtControl = controls[controlParam];
  } else if (control instanceof Control) {
    builtControl = control;
  } else {
    Exception('El control añadido no es válido.');
  }

  return builtControl;
};
