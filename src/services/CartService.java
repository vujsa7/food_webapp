package services;

import java.io.IOException;

import com.google.gson.JsonSyntaxException;

import beans.Buyer;
import beans.Cart;
import dao.UserDAO;

public class CartService {

	private UserDAO userDao;

	public CartService() {
		this.userDao = new UserDAO("./files/users.json");;
	}
	
	public Cart getCart(String buyerId) throws JsonSyntaxException, IOException{
		return ((Buyer)userDao.getById(buyerId)).getCart();
	}
	
	public Cart updateCart(String buyerId, Cart cart) throws JsonSyntaxException, IOException {
		Buyer loggedInBuyer = (Buyer)userDao.getById(buyerId);
		loggedInBuyer.setCart(cart);
		userDao.update(loggedInBuyer);
		return cart;
	}

}
