package controllers;

import static spark.Spark.post;

import java.security.Key;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import beans.AccountType;
import beans.User;
import dto.RegisterNewManagerDTO;
import dto.RegisterNewUserDTO;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import services.RegistrationService;
import services.UserService;

public class RegistrationController {
	
	private Gson newUserGson = new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").create();
	static Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
	
	
	public RegistrationController(RegistrationService registrationService, UserService userService) {
		
		post("rest/registerBuyer", (req, res) -> {
			res.type("application/json");			
			try {
				RegisterNewUserDTO registerNewUserDTO = newUserGson.fromJson(req.body(), RegisterNewUserDTO.class);
				User newBuyer = registrationService.registerNewBuyer(registerNewUserDTO);
				if(newBuyer == null) {
					res.status(409);
					return "User with that username already exists!";
				} else {
					res.status(201);
					res.body(newUserGson.toJson(newBuyer));
					return res;
				}		
			}catch (Exception e) {
				e.printStackTrace();
				return "";
			}
		});
		
		post("/rest/registerManager", (req, res) -> {
			res.type("application/json");
			String auth = req.headers("Authorization");
			System.out.println("Authorization: " + auth);
			if ((auth != null) && (auth.contains("Bearer "))) {
				String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
				try {
				    Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(jwt);
				    // ako nije bacio izuzetak, onda je OK
				    User loggedInUser = registrationService.getById(claims.getBody().getSubject());
				    if(!loggedInUser.getAccountType().equals(AccountType.administrator)) {
				    	res.status(403);
				    	return "";
				    }
				    User newManager = registrationService.registerNewManager(newUserGson.fromJson(req.body(), RegisterNewManagerDTO.class));
				    if(newManager == null) {
						res.status(409);
						return "";
					}else {
						return newUserGson.toJson(newManager);
					}				
				} catch (Exception e) {
					System.out.println(e.getMessage());
				}
			}
			return "No user logged in.";
		});
		
		post("/rest/registerDeliveryWorker", (req, res) -> {
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
				    User newDeliveryWorker = registrationService.registerNewDeliveryWorker(newUserGson.fromJson(req.body(), RegisterNewUserDTO.class));
				    if(newDeliveryWorker == null) {
						res.status(409);
						return "";
					}else {
						return newUserGson.toJson(newDeliveryWorker);
					}
				} catch (Exception e) {
					System.out.println(e.getMessage());
				}
			}
			return "No user logged in.";
		});
	}
	
}
