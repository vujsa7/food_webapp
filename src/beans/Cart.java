package beans;

import java.util.ArrayList;

public class Cart implements java.io.Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 8552954323788623082L;
	private double price;  
   	private ArrayList<Article> articles;
	private Buyer buyer;
   	
	public Cart() {
		
	}
	
	public double getPrice() {
		return price;
	}
	
	public void setPrice(double price) {
		this.price = price;
	}
	
	public Buyer getBuyer() {
		return buyer;
	}

	public void setBuyer(Buyer buyer) {
		this.buyer = buyer;
	}
	
	public ArrayList<Article> getArticles() {
		return articles;
	}

	public void setArticles(ArrayList<Article> articles) {
		this.articles = articles;
	}
}