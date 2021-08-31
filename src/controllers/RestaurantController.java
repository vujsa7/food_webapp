package controllers;

import static spark.Spark.get;
import static spark.Spark.post;
import static spark.Spark.put;

import java.security.Key;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;

import beans.AccountType;
import beans.Administrator;
import beans.Article;
import beans.Buyer;
import beans.DeliveryWorker;
import beans.Manager;
import beans.Restaurant;
import beans.User;
import dto.LoggedInBuyerDTO;
import dto.RegisterNewRestaurantDTO;
import dto.RegisterNewUserDTO;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.IOException;
import io.jsonwebtoken.security.Keys;
import services.RestaurantService;
import services.UserService;

public class RestaurantController {
	private static Gson gson = new Gson();
	static Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
	
	public RestaurantController(RestaurantService restaurantService, UserService userService) {
	
		get("rest/restaurants", (req, res) -> {
			res.type("application/json");
			return gson.toJson(restaurantService.getAllRestaurants());
		});
		
		get("rest/restaurant/:id", (req, res) -> {
			res.type("application/json");
			String idString = req.params("id");
			try {
				int id = Integer.parseInt(idString);
				Restaurant restaurant = restaurantService.getById(id);
				return gson.toJson(restaurant);
			} catch(NumberFormatException n) {
				res.status(400);
				return "Bad Request";
			} catch(Exception e) {
				res.status(400);
				return "Bad Request";
			}
			
		});
		
		get("rest/managerRestaurant/:id", (req, res) -> {
			res.type("application/json");
			String idString = req.params("id");
			try {
				Restaurant restaurant = restaurantService.getRestaurantByManager(idString);
				return gson.toJson(restaurant);
			} catch(NumberFormatException n) {
				res.status(400);
				return "Bad Request";
			} catch(Exception e) {
				res.status(400);
				return "Bad Request";
			}
			
		});
		
		get("/restaurants/getForManager", (req,res) -> {
			res.type("application/json");
			String auth = req.headers("Authorization");
			System.out.println("Authorization: " + auth);
			if ((auth != null) && (auth.contains("Bearer "))) {
				String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
				try {
				    Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(jwt);
				    // ako nije bacio izuzetak, onda je ok
				    System.out.println(claims.getBody().getSubject());
				    System.out.print(restaurantService.getRestaurantByManager(claims.getBody().getSubject()).getName());
				    return gson.toJson(restaurantService.getRestaurantByManager(claims.getBody().getSubject()));
				} catch (Exception e) {
					System.out.println(e.getMessage());
				}
			}
			return "No user logged in.";
		});
		
		get("/rest/getAllUsersByRestaurant", (req,res) -> {
			res.type("application/json");
			String auth = req.headers("Authorization");
			if ((auth != null) && (auth.contains("Bearer "))) {
				String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
				try {
				    Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(LoginController.key).build().parseClaimsJws(jwt);
				    User manager = userService.getById(claims.getBody().getSubject());
				    res.status(200);
				    return gson.toJson(restaurantService.getUsersFromRestaurant(manager.getID()));
				} catch(JsonSyntaxException | IOException e) {
					res.status(500);
					return "Server error occured.";
				} catch (Exception e) {
					res.status(401);
					return "You must log in to continue.";
				}
			}
			res.status(401);
			return "Please log in to continue.";
		});
		
		post("/restaurants/addRestaurant", (req,res) -> {
			res.type("application/json");
			String auth = req.headers("Authorization");
			System.out.println("Authorization: " + auth);
			if ((auth != null) && (auth.contains("Bearer "))) {
				String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
				try {
				    Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(jwt);
				    // ako nije bacio izuzetak, onda je OK
				    User loggedInUser = userService.getById(claims.getBody().getSubject());
				    if(!loggedInUser.getAccountType().equals(AccountType.administrator)) {
				    	res.status(403);
				    	return "";
				    }
				    Restaurant newRestaurant = restaurantService.registerNewRestaurant(gson.fromJson(req.body(), RegisterNewRestaurantDTO.class));
					return gson.toJson(newRestaurant);
				} catch (Exception e) {
					System.out.println(e.getMessage());
				}
			}
			return "No user logged in.";
		});
		
		post("/rest/addArticle", (req,res) -> {
			res.type("application/json");
			String auth = req.headers("Authorization");
			System.out.println("Authorization: " + auth);
			if ((auth != null) && (auth.contains("Bearer "))) {
				String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
				try {
					System.out.println("KURAC");
				    Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(jwt);
				    // ako nije bacio izuzetak, onda je OK
				    User loggedInUser = userService.getById(claims.getBody().getSubject());
				    if(!loggedInUser.getAccountType().equals(AccountType.manager)) {
				    	res.status(403);
				    	return "";
				    }
				    Manager manager = (Manager) loggedInUser;
				    System.out.println("AAAAAAAAAA");
				    Article article = restaurantService.addArticle(gson.fromJson(req.body(), Article.class), manager);
				    if(article == null) {
						res.status(409);
						return "";
					}else {
						return gson.toJson(article);
					}
				} catch (Exception e) {
					System.out.println(e.getMessage());
				}
			}
			return "No user logged in.";
		});
		
		put("/restaurants/updateRestaurant", (req,res) -> {
			res.type("application/json");
			String auth = req.headers("Authorization");
			System.out.println("Authorization: " + auth);
			if ((auth != null) && (auth.contains("Bearer "))) {
				String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
				try {
				    Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(jwt);
				    // ako nije bacio izuzetak, onda je OK
				    User loggedInUser = userService.getById(claims.getBody().getSubject());
				    if(!loggedInUser.getAccountType().equals(AccountType.manager)) {
				    	res.status(403);
				    	return "";
				    }
				    Manager manager = (Manager) loggedInUser;
				    Article article = restaurantService.changeArticle(gson.fromJson(req.body(), Article.class), manager);
				    return gson.toJson(article);
				} catch (Exception e) {
					System.out.println(e.getMessage());
				}
			}
			return "No user logged in.";
		});
	}
}
