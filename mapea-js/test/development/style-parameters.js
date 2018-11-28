import { map as Mmap } from 'M/mapea';
import GeoJSON from 'M/layer/GeoJSON';

const mapjs = Mmap({
  container: 'map',
  controls: ['layerswitcher'],
  wmcfiles: ['callejero'],
  layers: ['GeoJSON*Provincias*http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:Provincias&maxFeatures=50&outputFormat=application/json*FALSE*eyJwYXJhbWV0ZXJzIjpbeyJmaWxsIjp7ImNvbG9yIjoicmdiYSgxMDMsIDE3NSwgMTksIDAuMikiLCJvcGFjaXR5IjowLjR9LCJzdHJva2UiOnsiY29sb3IiOiIjNjdhZjEzIiwid2lkdGgiOjF9LCJyYWRpdXMiOjV9XSwiZGVzZXJpYWxpemVkTWV0aG9kIjoiKChzZXJpYWxpemVkUGFyYW1ldGVycykgPT4gTS5zdHlsZS5TaW1wbGUuZGVzZXJpYWxpemUoc2VyaWFsaXplZFBhcmFtZXRlcnMsICdNLnN0eWxlLlBvbHlnb24nKSkifQ=='],
});



window.mapjs = mapjs;
//
