package controllers;

import static spark.Spark.post;

import java.security.Key;
import java.util.Date;

import javax.servlet.http.Cookie;

import com.google.gson.Gson;

import beans.User;
import dto.LoginDTO;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import services.LoginService;

public class LoginController {
	
	private Gson gson = new Gson();
	static Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
	
	public LoginController(LoginService loginService) {
		
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
			}catch (Exception e) {
				e.printStackTrace();
				return "";
			}
		});
	}

}
