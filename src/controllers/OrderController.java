package controllers;

import com.google.gson.Gson;
import static spark.Spark.get;
import static spark.Spark.post;

import services.OrderService;

public class OrderController {
	private static Gson gson = new Gson();
	
	public OrderController(OrderService orderService) {
		
		get("/orders/getByRestaurant/:id", (req,res) -> {
			res.type("application/json");
			return gson.toJson(orderService.getOrdersByRestaurantId(Integer.parseInt(req.params("id"))));
		});
	}
}
