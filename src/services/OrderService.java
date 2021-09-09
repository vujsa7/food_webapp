package services;

import java.io.IOException;
import java.util.*;

import com.google.gson.JsonElement;
import com.google.gson.JsonSyntaxException;

import beans.Buyer;
import beans.BuyerType;
import beans.Order;
import beans.OrderStatus;
import beans.Restaurant;
import beans.User;
import dao.OrderDAO;
import dao.RestaurantDAO;
import dao.UserDAO;
import dto.CreateNewOrderDTO;
import dto.OrderDisplayDTO;
import dto.OrderStatsDTO;

public class OrderService {
	private UserDAO userDao;
	private OrderDAO orderDao;
	private RestaurantDAO restaurantDao;
	
	public OrderService() {
		this.userDao = new UserDAO("./files/users.json");
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
		addPointsToBuyer(createNewOrderDTO.getPrice(), createNewOrderDTO.getBuyerId());
		orderDao.create(order);
	}

	private void addPointsToBuyer(double orderPrice, String buyerId) throws JsonSyntaxException, IOException {
		Buyer buyer = (Buyer) userDao.getById(buyerId);
		int newPoints = (int) Math.round((orderPrice / 1000) * 133);
		if(newPoints == 0) newPoints = 1;
		buyer.setPoints(buyer.getPoints() + newPoints);
		if(buyer.getPoints()  > 2000) {
			buyer.setBuyerType(BuyerType.silver);
			buyer.setDiscount(5);
		} else if (buyer.getPoints()  > 4000) {
			buyer.setBuyerType(BuyerType.golden);
			buyer.setDiscount(7);
		}
		userDao.update(buyer);
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
	
	public Order setInPreparation(String orderId) throws JsonSyntaxException, IOException {
		// TODO Auto-generated method stub
		Order order = orderDao.getById(orderId);
		order.setOrderStatus(OrderStatus.inPreparation);
		orderDao.update(order);
		return order;
	}
	
	public Order cancelOrder(Order updatedOrder) throws JsonSyntaxException, IOException {
		Order order = orderDao.getById(updatedOrder.getID());
		order.setOrderStatus(OrderStatus.canceled);
		orderDao.update(order);
		reducePointsFromBuyer(order.getBuyer(), order.getPrice());
		return updatedOrder;
	}

	private void reducePointsFromBuyer(String buyerId, double orderPrice) throws JsonSyntaxException, IOException {
		Buyer buyer = (Buyer) userDao.getById(buyerId);
		int deductedPoints = (int) Math.round(orderPrice / 1000 * 133 * 4);
		buyer.setPoints(buyer.getPoints() - deductedPoints);
		userDao.update(buyer);
	}

	public BuyerType getBuyerType(String id) throws JsonSyntaxException, IOException {
		Buyer buyer = (Buyer) userDao.getById(id);
		return buyer.getBuyerType();
	}

	public int getDiscount(String id) throws JsonSyntaxException, IOException {
		Buyer buyer = (Buyer) userDao.getById(id);
		return buyer.getDiscount();
	}

	public OrderStatsDTO getOrderStats(User user) throws JsonSyntaxException, IOException {
		Collection<OrderDisplayDTO> userOrders = getOrdersForUser(user.getID());
		int thisWeekCounter = 0;
		for(OrderDisplayDTO userOrder : userOrders) {
			Calendar c = Calendar.getInstance();
			c.setTime(userOrder.getDateOfOrder());
			c.add(Calendar.DATE, 7);
			if(c.getTime().compareTo(new Date()) >= 0){
				thisWeekCounter += 1;
			}
		}
		return new OrderStatsDTO(((Buyer)user).getBuyerType(), ((Buyer)user).getPoints(), thisWeekCounter, userOrders.size());
	}

	public void markOrderAsRated(String id) throws JsonSyntaxException, IOException {
		Order order = orderDao.getById(id);
		order.setReviewed(true);
		orderDao.update(order);
	}
}
