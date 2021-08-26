package services;


import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;

import com.google.gson.JsonSyntaxException;

import beans.*;
import dao.*;
import dto.RegisterNewRestaurantDTO;

public class RestaurantService {
	private RestaurantDAO restaurantDao;
	private UserDAO userDao;
	private OrderDAO orderDao;
	private CommentDAO commentDao;
	
	public RestaurantService() {
		this.restaurantDao = new RestaurantDAO("./files/restaurants.json");
		this.userDao = new UserDAO("./files/users.json");
		this.orderDao = new OrderDAO("./files/orders.json");
		this.commentDao = new CommentDAO("./files/comments.json");
	}
	
	public Collection<Restaurant> getAllRestaurants() throws JsonSyntaxException, IOException {
		return restaurantDao.getAllNotDeleted();
	}

	public void addNewRestaurant(Restaurant restaurant) throws JsonSyntaxException, IOException {
		restaurantDao.save(restaurant);
	}
	
	public Restaurant getRestaurantByManager(String managerUsername) throws JsonSyntaxException, IOException{ 
		Manager manager = (Manager) userDao.getById(managerUsername);
		if(manager == null) {
			return null;
		}
		return restaurantDao.getById(manager.getRestaurant());
	}
	
	public Collection<Buyer> getUsersFromRestaurant(String managerUsername) throws JsonSyntaxException, IOException{
		ArrayList<Order> allOrders = orderDao.getAll();
		Restaurant restaurant = getRestaurantByManager(managerUsername);
		ArrayList<Buyer> restaurantBuyers = new ArrayList<Buyer>();
		for(Order o : allOrders) {
			if(o.getRestaurant() == restaurant.getID()) {
				restaurantBuyers.add((Buyer) userDao.getById(o.getBuyer()));
			}
		}
		return restaurantBuyers;
	}
	
	public Restaurant getById(int restaurantId) throws JsonSyntaxException, IOException {
		return restaurantDao.getById(restaurantId);
	}
	
	public Restaurant registerNewRestaurant(RegisterNewRestaurantDTO newRestaurantDTO) throws JsonSyntaxException, IOException {
		Restaurant restaurant = new Restaurant(newRestaurantDTO.getName(), newRestaurantDTO.getRestaurantType(), true, newRestaurantDTO.getLocation(), newRestaurantDTO.getLogo(), newRestaurantDTO.getBannerImage(), newRestaurantDTO.getCoverImage(), 0.0, new ArrayList<Article>(), false);
		restaurant.setID(restaurantDao.generateId());
		Manager manager = (Manager) userDao.getById(newRestaurantDTO.getManager());
		manager.setRestaurant(restaurant.getID());
		userDao.update(manager);
		return restaurantDao.create(restaurant);
	}
	
	public Article addArticle(Article newArticle, Manager manager) throws JsonSyntaxException, IOException {
		Restaurant restaurant = restaurantDao.getById(manager.getRestaurant());
		for(Article a : restaurant.getArticles()) {
			if(a.getName().equals(newArticle.getName())) {
				return null;
			}
		}
		restaurant.addArticle(newArticle);
		restaurantDao.update(restaurant);
		return newArticle;
	}
	
	public Article changeArticle(Article changedArticle, Manager manager) throws JsonSyntaxException, IOException {
		Restaurant restaurant = restaurantDao.getById(manager.getRestaurant());
		for(Article a : restaurant.getArticles()) {
			if(a.getRestaurantId() == changedArticle.getRestaurantId()) {
				a.setName(changedArticle.getName());
				a.setImage(changedArticle.getImage());
				a.setDescription(changedArticle.getDescription());
				a.setArticleType(changedArticle.getArticleType());
				a.setPrice(changedArticle.getPrice());
				a.setQuantity(changedArticle.getQuantity());
			}
		}
		restaurantDao.update(restaurant);
		return changedArticle;
	}
}
