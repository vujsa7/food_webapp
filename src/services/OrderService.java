package services;

import java.io.IOException;
import java.util.*;

import com.google.gson.JsonElement;
import com.google.gson.JsonSyntaxException;

import beans.Order;
import beans.OrderStatus;
import beans.Restaurant;
import dao.OrderDAO;
import dao.RestaurantDAO;
import dto.CreateNewOrderDTO;
import dto.OrderDisplayDTO;

public class OrderService {
	private OrderDAO orderDao;
	private RestaurantDAO restaurantDao;
	
	public OrderService() {
		this.orderDao = new OrderDAO("./files/orders.json");
		this.restaurantDao = new RestaurantDAO("./files/restaurants.json");
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
		Order order = new Order(orderDao.generateId(), date, createNewOrderDTO.getPrice(), OrderStatus.processing, createNewOrderDTO.getArticles(), createNewOrderDTO.getRestaurantId(), createNewOrderDTO.getBuyerId(), false, false);
		orderDao.create(order);
	}

	public Collection<OrderDisplayDTO> getOrdersForUser(String id) throws JsonSyntaxException, IOException {
		ArrayList<Order> allOrders = orderDao.getAllNotDeleted();
		ArrayList<OrderDisplayDTO> userOrders = new ArrayList<OrderDisplayDTO>();
		for(Order o : allOrders) {
			if(o.getBuyer().equals(id)) {
				Restaurant res = restaurantDao.getById(o.getRestaurant());
				userOrders.add(new OrderDisplayDTO(o.getID(), o.getDateOfOrder(), o.getPrice(), o.getOrderStatus(), o.getRestaurant(),
						res.getName(), res.getRestaurantType(), o.getBuyer(), o.isReviewed()));
			}
		}
		return userOrders;
	}

	public Collection<OrderDisplayDTO> getOrdersForRestaurant(int restaurant) throws JsonSyntaxException, IOException {
		// TODO Auto-generated method stub
		ArrayList<Order> allOrders = orderDao.getAllNotDeleted();
		ArrayList<OrderDisplayDTO> userOrders = new ArrayList<OrderDisplayDTO>();
		for(Order o : allOrders) {
			if(o.getRestaurant() == restaurant) {
				Restaurant res = restaurantDao.getById(restaurant);
				userOrders.add(new OrderDisplayDTO(o.getID(), o.getDateOfOrder(), o.getPrice(), o.getOrderStatus(), o.getRestaurant(),
						res.getName(), res.getRestaurantType(), o.getBuyer(), o.isReviewed()));
			}
		}
		return userOrders;
	}

	public Order markForDelivery(String orderId) throws JsonSyntaxException, IOException {
		// TODO Auto-generated method stub
		Order order = orderDao.getById(orderId);
		order.setOrderStatus(OrderStatus.awaitingDelivery);
		orderDao.update(order);
		return order;
	}
}
