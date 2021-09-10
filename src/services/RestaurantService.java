package services;


import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Random;

import com.google.gson.JsonSyntaxException;

import beans.*;
import dao.*;
import dto.AllUsersDTO;
import dto.ArticleDTO;
import dto.DeletedArticleDTO;
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
	
	public Restaurant getRestaurantByManager(String managerUsername) throws JsonSyntaxException, IOException{ 
		Manager manager = (Manager) userDao.getById(managerUsername);
		if(manager == null) {
			return null;
		}
		return restaurantDao.getById(manager.getRestaurant());
	}
	
	public Collection<AllUsersDTO> getUsersFromRestaurant(String managerUsername) throws JsonSyntaxException, IOException{
		ArrayList<Order> allOrders = orderDao.getAllNotDeleted();
		Restaurant restaurant = getRestaurantByManager(managerUsername);
		ArrayList<AllUsersDTO> restaurantBuyers = new ArrayList<AllUsersDTO>();
		for(Order o : allOrders) {
			if(o.getRestaurant() == restaurant.getID() && !isUserVisited(restaurantBuyers, o.getBuyer())) {
				Buyer b = (Buyer)userDao.getById(o.getBuyer());
				restaurantBuyers.add(new AllUsersDTO(b.getID(),b.getName(),b.getSurname(),b.getAccountType(),b.getBuyerType(),b.isBlocked()));
			}
		}
		return restaurantBuyers;
	}
	
	private boolean isUserVisited(ArrayList<AllUsersDTO> restaurantBuyers, String buyerId) {
		boolean isVisited = false;
		for(AllUsersDTO b : restaurantBuyers) {
			if(b.getUsername().equals(buyerId)) {
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
		Restaurant restaurant = new Restaurant(newRestaurantDTO.getName(), newRestaurantDTO.getRestaurantType(), true, new Location(newRestaurantDTO.getLongitude(),newRestaurantDTO.getLatitude(),address), newRestaurantDTO.getLogo(), newRestaurantDTO.getBannerImage(), newRestaurantDTO.getCoverImage(), 0.0, new ArrayList<Article>(), false);
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
				String path = "assets/images/restaurant-images/foods/a" + newArticle.getName() + newArticle.getRestaurantId() +".jpg";
				decoder.Base64DecodeAndSave(newArticle.getImage(), path);
				path = "./" + "assets/images/restaurant-images/foods/a" + newArticle.getName() + newArticle.getRestaurantId() +".jpg";
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
			if(a.getName().equals(changedArticle.getName()) && !changedArticle.getOldName().equals(changedArticle.getName())) {
				System.out.println("OVDEEE");
				return null;
			}
			if(a.getName().equals(changedArticle.getOldName())) {
				a.setName(changedArticle.getName());
				if (changedArticle.getImage() != null) { 
					if (!changedArticle.getImage().isEmpty() && changedArticle.getImage().startsWith("data:image")) {
						Random ran = new Random();
						int x = ran.nextInt(100);
						String path = "assets/images/restaurant-images/foods/a" + changedArticle.getName() + restaurant.getID() + x +".jpg";
						decoder.Base64DecodeAndSave(changedArticle.getImage(), path);
						path = "./" + "assets/images/restaurant-images/foods/a" + changedArticle.getName() + restaurant.getID() + x +".jpg";
						changedArticle.setImage(path);
					} else {
						changedArticle.setImage(changedArticle.getImage());
					}
				}
				editedArticle = new Article(changedArticle.getRestaurantId(),changedArticle.getName(),changedArticle.getPrice(),changedArticle.getArticleType(),changedArticle.getQuantity(),changedArticle.getDescription(),changedArticle.getImage(),a.isDeleted());
				restaurant.changeArticle(editedArticle, changedArticle.getOldName());
				break;
			}
		}
		System.out.println("AJDE");
		restaurantDao.update(restaurant);
		System.out.println(editedArticle.getImage() + "AAAAAAAAA");
		return editedArticle;
	}
	
	public void deleteArticle(DeletedArticleDTO deletedArticle) throws JsonSyntaxException, IOException {
		Restaurant restaurant = restaurantDao.getById(deletedArticle.getRestaurantId());
		restaurant.deleteArticle(deletedArticle.getName());
		restaurantDao.update(restaurant);
	}
	
	public void deleteRestaurant(int restaurantId) throws JsonSyntaxException, IOException {
		Restaurant restaurant = restaurantDao.getById(restaurantId);
		if(restaurant != null) {
			restaurant.setDeleted(true);
			restaurantDao.update(restaurant);
		}
	}
}
