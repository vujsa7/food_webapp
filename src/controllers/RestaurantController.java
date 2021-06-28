package controllers;

import static spark.Spark.get;

import java.security.Key;

import com.google.gson.Gson;

import beans.AccountType;
import beans.Administrator;
import beans.Buyer;
import beans.DeliveryWorker;
import beans.Manager;
import beans.User;
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
	}
}
