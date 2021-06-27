package services;


import java.io.IOException;
import java.util.Collection;

import com.google.gson.JsonSyntaxException;

import beans.Restaurant;
import dao.RestaurantDAO;

public class RestaurantService {
	private RestaurantDAO restaurantDao;
	
	public RestaurantService(RestaurantDAO restaurantDao) {
		this.restaurantDao = restaurantDao;
	}
	
	public Collection<Restaurant> getAllRestaurants() throws JsonSyntaxException, IOException {
		return restaurantDao.getAllNotDeleted();
	}

	public void addNewRestaurant(Restaurant restaurant) throws JsonSyntaxException, IOException {
		restaurantDao.save(restaurant);
	}
}
