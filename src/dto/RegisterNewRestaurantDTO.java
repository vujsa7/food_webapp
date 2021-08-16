package dto;

import beans.*;

public class RegisterNewRestaurantDTO {
	private String name;
   	private RestaurantType restaurantType;
   	private String logo;
   	private String bannerImage;
   	private String coverImage;
   	private double rating;
   	private Location location;
   	private String manager;
   	
	public RegisterNewRestaurantDTO(String name, RestaurantType restaurantType, String logo, String bannerImage, String coverImage,
			double rating, Location location, String manager) {
		super();
		this.name = name;
		this.restaurantType = restaurantType;
		this.logo = logo;
		this.bannerImage = bannerImage;
		this.coverImage = coverImage;
		this.rating = rating;
		this.location = location;
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

	public double getRating() {
		return rating;
	}

	public void setRating(double rating) {
		this.rating = rating;
	}

	public Location getLocation() {
		return location;
	}

	public void setLocation(Location location) {
		this.location = location;
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
