package controllers;

import com.google.gson.Gson;
import static spark.Spark.get;
import static spark.Spark.post;
import static spark.Spark.put;

import services.CommentService;

public class CommentController {
	private static Gson gson = new Gson();
	
	public CommentController(CommentService commentService) {
		
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
	}
}
