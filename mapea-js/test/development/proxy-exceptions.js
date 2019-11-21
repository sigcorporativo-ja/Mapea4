import { proxy, map, proxyExceptions, addProxyException } from 'M/mapea';
import { get } from 'M/util/Remote';

map({
  container: 'myMap'
});

// proxy(false);
addProxyException("http://localhost:8080");

get("http://localhost:8080/test/development/proxy-exceptions.html").then((data) => {
  console.log("Llamada a URL local: ");
  console.log(data);
});

get("http://www.google.es").then((data) => {
  console.log("Llamada a URL externa: ");
  console.log(data);
});
