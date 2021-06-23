package beans;


public class Manager extends User{
	
	private Restaurant restaurant;

	public Restaurant getRestaurant() {
		return restaurant;
	}
	
	public void setRestaurant(Restaurant restaurant) {
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