package services;


import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;

import com.google.gson.JsonSyntaxException;

import beans.*;
import dao.*;
import dto.ArticleDTO;
import dto.RegisterNewRestaurantDTO;

public class RestaurantService {
	private RestaurantDAO restaurantDao;
	private UserDAO userDao;
	private OrderDAO orderDao;
	private CommentDAO commentDao;
	private Base64ToImage decoder = new Base64ToImage();
	
	public RestaurantService() {
		this.restaurantDao = new RestaurantDAO("./files/restaurants.json");
		this.userDao = new UserDAO("./files/users.json");
		this.orderDao = new OrderDAO("./files/orders.json");
		this.commentDao = new CommentDAO("./files/comments.json");
	}
	
	public Collection<Restaurant> getAllRestaurants() throws JsonSyntaxException, IOException {
		return restaurantDao.getAllNotDeleted();
	}

	public void addNewRestaurant(Restaurant restaurant) throws JsonSyntaxException, IOException {
		restaurantDao.save(restaurant);
	}
	
	public Restaurant getRestaurantByManager(String managerUsername) throws JsonSyntaxException, IOException{ 
		Manager manager = (Manager) userDao.getById(managerUsername);
		if(manager == null) {
			return null;
		}
		return restaurantDao.getById(manager.getRestaurant());
	}
	
	public Collection<Buyer> getUsersFromRestaurant(String managerUsername) throws JsonSyntaxException, IOException{
		ArrayList<Order> allOrders = orderDao.getAllNotDeleted();
		Restaurant restaurant = getRestaurantByManager(managerUsername);
		ArrayList<Buyer> restaurantBuyers = new ArrayList<Buyer>();
		for(Order o : allOrders) {
			if(o.getRestaurant() == restaurant.getID() && !isUserVisited(restaurantBuyers, o.getBuyer())) {
				restaurantBuyers.add((Buyer) userDao.getById(o.getBuyer()));
			}
		}
		return restaurantBuyers;
	}
	
	private boolean isUserVisited(ArrayList<Buyer> restaurantBuyers, String buyerId) {
		boolean isVisited = false;
		for(Buyer b : restaurantBuyers) {
			if(b.getID().equals(buyerId)) {
				isVisited = true;
				break;
			}
		}
		return isVisited;
	}
	
	public Restaurant getById(int restaurantId) throws JsonSyntaxException, IOException {
		return restaurantDao.getById(restaurantId);
	}
	
	public Restaurant registerNewRestaurant(RegisterNewRestaurantDTO newRestaurantDTO) throws JsonSyntaxException, IOException {
		Address address = new Address(newRestaurantDTO.getStreet(), newRestaurantDTO.getStreetNumber(), new City(newRestaurantDTO.getCity(), newRestaurantDTO.getCityPostalCode())); 
		Restaurant restaurant = new Restaurant(newRestaurantDTO.getName(), newRestaurantDTO.getRestaurantType(), true, new Location("0","0",address), newRestaurantDTO.getLogo(), newRestaurantDTO.getBannerImage(), newRestaurantDTO.getCoverImage(), 0.0, new ArrayList<Article>(), false);
		restaurant.setID(restaurantDao.generateId());
		Manager manager = (Manager) userDao.getById(newRestaurantDTO.getManager());
		manager.setRestaurant(restaurant.getID());
		userDao.update(manager);
		return restaurantDao.create(restaurant);
	}
	
	public Article addArticle(Article newArticle, Manager manager) throws JsonSyntaxException, IOException {
		Restaurant restaurant = restaurantDao.getById(manager.getRestaurant());
		for(Article a : restaurant.getArticles()) {
			if(a.getName().equals(newArticle.getName())) {
				return null;
			}
		}
		if (newArticle.getImage() != null) { 
			if (!newArticle.getImage().isEmpty() && newArticle.getImage().startsWith("data:image")) {
				String path = "assets/images/restaurant-images/foods/a" + newArticle.getName() +".jpg";
				decoder.Base64DecodeAndSave(newArticle.getImage(), path);
				path = "./" + "assets/images/restaurant-images/foods/a" + newArticle.getName() +".jpg";
				newArticle.setImage(path);
			} else {
				newArticle.setImage(newArticle.getImage());
			}
		}
		restaurant.addArticle(newArticle);
		restaurantDao.update(restaurant);
		return newArticle;
	}
	
	public Article changeArticle(ArticleDTO changedArticle, Manager manager) throws JsonSyntaxException, IOException {
		Restaurant restaurant = restaurantDao.getById(manager.getRestaurant());
		Article editedArticle = null;
		for(Article a : restaurant.getArticles()) {
			if(a.getName().equals(changedArticle.getName()) && !(changedArticle.getOldName().equals(changedArticle.getName()))) {
				return null;
			}
			if(a.getName().equals(changedArticle.getOldName())) {
				a.setName(changedArticle.getName());
				if (changedArticle.getImage() != null) { 
					if (!changedArticle.getImage().isEmpty() && changedArticle.getImage().startsWith("data:image")) {
						String path = "assets/images/restaurant-images/foods/a" + changedArticle.getName() +".jpg";
						decoder.Base64DecodeAndSave(changedArticle.getImage(), path);
						path = "./" + "assets/images/restaurant-images/foods/a" + changedArticle.getName() +".jpg";
						changedArticle.setImage(path);
					} else {
						changedArticle.setImage(changedArticle.getImage());
					}
				}
				editedArticle = new Article(changedArticle.getRestaurantId(),changedArticle.getName(),changedArticle.getPrice(),changedArticle.getArticleType(),changedArticle.getQuantity(),changedArticle.getDescription(),changedArticle.getImage());
				restaurant.changeArticle(editedArticle, changedArticle.getOldName());
				break;
			}
		}
		restaurantDao.update(restaurant);
		return editedArticle;
	}
}
