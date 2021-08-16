package services;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;

import com.google.gson.JsonSyntaxException;

import beans.Comment;
import beans.User;
import dao.CommentDAO;
import dto.CommentDTO;

public class CommentService {
	private CommentDAO commentDao;
	
	public CommentService() {
		this.commentDao = new CommentDAO("./files/comments.json");
	}
	
	public Collection<CommentDTO> getNotDeletedApprovedCommentsByRestaurant(int restaurantId) throws JsonSyntaxException, IOException{
		ArrayList<Comment> allComments = commentDao.getAllNotDeleted();
		ArrayList<Comment> restaurantComments = new ArrayList<Comment>();
		ArrayList<CommentDTO> restaurantCommentsDTO = new ArrayList<CommentDTO>();
		UserService userService = new UserService();
		for(Comment c : allComments) {
			if(c.getRestaurantId() == restaurantId && c.getIsApproved()) {
				restaurantComments.add(c);
				User user = userService.getById(c.getBuyerId());
				restaurantCommentsDTO.add(new CommentDTO(c.getDetails(), c.getReview(), user.getName() + " " + user.getSurname()));
			}
		}
		return restaurantCommentsDTO;
	}
	
	public Collection<Comment> getNotDeletedCommentsByRestaurant(int restaurantId) throws JsonSyntaxException, IOException{
		ArrayList<Comment> allComments = commentDao.getAllNotDeleted();
		ArrayList<Comment> restaurantComments = new ArrayList<Comment>();
		for(Comment c : allComments) {
			if(c.getRestaurantId() == restaurantId) {
				restaurantComments.add(c);
			}
		}
		return restaurantComments;
	}
}
