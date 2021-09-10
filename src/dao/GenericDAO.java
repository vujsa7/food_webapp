package dao;

import java.io.IOException;
import java.util.ArrayList;

import com.google.gson.JsonSyntaxException;

public interface GenericDAO<T, ID> {
	ArrayList<T> getAll() throws JsonSyntaxException, IOException;
	ArrayList<T> getAllNotDeleted() throws JsonSyntaxException, IOException;
	T getById(ID id) throws JsonSyntaxException, IOException;
	T create(T entity) throws JsonSyntaxException, IOException;
	T update(T entity) throws JsonSyntaxException, IOException;
	boolean delete(T entity) throws JsonSyntaxException, IOException;
	void save(T entity) throws JsonSyntaxException, IOException;
	void saveAll(ArrayList<T> entities) throws JsonSyntaxException, IOException;
	T updateUsername(T entity, ID newID) throws JsonSyntaxException, IOException;
} 
