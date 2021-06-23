package rest;

import static spark.Spark.get;
import static spark.Spark.port;
import static spark.Spark.post;
import static spark.Spark.staticFiles;

import java.io.File;

import com.google.gson.Gson;

import beans.Product;
import services.ProductService;

public class Main {

	private static Gson g = new Gson();
	private static ProductService productService = new ProductService();
	
	public static void main(String[] args) throws Exception {
		port(8081);

		staticFiles.externalLocation(new File("./static").getCanonicalPath());
		
		get("rest/products/", (req, res) -> {
			res.type("application/json");
			return g.toJson(productService.getProducts());
		});
		
		post("rest/products/add", (req, res) -> {
			res.type("application/json");
			Product pd = g.fromJson(req.body(), Product.class);
			productService.addProduct(pd);
			return "SUCCESS";
		});
	}
}
