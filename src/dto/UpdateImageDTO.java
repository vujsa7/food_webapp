package dto;

public class UpdateImageDTO {
	
	private String image;

	public UpdateImageDTO(String image) {
		super();
		this.setImage(image);
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

}
