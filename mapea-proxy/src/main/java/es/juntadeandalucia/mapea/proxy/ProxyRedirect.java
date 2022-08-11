/**
 * Empresa desarrolladora: GUADALTEL S.A.
 *
 * Autor: Junta de Andalucía
 *
 * Derechos de explotación propiedad de la Junta de Andalucía.
 *
 * Este programa es software libre: usted tiene derecho a redistribuirlo y/o modificarlo bajo los
 * términos de la
 *
 * Licencia EUPL European Public License publicada por el organismo IDABC de la Comisión Europea, en
 * su versión 1.0. o posteriores.
 *
 * Este programa se distribuye de buena fe, pero SIN NINGUNA GARANTÍA, incluso sin las presuntas
 * garantías implícitas de USABILIDAD o ADECUACIÓN A PROPÓSITO CONCRETO. Para mas información
 * consulte la Licencia EUPL European Public License.
 *
 * Usted recibe una copia de la Licencia EUPL European Public License junto con este programa, si
 * por algún motivo no le es posible visualizarla, puede consultarla en la siguiente URL:
 * http://ec.europa.eu/idabc/servlets/Doc?id=31099
 *
 * You should have received a copy of the EUPL European Public License along with this program. If
 * not, see http://ec.europa.eu/idabc/servlets/Doc?id=31096
 *
 * Vous devez avoir reçu une copie de la EUPL European Public License avec ce programme. Si non,
 * voir http://ec.europa.eu/idabc/servlets/Doc?id=30194
 *
 * Sie sollten eine Kopie der EUPL European Public License zusammen mit diesem Programm. Wenn nicht,
 * finden Sie da http://ec.europa.eu/idabc/servlets/Doc?id=29919
 */
/******************************************************************
 * Filename: ProxyRedirect.java Document Type: Java servlet Purpose: This servlet will write the
 * body content of a request to a file. The file name is returned as the response. Set the output
 * directory as servlet init-param in web.xml
 * 
 * License: LGPL as per: http://www.gnu.org/copyleft/lesser.html $Id: ProxyRedirect.java 3650
 * 2007-11-28 00:26:06Z rdewit $
 * 
 * MAMP* Realizadas las modificaciones indicadas por el parche de la página para que funcione con el
 * encoding UTF-8
 * http://jira.codehaus.org/browse/MAP-547?page=com.atlassian.jira.plugin.system.issuetabpanels
 * :all-tabpanel http://jira.codehaus.org/secure/attachment/35062/ProxyRedirect.patch Realizadas las
 * modificaciones indicadas en la página para que funcione con redirecciones
 * http://www.discursive.com/books/cjcook/reference/http-webdav-sect-handle-redirect.html
 **************************************************************************/
package es.juntadeandalucia.mapea.proxy;

// PATCH import java.io.*;
// PATCH import java.util.*;
// PATCH import javax.servlet.*;
// PATCH import javax.servlet.http.*;
// PATCH import org.apache.commons.httpclient.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.apache.http.Header;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.Credentials;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.client.HttpClient;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ByteArrayEntity;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.DefaultHttpRequestRetryHandler;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.protocol.HTTP;
import org.apache.log4j.Logger;

import es.guadaltel.framework.ticket.Ticket;
import es.guadaltel.framework.ticket.TicketFactory;

// PATCH import org.apache.log4j.PropertyConfigurator;
@SuppressWarnings("serial")
// PATCH
public class ProxyRedirect extends HttpServlet {

	private final static Logger log = Logger.getLogger(ProxyRedirect.class);
	private static final Pattern GETINFO_PLAIN_REGEX = Pattern.compile(".*INFO_FORMAT=TEXT(\\/|\\%2F)PLAIN.*",
			Pattern.CASE_INSENSITIVE);
	private static final Pattern GETINFO_GML_REGEX = Pattern
			.compile(".*INFO_FORMAT=APPLICATION(\\/|%2F)VND\\.OGC\\.GML.*", Pattern.CASE_INSENSITIVE);
	private static final Pattern GETINFO_HTML_REGEX = Pattern.compile(".*INFO_FORMAT=TEXT(\\/|\\%2F)HTML.*",
			Pattern.CASE_INSENSITIVE);
	private static final String WWW_AUTHENTICATE = "WWW-Authenticate"; // PATH
	private static final String AUTHORIZATION = "Authorization"; // PATH
	public ServletContext context_ = null;
	private String errorType = "";
	private Integer numMaxRedirects = 5;
	private boolean soap = false;

	/***************************************************************************
	 * Initialize variables called when context is initialized
	 ****************************************************************************/
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		context_ = config.getServletContext();
		log.info("proxysig.ProxyRedirect: context initialized to: " + context_.getServletContextName());
	}

	/***************************************************************************
	 * Process the HTTP Get request
	 ***************************************************************************/
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException {
		String serverUrl = request.getParameter("url");
		// manages a get request if it's the geoprint or getcapabilities operation
		boolean isGeoprint = serverUrl.toLowerCase().contains("mapeaop=geoprint");
		boolean isGetCapabilities = serverUrl.toLowerCase().contains("getcapabilities");
		boolean isGetFeatureInfo = serverUrl.toLowerCase().contains("wmsinfo");
		if (isGeoprint || isGetCapabilities || isGetFeatureInfo) {
			String strErrorMessage = "";
			serverUrl = checkTypeRequest(serverUrl);
			if (!serverUrl.equals("ERROR")) {
				// removes mapeaop parameter
				String url = serverUrl.replaceAll("\\&?\\??mapeaop=geoprint", "");
				url = serverUrl.replaceAll("\\&?\\??mapeaop=getcapabilities", "");
				url = serverUrl.replaceAll("\\&?\\??mapeaop=wmsinfo", "");

				HttpClient client = HttpClientBuilder.create().build();
				HttpGet httpget = null;

				try {
					httpget = new HttpGet(url);
					httpget.setConfig(RequestConfig.custom().setMaxRedirects(numMaxRedirects).build());

					HttpResponse httpResponse = client.execute(httpget);
					// REDIRECTS MANAGEMENT
					if (httpResponse.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
						// PATH_SECURITY_PROXY - AG
						Header[] respHeaders = httpResponse.getAllHeaders();
						int compSize = (int) httpResponse.getEntity().getContentLength();
						ArrayList<Header> headerList = new ArrayList<Header>(Arrays.asList(respHeaders));
						String headersString = headerList.toString();
						boolean checkedContent = checkContent(headersString, compSize, serverUrl);
						// FIN_PATH_SECURITY_PROXY
						if (checkedContent) {
							if (request.getProtocol().compareTo("HTTP/1.0") == 0) {
								response.setHeader("Pragma", "no-cache");
							} else if (request.getProtocol().compareTo("HTTP/1.1") == 0) {
								response.setHeader("Cache-Control", "no-cache");
							}
							response.setDateHeader("Expires", -1);
							// set content-type headers
							if (isGeoprint) {
								response.setContentType("application/json");
							} else if (isGetCapabilities) {
								response.setContentType("text/xml");
							}
							/*
							 * checks if it has requested an getfeatureinfo to modify the response content
							 * type.
							 */
							String requesteredUrl = request.getParameter("url");
							if (GETINFO_PLAIN_REGEX.matcher(requesteredUrl).matches()) {
								response.setContentType("text/plain");
							} else if (GETINFO_GML_REGEX.matcher(requesteredUrl).matches()) {
								response.setContentType("application/gml+xml");
							} else if (GETINFO_HTML_REGEX.matcher(requesteredUrl).matches()) {
								response.setContentType("text/html");
							}
							InputStream st = httpResponse.getEntity().getContent();
							ServletOutputStream sos = response.getOutputStream();
							IOUtils.copy(st, sos);
						} else {
							strErrorMessage += errorType;
							log.error(strErrorMessage);
						}
					} else {
						strErrorMessage = "Unexpected failure: " + httpResponse.getStatusLine().toString();
						log.error(strErrorMessage);
					}
					httpget.releaseConnection();
				} catch (Exception e) {
					log.error("Error al tratar el contenido de la peticion: " + e.getMessage(), e);
				} finally {
					if (httpget != null) {
						httpget.releaseConnection();
					}
				}
			} else {
				String errorXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><error><descripcion>Error en el parametro url de entrada</descripcion></error>";
				response.setContentType("text/xml");
				try {
					PrintWriter out = response.getWriter();
					out.print(errorXML);
					response.flushBuffer();
				} catch (Exception e) {
					log.error(e);
				}
			}
		} else {
			doPost(request, response);
		}
	}

	/***************************************************************************
	 * Process the HTTP Post request
	 ***************************************************************************/
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException {
		boolean checkedContent = false;
		boolean legend = false;
		String strErrorMessage = "";
		String serverUrl = request.getParameter("url");
		log.info("POST param serverUrl: " + serverUrl);
		if (serverUrl.startsWith("legend")) {
			serverUrl = serverUrl.replace("legend", "");
			serverUrl = serverUrl.replace("?", "&");
			serverUrl = serverUrl.replaceFirst("&", "?");
			legend = true;
		}
		serverUrl = checkTypeRequest(serverUrl);
		if (!serverUrl.equals("ERROR")) {
			if (serverUrl.startsWith("http://") || serverUrl.startsWith("https://")) {
				HttpPost httppost = null;
				try {

					String host = System.getProperty("https.proxyHost");
					HttpClientBuilder clientBuilder = HttpClientBuilder.create();
					clientBuilder.setRetryHandler(new DefaultHttpRequestRetryHandler(3, false));

					if (host != null) {
						Integer port = Integer.parseInt(System.getProperty("https.proxyPort"));
						clientBuilder.useSystemProperties();
						String user = System.getProperty("https.proxyUser");
						if (user != null) {
							Credentials credentials = new UsernamePasswordCredentials(user,
									System.getProperty("https.proxyPassword"));
							AuthScope authScope = new AuthScope(host, port);
							CredentialsProvider credsProvider = new BasicCredentialsProvider();
							credsProvider.setCredentials(authScope, credentials);
							clientBuilder.setDefaultCredentialsProvider(credsProvider);
						}
					}
					HttpClient client = clientBuilder.build();
					httppost = new HttpPost(serverUrl);

					// PATH
					Enumeration<?> enume = request.getHeaderNames();
					ArrayList<String> removeHeaders = new ArrayList<String>(Arrays.asList("accept-encoding"));
					while (enume.hasMoreElements()) {
						String name = (String) enume.nextElement();
						String value = request.getHeader(name);
						log.debug("request header:" + name + ":" + value);
						if (!removeHeaders.contains(name.toLowerCase())) {
							httppost.setHeader(name, value);
						}
					}

					// httppost.setDoAuthentication(false);

					// FIN_PATH
					// PATH_MAPEAEDITA_SECURITY - AP
					// PATCH_TICKET_MJM-20112405-POST
					String authorizationValue = request.getHeader(AUTHORIZATION); // ADD_SECURITY_20091210
					if (authorizationValue == null) {
						// The 'Authorization' header must be in this form ->
						// Authorization: Basic <encodedLogin>
						// 'encodedLogin' is a string in the form 'user:pass'
						// that has been encoded by way of the Base64 algorithm.
						// More info on this can be found at
						// http://en.wikipedia.org/wiki/Basic_access_authentication
						String user = (String) request.getSession().getAttribute("user");
						String pass = (String) request.getSession().getAttribute("pass");
						if (user != null && pass != null) {
							String userAndPass = user + ":" + pass;
							String encodedLogin = new String(
									org.apache.commons.codec.binary.Base64.encodeBase64(userAndPass.getBytes()));
							httppost.setHeader(AUTHORIZATION, "Basic " + encodedLogin);
						} else { // MJM - 20110520
							String ticketParameter = request.getParameter("ticket");
							if (ticketParameter != null) {
								ticketParameter = ticketParameter.trim();
								if (!ticketParameter.isEmpty()) {
									Ticket ticket = TicketFactory.createInstance();
									try {
										Map<String, String> props = ticket.getProperties(ticketParameter);
										user = props.get("user");
										pass = props.get("pass");
										String userAndPass = user + ":" + pass;
										String encodedLogin = new String(org.apache.commons.codec.binary.Base64
												.encodeBase64(userAndPass.getBytes()));
										httppost.setHeader(AUTHORIZATION, "Basic " + encodedLogin);
									} catch (Exception e) {
										log.info("-------------------------------------------");
										log.info("EXCEPCTION THROWED BY PROXYREDIRECT CLASS");
										log.info("METHOD: doPost");
										log.info("TICKET VALUE: " + ticketParameter);
										log.info("-------------------------------------------");
									}
								}
							}
						}
					} else {
						httppost.setHeader(AUTHORIZATION, authorizationValue);
					}
					// FIN_PATH_TICKET_MJM-20112405-POST
					// FIN_PATH_MAPEAEDITA_SECURITY - AP
					String body = inputStreamAsString(request.getInputStream());
					HttpEntity bodyEntity = new ByteArrayEntity(body.getBytes("UTF-8"));

//						if (0 == httppost.getParameters().length) {
//							log.debug("No Name/Value pairs found ... pushing as received"); // PATCH
					httppost.setEntity(bodyEntity); // PATCH
//						}

					if (!legend)
						request.setCharacterEncoding("UTF-8");
					if (soap) {
						httppost.setHeader("SOAPAction", serverUrl);
					}
					httppost.removeHeaders(HTTP.CONTENT_LEN);
					HttpResponse httpResponse = client.execute(httppost);
					// PATH_FOLLOW_REDIRECT_POST
					int j = 0;
					String redirectLocation;
					Header[] locationHeader = httpResponse.getHeaders("location");
					while (locationHeader.length != 0 && j < numMaxRedirects) {
						redirectLocation = locationHeader[0].getValue();
						// AGG 20111304 Añadimos el cuerpo de la petición POST a
						// la nueva petición redirigida
						// String bodyPost = httppost.getResponseBodyAsString();
						StringEntity bodyEntityPost = new StringEntity(body);
						httppost.releaseConnection();
						httppost = new HttpPost(redirectLocation);
						// AGG 20110912 Añadidas cabeceras petición SOAP
						if (redirectLocation.toLowerCase().contains("wsdl")) {
							redirectLocation = serverUrl.replace("?wsdl", "");
							httppost.setHeader("SOAPAction", redirectLocation);
							httppost.setHeader("Content-type", "text/xml");
						}
						httppost.setEntity(bodyEntityPost);
						httpResponse = client.execute(httppost);
						locationHeader = httppost.getHeaders("location");
						j++;
					}
					log.info("Number of followed redirections: " + j);
					if (locationHeader != null && j == numMaxRedirects) {
						log.error("The maximum number of redirects (" + numMaxRedirects + ") is exceed.");
					}
					// FIN_PATH_FOLLOW_REDIRECT_POST
					if (log.isDebugEnabled()) {
						Header[] responseHeaders = httpResponse.getAllHeaders();
						for (int i = 0; i < responseHeaders.length; ++i) {
							String headerName = responseHeaders[i].getName();
							String headerValue = responseHeaders[i].getValue();
							log.debug("responseHeaders:" + headerName + "=" + headerValue);
						}
					}
					// dump response to out
					if (httpResponse.getStatusLine().getStatusCode() == HttpStatus.SC_OK) {
						// PATH_SECURITY_PROXY - AG
						Header[] respHeaders = httppost.getAllHeaders();
						int compSize = (int) httpResponse.getEntity().getContentLength();
						ArrayList<Header> headerList = new ArrayList<Header>(Arrays.asList(respHeaders));
						String headersString = headerList.toString();
						checkedContent = checkContent(headersString, compSize, serverUrl);
						// FIN_PATH_SECURITY_PROXY - AG
						if (checkedContent == true) {
							/*
							 * checks if it has requested an getfeatureinfo to modify the response content
							 * type.
							 */
							String requesteredUrl = request.getParameter("url");
							if (GETINFO_PLAIN_REGEX.matcher(requesteredUrl).matches()) {
								response.setContentType("text/plain");
							} else if (GETINFO_GML_REGEX.matcher(requesteredUrl).matches()) {
								response.setContentType("application/gml+xml");
							} else if (GETINFO_HTML_REGEX.matcher(requesteredUrl).matches()) {
								response.setContentType("text/html");
							} else if (requesteredUrl.toLowerCase().contains("mapeaop=geosearch")
									|| requesteredUrl.toLowerCase().contains("mapeaop=geoprint")) {
								response.setContentType("application/json");
							} else {
								response.setContentType("text/xml");
							}
							if (legend) {
								InputStream responseBody = httpResponse.getEntity().getContent();
								String text = new BufferedReader(
										new InputStreamReader(responseBody, StandardCharsets.UTF_8)).lines()
												.collect(Collectors.joining("\n"));
								if (text.contains("ServiceExceptionReport") && serverUrl.contains("LegendGraphic")) {
									response.sendRedirect("Componente/img/blank.gif");
								} else {
									response.setContentLength(text.length());
									PrintWriter out = response.getWriter();
									out.print(text);
									response.flushBuffer();
								}
							} else {
								// Patch_AGG 20112505 Prevents IE cache
								if (request.getProtocol().compareTo("HTTP/1.0") == 0) {
									response.setHeader("Pragma", "no-cache");
								} else if (request.getProtocol().compareTo("HTTP/1.1") == 0) {
									response.setHeader("Cache-Control", "no-cache");
								}
								response.setDateHeader("Expires", -1);
								// END patch
								// Copy request to response
								InputStream st = httpResponse.getEntity().getContent();
								final ServletOutputStream sos = response.getOutputStream();
								IOUtils.copy(st, sos);
							}
						} else {
							strErrorMessage += errorType;
							log.error(strErrorMessage);
						}
					} else if (httpResponse.getStatusLine().getStatusCode() == HttpStatus.SC_UNAUTHORIZED) {
						response.setStatus(HttpStatus.SC_UNAUTHORIZED);
						response.setHeader(WWW_AUTHENTICATE, httpResponse.getHeaders(WWW_AUTHENTICATE)[0].getValue());
					} else {
						InputStream responseBody = httpResponse.getEntity().getContent();
						String text = new BufferedReader(new InputStreamReader(responseBody, StandardCharsets.UTF_8))
								.lines().collect(Collectors.joining("\n"));

						strErrorMessage = "Unexpected failure: ".concat(text);
						log.error("Unexpected failure: " + text);
					}
					httppost.releaseConnection();
					// AGG 20110927 Avoid Throwable (change it with exceptions)
				} catch (Exception e) {
					log.error("Error al tratar el contenido de la peticion: " + e.getMessage(), e);
				} finally {
					if (httppost != null) {
						httppost.releaseConnection();
					}
				}
			} else {
				strErrorMessage += "Only HTTP(S) protocol supported";
				log.error("Only HTTP(S) protocol supported");
				// throw new
				// ServletException("only HTTP(S) protocol supported");
			}
		}
		// There are errors.
		if (!strErrorMessage.equals("") || serverUrl.equals("ERROR")) {
			if (strErrorMessage.equals("") == true) {
				strErrorMessage = "Error en el parametro url de entrada";
			}
			// String errorXML = strErrorMessage;
			String errorXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><error><descripcion>" + strErrorMessage
					+ "</descripcion></error>";
			response.setContentType("text/xml");
			try {
				PrintWriter out = response.getWriter();
				out.print(errorXML);
				response.flushBuffer();
			} catch (Exception e) {
				log.error(e);
			}
		}
		log.info("-------- End POST method --------");
	}

	/***************************************************************************
	 * inputStreamAsString
	 **************************************************************************/
	public static String inputStreamAsString(InputStream stream) throws IOException {
		BufferedReader br = new BufferedReader(new InputStreamReader(stream));
//      BufferedReader br = new BufferedReader(new InputStreamReader(stream, "UTF-8"));

		StringBuilder sb = new StringBuilder();
		String line = null;
		while ((line = br.readLine()) != null) {
			sb.append(line + "\n");
		}
		br.close();
		return sb.toString();
	}

	/*************************************************************************************
	 * checkContentMethodPost - Check content's type and content's length for post
	 * request
	 *************************************************************************************/
	private boolean checkContent(String headersString, int compSize, String serverUrl) {
		boolean resp;
		serverUrl = serverUrl.toUpperCase();
		// Check content's type is xml
		headersString = headersString.toLowerCase();
		if (headersString.contains("content-type") && (headersString.contains("xml")
				|| headersString.contains("image/png") || headersString.contains("gml")
				|| headersString.contains("plain") || headersString.contains("html") || headersString.contains("json")
				|| headersString.contains("wms_xml"))) {
			resp = true;
		} else if (serverUrl.contains("KML")) {
			// KML
			String[] tokens = serverUrl.split("\\&");
			int numTokens = tokens.length;
			if (numTokens == 1) {
				// Check if the beginning is http
				String protocol = serverUrl.toUpperCase().substring(0, 4);
				// Check if the ending is kml
				String extension = serverUrl.toUpperCase().substring(serverUrl.length() - 3, serverUrl.length());
				if (!protocol.equals("HTTP") || !extension.equals("KML")) {
					errorType = "Error en el parametro url de entrada";
					resp = false;
				} else {
					resp = true;
				}
			} else {
				errorType = "Error en el parametro url de entrada";
				resp = false;
			}
		} else {
			errorType = "Error en el contentType de la respuesta";
			resp = false;
		}
		return resp;
	}

	/***************************************************************************
	 * checkTypeRequest - Check the serverurl format.
	 **************************************************************************/
	private String checkTypeRequest(String serverUrl) {
		String serverUrlChecked = "ERROR";
		if (serverUrl.contains("&mapeaop=wmc")) {
			serverUrlChecked = serverUrl.replaceAll("&mapeaop=wmc", "");
			// Check if the beginning is http(s)
			String protocol = serverUrlChecked.toUpperCase().substring(0, 4);
			if (!protocol.equalsIgnoreCase("HTTP") && !protocol.equalsIgnoreCase("HTTPS")) {
				log.debug("ProxyRedirect (mapeaop=wmc) - Protocol=" + protocol);
				serverUrlChecked = "ERROR";
			}
		} else if (serverUrl.contains("&mapeaop=kml")) {
			serverUrlChecked = serverUrl.replaceAll("&mapeaop=kml", "");
			// Check if the beginning is http
			String protocol = serverUrlChecked.toUpperCase().substring(0, 4);
			if (!protocol.equalsIgnoreCase("HTTP") && !protocol.equalsIgnoreCase("HTTPS")) {
				log.debug("ProxyRedirect (mapeaop=kml) - Protocol=" + protocol);
				serverUrlChecked = "ERROR";
			}
		} else if (serverUrl.contains("&mapeaop=wmsfull")) {
			serverUrlChecked = serverUrl.replaceAll("&mapeaop=wmsfull", "");
			String[] tokens = serverUrlChecked.split("\\&");
			int numTokens = tokens.length;
			if (numTokens == 3) {
				// Check if the beginning is http
				String protocol = tokens[0].toUpperCase().substring(0, 4);
				if (!protocol.equals("HTTP")) {
					serverUrlChecked = "ERROR";
					log.debug("ProxyRedirect (mapeaop=wmsfull) - Protocol=" + protocol);
				}
				if (!tokens[1].equals("service=WMS") || !tokens[2].equals("request=GetCapabilities")) {
					serverUrlChecked = "ERROR";
					log.debug("ProxyRedirect (mapeaop=wmsfull) - service=" + tokens[1] + " request=" + tokens[2]);
				} else {
					serverUrlChecked = tokens[0] + "&service=WMS&request=GetCapabilities";
				}
			} else {
				log.debug("ProxyRedirect (mapeaop=wmsfull) - Error en el número de parámetros");
				serverUrlChecked = "ERROR";
			}
		} else if (serverUrl.contains("mapeaop=wmsinfo")) { // GET
			serverUrlChecked = serverUrl.replaceAll("&mapeaop=wmsinfo", "");
			serverUrlChecked = serverUrlChecked.replaceAll("mapeaop=wmsinfo", "");
			String[] tokens = serverUrlChecked.split("\\&");
			int numTokens = tokens.length;
			if (numTokens == 3) { // GetCapabilities
				// Check if the beginning is http
				String protocol = tokens[0].toUpperCase().substring(0, 4);
				if (!protocol.equals("HTTP")) {
					serverUrlChecked = "ERROR";
					log.debug("ProxyRedirect (mapeaop=wmsinfo) - Protocol=" + protocol);
				}
				if (!tokens[1].equals("service=WMS") || !tokens[2].equals("request=GetCapabilities")) {
					serverUrlChecked = "ERROR";
					log.debug("ProxyRedirect (mapeaop=wmsinfo) - service=" + tokens[1] + " request=" + tokens[2]);
				} else {
					serverUrlChecked = tokens[0] + "service=WMS&request=GetCapabilities";
				}
			}
		} else if (serverUrl.contains("mapeaop=geosearch")) {
			serverUrlChecked = serverUrl.replaceAll("&mapeaop=geosearch", "");
			// Check if the beginning is http
			String protocol = serverUrlChecked.toUpperCase().substring(0, 4);
			if (!protocol.equalsIgnoreCase("HTTP")) {
				log.debug("ProxyRedirect (mapeaop=geosearch) - Protocol=" + protocol);
				serverUrlChecked = "ERROR";
			}
		} else if (serverUrl.toLowerCase().contains("legendgraphic")) {
			serverUrlChecked = serverUrl;
		} else if ((serverUrl.toLowerCase().contains("wfst")) || (serverUrl.toLowerCase().contains("wfs"))
				|| (serverUrl.toLowerCase().contains("ows"))) {
			serverUrlChecked = serverUrl;
		} else if (serverUrl.toLowerCase().contains("getcapabilities")) {
			serverUrlChecked = serverUrl;
		} else if (serverUrl.toLowerCase().contains("wsdl")) {
			soap = true;
			serverUrl = serverUrl.replace("?wsdl", "");
			serverUrlChecked = serverUrl;
		} else if (serverUrl.toLowerCase().contains("mapeaop=geoprint")) {
			serverUrlChecked = serverUrl.replaceAll("\\&?\\??mapeaop=geoprint", "");
		}
		return serverUrlChecked;
	}
}