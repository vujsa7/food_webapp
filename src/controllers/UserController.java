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
import static spark.Spark.post;

import java.security.Key;
import java.util.Date;

import services.UserService;

public class UserController {

	private static Gson gson = new Gson();
	static Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
	
	public UserController(UserService userService) {
	
		post("/user/login", (req,res) -> {
			res.type("application/json");
			try {
				User loginUser = userService.login(gson.fromJson(req.body(), LoginDTO.class));
				if(loginUser != null) {
					if (loginUser.isBlocked()) {
						return "Korisnik je blokiran";
					}
					
					String jws = Jwts.builder().setSubject(loginUser.getUsername()).setExpiration(new Date(new Date().getTime() + 1000*86400L)).setIssuedAt(new Date()).signWith(key).compact();
					loginUser.setJWTToken(jws);
					return gson.toJson(loginUser);
				}
				return "";
			}catch (Exception e) {
				e.printStackTrace();
				return "";
			}
		});
		
		post("/user/registerBuyer", (req, res) -> {
			res.type("application/json");			
			try {
				//User newBuyer = userService.registerNewUser(new RegisterNewUserDTO("kure","malo","pera","peric",Gender.male, new Date(),AccountType.buyer));
				User newBuyer = userService.registerNewBuyer(gson.fromJson(req.body(), RegisterNewUserDTO.class));
				if(newBuyer == null) {
					res.status(409);
					return "";
				}else {
					return gson.toJson(newBuyer);
				}		
			}catch (Exception e) {
				e.printStackTrace();
				return "";
			}
		});
		
		post("/user/registerManager", (req, res) -> {
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
				    if(!loggedInUser.getAccountType().equals(AccountType.administrator)) {
				    	res.status(403);
				    	return "";
				    }
				    User newManager = userService.registerNewManager(gson.fromJson(req.body(), RegisterNewUserDTO.class));
				    if(newManager == null) {
						res.status(409);
						return "";
					}else {
						return gson.toJson(newManager);
					}				
				} catch (Exception e) {
					System.out.println(e.getMessage());
				}
			}
			return "No user logged in.";
		});
		
		post("/user/registerDeliveryWorker", (req, res) -> {
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
				    if(!loggedInUser.getAccountType().equals(AccountType.administrator)) {
				    	res.status(403);
				    	return "";
				    }
				    User newDeliveryWorker = userService.registerNewDeliveryWorker(gson.fromJson(req.body(), RegisterNewUserDTO.class));
				    if(newDeliveryWorker == null) {
						res.status(409);
						return "";
					}else {
						return gson.toJson(newDeliveryWorker);
					}
				} catch (Exception e) {
					System.out.println(e.getMessage());
				}
			}
			return "No user logged in.";
		});
		
		get("/user/getAll", (req,res) -> {
			res.type("application/json");
			try {
				return gson.toJson(userService.getAll());
			}catch (Exception e) {
				e.printStackTrace();
				return "";
			}
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
		
		get("/user/updateUser/:id", (req, res) -> {
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
	}
}
