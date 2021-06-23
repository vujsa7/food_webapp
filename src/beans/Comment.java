package beans;


public class Comment implements java.io.Serializable{
	
	private static final long serialVersionUID = -1289544689378656493L;
	
	private String details;
   	private int review;
   
   	private Restaurant restaurant;
	private Buyer buyer;
   
	public String getDetails() {
		return details;
	}
	public void setDetails(String details) {
		this.details = details;
	}
	public int getReview() {
		return review;
	}
	public void setReview(int review) {
		this.review = review;
	}
	public Restaurant getRestaurant() {
		return restaurant;
	}
	public void setRestaurant(Restaurant restaurant) {
		this.restaurant = restaurant;
	}
	public Buyer getBuyer() {
		return buyer;
	}
	public void setBuyer(Buyer buyer) {
		this.buyer = buyer;
	}

   
}