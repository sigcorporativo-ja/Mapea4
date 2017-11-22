package es.juntadeandalucia.mapea.exception;

public class InvalidResponseException extends Exception {

	/**
	 * generated serial version uid
	 */
	private static final long serialVersionUID = 3639968251236806713L;

	public InvalidResponseException() {
		super();
	}
	
	public InvalidResponseException(String message) {
		super(message);
	}
	
	public InvalidResponseException(String message, Throwable t) {
		super(message, t);
	}

}
