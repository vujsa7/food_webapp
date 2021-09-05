package services;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;

import com.google.gson.JsonSyntaxException;

import beans.*;
import dao.UserDAO;
import dto.*;

public class UserService {
	private UserDAO userDao;
	
	public UserService() {
		this.userDao = new UserDAO("./files/users.json");;
	}
	
	public Collection<User> getAll() throws JsonSyntaxException, IOException{
		return userDao.getAll();
	}
	
	public User getById(String userId) throws JsonSyntaxException, IOException {
		return userDao.getById(userId);
	}
	
	public Buyer updateBuyer(Buyer buyer, UpdateUserDTO updatedProfile) throws JsonSyntaxException, IOException {
		buyer.setName(updatedProfile.getName());
		buyer.setSurname(updatedProfile.getSurname());
		buyer.setUsername(updatedProfile.getUsername());
		buyer.setDateOfBirth(updatedProfile.getDateOfBirth());
		buyer.setGender(updatedProfile.getGender());
		return (Buyer) userDao.update(buyer);
	}
	
	public Administrator updateAdministrator(Administrator admin, UpdateUserDTO updatedProfile) throws JsonSyntaxException, IOException {
		admin.setName(updatedProfile.getName());
		admin.setSurname(updatedProfile.getSurname());
		admin.setUsername(updatedProfile.getUsername());
		admin.setDateOfBirth(updatedProfile.getDateOfBirth());
		admin.setGender(updatedProfile.getGender());
		return (Administrator) userDao.update(admin);
	}
	
	public Manager updateManager(Manager manager, UpdateUserDTO updatedProfile) throws JsonSyntaxException, IOException {
		manager.setName(updatedProfile.getName());
		manager.setSurname(updatedProfile.getSurname());
		manager.setUsername(updatedProfile.getUsername());
		manager.setDateOfBirth(updatedProfile.getDateOfBirth());
		manager.setGender(updatedProfile.getGender());
		return (Manager) userDao.update(manager);
	}
	
	public DeliveryWorker updateDeliveryWorker(DeliveryWorker deliveryWorker, UpdateUserDTO updatedProfile) throws JsonSyntaxException, IOException {
		deliveryWorker.setName(updatedProfile.getName());
		deliveryWorker.setSurname(updatedProfile.getSurname());
		deliveryWorker.setUsername(updatedProfile.getUsername());
		deliveryWorker.setDateOfBirth(updatedProfile.getDateOfBirth());
		deliveryWorker.setGender(updatedProfile.getGender());
		return (DeliveryWorker) userDao.update(deliveryWorker);
	}
	
	public Collection<AvailableManagersDTO> getAvailableManagers() throws JsonSyntaxException, IOException{
		ArrayList<User> allUsers = userDao.getAllNotDeleted();
		ArrayList<AvailableManagersDTO> availableManagers = new ArrayList<AvailableManagersDTO>();
		for(User u : allUsers) {
			if(u.getAccountType().equals(AccountType.manager)) {
				Manager m = (Manager) u;
				if(m.getRestaurant() == -1) {
					availableManagers.add(new AvailableManagersDTO(m.getID(),m.getName(),m.getSurname()));
				}
			}
		}
		return availableManagers;
	} 
	
	public void blockUser(String username) throws JsonSyntaxException, IOException {
		ArrayList<User> allUsers = userDao.getAllNotDeleted();
		for(User u : allUsers) {
			if(u.getUsername().equals(username)) {
				u.setBlocked(true);
				System.out.println(u.getUsername() + " " + u.isBlocked());
				userDao.update(u);
			}
		}
	}
	
	public void unblockUser(String username) throws JsonSyntaxException, IOException {
		ArrayList<User> allUsers = userDao.getAllNotDeleted();
		for(User u : allUsers) {
			if(u.getUsername().equals(username)) {
				u.setBlocked(false);
				userDao.update(u);
			}
		}
	}
}
