package dto;

public class CommentDTO {
	
	private String details;
	private int review;
	private String buyerNameAndSurname;
	private String image;
	private boolean isApproved;
	
	public CommentDTO(String details, int review, String buyerNameAndSurname, String image, boolean isApproved) {
		super();
		this.details = details;
		this.review = review;
		this.buyerNameAndSurname = buyerNameAndSurname;
		this.image = image;
		this.isApproved = isApproved;
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

	public String getBuyerNameAndSurname() {
		return buyerNameAndSurname;
	}

	public void setBuyerNameAndSurname(String buyerNameAndSurname) {
		this.buyerNameAndSurname = buyerNameAndSurname;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public boolean isApproved() {
		return isApproved;
	}

	public void setApproved(boolean isApproved) {
		this.isApproved = isApproved;
	}
	
}
