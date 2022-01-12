# M.plugin.GeosearchByCoordinates

## Api.json

INTEGRACIÓN DE PARÁMETROS EN API REST

OPCIONES:  
1. Nuevo parámetro en la API REST normalmente porque requiera parámetros de configuración.
Example: <url_mapea>?geosearch=[params]
Example: <url_mapea>?printer=[params]

2. Nuevo valor para el parámetro plugins, el plugin no requiere configuración
Example: <url_mapea>?plugins=measurebar,streetview


### Plugin sin parámetros

```
{
   "url": {
      "name": "nombre_plugin"
   },
   "constructor": "M.plugin.nombre_plugin"
}
```
### Plugin con parámetros

```
{
   "url": {
      "name": "geosearch",
      "separator": "*"
   },
   "constructor": "M.plugin.Geosearch",
   "parameters": [{
      "type": "object",
      "properties": [{
         "type": "simple",
         "name": "url",
         "position": 0
      }, {
         "type": "simple",
         "name": "core",
         "position": 1
      }, {
         "type": "simple",
         "name": "handler",
         "position": 2
      }]
   }]
}
```


## Tabla de compatibilidad de versiones   
[Consulta el api resourcePlugin](https://mapea4-sigc.juntadeandalucia.es/mapea/api/actions/resourcesPlugins?name=geosearchbycoordinates)  
