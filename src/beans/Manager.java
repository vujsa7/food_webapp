package beans;

import java.util.Date;

public class Manager extends User{

	private int restaurant;
	
	public Manager() {
		super();
	}
	
	public Manager(String username, String password, String name, String surname, Gender gender, Date dateOfBirth,
			AccountType accountType, boolean isDeleted, boolean isBlocked) {
		super(username, password, name, surname, gender, dateOfBirth, accountType, isDeleted, isBlocked);
		this.restaurant = -1;
	}
	
	public int getRestaurant() {
		return restaurant;
	}
	
	public void setRestaurant(int restaurant) {
		this.restaurant = restaurant;
	}

	@Override
	public String getID() {
		// TODO Auto-generated method stub
		return this.getUsername();
	}

	@Override
	public void setID(String id) {
		// TODO Auto-generated method stub
		this.setUsername(id);
	}

	@Override
	public boolean compareTo(String id) {
		// TODO Auto-generated method stub
		boolean isEqual = true;
		if(!this.getUsername().equals(id)) {
			isEqual =  false;
		}
		return isEqual;
	}

}