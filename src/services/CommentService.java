package services;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;

import com.google.gson.JsonSyntaxException;

import beans.Comment;
import dao.CommentDAO;

public class CommentService {
	private CommentDAO commentDao;
	
	public CommentService() {
		this.commentDao = new CommentDAO("./files/comments.json");
	}
	
	public Collection<Comment> getCommentsByRestaurant(int restaurantId) throws JsonSyntaxException, IOException{
		ArrayList<Comment> allComments = commentDao.getAll();
		ArrayList<Comment> restaurantComments = new ArrayList<Comment>();
		for(Comment c : allComments) {
			if(c.getRestaurant() == restaurantId) {
				restaurantComments.add(c);
			}
		}
		return restaurantComments;
	}
}
