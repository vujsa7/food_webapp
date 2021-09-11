package services;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;

import com.google.gson.JsonElement;
import com.google.gson.JsonSyntaxException;

import beans.*;
import dao.UserDAO;
import dto.*;

public class UserService {
	private UserDAO userDao;
	private Base64ToImage decoder = new Base64ToImage();
	
	public UserService() {
		this.userDao = new UserDAO("./files/users.json");;
	}
	
	public Collection<AllUsersDTO> getAll() throws JsonSyntaxException, IOException{
		ArrayList<AllUsersDTO> allUsers = new ArrayList<AllUsersDTO>();
		for(User u : userDao.getAllNotDeleted()) {
			if(u.getAccountType().equals(AccountType.buyer)) {
				Buyer b = (Buyer)u;
				allUsers.add(new AllUsersDTO(b.getID(), b.getName(),b.getSurname(),b.getAccountType(),b.getBuyerType(), b.getImage(),b.isBlocked()));
			}else {
				allUsers.add(new AllUsersDTO(u.getID(), u.getName(),u.getSurname(),u.getAccountType(),null, u.getImage(),u.isBlocked()));
			}
		}
		return allUsers;
	}
	
	public Collection<SuspiciousBuyersDTO> getSuspicious() throws JsonSyntaxException, IOException{
		ArrayList<SuspiciousBuyersDTO> suspiciousCustomers = new ArrayList<SuspiciousBuyersDTO>();
		for(User u : userDao.getAllNotDeleted()) {
			if(u.getAccountType().equals(AccountType.buyer)) {
				Buyer buyer = (Buyer)u;
				if(buyer.getSuspiciousCheck().isCustomerSuspicious() && !buyer.isBlocked()) {
					suspiciousCustomers.add(new SuspiciousBuyersDTO(buyer.getID(),buyer.getName(),buyer.getSurname(),buyer.getBuyerType(),buyer.getSuspiciousCheck()));
				}
			}
		}
		return suspiciousCustomers;
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

	public UpdatePersonalInfoDTO updatePersonalInfo(User loggedInUser, UpdatePersonalInfoDTO updatedPersonalInfo) throws JsonSyntaxException, IOException {
		loggedInUser.setName(updatedPersonalInfo.getName());
		loggedInUser.setSurname(updatedPersonalInfo.getSurname());
		loggedInUser.setGender(updatedPersonalInfo.getGender());
		loggedInUser.setDateOfBirth(updatedPersonalInfo.getDateOfBirth());
		userDao.update(loggedInUser);
		return updatedPersonalInfo;
	}


	public LoggedInUserDTO updateProfileImage(User user, String imgString) throws FileNotFoundException, IOException {
		if (imgString != null) { 
			if (!imgString.isEmpty() && imgString.startsWith("data:image")) {
				String path = "assets/images/user-images/" + user.getID() +".jpg";
				decoder.Base64DecodeAndSave(imgString, path);
				path = "../" + "assets/images/user-images/" + user.getID() +".jpg";
				user.setImage(path);
				userDao.update(user);
			}
		}
		return new LoggedInUserDTO(user.getID(), user.getName(), user.getSurname(), user.getGender(), user.getDateOfBirth(), user.getAccountType(), user.getImage());
	}
	
	public Boolean updateUserPassword(User user, PasswordChangeDTO passwordChangeDTO) throws JsonSyntaxException, IOException {
		if(user.getPassword().equals(passwordChangeDTO.getCurrentPassword())) {
			user.setPassword(passwordChangeDTO.getNewPassword());
			userDao.update(user);
			return true;
		}
		return false;
		
	}
	
	public Boolean updateUsername(String newUsername, User user) throws JsonSyntaxException, IOException {
		for(User u : userDao.getAllNotDeleted()) {
			if(u.getID().equals(newUsername)) {
				return false;
			}
		}
		userDao.updateUsername(user, newUsername);
		return true;
	}
	
	public void deleteUser(String username) throws JsonSyntaxException, IOException {
		User user = userDao.getById(username);
		if(user != null) {
			user.setDeleted(true);
			userDao.update(user);
		}
	}
}
