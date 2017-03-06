package es.juntadeandalucia.mapea.parameter;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

public class PluginAPI {
   private String name;
   private String separator;
   private String constructor;
   private List<PluginAPIParam> parameters;
   private Map<String, List<String>> jsFiles;
   private Map<String, List<String>> cssFiles;
   
   public PluginAPI(String name, String separator, String constructor, List<PluginAPIParam> parameters) {
      this.name = name;
      this.constructor = constructor;
      this.parameters = parameters;
      if (separator != null) {
         this.separator = Pattern.quote(separator);
      }
      this.jsFiles = new HashMap<String, List<String>>();
      this.cssFiles = new HashMap<String, List<String>>();
   }
   
   public void addJSFile(String impl, String jsfile) {
      List<String> jsfiles = this.jsFiles.get(impl);
      if (jsfiles == null) {
         jsfiles = new LinkedList<String>();
         jsFiles.put(impl, jsfiles);
      }
      jsfiles.add(jsfile);
   }
   
   public void addCSSFile(String impl, String cssfile) {
      List<String> cssfiles = this.cssFiles.get(impl);
      if (cssfiles == null) {
         cssfiles = new LinkedList<String>();
         cssFiles.put(impl, cssfiles);
      }
      cssfiles.add(cssfile);
   }

   public String getConstructor () {
      return constructor;
   }

   public void setConstructor (String constructor) {
      this.constructor = constructor;
   }

   public List<PluginAPIParam> getParameters () {
      return parameters;
   }

   public void setParameters (List<PluginAPIParam> parameters) {
      this.parameters = parameters;
   }

   public String getName () {
      return name;
   }

   public void setName (String name) {
      this.name = name;
   }

   public String getSeparator () {
      return separator;
   }

   public void setSeparator (String separator) {
      this.separator = separator;
   }
}
