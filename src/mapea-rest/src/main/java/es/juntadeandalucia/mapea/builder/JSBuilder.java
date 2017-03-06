package es.juntadeandalucia.mapea.builder;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import es.juntadeandalucia.mapea.parameter.Parameters;
import es.juntadeandalucia.mapea.parameter.PluginAPI;
import es.juntadeandalucia.mapea.parameter.PluginAPIParam;

public class JSBuilder {

   /**
    * Generates the code to create a map with the specified parameters
    * 
    * @param parameters parameters specified by the user
    * @param plugins 
    * @param callbackFn the name of the javascript
    * function to execute as callback
    * @param impl the implementation to use
    * 
    * @return the javascript code
    */
   public static String build (Parameters parameters, List<String> plugins) {
      StringBuilder codeJS = new StringBuilder();
      
      // M.map({..<params>..})
      codeJS.append("M.map(").append(parameters.toJSON()).append(")");
      
      // add plugins with .addPlugin(...)
      for (String plugin : plugins) {
         addPlugin(codeJS, plugin);
      }
      
      wrapCallback(codeJS, parameters.getCallbackFn());
      
      return codeJS.toString();
   }
   
   private static void addPlugin (StringBuilder codeJS, String plugin) {
      codeJS.append(".addPlugin(").append(plugin).append(")");
   }

   /**
    * Wraps the javascript code to execute it as parameter of the specified function
    * 
    * @param code the javascript code to execute it as parameter
    * 
    * @param callbackFn the name of the javascript
    * function to execute as callback
    * 
    * @return the execution of the callback with the javascript code as parameter
    */
   public static void wrapCallback (StringBuilder code, String callbackFn) {
      // if no callback function was specified do not wrap the code
      if (!StringUtils.isEmpty(callbackFn)) {
         code.insert(0, "(").insert(0, callbackFn);
         code.append(");");
      }
   }

   /**
    * Wraps the JSON array to execute it as parameter of the specified function
    * 
    * @param jsonArray the JSON array to execute it as parameter
    * 
    * @param callbackFn the name of the javascript
    * function to execute as callback
    * 
    * @return the execution of the callback with the JSON array as parameter
    */
   public static String wrapCallback (JSONArray jsonArray, String callbackFn) {
      return wrapCallback(jsonArray.toString(), callbackFn);
   }
   
   /**
    * Wraps the JSON to execute it as parameter of the specified function
    * 
    * @param json the JSON to execute it as parameter
    * 
    * @param callbackFn the name of the javascript
    * function to execute as callback
    * 
    * @return the execution of the callback with the JSON as parameter
    */
   public static String wrapCallback (JSONObject json, String callbackFn) {
      return wrapCallback(json.toString(), callbackFn);
   }
   
   /**
    * Wraps the javascript code to execute it as parameter of the specified function
    * 
    * @param code the javascript code to execute it as parameter
    * 
    * @param callbackFn the name of the javascript
    * function to execute as callback
    * 
    * @return the execution of the callback with the javascript code as parameter
    */
   public static String wrapCallback (String code, String callbackFn) {
      String wrappedCode = code;
      // if no callback function was specified do not wrap the code
      if (!StringUtils.isEmpty(callbackFn)) {
         StringBuilder wrapBuilder = new StringBuilder();
         wrapBuilder.append(callbackFn).append("(").append(code).append(");");
         wrappedCode = wrapBuilder.toString();
      }
      return wrappedCode;
   }

   public static String createPlugin (PluginAPI plugin) {
      return createPlugin(plugin, null);
   }
   
   public static String createPlugin (PluginAPI plugin, String paramValue) {
      StringBuilder pluginBuilder = new StringBuilder();
      
      String[] paramValues = null;
      String separator = plugin.getSeparator();
      if (!StringUtils.isEmpty(paramValue) && (separator != null)) {
         paramValues = paramValue.split(separator);
      }
      else if (!StringUtils.isEmpty(paramValue)) {
         paramValues = new String[1];
         paramValues[0] = paramValue;
      }
      
      pluginBuilder.append("new ").append(plugin.getConstructor());
      pluginBuilder.append("(");
      
      List<PluginAPIParam> pluginAPIParams = plugin.getParameters();
      if (pluginAPIParams != null) {
         for (int i = 0; i < pluginAPIParams.size(); i++) {
            PluginAPIParam pluginAPIParam = pluginAPIParams.get(i);
            pluginBuilder.append(readPluginParameter(pluginAPIParam, paramValues));
            if (i < (pluginAPIParams.size() - 1)) {
               pluginBuilder.append(",");
            }
         }
      }
      
      pluginBuilder.append(")");
      
      return pluginBuilder.toString();
   }

   private static Object readPluginParameter (PluginAPIParam pluginAPIParam, String[] paramValues) {
      Object pluginParam = null;
      
      int position = pluginAPIParam.getPosition();
      String value = pluginAPIParam.getValue();
      List<PluginAPIParam> properties = pluginAPIParam.getProperties();
      
      String type = pluginAPIParam.getType();
      if (type.equalsIgnoreCase(PluginAPIParam.OBJECT)) {
         pluginParam = new JSONObject();
         if (properties != null) {
            for (PluginAPIParam property : properties) {
               Object propertyValue = readPluginParameter(property, paramValues);
               if (propertyValue != null) {
                  ((JSONObject)pluginParam).put(property.getName(), propertyValue);
               }
            }
         }
      }
      else if (type.equalsIgnoreCase(PluginAPIParam.ARRAY)) {
         pluginParam = new JSONArray();
         if (properties != null) {
            for (int i = 0; i < properties.size(); i++) {
               PluginAPIParam property = properties.get(i);
               Object elementValue = readPluginParameter(property, paramValues);
               if (elementValue != null) {
                  ((JSONArray)pluginParam).put(elementValue);
               }
            }
         }
      }
      else if (type.equalsIgnoreCase(PluginAPIParam.SIMPLE)) {
         if (value != null) {
            pluginParam = value;
         }
         else if ((position != -1) && (paramValues != null)
               && (paramValues.length > position)) {
            pluginParam = paramValues[position];
         }
      }
      
      return pluginParam;
   }
}
