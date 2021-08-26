package controllers;

import com.google.gson.Gson;

import beans.*;
import dto.*;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import static spark.Spark.get;
import static spark.Spark.put;

import java.security.Key;

import services.UserService;

public class UserController {

	
	private Gson gson = new Gson();
	static Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
	
	public UserController(UserService userService) {
		
		get("user/getAll", (req,res) -> {
			res.type("application/json");
			String auth = req.headers("Authorization");
//			System.out.println("Authorization: " + auth);
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
				return gson.toJson(userService.getAll());
				}catch (Exception e) {
					e.printStackTrace();
					return "";
				}
			}
			return "No user logged in.";
		});
		
		get("/user/:id", (req, res) -> {
			res.type("application/json");
			try {
				return gson.toJson(userService.getById(req.params("id"))); 
			} catch (Exception e) {
				e.printStackTrace();
				return "";
			}
		});
		
		put("/user/updateUser/:id", (req, res) -> {
			res.type("application/json");
			UpdateUserDTO updatedProfile = gson.fromJson(req.body(), UpdateUserDTO.class);
			String auth = req.headers("Authorization");
			System.out.println("Authorization: " + auth);
			if ((auth != null) && (auth.contains("Bearer "))) {
				String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
				try {
				    Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(jwt);
				    // ako nije bacio izuzetak, onda je OK
				    User loggedInUser = userService.getById(claims.getBody().getSubject());
				    if(loggedInUser.getAccountType().equals(AccountType.buyer)) {
				    	Buyer buyer = (Buyer) loggedInUser;
				    	return gson.toJson(userService.updateBuyer(buyer, updatedProfile));
				    }else if(loggedInUser.getAccountType().equals(AccountType.administrator)) {
				    	Administrator admin = (Administrator) loggedInUser;
				    	return gson.toJson(userService.updateAdministrator(admin, updatedProfile));
				    }else if(loggedInUser.getAccountType().equals(AccountType.manager)) {
				    	Manager manager = (Manager) loggedInUser;
				    	return gson.toJson(userService.updateManager(manager, updatedProfile));
				    }if(loggedInUser.getAccountType().equals(AccountType.deliveryWorker)) {
				    	DeliveryWorker deliveryWorker = (DeliveryWorker) loggedInUser;
				    	return gson.toJson(userService.updateDeliveryWorker(deliveryWorker, updatedProfile));
				    }
				} catch (Exception e) {
					System.out.println(e.getMessage());
				}
			}
			return "No user logged in.";
		});	
		
		get("/user/AvailableManagers", (req,res) -> {
			res.type("application/json");
			return gson.toJson(userService.getAvailableManagers());
		});
		
		get("/user/loggedInUser", (req, res) -> {
			res.type("application/json");
			RegisterNewUserDTO updatedProfile = gson.fromJson(req.body(), RegisterNewUserDTO.class);
			String auth = req.headers("Authorization");
			System.out.println("Authorization: " + auth);
			if ((auth != null) && (auth.contains("Bearer "))) {
				String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
				try {
				    Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(jwt);
				    // ako nije bacio izuzetak, onda je OK
				    User loggedInUser = userService.getById(claims.getBody().getSubject());
				    if(loggedInUser.getAccountType().equals(AccountType.buyer)) {
				    	Buyer buyer = (Buyer) loggedInUser;
				    	return gson.toJson(buyer);
				    }else if(loggedInUser.getAccountType().equals(AccountType.administrator)) {
				    	Administrator admin = (Administrator) loggedInUser;
				    	return gson.toJson(admin);
				    }else if(loggedInUser.getAccountType().equals(AccountType.manager)) {
				    	Manager manager = (Manager) loggedInUser;
				    	return gson.toJson(manager);
				    }if(loggedInUser.getAccountType().equals(AccountType.deliveryWorker)) {
				    	DeliveryWorker deliveryWorker = (DeliveryWorker) loggedInUser;
				    	return gson.toJson(deliveryWorker);
				    }
				} catch (Exception e) {
					System.out.println(e.getMessage());
				}
			}
			return "No user logged in.";
		});
	}
}
