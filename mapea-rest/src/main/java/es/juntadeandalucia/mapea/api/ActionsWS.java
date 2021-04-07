package es.juntadeandalucia.mapea.api;

import java.lang.annotation.ElementType;
import java.lang.annotation.Target;
import java.util.ResourceBundle;

import javax.servlet.ServletContext;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.xml.ws.RequestWrapper;

import org.json.JSONArray;
import org.json.JSONObject;

import es.juntadeandalucia.mapea.builder.JSBuilder;
import es.juntadeandalucia.mapea.parameter.PluginAPI;
import es.juntadeandalucia.mapea.plugins.PluginsManager;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.annotations.ApiResponses;
import io.swagger.annotations.Contact;
import io.swagger.annotations.Example;
import io.swagger.annotations.ExampleProperty;
import io.swagger.annotations.ExternalDocs;
import io.swagger.annotations.Info;
import io.swagger.annotations.License;
import io.swagger.annotations.ResponseHeader;
import io.swagger.annotations.SwaggerDefinition;
import io.swagger.annotations.Tag;
import io.swagger.util.Json;
import io.swagger.annotations.ApiResponse;

/**
 * This class manages the available actions an user can execute
 * 
 * @author Guadaltel S.A.
 */

@SwaggerDefinition(info = @Info(description = "Documentación del Rest de Mapea y Mapea iFrame", version = "V0.0", title = "Documentacion Mapea", termsOfService = "Lorem ipsum dolor", contact = @Contact(name = "Name", email = "email", url = "Lorem ipsum dolor"), license = @License(name = "license", url = "Lorem ipsum dolor")),

		externalDocs = @ExternalDocs(value = "External docs", url = "Lorem ipsum dolor"))

@Path("/actions")
@Api(value = "ActionsWS Service", description = "REST para el servicio de proxy")
@Produces("application/javascript")

public class ActionsWS {

	@Context
	private ServletContext context;

	private ResourceBundle versionProperties = ResourceBundle.getBundle("version");
	private ResourceBundle configProperties = ResourceBundle.getBundle("configuration");

	/*
	 * # services services=${services} # theme theme.urls=${theme.urls}
	 * theme.names=${theme.names} # projection projection=${mapea.proj.default}
	 */

	/**
	 * The available actions the user can execute
	 * 
	 * @param callbackFn the name of the javascript function to execute as callback
	 * 
	 * @return the javascript code
	 */

	@GET
	@ApiOperation(value = "", notes = "Las acciones disponibles que el usuario puede ejecutar")
	@Produces("application/javascript")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Solicitud correcta"),
			@ApiResponse(code = 500, message = "Error interno del servidor") })
	public String showAvailableActions(@QueryParam("callback") String callbackFn) {
		JSONArray actions = new JSONArray();

		actions.put("/controls");
		actions.put("/contexts");
		actions.put("/services");
		actions.put("/version");
		actions.put("/themes");
		actions.put("/projection");
		actions.put("/plugins");
		actions.put("/../../doc");

//      actions.put("/apk");

		return JSBuilder.wrapCallback(actions, callbackFn);
	}

	/**
	 * The available controls the user can use
	 * 
	 * @param callbackFn the name of the javascript function to execute as callback
	 * 
	 * @return the javascript code
	 */
	@GET
	@Path("/controls")
	@ApiOperation(value = "", notes = "Los controles disponibles que el usuario puede usar")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Solicitud correcta"),
			@ApiResponse(code = 500, message = "Error interno del servidor") })
	public String showAvailableControls(@QueryParam("callback") String callbackFn) {
		String controlsRaw = configProperties.getString("controls");
		String[] controls = controlsRaw.split(",");

		JSONArray controlsJSON = new JSONArray();

		for (String control : controls) {
			controlsJSON.put(control);
		}

		return JSBuilder.wrapCallback(controlsJSON, callbackFn);
	}

	/**
	 * The available WMC files the user can use
	 * 
	 * @param callbackFn the name of the javascript function to execute as callback
	 * 
	 * @return the javascript code
	 */
	@GET
	@Path("/contexts")
	@ApiOperation(value = "", notes = "Los archivos WMC disponibles que el usuario puede usar")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Solicitud correcta"),
			@ApiResponse(code = 500, message = "Error interno del servidor") })
	public String showAvailableContexts(@QueryParam("callback") String callbackFn) {
		String wmcsRaw = configProperties.getString("wmcs");
		String[] wmcs = wmcsRaw.split(",");

		JSONArray wmcsJSON = new JSONArray();

		for (String wmc : wmcs) {
			wmcsJSON.put(wmc);
		}

		return JSBuilder.wrapCallback(wmcsJSON, callbackFn);
	}

	/**
	 * Returns the available services for the user
	 * 
	 * @param callbackFn the name of the javascript function to execute as callback
	 * 
	 * @return the javascript code
	 */
	@GET
	@Path("/services")
	@ApiOperation(value = "", notes = "Devuelve los servicios disponibles para el usuario")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Solicitud correcta"),
			@ApiResponse(code = 500, message = "Error interno del servidor") })
	public String showAvailableServices(@QueryParam("callback") String callbackFn) {
		String servicesRaw = configProperties.getString("services");
		String[] services = servicesRaw.split(",");

		JSONArray servicesJSON = new JSONArray();

		for (String service : services) {
			servicesJSON.put(service);
		}

		return JSBuilder.wrapCallback(servicesJSON, callbackFn);
	}

	/**
	 * Returns the available themes for the user
	 * 
	 * @param callbackFn the name of the javascript function to execute as callback
	 * 
	 * @return the javascript code
	 */
	@GET
	@Path("/themes")
	@ApiOperation(value = "", notes = "Devuelve los temas disponibles para el usuario.")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Solicitud correcta"),
			@ApiResponse(code = 500, message = "Error interno del servidor") })
	public String showAvailableThemes(@QueryParam("callback") String callbackFn) {
		String themesRaw = configProperties.getString("themes");
		String[] themes = themesRaw.split(",");

		JSONArray themesJSON = new JSONArray();

		for (String theme : themes) {
			themesJSON.put(theme);
		}

		return JSBuilder.wrapCallback(themesJSON, callbackFn);
	}

	/**
	 * Returns the default projection for maps
	 * 
	 * @param callbackFn the name of the javascript function to execute as callback
	 * 
	 * @return the javascript code
	 */
	@GET
	@Path("/projection")
	@ApiOperation(value = "", notes = "Devuelve la proyección predeterminada para mapas.")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Solicitud correcta"),
			@ApiResponse(code = 500, message = "Error interno del servidor") })
	public String showDefaultProjection(@QueryParam("callback") String callbackFn) {
		String projectionRaw = configProperties.getString("projection");
		String[] projection = projectionRaw.split("\\*");

		JSONObject projectionJSON = new JSONObject();
		projectionJSON.put("code", projection[0]);
		projectionJSON.put("units", projection[1]);

		return JSBuilder.wrapCallback(projectionJSON, callbackFn);
	}

	/**
	 * Returns the available plugins for mapea
	 * 
	 * @param callbackFn the name of the javascript function to execute as callback
	 * 
	 * @return the javascript code
	 */
	@GET
	@Path("/plugins")
	@ApiOperation(value = "", notes = "Devuelve los complementos disponibles para mapea")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Solicitud correcta"),
			@ApiResponse(code = 500, message = "Error interno del servidor") })
	public String showAvailablePlugins(@QueryParam("callback") String callbackFn) {
		JSONArray pluginsJSON = new JSONArray();

		PluginsManager.init(context);
		for (PluginAPI plugin : PluginsManager.getAllPlugins()) {
			pluginsJSON.put(plugin.getName());
		}

		return JSBuilder.wrapCallback(pluginsJSON, callbackFn);
	}

	/**
	 * Provides the version number and date of the current build
	 * 
	 * @param callbackFn the name of the javascript function to execute as callback
	 * 
	 * @return the javascript code
	 */

	@GET
	@Path("/version")
	@ApiOperation(value = "", notes = "Proporciona el número de versión y la fecha de la compilación actual.")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Solicitud correcta"),
			@ApiResponse(code = 500, message = "Error interno del servidor") })
	public String showVersion(@QueryParam("callback") String callbackFn) {

		JSONObject version = new JSONObject();

		version.put("number", versionProperties.getString("number"));
		version.put("date", versionProperties.getString("date"));

		return JSBuilder.wrapCallback(version, callbackFn);
	}
}
