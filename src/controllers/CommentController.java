package controllers;

import com.google.gson.Gson;
import static spark.Spark.get;
import static spark.Spark.post;
import static spark.Spark.put;

import services.CommentService;

public class CommentController {
	private static Gson gson = new Gson();
	
	public CommentController(CommentService commentService) {
		
		get("/comments/GetCommentsByRestaurant/:id", (req,res) -> {
			res.type("application/json");
			try {
				return gson.toJson(commentService.getCommentsByRestaurant(Integer.parseInt(req.params("id")))); 
			} catch (Exception e) {
				e.printStackTrace();
				return "";
			}
		});
	}
}
