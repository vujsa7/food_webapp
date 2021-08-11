package beans;

import com.google.gson.annotations.SerializedName;

public enum BuyerType {
	@SerializedName("golden")
   golden,
   @SerializedName("silver")
   silver,
   @SerializedName("bronze")
   bronze;

}