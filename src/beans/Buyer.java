package beans;


import java.util.*;

public class Buyer extends User {

	private static final long serialVersionUID = -333553693946346746L;
	private int points;
	private BuyerType buyerType;
	private int discount;
   
	private ArrayList<Order> orders;
   	private Cart cart;
   
   	public Buyer(String username, String password, String name, String surname, Gender gender, Date dateOfBirth,
			AccountType accountType, boolean isDeleted, boolean isBlocked) {
		super(username, password, name, surname, gender, dateOfBirth, accountType, isDeleted, isBlocked);
		// TODO Auto-generated constructor stub
	}
   	
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

	@Override
	public String getID() {
		// TODO Auto-generated method stub
		return this.getUsername();
	}

	@Override
	public void setID(String id) {
		// TODO Auto-generated method stub
		this.setUsername(id);
	}

	@Override
	public boolean compareTo(String id) {
		// TODO Auto-generated method stub
		boolean isEqual = true;
		if(!this.getUsername().equals(id)) {
			isEqual =  false;
		}
		return isEqual;
	}

   
}