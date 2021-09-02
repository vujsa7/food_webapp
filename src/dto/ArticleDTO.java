package dto;

import beans.ArticleType;

public class ArticleDTO{
	
	private int restaurantId;
	private String oldName;
	private String name;
	private double price;
	private ArticleType articleType;
	private int quantity;
	private String description;
	private String image;
	
	public ArticleDTO(int restaurantId,String oldName, String name, double price, ArticleType articleType,int quantity, String description, String image) {
		super();
		this.restaurantId = restaurantId;
		this.oldName = oldName;
		this.name = name;
		this.price = price;
		this.articleType = articleType;
		this.quantity = quantity;
		this.description = description;
		this.image = image;
	}

	public ArticleDTO() {
		
	}
	
   	public String getName() {
		return name;
	}
   	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getOldName() {
		return oldName;
	}
   	
	public void setOldName(String oldName) {
		this.oldName = oldName;
	}
	
	public double getPrice() {
		return price;
	}
	
	public void setPrice(double price) {
		this.price = price;
	}
	
	public ArticleType getArticleType() {
		return articleType;
	}
	
	public void setArticleType(ArticleType articleType) {
		this.articleType = articleType;
	}
	
	public int getQuantity() {
		return quantity;
	}
	
	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}
	
	public String getDescription() {
		return description;
	}
	
	public void setDescription(String description) {
		this.description = description;
	}
	
	public String getImage() {
		return image;
	}
	
	public void setImage(String image) {
		this.image = image;
	}
	
	public int getRestaurantId() {
		return this.restaurantId;
	}
	
	public void setRestaurantId(int restaurantId) {
		this.restaurantId = restaurantId;
	}
}