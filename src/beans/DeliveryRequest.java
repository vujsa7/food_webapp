package beans;

public class DeliveryRequest {
	
	private String deliveryWorkerId;
	private String orderId;

	public DeliveryRequest(String deliveryWorkerId, String orderId) {
		super();
		this.deliveryWorkerId = deliveryWorkerId;
		this.orderId = orderId;
	}
	public String getDeliveryWorkerId() {
		return deliveryWorkerId;
	}
	public void setDeliveryWorkerId(String deliveryWorkerId) {
		this.deliveryWorkerId = deliveryWorkerId;
	}
	public String getOrderId() {
		return orderId;
	}
	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}
}
