package dao;

import java.lang.reflect.Type;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import beans.Buyer;
import beans.DeliveryWorker;
import beans.Manager;
import beans.User;

public class UserDAO extends JSONRepository<User, String>{

	public UserDAO(String path) {
		super(path, new TypeToken<List<User>>(){}.getType(), createJSONSerializer());
		// TODO Auto-generated constructor stub
	}

	private static Gson createJSONSerializer() {
		// TODO Auto-generated method stub
		RuntimeTypeAdapterFactory userAdapter = RuntimeTypeAdapterFactory.of(User.class)
				.registerSubtype(Buyer.class)
				.registerSubtype(Manager.class)
				.registerSubtype(DeliveryWorker.class);
		
		return new GsonBuilder().registerTypeAdapterFactory(userAdapter).create();
	}

}
