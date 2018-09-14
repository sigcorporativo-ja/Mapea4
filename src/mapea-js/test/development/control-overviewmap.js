import { map as Mmap } from 'M/mapea';
import WFS from 'M/layer/WFS';

const mapjs = Mmap({
  container: 'map',
  controls: ['overviewmap'],
});

window.mapjs = mapjs;
