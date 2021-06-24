package dao;

import java.io.IOException;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;

import beans.Order;
public class OrderDAO extends JSONRepository<Order, String>{

	public OrderDAO(String path) {
		super(path, new TypeToken<List<Order>>(){}.getType(), new Gson());
		// TODO Auto-generated constructor stub
	}
	/*
	public int generateId() throws JsonSyntaxException, IOException {
		return getAll().size() + 1;
	}*/
}