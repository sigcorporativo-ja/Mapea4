package es.juntadeandalucia.mapea.bean;

import org.apache.commons.httpclient.Header;
import org.json.JSONObject;

/**
 * This class gives shape to a response retrieved by the
 * Mapea proxy
 * 
 * @author Guadaltel S.A.
 */
public class ProxyResponse {

   private int statusCode;
   private boolean valid;
   private boolean error;
   private String content;
   private String errorMessage;
   private Header[] headers;
   
   public ProxyResponse() {
      this.valid = true;
      this.error = false;
      this.content = "";
      this.errorMessage = "";
      this.headers = new Header[0];
   }

   public int getStatusCode () {
      return statusCode;
   }

   public void setStatusCode (int statusCode) {
      this.statusCode = statusCode;
   }

   public boolean isValid () {
      return valid;
   }

   public void setValid (boolean valid) {
      this.valid = valid;
   }

   public boolean isError () {
      return error;
   }

   public void setError (boolean error) {
      this.error = error;
   }

   public String getContent () {
      return content;
   }

   public void setContent (String content) {
      this.content = content;
   }

   public String getErrorMessage () {
      return errorMessage;
   }

   public void setErrorMessage (String errorMessage) {
      this.errorMessage = errorMessage;
   }
   
   public Header[] getHeaders () {
      return headers;
   }

   public void setHeaders (Header[] headers) {
      this.headers = headers;
   }

   public String toJSON () {
      JSONObject json = new JSONObject();
      
      // status code
      json.put("code", getStatusCode());
      
      // valid
      json.put("valid", isValid());
      
      // error
      json.put("error", isError());
      json.put("message", getErrorMessage());
      
      // content
//      String content = Utils.escape(getContent());
      json.put("content", getContent());
      
      // header
      JSONObject headers = new JSONObject();
      for (Header head : getHeaders()) {
         headers.put(head.getName(), head.getValue());
      }
      json.put("headers", headers);
      
      return json.toString();
   }
}
