package es.juntadeandalucia.mapea.api;

import java.util.List;

import javax.servlet.ServletContext;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.UriInfo;

import es.juntadeandalucia.mapea.builder.JSBuilder;
import es.juntadeandalucia.mapea.parameter.Parameters;
import es.juntadeandalucia.mapea.parameter.adapter.ParametersAdapterV3ToV4;
import es.juntadeandalucia.mapea.parameter.parser.ParametersParser;
import es.juntadeandalucia.mapea.plugins.PluginsManager;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.annotations.ResponseHeader;

@Produces("application/javascript; charset=UTF-8") 
@Path("/")
@Api(value = "BuilderWS Service", description = "REST para el servicio de acciones")
public class BuilderWS {

   @Context
   private ServletContext context;
   
   /**
    * Provides the code to build a map using the Javascript
    * API
    * 
    * @param callbackFn the name of the javascript
    * function to execute as callback
    * 
    * @return the javascript code
    */
   @GET
   @Path("/js")
	@ApiOperation(value = "", notes = "Proporciona el código para construir un mapa usando Javascript.")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Solicitud correcta"),
			@ApiResponse(code = 500, message = "Error interno del servidor") })
   public String js(@Context UriInfo uriInfo) {
      MultivaluedMap<String, String> queryParams = uriInfo.getQueryParameters();

      // adapts v3 queries to v4
      ParametersAdapterV3ToV4.adapt(queryParams);
      
      
      Parameters parameters = ParametersParser.parse(queryParams);
      
      // plugins
      PluginsManager.init(context);
      List<String> plugins = PluginsManager.getPlugins(queryParams);
      
      String codeJS = JSBuilder.build(parameters, plugins);

      return codeJS;
   }
}
