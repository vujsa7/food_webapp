package rest;

import static spark.Spark.port;
import static spark.Spark.staticFiles;

import java.io.File;

import controllers.CommentController;
import controllers.LoginController;
import controllers.OrderController;
import controllers.RegistrationController;
import controllers.RestaurantController;
import controllers.UserController;
import services.*;
import static spark.Spark.options;
import static spark.Spark.before;

public class Main {
	
	@SuppressWarnings("unused")
	public static void main(String[] args) throws Exception {
		port(8081);
		
		staticFiles.externalLocation(new File("./static").getCanonicalPath());
		
		options("/*", (request, response) -> {
			String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
			if (accessControlRequestHeaders != null) {
			    response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
			}
			String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
			if (accessControlRequestMethod != null) {
			    response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
			}
			return "OK";
		});

		before((request, response) -> {
			response.header("Access-Control-Allow-Origin", "*");
		});
	
		
		UserService userService = new UserService();
		RegistrationService registrationService = new RegistrationService();
		LoginService loginService = new LoginService();
		OrderService orderService = new OrderService();
		CommentService commentService = new CommentService();
		RestaurantService restaurantService = new RestaurantService();
		

		UserController userController = new UserController(userService);
		RegistrationController registrationController = new RegistrationController(registrationService, userService);
		LoginController loginController = new LoginController(loginService, userService);
		OrderController orderController = new OrderController(orderService);
		CommentController commentController = new CommentController(commentService);
		RestaurantController restaurantController = new RestaurantController(restaurantService);
		
		
		
//		Restaurant r1 = new Restaurant("Los Pollos Hermanos", RestaurantType.barbecue, true,
//				new Location("111333", "412111", new Address("Niksicka", "46A", new City("Belgrade", "181000"))),
//				new ArrayList<Article>(), false);

		
		
	}
}
