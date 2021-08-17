package beans;

import java.util.ArrayList;

public class Cart implements java.io.Serializable{


	/**
	 * 
	 */
	private static final long serialVersionUID = 8552954323788623082L;
	private double price;  
   	private ArrayList<Article> articles;
	private String buyerId;
   	
	public Cart() {
		
	}
	
	public Cart(double price, ArrayList<Article> articles, String buyerId) {
		super();
		this.price = price;
		this.articles = articles;
		this.buyerId = buyerId;
	}
	
	public double getPrice() {
		return price;
	}
	
	public void setPrice(double price) {
		this.price = price;
	}
	
	public String getBuyerId() {
		return buyerId;
	}

	public void setBuyer(String buyerid) {
		this.buyerId = buyerId;
	}
	
	public ArrayList<Article> getArticles() {
		return articles;
	}

	public void setArticles(ArrayList<Article> articles) {
		this.articles = articles;
	}
}