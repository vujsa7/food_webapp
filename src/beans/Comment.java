package beans;


public class Comment implements IIdentifiable<Integer>{
	
	private int id;
	private String details;
   	private int review;   
   	private int restaurant;
	private String buyer;
	private boolean isDeleted;
	private boolean isApproved;
	
	public Comment() {
		
	}
	
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
	public int getRestaurant() {
		return restaurant;
	}
	public void setRestaurant(int restaurant) {
		this.restaurant = restaurant;
	}
	public String getBuyer() {
		return buyer;
	}
	public void setBuyer(String buyer) {
		this.buyer = buyer;
	}
	
	public boolean getIsApproved() {
		return this.isApproved;
	}
	
	public void setIsApproved(boolean isApproved) {
		this.isApproved = isApproved;
	}

	@Override
	public Integer getID() {
		// TODO Auto-generated method stub
		return this.id;
	}

	@Override
	public void setID(Integer id) {
		// TODO Auto-generated method stub
		this.id = id;
	}

	@Override
	public boolean compareTo(Integer id) {
		// TODO Auto-generated method stub
		boolean isEqual = true;
		if(!(this.id == id)) {
			isEqual = false;
		}
		return isEqual;
	}

	@Override
	public void setDeleted(boolean value) {
		// TODO Auto-generated method stub
		this.isDeleted = value;
	}

	@Override
	public boolean isDeleted() {
		// TODO Auto-generated method stub
		return this.isDeleted;
	}
}