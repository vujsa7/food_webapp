package beans;

import com.google.gson.annotations.SerializedName;

public enum AccountType {
	@SerializedName("buyer")
   buyer,
   @SerializedName("deliveryWorker")
   deliveryWorker,
   @SerializedName("manager")
   manager,
   @SerializedName("administrator")
   administrator;

}