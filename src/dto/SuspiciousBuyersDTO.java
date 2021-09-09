package dto;

import beans.BuyerType;
import beans.SuspiciousCheck;

public class SuspiciousBuyersDTO {
	private String username;
	private String name;
	private String surname;
	private BuyerType buyerType;
	private SuspiciousCheck suspiciousCheck;
	public SuspiciousBuyersDTO(String username, String name, String surname, BuyerType buyerType,
			SuspiciousCheck suspiciousCheck) {
		super();
		this.username = username;
		this.name = name;
		this.surname = surname;
		this.buyerType = buyerType;
		this.suspiciousCheck = suspiciousCheck;
	}
	public String getUsename() {
		return username;
	}
	public void setUsename(String username) {
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
	public BuyerType getAccountType() {
		return buyerType;
	}
	public void setAccountType(BuyerType buyerType) {
		this.buyerType = buyerType;
	}
	public SuspiciousCheck getSuspiciousCheck() {
		return suspiciousCheck;
	}
	public void setSuspiciousCheck(SuspiciousCheck suspiciousCheck) {
		this.suspiciousCheck = suspiciousCheck;
	}
}
