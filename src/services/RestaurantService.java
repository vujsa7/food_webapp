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
	
	public RestaurantService(RestaurantDAO restaurantDao, UserDAO userDao, OrderDAO orderDao, CommentDAO commentDao) {
		this.restaurantDao = restaurantDao;
		this.userDao = userDao;
		this.orderDao = orderDao;
		this.commentDao = commentDao;
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
	
	public User getById(String userId) throws JsonSyntaxException, IOException {
		return userDao.getById(userId);
	}
	
	public Restaurant registerNewRestaurant(RegisterNewRestaurantDTO newRestaurantDTO) throws JsonSyntaxException, IOException {
		Restaurant restaurant = new Restaurant(newRestaurantDTO.getName(), newRestaurantDTO.getRestaurantType(), true, newRestaurantDTO.getLocation(), newRestaurantDTO.getLogo(), newRestaurantDTO.getBannerImage(), 0.0,new ArrayList<Article>(), false);
		restaurant.setID(restaurantDao.generateId());
		Manager manager = (Manager) userDao.getById(newRestaurantDTO.getManager());
		manager.setRestaurant(restaurant.getID());
		userDao.update(manager);
		return restaurantDao.create(restaurant);
	}
}
