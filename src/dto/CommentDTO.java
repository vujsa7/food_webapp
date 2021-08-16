package dto;

public class CommentDTO {
	
	private String details;
	private int review;
	private String buyerNameAndSurname;
	
	public CommentDTO(String details, int review, String buyerNameAndSurname) {
		super();
		this.details = details;
		this.review = review;
		this.buyerNameAndSurname = buyerNameAndSurname;
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
	
}
