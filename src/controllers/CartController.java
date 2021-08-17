package controllers;

import static spark.Spark.put;

import java.security.Key;

import static spark.Spark.get;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;

import beans.Buyer;
import beans.Cart;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.IOException;
import services.CartService;
import services.UserService;

public class CartController {
	
	private static Gson gson = new Gson();
	
	public CartController(CartService cartService, UserService userService) {
		
		get("rest/cart/:id", (req, res) -> {
			res.type("application/json");
			String auth = req.headers("Authorization");
			if ((auth != null) && (auth.contains("Bearer "))) {
				String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
				try {
				    Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(LoginController.key).build().parseClaimsJws(jwt);
				    Buyer buyer = (Buyer)userService.getById(claims.getBody().getSubject());
				    if(!buyer.getID().equals(req.params("id"))) {
				    	res.status(401);
				    	return "Forbidden content!";
				    }
				    res.status(200);
				    return gson.toJson(cartService.getCart(buyer.getID()));
				} catch(JsonSyntaxException | IOException e) {
					res.status(500);
					return "Server error occured.";
				} catch (Exception e) {
					e.printStackTrace();
					res.status(401);
					return "You must log in to continue.";
				}
			}
			res.status(401);
			return "Please log in to continue.";
		});
		
		put("rest/updateCart/:id", (req, res) -> {
			res.type("application/json");
			String auth = req.headers("Authorization");
			if ((auth != null) && (auth.contains("Bearer "))) {
				String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
				try {
				    Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(LoginController.key).build().parseClaimsJws(jwt);
				    Cart updatedCart = gson.fromJson(req.body(), Cart.class);
				    Buyer buyer = (Buyer)userService.getById(claims.getBody().getSubject());
				    if(!buyer.getID().equals(req.params("id"))) {
				    	res.status(401);
				    	return "Forbidden action!";
				    }
					res.status(200);
					return gson.toJson(cartService.updateCart(buyer.getID(), updatedCart));
				} catch(JsonSyntaxException | IOException e) {
					res.status(500);
					return "Server error occured.";
				} catch (Exception e) {
					e.printStackTrace();
					res.status(401);
					return "You must log in to continue.";
				}
			}
			res.status(401);
			return "Please log in to continue.";
			
		});
		
		
	}
	
	
	
}
