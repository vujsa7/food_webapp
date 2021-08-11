package beans;

import com.google.gson.annotations.SerializedName;

public enum ArticleType {
	@SerializedName("meal")
   meal,
   @SerializedName("drink")
   drink;
}