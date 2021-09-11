package dto;

public class RestaurantStatsDTO {
	private int thisWeekOrders;
	private int totalOrders;
	private double thisWeekMoney;
	private double totalMoney;
	public RestaurantStatsDTO(int thisWeekOrders, int totalOrders, double thisWeekMoney, double totalMoney) {
		super();
		this.thisWeekOrders = thisWeekOrders;
		this.totalOrders = totalOrders;
		this.thisWeekMoney = thisWeekMoney;
		this.totalMoney = totalMoney;
	}
	public int getThisWeekOrders() {
		return thisWeekOrders;
	}
	public void setThisWeekOrders(int thisWeekOrders) {
		this.thisWeekOrders = thisWeekOrders;
	}
	public int getTotalOrders() {
		return totalOrders;
	}
	public void setTotalOrders(int totalOrders) {
		this.totalOrders = totalOrders;
	}
	public double getThisWeekMoney() {
		return thisWeekMoney;
	}
	public void setThisWeekMoney(double thisWeekMoney) {
		this.thisWeekMoney = thisWeekMoney;
	}
	public double getTotalMoney() {
		return totalMoney;
	}
	public void setTotalMoney(double totalMoney) {
		this.totalMoney = totalMoney;
	}
	
}
