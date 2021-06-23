package beans;

import java.util.ArrayList;

public class DeliveryWorker extends User {
	
	private static final long serialVersionUID = -8732854704760467987L;
	
	private ArrayList<Order> orders;

	public ArrayList<Order> getOrders() {
		return orders;
	}
	
	public void setOrders(ArrayList<Order> orders) {
		this.orders = orders;
	}

}