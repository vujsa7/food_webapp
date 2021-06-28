package services;


import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;

import com.google.gson.JsonSyntaxException;

import beans.*;
import dao.*;

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
}
