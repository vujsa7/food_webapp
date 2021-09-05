package beans;

import java.util.Date;

public class Administrator extends User{
	
	public Administrator() {
		super();
	}
	
	public Administrator(String username, String password, String name, String surname, Gender gender, Date dateOfBirth,
			AccountType accountType, boolean isDeleted, boolean isBlocked,String image) {
		super(username, password, name, surname, gender, dateOfBirth, accountType, isDeleted, isBlocked,image);
		// TODO Auto-generated constructor stub
	}
	
	@Override
	public String getID() {
		// TODO Auto-generated method stub
		return this.getUsername();
	}

	@Override
	public void setID(String id) {
		// TODO Auto-generated method stub
		this.setUsername(id);
	}

	@Override
	public boolean compareTo(String id) {
		// TODO Auto-generated method stub
		boolean isEqual = true;
		if(!this.getUsername().equals(id)) {
			isEqual =  false;
		}
		return isEqual;
	}
	
}