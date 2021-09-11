package controllers;

import static spark.Spark.get;
import static spark.Spark.post;
import static spark.Spark.put;

import java.security.Key;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;

import beans.AccountType;
import beans.Article;
import beans.Manager;
import beans.Restaurant;
import beans.User;
import dto.ArticleDTO;
import dto.DeletedArticleDTO;
import dto.RegisterNewRestaurantDTO;
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
		
		get("/rest/getAllUsersByRestaurant", (req,res) -> {
			res.type("application/json");
			String auth = req.headers("Authorization");
			if ((auth != null) && (auth.contains("Bearer "))) {
				String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
				try {
				    Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(LoginController.key).build().parseClaimsJws(jwt);
				    User manager = userService.getById(claims.getBody().getSubject());
				    if(!manager.getAccountType().equals(AccountType.manager)) {
				    	res.status(403);
				    	return "";
				    }
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
		
		post("/rest/addRestaurant", (req,res) -> {
			res.type("application/json");
			String auth = req.headers("Authorization");
			if ((auth != null) && (auth.contains("Bearer "))) {
				String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
				try {
				    Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(LoginController.key).build().parseClaimsJws(jwt);
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
			if ((auth != null) && (auth.contains("Bearer "))) {
				String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
				try {
				    Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(LoginController.key).build().parseClaimsJws(jwt);
				    // ako nije bacio izuzetak, onda je OK
				    User loggedInUser = userService.getById(claims.getBody().getSubject());
				    if(!loggedInUser.getAccountType().equals(AccountType.manager)) {
				    	res.status(401);
				    	return "Access forbidden";
				    }
				    Manager manager = (Manager) loggedInUser;
				    Article article = restaurantService.addArticle(gson.fromJson(req.body(), Article.class), manager);
				    if(article == null) {
						res.status(409);
						return "Article with given name already exists!";
					}else {
						res.status(200);
						return gson.toJson(article);
					}
				} catch (Exception e) {
					System.out.println(e.getMessage());
				}
			}
			return "No user logged in.";
		});
		
		put("/rest/editArticle", (req,res) -> {
			res.type("application/json");
			String auth = req.headers("Authorization");
			if ((auth != null) && (auth.contains("Bearer "))) {
				String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
				try {
				    Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(LoginController.key).build().parseClaimsJws(jwt);
				    // ako nije bacio izuzetak, onda je OK
				    User loggedInUser = userService.getById(claims.getBody().getSubject());
				    if(!loggedInUser.getAccountType().equals(AccountType.manager)) {
				    	res.status(403);
				    	return "";
				    }
				    Manager manager = (Manager) loggedInUser;
				    Article article = restaurantService.changeArticle(gson.fromJson(req.body(), ArticleDTO.class), manager);
				    if(article == null) {
						res.status(409);
						return "Article with given name already exists!";
					}else {
						res.status(200);
						return gson.toJson(article);
					}
				} catch (Exception e) {
					System.out.println(e.getMessage());
					System.out.println("ALOALOALAOAAO");
				}
			}
			return "No user logged in.";
		});
		
		put("/rest/deleteArticle", (req,res) -> {
			res.type("application/json");
			String auth = req.headers("Authorization");
			if ((auth != null) && (auth.contains("Bearer "))) {
				String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
				try {
				    Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(LoginController.key).build().parseClaimsJws(jwt);
				    // ako nije bacio izuzetak, onda je OK
				    User loggedInUser = userService.getById(claims.getBody().getSubject());
				    if(!loggedInUser.getAccountType().equals(AccountType.administrator)) {
				    	res.status(403);
				    	return "Forbidden access!";
				    }
				    restaurantService.deleteArticle(gson.fromJson(req.body(), DeletedArticleDTO.class));
					res.status(200);
					return gson.toJson("");
				} catch (Exception e) {
					System.out.println(e.getMessage());
				}
			}
			return "No user logged in.";
		});
		
		put("/rest/deleteRestaurant/:id", (req,res) -> {
			res.type("application/json");
			String auth = req.headers("Authorization");
			if ((auth != null) && (auth.contains("Bearer "))) {
				String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
				try {
					
				    Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(LoginController.key).build().parseClaimsJws(jwt);
				    // ako nije bacio izuzetak, onda je OK
				    User loggedInUser = userService.getById(claims.getBody().getSubject());
				    if(!loggedInUser.getAccountType().equals(AccountType.administrator)) {
				    	res.status(403);
				    	return "Forbidden access!";
				    }
				    restaurantService.deleteRestaurant(Integer.parseInt(req.params("id")));
					res.status(200);
					return gson.toJson("");
				} catch (Exception e) {
					System.out.println(e.getMessage());
				}
			}
			return "No user logged in.";
		});
	}
}
