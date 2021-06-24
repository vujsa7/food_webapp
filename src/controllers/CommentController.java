package controllers;

import com.google.gson.Gson;

import services.CommentService;

public class CommentController {
	private CommentService commentService;
	private static Gson gson = new Gson();
	
	public CommentController(CommentService commentService) {
		this.commentService = commentService;
	}
}
