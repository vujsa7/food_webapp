package beans;

import com.google.gson.annotations.SerializedName;

public enum OrderStatus {
	@SerializedName("processing")
   processing,
   @SerializedName("inPreparation")
   inPreparation,
   @SerializedName("awaitingDelivery")
   awaitingDelivery,
   @SerializedName("shipping")
   shipping,
   @SerializedName("delivered")
   delivered,
   @SerializedName("canceled")
   canceled;
}