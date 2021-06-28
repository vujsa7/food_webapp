package beans;

public class Article{
	
	private int id;
	private String name;
	private double price;
	private ArticleType articleType;
	private int quantity;
	private String description;
	private String image;
	
	public Article(String name, double price, ArticleType articleType, int quantity, String description, String image) {
		super();
		this.name = name;
		this.price = price;
		this.articleType = articleType;
		this.quantity = quantity;
		this.description = description;
		this.image = image;
	}

	public Article() {
		
	}
	
   	public String getName() {
		return name;
	}
   	
	public void setName(String name) {
		this.name = name;
	}
	
	public double getPrice() {
		return price;
	}
	
	public void setPrice(double price) {
		this.price = price;
	}
	
	public ArticleType getArticleType() {
		return articleType;
	}
	
	public void setArticleType(ArticleType articleType) {
		this.articleType = articleType;
	}
	
	public int getQuantity() {
		return quantity;
	}
	
	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}
	
	public String getDescription() {
		return description;
	}
	
	public void setDescription(String description) {
		this.description = description;
	}
	
	public String getImage() {
		return image;
	}
	
	public void setImage(String image) {
		this.image = image;
	}
	
	public int getId() {
		return this.id;
	}
	
	public void setId(int id) {
		this.id = id;
	}
}