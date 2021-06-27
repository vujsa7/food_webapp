package beans;

import java.util.ArrayList;

public class Restaurant implements IIdentifiable<Integer>{
	
	private int id;
	private String name;
   	private RestaurantType restaurantType;
   	private Boolean isOperating;
   	private byte[] logo;
   	private Location location;
   	private ArrayList<Article> article;
   	private boolean isDeleted;
   	
   	public Restaurant(String name, RestaurantType restaurantType, Boolean isOperating, Location location,
			ArrayList<Article> article, boolean isDeleted) {
   		super();
   		this.id = 0;
		this.name = name;
		this.restaurantType = restaurantType;
		this.isOperating = isOperating;
		this.logo = null;
		this.location = location;
		this.article = article;
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