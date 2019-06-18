import { map as Mmap } from 'M/mapea';

const mapjs = Mmap({
  container: 'map',
  bbox: [450137.6602065728, 4079774.2048711563, 480763.617682564, 4100039.975169722],
  // center: [207466.3075900239, 4111805.649363984],
  // zoom: 8,
});

window.mapjs = mapjs;
