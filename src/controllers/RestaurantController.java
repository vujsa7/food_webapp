package controllers;

import static spark.Spark.get;
import static spark.Spark.post;

import java.security.Key;

import com.google.gson.Gson;

import beans.AccountType;
import beans.Administrator;
import beans.Article;
import beans.Buyer;
import beans.DeliveryWorker;
import beans.Manager;
import beans.Restaurant;
import beans.User;
import dto.RegisterNewRestaurantDTO;
import dto.RegisterNewUserDTO;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import services.RestaurantService;

public class RestaurantController {
	private static Gson gson = new Gson();
	static Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
	
	public RestaurantController(RestaurantService restaurantService) {
		
		
		get("rest/restaurants/", (req, res) -> {
			res.type("application/json");
			return gson.toJson(restaurantService.getAllRestaurants());
		});
		
		get("/restaurants/getForManager", (req,res) -> {
			res.type("application/json");
			String auth = req.headers("Authorization");
			System.out.println("Authorization: " + auth);
			if ((auth != null) && (auth.contains("Bearer "))) {
				String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
				try {
				    Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(jwt);
				    // ako nije bacio izuzetak, onda je OK
				    return gson.toJson(restaurantService.getRestaurantByManager(claims.getBody().getSubject()));
				} catch (Exception e) {
					System.out.println(e.getMessage());
				}
			}
			return "No user logged in.";
		});
		
		get("/restaurants/getAllUsersByRestaurant", (req,res) -> {
			res.type("application/json");
			String auth = req.headers("Authorization");
			System.out.println("Authorization: " + auth);
			if ((auth != null) && (auth.contains("Bearer "))) {
				String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
				try {
				    Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(jwt);
				    // ako nije bacio izuzetak, onda je OK
				    return gson.toJson(restaurantService.getUsersFromRestaurant(claims.getBody().getSubject()));
				} catch (Exception e) {
					System.out.println(e.getMessage());
				}
			}
			return "No user logged in.";
		});
		
		post("/restaurants/addRestaurant", (req,res) -> {
			res.type("application/json");
			RegisterNewUserDTO updatedProfile = gson.fromJson(req.body(), RegisterNewUserDTO.class);
			String auth = req.headers("Authorization");
			System.out.println("Authorization: " + auth);
			if ((auth != null) && (auth.contains("Bearer "))) {
				String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
				try {
				    Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(jwt);
				    // ako nije bacio izuzetak, onda je OK
				    User loggedInUser = restaurantService.getById(claims.getBody().getSubject());
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
		
		post("/restaurants/addArticle", (req,res) -> {
			res.type("application/json");
			RegisterNewUserDTO updatedProfile = gson.fromJson(req.body(), RegisterNewUserDTO.class);
			String auth = req.headers("Authorization");
			System.out.println("Authorization: " + auth);
			if ((auth != null) && (auth.contains("Bearer "))) {
				String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
				try {
				    Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(jwt);
				    // ako nije bacio izuzetak, onda je OK
				    User loggedInUser = restaurantService.getById(claims.getBody().getSubject());
				    if(!loggedInUser.getAccountType().equals(AccountType.manager)) {
				    	res.status(403);
				    	return "";
				    }
				    Manager manager = (Manager) loggedInUser;
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
		
		post("/restaurants/updateRestaurant", (req,res) -> {
			res.type("application/json");
			RegisterNewUserDTO updatedProfile = gson.fromJson(req.body(), RegisterNewUserDTO.class);
			String auth = req.headers("Authorization");
			System.out.println("Authorization: " + auth);
			if ((auth != null) && (auth.contains("Bearer "))) {
				String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
				try {
				    Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(jwt);
				    // ako nije bacio izuzetak, onda je OK
				    User loggedInUser = restaurantService.getById(claims.getBody().getSubject());
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
