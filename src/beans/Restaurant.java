package beans;

import java.util.ArrayList;

public class Restaurant implements IIdentifiable<Integer>{
	
	private int id;
	private String name;
   	private RestaurantType restaurantType;
   	private Boolean isOpen;
   	private String logo;
   	private String bannerImage;
   	private double rating;
   	private Location location;
   	private ArrayList<Article> articles;
   	private boolean isDeleted;
   	
   	public Restaurant(String name, RestaurantType restaurantType, Boolean isOpen, Location location, String logo, String bannerImage, double rating,
			ArrayList<Article> articles, boolean isDeleted) {
   		super();
		this.name = name;
		this.restaurantType = restaurantType;
		this.isOpen = isOpen;
		this.logo = logo;
		this.bannerImage = bannerImage;
		this.rating = rating;
		this.location = location;
		this.articles = articles;
		this.isDeleted = isDeleted;
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
	
	public Boolean getIsOpen() {
		return isOpen;
	}
	
	public void setIsOpen(Boolean isOpen) {
		this.isOpen = isOpen;
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
	
	public ArrayList<Article> getArticles() {
		return articles;
	}
	
	public void setArticles(ArrayList<Article> articles) {
		this.articles = articles;
	}
	
	public void addArticle(Article article) {
		this.articles.add(article);
	}

	@Override
	public Integer getID() {
		// TODO Auto-generated method stub
		return this.id;
	}

	@Override
	public void setID(Integer id) {
		// TODO Auto-generated method stub
		this.id = id;
	}

	@Override
	public boolean compareTo(Integer id) {
		// TODO Auto-generated method stub
		boolean isEqual = true;
		if(!(this.id == id)) {
			isEqual = false;
		}
		return isEqual;
	}

	@Override
	public void setDeleted(boolean value) {
		// TODO Auto-generated method stub
		this.isDeleted = value;
	}

	@Override
	public boolean isDeleted() {
		// TODO Auto-generated method stub
		return this.isDeleted;
	}

	

	
}