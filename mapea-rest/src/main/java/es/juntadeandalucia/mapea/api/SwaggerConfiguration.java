package es.juntadeandalucia.mapea.api;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.Properties;
import java.util.ResourceBundle;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.xml.ws.ServiceMode;

import com.sun.mail.util.BEncoderStream;

import io.swagger.annotations.Contact;
import io.swagger.annotations.ExternalDocs;
import io.swagger.annotations.Info;
import io.swagger.annotations.License;
import io.swagger.annotations.SwaggerDefinition;
import io.swagger.jaxrs.config.BeanConfig;

public class SwaggerConfiguration extends HttpServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 5600924646043336895L;
	private static final String url = ResourceBundle.getBundle("configuration").getString("swagger.url");

	public void init(ServletConfig config) throws ServletException {
		super.init(config);

		BeanConfig beanConfig = new BeanConfig();
		beanConfig.setTitle("Proyecto Mapea");
		beanConfig.setVersion("1.0");
		beanConfig.setSchemes(new String[] { "http" });
		beanConfig.setHost(url);

		beanConfig.setBasePath("/mapea/api");

		beanConfig.setResourcePackage("es.juntadeandalucia.mapea.api");
		beanConfig.setScan(true);

	}

}
