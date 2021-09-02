package controllers;

import static spark.Spark.post;
import static spark.Spark.get;

import java.security.Key;
import java.util.Date;


import com.google.gson.Gson;

import beans.User;
import dto.LoggedInBuyerDTO;
import dto.LoginDTO;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import services.LoginService;
import services.UserService;

public class LoginController {
	
	static Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
	private Gson gson = new Gson();
	
	public LoginController(LoginService loginService, UserService userService) {
		
		post("rest/login", (req,res) -> {
			res.type("application/json");
			try {
				User loginUser = loginService.login(gson.fromJson(req.body(), LoginDTO.class));
				if(loginUser != null) {
					if (loginUser.isBlocked()) {
						res.status(401);
						return "Your account has been permanently disabled for violating our terms.";
					}
					String jwt = Jwts.builder().setSubject(loginUser.getUsername()).setExpiration(new Date(new Date().getTime() + 1000*86400L)).setIssuedAt(new Date()).signWith(key).compact();
					loginUser.setJWTToken(jwt);
					return jwt;
				}
				res.status(401);
				return "The username or password you've entered is incorrect.";
			} catch (Exception e) {
				return "Server error!";
			}
		});
		
		get("rest/accessUserWithJwt", (req, res) -> {
			res.type("application/json");
			String auth = req.headers("Authorization");
			if ((auth != null) && (auth.contains("Bearer "))) {
				String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
				try {
				    Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(jwt);
				    User user = userService.getById(claims.getBody().getSubject());
				    System.out.println("RADI");
				    res.status(200);
				    LoggedInBuyerDTO loggedInBuyerDTO = new LoggedInBuyerDTO(user.getUsername(), user.getName(), user.getSurname(), user.getGender(), user.getDateOfBirth(), user.getAccountType());
				    System.out.println(loggedInBuyerDTO.getUsername());
				    return gson.toJson(loggedInBuyerDTO);
				}catch (Exception e) {
					res.status(401);
					return "Your session has expired.";
				}
			}
			res.status(401);
			return "Please log in to continue.";
		});
	}

}
