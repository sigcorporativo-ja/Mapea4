import { map as Mmap } from 'M/mapea';
import * as EventType from 'M/event/eventtype';

const mapjs = Mmap({
  container: 'map',
  projection: 'EPSG:4326*d',
  layers: ['OSM'],
});

mapjs.getImpl().on(EventType.CHANGE, () => alert('CHANGE'));
mapjs.on(EventType.CHANGE_PROJ, () => alert('CHANGE_PROJ'));

window.mapjs = mapjs;
