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
   	private String manager;

	public RegisterNewRestaurantDTO(String name, RestaurantType restaurantType, String logo, String bannerImage,
			String coverImage, String street, String streetNumber, String city, String manager) {
		super();
		this.name = name;
		this.restaurantType = restaurantType;
		this.logo = logo;
		this.bannerImage = bannerImage;
		this.coverImage = coverImage;
		this.street = street;
		this.streetNumber = streetNumber;
		this.city = city;
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
}
