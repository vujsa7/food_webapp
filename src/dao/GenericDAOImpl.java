package dao;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.lang.reflect.Type;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.google.gson.stream.JsonReader;

import beans.IIdentifiable;

public class GenericDAOImpl<T extends IIdentifiable<ID>, ID> implements GenericDAO<T, ID> {
	private String path;
	private Type classType;
	private Gson gs;

	public GenericDAOImpl(String path, Type classType, Gson gs) {
		this.path = path;
		this.classType = classType;
		this.gs = gs;
	}
	
	@Override
	public ArrayList<T> getAll() throws JsonSyntaxException, IOException {
		ArrayList<T> allEntities = null;
		try {
			 Files.createFile(Paths.get(path));
		} catch (FileAlreadyExistsException ex) {
			 JsonReader reader = new JsonReader(new InputStreamReader(new FileInputStream(path), "UTF-8"));
			 allEntities = gs.fromJson(reader, classType);
		}
		if (allEntities == null) 
			 return new ArrayList<T>();
		return allEntities;	
	}
	
	@Override
	public ArrayList<T> getAllNotDeleted() throws JsonSyntaxException, IOException {
		ArrayList<T> entities = (ArrayList<T>) getAll();
		ArrayList<T> nonDeleted = new ArrayList<T>();
		for (T entity : entities) {
			if(!entity.isDeleted()) {
				nonDeleted.add(entity);
			}
		}
		return nonDeleted;
	}
	
	@Override
	public T getById(ID id) throws JsonSyntaxException, IOException {
		T searchedEntity = null;
		ArrayList<T> entities = (ArrayList<T>) getAllNotDeleted();
		if(entities.size() != 0) {
			for(T entity : entities) {
				if(entity.compareTo(id)) {
					searchedEntity = entity;
					break;
				}
			}
		}
		return searchedEntity;
	}

	@Override
	public T create(T entity) throws JsonSyntaxException, IOException {
		ArrayList<T> entities = (ArrayList<T>) getAll();
		entities.add(entity);
		saveAll(entities);
		return entity;
	}

	@Override
	public T update(T entity) throws JsonSyntaxException, IOException {		
		ArrayList<T> entities = (ArrayList<T>) getAll();
		for(T el : entities) {
			if(el.compareTo(entity.getID())) {
				entities.set(entities.indexOf(el), entity);
				break;
			}
		}
		saveAll(entities);
		return entity;
	}

	@Override
	public boolean delete(T entity) throws JsonSyntaxException, IOException {
		boolean retVal = false;
		ArrayList<T> entities = (ArrayList<T>) getAll();
		for(T el : entities) {
			if(el.compareTo(entity.getID())) {
				el.setDeleted(true);
				update(el);
				retVal = true;
				break;
			}
		}
		return retVal;
	}

	@Override
	public void save(T entity) throws JsonSyntaxException, IOException {
		ArrayList<T> entities = (ArrayList<T>) getAll();
		entities.add(entity);
		saveAll(entities);
	}

	@Override
	public void saveAll(ArrayList<T> entities) throws FileNotFoundException, UnsupportedEncodingException {
		OutputStream os = new FileOutputStream(path);
		PrintWriter writer = new PrintWriter(new OutputStreamWriter(os, "UTF-8"));
		String allEntities = gs.toJson(entities, classType);
		writer.println(allEntities);
		writer.close();
	}
	
	
}
