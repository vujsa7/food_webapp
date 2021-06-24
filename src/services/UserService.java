package services;

import java.io.IOException;

import com.google.gson.JsonSyntaxException;

import beans.AccountType;
import beans.Buyer;
import beans.DeliveryWorker;
import beans.Manager;
import beans.User;
import dao.UserDAO;
import dto.LoginDTO;
import dto.RegisterNewUserDTO;

public class UserService {
	private UserDAO userDao;
	
	public UserService(UserDAO userDao) {
		this.userDao = userDao;
	}
	
	public User registerNewUser(RegisterNewUserDTO newUser) throws JsonSyntaxException, IOException {
		User checkUser = userDao.getById(newUser.getUsername());
		if(checkUser != null) {
			return null;
		}
		
		if(newUser.getAccountType().equals(AccountType.buyer)) {
			Buyer newBuyer = new Buyer(newUser.getUsername(), newUser.getPassword(), newUser.getName(), newUser.getSurname(),
					newUser.getGender(), newUser.getDateOfBirth(), newUser.getAccountType(),false,false);
			userDao.create(newBuyer);
			return newBuyer;
		}else if(newUser.getAccountType().equals(AccountType.deliveryWorker)) {
			DeliveryWorker newDeliveryWorker = new DeliveryWorker(newUser.getUsername(), newUser.getPassword(), newUser.getName(), newUser.getSurname(),
					newUser.getGender(), newUser.getDateOfBirth(), newUser.getAccountType(),false,false);
			userDao.create(newDeliveryWorker);
			return newDeliveryWorker;
		}else if(newUser.getAccountType().equals(AccountType.manager)) {
			Manager manager = new Manager(newUser.getUsername(), newUser.getPassword(), newUser.getName(), newUser.getSurname(),
					newUser.getGender(), newUser.getDateOfBirth(), newUser.getAccountType(),false,false);
			userDao.create(manager);
			return manager;
		}
		return null;
	}
	
	public User login(LoginDTO loginUser) throws JsonSyntaxException, IOException {
		User checkUser = null;
		if(loginUser.getUsername() != null) {
			checkUser = userDao.getById(loginUser.getUsername());
		}
		
		if(checkUser != null) {
			if(checkUser.getPassword().equals(loginUser.getPassword())) {
				return checkUser;
			}
		}
		return null;
	}
}
