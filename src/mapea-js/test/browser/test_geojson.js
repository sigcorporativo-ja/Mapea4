(function (context, document) {
  "use strict";

  context.GeoJSONTypes = {
    linestring: 'linestring',
    worldpt: 'worldpt'
  };

  context.provideGeoJSON = function (types, geojsonType) {
    return new Promise(function (resolve, reject) {
      if (Object.keys(types).indexOf(geojsonType) === -1) {
        console.warn('invalid geojson type to provide: ', geojsonType);
        resolve({});
        return false;
      }
      ns_util.execRequest(geojsonType, resolve, reject);
    });
  }.bind(this, context.GeoJSONTypes);

  var ns_util = {
    execRequest: function (targetFileName, onload, onerror) {
      let xhr = new XMLHttpRequest();
      xhr.overrideMimeType('application/json');
      xhr.open('GET', `./geojson/${targetFileName}.json`, true);
      xhr.onreadystatechange = this.handleRequestState.bind(this, onload, onerror, xhr);
      xhr.send(null);
    },
    handleRequestState: function (onload, onerror, xhr) {
      try {
        if (xhr.readyState === 4) {
          if (xhr.status === "200" || xhr.status === 200) {
            let textData = xhr.responseText;
            onload(JSON.parse(textData));
          }
          else {
            onerror(new Error('Provided file name does not exists.'));
          }
        }
      }
      catch (ex) {
        onerror(ex);
      }
    }
  };

})(window, document)
