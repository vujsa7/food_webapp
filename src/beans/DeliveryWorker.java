package beans;

import java.util.ArrayList;

public class DeliveryWorker extends User {
	
	private ArrayList<Order> orders;

	public ArrayList<Order> getOrders() {
		return orders;
	}
	
	public void setOrders(ArrayList<Order> orders) {
		this.orders = orders;
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