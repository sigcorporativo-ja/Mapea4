package es.juntadeandalucia.mapea.api;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.io.IOUtils;

import es.guadaltel.framework.ticket.Ticket;
import es.guadaltel.framework.ticket.TicketFactory;
import es.juntadeandalucia.mapea.bean.ProxyResponse;
import es.juntadeandalucia.mapea.builder.JSBuilder;

/**
 * This class manages the request from Mapea and it acts
 * as proxy to check security and to skip the CORS limitation
 * 
 * @author Guadaltel S.A.
 */
@Path("/proxy")
@Produces("application/javascript")
public class Proxy {
   
   // Ticket
   private static final String AUTHORIZATION = "Authorization"; 
   public ServletContext context_ = null;

   /**
    * Proxy to execute a request to specified URL using JSONP protocol to avoid the Cross-Domain
    * restriction.
    * 
    * @param url URL of the request
    * @param op type of mapea operation
    * @param callbackFn function to execute as callback
    * 
    * @return the javascript code
    */
   @GET
   public String proxy (
         @QueryParam("url") String url,
         @QueryParam("ticket") String ticket,
         @QueryParam("op") String operation,
         @DefaultValue("GET") @QueryParam("method") String method,
         @QueryParam("callback") String callbackFn) {
      String response;
      ProxyResponse proxyResponse;
      try {
         this.checkRequest(url, operation);
         if (method.equalsIgnoreCase("GET")) {
            proxyResponse = this.get(url, ticket, operation);
         }
         else if (method.equalsIgnoreCase("POST")) {
            proxyResponse = this.post(url, operation);
         }
         else {
            proxyResponse = this.error(url, "Method ".concat(method).concat(" not supported"));
         }
         this.checkResponse(proxyResponse, url, operation);
      }
      catch (HttpException e) {
         // TODO Auto-generated catch block
         proxyResponse = this.error(url, e);
      }
      catch (IOException e) {
         // TODO Auto-generated catch block
         proxyResponse = this.error(url, e);
      }
      response = JSBuilder.wrapCallback(proxyResponse.toJSON(), callbackFn);

      return response;
   }

   /**
    * Sends a GET operation request to the URL and gets its response.
    * 
    * @param url URL of the request
    * @param op type of mapea operation
    * @param ticketParameter user ticket
    *
    * @return the response of the request
    */
   private ProxyResponse get (String url, String ticketParameter, String operation) throws HttpException, IOException {
      ProxyResponse response = new ProxyResponse();
      HttpClient client = new HttpClient();
      GetMethod httpget = new GetMethod(url);
      
      // sets ticket if the user specified one
      if (ticketParameter != null) {
         ticketParameter = ticketParameter.trim();
         if (!ticketParameter.isEmpty()) {
            Ticket ticket = TicketFactory.createInstance();
            try {
               Map<String, String> props = ticket.getProperties(ticketParameter);
               String user = props.get("user");
               String pass = props.get("pass");
               String userAndPass = user + ":" + pass;
               String encodedLogin = new String(
                     org.apache.commons.codec.binary.Base64.encodeBase64(userAndPass.getBytes()));
               httpget.addRequestHeader(AUTHORIZATION, "Basic " + encodedLogin);
            }
            catch (Exception e) {
               System.out.println("-------------------------------------------");
               System.out.println("EXCEPCTION THROWED BY PROXYREDIRECT CLASS");
               System.out.println("METHOD: doPost");
               System.out.println("TICKET VALUE: " + ticketParameter);
               System.out.println("-------------------------------------------");
            }
         }
      }
      
      client.executeMethod(httpget);
      
      int statusCode = httpget.getStatusCode();
      response.setStatusCode(statusCode);
      if (statusCode == HttpStatus.SC_OK) {
         InputStream responseStream = httpget.getResponseBodyAsStream();
         String responseContent = IOUtils.toString(responseStream, "UTF-8");
         response.setContent(responseContent);
      }
      response.setHeaders(httpget.getResponseHeaders());
      return response;
   }
   
   /**
    * Sends a POST operation request to the URL and gets its response.
    * 
    * @param url URL of the request
    * @param op type of mapea operation
    *
    * @return the response of the request
    */
   private ProxyResponse post (String url, String operation) {
      // TODO Auto-generated method stub
      return null;
   }

   /**
    * Checks if the request and the operation are valid.
    * 
    * @param url URL of the request
    * @param op type of mapea operation
    */
   private void checkRequest (String url, String operation) {
      // TODO comprobar
   }
   
   /**
    * Checks if the response is valid for tthe operation and the URL.
    * 
    * @param proxyResponse response got from the request
    * @param url URL of the request
    * @param op type of mapea operation
    */
   private void checkResponse (ProxyResponse proxyResponse, String url, String operation) {
      // TODO Auto-generated method stub
   }

   /**
    * Creates a response error using the specified message.
    * 
    * @param url URL of the request
    * @param message message of the error
    */
   private ProxyResponse error (String url, String message) {
      ProxyResponse proxyResponse = new ProxyResponse();
      proxyResponse.setError(true);
      proxyResponse.setErrorMessage(message);
      return proxyResponse;
   }
   
   /**
    * Creates a response error using the specified exception.
    * 
    * @param url URL of the request
    * @param exception Exception object
    */
   private ProxyResponse error (String url, Exception exception) {
      return error(url, exception.getLocalizedMessage());
   }
}
