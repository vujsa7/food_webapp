package dao;

import java.io.IOException;
import java.util.ArrayList;

import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;

import beans.Order;

public class OrderDAO extends GenericDAOImpl<Order, String>{

	public OrderDAO(String path) {
		super(path, new TypeToken<ArrayList<Order>>(){}.getType() ,new GsonBuilder().setPrettyPrinting().create());
	}
	
	public String generateId() throws JsonSyntaxException, IOException {
		return "";
	}
}