import GeosearchByCoordinates from 'facade/geosearchbycoordinates';

const map = M.map({
  container: 'mapjs',
});

const mp = new GeosearchByCoordinates();

map.addPlugin(mp);
window.map = map;
