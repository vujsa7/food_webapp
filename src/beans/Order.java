package beans;

import java.util.*;


public class Order implements IIdentifiable<String> {
	
	private String id;
	private Date dateOfOrder;
	private double price;
	private OrderStatus orderStatus;
   
	private ArrayList<Article> articles;
	private int restaurantId;
	private String buyerId;
	private boolean isDeleted;
	
	public Order() {
		
	}
	
	public Order(String id, Date dateOfOrder, double price, OrderStatus orderStatus, ArrayList<Article> articles,
			int restaurantId, String buyerId, boolean isDeleted) {
		super();
		this.id = id;
		this.dateOfOrder = dateOfOrder;
		this.price = price;
		this.orderStatus = orderStatus;
		this.articles = articles;
		this.restaurantId = restaurantId;
		this.buyerId = buyerId;
		this.isDeleted = isDeleted;
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
	
	public int getRestaurant() {
		return restaurantId;
	}
	
	public void setRestaurant(int restaurantId) {
		this.restaurantId = restaurantId;
	}
	
	public String getBuyer() {
		return buyerId;
	}
	
	public void setBuyer(String buyerId) {
		this.buyerId = buyerId;
	}

	@Override
	public String getID() {
		// TODO Auto-generated method stub
		return this.id;
	}

	@Override
	public void setID(String id) {
		// TODO Auto-generated method stub
		this.id = id;
	}

	@Override
	public boolean compareTo(String id) {
		// TODO Auto-generated method stub
		boolean isEqual = true;
		if(!this.getID().equals(id)) {
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