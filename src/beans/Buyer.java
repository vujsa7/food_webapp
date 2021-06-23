package beans;


import java.util.*;

public class Buyer extends User {
	
	private static final long serialVersionUID = -333553693946346746L;
	private int points;
	private BuyerType buyerType;
	private int discount;
   
	private ArrayList<Order> orders;
   	private Cart cart;
   
	public int getPoints() {
		return points;
	}
	
	public void setPoints(int points) {
		this.points = points;
	}
	
	public BuyerType getBuyerType() {
		return buyerType;
	}
	
	public void setBuyerType(BuyerType buyerType) {
		this.buyerType = buyerType;
	}
	
	public int getDiscount() {
		return discount;
	}
	
	public void setDiscount(int discount) {
		this.discount = discount;
	}
	
	public ArrayList<Order> getOrder() {
		return orders;
	}
	
	public void setOrder(ArrayList<Order> orders) {
		this.orders = orders;
	}
	
	public Cart getCart() {
		return cart;
	}
	
	public void setCart(Cart cart) {
		this.cart = cart;
	}

   
}