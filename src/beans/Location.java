package beans;



public class Location implements java.io.Serializable {
	
	private static final long serialVersionUID = -2271226921874333747L;
	
	private String longitude;
   	private String latitude;
   
   	private Address address;
   	
   	public Location(String longitude, String latitude, Address address) {
   		this.longitude = longitude;
   		this.latitude = latitude;
   		this.address = address;
   	}

	public String getLongitude() {
		return longitude;
	}
	
	public void setLongitude(String longitude) {
		this.longitude = longitude;
	}
	
	public String getLatitude() {
		return latitude;
	}
	
	public void setLatitude(String latitude) {
		this.latitude = latitude;
	}
	
	public Address getAddress() {
		return address;
	}
	
	public void setAddress(Address address) {
		this.address = address;
	}

}