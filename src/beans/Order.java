package beans;

import java.util.*;


public class Order implements java.io.Serializable {
	private static final long serialVersionUID = -2670688711225035928L;
	
	private String id;
	private Date dateOfOrder;
	private double price;
	private OrderStatus orderStatus;
   
	private ArrayList<Article> articles;
	private Restaurant restaurant;
	private Buyer buyer;
   
	public String getId() {
		return id;
	}
	
	public void setId(String id) {
		this.id = id;
	}
	
	public Date getDateOfOrder() {
		return dateOfOrder;
	}
	
	public void setDateOfOrder(Date dateOfOrder) {
		this.dateOfOrder = dateOfOrder;
	}
	
	public double getPrice() {
		return price;
	}
	
	public void setPrice(double price) {
		this.price = price;
	}
	
	public OrderStatus getOrderStatus() {
		return orderStatus;
	}
	
	public void setOrderStatus(OrderStatus orderStatus) {
		this.orderStatus = orderStatus;
	}
	
	public ArrayList<Article> getArticles() {
		return articles;
	}
	
	public void setArticles(ArrayList<Article> articles) {
		this.articles = articles;
	}
	
	public Restaurant getRestaurant() {
		return restaurant;
	}
	
	public void setRestaurant(Restaurant restaurant) {
		this.restaurant = restaurant;
	}
	
	public Buyer getBuyer() {
		return buyer;
	}
	
	public void setBuyer(Buyer buyer) {
		this.buyer = buyer;
	}
   
   
   
}