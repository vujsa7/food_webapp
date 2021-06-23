package beans;


public class Manager extends User{
	
	private static final long serialVersionUID = 7816566331219962676L;
	
	private Restaurant restaurant;

	public Restaurant getRestaurant() {
		return restaurant;
	}
	
	public void setRestaurant(Restaurant restaurant) {
		this.restaurant = restaurant;
	}

}