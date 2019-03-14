import { map as Mmap } from 'M/mapea';

const mapjs = Mmap({
  container: 'map',
  controls: ['layerswitcher', 'scale', 'scaleline', 'mouse'],
  wmcfile: ['callejero', 'ortofoto'],
  bbox: '230193,4134494,245972,4146730',
});

window.mapjs = mapjs;
