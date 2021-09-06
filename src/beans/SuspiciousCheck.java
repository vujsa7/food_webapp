package beans;

import java.util.Date;

public class SuspiciousCheck {
	private Date timeRangeStart;
	private int cancelledOrders;
	private boolean isCustomerSuspicious;
	
	public SuspiciousCheck(Date timeRangeStart, int cancelledOrders, boolean isCustomerSuspicious) {
		super();
		this.timeRangeStart = timeRangeStart;
		this.cancelledOrders = cancelledOrders;
		this.isCustomerSuspicious = isCustomerSuspicious;
	}
	
	public Date getTimeRangeStart() {
		return timeRangeStart;
	}
	public void setTimeRangeStart(Date timeRangeStart) {
		this.timeRangeStart = timeRangeStart;
	}
	public int getCancelledOrders() {
		return cancelledOrders;
	}
	public void setCancelledOrders(int cancelledOrders) {
		this.cancelledOrders = cancelledOrders;
	}
	public boolean isCustomerSuspicious() {
		return isCustomerSuspicious;
	}
	public void setCustomerSuspicious(boolean isCustomerSuspicious) {
		this.isCustomerSuspicious = isCustomerSuspicious;
	}
}
