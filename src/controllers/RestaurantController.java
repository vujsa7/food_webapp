package controllers;

import com.google.gson.Gson;

import services.RestaurantService;

public class RestaurantController {
	private RestaurantService restaurantService;
	private static Gson gson = new Gson();
	
	public RestaurantController(RestaurantService restaurantService) {
		this.restaurantService = restaurantService;
	}
}
