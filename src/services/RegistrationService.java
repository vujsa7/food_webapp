package services;

import java.io.IOException;

import com.google.gson.JsonSyntaxException;

import beans.AccountType;
import beans.Buyer;
import beans.BuyerType;
import beans.DeliveryWorker;
import beans.Manager;
import beans.User;
import dao.UserDAO;
import dto.RegisterNewEmployeeDTO;
import dto.RegisterNewUserDTO;

public class RegistrationService {
	
	private UserDAO userDao;
	private Base64ToImage decoder = new Base64ToImage();

	public RegistrationService() {
		this.userDao = new UserDAO("./files/users.json");
	}
	
	public User getById(String userId) throws JsonSyntaxException, IOException {
		return userDao.getById(userId);
	}
	
	public User registerNewBuyer(RegisterNewUserDTO userCandidate) throws JsonSyntaxException, IOException {
		User checkUser = userDao.getById(userCandidate.getUsername());
		if(checkUser != null) { return null; }
		User newBuyer = new Buyer(userCandidate.getUsername(), userCandidate.getPassword(), userCandidate.getName(),
				userCandidate.getSurname(), userCandidate.getGender(), userCandidate.getDateOfBirth(), AccountType.buyer,
				false, false, 0, BuyerType.bronze, 0,userCandidate.getImage());
		userDao.create(newBuyer);
		return newBuyer;
	}
	
	public User registerNewEmployee(RegisterNewEmployeeDTO newEmployee) throws JsonSyntaxException, IOException {
		User checkUser = userDao.getById(newEmployee.getUsername());
		if(checkUser != null) {
			return null;
		}
		if (newEmployee.getImage() != null) { 
			if (!newEmployee.getImage().isEmpty() && newEmployee.getImage().startsWith("data:image")) {
				String path = "assets/images/restaurant-images/foods/a" + newEmployee.getName() +".jpg";
				decoder.Base64DecodeAndSave(newEmployee.getImage(), path);
				path = "./" + "assets/images/restaurant-images/foods/a" + newEmployee.getName() +".jpg";
				newEmployee.setImage(path);
			} else {
				newEmployee.setImage(newEmployee.getImage());
			}
		}
		if(newEmployee.getAccountType().equals(AccountType.manager)) {
			Manager newManager = new Manager(newEmployee.getUsername(), newEmployee.getPassword(), newEmployee.getName(), newEmployee.getSurname(),
					newEmployee.getGender(), newEmployee.getDateOfBirth(), newEmployee.getAccountType(), false, false,newEmployee.getImage());
			userDao.create(newManager);
			return newManager;
		}else {
			DeliveryWorker newDeliveryWorker = new DeliveryWorker(newEmployee.getUsername(), newEmployee.getPassword(), newEmployee.getName(), newEmployee.getSurname(),
					newEmployee.getGender(), newEmployee.getDateOfBirth(), newEmployee.getAccountType(), false, false,newEmployee.getImage());
			userDao.create(newDeliveryWorker);
			return newDeliveryWorker;
		}
	}
}
