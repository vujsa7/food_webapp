package controllers;

import com.google.gson.Gson;

import services.OrderService;

public class OrderController {
	private OrderService orderService;
	private static Gson gson = new Gson();
	
	public OrderController(OrderService orderService) {
		this.orderService = orderService;
	}
}
