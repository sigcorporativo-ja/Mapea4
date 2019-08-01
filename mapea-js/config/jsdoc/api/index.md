# Mapea

[Mapea](http://mapea4-sigc.juntadeandalucia.es/) es una herramienta que permite integrar de una forma muy sencilla un visualizador de mapas interactivo en cualquier página web y configurarlo consumiendo ficheros WMC, servicios WMS, servicios WFS, ficheros KML, etc. Además, provee la capacidad de añadir una gran cantidad de herramientas y controles.

Para adaptarse a las necesidades de los usuarios y ser mucho más flexible, Mapea cuenta con dos APIs. De esta manera, es el propio usuario el que selecciona la que más se adapta a las necesidades que necesite cubrir en cada momento:

 - A través de una API REST muy sencilla y documentada permite incluir un visualizador interactivo en cualquier página web sin necesidad de disponer de conocimientos específicos en programación ni en el ámbito de los SIG.
 - A través de una API JavaScript que permite crear desde visualizadores de mapas básico hasta otros de mayor complejidad.

Mapea se presenta como una solución gratuita para la incorporación de clientes de mapas interactivos en nuestras páginas web muy facilmente.

## Componentes

La arquitectura de Mapea está compuesta por los siguientes componentes:

- [mapea-js](/mapea-js) Librería JavaScript que provee una API para facilitar la creación de visores de mapas.
- [mapea-parent](/mapea-parent) Módulo padre que hace uso de maven para compilar y generar el war final de Mapea.
- [mapea-proxy](/mapea-proxy) Proxy para realizar peticiones POST por si el [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) no está habilitado.
- [mapea-rest](/mapea-rest) Servicio Web con API RESTful que genera el código JS necesario para generar un visor con la configuración especificada por parámetros.

## Primeros pasos

Se ha creado una [Wiki](https://github.com/sigcorporativo-ja/Mapea4/wiki/Primeros-pasos) para servir de guía en los primeros pasos, así como para tenerla como referencia de consulta en cualquier momento.

## Navegadores soportados

- EdgeHTML 12+
- Mozilla Firefox 45+
- Goole Chrome 49+

## Dispositivos móviles y SO soportados

- Android 6+
- iOS 9+

## Bugs

A través de [GitHub issue tracker](https://github.com/sigcorporativo-ja/Mapea4/issues) podremos informar de los bugs detectados durante el uso de Mapea o realizar peticiones de nuevas funcionalidades. Antes de crear una petición se recomienda realizar una búsqueda rápida por si ya fue reportada por alguien.
