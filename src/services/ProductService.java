package services;

import java.util.Collection;

import beans.Product;
import beans.Products;

public class ProductService {
	
	private Products products = new Products();
	
	public Collection<Product> getProducts() {
		return this.products.getProductList();
	}
	
	public void addProduct(Product product) {
		this.products.addProduct(product);
	}

}
