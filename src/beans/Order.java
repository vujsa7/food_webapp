package beans;

import java.util.*;


public class Order implements IIdentifiable<String> {
	private static final long serialVersionUID = -2670688711225035928L;
	
	private String id;
	private Date dateOfOrder;
	private double price;
	private OrderStatus orderStatus;
   
	private ArrayList<Article> articles;
	private int restaurant;
	private String buyer;
	private boolean isDeleted;
	
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
		return restaurant;
	}
	
	public void setRestaurant(int restaurant) {
		this.restaurant = restaurant;
	}
	
	public String getBuyer() {
		return buyer;
	}
	
	public void setBuyer(String buyer) {
		this.buyer = buyer;
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