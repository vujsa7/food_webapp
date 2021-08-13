package dto;

import java.util.Date;

import beans.AccountType;
import beans.Gender;

public class LoggedInBuyerDTO {
   	private String name;
   	private String surname;
   	private Gender gender;
   	private Date dateOfBirth;
   	private AccountType accountType;
   	
	public LoggedInBuyerDTO(String name, String surname, Gender gender,
			Date dateOfBirth) {
		super();
		this.name = name;
		this.surname = surname;
		this.gender = gender;
		this.dateOfBirth = dateOfBirth;
		this.accountType = AccountType.buyer;
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
}
