package services;

import java.io.IOException;
import java.util.*;

import com.google.gson.JsonElement;
import com.google.gson.JsonSyntaxException;

import beans.Buyer;
import beans.BuyerType;
import beans.DeliveryRequest;
import beans.Manager;
import beans.Order;
import beans.OrderStatus;
import beans.Restaurant;
import beans.SuspiciousCheck;
import beans.User;
import dao.OrderDAO;
import dao.RestaurantDAO;
import dao.UserDAO;
import dto.CreateNewOrderDTO;
import dto.OrderDisplayDTO;
import dto.OrderStatsDTO;
import dto.RestaurantStatsDTO;

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
		updateSuspiciousCheck(order.getBuyer());
		return updatedOrder;
	}

	private void updateSuspiciousCheck(String buyerId) throws JsonSyntaxException, IOException {
		Buyer buyer = (Buyer) userDao.getById(buyerId);
		Date timeRangeStart = buyer.getSuspiciousCheck().getTimeRangeStart();
		int cancelledOrders = buyer.getSuspiciousCheck().getCancelledOrders();
		boolean isCustomerSuspicious = buyer.getSuspiciousCheck().isCustomerSuspicious();
		if(timeRangeStart == null) {
			buyer.setSuspiciousCheck(new SuspiciousCheck(new Date(), cancelledOrders + 1, isCustomerSuspicious));
		} else {
			buyer.setSuspiciousCheck(new SuspiciousCheck(timeRangeStart, cancelledOrders + 1, isCustomerSuspicious));
		}
		markBuyerIfSuspicious(buyer);
		
	}

	private void markBuyerIfSuspicious(Buyer buyer) throws JsonSyntaxException, IOException {
		if(buyer.getSuspiciousCheck().getCancelledOrders() == 5) {
			Calendar cal = Calendar.getInstance();
			cal.add(Calendar.MONTH, -1);
			Date oneMonthEarlier = cal.getTime();
			if(oneMonthEarlier.before(buyer.getSuspiciousCheck().getTimeRangeStart())) {
				buyer.getSuspiciousCheck().setCustomerSuspicious(true);
			} else {
				buyer.getSuspiciousCheck().setCancelledOrders(1);
				buyer.getSuspiciousCheck().setTimeRangeStart(new Date());
				buyer.getSuspiciousCheck().setCustomerSuspicious(false);
			}
		}
		userDao.update(buyer);
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
	
	public RestaurantStatsDTO getRestaurantStats(Manager manager) throws JsonSyntaxException, IOException {
		Restaurant restaurant = restaurantDao.getById(manager.getRestaurant());
		int thisWeekCounter = 0;
		double thisWeekMoney = 0;
		double totalMoney = 0;
		int totalOrders = 0;
		for(Order o : orderDao.getAllNotDeleted()) {
			if(o.getRestaurant() == restaurant.getID() && o.getOrderStatus().equals(OrderStatus.delivered)) {
				Calendar c = Calendar.getInstance();
				c.setTime(o.getDateOfOrder());
				c.add(Calendar.DATE, 7);
				if(c.getTime().compareTo(new Date()) >= 0){
					thisWeekCounter += 1;
					thisWeekMoney += o.getPrice();
				}
				totalOrders += 1;
				totalMoney += o.getPrice();
			}
		}
		return new RestaurantStatsDTO(thisWeekCounter,totalOrders,thisWeekMoney,totalMoney);
	}

	public void markOrderAsRated(String id) throws JsonSyntaxException, IOException {
		Order order = orderDao.getById(id);
		order.setReviewed(true);
		orderDao.update(order);
	}
	
	public ArrayList<OrderDisplayDTO> getOrdersForDeliveryWorker(User user) throws JsonSyntaxException, IOException {
		ArrayList<Order> allOrders = orderDao.getAllNotDeleted();
		ArrayList<OrderDisplayDTO> deliveryWorkerOrders = new ArrayList<OrderDisplayDTO>();
		for(Order o : allOrders) {
			DeliveryRequest alreadyDelivering = null;
			ArrayList<DeliveryRequest> deliveryRequests = o.getDeliveryRequests();
			if(deliveryRequests.size() != 0) {
				alreadyDelivering = deliveryRequests.get(0);
			}
			
			if(alreadyDelivering != null) {
				if(o.getOrderStatus() == OrderStatus.awaitingDelivery || (o.getOrderStatus() == OrderStatus.shipping && alreadyDelivering.getDeliveryWorkerId().equals(user.getID())) || (o.getOrderStatus() == OrderStatus.delivered && alreadyDelivering.getDeliveryWorkerId().equals(user.getID()))) {
					Restaurant res = restaurantDao.getById(o.getRestaurant());
					OrderDisplayDTO odt = new OrderDisplayDTO(o.getID(), o.getDateOfOrder(), o.getPrice(), o.getOrderStatus(), o.getRestaurant(),
							res.getName(), res.getRestaurantType(), o.getBuyer(), o.isReviewed());
					odt.setDeliveryRequests(o.getDeliveryRequests());
					deliveryWorkerOrders.add(odt);
				}
			} else {
				if(o.getOrderStatus() == OrderStatus.awaitingDelivery) {
					Restaurant res = restaurantDao.getById(o.getRestaurant());
					OrderDisplayDTO odt = new OrderDisplayDTO(o.getID(), o.getDateOfOrder(), o.getPrice(), o.getOrderStatus(), o.getRestaurant(),
							res.getName(), res.getRestaurantType(), o.getBuyer(), o.isReviewed());
					odt.setDeliveryRequests(o.getDeliveryRequests());
					deliveryWorkerOrders.add(odt);
				}
			}
			
		}
		return deliveryWorkerOrders;
	}

	public void pickupDelivery(String deliveryWorkerId, String orderId) throws JsonSyntaxException, IOException {
		Order order = orderDao.getById(orderId);
		if(order.getDeliveryRequests() == null) {
			order.setDeliveryRequests(new ArrayList<DeliveryRequest>());
		}
		for(DeliveryRequest dr : order.getDeliveryRequests()) {
			if(dr.getDeliveryWorkerId().equals(deliveryWorkerId) && dr.getOrderId().equals(orderId))
				return;
		}
		order.getDeliveryRequests().add(new DeliveryRequest(deliveryWorkerId, orderId));
		orderDao.update(order);
	}
	
	public ArrayList<OrderDisplayDTO> getDeliveryRequests(Manager manager) throws JsonSyntaxException, IOException{
		Restaurant restaurant = restaurantDao.getById(manager.getRestaurant());
		ArrayList<Order> allOrders = orderDao.getAllNotDeleted();
		ArrayList<OrderDisplayDTO> deliveryRequests = new ArrayList<OrderDisplayDTO>();
		for(Order o : allOrders) {
			if(o.getOrderStatus().equals(OrderStatus.awaitingDelivery) && o.getRestaurant() == restaurant.getID()) {
				OrderDisplayDTO odt = new OrderDisplayDTO(o.getID(), o.getDateOfOrder(), o.getPrice(), o.getOrderStatus(), o.getRestaurant(),
						restaurant.getName(), restaurant.getRestaurantType(), o.getBuyer(), o.isReviewed());
				odt.setDeliveryRequests(o.getDeliveryRequests());
				deliveryRequests.add(odt);
			}
		}
		return deliveryRequests;
	}
	
	public void approveRequest(DeliveryRequest request) throws JsonSyntaxException, IOException {
		Order order = orderDao.getById(request.getOrderId());
		for(DeliveryRequest d : order.getDeliveryRequests()) {
			if(!d.getDeliveryWorkerId().equals(request.getDeliveryWorkerId())) {
				order.getDeliveryRequests().remove(d);
			}
		}
		order.setOrderStatus(OrderStatus.shipping);
		orderDao.update(order);
	}
	
	public void declineRequest(DeliveryRequest request) throws JsonSyntaxException, IOException {
		Order order = orderDao.getById(request.getOrderId());
		for(DeliveryRequest d : order.getDeliveryRequests()) {
			if(d.getDeliveryWorkerId().equals(request.getDeliveryWorkerId())) {
				order.deleteDeliveryRequest(d.getDeliveryWorkerId());
			}
		}
		orderDao.update(order);
	}

	public void markOrderAsDelivered(String deliveryWorkerId, String orderId) throws JsonSyntaxException, IOException {
		Order order = orderDao.getById(orderId);
		if(((DeliveryRequest)order.getDeliveryRequests().get(0)).getDeliveryWorkerId().equals(deliveryWorkerId)) {
			order.setOrderStatus(OrderStatus.delivered);
			orderDao.update(order);
		}		
	}
}
