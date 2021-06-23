package beans;

public class Administrator extends User{

	private static final long serialVersionUID = -8978614926861612134L;

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