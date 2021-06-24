package services;

import dao.RestaurantDAO;

public class RestaurantService {
	private RestaurantDAO restaurantDao;
	
	public RestaurantService(RestaurantDAO restaurantDao) {
		this.restaurantDao = restaurantDao;
	}
}
