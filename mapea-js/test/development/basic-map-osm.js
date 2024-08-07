import { map } from 'M/mapea';
import OSM from 'M/layer/OSM';

const mapjs = map({
  container: 'map',
  // layers: ['OSM'],
  projection: 'EPSG:3857*m',
  controls: ['overviewmap', 'scale', 'scaleline', 'panzoombar', 'panzoom', 'layerswitcher', 'mouse', 'location'],
});
window.map = mapjs;

mapjs.addLayers([new OSM(
  '',
  // {},
  // {
  //   tileLoadFunction: ((tile, src)=>{
  //       const xhr = new XMLHttpRequest();
  //       xhr.responseType = 'blob';
  //       xhr.addEventListener('loadend', function (evt) {
  //         const data = this.response;
  //         if (data !== undefined) {
  //           tile.getImage().src = URL.createObjectURL(data);
  //         } else {
  //           tile.setState(TileState.ERROR);
  //         }
  //       });
  //       xhr.addEventListener('error', function () {
  //         tile.setState(TileState.ERROR);
  //       });
  //       xhr.open('GET', src);
  //       xhr.send();
  //       console.log('capa cargada OSM');
  //   }),
  // }
)]);
