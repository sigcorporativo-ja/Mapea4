const map = M.map({
  container: 'map',
  controls: ['layerswitcher'],
  projection: 'EPSG:3857*m',
  layers: ['OSM'],
});

function load() {
  const input = document.querySelector('#file-input');
  if (input.files.length > 0) {
    const file = input.files[0];
    const mbtiles = new M.layer.MBTiles({
      name: file.name,
      legend: file.name,
      source: file,
    });
    map.addLayers(mbtiles);
  } else {
    M.dialog.info('No hay fichero adjuntado.');
  }
}

document.body.onload = () => document.querySelector('#load-button').addEventListener('click', load);
