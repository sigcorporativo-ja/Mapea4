package es.juntadeandalucia.mapea.api;

import java.util.ResourceBundle;

import javax.servlet.ServletContext;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;

import org.json.JSONArray;
import org.json.JSONObject;

import es.juntadeandalucia.mapea.builder.JSBuilder;
import es.juntadeandalucia.mapea.parameter.PluginAPI;
import es.juntadeandalucia.mapea.plugins.PluginsManager;
import java.io.BufferedReader;
import java.net.HttpURLConnection;
import javax.ws.rs.core.MediaType;
import java.io.InputStreamReader;
import java.net.URL;
import javax.ws.rs.core.Response;
import java.nio.file.Files;
import java.nio.file.Paths;

/**
 * This class manages the available actions an user can execute
 *
 * @author Guadaltel S.A.
 */
@Path("/actions")
@Produces("application/javascript")
public class ActionsWS {

   @Context
   private ServletContext context;

   private ResourceBundle versionProperties = ResourceBundle.getBundle("version");
   private ResourceBundle configProperties = ResourceBundle.getBundle("configuration");

   /*
   # services
   services=${services}
   # theme
   theme.urls=${theme.urls}
   theme.names=${theme.names}
   # projection
   projection=${mapea.proj.default}
   */

   /**
    * The available actions the user can execute
    *
    * @param callbackFn the name of the javascript
    * function to execute as callback
    *
    * @return the javascript code
    */
   @GET
   public String showAvailableActions (@QueryParam("callback") String callbackFn) {
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
    * @param callbackFn the name of the javascript
    * function to execute as callback
    *
    * @return the javascript code
    */
   @GET
   @Path("/controls")
   public String showAvailableControls (@QueryParam("callback") String callbackFn) {
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
    * @param callbackFn the name of the javascript
    * function to execute as callback
    *
    * @return the javascript code
    */
   @GET
   @Path("/contexts")
   public String showAvailableContexts (@QueryParam("callback") String callbackFn) {
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
    * @param callbackFn the name of the javascript
    * function to execute as callback
    *
    * @return the javascript code
    */
   @GET
   @Path("/services")
   public String showAvailableServices (@QueryParam("callback") String callbackFn) {
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
    * @param callbackFn the name of the javascript
    * function to execute as callback
    *
    * @return the javascript code
    */
   @GET
   @Path("/themes")
   public String showAvailableThemes (@QueryParam("callback") String callbackFn) {
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
    * @param callbackFn the name of the javascript
    * function to execute as callback
    *
    * @return the javascript code
    */
   @GET
   @Path("/projection")
   public String showDefaultProjection (@QueryParam("callback") String callbackFn) {
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
    * @param callbackFn the name of the javascript
    * function to execute as callback
    *
    * @return the javascript code
    */
   @GET
   @Path("/plugins")
   public String showAvailablePlugins (@QueryParam("callback") String callbackFn) {
      JSONArray pluginsJSON = new JSONArray();

      PluginsManager.init(context);
      for (PluginAPI plugin : PluginsManager.getAllPlugins()) {
         pluginsJSON.put(plugin.getName());
      }

      return JSBuilder.wrapCallback(pluginsJSON, callbackFn);
   }

   /**
    * Provides the version number and date of the current
    * build
    *
    * @param callbackFn the name of the javascript
    * function to execute as callback
    *
    * @return the javascript code
    */
   @GET
   @Path("/version")
   public String showVersion (@QueryParam("callback") String callbackFn) {

      JSONObject version = new JSONObject();

      version.put("number", versionProperties.getString("number"));
      version.put("date", versionProperties.getString("date"));

      return JSBuilder.wrapCallback(version, callbackFn);
   }

	/**
	 * Provides the JS and CSS resources of the plugins for each version of Mapea
	 *
	 * @param callbackFn
	 *            the name of the javascript function to execute as callback
   * @param name
   *            plugin name to filter
   * @param version
   *            version number Mapea to filter
   * @param type
   *            file type to filter
	 * @return the resources available for the plugins
	 */
	@GET
	@Path("/resourcesPlugins")
	public Response getResourcesPlugins(
			@QueryParam("callback") String callbackFn,
			@QueryParam("name") String name,
			@QueryParam("version") String version,
			@QueryParam("type") String type) {

		Response response = null;

		try {
			String file = new String(Files.readAllBytes(Paths.get(context
					.getRealPath("/WEB-INF/classes/resourcesPlugins.json"))));
			JSONArray allPlugins = (JSONArray) new JSONObject(file)
					.get("plugins");
			JSONArray arrayResults = new JSONArray();
			JSONObject plugin = null;

			Boolean showAllPlugins = false;
			if (name == null) {
				showAllPlugins = true;
			}
			Boolean showAllVersions = false;
			if (version == null) {
				showAllVersions = true;
			}

			for (int i = 0; i < allPlugins.length(); i++) {
				plugin = (JSONObject) allPlugins.get(i);
				String namePlugin = (String) plugin.get("name");
				boolean findPlugin = !showAllPlugins && name.equals(namePlugin);
				if (showAllPlugins || findPlugin) {

					JSONArray versions = (JSONArray) plugin.get("versions");
					JSONObject aux = new JSONObject();
					aux.put("name", namePlugin);
					JSONArray links = new JSONArray();

					for (int j = 0; j < versions.length(); j++) {
						JSONObject resources = (JSONObject) versions.get(j);
						String versionMapea = (String) resources.get("mapea");
						boolean findVersion = !showAllVersions
								&& version.equals(versionMapea);
						if (showAllVersions || findVersion) {
							links.put(resources);
							if (findVersion) {
								break;
							}
						}
					}
					aux.put("resources", links);
					arrayResults.put(aux);
					if (findPlugin) {
						break;
					}
				}
			}

			if (name != null && version != null && type != null) {
				StringBuilder content = new StringBuilder();
				String resourceType = (String) (((JSONArray) arrayResults
						.getJSONObject(0).get("resources")).getJSONObject(0))
						.get(type);

				URL url = new URL(resourceType);
				HttpURLConnection connection = (HttpURLConnection) url
						.openConnection();
				connection.setRequestMethod("GET");

				BufferedReader rd = new BufferedReader(new InputStreamReader(
						connection.getInputStream()));
				String line;

				while ((line = rd.readLine()) != null) {
					content.append(line+"\r\n");
				}
				String mediaType = "application/javascript";
				if(type.equals("css")){
					mediaType="text/css";
				}
				response = Response.ok(null, mediaType)
						.entity(content.toString()).build();
			} else {
				response = Response.ok(null, MediaType.APPLICATION_JSON)
						.entity(arrayResults.toString()).build();
			}

		} catch (Exception e) {
			e.printStackTrace();
			response = Response.status(400).entity("An error has occurred " +e.toString()).build();
		}

		return response;

	}

}
