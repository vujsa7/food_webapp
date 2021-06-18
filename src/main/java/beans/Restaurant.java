package beans;

import java.util.ArrayList;

public class Restaurant {
	private int name;
   	private int restaurantType;
   	private Boolean isOperating;
   	private byte[] logo;
   
   	private Location location;
   	private ArrayList<Article> article;
   	
	public int getName() {
		return name;
	}
	
	public void setName(int name) {
		this.name = name;
	}
	
	public int getRestaurantType() {
		return restaurantType;
	}
	
	public void setRestaurantType(int restaurantType) {
		this.restaurantType = restaurantType;
	}
	
	public Boolean getIsOperating() {
		return isOperating;
	}
	
	public void setIsOperating(Boolean isOperating) {
		this.isOperating = isOperating;
	}
	
	public byte[] getLogo() {
		return logo;
	}
	
	public void setLogo(byte[] logo) {
		this.logo = logo;
	}
	
	public Location getLocation() {
		return location;
	}
	
	public void setLocation(Location location) {
		this.location = location;
	}
	
	public ArrayList<Article> getArticle() {
		return article;
	}
	
	public void setArticle(ArrayList<Article> article) {
		this.article = article;
	}

}