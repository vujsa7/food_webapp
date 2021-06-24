package beans;

import java.util.ArrayList;

public class Restaurant implements IIdentifiable<Integer>{
	
	private static final long serialVersionUID = 774900445589884317L;
	
	private int id;
	private int name;
   	private int restaurantType;
   	private Boolean isOperating;
   	private byte[] logo;
   
   	private Location location;
   	private ArrayList<Article> article;
   	private boolean isDeleted;
   	
   	public Restaurant() {
   		
   	}
   	
   	public Restaurant(int id, int name, int restaurantType, Boolean isOperating, byte[] logo, Location location,
			ArrayList<Article> article, boolean isDeleted) {
		super();
		this.id = id;
		this.name = name;
		this.restaurantType = restaurantType;
		this.isOperating = isOperating;
		this.logo = logo;
		this.location = location;
		this.article = article;
		this.isDeleted = isDeleted;
	}
   	
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