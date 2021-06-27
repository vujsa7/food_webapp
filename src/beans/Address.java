package beans;


public class Address implements java.io.Serializable{
	
   
	private static final long serialVersionUID = 7886604878078844991L;
	
	private String street;
	private String number;
	private City city;
	
	public Address(String street, String number, City city) {
		this.street = street;
		this.number = number;
		this.city = city;
	}

	public String getStreet() {
		return street;
	}
	
	public void setStreet(String street) {
		this.street = street;
	}

	public String getNumber() {
		return number;
	}

	public void setNumber(String number) {
		this.number = number;
	}

	public City getCity() {
		return city;
	}

	public void setCity(City city) {
		this.city = city;
	}

}