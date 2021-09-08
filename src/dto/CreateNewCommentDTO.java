package dto;

public class CreateNewCommentDTO {

	private String details;
   	private int review;   
   	private int restaurantId;
	private String buyerId;
	
	public CreateNewCommentDTO(String details, int review, int restaurantId, String buyerId) {
		super();
		this.details = details;
		this.review = review;
		this.restaurantId = restaurantId;
		this.buyerId = buyerId;
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

	public int getRestaurantId() {
		return restaurantId;
	}

	public void setRestaurantId(int restaurantId) {
		this.restaurantId = restaurantId;
	}

	public String getBuyerId() {
		return buyerId;
	}

	public void setBuyerId(String buyerId) {
		this.buyerId = buyerId;
	}
	
	
	

}
