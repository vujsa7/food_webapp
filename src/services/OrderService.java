package services;

import java.io.IOException;
import java.util.*;

import com.google.gson.JsonSyntaxException;

import beans.Order;
import beans.OrderStatus;
import dao.OrderDAO;
import dto.CreateNewOrderDTO;

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

	public void createOrder(CreateNewOrderDTO createNewOrderDTO) throws JsonSyntaxException, IOException {
		Date date = new Date();
		Order order = new Order(orderDao.generateId(), date, createNewOrderDTO.getPrice(), OrderStatus.processing, createNewOrderDTO.getArticles(), createNewOrderDTO.getRestaurantId(), createNewOrderDTO.getBuyerId(), false);
		orderDao.create(order);
	}
}
