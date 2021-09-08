package beans;

import com.google.gson.annotations.SerializedName;

public enum BuyerType {
	@SerializedName("Golden buyer")
   golden,
   @SerializedName("Silver buyer")
   silver,
   @SerializedName("Bronze buyer")
   bronze;

}