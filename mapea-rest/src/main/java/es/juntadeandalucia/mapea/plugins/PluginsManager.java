package es.juntadeandalucia.mapea.plugins;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import javax.servlet.ServletContext;
import javax.ws.rs.core.MultivaluedMap;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import es.juntadeandalucia.mapea.builder.JSBuilder;
import es.juntadeandalucia.mapea.exception.InvalidAPIException;
import es.juntadeandalucia.mapea.parameter.PluginAPI;
import es.juntadeandalucia.mapea.parameter.PluginAPIParam;

public abstract class PluginsManager {
   private static Path pluginsDir;
   private static final String DEFAULT_IMPL = "ol";
   private static Map<String, PluginAPI> availablePlugins;
   private static final Logger log = Logger.getLogger(PluginsManager.class);

   public static Collection<PluginAPI> getAllPlugins() {
      return availablePlugins.values();
   }

   public static List<String> getPlugins(MultivaluedMap<String, String> queryParams) {
      List<String> plugins = new LinkedList<String>();
      if (availablePlugins != null) {
         // searchs plugins by name
         for (String paramName : queryParams.keySet()) {
            PluginAPI plugin = availablePlugins.get(paramName);
            if (plugin != null) {
               String paramValue = queryParams.getFirst(paramName);
               String pluginStr = JSBuilder.createPlugin(plugin, paramValue);
               plugins.add(pluginStr);
            }
         }
         // search plugins in "plugins" parameter
         String pluginsParam = queryParams.getFirst("plugins");
         if (pluginsParam != null) {
            String[] pluginNames = pluginsParam.split(",");
            for (String pluginName : pluginNames) {
               PluginAPI plugin = availablePlugins.get(pluginName);
               if (plugin != null) {
                  String pluginStr = JSBuilder.createPlugin(plugin);
                  plugins.add(pluginStr);
               }
            }
         }
      }
      return plugins;
   }

   public static List<PluginAPI> getPluginsAPI(MultivaluedMap<String, String> queryParams) {
      List<PluginAPI> pluginsAPI = new LinkedList<PluginAPI>();
      if (availablePlugins != null) {
         // searchs plugins by name
         for (String paramName : queryParams.keySet()) {
            PluginAPI plugin = availablePlugins.get(paramName);
            if (plugin != null) {
               pluginsAPI.add(plugin);
            }
         }
         // search plugins in "plugins" parameter
         String pluginsParam = queryParams.getFirst("plugins");
         if (pluginsParam != null) {
            String[] pluginNames = pluginsParam.split(",");
            for (String pluginName : pluginNames) {
               PluginAPI plugin = availablePlugins.get(pluginName);
               if (plugin != null) {
                  pluginsAPI.add(plugin);
               }
            }
         }
      }
      return pluginsAPI;
   }

   public static String[] getJSFiles(Map<String, String[]> queryParams) {
      List<String> jsfiles = new LinkedList<String>();
      // searchs plugins by name
      for (String paramName : queryParams.keySet()) {
         PluginAPI plugin = availablePlugins.get(paramName);
         if (plugin != null) {
            jsfiles.addAll(plugin.getJSFiles(DEFAULT_IMPL));
         }
      }
      // search plugins in "plugins" parameter
      String[] pluginsParams = queryParams.get("plugins");
      if (pluginsParams != null) {
         String pluginsParam = pluginsParams[0];
         String[] pluginNames = pluginsParam.split(",");
         for (String pluginName : pluginNames) {
            PluginAPI plugin = availablePlugins.get(pluginName);
            if (plugin != null) {
               jsfiles.addAll(plugin.getJSFiles(DEFAULT_IMPL));
            }
         }
      }
      return jsfiles.toArray(new String[jsfiles.size()]);
   }

   public static String[] getCSSFiles(Map<String, String[]> queryParams) {
      List<String> cssfiles = new LinkedList<String>();
      // searchs plugins by name
      for (String paramName : queryParams.keySet()) {
         PluginAPI plugin = availablePlugins.get(paramName);
         if (plugin != null) {
            cssfiles.addAll(plugin.getCSSFiles(DEFAULT_IMPL));
         }
      }
      // search plugins in "plugins" parameter
      String[] pluginsParams = queryParams.get("plugins");
      if (pluginsParams != null) {
         String pluginsParam = pluginsParams[0];
         String[] pluginNames = pluginsParam.split(",");
         for (String pluginName : pluginNames) {
            PluginAPI plugin = availablePlugins.get(pluginName);
            if (plugin != null) {
               cssfiles.addAll(plugin.getCSSFiles(DEFAULT_IMPL));
            }
         }
      }
      return cssfiles.toArray(new String[cssfiles.size()]);
   }

   public static void readPlugins() {
      availablePlugins = new HashMap<String, PluginAPI>();
      File pluginsFolder = pluginsDir.toFile();
      String[] plugins = pluginsFolder.list();
      if (plugins != null) {
         for (String pluginName : plugins) {
            File pluginFolder = new File(pluginsFolder, pluginName);
            if (pluginFolder.isDirectory()) {
               for (File file : pluginFolder.listFiles()) {
                  String relativeFile = pluginsDir.relativize(file.toPath()).toString();
                  if (FilenameUtils.getBaseName(relativeFile).equalsIgnoreCase("api")) {
                     try {
                        PluginAPI plugin = readPluginFromApi(file);
                        availablePlugins.put(plugin.getName(), plugin);
                        break;
                     } catch (IOException e) {
                        log.error("Error occurred reading plugins directory", e);
                     } catch (InvalidAPIException e) {
                        log.error("Invalid JSON API from plugin '" + e.getPluginName() + "'", e);
                     }
                  }
               }
            }
         }
      }
   }

   private static PluginAPI readPluginFromApi(File apiJSONFile) throws IOException, InvalidAPIException {
      PluginAPI pluginAPI = null;
      JSONObject apiJSON = readApiJSONFile(apiJSONFile);
      List<PluginAPIParam> parameters = new LinkedList<PluginAPIParam>();
      String name = readStringProperty("url.name", apiJSON);
      String separator = readStringProperty("url.separator", apiJSON);
      String constructor = readStringProperty("constructor", apiJSON);
      if (name == null || constructor == null) {
         throw new InvalidAPIException((name == null || name.isEmpty() ? apiJSONFile.getParent() : name),
               "Invalid ApiJSON file format: name or constructor cannot be null or empty");
      }
      if (apiJSON.has("parameters") && !apiJSON.isNull("parameters")
            && apiJSON.get("parameters") instanceof JSONArray) {
         JSONArray jsonParameters = apiJSON.getJSONArray("parameters");
         for (int i = 0; i < jsonParameters.length(); i++) {
            parameters.add(readPluginParameter(jsonParameters.getJSONObject(i)));
         }
      }
      pluginAPI = new PluginAPI(name, separator, constructor, parameters);
      if (apiJSON.has("files") && !apiJSON.isNull("files") && apiJSON.get("files") instanceof JSONObject) {
         JSONObject files = apiJSON.getJSONObject("files");
         @SuppressWarnings("unchecked")
         Iterator<String> keys = (Iterator<String>) files.keys();
         while (keys.hasNext()) {
            String impl = keys.next();
            List<String> scripts = readJSONArray("files.".concat(impl).concat(".scripts"), apiJSON);
            List<String> styles = readJSONArray("files.".concat(impl).concat(".styles"), apiJSON);
            if (scripts != null) {
               for (String script : scripts) {
                  pluginAPI.addJSFile(impl, pluginAPI.getName().concat(File.separator).concat(script));
               }
            }
            if (styles != null) {
               for (String style : styles) {
                  pluginAPI.addCSSFile(impl, pluginAPI.getName().concat(File.separator).concat(style));
               }
            }
         }
      }
      return pluginAPI;
   }

   private static String readStringProperty(String property, JSONObject object) {
      JSONObject obj = getNestedJSONObject(property, object);
      if (obj == null) {
         return null;
      }
      return obj.getString(property.substring(property.lastIndexOf('.') + 1, property.length()));
   }

   private static List<String> readJSONArray(String property, JSONObject object) {
      JSONArray array = getNestedJSONObject(property, object)
            .getJSONArray(property.substring(property.lastIndexOf(".") + 1, property.length()));
      List<String> resultList = new ArrayList<>();
      if (array == null) {
         return null;
      }
      for (int i = 0; i < array.length(); i++) {
         resultList.add(array.getString(i));
      }
      return resultList;
   }

   private static JSONObject getNestedJSONObject(String property, JSONObject object) {
      String[] splitted = property.split("\\.");
      String prop = splitted[0];
      if (!object.has(prop) || object.isNull(prop)) {
         return null;
      }
      if (splitted.length > 0 && object.get(prop) instanceof JSONObject) {
         return getNestedJSONObject(property.substring(property.indexOf(prop) + prop.length() + 1, property.length()),
               object.getJSONObject(prop));
      }
      return object;
   }

   private static PluginAPIParam readPluginParameter(JSONObject parameterJSON) {
      PluginAPIParam pluginParam = null;
      String value = null;
      Integer intValue = null;
      String name = null;
      int position = -1;
      List<PluginAPIParam> properties = new LinkedList<PluginAPIParam>();
      String type = parameterJSON.getString("type");
      if (type.equalsIgnoreCase(PluginAPIParam.OBJECT)) {
         // name
         if (parameterJSON.has("name")) {
            name = parameterJSON.getString("name");
         }
         // properties
         if (parameterJSON.has("properties")) {
            JSONArray propertiesArr = parameterJSON.getJSONArray("properties");
            for (int i = 0; i < propertiesArr.length(); i++) {
               JSONObject propertyJSON = propertiesArr.getJSONObject(i);
               PluginAPIParam property = readPluginParameter(propertyJSON);
               properties.add(property);
            }
         }
         pluginParam = new PluginAPIParam(type, name, properties);
      } else if (type.equalsIgnoreCase(PluginAPIParam.ARRAY)) {
         // properties
         if (parameterJSON.has("properties")) {
            JSONArray propertiesArr = parameterJSON.getJSONArray("properties");
            for (int i = 0; i < propertiesArr.length(); i++) {
               JSONObject propertyJSON = propertiesArr.getJSONObject(i);
               PluginAPIParam property = readPluginParameter(propertyJSON);
               properties.add(property);
            }
         }
         pluginParam = new PluginAPIParam(type, properties);
      } else if (type.equalsIgnoreCase(PluginAPIParam.SIMPLE)) {
         // name
         if (parameterJSON.has("name")) {
            name = parameterJSON.getString("name");
         }
         // value
         if (parameterJSON.has("value")) {
            value = parameterJSON.getString("value");
         }
         // position
         if (parameterJSON.has("position")) {
            position = parameterJSON.getInt("position");
         }
         pluginParam = new PluginAPIParam(type, name, position, value);
      } else if (type.equalsIgnoreCase(PluginAPIParam.NUMBER)) {
         // name
         if (parameterJSON.has("name")) {
            name = parameterJSON.getString("name");
         }
         // value
         if (parameterJSON.has("value")) {
            value = parameterJSON.getString("value");
         }
         // position
         if (parameterJSON.has("position")) {
            position = parameterJSON.getInt("position");
         }
         pluginParam = new PluginAPIParam(type, name, position, value);
      } else if (type.equalsIgnoreCase(PluginAPIParam.BOOLEAN)) {
         // name
         if (parameterJSON.has("name")) {
            name = parameterJSON.getString("name");
         }
         // value
         if (parameterJSON.has("value")) {
            value = parameterJSON.getString("value");
         }
         // position
         if (parameterJSON.has("position")) {
            position = parameterJSON.getInt("position");
         }
         pluginParam = new PluginAPIParam(type, name, position, value);
      }
      return pluginParam;
   }

   private static JSONObject readApiJSONFile(File apijsonFile) throws IOException {
      JSONObject apiJSON = null;
      String apijson = FileUtils.readFileToString(apijsonFile);
      apiJSON = new JSONObject(apijson);
      return apiJSON;
   }

   public static void init(ServletContext context) {
      if (availablePlugins == null) {
         pluginsDir = Paths.get(context.getRealPath("plugins"));
         readPlugins();
         WatchPluginDir.watch(pluginsDir);
      }
   }
}