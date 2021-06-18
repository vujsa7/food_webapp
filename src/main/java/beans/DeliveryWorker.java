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

}