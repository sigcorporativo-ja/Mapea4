package es.juntadeandalucia.mapea.plugins;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.ws.rs.core.MultivaluedMap;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import es.juntadeandalucia.mapea.builder.JSBuilder;
import es.juntadeandalucia.mapea.parameter.PluginAPI;
import es.juntadeandalucia.mapea.parameter.PluginAPIParam;

public abstract class PluginsManager {
   
   private static Path pluginsDir;
   private static Map<String, List<String>> jsFiles = new HashMap<String, List<String>>();
   private static Map<String, List<String>> cssFiles = new HashMap<String, List<String>>();
   
   private static Map<String, PluginAPI> availablePlugins;

   public static List<String> getPlugins (MultivaluedMap<String, String> queryParams) {
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
   
   public static List<PluginAPI> getPluginsAPI (MultivaluedMap<String, String> queryParams) {
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
            jsfiles.addAll(jsFiles.get(paramName));
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
               jsfiles.addAll(jsFiles.get(pluginName));
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
            cssfiles.addAll(cssFiles.get(paramName));
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
               cssfiles.addAll(cssFiles.get(pluginName));
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
               List<String> jsFilesList = new LinkedList<String>();
               List<String> cssFilesList = new LinkedList<String>();
               File[] files = pluginFolder.listFiles();
               String pluginId = null;
               for (File file : files) {
                  String relativeFile = pluginsDir.relativize(file.toPath()).toString();
                  if (FilenameUtils.isExtension(relativeFile, "js")) {
                     jsFilesList.add(relativeFile);
                  }
                  else if (FilenameUtils.isExtension(relativeFile, "css")) {
                     cssFilesList.add(relativeFile);
                  }
                  else if (FilenameUtils.getBaseName(relativeFile).equalsIgnoreCase("api")) {
                     try {
                        PluginAPI plugin = readPlugin(file);
                        pluginId = plugin.getName();
                        availablePlugins.put(pluginId, plugin);
                     }
                     catch (IOException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                     }
                  }
               }
               if (pluginId != null) {
                  jsFiles.put(pluginId, jsFilesList);
                  cssFiles.put(pluginId, cssFilesList);
               }
            }
         }
      }
   }

   private static PluginAPI readPlugin (File apijsonFile) throws IOException {
      PluginAPI plugin = null;
      String name = null;
      String separator = null;
      String constructor = null;
      List<PluginAPIParam> parameters = new LinkedList<PluginAPIParam>();
      JSONObject apijson = readApiJSONFile(apijsonFile);
      // name and separator
      JSONObject url = apijson.getJSONObject("url");
      name = url.getString("name");
      if (url.has("separator")) {
         separator = url.getString("separator");
      }
      // constructor
      constructor = apijson.getString("constructor");
      // parameters
      if (apijson.has("parameters")) {
         JSONArray parametersArr = apijson.getJSONArray("parameters");
         for (int i = 0; i < parametersArr.length(); i++) {
            PluginAPIParam parameter = null;
            JSONObject parameterJSON = parametersArr.getJSONObject(i);
            parameter = readPluginParameter(parameterJSON);
            parameters.add(parameter);
         }
      }
      plugin = new PluginAPI(name, separator, constructor, parameters);
      return plugin;
   }

   private static PluginAPIParam readPluginParameter (JSONObject parameterJSON) {
      PluginAPIParam pluginParam = null;
      String value = null;
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
      }
      else if (type.equalsIgnoreCase(PluginAPIParam.ARRAY)) {
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
      }
      else if (type.equalsIgnoreCase(PluginAPIParam.SIMPLE)) {
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

   private static JSONObject readApiJSONFile (File apijsonFile) throws IOException {
      JSONObject apiJSON = null;
      String apijson = FileUtils.readFileToString(apijsonFile);
      apiJSON = new JSONObject(apijson);
      return apiJSON;
   }

   public static void init (ServletContext context) {
      if (availablePlugins == null) {
         pluginsDir = Paths.get(context.getRealPath("plugins"));
         readPlugins();
         WatchPluginDir.watch(pluginsDir);
      }
   }
}