package controllers;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;

import beans.Buyer;
import dto.CreateNewCommentDTO;
import dto.CreateNewOrderDTO;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.IOException;

import static spark.Spark.get;
import static spark.Spark.put;
import static spark.Spark.post;

import services.CommentService;
import services.OrderService;
import services.UserService;

public class CommentController {
	private static Gson gson = new Gson();
	
	public CommentController(CommentService commentService, UserService userService, OrderService orderService) {
		
		get("rest/commentsForPublic/:id", (req,res) -> {
			res.type("application/json");
			try {
				return gson.toJson(commentService.getNotDeletedApprovedCommentsByRestaurant(Integer.parseInt(req.params("id")))); 
			} catch (Exception e) {
				e.printStackTrace();
				res.status(400);
				return "Bad Request";
			}
		});
		
		get("rest/commentsForManager/:id", (req,res) -> {
			res.type("application/json");
			try {
				return gson.toJson(commentService.getNotDeletedCommentsByRestaurant(Integer.parseInt(req.params("id")))); 
			} catch (Exception e) {
				e.printStackTrace();
				res.status(400);
				return "Bad Request";
			}
		});
		
		put("rest/approveComment/:id", (req,res) -> {
			res.type("application/json");
			try {
				return gson.toJson(commentService.approveComment(Integer.parseInt(req.params("id")))); 
			} catch (Exception e) {
				e.printStackTrace();
				res.status(400);
				return "Bad Request";
			}
		});
		
		put("rest/deleteComment/:id", (req,res) -> {
			res.type("application/json");
			try {
				return gson.toJson(commentService.deleteComment(Integer.parseInt(req.params("id")))); 
			} catch (Exception e) {
				e.printStackTrace();
				res.status(400);
				return "Bad Request";
			}
		});
		
		post("rest/newComment/:id", (req, res) -> {
			res.type("application/json");
			String auth = req.headers("Authorization");
			if ((auth != null) && (auth.contains("Bearer "))) {
				String jwt = auth.substring(auth.indexOf("Bearer ") + 7);
				try {
				    Jws<Claims> claims = Jwts.parserBuilder().setSigningKey(LoginController.key).build().parseClaimsJws(jwt);
				    CreateNewCommentDTO createNewCommentDTO = gson.fromJson(req.body(), CreateNewCommentDTO.class);
				    Buyer buyer = (Buyer)userService.getById(claims.getBody().getSubject());
				    if(!buyer.getID().equals(createNewCommentDTO.getBuyerId())) {
				    	res.status(401);
				    	return "Forbidden action!";
				    }
					res.status(200);
					commentService.createCommentCandidate(createNewCommentDTO);
					orderService.markOrderAsRated(req.params("id"));
					return "Comment has been successfully sent.";
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
