package es.juntadeandalucia.mapea.builder;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;

import es.juntadeandalucia.mapea.parameter.Parameters;

public class JSBuilder {

   /**
    * Generates the code to create a map with the specified parameters
    * 
    * @param parameters parameters specified by the user
    * @param callbackFn the name of the javascript
    * function to execute as callback
    * @param impl the implementation to use
    * 
    * @return the javascript code
    */
   public static String build (Parameters parameters, String callbackFn) {
      String codeJS;
      
      String constructorJS = getConstructorJS(parameters);
      
      codeJS = "M.".concat(constructorJS);
      
      codeJS = wrapCallback(codeJS, callbackFn);
      return codeJS;
   }

   /**
    * Provides the code to create a map with the parameters
    * specified by the user
    * 
    * @param parameters parameters specified by the user
    * 
    * @return the javascript code
    */
   private static String getConstructorJS (Parameters parameters) {
      StringBuilder constructorJS = new StringBuilder();
      
      constructorJS.append("map(").append(parameters.toJSON()).append(")");
      
      return constructorJS.toString();
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
}
