package controllers;

import static spark.Spark.post;

import java.security.Key;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import beans.AccountType;
import beans.User;
import dto.RegisterNewEmployeeDTO;
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
		
		post("/rest/registerNewEmployee", (req, res) -> {
			res.type("application/json");
			String auth = req.headers("Authorization");
			System.out.println("Authorization: " + auth);
			if ((auth != null) && (auth.contains("Bearer "))) {
				String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
				try {
				    Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(LoginController.key).build().parseClaimsJws(jwt);
				    // ako nije bacio izuzetak, onda je OK
				    User loggedInUser = registrationService.getById(claims.getBody().getSubject());
				    if(!loggedInUser.getAccountType().equals(AccountType.administrator)) {
				    	res.status(403);
				    	return "";
				    }
				    User newUser = registrationService.registerNewEmployee(newUserGson.fromJson(req.body(), RegisterNewEmployeeDTO.class));
				    if(newUser == null) {
						res.status(409);
						return "";
					}else {
						res.status(200);
						return "";
					}				
				} catch (Exception e) {
					System.out.println(e.getMessage());
				}
			}
			return "No user logged in.";
		});
		
	}
	
}
