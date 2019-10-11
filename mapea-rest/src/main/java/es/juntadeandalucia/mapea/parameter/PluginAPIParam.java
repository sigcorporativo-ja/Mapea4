package es.juntadeandalucia.mapea.parameter;

import java.util.List;

public class PluginAPIParam {
   public static final String OBJECT = "object";
   public static final String ARRAY = "array";
   public static final String SIMPLE = "simple";
   public static final String NUMBER = "number";
   public static final String BOOLEAN = "boolean";

   private String type;
   private String name;
   private int position;
   private String value;
   private List<PluginAPIParam> properties;

   public PluginAPIParam(String type, List<PluginAPIParam> properties) {
      this(type, null, properties);
   }

   public PluginAPIParam(String type, String name, List<PluginAPIParam> properties) {
      this(type, name, -1, null, properties);
   }

   public PluginAPIParam(String type, String name, int position) {
      this(type, name, position, null);
   }

   public PluginAPIParam(String type, String name, String value) {
      this(type, name, -1, value);
   }

   public PluginAPIParam(String type, String name, int position, String value) {
      this(type, name, position, value, null);
   }

   public PluginAPIParam(String type, String name, int position, String value, List<PluginAPIParam> properties) {
      this.type = type;
      this.name = name;
      this.position = position;
      this.value = value;
      this.properties = properties;
   }

   public String getType() {
      return type;
   }

   public void setType(String type) {
      this.type = type;
   }

   public String getName() {
      return name;
   }

   public void setName(String name) {
      this.name = name;
   }

   public int getPosition() {
      return position;
   }

   public void setPosition(int position) {
      this.position = position;
   }

   public String getValue() {
      return value;
   }

   public void setValue(String value) {
      this.value = value;
   }

   public List<PluginAPIParam> getProperties() {
      return properties;
   }

   public void setProperties(List<PluginAPIParam> properties) {
      this.properties = properties;
   }
}