import Utils from 'facade/js/util/Utils';

/**
 * Name of the nodes that we want to spread from parents to children.
 * @const
 * @type {Array<String>}
 */
const PROPAGATED_ELEMENTS = [
  'SRS',
  'BoundingBox',
  'ScaleHint',
  'LatLonBoundingBox',
];

/**
 * This function returns true if a node has a direct child with a name equals to
 * childName parameter.
 * @function
 * @param {Node} node
 * @param {String} childName
 * @return {Bool}
 */
const hasChild = (node, childName) => {
  const childNodes = Array.prototype.filter
    .call(node.children, element => element.tagName === childName);
  return childNodes.length > 0;
};

/**
 * This function propagates all the nodes defined in the constant PROPAGATED_ELEMENTS
 * from parents to child node.
 * @function
 * @param {Node} parentNode
 * @param {Node} nodeChild
 */
const propagateNodeLayer = (parentNode, nodeChild) => {
  if (parentNode !== null) {
    PROPAGATED_ELEMENTS.forEach((elementName) => {
      if (!hasChild(nodeChild, elementName)) {
        const nodes = Array.prototype.filter
          .call(parentNode.children, element => element.tagName === elementName);
        nodes.forEach((node) => {
          const cloneNode = node.cloneNode(true);
          nodeChild.appendChild(cloneNode);
        });
      }
    });
  }
};

/**
 * This function returns an object where each key is the name of a layer of the WMS
 * document and its value is the XML node that represents it.
 * @function
 * @param {Node} wmsNode
 * @param {Bool} isRoot
 * @param {Object} rootObj
 * @param {Node|null} parent
 * @returns {Object}
 */
const layerNodeToJSON = (wmsNode, isRoot = true, rootObj = {}, parent = null) => {
  let rootObjVar = rootObj;
  let node = wmsNode;
  if (isRoot === true) {
    node = wmsNode.querySelector('Layer');
  }
  propagateNodeLayer(parent, node);
  const name = node.querySelector('Name').innerHTML;
  const children = node.children;
  Array.prototype.forEach.call(children, (child) => {
    if (child.tagName === 'Layer') {
      rootObjVar = layerNodeToJSON(child, false, rootObjVar, node);
    }
  });
  rootObjVar[name] = node;
  return rootObjVar;
};

/**
 * This function parse the SRS custom node of WMS XML.
 * @function
 * @param {Object} objLayer
 * @param {Object} parsedLayerNodes
 */
const parseSRS = (objLayer, parsedLayerNodes) => {
  const objLayerParam = objLayer;
  const nodeLayer = parsedLayerNodes[objLayerParam.Name];
  const SRS = nodeLayer.querySelector('SRS');
  if (SRS !== null) {
    const innerHTML = SRS.innerHTML;
    objLayerParam.SRS = [innerHTML];
  }
};

/**
 * This function parse the BoundingBox custom node and SRS attribute of WMS XML.
 * @function
 * @param {Object} objLayer
 * @param {Object} parsedLayerNodes
 */
const parseBoundingBox = (objLayer, parsedLayerNodes) => {
  const nodeLayer = parsedLayerNodes[objLayer.Name];
  if (Utils.isArray(objLayer.BoundingBox)) {
    let bboxChilds = Array.prototype.map.call(nodeLayer.children, element => element);
    bboxChilds = bboxChilds.filter(element => element.tagName === 'BoundingBox');

    objLayer.BoundingBox.forEach((objBbox, index) => {
      const objBboxParam = objBbox;
      if (objBboxParam.crs === null) {
        const bboxNode = bboxChilds[index];
        const srs = bboxNode.getAttribute('SRS');
        if (!Utils.isNullOrEmpty(srs)) {
          objBboxParam.crs = srs;
        }
      }
    });
  }
};

/**
 * This function parse the ScaleHint custom node of WMS XML.
 * @function
 * @param {Object} objLayer
 * @param {Object} parsedLayerNodes
 */
const parseScaleHint = (objLayer, parsedLayerNodes) => {
  const objLayerParam = objLayer;
  const nodeLayer = parsedLayerNodes[objLayer.Name];
  objLayerParam.ScaleHint = [];
  let scaleHints = Array.prototype.map.call(nodeLayer.children, element => element);
  scaleHints = scaleHints.filter(element => element.tagName === 'ScaleHint');
  scaleHints.forEach((scaleHint) => {
    const minScale = parseFloat(scaleHint.getAttribute('min'));
    const maxScale = parseFloat(scaleHint.getAttribute('max'));
    const obj = {
      minScale,
      maxScale,
    };
    objLayerParam.ScaleHint.push(obj);
  });
};

/**
 * This function parse the LatLonBoundingBox custom node of WMS XML.
 * @function
 * @param {Object} objLayer
 * @param {Object} parsedLayerNodes
 */
const parseLatLonBoundingBox = (objLayer, parsedLayerNodes) => {
  const objLayerParam = objLayer;
  const nodeLayer = parsedLayerNodes[objLayer.Name];
  objLayerParam.LatLonBoundingBox = [];
  let latLonBboxes = Array.prototype.map.call(nodeLayer.children, element => element);
  latLonBboxes = latLonBboxes.filter(element => element.tagName === 'LatLonBoundingBox');
  latLonBboxes.forEach((latlonBbox) => {
    const extent = [
      parseFloat(latlonBbox.getAttribute('minx')),
      parseFloat(latlonBbox.getAttribute('miny')),
      parseFloat(latlonBbox.getAttribute('maxx')),
      parseFloat(latlonBbox.getAttribute('maxy')),
    ];
    const obj = {
      crs: 'EPSG:4326',
      extent,
    };
    objLayerParam.LatLonBoundingBox.push(obj);
  });
};

/**
 * This function replaces the BoundingBox (if BoundingBox is null)
 * by LatLonBoundinBox in object layer.
 * @function
 * @param {Object} objLayer
 * @param {Object} parsedLayerNodes
 */
const replaceBoundingBox = (objLayer, parsedLayerNodes) => {
  const objLayerParam = objLayer;
  // replaces the BoundingBox by LatLonBoundinBox
  const latLonBoundingBoxProp = 'LatLonBoundingBox';
  const boundingBoxProp = 'BoundingBox';
  if (Utils.isNullOrEmpty(objLayerParam[boundingBoxProp]) &&
    !Utils.isNullOrEmpty(objLayerParam[latLonBoundingBoxProp])) {
    objLayerParam[boundingBoxProp] = objLayerParam[latLonBoundingBoxProp];
  }
};

/**
 * This function replaces the maxScale (if maxScale is null)
 * by ScaleHint in object layer.
 * @function
 * @param {Object} objLayer
 * @param {Object} parsedLayerNodes
 */
const replaceMaxScaleDenominator = (objLayer, parsedLayerNodes) => {
  const objLayerParam = objLayer;
  const maxScaleDenominatorProp = 'MaxScaleDenominator';
  if (Utils.isNullOrEmpty(objLayerParam[maxScaleDenominatorProp]) &&
    !Utils.isNullOrEmpty(objLayerParam.ScaleHint)) {
    objLayerParam[maxScaleDenominatorProp] = objLayerParam.ScaleHint[0].maxScale;
  }
};

/**
 * This function replaces the maxScale (if maxScale is null)
 * by ScaleHint in object layer.
 * @function
 * @param {Object} objLayer
 * @param {Object} parsedLayerNodes
 */
const replaceMinScaleDenominator = (objLayer, parsedLayerNodes) => {
  const objLayerParam = objLayer;
  const minScaleDenominatorProp = 'MinScaleDenominator';
  if (Utils.isNullOrEmpty(objLayerParam[minScaleDenominatorProp]) &&
    !Utils.isNullOrEmpty(objLayerParam.ScaleHint)) {
    objLayerParam[minScaleDenominatorProp] = objLayerParam.ScaleHint[0].minScale;
  }
};

/**
 * Parsers to apply to WMS XML Document
 * @const
 * @type {Array<Function>}
 */
const LAYER_PARSERS = [
  parseSRS,
  parseBoundingBox,
  parseScaleHint,
  parseLatLonBoundingBox,
  replaceBoundingBox,
  replaceMaxScaleDenominator,
  replaceMinScaleDenominator,
];

/**
 * This function applies all the parsers to a layer
 * @function
 * @param {Object} objLayer
 * @param {Object} parsedLayerNodes
 */
const parserLayerProps = (objLayer, parsedLayerNodes) => {
  LAYER_PARSERS.forEach((parser) => {
    parser(objLayer, parsedLayerNodes);
  });
};

/**
 * This function applies all the parsers to each layer
 * @function
 * @param {Object} objLayer
 * @param {Object} parsedLayerNodes
 */
const parseLayersProps = (objLayer, parsedLayerNodes) => {
  if (Utils.isArray(objLayer)) {
    objLayer.forEach((layer) => {
      parseLayersProps(layer, parsedLayerNodes);
    });
  }
  else if (Utils.isObject(objLayer)) {
    parserLayerProps(objLayer, parsedLayerNodes);
    parseLayersProps(objLayer.Layer, parsedLayerNodes);
  }
};


/**
 * @classdesc
 * Main constructor of the class. Creates a WMC formater
 * @api stable
 */
export default class WMSCapabilities extends ol.format.WMSCapabilities {
  /**
   * This function reads some custom properties that do
   * not follow the standard of WMS layers.
   * @public
   * @param {XMLDocument} wmsDocument - XML of WMS
   * @return {Object} Layer object
   */
  customRead(wmsDocument) {
    const formatedWMS = this.read(wmsDocument);
    const parsedLayerNodes = layerNodeToJSON(wmsDocument);
    const capabilityObj = formatedWMS.Capability;
    if (!Utils.isNullOrEmpty(capabilityObj) && !Utils.isNullOrEmpty(capabilityObj.Layer)) {
      parseLayersProps(capabilityObj.Layer, parsedLayerNodes);
    }
    return formatedWMS;
  }
}
