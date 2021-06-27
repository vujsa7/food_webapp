package controllers;

import static spark.Spark.get;

import com.google.gson.Gson;

import services.RestaurantService;

public class RestaurantController {
	private static Gson gson = new Gson();
	
	public RestaurantController(RestaurantService restaurantService) {
		
		
		get("rest/restaurants/", (req, res) -> {
			res.type("application/json");
			return gson.toJson(restaurantService.getAllRestaurants());
		});
	}
}
