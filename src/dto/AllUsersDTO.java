package dto;

import beans.AccountType;
import beans.BuyerType;

public class AllUsersDTO {
	private String username;
	private String name;
	private String surname;
	private AccountType accountType;
	private BuyerType buyerType;
	private String image;
	private boolean isBlocked;
	
	public AllUsersDTO(String username, String name, String surname, AccountType accountType, BuyerType buyerType, String image, boolean isBlocked) {
		super();
		this.username = username;
		this.name = name;
		this.surname = surname;
		this.accountType = accountType;
		this.buyerType = buyerType;
		this.image = image;
		this.isBlocked = isBlocked;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
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
	public AccountType getAccountType() {
		return accountType;
	}
	public void setAccountType(AccountType accountType) {
		this.accountType = accountType;
	}
	public BuyerType getBuyerType() {
		return buyerType;
	}
	public void setBuyerType(BuyerType buyerType) {
		this.buyerType = buyerType;
	}
	public boolean isBlocked() {
		return isBlocked;
	}
	public void setBlocked(boolean isBlocked) {
		this.isBlocked = isBlocked;
	}
	
	public String getImage() {
		return this.image;
	}
	public void setImage(String image) {
		this.image = image;
	}
	
}
