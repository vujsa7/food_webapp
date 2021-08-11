package services;

import java.io.IOException;
import java.util.*;

import com.google.gson.JsonSyntaxException;

import beans.Order;
import dao.OrderDAO;

public class OrderService {
	private OrderDAO orderDao;
	
	public OrderService() {
		this.orderDao = new OrderDAO("./files/orders.json");
	}
	
	public Collection<Order> getOrdersByRestaurantId(int restaurantId) throws JsonSyntaxException, IOException{
		ArrayList<Order> allOrders = orderDao.getAllNotDeleted();
		ArrayList<Order> restaurantOrders = new ArrayList<Order>();
		for(Order o : allOrders) {
			if(o.getRestaurant() == restaurantId) {
				restaurantOrders.add(o);
			}
		}
		return restaurantOrders;
	}
}
