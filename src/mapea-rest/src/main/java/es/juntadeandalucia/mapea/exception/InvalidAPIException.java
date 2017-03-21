package es.juntadeandalucia.mapea.exception;

public class InvalidAPIException extends Exception {

	/**
	 * generated serial version uid
	 */
	private static final long serialVersionUID = -1695148393828513423L;
	
	private final String pluginName;
	
	public InvalidAPIException(String pluginName) {
		super();
		this.pluginName = pluginName;
	}
	
	public InvalidAPIException(String pluginName, String message) {
		super(message);
		this.pluginName = pluginName;
	}
	
	public InvalidAPIException(String pluginName, String message, Throwable t) {
		super(message, t);
		this.pluginName = pluginName;
	}

	public String getPluginName() {
		return pluginName;
	}
}
