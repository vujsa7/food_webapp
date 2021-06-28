package rest;

import static spark.Spark.port;
import static spark.Spark.staticFiles;

import java.io.File;

import controllers.CommentController;
import controllers.OrderController;
import controllers.RestaurantController;
import controllers.UserController;
import dao.*;
import services.*;

public class Main {
	
	@SuppressWarnings("unused")
	public static void main(String[] args) throws Exception {
		port(8081);

		staticFiles.externalLocation(new File("./static").getCanonicalPath());
		
		UserDAO userDao = new UserDAO("./files/users.json");
		UserService userService = new UserService(userDao);
		UserController userController = new UserController(userService);
		
		OrderDAO orderDao = new OrderDAO("./files/orders.json");
		OrderService orderService = new OrderService(orderDao);
		OrderController orderController = new OrderController(orderService);
		
		CommentDAO commentDao = new CommentDAO("./files/comments.json");
		CommentService commentService = new CommentService(commentDao);
		CommentController commentController = new CommentController(commentService);
		
		RestaurantDAO restaurantDao = new RestaurantDAO("./files/restaurants.json");
		RestaurantService restaurantService = new RestaurantService(restaurantDao, userDao, orderDao, commentDao);
		RestaurantController restaurantController = new RestaurantController(restaurantService);
		
//		Restaurant r1 = new Restaurant("Los Pollos Hermanos", RestaurantType.barbecue, true,
//				new Location("111333", "412111", new Address("Niksicka", "46A", new City("Belgrade", "181000"))),
//				new ArrayList<Article>(), false);

		
		
	}
}
