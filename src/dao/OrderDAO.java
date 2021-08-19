package dao;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Random;

import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;

import beans.Order;

public class OrderDAO extends GenericDAOImpl<Order, String>{

	public OrderDAO(String path) {
		super(path, new TypeToken<ArrayList<Order>>(){}.getType() ,new GsonBuilder().setPrettyPrinting().create());
	}
	
	private boolean isIdUnique(String idCandidate) throws JsonSyntaxException, IOException {
		for(Order o : getAll()) {
			if(o.getID() == idCandidate)
				return false;
		}
		return true;
	}
	
	public String generateId() throws JsonSyntaxException, IOException {
		int leftLimit = 48;
	    int rightLimit = 122;
	    int targetStringLength = 10;
	    Random random = new Random();
	    
	    String idCandidate = random.ints(leftLimit, rightLimit + 1)
			      .filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
			      .limit(targetStringLength)
			      .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
			      .toString();
	    
	   while(!isIdUnique(idCandidate)) {
		   idCandidate = random.ints(leftLimit, rightLimit + 1)
				      .filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
				      .limit(targetStringLength)
				      .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
				      .toString();
	   }
		
		String generatedId = idCandidate;
		return generatedId;
	}
}