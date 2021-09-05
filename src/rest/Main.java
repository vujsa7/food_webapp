package rest;

import static spark.Spark.port;
import static spark.Spark.staticFiles;

import java.io.File;
import java.util.Date;

import beans.AccountType;
import beans.Administrator;
import beans.Article;
import beans.ArticleType;
import beans.Comment;
import beans.Gender;
import beans.Manager;
import beans.Restaurant;
import controllers.CartController;
import controllers.CommentController;
import controllers.LoginController;
import controllers.OrderController;
import controllers.RegistrationController;
import controllers.RestaurantController;
import controllers.UserController;
import dao.CommentDAO;
import dao.RestaurantDAO;
import dao.UserDAO;
import services.*;
import static spark.Spark.options;
import static spark.Spark.before;

public class Main {
	
	private static final Date Date = null;

	@SuppressWarnings("unused")
	public static void main(String[] args) throws Exception {
		port(8081);
		
		staticFiles.externalLocation(new File("./static").getCanonicalPath());
		/*
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
	
		*/
		UserService userService = new UserService();
		RegistrationService registrationService = new RegistrationService();
		LoginService loginService = new LoginService();
		OrderService orderService = new OrderService();
		CommentService commentService = new CommentService();
		RestaurantService restaurantService = new RestaurantService();
		CartService cartService = new CartService();
		

		UserController userController = new UserController(userService);
		RegistrationController registrationController = new RegistrationController(registrationService, userService);
		LoginController loginController = new LoginController(loginService, userService);
		OrderController orderController = new OrderController(orderService, userService);
		CommentController commentController = new CommentController(commentService);
		RestaurantController restaurantController = new RestaurantController(restaurantService, userService);
		CartController cartController = new CartController(cartService, userService);
		
	/*	Administrator m = new Administrator("admin", "123", "Mika", "Mikić", Gender.male, new Date(1986,10,5),AccountType.administrator, false, false);
		UserDAO userDao = new UserDAO("./files/users.json");
		userDao.create(m);*/
		
//		Article a1 = new Article(0, "Steak", 12.39, ArticleType.meal, 81, "A good steak is juicy, tender, loaded with flavor, and has a minimum amount of fat.", "../assets/images/restaurant-images/foods/001.jpg");	
//		Article a2 = new Article(1, "Hamburger", 7.39, ArticleType.meal, 40, "Juicy, big, loaded with toppings of your choice.", "../assets/images/restaurant-images/foods/002.jpg");	
//		Article a3 = new Article(2, "Kebabs", 9.79, ArticleType.meal, 64, "Fresh kekabs with onion and delicious graviola! Try it with spicy sauce for better taste.", "../assets/images/restaurant-images/foods/003.jpg");
//		Article a4 = new Article(3, "Capricciosa", 6.99, ArticleType.meal, 120, "Dish of Italian origin, topped with some combination of olive oil, oregano and tomato", "../assets/images/restaurant-images/foods/004.jpg");
//		Article a5 = new Article(4, "Beef ", 11.39, ArticleType.meal, 34, "Asian-inspired flavors with a French technique give this dish its own unique spin.", "../assets/images/restaurant-images/foods/005.jpg");
//		Article a6 = new Article(5, "Burger", 6.49, ArticleType.meal, 133, "Tasty, delicious, and will have you craving more on the first bite.", "../assets/images/restaurant-images/foods/006.jpg");
//		
//		Article a7 = new Article(6, "Lemonade", 2.49, ArticleType.drink, 100, "A beverage of sweetened lemon juice mixed with water.", "../assets/images/restaurant-images/foods/011.jpg");
//		Article a8 = new Article(7, "Strawberry Juice", 4.49, ArticleType.drink, 85, "Strawberries shine in this tall, refreshing, gingery cocktail.", "../assets/images/restaurant-images/foods/012.jpg");
//		Article a9 = new Article(8, "Coca Cola", 1.99, ArticleType.drink, 76, "Fresh, cold and sweet drink.", "../assets/images/restaurant-images/foods/013.jpg");
//		Article a10 = new Article(9, "Orange Juice", 3.49, ArticleType.drink, 93, "100% pure-squeezed, pasteurized orange juice.", "../assets/images/restaurant-images/foods/014.jpg");
//		
//		Restaurant r1 = restaurantService.getById(0);
//		r1.addArticle(a1);
//		r1.addArticle(a2);
//		r1.addArticle(a3);
//		r1.addArticle(a4);
//		r1.addArticle(a5);
//		r1.addArticle(a6);
//		r1.addArticle(a7);
//		r1.addArticle(a8);
//		r1.addArticle(a9);
//		r1.addArticle(a10);
//		
//		RestaurantDAO restaurantDao = new RestaurantDAO("./files/restaurants.json");
//		restaurantDao.update(r1);
		
//		CommentDAO commentDao = new CommentDAO("./files/comments.json");
//		Comment c1 = new Comment(commentDao.generateId(), "The food was so delicious, great place and good prices.", 5, 0, "aki", false, true);
//		commentDao.save(c1);
//		Comment c2 = new Comment(commentDao.generateId(), "Chef knows what he's doing.", 4, 0, "gordon", false, true);
//		commentDao.save(c2);
//		Comment c3 = new Comment(commentDao.generateId(), "My brother showed me this place, very delicious hamburgers, best in town.", 5, 0, "miki", false, true);
//		commentDao.save(c3);
		
		
//		Restaurant r1 = new Restaurant("Los Pollos Hermanos", RestaurantType.barbecue, true,
//				new Location("111333", "412111", new Address("Niksicka", "46A", new City("Belgrade", "181000"))),
//				new ArrayList<Article>(), false);

		
		
	}
}
