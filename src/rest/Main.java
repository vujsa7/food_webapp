package rest;

import static spark.Spark.get;
import static spark.Spark.port;
import static spark.Spark.post;
import static spark.Spark.staticFiles;

import java.io.File;
import dao.UserDAO;

public class Main {

	public static void main(String[] args) throws Exception {
		port(8080);

		staticFiles.externalLocation(new File("./static").getCanonicalPath());
		
		UserDAO userDao = new UserDAO("./files/users.json");
		
		post("rest/test", (req, res) -> {
			return "SUCCESS";
		});
	}
}
