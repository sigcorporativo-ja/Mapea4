import { map as Mmap } from 'M/mapea';
import * as template from 'M/util/Template';

const mapjs = Mmap({
  container: 'map',
});

window.mapjs = mapjs;

template.add('s', (s) => console.log());

window.template = template;
