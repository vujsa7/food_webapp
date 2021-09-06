package dto;

import beans.*;

public class RegisterNewRestaurantDTO {
	private String name;
   	private RestaurantType restaurantType;
   	private String logo;
   	private String bannerImage;
   	private String coverImage;
   	private String street;
   	private String streetNumber;
   	private String city;
   	private String cityPostalCode;
   	private String manager;

	public RegisterNewRestaurantDTO(String name, RestaurantType restaurantType, String logo, String bannerImage,
			String coverImage, String street, String streetNumber, String city,String cityPostalCode, String manager) {
		super();
		this.name = name;
		this.restaurantType = restaurantType;
		this.logo = logo;
		this.bannerImage = bannerImage;
		this.coverImage = coverImage;
		this.street = street;
		this.streetNumber = streetNumber;
		this.city = city;
		this.cityPostalCode = cityPostalCode;
		this.manager = manager;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public RestaurantType getRestaurantType() {
		return restaurantType;
	}

	public void setRestaurantType(RestaurantType restaurantType) {
		this.restaurantType = restaurantType;
	}

	public String getLogo() {
		return logo;
	}

	public void setLogo(String logo) {
		this.logo = logo;
	}

	public String getBannerImage() {
		return bannerImage;
	}

	public void setBannerImage(String bannerImage) {
		this.bannerImage = bannerImage;
	}

	public String getManager() {
		return manager;
	}

	public void setManager(String manager) {
		this.manager = manager;
	}

	public String getCoverImage() {
		return coverImage;
	}

	public void setCoverImage(String coverImage) {
		this.coverImage = coverImage;
	}

	public String getStreet() {
		return street;
	}

	public void setStreet(String street) {
		this.street = street;
	}

	public String getStreetNumber() {
		return streetNumber;
	}

	public void setStreetNumber(String streetNumber) {
		this.streetNumber = streetNumber;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getCityPostalCode() {
		return cityPostalCode;
	}

	public void setCityPostalCode(String cityPostalCode) {
		this.cityPostalCode = cityPostalCode;
	}
	
}
