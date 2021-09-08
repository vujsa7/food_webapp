package dto;

import beans.BuyerType;

public class OrderStatsDTO {

	private BuyerType buyerType;
	private int points;
	private int ordersThisWeek;
	private int totalOrders;
	
	public OrderStatsDTO(BuyerType buyerType, int points, int ordersThisWeek, int totalOrders) {
		super();
		this.buyerType = buyerType;
		this.points = points;
		this.ordersThisWeek = ordersThisWeek;
		this.totalOrders = totalOrders;
	}

	public BuyerType getBuyerType() {
		return buyerType;
	}

	public void setBuyerType(BuyerType buyerType) {
		this.buyerType = buyerType;
	}

	public int getPoints() {
		return points;
	}

	public void setPoints(int points) {
		this.points = points;
	}

	public int getOrdersThisWeek() {
		return ordersThisWeek;
	}

	public void setOrdersThisWeek(int ordersThisWeek) {
		this.ordersThisWeek = ordersThisWeek;
	}

	public int getTotalOrders() {
		return totalOrders;
	}

	public void setTotalOrders(int totalOrders) {
		this.totalOrders = totalOrders;
	}

}
