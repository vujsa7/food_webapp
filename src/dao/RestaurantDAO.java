package dao;

import java.io.IOException;
import java.util.ArrayList;

import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;

import beans.Restaurant;

public class RestaurantDAO extends GenericDAOImpl<Restaurant, Integer>{

	public RestaurantDAO(String path) {
		super(path, new TypeToken<ArrayList<Restaurant>>(){}.getType(), new GsonBuilder().setPrettyPrinting().create());
	}
	
	public int generateId() throws JsonSyntaxException, IOException {
		return getAll().size() + 1;
	}
}
