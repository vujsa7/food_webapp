package dao;

import java.util.ArrayList;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import beans.Administrator;
import beans.Buyer;
import beans.DeliveryWorker;
import beans.Manager;
import beans.User;

public class UserDAO extends GenericDAOImpl<User, String>{

	public UserDAO(String path) {
		super(path, new TypeToken<ArrayList<User>>(){}.getType(), createJSONSerializer());
		// TODO Auto-generated constructor stub
	}

	private static Gson createJSONSerializer() {
		// TODO Auto-generated method stub
		RuntimeTypeAdapterFactory<User> userAdapter = RuntimeTypeAdapterFactory.of(User.class)
				.registerSubtype(Buyer.class)
				.registerSubtype(Manager.class)
				.registerSubtype(Administrator.class)
				.registerSubtype(DeliveryWorker.class);
		
		return new GsonBuilder().registerTypeAdapterFactory(userAdapter).setPrettyPrinting().create();
	}

}
