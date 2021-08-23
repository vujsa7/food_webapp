package dto;

import java.util.Date;

import beans.OrderStatus;
import beans.RestaurantType;

public class OrderDisplayDTO {

	private String id;
	private Date dateOfOrder;
	private double price;
	private OrderStatus orderStatus;
   
	private int restaurantId;
	private String restaurantName;
	private RestaurantType restaurantType;
	private String buyerId;
	private boolean isReviewed;
	
	
	
	public OrderDisplayDTO(String id, Date dateOfOrder, double price, OrderStatus orderStatus, int restaurantId,
			String restaurantName, RestaurantType restaurantType, String buyerId, boolean isReviewed) {
		super();
		this.id = id;
		this.dateOfOrder = dateOfOrder;
		this.price = price;
		this.orderStatus = orderStatus;
		this.restaurantId = restaurantId;
		this.restaurantName = restaurantName;
		this.restaurantType = restaurantType;
		this.buyerId = buyerId;
		this.isReviewed = isReviewed;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Date getDateOfOrder() {
		return dateOfOrder;
	}

	public void setDateOfOrder(Date dateOfOrder) {
		this.dateOfOrder = dateOfOrder;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public OrderStatus getOrderStatus() {
		return orderStatus;
	}

	public void setOrderStatus(OrderStatus orderStatus) {
		this.orderStatus = orderStatus;
	}

	public int getRestaurantId() {
		return restaurantId;
	}

	public void setRestaurantId(int restaurantId) {
		this.restaurantId = restaurantId;
	}

	public String getRestaurantName() {
		return restaurantName;
	}

	public void setRestaurantName(String restaurantName) {
		this.restaurantName = restaurantName;
	}

	public RestaurantType getRestaurantType() {
		return restaurantType;
	}

	public void setCuisineType(RestaurantType restaurantType) {
		this.restaurantType = restaurantType;
	}

	public String getBuyerId() {
		return buyerId;
	}

	public void setBuyerId(String buyerId) {
		this.buyerId = buyerId;
	}

	public boolean isReviewed() {
		return isReviewed;
	}

	public void setReviewed(boolean isReviewed) {
		this.isReviewed = isReviewed;
	}
	
	
	
}
