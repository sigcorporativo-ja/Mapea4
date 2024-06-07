import {
  // proxy,
  map,
  // proxyExceptions,
  addProxyException,
} from 'M/mapea';
import { get } from 'M/util/Remote';

map({
  container: 'myMap',
});

// proxy(false); // Al descomentar causa que la llamada a google, falle con "code:0"
addProxyException('http://localhost:8080'); // Al comentar, la llamada siguiente de este sufre error 404

get('http://localhost:8080/test/development/proxy-exceptions.html').then((data) => {
  console.log('Llamada a URL local: ', data);
});

get('http://www.google.es').then((data) => {
  console.log('Llamada a URL externa: ', data);
});
