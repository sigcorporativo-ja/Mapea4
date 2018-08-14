import { map } from 'facade/js/mapea';
import WFS from 'facade/js/layer/WFS';
import StyleLine from 'facade/js/style/Line';

window.mapjs = map({
  container: 'map',
});

window.styleline = new StyleLine({
  fill: {
    color: 'red',
  },
});
