package dto;

public class DeletedArticleDTO {
	private int restaurantId;
	private String articleName;
	public DeletedArticleDTO(int restaurantId, String articleName) {
		super();
		this.restaurantId = restaurantId;
		this.articleName = articleName;
	}
	public int getRestaurantId() {
		return restaurantId;
	}
	public void setRestaurantId(int restaurantId) {
		this.restaurantId = restaurantId;
	}
	public String getName() {
		return articleName;
	}
	public void setName(String articleName) {
		this.articleName = articleName;
	}
}
