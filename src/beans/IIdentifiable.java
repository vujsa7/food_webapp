package beans;

public interface IIdentifiable<ID> {
	ID getID();
	void setID(ID id);
	boolean compareTo(ID id);
	void setDeleted(boolean value);
	boolean isDeleted();
}

