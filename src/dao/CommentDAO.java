package dao;

import java.io.IOException;
import java.util.ArrayList;

import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;

import beans.Comment;

public class CommentDAO extends GenericDAOImpl<Comment, Integer>{

	public CommentDAO(String path) {
		super(path, new TypeToken<ArrayList<Comment>>(){}.getType(), new GsonBuilder().setPrettyPrinting().create());
	}
	
	public int generateId() throws JsonSyntaxException, IOException {
		return getAll().size() + 1;
	}
}
