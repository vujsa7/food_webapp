package beans;



public class Location implements java.io.Serializable {
	
	private static final long serialVersionUID = -2271226921874333747L;
	
	private double longitude;
   	private double latitude;
   
   	private Address address;
   	
   	public Location(double longitude, double latitude, Address address) {
   		this.longitude = longitude;
   		this.latitude = latitude;
   		this.address = address;
   	}

	public double getLongitude() {
		return longitude;
	}
	
	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}
	
	public double getLatitude() {
		return latitude;
	}
	
	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}
	
	public Address getAddress() {
		return address;
	}
	
	public void setAddress(Address address) {
		this.address = address;
	}

}