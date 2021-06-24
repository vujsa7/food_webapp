package rest;

import static spark.Spark.get;
import static spark.Spark.port;
import static spark.Spark.post;
import static spark.Spark.staticFiles;

import java.io.File;

import controllers.*;
import dao.*;
import services.*;

public class Main {

	public static void main(String[] args) throws Exception {
		port(8080);

		staticFiles.externalLocation(new File("./static").getCanonicalPath());
		
		UserDAO userDao = new UserDAO("./files/users.json");
		UserService userService = new UserService(userDao);
		UserController userController = new UserController(userService);
		
		RestaurantDAO restaurantDao = new RestaurantDAO("./files/restaurants.json");
		RestaurantService restaurantService = new RestaurantService(restaurantDao);
		RestaurantController restaurantController = new RestaurantController(restaurantService);
		
		OrderDAO orderDao = new OrderDAO("./files/orders.json");
		OrderService orderService = new OrderService(orderDao);
		OrderController orderController = new OrderController(orderService);
		
		post("rest/test", (req, res) -> {
			return "SUCCESS";
		});
	}
}
