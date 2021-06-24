package dao;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;

import beans.Comment;

public class CommentDAO extends JSONRepository<Comment, Integer>{

	public CommentDAO(String path) {
		super(path, new TypeToken<List<Comment>>(){}.getType(), new Gson());
		// TODO Auto-generated constructor stub
	}
	
	public int generateId() throws JsonSyntaxException, IOException {
		return getAll().size() + 1;
	}
}
