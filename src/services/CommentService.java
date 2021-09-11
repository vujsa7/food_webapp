package services;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;

import com.google.gson.JsonSyntaxException;

import beans.Comment;
import beans.Restaurant;
import beans.User;
import dao.CommentDAO;
import dao.RestaurantDAO;
import dto.CommentDTO;
import dto.CreateNewCommentDTO;

public class CommentService {
	private CommentDAO commentDao;
	private RestaurantDAO restaurantDao;
	
	public CommentService() {
		this.commentDao = new CommentDAO("./files/comments.json");
		this.restaurantDao = new RestaurantDAO("./files/restaurants.json");
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
				restaurantCommentsDTO.add(new CommentDTO(c.getDetails(), c.getReview(), user.getName() + " " + user.getSurname(), user.getImage()));
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

	public void approveComment(int id) throws JsonSyntaxException, IOException {
		// TODO Auto-generated method stub
		ArrayList<Comment> allComments = commentDao.getAllNotDeleted();
		int restaurantId = commentDao.getById(id).getRestaurantId();
		Restaurant restaurant = restaurantDao.getById(restaurantId);
		double rating = 0;
		int numberOfRatings = 0;
		for(Comment c : allComments) {
			if(c.getID() == id) {
				c.setIsApproved(true);
				commentDao.update(c);
			}
			if(c.getRestaurantId() == restaurant.getID() && c.getIsApproved()) {
				rating += c.getReview();
				numberOfRatings++;
			}
		}
		restaurant.setRating(rating/numberOfRatings);
		restaurantDao.update(restaurant);
	}
	
	public Comment deleteComment(int id) throws JsonSyntaxException, IOException {
		// TODO Auto-generated method stub
		ArrayList<Comment> allComments = commentDao.getAllNotDeleted();
		for(Comment c : allComments) {
			if(c.getID() == id) {
				c.setDeleted(true);
				commentDao.update(c);
				return c;
			}
		}
		return null;
	}

	public void createCommentCandidate(CreateNewCommentDTO createNewCommentDTO) throws JsonSyntaxException, IOException {
		Comment candidate = new Comment(commentDao.generateId(), createNewCommentDTO.getDetails(), createNewCommentDTO.getReview(), createNewCommentDTO.getRestaurantId(), createNewCommentDTO.getBuyerId(), false, false);
		commentDao.save(candidate);
	}
}
