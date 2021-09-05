package services;

import java.io.IOException;

import com.google.gson.JsonSyntaxException;

import beans.User;
import dao.UserDAO;
import dto.LoginDTO;

public class LoginService {

	private UserDAO userDAO;
	
	public LoginService() {
		this.userDAO = new UserDAO("./files/users.json");
	}
	
	public User login(LoginDTO loginAttempt) throws JsonSyntaxException, IOException {
		User user = null;
		System.out.println(loginAttempt.getUsername());
		System.out.println(loginAttempt.getPassword());
		if(loginAttempt.getUsername() != null) {
			user = userDAO.getById(loginAttempt.getUsername());
		}
		
		if(user != null) {
			if(user.getPassword().equals(loginAttempt.getPassword())) {
				return user;
			}
		}
		return null;
	}
}
