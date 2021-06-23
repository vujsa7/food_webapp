package dao;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.Type;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;

public class JSONRepository<T, ID> implements IDao<T, ID> {
	private String path;
	private Type classType;
	private Gson gs;
	
	public JSONRepository(String path, Type classType, Gson gs) {
		this.path = path;
		this.classType = classType;
		this.gs = gs;
	}

	@Override
	public List<T> getAll() throws JsonSyntaxException, IOException {
		ArrayList<T> allEntities = gs.fromJson((Files.readAllLines(Paths.get(path), 
				Charset.defaultCharset()).size() == 0) ? "" : 
					Files.readAllLines(Paths.get(path),
							Charset.defaultCharset()).get(0), 
								classType);
		if (allEntities == null) 
			return new ArrayList<T>();
		return  allEntities;
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
	public void saveAll(List<T> entities) throws FileNotFoundException {
		PrintWriter writer = new PrintWriter(path);
		String allEntities = gs.toJson(entities, classType);
		writer.println(allEntities);
		writer.close();
	}

	@Override
	public List<T> getAllNotDeleted() throws JsonSyntaxException, IOException {
		ArrayList<T> entities = (ArrayList<T>) getAll();
		ArrayList<T> nonDeleted = new ArrayList<T>();
		
		for (T entity : entities) {
			if (!entity.isDeleted()) {
				nonDeleted.add(entity);
			}
		}
		return nonDeleted;
	}


}
