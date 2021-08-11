package beans;

import com.google.gson.annotations.SerializedName;

public enum RestaurantType {
	@SerializedName("italian")
   italian,
   @SerializedName("chinese")
   chinese,
   @SerializedName("barbecue")
   barbecue;
}