package services;

import dao.OrderDAO;

public class OrderService {
	private OrderDAO orderDao;
	
	public OrderService(OrderDAO orderDao) {
		this.orderDao = orderDao;
	}
}
