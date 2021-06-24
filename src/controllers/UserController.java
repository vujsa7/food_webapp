package controllers;

import com.google.gson.Gson;

import beans.AccountType;
import beans.Gender;
import beans.User;
import dto.LoginDTO;
import dto.RegisterNewUserDTO;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import static spark.Spark.get;
import static spark.Spark.post;

import java.security.Key;
import java.util.Date;

import services.UserService;

public class UserController {
	private UserService userService;
	private static Gson gson = new Gson();
	static Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
	
	public UserController(UserService userService) {
		this.userService = userService;
		
		post("/user/login", (req,res) -> {
			res.type("application/json");
			try {
				User loginUser = userService.login(gson.fromJson(req.body(), LoginDTO.class));
				if(loginUser != null) {
					if (loginUser.isBlocked()) {
						return "Korisnik je blokiran";
					}
					
					String jws = Jwts.builder().setSubject(loginUser.getUsername()).setExpiration(new Date(new Date().getTime() + 1000*10L)).setIssuedAt(new Date()).signWith(key).compact();
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
				return gson.toJson(newBuyer);
			}catch (Exception e) {
				e.printStackTrace();
				return "";
			}
		});
		
		post("/user/registerManager", (req, res) -> {
			res.type("application/json");			
			try {
				User newManager = userService.registerNewManager(gson.fromJson(req.body(), RegisterNewUserDTO.class));
				return gson.toJson(newManager);
			}catch (Exception e) {
				e.printStackTrace();
				return "";
			}
		});
		
		post("/user/registerDeliveryWorker", (req, res) -> {
			res.type("application/json");
			try {
				User newDeliveryWorker = userService.registerNewDeliveryWorker(gson.fromJson(req.body(), RegisterNewUserDTO.class));
				return gson.toJson(newDeliveryWorker);
			}catch (Exception e) {
				e.printStackTrace();
				return "";
			}
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
	}
}
