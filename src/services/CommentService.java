package services;

import dao.CommentDAO;

public class CommentService {
	private CommentDAO commentDao;
	
	public CommentService(CommentDAO commentDao) {
		this.commentDao = commentDao;
	}
}
