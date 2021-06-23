package beans;

public class City implements java.io.Serializable{
	
	private static final long serialVersionUID = -8552475115079808845L;
	
	private String name;
   	private String postalCode;
   
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPostalCode() {
		return postalCode;
	}
	public void setPostalCode(String postalCode) {
		this.postalCode = postalCode;
	}
   
}