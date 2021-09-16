## Descripción

Plugin de impresión a través del servicio Geoprint. Las capacidades del mismo definen las opciones de impresión disponibles: dpi,
formatos y plantillas. En función de la plantilla elegida, en el construtctor del plugin habrá que incluir los parámetros que dicha
plantilla necesite. Las plantillas 'imagen apaisada' e 'imagen cuadrada' no necesitan parámetros.

## Recursos y uso

- js: https://mapea4-sigc.juntadeandalucia.es/plugins/printer/printer-x.y.z.ol.min.js
- css: https://mapea4-sigc.juntadeandalucia.es/plugins/printer/printer-x.y.z.min.css  

Donde x.y.z representan la versión del plugin a usar según la versión de Mapea, atendiendo a la tabla de compatibilidad de versiones que se muestra más adelante.  

Configuración por defecto sin parámetros:
```javascript
mapajs.addPlugin(new M.plugin.Printer());
```
Establecimiento de parámetros y valores seleccionados por defecto en los selectores:
```javascript
mapajs.addPlugin(new M.plugin.Printer({
  "params": {
    "pages": {
      "creditos": "Impresión generada a través de Mapea"
    },
    "layout": {
      "outputFilename": "mapea_${yyyy-MM-dd_hhmmss}"
    },
  },
  'options': {
      'layout': 'imagen apaisada',
      'format': 'png',
      'dpi': '127'
    }
}));
```

## Ejemplo funcional

[JSFiddle](http://jsfiddle.net/sigcJunta/b6d4hd53/)  

## Observaciones  
Los json que Mapea envía al servidor Geoprint deben cumplir con las siguientes condiciones:  
* Los colores se indican en formato hexadecimal de seis dígitos, sin dígito para transparencia.
* No contener atributos de estilo vacíos.  

## Tabla de compatibilidad de versiones   
[Consulta el api resourcePlugin](https://mapea4-sigc.juntadeandalucia.es/mapea/api/actions/resourcesPlugins?name=printer)
