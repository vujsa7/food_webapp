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
import dto.RegisterNewManagerDTO;
import dto.RegisterNewUserDTO;

public class RegistrationService {
	
	private UserDAO userDao;

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
				false, false, 0, BuyerType.bronze, 0);
		userDao.create(newBuyer);
		return newBuyer;
	}
	
	public User registerNewManager(RegisterNewManagerDTO managerCandidate) throws JsonSyntaxException, IOException {
		User checkUser = userDao.getById(managerCandidate.getUsername());
		if(checkUser != null) {
			return null;
		}
		Manager manager = new Manager(managerCandidate.getUsername(), managerCandidate.getPassword(), managerCandidate.getName(), managerCandidate.getSurname(),
				managerCandidate.getGender(), managerCandidate.getDateOfBirth(), AccountType.manager, false, false);
		userDao.create(manager);
		return manager;
	}
	
	public User registerNewDeliveryWorker(RegisterNewUserDTO userCandidate) throws JsonSyntaxException, IOException {
		User checkUser = userDao.getById(userCandidate.getUsername());
		if(checkUser != null) {
			return null;
		}
			DeliveryWorker newDeliveryWorker = new DeliveryWorker(userCandidate.getUsername(), userCandidate.getPassword(), userCandidate.getName(), userCandidate.getSurname(),
					userCandidate.getGender(), userCandidate.getDateOfBirth(), AccountType.deliveryWorker, false, false);
			userDao.create(newDeliveryWorker);
			return newDeliveryWorker;
	}
}
