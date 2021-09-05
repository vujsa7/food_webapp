package beans;


import java.util.*;

public abstract class User implements IIdentifiable<String>{
	
	private String username;
   	private String password;
   	private String name;
   	private String surname;
   	private Gender gender;
   	private Date dateOfBirth;
   	private AccountType accountType;
   	private boolean isDeleted;
   	private boolean isBlocked;
   	private String image;
   	private String jwtToken;
   
   	public User() {}
   	
	public User(String username, String password, String name, String surname, Gender gender, Date dateOfBirth,
			AccountType accountType, boolean isDeleted, boolean isBlocked, String image) {
		super();
		this.username = username;
		this.password = password;
		this.name = name;
		this.surname = surname;
		this.gender = gender;
		this.dateOfBirth = dateOfBirth;
		this.accountType = accountType;
		this.isDeleted = isDeleted;
		this.isBlocked = isBlocked;
		this.image = image;
	}

	public String getUsername() {
		return username;
	}
	
	public void setUsername(String username) {
		this.username = username;
	}
	
	public String getPassword() {
		return password;
	}
	
	public void setPassword(String password) {
		this.password = password;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getSurname() {
		return surname;
	}
	
	public void setSurname(String surname) {
		this.surname = surname;
	}
	
	public Gender getGender() {
		return gender;
	}
	
	public void setGender(Gender gender) {
		this.gender = gender;
	}
	
	public Date getDateOfBirth() {
		return dateOfBirth;
	}
	
	public void setDateOfBirth(Date dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}
	
	public AccountType getAccountType() {
		return accountType;
	}
	
	public void setAccountType(AccountType accountType) {
		this.accountType = accountType;
	}
	
	public boolean isBlocked() {
		return this.isBlocked;
	}
	
	public void setBlocked(boolean isBlocked) {
		this.isBlocked = isBlocked;
	}
	
	public String getJWTToken() {
		return this.jwtToken;
	}
	
	public void setJWTToken(String jwt) {
		this.jwtToken = jwt;
	}
	
	@Override
	public boolean isDeleted() {
		return this.isDeleted;
	}
	
	@Override
	public void setDeleted(boolean deleted) {
		this.isDeleted = deleted;
	}
	
	public String getImage() {
		return image;
	}
	
	public void setImage(String image) {
		this.image = image;
	}
}