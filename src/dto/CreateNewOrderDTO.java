package dto;

import java.util.ArrayList;

import beans.Article;

public class CreateNewOrderDTO {
	
	private double price;
	private ArrayList<Article> articles;
	private int restaurantId;
	private String buyerId;
	
	public CreateNewOrderDTO(double price, ArrayList<Article> articles, int restaurantId, String buyerId) {
		super();
		this.price = price;
		this.articles = articles;
		this.restaurantId = restaurantId;
		this.buyerId = buyerId;
	}
	public double getPrice() {
		return price;
	}
	public void setPrice(double price) {
		this.price = price;
	}
	public ArrayList<Article> getArticles() {
		return articles;
	}
	public void setArticles(ArrayList<Article> articles) {
		this.articles = articles;
	}
	public int getRestaurantId() {
		return restaurantId;
	}
	public void setRestaurantId(int restaurantId) {
		this.restaurantId = restaurantId;
	}
	public String getBuyerId() {
		return buyerId;
	}
	public void setBuyerId(String buyerId) {
		this.buyerId = buyerId;
	}

	

}
